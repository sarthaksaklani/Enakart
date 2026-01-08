// src/app/api/orders/create/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { OrderSource } from '@/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json();

    console.log('\n📦 Creating order with data:', {
      user_id: orderData.user_id,
      items_count: orderData.items?.length,
      total_amount: orderData.total_amount,
      order_source: orderData.order_source,
      has_shipping_address: !!orderData.shipping_address,
    });

    // Validate required fields
    if (!orderData.user_id || !orderData.items || orderData.items.length === 0) {
      console.log('❌ Missing user_id or items');
      return NextResponse.json(
        { success: false, error: 'Missing required order information' },
        { status: 400 }
      );
    }

    if (!orderData.shipping_address) {
      console.log('❌ Missing shipping address');
      return NextResponse.json(
        { success: false, error: 'Shipping address is required' },
        { status: 400 }
      );
    }

    // Set default order source if not provided
    const orderSource = orderData.order_source || 'customer';

    // Validate order source if provided
    if (!['customer', 'reseller'].includes(orderSource)) {
      console.log(`❌ Invalid order source: ${orderSource}`);
      return NextResponse.json(
        { success: false, error: 'Invalid order source. Must be "customer" or "reseller"' },
        { status: 400 }
      );
    }

    console.log(`✅ Order source set to: ${orderSource}`);

    // Step 1: Validate stock availability for all items
    console.log('🔍 Checking stock availability...');
    for (const item of orderData.items) {
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('stock_quantity, name')
        .eq('id', item.product_id)
        .single();

      if (productError || !product) {
        console.log(`❌ Product not found: ${item.product_id}`);
        return NextResponse.json(
          { success: false, error: `Product not found: ${item.product_name || item.product_id}` },
          { status: 404 }
        );
      }

      if (product.stock_quantity < item.quantity) {
        console.log(`❌ Insufficient stock for: ${product.name}`);
        return NextResponse.json(
          { success: false, error: `Insufficient stock for ${product.name}. Available: ${product.stock_quantity}` },
          { status: 400 }
        );
      }
    }
    console.log('✅ All items in stock');

    // Step 2: Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Step 3: Create order in database
    console.log('💾 Creating order in database...');
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: orderData.user_id,
        order_source: orderSource,
        status: 'pending',
        payment_status: 'pending',
        subtotal: orderData.subtotal,
        tax_amount: orderData.tax || 0,
        shipping_amount: 0,
        discount_amount: 0,
        total_amount: orderData.total_amount,
        shipping_address: orderData.shipping_address,
        payment_method: null,
      })
      .select()
      .single();

    if (orderError) {
      console.error('❌ Order creation error:', orderError);

      // Check for network errors
      const errorMessage = orderError.message?.toLowerCase() || '';
      if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
        return NextResponse.json(
          { success: false, error: 'Network error. Please check your internet connection.' },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Failed to create order in database' },
        { status: 500 }
      );
    }

    console.log(`✅ Order created with ID: ${newOrder.id}`);

    // Step 4: Create order items
    console.log('💾 Creating order items...');
    const orderItems = orderData.items.map((item: any) => ({
      order_id: newOrder.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_image: item.product_image,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
      lens_prescription: item.prescription_file || null,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('❌ Order items creation error:', itemsError);
      // Rollback: Delete the order
      await supabase.from('orders').delete().eq('id', newOrder.id);

      return NextResponse.json(
        { success: false, error: 'Failed to create order items' },
        { status: 500 }
      );
    }

    console.log(`✅ Created ${orderItems.length} order items`);

    // Step 5: Update product stock quantities
    console.log('📉 Updating product stock...');
    for (const item of orderData.items) {
      const { error: stockError } = await supabase.rpc('decrement_stock', {
        product_id: item.product_id,
        quantity: item.quantity
      });

      // If RPC doesn't exist, use manual update
      if (stockError) {
        const { error: updateError } = await supabase
          .from('products')
          .update({
            stock_quantity: supabase.raw(`stock_quantity - ${item.quantity}`)
          })
          .eq('id', item.product_id);

        if (updateError) {
          console.warn(`⚠️ Stock update warning for product ${item.product_id}:`, updateError);
        }
      }
    }
    console.log('✅ Stock quantities updated');

    // Step 6: Clear user's cart
    console.log('🗑️ Clearing cart...');
    const { data: userCart } = await supabase
      .from('cart')
      .select('id')
      .eq('user_id', orderData.user_id)
      .single();

    if (userCart) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', userCart.id);

      console.log('✅ Cart cleared');
    }

    // Log order for development
    console.log('✅ Order created successfully:', {
      order_number: orderNumber,
      order_id: newOrder.id,
      total: orderData.total_amount,
      items_count: orderData.items.length,
      order_source: orderSource,
    });
    console.log(''); // Empty line for readability

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      data: {
        order_id: newOrder.id,
        order_number: orderNumber,
        order: newOrder,
      },
    });
  } catch (error: any) {
    console.error('❌ Order creation error:', error);

    // Handle network errors
    const errorMessage = error?.message?.toLowerCase() || '';
    if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
      return NextResponse.json(
        { success: false, error: 'Network error. Please check your internet connection.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
