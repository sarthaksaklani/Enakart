// src/app/api/orders/return/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { order_id, user_id, reason, return_items } = await req.json();

    console.log(`\n↩️ Processing return request for order: ${order_id}`);

    if (!order_id) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Step 1: Fetch order and verify ownership
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
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

    // Step 2: Check if order is eligible for return
    if (order.status !== 'delivered') {
      console.log(`❌ Order not delivered yet. Status: ${order.status}`);
      return NextResponse.json(
        {
          success: false,
          error: 'This order cannot be returned as it has not been delivered yet',
        },
        { status: 400 }
      );
    }

    // Check return window (14 days)
    const deliveredDate = new Date(order.delivered_at);
    const currentDate = new Date();
    const daysSinceDelivery = Math.floor(
      (currentDate.getTime() - deliveredDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceDelivery > 14) {
      console.log(`❌ Return window expired. Days since delivery: ${daysSinceDelivery}`);
      return NextResponse.json(
        {
          success: false,
          error: 'Return window has expired. Returns are only accepted within 14 days of delivery',
        },
        { status: 400 }
      );
    }

    console.log('✅ Order eligible for return');

    // Step 3: Generate return authorization number
    const returnAuthNumber = `RET-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Step 4: Update order status to 'returned'
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'returned',
        admin_notes: reason
          ? `Return requested by customer. Reason: ${reason}. Auth: ${returnAuthNumber}`
          : `Return requested by customer. Auth: ${returnAuthNumber}`,
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
        { success: false, error: 'Failed to process return request' },
        { status: 500 }
      );
    }

    console.log('✅ Order status updated to returned');

    // Step 5: Update payment status for refund
    if (order.payment_status === 'paid') {
      await supabase
        .from('orders')
        .update({
          payment_status: 'refunded'
        })
        .eq('id', order_id);

      console.log('💰 Refund status updated');
    }

    console.log('✅ Return request submitted successfully\n');

    return NextResponse.json({
      success: true,
      message: 'Return request submitted successfully',
      data: {
        order_id,
        status: 'returned',
        return_auth_number: returnAuthNumber,
        pickup_eta: 'Within 24-48 hours',
        refund_policy: 'Refund will be initiated after product inspection (5-7 business days)',
        refund_amount: order.total_amount,
      },
    });
  } catch (error: any) {
    console.error('❌ Return request error:', error);

    // Handle network errors
    const errorMessage = error?.message?.toLowerCase() || '';
    if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
      return NextResponse.json(
        { success: false, error: 'Network error. Please check your internet connection.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to submit return request' },
      { status: 500 }
    );
  }
}
