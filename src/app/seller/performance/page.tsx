'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Star,
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  Calendar
} from 'lucide-react';

interface PerformanceMetric {
  label: string;
  value: string | number;
  change: number;
  icon: any;
  color: string;
}

interface SalesData {
  date: string;
  sales: number;
  orders: number;
}

export default function PerformancePage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [timePeriod, setTimePeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'seller') {
      router.push('/account');
      return;
    }

    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'seller') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading performance data...</div>
      </div>
    );
  }

  // Mock performance data
  const overallRating = 4.6;
  const totalReviews = 248;
  const sellerScore = 92;
  const fulfillmentRate = 98;
  const responseTime = '2.5 hrs';
  const returnRate = 3.2;

  const performanceMetrics: PerformanceMetric[] = [
    {
      label: 'Total Revenue',
      value: '₹1.2L',
      change: 15.3,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
    },
    {
      label: 'Orders Completed',
      value: 124,
      change: 8.2,
      icon: ShoppingCart,
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Products Sold',
      value: 342,
      change: 12.5,
      icon: Package,
      color: 'from-purple-500 to-purple-600',
    },
    {
      label: 'Active Customers',
      value: 89,
      change: 5.7,
      icon: Users,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const salesData: SalesData[] = [
    { date: 'Week 1', sales: 28000, orders: 25 },
    { date: 'Week 2', sales: 35000, orders: 32 },
    { date: 'Week 3', sales: 31000, orders: 28 },
    { date: 'Week 4', sales: 42000, orders: 39 },
  ];

  const topProducts = [
    { name: 'Ray-Ban Aviator Classic', sold: 45, revenue: '₹58,495' },
    { name: 'Oakley Round Eyeglasses', sold: 38, revenue: '₹34,162' },
    { name: 'Premium Blue Light Glasses', sold: 52, revenue: '₹31,148' },
    { name: 'Polarized Sports Sunglasses', sold: 29, revenue: '₹23,197' },
  ];

  const ratingDistribution = [
    { stars: 5, count: 156, percentage: 63 },
    { stars: 4, count: 52, percentage: 21 },
    { stars: 3, count: 25, percentage: 10 },
    { stars: 2, count: 10, percentage: 4 },
    { stars: 1, count: 5, percentage: 2 },
  ];

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Performance Dashboard</h1>
          <p className="text-gray-400">Track your seller metrics and performance analytics</p>
        </div>

        {/* Time Period Filter */}
        <div className="mb-8 flex gap-3 flex-wrap">
          <button
            onClick={() => setTimePeriod('week')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              timePeriod === 'week'
                ? 'bg-red-600 text-white'
                : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimePeriod('month')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              timePeriod === 'month'
                ? 'bg-red-600 text-white'
                : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimePeriod('quarter')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              timePeriod === 'quarter'
                ? 'bg-red-600 text-white'
                : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
            }`}
          >
            This Quarter
          </button>
          <button
            onClick={() => setTimePeriod('year')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              timePeriod === 'year'
                ? 'bg-red-600 text-white'
                : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
            }`}
          >
            This Year
          </button>
        </div>

        {/* Overall Performance Score */}
        <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-600/30 rounded-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center shadow-2xl">
                <div className="text-center">
                  <div className="text-4xl font-bold">{sellerScore}</div>
                  <div className="text-sm">Score</div>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Excellent Performance!</h2>
                <p className="text-gray-400 mb-4">
                  You're in the top 10% of sellers on the platform
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Award className="h-5 w-5 text-yellow-500" />
                    <span className="text-yellow-500 font-semibold">Top Seller Badge</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-green-500">Verified</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  <span className="text-2xl font-bold">{overallRating}</span>
                </div>
                <p className="text-sm text-gray-400">{totalReviews} reviews</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{fulfillmentRate}%</div>
                <p className="text-sm text-gray-400">Fulfillment</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{responseTime}</div>
                <p className="text-sm text-gray-400">Response Time</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{returnRate}%</div>
                <p className="text-sm text-gray-400">Return Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {performanceMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${
                    metric.change > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {metric.change > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {Math.abs(metric.change)}%
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{metric.value}</div>
                <div className="text-sm text-gray-400">{metric.label}</div>
              </div>
            );
          })}
        </div>

        {/* Sales Chart & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Sales Chart */}
          <div className="lg:col-span-2 bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h3 className="text-xl font-bold mb-6">Sales Overview</h3>
            <div className="space-y-4">
              {salesData.map((data, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{data.date}</span>
                    <div className="flex gap-4">
                      <span className="text-green-400">₹{(data.sales / 1000).toFixed(1)}K</span>
                      <span className="text-blue-400">{data.orders} orders</span>
                    </div>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-red-500 to-orange-500 h-full rounded-full transition-all"
                      style={{ width: `${(data.sales / 42000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-zinc-800">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Sales This Month</span>
                <span className="text-2xl font-bold text-white">₹1,36,000</span>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h3 className="text-xl font-bold mb-6">Top Selling Products</h3>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center flex-shrink-0 font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{product.name}</div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-400">{product.sold} sold</span>
                      <span className="text-sm text-green-400 font-semibold">{product.revenue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rating Distribution & Performance Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rating Distribution */}
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h3 className="text-xl font-bold mb-6">Customer Ratings</h3>
            <div className="flex items-center gap-6 mb-6">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">{overallRating}</div>
                <div className="flex items-center gap-1 justify-center mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.floor(overallRating)
                          ? 'fill-yellow-500 text-yellow-500'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-400">{totalReviews} total</div>
              </div>
              <div className="flex-1 space-y-2">
                {ratingDistribution.map((rating) => (
                  <div key={rating.stars} className="flex items-center gap-3">
                    <span className="text-sm w-6">{rating.stars}★</span>
                    <div className="flex-1 bg-zinc-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-yellow-500 h-full rounded-full"
                        style={{ width: `${rating.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-400 w-12 text-right">{rating.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-bold">{((ratingDistribution[0].count + ratingDistribution[1].count) / totalReviews * 100).toFixed(0)}%</div>
                  <div className="text-xs text-gray-400">Positive</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ThumbsDown className="h-5 w-5 text-red-500" />
                <div>
                  <div className="font-bold">{((ratingDistribution[3].count + ratingDistribution[4].count) / totalReviews * 100).toFixed(0)}%</div>
                  <div className="text-xs text-gray-400">Negative</div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Goals */}
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h3 className="text-xl font-bold mb-6">Performance Goals</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400">Monthly Sales Target</span>
                  <span className="text-sm font-semibold">₹1.2L / ₹1.5L</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full" style={{ width: '80%' }} />
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs text-green-400">
                  <Target className="h-3 w-3" />
                  80% achieved
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400">Customer Satisfaction</span>
                  <span className="text-sm font-semibold">4.6 / 5.0</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-full rounded-full" style={{ width: '92%' }} />
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs text-yellow-400">
                  <Star className="h-3 w-3" />
                  92% achieved
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400">Order Fulfillment Rate</span>
                  <span className="text-sm font-semibold">98% / 95%</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full" style={{ width: '100%' }} />
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs text-green-400">
                  <CheckCircle className="h-3 w-3" />
                  Goal exceeded!
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400">Response Time</span>
                  <span className="text-sm font-semibold">2.5 hrs / 4 hrs</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full" style={{ width: '100%' }} />
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs text-green-400">
                  <Clock className="h-3 w-3" />
                  Goal exceeded!
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Overall Progress</span>
                <span className="text-xl font-bold text-green-400">93%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="mt-8 bg-blue-900/20 border border-blue-600/30 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">Performance Insights</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Your sales have increased by 15.3% this month - keep up the great work!</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Response time is excellent at 2.5 hours, better than 85% of sellers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Consider promoting your top-selling products to increase visibility.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>You're ₹30,000 away from reaching your monthly sales target.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
