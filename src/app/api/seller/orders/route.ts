import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET all orders for seller
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // pending, processing, shipped, delivered, cancelled
    const source = searchParams.get('source'); // customer, reseller

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

    // First, get all order_items that belong to this seller's products
    const { data: sellerOrderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('order_id')
      .eq('seller_id', userId);

    if (itemsError) {
      console.error('Error fetching seller order items:', itemsError);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    // Extract unique order IDs
    const orderIds = [...new Set(sellerOrderItems?.map(item => item.order_id) || [])];

    // If no orders found, return empty
    if (orderIds.length === 0) {
      return NextResponse.json({
        success: true,
        orders: [],
        stats: {
          total: 0,
          pending: 0,
          processing: 0,
          shipped: 0,
          delivered: 0,
          cancelled: 0,
          totalRevenue: 0
        }
      });
    }

    // Build query for orders
    let query = supabase
      .from('orders')
      .select(`
        *,
        users!orders_user_id_fkey (
          id,
          email
        ),
        order_items (
          id,
          quantity,
          price,
          product_snapshot,
          seller_id
        )
      `)
      .in('id', orderIds)
      .order('created_at', { ascending: false });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (source) {
      query = query.eq('order_source', source);
    }

    const { data: orders, error: ordersError } = await query;

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    // Filter order_items to show only seller's items
    const filteredOrders = orders?.map(order => ({
      ...order,
      order_items: order.order_items?.filter((item: any) => item.seller_id === userId) || []
    }));

    // Calculate summary stats and revenue from seller's items only
    const sellerRevenue = filteredOrders?.reduce((sum, order) => {
      const orderSellerTotal = order.order_items?.reduce((itemSum: number, item: any) => {
        return itemSum + (item.price * item.quantity);
      }, 0) || 0;
      return sum + orderSellerTotal;
    }, 0) || 0;

    const stats = {
      total: filteredOrders?.length || 0,
      pending: filteredOrders?.filter(o => o.status === 'pending').length || 0,
      processing: filteredOrders?.filter(o => o.status === 'processing').length || 0,
      shipped: filteredOrders?.filter(o => o.status === 'shipped').length || 0,
      delivered: filteredOrders?.filter(o => o.status === 'delivered').length || 0,
      cancelled: filteredOrders?.filter(o => o.status === 'cancelled').length || 0,
      totalRevenue: sellerRevenue
    };

    return NextResponse.json({
      success: true,
      orders: filteredOrders || [],
      stats
    });

  } catch (error) {
    console.error('Error in GET /api/seller/orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
