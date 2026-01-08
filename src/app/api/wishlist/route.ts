// src/app/api/wishlist/route.ts
// Wishlist management APIs

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Get user's wishlist
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 401 }
      );
    }

    console.log(`\n💝 Fetching wishlist for user: ${userId}`);

    // Get wishlist with product details
    const { data: wishlistItems, error } = await supabase
      .from('wishlist')
      .select(`
        id,
        created_at,
        product:products (
          id,
          name,
          slug,
          price,
          original_price,
          images,
          brand,
          stock_quantity,
          is_in_stock,
          category:categories (
            id,
            name,
            slug
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Wishlist fetch error:', error);

      const errorMessage = error.message?.toLowerCase() || '';
      if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
        return NextResponse.json(
          { success: false, error: 'Network error. Please check your internet connection.' },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Failed to fetch wishlist' },
        { status: 500 }
      );
    }

    console.log(`✅ Found ${wishlistItems?.length || 0} items in wishlist\n`);

    return NextResponse.json({
      success: true,
      items: wishlistItems || [],
      count: wishlistItems?.length || 0,
    });
  } catch (error: any) {
    console.error('❌ Wishlist GET error:', error);

    const errorMessage = error?.message?.toLowerCase() || '';
    if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
      return NextResponse.json(
        { success: false, error: 'Network error. Please check your internet connection.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

// POST - Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { product_id } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 401 }
      );
    }

    if (!product_id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    console.log(`\n💝 Adding product ${product_id} to wishlist`);

    // Check if product exists
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, name')
      .eq('id', product_id)
      .single();

    if (productError || !product) {
      console.log('❌ Product not found');
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Add to wishlist (unique constraint will prevent duplicates)
    const { data: wishlistItem, error: insertError } = await supabase
      .from('wishlist')
      .insert({
        user_id: userId,
        product_id: product_id,
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Wishlist insert error:', insertError);

      // Check if already in wishlist
      if (insertError.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'Product already in wishlist' },
          { status: 400 }
        );
      }

      const errorMessage = insertError.message?.toLowerCase() || '';
      if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
        return NextResponse.json(
          { success: false, error: 'Network error. Please check your internet connection.' },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Failed to add to wishlist' },
        { status: 500 }
      );
    }

    console.log(`✅ Added ${product.name} to wishlist\n`);

    return NextResponse.json({
      success: true,
      message: 'Added to wishlist',
      item: wishlistItem,
    });
  } catch (error: any) {
    console.error('❌ Wishlist POST error:', error);

    const errorMessage = error?.message?.toLowerCase() || '';
    if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
      return NextResponse.json(
        { success: false, error: 'Network error. Please check your internet connection.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to add to wishlist' },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { product_id } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 401 }
      );
    }

    if (!product_id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    console.log(`\n💔 Removing product ${product_id} from wishlist`);

    const { error: deleteError } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', product_id);

    if (deleteError) {
      console.error('❌ Wishlist delete error:', deleteError);

      const errorMessage = deleteError.message?.toLowerCase() || '';
      if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
        return NextResponse.json(
          { success: false, error: 'Network error. Please check your internet connection.' },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Failed to remove from wishlist' },
        { status: 500 }
      );
    }

    console.log('✅ Removed from wishlist\n');

    return NextResponse.json({
      success: true,
      message: 'Removed from wishlist',
    });
  } catch (error: any) {
    console.error('❌ Wishlist DELETE error:', error);

    const errorMessage = error?.message?.toLowerCase() || '';
    if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
      return NextResponse.json(
        { success: false, error: 'Network error. Please check your internet connection.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to remove from wishlist' },
      { status: 500 }
    );
  }
}
