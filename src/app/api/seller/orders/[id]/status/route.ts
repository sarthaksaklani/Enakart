import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// PUT - Update order status
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
    const { status, tracking_number } = body;

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') },
        { status: 400 }
      );
    }

    console.log(`\n📦 Updating order ${id} status to: ${status}`);

    // Prepare update data
    const updateData: any = {
      status,
    };

    // Add timestamp for shipped status
    if (status === 'shipped') {
      updateData.shipped_at = new Date().toISOString();
      if (tracking_number) {
        updateData.tracking_number = tracking_number;
        console.log(`📮 Tracking number: ${tracking_number}`);
      }
    }

    // Add timestamp for delivered status
    if (status === 'delivered') {
      updateData.delivered_at = new Date().toISOString();
    }

    // Update order status
    const { data: order, error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error updating order status:', updateError);

      // Check for network errors
      const errorMessage = updateError.message?.toLowerCase() || '';
      if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
        return NextResponse.json(
          { error: 'Network error. Please check your internet connection.' },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to update order status' },
        { status: 500 }
      );
    }

    console.log(`✅ Order status updated to ${status}\n`);

    // TODO: Create notification for customer
    // You can add notification creation here

    return NextResponse.json({
      success: true,
      order,
      message: `Order status updated to ${status}`
    });

  } catch (error: any) {
    console.error('❌ Error in PUT /api/seller/orders/[id]/status:', error);

    // Handle network errors
    const errorMessage = error?.message?.toLowerCase() || '';
    if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
      return NextResponse.json(
        { error: 'Network error. Please check your internet connection.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
