'use client';

import Link from 'next/link';
import {
  Package,
  ShoppingCart,
  FileText,
  BarChart3,
  AlertCircle,
  Upload,
  TrendingUp,
  Store,
  Eye,
  RefreshCcw,
  CreditCard,
  BadgeCheck
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function SellerDashboard() {
  const { user } = useAuthStore();
  const sellerItems = [
    {
      title: 'Upload Catalog',
      description: 'Add new products to your store',
      icon: Upload,
      href: '/seller/catalog/add',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Lens Details',
      description: 'Configure lens offerings and pricing',
      icon: Eye,
      href: '/seller/lens-details',
      color: 'from-cyan-500 to-cyan-600',
    },
    {
      title: 'Orders',
      description: 'View and manage customer orders',
      icon: ShoppingCart,
      href: '/seller/orders',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Complaints',
      description: 'Handle customer complaints',
      icon: AlertCircle,
      href: '/seller/complaints',
      color: 'from-red-500 to-red-600',
    },
    {
      title: 'Inventory',
      description: 'Track your product stock',
      icon: Package,
      href: '/seller/inventory',
      color: 'from-orange-500 to-orange-600',
    },
    {
      title: 'Sales Analytics',
      description: 'View sales reports and insights',
      icon: BarChart3,
      href: '/seller/analytics',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      title: 'Performance',
      description: 'Track your seller metrics',
      icon: TrendingUp,
      href: '/seller/performance',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      title: 'Catalog Management',
      description: 'Manage your products and pricing',
      icon: FileText,
      href: '/seller/catalog',
      color: 'from-teal-500 to-teal-600',
    },
    {
      title: 'Returns',
      description: 'Manage product returns and refunds',
      icon: RefreshCcw,
      href: '/seller/returns',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Payments',
      description: 'Track payments and transactions',
      icon: CreditCard,
      href: '/seller/payments',
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      title: 'Quality',
      description: 'Quality control and reviews',
      icon: BadgeCheck,
      href: '/seller/quality',
      color: 'from-sky-500 to-sky-600',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Shop Header */}
        <div className="mb-8 bg-gradient-to-r from-zinc-900 to-black border border-gray-800 rounded-lg p-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <Store className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2 text-white">
                {user?.business_name || 'Your Shop'}
              </h1>
              <p className="text-xl text-gray-300">
                Welcome back, <span className="text-red-500 font-semibold">{user?.first_name} {user?.last_name}</span>
              </p>
              <p className="text-gray-400 mt-2">Manage your business and products</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellerItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative overflow-hidden rounded-lg bg-zinc-900 p-6 hover:bg-zinc-800 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-900/20"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />

                <div className="relative">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-xl font-bold mb-2 group-hover:text-red-500 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
