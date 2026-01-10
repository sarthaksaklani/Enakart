import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET seller earnings and payment history
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all'; // all, month, week

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

    // Calculate date range
    let startDate: Date | null = null;
    if (period === 'week') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
    }

    console.log(`\n💰 Fetching seller payments (period: ${period})`);

    // Step 1: Get all order_items that belong to this seller's products
    const { data: sellerOrderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('order_id, total_price, unit_price, quantity')
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

    // If no orders, return empty earnings
    if (orderIds.length === 0) {
      return NextResponse.json({
        success: true,
        earnings: {
          summary: {
            totalEarnings: 0,
            pendingPayouts: 0,
            totalTransactions: 0,
            avgTransactionValue: 0
          },
          monthlyEarnings: {},
          paymentMethods: {},
          recentPayments: [],
          period
        }
      });
    }

    // Step 2: Get payments for seller's orders only
    let paymentsQuery = supabase
      .from('payments')
      .select(`
        *,
        order:orders (
          id,
          order_number,
          total_amount,
          created_at,
          order_items (
            seller_id,
            total_price,
            unit_price,
            quantity
          )
        )
      `)
      .in('order_id', orderIds)
      .eq('status', 'completed')
      .order('created_at', { ascending: false });

    if (startDate) {
      paymentsQuery = paymentsQuery.gte('created_at', startDate.toISOString());
    }

    const { data: payments, error: paymentsError } = await paymentsQuery;

    if (paymentsError) {
      console.error('❌ Error fetching payments:', paymentsError);

      const errorMessage = paymentsError.message?.toLowerCase() || '';
      if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
        return NextResponse.json(
          { error: 'Network error. Please check your internet connection.' },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to fetch payments' },
        { status: 500 }
      );
    }

    console.log(`✅ Found ${payments?.length || 0} completed payments`);

    // Calculate earnings from seller's items only
    const totalEarnings = payments?.reduce((sum, payment) => {
      // Calculate seller's portion from this payment's order
      const sellerAmount = payment.order?.order_items
        ?.filter((item: any) => item.seller_id === userId)
        .reduce((itemSum: number, item: any) => {
          return itemSum + (item.total_price || (item.unit_price * item.quantity));
        }, 0) || 0;
      return sum + sellerAmount;
    }, 0) || 0;

    // Get completed orders for pending payouts calculation (seller's orders only)
    const { data: completedOrders } = await supabase
      .from('orders')
      .select(`
        id,
        order_items (
          seller_id,
          total_price,
          unit_price,
          quantity
        )
      `)
      .in('id', orderIds)
      .eq('status', 'delivered')
      .eq('payment_status', 'completed');

    // Calculate seller's share from completed orders
    const completedOrdersTotal = completedOrders?.reduce((sum, order) => {
      const sellerShare = order.order_items
        ?.filter((item: any) => item.seller_id === userId)
        .reduce((itemSum: number, item: any) => {
          return itemSum + (item.total_price || (item.unit_price * item.quantity));
        }, 0) || 0;
      return sum + sellerShare;
    }, 0) || 0;

    const actualPendingPayouts = completedOrdersTotal - totalEarnings;

    // Group payments by month for chart (seller's portion only)
    const monthlyEarnings: { [key: string]: number } = {};
    payments?.forEach(payment => {
      const month = new Date(payment.created_at).toISOString().slice(0, 7); // YYYY-MM
      const sellerAmount = payment.order?.order_items
        ?.filter((item: any) => item.seller_id === userId)
        .reduce((sum: number, item: any) => sum + (item.total_price || (item.unit_price * item.quantity)), 0) || 0;
      monthlyEarnings[month] = (monthlyEarnings[month] || 0) + sellerAmount;
    });

    // Payment methods breakdown (seller's portion only)
    const paymentMethods: { [key: string]: { count: number; amount: number } } = {};
    payments?.forEach(payment => {
      const method = payment.payment_method || 'other';
      if (!paymentMethods[method]) {
        paymentMethods[method] = { count: 0, amount: 0 };
      }
      const sellerAmount = payment.order?.order_items
        ?.filter((item: any) => item.seller_id === userId)
        .reduce((sum: number, item: any) => sum + (item.total_price || (item.unit_price * item.quantity)), 0) || 0;

      if (sellerAmount > 0) {
        paymentMethods[method].count++;
        paymentMethods[method].amount += sellerAmount;
      }
    });

    const earnings = {
      summary: {
        totalEarnings,
        pendingPayouts: Math.max(0, actualPendingPayouts),
        totalTransactions: payments?.length || 0,
        avgTransactionValue: payments?.length ? totalEarnings / payments.length : 0
      },
      monthlyEarnings,
      paymentMethods,
      recentPayments: payments?.slice(0, 10) || [],
      period
    };

    console.log(`💵 Total Earnings: ₹${totalEarnings}\n`);

    return NextResponse.json({
      success: true,
      earnings
    });

  } catch (error: any) {
    console.error('❌ Error in GET /api/seller/payments:', error);

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
