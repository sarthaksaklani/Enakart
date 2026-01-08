// src/app/seller/admin/page.tsx

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Upload,
  ShoppingCart,
  AlertCircle,
  Package,
  BarChart3,
  TrendingUp,
  Settings as SettingsIcon,
  Eye,
  FileText,
  Search,
  User,
  ChevronDown,
  LogOut,
  Heart,
  MapPin,
  Settings,
  HeadphonesIcon,
  MessageCircle,
  DollarSign,
  Home,
  ArrowLeft,
  RefreshCcw,
  CreditCard,
  BadgeCheck,
  Bell
} from 'lucide-react';

export default function SellerAdminPage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'seller') {
      router.push('/account');
    } else {
      setIsCheckingAuth(false);
    }
  }, [isAuthenticated, user, router]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false);
      setShowSearch(false);
    };

    if (showUserMenu || showSearch) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showUserMenu, showSearch]);

  const adminItems = [
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

  // Filter dashboard items based on search query
  const filteredItems = searchQuery.trim()
    ? adminItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : adminItems;

  // Search suggestions based on dashboard options
  const searchSuggestions = searchQuery.trim()
    ? adminItems
        .filter(item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : adminItems.slice(0, 5);

  const handleSearchClick = (itemHref?: string) => {
    if (itemHref) {
      router.push(itemHref);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  if (!user || user.role !== 'seller' || isCheckingAuth) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Seller Dashboard Navbar */}
      <nav className="bg-black/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-800">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo and Website Name */}
            <Link href="/" className="flex items-center space-x-1 sm:space-x-1.5 group">
              {/* 3D Square Logo Icon */}
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-900 to-black rounded-sm flex items-center justify-center transform transition-all duration-300 group-hover:scale-105 shadow-2xl"
                   style={{
                     boxShadow: '0 8px 16px rgba(229, 9, 20, 0.3), 0 4px 8px rgba(0, 0, 0, 0.8), inset 0 2px 4px rgba(255, 255, 255, 0.1), inset 0 -2px 4px rgba(0, 0, 0, 0.5)',
                   }}>
                <div className="absolute top-0 left-0 w-full h-full rounded-sm"
                     style={{
                       background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 40%, rgba(0, 0, 0, 0.3) 100%)',
                     }}></div>
                <div className="absolute bottom-0 right-0 w-full h-full rounded-sm"
                     style={{
                       background: 'linear-gradient(315deg, rgba(0, 0, 0, 0.4) 0%, transparent 40%)',
                       }}></div>
                <span className="relative z-10 font-black text-xl sm:text-2xl"
                      style={{
                        color: 'rgb(229, 9, 20)',
                        textShadow: '0 2px 8px rgba(229, 9, 20, 0.5), 0 0 12px rgba(229, 9, 20, 0.3)',
                      }}>
                  ए
                </span>
              </div>

              {/* Website Name Image */}
              <div className="relative h-12 w-auto sm:h-15">
                <Image
                  src="/website-name.png"
                  alt="एnakart"
                  width={150}
                  height={60}
                  className="object-contain h-full w-auto"
                  priority
                />
              </div>
            </Link>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
              {/* Search Icon */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSearch(!showSearch);
                }}
                className="p-1.5 sm:p-2 hover:bg-gray-800/50 rounded-full transition-all duration-300"
              >
                <Search className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 hover:text-red-500 transition-colors" />
              </button>

              {/* Notification Bell Icon */}
              <Link
                href="/seller/notifications"
                className="relative p-1.5 sm:p-2 hover:bg-gray-800/50 rounded-full transition-all duration-300 group"
              >
                <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 group-hover:text-red-500 transition-colors" />
                {/* Notification Badge - show if there are unread notifications */}
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse ring-2 ring-black"></span>
                {/* Optional: Show notification count */}
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </Link>

              {/* User Account */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                  }}
                  className="flex items-center gap-1 sm:gap-2 hover:bg-gray-800 px-1.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors text-white group"
                >
                  <User className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="hidden lg:block text-sm font-medium">
                    {user.first_name}
                  </span>
                  <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>
                {showUserMenu && (
                  <div onClick={(e) => e.stopPropagation()} className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl py-2 z-50 animate-fade-in-up">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-white font-semibold">{user.first_name} {user.last_name}</p>
                      <p className="text-gray-400 text-sm truncate">{user.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        href="/seller/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group"
                      >
                        <User className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        href="/seller/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group"
                      >
                        <Settings className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
                        <span>Dashboard</span>
                      </Link>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-700 my-2"></div>

                    {/* Support Section */}
                    <div className="py-2">
                      <Link
                        href="/help"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group"
                      >
                        <HeadphonesIcon className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
                        <span>Help & Support</span>
                      </Link>

                      <Link
                        href="/contact"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group"
                      >
                        <MessageCircle className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
                        <span>Contact Us</span>
                      </Link>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-700 my-2"></div>

                    {/* Logout */}
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                        router.push('/');
                      }}
                      className="w-full text-left flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors group"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="font-semibold">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search Overlay */}
        {showSearch && (
          <div className="absolute top-full left-0 right-0 bg-gray-900/98 border-b border-gray-800 shadow-2xl z-40 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="max-w-3xl mx-auto p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search dashboard options..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    autoFocus
                  />
                  <Search className="absolute left-4 top-3.5 h-6 w-6 text-gray-400" />
                </div>
              </div>

              {/* Search Suggestions */}
              <div>
                <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wide">
                  {searchQuery.trim() ? 'Matching Dashboard Options' : 'Dashboard Options'}
                </p>
                <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                  {searchSuggestions.length > 0 ? (
                    searchSuggestions.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={index}
                          onClick={() => handleSearchClick(item.href)}
                          className="text-left px-4 py-3 text-gray-300 bg-gray-800/50 hover:bg-gray-800 hover:text-white rounded-lg transition-colors flex items-center gap-4 group"
                        >
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-white">{item.title}</div>
                            <div className="text-xs text-gray-400">{item.description}</div>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">No matching dashboard options found</p>
                      <p className="text-sm text-gray-500 mt-1">Try a different search term</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Dashboard Content */}
      <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back to Dashboard Arrow */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back to Home</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            Welcome back, <span className="text-white font-semibold">{user.first_name}</span>! Manage your entire business from here.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-green-900/20 to-green-800/20 border border-green-600/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-white">124</p>
                <p className="text-green-400 text-sm mt-1">+12% this week</p>
              </div>
              <ShoppingCart className="h-12 w-12 text-green-500 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border border-blue-600/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Products</p>
                <p className="text-3xl font-bold text-white">48</p>
                <p className="text-blue-400 text-sm mt-1">3 uploaded today</p>
              </div>
              <Package className="h-12 w-12 text-blue-500 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-600/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Revenue</p>
                <p className="text-3xl font-bold text-white">₹1.2L</p>
                <p className="text-purple-400 text-sm mt-1">This month</p>
              </div>
              <BarChart3 className="h-12 w-12 text-purple-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* Admin Features Grid */}
        {searchQuery.trim() && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Search Results for "{searchQuery}"
            </h2>
            <p className="text-gray-400">
              Found {filteredItems.length} {filteredItems.length === 1 ? 'option' : 'options'}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative overflow-hidden rounded-lg bg-zinc-900 p-4 hover:bg-zinc-800 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-900/20 border border-zinc-800 hover:border-red-600/50"
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${item.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />

                  <div className="relative">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <h3 className="text-base font-bold mb-1 group-hover:text-red-500 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-xs leading-tight">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full text-center py-20">
              <AlertCircle className="h-20 w-20 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No Results Found</h3>
              <p className="text-gray-400 mb-6">
                No dashboard options match your search "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
