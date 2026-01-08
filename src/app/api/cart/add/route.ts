// src/app/api/cart/add/route.ts
// Add item to cart

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const body = await request.json();
    const { product_id, quantity, lens_type, lens_prescription, lens_coating, lens_price } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 401 }
      );
    }

    if (!product_id || !quantity) {
      return NextResponse.json(
        { success: false, error: 'Product ID and quantity required' },
        { status: 400 }
      );
    }

    // Get product price
    const { data: product } = await supabase
      .from('products')
      .select('price')
      .eq('id', product_id)
      .single();

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get or create cart
    let { data: cart } = await supabase
      .from('cart')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!cart) {
      const { data: newCart } = await supabase
        .from('cart')
        .insert({ user_id: userId })
        .select('id')
        .single();
      cart = newCart;
    }

    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cart?.id)
      .eq('product_id', product_id)
      .single();

    if (existingItem) {
      // Update quantity
      const { data: updated, error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id)
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { success: false, error: 'Failed to update cart' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Cart updated',
        item: updated,
      });
    }

    // Add new item
    const { data: newItem, error } = await supabase
      .from('cart_items')
      .insert({
        cart_id: cart?.id,
        product_id,
        quantity,
        price: product.price,
        lens_type,
        lens_prescription,
        lens_coating,
        lens_price: lens_price || 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Add to cart error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to add to cart' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Item added to cart',
      item: newItem,
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}
