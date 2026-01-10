import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET all products for seller
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - User ID required' },
        { status: 401 }
      );
    }

    // Verify user is a seller
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (userError || user?.role !== 'seller') {
      return NextResponse.json(
        { error: 'Unauthorized - Seller access only' },
        { status: 403 }
      );
    }

    // Get seller's products only (exclude soft-deleted products)
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq('seller_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (productsError) {
      console.error('Error fetching products:', productsError);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      products: products || []
    });

  } catch (error) {
    console.error('Error in GET /api/seller/products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add new product
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - User ID required' },
        { status: 401 }
      );
    }

    // Verify user is a seller
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (userError || user?.role !== 'seller') {
      return NextResponse.json(
        { error: 'Unauthorized - Seller access only' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      price,
      category_id,
      stock_quantity,
      images,
      brand,
      frame_material,
      frame_shape,
      lens_type,
      gender,
      is_featured,
      is_new,
      is_trending
    } = body;

    // Validate required fields
    if (!name || !price || !category_id || stock_quantity === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, price, category_id, stock_quantity' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      + '-' + Date.now();

    // Insert product
    const { data: product, error: insertError } = await supabase
      .from('products')
      .insert({
        name,
        slug,
        description,
        price,
        category_id,
        stock_quantity,
        images: images || [],
        brand,
        frame_material,
        frame_shape,
        lens_type,
        gender,
        is_featured: is_featured || false,
        is_new_arrival: is_new || false,
        is_trending: is_trending || false,
        seller_id: userId, // Track which seller uploaded this product
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating product:', insertError);
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      product
    }, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/seller/products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
