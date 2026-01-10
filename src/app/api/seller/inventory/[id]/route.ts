import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// PUT - Update product stock
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    const { stock_quantity, action } = body;

    if (action && !['set', 'add', 'subtract'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be: set, add, or subtract' },
        { status: 400 }
      );
    }

    // Get current stock and verify ownership
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('stock_quantity, seller_id')
      .eq('id', id)
      .single();

    if (productError) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Verify product belongs to seller
    if (product.seller_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized - You can only update your own products' },
        { status: 403 }
      );
    }

    // Calculate new stock based on action
    let newStock = stock_quantity;
    if (action === 'add') {
      newStock = product.stock_quantity + stock_quantity;
    } else if (action === 'subtract') {
      newStock = Math.max(0, product.stock_quantity - stock_quantity);
    }

    // Update stock
    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update({
        stock_quantity: newStock,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating stock:', updateError);
      return NextResponse.json(
        { error: 'Failed to update stock' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: `Stock updated from ${product.stock_quantity} to ${newStock}`
    });

  } catch (error) {
    console.error('Error in PUT /api/seller/inventory/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
