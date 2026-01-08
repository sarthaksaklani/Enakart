'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CreditCard, DollarSign, TrendingUp, Calendar, Loader2, AlertCircle, CreditCard as CardIcon, Receipt } from 'lucide-react';

interface Payment {
  id: string;
  amount: number;
  payment_method: string;
  payment_status: string;
  transaction_id: string;
  created_at: string;
  orders?: {
    id: string;
    order_number: string;
    total_amount: number;
    created_at: string;
    users?: {
      email: string;
    };
  };
}

interface EarningsData {
  summary: {
    totalEarnings: number;
    pendingPayouts: number;
    totalTransactions: number;
    avgTransactionValue: number;
  };
  monthlyEarnings: { [key: string]: number };
  paymentMethods: { [key: string]: { count: number; amount: number } };
  recentPayments: Payment[];
  period: string;
}

export default function PaymentsPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [earningsData, setEarningsData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState<'all' | 'week' | 'month'>('month');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'seller') {
      router.push('/account');
      return;
    }

    fetchEarnings();
  }, [isAuthenticated, user, router, period]);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`/api/seller/payments?period=${period}`, {
        headers: {
          'x-user-id': user?.id || '',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch earnings');
      }

      setEarningsData(data.earnings);
    } catch (err: any) {
      console.error('Error fetching earnings:', err);
      setError(err.message || 'Failed to load earnings');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'seller') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Loading earnings...</p>
        </div>
      </div>
    );
  }

  if (!earningsData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Payments & Earnings</h1>
            <p className="text-gray-400">Track your earnings and payment history</p>
          </div>

          {/* Period Selector */}
          <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
            {(['all', 'week', 'month'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  period === p
                    ? 'bg-red-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {p === 'all' ? 'All Time' : p === 'week' ? 'Last Week' : 'Last Month'}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-600/50 rounded-lg p-4 mb-8 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Earnings Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Earnings */}
          <div className="bg-gradient-to-br from-green-900/30 to-zinc-900 border border-green-800/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Total Earnings</h3>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold mb-1">₹{earningsData.summary.totalEarnings.toLocaleString('en-IN')}</p>
            <p className="text-xs text-gray-400">From completed orders</p>
          </div>

          {/* Pending Payouts */}
          <div className="bg-gradient-to-br from-yellow-900/30 to-zinc-900 border border-yellow-800/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Pending Payouts</h3>
              <Calendar className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold mb-1">₹{earningsData.summary.pendingPayouts.toLocaleString('en-IN')}</p>
            <p className="text-xs text-gray-400">Awaiting transfer</p>
          </div>

          {/* Total Transactions */}
          <div className="bg-gradient-to-br from-blue-900/30 to-zinc-900 border border-blue-800/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Transactions</h3>
              <Receipt className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold mb-1">{earningsData.summary.totalTransactions}</p>
            <p className="text-xs text-gray-400">Completed payments</p>
          </div>

          {/* Avg Transaction Value */}
          <div className="bg-gradient-to-br from-purple-900/30 to-zinc-900 border border-purple-800/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Avg Transaction</h3>
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold mb-1">₹{Math.round(earningsData.summary.avgTransactionValue).toLocaleString('en-IN')}</p>
            <p className="text-xs text-gray-400">Per transaction</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Earnings Chart */}
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-red-500" />
              Monthly Earnings
            </h2>
            {Object.keys(earningsData.monthlyEarnings).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(earningsData.monthlyEarnings)
                  .sort(([monthA], [monthB]) => monthB.localeCompare(monthA))
                  .slice(0, 6)
                  .map(([month, amount]) => {
                    const maxAmount = Math.max(...Object.values(earningsData.monthlyEarnings));
                    const percentage = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
                    return (
                      <div key={month} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium">
                            {new Date(month + '-01').toLocaleDateString('en-IN', {
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="text-green-500 font-semibold">₹{amount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-600 to-green-500 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No earnings data for this period</p>
            )}
          </div>

          {/* Payment Methods Breakdown */}
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <CardIcon className="h-6 w-6 text-red-500" />
              Payment Methods
            </h2>
            {Object.keys(earningsData.paymentMethods).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(earningsData.paymentMethods)
                  .sort(([, a], [, b]) => b.amount - a.amount)
                  .map(([method, data]) => {
                    const totalAmount = Object.values(earningsData.paymentMethods).reduce(
                      (sum, m) => sum + m.amount,
                      0
                    );
                    const percentage = totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0;
                    return (
                      <div key={method} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium capitalize">{method.replace('_', ' ')}</p>
                            <p className="text-xs text-gray-400">{data.count} transactions</p>
                          </div>
                          <span className="text-green-500 font-semibold">₹{data.amount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No payment method data available</p>
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-red-500" />
              Recent Payments
            </h2>
          </div>

          {earningsData.recentPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-800/50">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-gray-400">Transaction ID</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-400">Order</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-400">Customer</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-400">Amount</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-400">Method</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-400">Status</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-400">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {earningsData.recentPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="p-4">
                        <span className="text-gray-400 text-sm font-mono">
                          {payment.transaction_id || payment.id.slice(0, 12) + '...'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-white font-medium">
                          #{payment.orders?.order_number || 'N/A'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-300">
                          {payment.orders?.users?.email || 'Unknown'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-green-500 font-semibold">
                          ₹{payment.amount.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-400 capitalize">
                          {payment.payment_method?.replace('_', ' ') || 'N/A'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-semibold capitalize">
                          {payment.payment_status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-400 text-sm">
                          {new Date(payment.created_at).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Payments Yet</h3>
              <p className="text-gray-400">Payment transactions will appear here once orders are completed</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
