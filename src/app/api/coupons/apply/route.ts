// src/app/api/coupons/apply/route.ts
// Apply coupon to order (record usage)

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST - Record coupon usage after order creation
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { coupon_id, order_id, discount_amount } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 401 }
      );
    }

    if (!coupon_id || !order_id || !discount_amount) {
      return NextResponse.json(
        { success: false, error: 'coupon_id, order_id, and discount_amount are required' },
        { status: 400 }
      );
    }

    console.log(`\n🎟️ Recording coupon usage for order: ${order_id}`);

    // Record coupon usage
    const { error: usageError } = await supabase
      .from('coupon_usage')
      .insert({
        coupon_id,
        user_id: userId,
        order_id,
        discount_amount,
      });

    if (usageError) {
      console.error('❌ Coupon usage error:', usageError);

      const errorMessage = usageError.message?.toLowerCase() || '';
      if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
        return NextResponse.json(
          { success: false, error: 'Network error. Please check your internet connection.' },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Failed to record coupon usage' },
        { status: 500 }
      );
    }

    // Increment coupon usage count
    // First fetch the current usage count
    const { data: currentCoupon, error: fetchError } = await supabase
      .from('coupons')
      .select('usage_count')
      .eq('id', coupon_id)
      .single();

    if (fetchError) {
      console.warn('⚠️ Failed to fetch coupon for count update:', fetchError);
    } else {
      // Then increment it
      const { error: updateError } = await supabase
        .from('coupons')
        .update({
          usage_count: (currentCoupon.usage_count || 0) + 1
        })
        .eq('id', coupon_id);

      if (updateError) {
        console.warn('⚠️ Failed to update coupon count:', updateError);
      }
    }

    console.log(`✅ Coupon usage recorded\n`);

    return NextResponse.json({
      success: true,
      message: 'Coupon applied successfully',
    });
  } catch (error: any) {
    console.error('❌ Coupon apply error:', error);

    const errorMessage = error?.message?.toLowerCase() || '';
    if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
      return NextResponse.json(
        { success: false, error: 'Network error. Please check your internet connection.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to apply coupon' },
      { status: 500 }
    );
  }
}
