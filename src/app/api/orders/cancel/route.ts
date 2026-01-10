// src/app/api/orders/cancel/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { order_id, user_id, reason } = await req.json();

    console.log(`\n🚫 Cancelling order: ${order_id}`);

    if (!order_id) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Step 1: Fetch order and verify ownership
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', order_id)
      .eq('user_id', user_id)
      .single();

    if (fetchError || !order) {
      console.log('❌ Order not found');
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Step 2: Check if order can be cancelled
    const cancellableStatuses = ['pending', 'confirmed', 'processing'];
    if (!cancellableStatuses.includes(order.status)) {
      console.log(`❌ Cannot cancel order with status: ${order.status}`);
      return NextResponse.json(
        {
          success: false,
          error: `This order cannot be cancelled as it is already ${order.status}`,
        },
        { status: 400 }
      );
    }

    console.log('✅ Order can be cancelled');

    // Step 3: Update order status to cancelled
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        admin_notes: reason ? `Cancelled by customer. Reason: ${reason}` : 'Cancelled by customer',
      })
      .eq('id', order_id);

    if (updateError) {
      console.error('❌ Failed to update order status:', updateError);

      // Check for network errors
      const errorMessage = updateError.message?.toLowerCase() || '';
      if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
        return NextResponse.json(
          { success: false, error: 'Network error. Please check your internet connection.' },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Failed to cancel order' },
        { status: 500 }
      );
    }

    console.log('✅ Order status updated to cancelled');

    // Step 4: Restore product stock
    console.log('📈 Restoring product stock...');
    for (const item of order.order_items) {
      // First fetch current stock
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('stock_quantity')
        .eq('id', item.product_id)
        .single();

      if (fetchError) {
        console.warn(`⚠️ Stock fetch warning for product ${item.product_id}:`, fetchError);
        continue;
      }

      // Then update with new quantity
      const { error: stockError } = await supabase
        .from('products')
        .update({
          stock_quantity: (product.stock_quantity || 0) + item.quantity
        })
        .eq('id', item.product_id);

      if (stockError) {
        console.warn(`⚠️ Stock restoration warning for product ${item.product_id}:`, stockError);
      }
    }
    console.log('✅ Stock restored');

    // Step 5: Handle refund for paid orders
    let refundStatus = null;
    if (order.payment_status === 'paid') {
      // Update payment status to refunded
      await supabase
        .from('orders')
        .update({
          payment_status: 'refunded'
        })
        .eq('id', order_id);

      refundStatus = {
        status: 'initiated',
        eta: '5-7 business days',
        amount: order.total_amount,
      };

      console.log('💰 Refund initiated');
    }

    console.log('✅ Order cancelled successfully\n');

    return NextResponse.json({
      success: true,
      message: 'Order cancelled successfully',
      data: {
        order_id,
        status: 'cancelled',
        refund: refundStatus,
      },
    });
  } catch (error: any) {
    console.error('❌ Order cancellation error:', error);

    // Handle network errors
    const errorMessage = error?.message?.toLowerCase() || '';
    if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
      return NextResponse.json(
        { success: false, error: 'Network error. Please check your internet connection.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to cancel order' },
      { status: 500 }
    );
  }
}
