// src/app/api/reviews/route.ts
// Product reviews and ratings APIs

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Get reviews for a product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product_id');
    const userId = searchParams.get('user_id');

    console.log(`\n⭐ Fetching reviews...`);

    let query = supabase
      .from('reviews')
      .select(`
        id,
        rating,
        title,
        comment,
        images,
        is_verified_purchase,
        helpful_count,
        created_at,
        user:users (
          id,
          full_name
        ),
        product:products (
          id,
          name
        )
      `)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (productId) {
      query = query.eq('product_id', productId);
      console.log(`📦 For product: ${productId}`);
    }

    if (userId) {
      query = query.eq('user_id', userId);
      console.log(`👤 By user: ${userId}`);
    }

    const { data: reviews, error } = await query;

    if (error) {
      console.error('❌ Reviews fetch error:', error);

      const errorMessage = error.message?.toLowerCase() || '';
      if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
        return NextResponse.json(
          { success: false, error: 'Network error. Please check your internet connection.' },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Failed to fetch reviews' },
        { status: 500 }
      );
    }

    console.log(`✅ Found ${reviews?.length || 0} reviews\n`);

    // Calculate average rating if product_id provided
    let averageRating = null;
    if (productId && reviews && reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      averageRating = (totalRating / reviews.length).toFixed(1);
    }

    return NextResponse.json({
      success: true,
      reviews: reviews || [],
      count: reviews?.length || 0,
      averageRating,
    });
  } catch (error: any) {
    console.error('❌ Reviews GET error:', error);

    const errorMessage = error?.message?.toLowerCase() || '';
    if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
      return NextResponse.json(
        { success: false, error: 'Network error. Please check your internet connection.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST - Create a new review
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { product_id, order_id, rating, title, comment, images } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 401 }
      );
    }

    console.log(`\n⭐ Creating review for product: ${product_id}`);

    // Validate required fields
    if (!product_id || !rating) {
      return NextResponse.json(
        { success: false, error: 'Product ID and rating are required' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if user already reviewed this product
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', product_id)
      .maybeSingle();

    if (existingReview) {
      return NextResponse.json(
        { success: false, error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    // Check if this is a verified purchase
    let isVerifiedPurchase = false;
    if (order_id) {
      const { data: orderItem } = await supabase
        .from('order_items')
        .select('id, order:orders(user_id, status)')
        .eq('product_id', product_id)
        .eq('order_id', order_id)
        .maybeSingle();

      if (orderItem && orderItem.order) {
        // orderItem.order is an array due to Supabase join structure
        const order = Array.isArray(orderItem.order) ? orderItem.order[0] : orderItem.order;
        if (order && order.user_id === userId) {
          isVerifiedPurchase = true;
        }
      }
    }

    // Create review
    const { data: review, error: insertError } = await supabase
      .from('reviews')
      .insert({
        user_id: userId,
        product_id,
        order_id: order_id || null,
        rating,
        title: title || null,
        comment: comment || null,
        images: images || [],
        is_verified_purchase: isVerifiedPurchase,
        is_approved: false, // Requires admin approval
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Review creation error:', insertError);

      const errorMessage = insertError.message?.toLowerCase() || '';
      if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
        return NextResponse.json(
          { success: false, error: 'Network error. Please check your internet connection.' },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Failed to create review' },
        { status: 500 }
      );
    }

    console.log(`✅ Review created (Rating: ${rating}/5)\n`);

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully. It will be published after approval.',
      review,
    }, { status: 201 });
  } catch (error: any) {
    console.error('❌ Review POST error:', error);

    const errorMessage = error?.message?.toLowerCase() || '';
    if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
      return NextResponse.json(
        { success: false, error: 'Network error. Please check your internet connection.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

// PUT - Update a review
export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { review_id, rating, title, comment, images } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 401 }
      );
    }

    if (!review_id) {
      return NextResponse.json(
        { success: false, error: 'Review ID is required' },
        { status: 400 }
      );
    }

    console.log(`\n✏️ Updating review: ${review_id}`);

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Update review
    const updateData: any = {};
    if (rating) updateData.rating = rating;
    if (title !== undefined) updateData.title = title;
    if (comment !== undefined) updateData.comment = comment;
    if (images !== undefined) updateData.images = images;
    updateData.is_approved = false; // Reset approval on edit

    const { data: review, error: updateError } = await supabase
      .from('reviews')
      .update(updateData)
      .eq('id', review_id)
      .eq('user_id', userId) // Ensure user owns the review
      .select()
      .single();

    if (updateError) {
      console.error('❌ Review update error:', updateError);

      const errorMessage = updateError.message?.toLowerCase() || '';
      if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
        return NextResponse.json(
          { success: false, error: 'Network error. Please check your internet connection.' },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Failed to update review' },
        { status: 500 }
      );
    }

    console.log('✅ Review updated\n');

    return NextResponse.json({
      success: true,
      message: 'Review updated successfully. It will be re-reviewed for approval.',
      review,
    });
  } catch (error: any) {
    console.error('❌ Review PUT error:', error);

    const errorMessage = error?.message?.toLowerCase() || '';
    if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
      return NextResponse.json(
        { success: false, error: 'Network error. Please check your internet connection.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update review' },
      { status: 500 }
    );
  }
}
