// src/app/orders/page.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import { Package, ArrowLeft, Truck, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Package className="h-20 w-20 text-gray-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Login Required</h2>
          <p className="text-gray-400 mb-8">
            Please login to view your orders
          </p>
          <Link href="/account">
            <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Mock order data
  const orders = [
    {
      id: 'ORD-2024-001',
      date: 'Nov 25, 2024',
      status: 'Delivered',
      total: 2499,
      items: 2,
      icon: CheckCircle2,
      iconColor: 'text-green-500',
    },
    {
      id: 'ORD-2024-002',
      date: 'Nov 27, 2024',
      status: 'In Transit',
      total: 1899,
      items: 1,
      icon: Truck,
      iconColor: 'text-blue-500',
    },
    {
      id: 'ORD-2024-003',
      date: 'Nov 28, 2024',
      status: 'Processing',
      total: 3299,
      items: 3,
      icon: Clock,
      iconColor: 'text-yellow-500',
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-white">My Orders</h1>
          <p className="text-gray-400 mt-2">Track and manage your orders</p>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 hover:border-red-600/50 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors">
                      {order.id}
                    </h3>
                    <p className="text-gray-400 text-sm">{order.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <order.icon className={`h-5 w-5 ${order.iconColor}`} />
                    <span className={`font-semibold ${order.iconColor}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">
                      {order.items} {order.items === 1 ? 'Item' : 'Items'}
                    </p>
                    <p className="text-2xl font-bold text-white mt-1">
                      ₹{order.total.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <Link href={`/orders/${order.id}`}>
                    <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Package className="h-20 w-20 text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">No Orders Yet</h2>
            <p className="text-gray-400 mb-8">
              Start shopping to see your orders here
            </p>
            <Link href="/products">
              <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3">
                Browse Products
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
