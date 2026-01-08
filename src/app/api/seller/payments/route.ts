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

    // Get all payments
    let paymentsQuery = supabase
      .from('payments')
      .select(`
        *,
        order:orders (
          id,
          order_number,
          total_amount,
          created_at
        )
      `)
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

    // Calculate earnings summary
    const totalEarnings = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
    const pendingPayouts = 0; // TODO: Calculate from orders that are delivered but payment not yet transferred

    // Get completed orders for pending payouts calculation
    const { data: completedOrders } = await supabase
      .from('orders')
      .select('total_amount, payment_status')
      .eq('status', 'delivered')
      .eq('payment_status', 'completed');

    const completedOrdersTotal = completedOrders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;
    const actualPendingPayouts = completedOrdersTotal - totalEarnings;

    // Group payments by month for chart
    const monthlyEarnings: { [key: string]: number } = {};
    payments?.forEach(payment => {
      const month = new Date(payment.created_at).toISOString().slice(0, 7); // YYYY-MM
      monthlyEarnings[month] = (monthlyEarnings[month] || 0) + (payment.amount || 0);
    });

    // Payment methods breakdown
    const paymentMethods: { [key: string]: { count: number; amount: number } } = {};
    payments?.forEach(payment => {
      const method = payment.payment_method || 'other';
      if (!paymentMethods[method]) {
        paymentMethods[method] = { count: 0, amount: 0 };
      }
      paymentMethods[method].count++;
      paymentMethods[method].amount += payment.amount || 0;
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
