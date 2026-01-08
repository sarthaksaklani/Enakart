'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, XCircle, Users, Store, Truck, Eye, Loader2, AlertCircle } from 'lucide-react';

interface Order {
  id: string;
  order_number: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  order_source: 'customer' | 'reseller';
  created_at: string;
  shipping_address: any;
  users?: {
    id: string;
    email: string;
  };
  order_items?: Array<{
    id: string;
    quantity: number;
    price: number;
    product_snapshot: any;
  }>;
}

interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
}

type OrderTab = 'customer' | 'reseller';

export default function SellerOrdersPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<OrderTab>('customer');
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats>({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'seller') {
      router.push('/account');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, user, router, activeTab]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`/api/seller/orders?source=${activeTab}`, {
        headers: {
          'x-user-id': user?.id || '',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch orders');
      }

      setOrders(data.orders || []);
      setStats(data.stats || {
        total: 0,
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        totalRevenue: 0,
      });
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    if (!confirm(`Are you sure you want to mark this order as ${newStatus}?`)) {
      return;
    }

    setUpdatingOrderId(orderId);

    try {
      const response = await fetch(`/api/seller/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || '',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update order status');
      }

      // Refresh orders
      await fetchOrders();
      alert('Order status updated successfully!');
    } catch (err: any) {
      console.error('Error updating order:', err);
      alert(err.message || 'Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'processing':
        return 'text-blue-500 bg-blue-500/10';
      case 'shipped':
        return 'text-purple-500 bg-purple-500/10';
      case 'delivered':
        return 'text-green-500 bg-green-500/10';
      case 'cancelled':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    switch (currentStatus) {
      case 'pending':
        return 'processing';
      case 'processing':
        return 'shipped';
      case 'shipped':
        return 'delivered';
      default:
        return null;
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
          <p className="text-white text-xl">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Orders</h1>
          <p className="text-gray-400">Manage customer and reseller orders</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex gap-4 border-b border-zinc-800">
            <button
              onClick={() => setActiveTab('customer')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-all ${
                activeTab === 'customer'
                  ? 'text-white border-b-2 border-red-500'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Users className="w-5 h-5" />
              Orders from Customers
            </button>
            <button
              onClick={() => setActiveTab('reseller')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-all ${
                activeTab === 'reseller'
                  ? 'text-white border-b-2 border-red-500'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Store className="w-5 h-5" />
              Orders from Resellers
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Total</h3>
              <Package className="w-4 h-4 text-gray-500" />
            </div>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>

          <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Pending</h3>
              <Clock className="w-4 h-4 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold">{stats.pending}</p>
          </div>

          <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Processing</h3>
              <Package className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold">{stats.processing}</p>
          </div>

          <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Shipped</h3>
              <Truck className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-2xl font-bold">{stats.shipped}</p>
          </div>

          <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Delivered</h3>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold">{stats.delivered}</p>
          </div>

          <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Cancelled</h3>
              <XCircle className="w-4 h-4 text-red-500" />
            </div>
            <p className="text-2xl font-bold">{stats.cancelled}</p>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-gradient-to-br from-red-900/20 to-zinc-900 border border-red-800/30 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-400 text-sm mb-1">Total Revenue</h3>
              <p className="text-4xl font-bold text-white">₹{stats.totalRevenue.toLocaleString('en-IN')}</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
              <Package className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-600/50 rounded-lg p-4 mb-8 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Orders List */}
        {orders.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">
              {activeTab === 'customer' ? 'Customer' : 'Reseller'} Orders ({orders.length})
            </h2>
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 hover:border-red-600/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">#{order.order_number}</h3>
                    <p className="text-gray-400 text-sm">
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Customer Info */}
                {order.users && (
                  <div className="mb-4 p-4 bg-zinc-800/50 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Customer Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <p className="text-white">
                        <span className="text-gray-400">Email:</span> {order.users.email}
                      </p>
                      <p className="text-white">
                        <span className="text-gray-400">User ID:</span> {order.users.id.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                {order.order_items && order.order_items.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Items ({order.order_items.length})</h4>
                    <div className="space-y-2">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg text-sm">
                          <div className="flex-1">
                            <p className="text-white font-medium">{item.product_snapshot?.name || 'Unknown Product'}</p>
                            <p className="text-gray-400">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-white font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total & Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                  <div>
                    <p className="text-gray-400 text-sm">Total Amount</p>
                    <p className="text-2xl font-bold text-red-500">₹{order.total_amount.toLocaleString('en-IN')}</p>
                  </div>

                  <div className="flex gap-2">
                    {getNextStatus(order.status) && (
                      <button
                        onClick={() => updateOrderStatus(order.id, getNextStatus(order.status)!)}
                        disabled={updatingOrderId === order.id}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                      >
                        {updatingOrderId === order.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            Mark as {getNextStatus(order.status)}
                          </>
                        )}
                      </button>
                    )}

                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        disabled={updatingOrderId === order.id}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-zinc-900 rounded-lg p-12 text-center border border-zinc-800">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Orders Yet</h3>
            <p className="text-gray-400">
              {activeTab === 'customer'
                ? 'Customer orders will appear here'
                : 'Reseller orders will appear here'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
