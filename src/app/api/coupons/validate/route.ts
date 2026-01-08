// src/app/api/coupons/validate/route.ts
// Coupon validation and application

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST - Validate and apply a coupon
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { code, order_amount } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 401 }
      );
    }

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    if (!order_amount || order_amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid order amount is required' },
        { status: 400 }
      );
    }

    console.log(`\n🎟️ Validating coupon: ${code.toUpperCase()}`);

    // Fetch coupon
    const { data: coupon, error: fetchError } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (fetchError || !coupon) {
      console.log('❌ Invalid coupon code');
      return NextResponse.json(
        { success: false, error: 'Invalid coupon code' },
        { status: 404 }
      );
    }

    // Check if coupon is active
    if (!coupon.is_active) {
      console.log('❌ Coupon is inactive');
      return NextResponse.json(
        { success: false, error: 'This coupon is no longer active' },
        { status: 400 }
      );
    }

    // Check validity dates
    const now = new Date();
    if (coupon.valid_from && new Date(coupon.valid_from) > now) {
      console.log('❌ Coupon not yet valid');
      return NextResponse.json(
        { success: false, error: 'This coupon is not yet valid' },
        { status: 400 }
      );
    }

    if (coupon.valid_until && new Date(coupon.valid_until) < now) {
      console.log('❌ Coupon expired');
      return NextResponse.json(
        { success: false, error: 'This coupon has expired' },
        { status: 400 }
      );
    }

    // Check minimum purchase amount
    if (coupon.min_purchase_amount && order_amount < coupon.min_purchase_amount) {
      console.log(`❌ Order amount too low. Minimum: ₹${coupon.min_purchase_amount}`);
      return NextResponse.json(
        {
          success: false,
          error: `Minimum purchase amount of ₹${coupon.min_purchase_amount} required`
        },
        { status: 400 }
      );
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      console.log('❌ Coupon usage limit reached');
      return NextResponse.json(
        { success: false, error: 'This coupon has reached its usage limit' },
        { status: 400 }
      );
    }

    // Check user usage limit
    const { data: userUsage } = await supabase
      .from('coupon_usage')
      .select('id')
      .eq('coupon_id', coupon.id)
      .eq('user_id', userId);

    if (userUsage && userUsage.length >= (coupon.user_limit || 1)) {
      console.log('❌ User usage limit reached');
      return NextResponse.json(
        { success: false, error: 'You have already used this coupon' },
        { status: 400 }
      );
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discount_type === 'percentage') {
      discountAmount = (order_amount * coupon.discount_value) / 100;

      // Apply max discount if set
      if (coupon.max_discount_amount && discountAmount > coupon.max_discount_amount) {
        discountAmount = coupon.max_discount_amount;
      }
    } else {
      // Fixed amount discount
      discountAmount = Math.min(coupon.discount_value, order_amount);
    }

    discountAmount = Math.round(discountAmount * 100) / 100; // Round to 2 decimals

    console.log(`✅ Coupon valid! Discount: ₹${discountAmount}\n`);

    return NextResponse.json({
      success: true,
      message: 'Coupon applied successfully',
      coupon: {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
      },
      discount_amount: discountAmount,
      final_amount: order_amount - discountAmount,
    });
  } catch (error: any) {
    console.error('❌ Coupon validation error:', error);

    const errorMessage = error?.message?.toLowerCase() || '';
    if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
      return NextResponse.json(
        { success: false, error: 'Network error. Please check your internet connection.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}
