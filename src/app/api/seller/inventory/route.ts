import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET inventory status
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { searchParams } = new URL(request.url);
    const lowStockThreshold = parseInt(searchParams.get('threshold') || '10');

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

    // Get all products with inventory
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        stock_quantity,
        price,
        images,
        categories (
          name
        )
      `)
      .order('stock_quantity', { ascending: true });

    if (productsError) {
      console.error('Error fetching inventory:', productsError);
      return NextResponse.json(
        { error: 'Failed to fetch inventory' },
        { status: 500 }
      );
    }

    // Calculate inventory stats
    const stats = {
      totalProducts: products?.length || 0,
      inStock: products?.filter(p => p.stock_quantity > lowStockThreshold).length || 0,
      lowStock: products?.filter(p => p.stock_quantity > 0 && p.stock_quantity <= lowStockThreshold).length || 0,
      outOfStock: products?.filter(p => p.stock_quantity === 0).length || 0,
      totalValue: products?.reduce((sum, p) => sum + (p.stock_quantity * p.price), 0) || 0
    };

    // Categorize products
    const inventory = {
      lowStock: products?.filter(p => p.stock_quantity > 0 && p.stock_quantity <= lowStockThreshold) || [],
      outOfStock: products?.filter(p => p.stock_quantity === 0) || [],
      inStock: products?.filter(p => p.stock_quantity > lowStockThreshold) || []
    };

    return NextResponse.json({
      success: true,
      stats,
      inventory,
      threshold: lowStockThreshold
    });

  } catch (error) {
    console.error('Error in GET /api/seller/inventory:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
