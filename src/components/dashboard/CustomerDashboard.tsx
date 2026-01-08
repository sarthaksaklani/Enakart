'use client';

import Link from 'next/link';
import { ShoppingBag, Heart, MapPin, Settings, Package, HelpCircle, Store, Coins } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function CustomerDashboard() {
  const { user } = useAuthStore();

  const allDashboardItems = [
    {
      title: 'My Orders',
      description: 'Track and manage your orders',
      icon: Package,
      href: '/orders',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Wishlist',
      description: 'View your saved items',
      icon: Heart,
      href: '/wishlist',
      color: 'from-red-500 to-red-600',
    },
    {
      title: 'My Addresses',
      description: 'Manage delivery addresses',
      icon: MapPin,
      href: '/addresses',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Enak Coin',
      description: 'View and manage your reward coins',
      icon: Coins,
      href: '/enak-coin',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      title: 'Settings',
      description: 'Update your profile and preferences',
      icon: Settings,
      href: '/settings',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Shopping Cart',
      description: 'View items in your cart',
      icon: ShoppingBag,
      href: '/cart',
      color: 'from-orange-500 to-orange-600',
    },
    {
      title: 'Become a Seller',
      description: 'Start selling on Enakart',
      icon: Store,
      href: '/become-a-seller',
      color: 'from-emerald-500 to-emerald-600',
      hideForSeller: true, // Hide this option for sellers
    },
    {
      title: 'Help & Support',
      description: 'Get assistance and FAQs',
      icon: HelpCircle,
      href: '/help',
      color: 'from-cyan-500 to-cyan-600',
    },
  ];

  // Filter out "Become a Seller" if user is already a seller
  const dashboardItems = allDashboardItems.filter(item => {
    if (item.hideForSeller && user?.role === 'seller') {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Customer Dashboard</h1>
          <p className="text-gray-400">Manage your shopping experience</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardItems.map((item) => {
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
