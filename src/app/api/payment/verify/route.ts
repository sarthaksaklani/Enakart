// src/app/api/payment/verify/route.ts
// Verify Razorpay payment

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id, testMode } = body;

    console.log('🔍 Verifying payment:', {
      razorpay_order_id,
      razorpay_payment_id,
      order_id,
      testMode
    });

    // If not in test mode and credentials exist, verify signature
    if (!testMode && process.env.RAZORPAY_KEY_SECRET) {
      const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

      if (generated_signature !== razorpay_signature) {
        console.error('❌ Invalid payment signature');
        return NextResponse.json(
          { success: false, error: 'Invalid payment signature' },
          { status: 400 }
        );
      }

      console.log('✅ Payment signature verified');
    } else {
      console.log('⚠️ Test mode - skipping signature verification');
    }

    // Get order details
    const { data: orderData, error: orderFetchError } = await supabase
      .from('orders')
      .select('user_id, total_amount')
      .eq('id', order_id)
      .single();

    if (orderFetchError || !orderData) {
      console.error('❌ Order not found:', orderFetchError);
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order payment status
    const { error: orderError } = await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        status: 'confirmed',
      })
      .eq('id', order_id);

    if (orderError) {
      console.error('❌ Order update error:', orderError);

      // Check for network errors
      const errorMessage = orderError.message?.toLowerCase() || '';
      if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
        return NextResponse.json(
          { success: false, error: 'Network error. Please check your internet connection.' },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Failed to update order' },
        { status: 500 }
      );
    }

    console.log('✅ Order status updated to confirmed');

    // Create payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        order_id,
        user_id: orderData.user_id,
        amount: orderData.total_amount,
        currency: 'INR',
        payment_method: 'razorpay',
        payment_gateway: 'razorpay',
        transaction_id: razorpay_payment_id,
        gateway_payment_id: razorpay_payment_id,
        gateway_order_id: razorpay_order_id,
        status: 'completed',
        completed_at: new Date().toISOString(),
      });

    if (paymentError) {
      console.error('⚠️ Payment record error (non-critical):', paymentError);
    } else {
      console.log('✅ Payment record created');
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
    });
  } catch (error: any) {
    console.error('❌ Payment verification error:', error);

    // Handle network errors
    const errorMessage = error?.message?.toLowerCase() || '';
    if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
      return NextResponse.json(
        { success: false, error: 'Network error. Please check your internet connection.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
