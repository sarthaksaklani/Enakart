import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET analytics data
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month'; // day, week, month, year

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

    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    console.log(`\n📊 Fetching analytics for period: ${period}`);

    // Step 1: Get all order_items that belong to this seller's products
    const { data: sellerOrderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('order_id')
      .eq('seller_id', userId);

    if (itemsError) {
      console.error('❌ Error fetching seller order items:', itemsError);
      return NextResponse.json(
        { error: 'Failed to fetch seller orders' },
        { status: 500 }
      );
    }

    // Extract unique order IDs
    const orderIds = [...new Set(sellerOrderItems?.map(item => item.order_id) || [])];

    // If no orders, return empty analytics
    if (orderIds.length === 0) {
      return NextResponse.json({
        success: true,
        analytics: {
          revenue: { total: 0, growth: 0, avgOrderValue: 0 },
          orders: { total: 0, completed: 0, pending: 0, processing: 0, cancelled: 0 },
          products: { total: 0, inStock: 0, outOfStock: 0 },
          salesByCategory: {},
          topProducts: [],
          dailySales: {},
          period
        }
      });
    }

    // Step 2: Get orders for the period (only seller's orders)
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_id,
          product_name,
          quantity,
          unit_price,
          total_price,
          seller_id
        )
      `)
      .in('id', orderIds)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('❌ Error fetching orders:', ordersError);

      const errorMessage = ordersError.message?.toLowerCase() || '';
      if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
        return NextResponse.json(
          { error: 'Network error. Please check your internet connection.' },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to fetch analytics data' },
        { status: 500 }
      );
    }

    // Filter orders to only include seller's items
    const filteredOrders = orders?.map(order => ({
      ...order,
      order_items: order.order_items?.filter((item: any) => item.seller_id === userId) || []
    }));

    // Get only seller's products for product stats
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        stock_quantity,
        category:categories (
          id,
          name
        )
      `)
      .eq('seller_id', userId)
      .eq('is_active', true);

    if (productsError) {
      console.error('⚠️ Error fetching products:', productsError);
    }

    // Create product lookup map
    const productMap = new Map();
    if (products) {
      products.forEach((p: any) => {
        productMap.set(p.id, {
          name: p.name,
          category: p.category?.name || 'Uncategorized'
        });
      });
    }

    // Calculate analytics from seller's items only
    const completedOrders = filteredOrders?.filter(o => o.status === 'delivered') || [];

    // Calculate revenue from seller's items only
    const totalRevenue = completedOrders.reduce((sum, order) => {
      const orderSellerRevenue = order.order_items?.reduce((itemSum: number, item: any) => {
        return itemSum + (item.total_price || (item.unit_price * item.quantity));
      }, 0) || 0;
      return sum + orderSellerRevenue;
    }, 0);

    const totalOrders = filteredOrders?.length || 0;
    const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

    console.log(`💰 Total Revenue: ₹${totalRevenue}`);
    console.log(`📦 Total Orders: ${totalOrders}`);

    // Calculate previous period for growth
    const prevStartDate = new Date(startDate);
    switch (period) {
      case 'day':
        prevStartDate.setDate(prevStartDate.getDate() - 1);
        break;
      case 'week':
        prevStartDate.setDate(prevStartDate.getDate() - 7);
        break;
      case 'month':
        prevStartDate.setMonth(prevStartDate.getMonth() - 1);
        break;
      case 'year':
        prevStartDate.setFullYear(prevStartDate.getFullYear() - 1);
        break;
    }

    // Get previous period orders (filtered by seller)
    const { data: prevOrders } = await supabase
      .from('orders')
      .select(`
        id,
        status,
        order_items (
          seller_id,
          total_price,
          unit_price,
          quantity
        )
      `)
      .in('id', orderIds)
      .gte('created_at', prevStartDate.toISOString())
      .lt('created_at', startDate.toISOString());

    // Filter and calculate previous period revenue from seller's items
    const prevCompletedOrders = prevOrders?.filter(o => o.status === 'delivered') || [];
    const prevRevenue = prevCompletedOrders.reduce((sum, order) => {
      const orderSellerRevenue = order.order_items
        ?.filter((item: any) => item.seller_id === userId)
        .reduce((itemSum: number, item: any) => {
          return itemSum + (item.total_price || (item.unit_price * item.quantity));
        }, 0) || 0;
      return sum + orderSellerRevenue;
    }, 0);

    const revenueGrowth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;

    // Sales by category
    const salesByCategory: { [key: string]: number } = {};
    for (const order of completedOrders) {
      for (const item of order.order_items || []) {
        const productInfo = productMap.get(item.product_id);
        const category = productInfo?.category || 'Uncategorized';
        salesByCategory[category] = (salesByCategory[category] || 0) + item.quantity;
      }
    }

    console.log(`📊 Sales by category:`, salesByCategory);

    // Top selling products
    const productSales: { [key: string]: { name: string; quantity: number; revenue: number } } = {};
    for (const order of completedOrders) {
      for (const item of order.order_items || []) {
        const productId = item.product_id;
        const productName = item.product_name || 'Unknown Product';

        if (!productSales[productId]) {
          productSales[productId] = { name: productName, quantity: 0, revenue: 0 };
        }
        productSales[productId].quantity += item.quantity;
        productSales[productId].revenue += item.total_price || (item.unit_price * item.quantity);
      }
    }

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    console.log(`🏆 Top 5 products:`, topProducts.map(p => p.name));

    // Daily sales for chart
    const dailySales: { [key: string]: number } = {};
    for (const order of completedOrders) {
      const date = new Date(order.created_at).toISOString().split('T')[0];
      dailySales[date] = (dailySales[date] || 0) + (order.total_amount || 0);
    }

    const analytics = {
      revenue: {
        total: totalRevenue,
        growth: revenueGrowth,
        avgOrderValue
      },
      orders: {
        total: totalOrders,
        completed: completedOrders.length,
        pending: filteredOrders?.filter(o => o.status === 'pending').length || 0,
        processing: filteredOrders?.filter(o => o.status === 'processing').length || 0,
        cancelled: filteredOrders?.filter(o => o.status === 'cancelled').length || 0
      },
      products: {
        total: products?.length || 0,
        inStock: products?.filter(p => p.stock_quantity > 0).length || 0,
        outOfStock: products?.filter(p => p.stock_quantity === 0).length || 0
      },
      salesByCategory,
      topProducts,
      dailySales,
      period
    };

    console.log(`✅ Analytics calculated successfully\n`);

    return NextResponse.json({
      success: true,
      analytics
    });

  } catch (error: any) {
    console.error('❌ Error in GET /api/seller/analytics:', error);

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
