// src/app/api/cart/route.ts
// Get user's cart

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 401 }
      );
    }

    // Get or create cart for user
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

    // Get cart items with product details
    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products (
          id,
          name,
          slug,
          price,
          original_price,
          featured_image,
          brand,
          stock_quantity,
          is_in_stock
        )
      `)
      .eq('cart_id', cart?.id);

    if (error) {
      console.error('Cart fetch error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch cart' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      cart: {
        id: cart?.id,
        items: cartItems || [],
      },
    });
  } catch (error) {
    console.error('Cart error:', error);
    return NextResponse.json(
      { success: false, error: 'Cart operation failed' },
      { status: 500 }
    );
  }
}
