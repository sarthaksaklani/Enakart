// src/app/api/payment/create-order/route.ts
// Create Razorpay order

import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency, order_id } = body;

    console.log('💰 Creating Razorpay order:', { amount, currency, order_id });

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Check if Razorpay credentials are configured
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.warn('⚠️ Razorpay credentials not configured, using test mode');

      // Return mock data for testing when credentials are not set
      const mockRazorpayOrder = {
        id: `order_${Date.now()}`,
        entity: 'order',
        amount: amount * 100,
        amount_paid: 0,
        amount_due: amount * 100,
        currency: currency || 'INR',
        receipt: order_id,
        status: 'created',
        attempts: 0,
        created_at: Math.floor(Date.now() / 1000),
      };

      return NextResponse.json({
        success: true,
        order: mockRazorpayOrder,
        testMode: true,
      });
    }

    // Initialize Razorpay with credentials
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: currency || 'INR',
      receipt: order_id,
      notes: {
        order_id: order_id,
      },
    });

    console.log('✅ Razorpay order created:', razorpayOrder.id);

    return NextResponse.json({
      success: true,
      order: razorpayOrder,
      testMode: false,
    });
  } catch (error: any) {
    console.error('❌ Payment order creation error:', error);

    // Handle network errors
    const errorMessage = error?.message?.toLowerCase() || '';
    if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
      return NextResponse.json(
        { success: false, error: 'Network error. Please check your internet connection.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
