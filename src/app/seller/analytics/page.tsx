'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, Loader2, AlertCircle, BarChart3, Calendar } from 'lucide-react';

interface Analytics {
  revenue: {
    total: number;
    growth: number;
    avgOrderValue: number;
  };
  orders: {
    total: number;
    completed: number;
    pending: number;
    processing: number;
    cancelled: number;
  };
  products: {
    total: number;
    inStock: number;
    outOfStock: number;
  };
  salesByCategory: { [key: string]: number };
  topProducts: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
  dailySales: { [key: string]: number };
  period: string;
}

export default function AnalyticsPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'seller') {
      router.push('/account');
      return;
    }

    fetchAnalytics();
  }, [isAuthenticated, user, router, period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`/api/seller/analytics?period=${period}`, {
        headers: {
          'x-user-id': user?.id || '',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch analytics');
      }

      setAnalytics(data.analytics);
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      setError(err.message || 'Failed to load analytics');
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
          <p className="text-white text-xl">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Sales Analytics</h1>
            <p className="text-gray-400">View your sales reports and business insights</p>
          </div>

          {/* Period Selector */}
          <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
            {(['day', 'week', 'month', 'year'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  period === p
                    ? 'bg-red-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
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

        {/* Revenue & Orders Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-green-900/30 to-zinc-900 border border-green-800/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-green-600/20 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold">Total Revenue</h3>
              </div>
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                analytics.revenue.growth >= 0
                  ? 'bg-green-900/30 text-green-500'
                  : 'bg-red-900/30 text-red-500'
              }`}>
                {analytics.revenue.growth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="font-semibold">{Math.abs(analytics.revenue.growth).toFixed(1)}%</span>
              </div>
            </div>
            <p className="text-3xl font-bold mb-2">₹{analytics.revenue.total.toLocaleString('en-IN')}</p>
            <p className="text-gray-400 text-sm">Avg Order: ₹{Math.round(analytics.revenue.avgOrderValue).toLocaleString('en-IN')}</p>
          </div>

          {/* Total Orders */}
          <div className="bg-gradient-to-br from-blue-900/30 to-zinc-900 border border-blue-800/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold">Total Orders</h3>
              </div>
            </div>
            <p className="text-3xl font-bold mb-2">{analytics.orders.total}</p>
            <div className="flex gap-4 text-sm">
              <span className="text-green-500">✓ {analytics.orders.completed} completed</span>
              <span className="text-yellow-500">⏳ {analytics.orders.pending} pending</span>
            </div>
          </div>

          {/* Products */}
          <div className="bg-gradient-to-br from-purple-900/30 to-zinc-900 border border-purple-800/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-purple-600/20 flex items-center justify-center">
                  <Package className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold">Products</h3>
              </div>
            </div>
            <p className="text-3xl font-bold mb-2">{analytics.products.total}</p>
            <div className="flex gap-4 text-sm">
              <span className="text-green-500">✓ {analytics.products.inStock} in stock</span>
              <span className="text-red-500">✗ {analytics.products.outOfStock} out</span>
            </div>
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-red-500" />
            Order Status Breakdown
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-800/50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Completed</p>
              <p className="text-2xl font-bold text-green-500">{analytics.orders.completed}</p>
            </div>
            <div className="bg-zinc-800/50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-500">{analytics.orders.pending}</p>
            </div>
            <div className="bg-zinc-800/50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Processing</p>
              <p className="text-2xl font-bold text-blue-500">{analytics.orders.processing}</p>
            </div>
            <div className="bg-zinc-800/50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Cancelled</p>
              <p className="text-2xl font-bold text-red-500">{analytics.orders.cancelled}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Products */}
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h2 className="text-2xl font-bold mb-4">Top Selling Products</h2>
            {analytics.topProducts.length > 0 ? (
              <div className="space-y-3">
                {analytics.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-white font-medium">{product.name}</p>
                        <p className="text-gray-400 text-sm">{product.quantity} sold</p>
                      </div>
                    </div>
                    <p className="text-green-500 font-semibold">₹{product.revenue.toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No sales data available</p>
            )}
          </div>

          {/* Sales by Category */}
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h2 className="text-2xl font-bold mb-4">Sales by Category</h2>
            {Object.keys(analytics.salesByCategory).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(analytics.salesByCategory)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, count], index) => {
                    const totalSales = Object.values(analytics.salesByCategory).reduce((a, b) => a + b, 0);
                    const percentage = totalSales > 0 ? (count / totalSales) * 100 : 0;
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium capitalize">{category}</span>
                          <span className="text-gray-400">{count} units ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No category data available</p>
            )}
          </div>
        </div>

        {/* Daily Sales Chart */}
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-red-500" />
            Daily Sales Overview
          </h2>
          {Object.keys(analytics.dailySales).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(analytics.dailySales)
                .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
                .map(([date, amount]) => {
                  const maxAmount = Math.max(...Object.values(analytics.dailySales));
                  const percentage = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
                  return (
                    <div key={date} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">
                          {new Date(date).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
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
            <p className="text-gray-400 text-center py-8">No sales data for this period</p>
          )}
        </div>
      </div>
    </div>
  );
}
