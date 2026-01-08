// src/components/layout/Navbar.tsx

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  LogOut,
  Heart,
  Package,
  MapPin,
  Settings,
  HeadphonesIcon,
  MessageCircle,
  ChevronDown,
  Upload,
  BarChart3,
  AlertCircle,
  Inbox,
  TrendingUp,
  DollarSign,
  FileText,
  Store,
  Coins,
  Bell,
  Eye,
  Sun,
  Share2
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showGuestMenu, setShowGuestMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEyeglassesMegaMenu, setShowEyeglassesMegaMenu] = useState(false);
  const [showContactLensesMegaMenu, setShowContactLensesMegaMenu] = useState(false);
  const [showSunglassesMegaMenu, setShowSunglassesMegaMenu] = useState(false);
  const [showAccessoriesMegaMenu, setShowAccessoriesMegaMenu] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const itemCount = useCartStore((state) => state.getItemCount());
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Timeout refs for delayed dropdown closing
  const eyeglassesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const contactLensesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sunglassesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const accessoriesTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fix hydration error by only rendering cart count on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Track current category from URL query params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const category = params.get('category');
      setCurrentCategory(category);
    }
  }, [pathname]); // Re-run whenever pathname changes

  // Additional effect to catch query param changes on same pathname
  useEffect(() => {
    const checkCategory = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const category = params.get('category');
        if (category !== currentCategory) {
          setCurrentCategory(category);
        }
      }
    };

    // Use a small interval to check for URL changes
    const intervalId = setInterval(checkCategory, 200);

    // Also listen for popstate
    window.addEventListener('popstate', checkCategory);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('popstate', checkCategory);
    };
  }, [currentCategory]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false);
      setShowGuestMenu(false);
      setShowSearch(false);
      setShowEyeglassesMegaMenu(false);
      setShowContactLensesMegaMenu(false);
      setShowSunglassesMegaMenu(false);
      setShowAccessoriesMegaMenu(false);
    };

    if (showUserMenu || showGuestMenu || showSearch || showEyeglassesMegaMenu || showContactLensesMegaMenu || showSunglassesMegaMenu || showAccessoriesMegaMenu) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showUserMenu, showGuestMenu, showSearch, showEyeglassesMegaMenu, showContactLensesMegaMenu, showSunglassesMegaMenu, showAccessoriesMegaMenu]);

  // Search suggestions based on query
  const searchSuggestions = searchQuery.trim() ? [
    'Aviator Sunglasses',
    'Round Eyeglasses',
    'Blue Light Glasses',
    'Prescription Frames',
    'Sports Sunglasses',
    'Cat Eye Frames',
    'Wayfarer Sunglasses',
    'Reading Glasses',
  ].filter(item => item.toLowerCase().includes(searchQuery.toLowerCase())) : [
    'Aviator Sunglasses',
    'Round Eyeglasses',
    'Blue Light Glasses',
    'Prescription Frames',
  ];

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  // Helper functions for delayed dropdown closing
  const handleMouseEnterEyeglasses = () => {
    if (eyeglassesTimeoutRef.current) {
      clearTimeout(eyeglassesTimeoutRef.current);
    }
    setShowEyeglassesMegaMenu(true);
  };

  const handleMouseLeaveEyeglasses = () => {
    eyeglassesTimeoutRef.current = setTimeout(() => {
      setShowEyeglassesMegaMenu(false);
    }, 200); // 200ms delay
  };

  const handleMouseEnterContactLenses = () => {
    if (contactLensesTimeoutRef.current) {
      clearTimeout(contactLensesTimeoutRef.current);
    }
    setShowContactLensesMegaMenu(true);
  };

  const handleMouseLeaveContactLenses = () => {
    contactLensesTimeoutRef.current = setTimeout(() => {
      setShowContactLensesMegaMenu(false);
    }, 200);
  };

  const handleMouseEnterSunglasses = () => {
    if (sunglassesTimeoutRef.current) {
      clearTimeout(sunglassesTimeoutRef.current);
    }
    setShowSunglassesMegaMenu(true);
  };

  const handleMouseLeaveSunglasses = () => {
    sunglassesTimeoutRef.current = setTimeout(() => {
      setShowSunglassesMegaMenu(false);
    }, 200);
  };

  const handleMouseEnterAccessories = () => {
    if (accessoriesTimeoutRef.current) {
      clearTimeout(accessoriesTimeoutRef.current);
    }
    setShowAccessoriesMegaMenu(true);
  };

  const handleMouseLeaveAccessories = () => {
    accessoriesTimeoutRef.current = setTimeout(() => {
      setShowAccessoriesMegaMenu(false);
    }, 200);
  };

  // Helper function to check if a menu is active
  const isMenuActive = (category: string) => {
    if (!pathname || !mounted) return false;

    // Check if on products page with category query param
    if (pathname.startsWith('/products')) {
      return currentCategory === category;
    }

    return false;
  };

  return (
    <nav className="bg-black/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-800">
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Netflix-style Logo - Black background with Red text */}
          <Link href="/" className="flex items-center space-x-1 sm:space-x-1.5 group">
            {/* 3D Square Logo Icon */}
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-900 to-black rounded-sm flex items-center justify-center transform transition-all duration-300 group-hover:scale-105 shadow-2xl"
                 style={{
                   boxShadow: '0 8px 16px rgba(229, 9, 20, 0.3), 0 4px 8px rgba(0, 0, 0, 0.8), inset 0 2px 4px rgba(255, 255, 255, 0.1), inset 0 -2px 4px rgba(0, 0, 0, 0.5)',
                 }}>
              {/* Top-left highlight for 3D effect */}
              <div className="absolute top-0 left-0 w-full h-full rounded-sm"
                   style={{
                     background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 40%, rgba(0, 0, 0, 0.3) 100%)',
                   }}></div>

              {/* Bottom-right shadow for depth */}
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

          {/* Desktop Navigation with enhanced effects */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-8 ml-4 xl:ml-16">
            {/* Eyeglasses with Mega Menu */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnterEyeglasses}
              onMouseLeave={handleMouseLeaveEyeglasses}
              onClick={(e) => e.stopPropagation()}
            >
              <Link href="/products?category=eyeglasses" className="relative text-gray-300 transition-all duration-300 font-semibold text-sm xl:text-lg group">
                <span className="relative z-10">Eyeglasses</span>
                {/* Active indicator - persistent when on eyeglasses page */}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-300 ${
                  isMenuActive('eyeglasses') ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>

              {/* Mega Menu Dropdown */}
              {showEyeglassesMegaMenu && (
                <div className="absolute left-0 top-full mt-2 w-screen max-w-6xl bg-gray-900/98 backdrop-blur-lg border border-gray-800 rounded-lg shadow-2xl z-50 animate-fade-in-up">
                  <div className="p-8">
                    <div className="grid grid-cols-3 gap-8">
                      {/* Men's Section */}
                      <div>
                        <h3 className="text-red-500 font-bold text-lg mb-4 flex items-center gap-2">
                          <User className="h-5 w-5" />
                          For Men's
                        </h3>

                        {/* Shapes */}
                        <div className="mb-6">
                          <h4 className="text-gray-400 font-semibold text-sm mb-3 uppercase tracking-wide">Shapes</h4>
                          <div className="space-y-2">
                            <Link href="/products?category=eyeglasses&gender=men&frame_shape=square" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Square</Link>
                            <Link href="/products?category=eyeglasses&gender=men&frame_shape=rounded-square" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Rounded Square</Link>
                            <Link href="/products?category=eyeglasses&gender=men&frame_shape=rectangle" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Rectangular</Link>
                            <Link href="/products?category=eyeglasses&gender=men&frame_shape=rounded-rectangle" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Rounded Rectangular</Link>
                            <Link href="/products?category=eyeglasses&gender=men&frame_shape=oval" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Oval</Link>
                            <Link href="/products?category=eyeglasses&gender=men&frame_shape=pento" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Pento</Link>
                            <Link href="/products?category=eyeglasses&gender=men&frame_shape=hexagonal" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Hexagonal</Link>
                            <Link href="/products?category=eyeglasses&gender=men&frame_shape=polygonal" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Polygonal</Link>
                          </div>
                        </div>

                        {/* Frame Types */}
                        <div className="mb-6">
                          <h4 className="text-gray-400 font-semibold text-sm mb-3 uppercase tracking-wide">Frame Type</h4>
                          <div className="space-y-2">
                            <Link href="/products?category=eyeglasses&gender=men&frame_type=full-rim" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Full Rim</Link>
                            <Link href="/products?category=eyeglasses&gender=men&frame_type=half-rim" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Half Rim</Link>
                            <Link href="/products?category=eyeglasses&gender=men&frame_type=rimless" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Rimless</Link>
                          </div>
                        </div>

                        {/* Top Picks */}
                        <div>
                          <h4 className="text-gray-400 font-semibold text-sm mb-3 uppercase tracking-wide">Top Picks</h4>
                          <div className="space-y-2">
                            <Link href="/products?category=eyeglasses&gender=men&sort_by=popular" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Bestsellers</Link>
                            <Link href="/products?category=eyeglasses&gender=men&is_featured=true" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">New Arrivals</Link>
                            <Link href="/products?category=eyeglasses&gender=men&material=titanium" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Premium Collection</Link>
                          </div>
                        </div>
                      </div>

                      {/* Women's Section */}
                      <div>
                        <h3 className="text-red-500 font-bold text-lg mb-4 flex items-center gap-2">
                          <User className="h-5 w-5" />
                          For Women's
                        </h3>

                        {/* Shapes */}
                        <div className="mb-6">
                          <h4 className="text-gray-400 font-semibold text-sm mb-3 uppercase tracking-wide">Shapes</h4>
                          <div className="space-y-2">
                            <Link href="/products?category=eyeglasses&gender=women&frame_shape=cat-eye" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Cat-Eye</Link>
                            <Link href="/products?category=eyeglasses&gender=women&frame_shape=square" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Square</Link>
                            <Link href="/products?category=eyeglasses&gender=women&frame_shape=rounded-square" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Rounded Square</Link>
                            <Link href="/products?category=eyeglasses&gender=women&frame_shape=round" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Round</Link>
                            <Link href="/products?category=eyeglasses&gender=women&frame_shape=oval" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Oval</Link>
                            <Link href="/products?category=eyeglasses&gender=women&frame_shape=butterfly" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Butterfly</Link>
                            <Link href="/products?category=eyeglasses&gender=women&frame_shape=geometric" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Geometric</Link>
                            <Link href="/products?category=eyeglasses&gender=women&frame_shape=aviator" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Aviator</Link>
                          </div>
                        </div>

                        {/* Frame Types */}
                        <div className="mb-6">
                          <h4 className="text-gray-400 font-semibold text-sm mb-3 uppercase tracking-wide">Frame Type</h4>
                          <div className="space-y-2">
                            <Link href="/products?category=eyeglasses&gender=women&frame_type=full-rim" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Full Rim</Link>
                            <Link href="/products?category=eyeglasses&gender=women&frame_type=half-rim" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Half Rim</Link>
                            <Link href="/products?category=eyeglasses&gender=women&frame_type=rimless" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Rimless</Link>
                          </div>
                        </div>

                        {/* Top Picks */}
                        <div>
                          <h4 className="text-gray-400 font-semibold text-sm mb-3 uppercase tracking-wide">Top Picks</h4>
                          <div className="space-y-2">
                            <Link href="/products?category=eyeglasses&gender=women&sort_by=popular" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Bestsellers</Link>
                            <Link href="/products?category=eyeglasses&gender=women&is_featured=true" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">New Arrivals</Link>
                            <Link href="/products?category=eyeglasses&gender=women&style=designer" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Designer Collection</Link>
                          </div>
                        </div>
                      </div>

                      {/* Kids Section */}
                      <div>
                        <h3 className="text-red-500 font-bold text-lg mb-4 flex items-center gap-2">
                          <User className="h-5 w-5" />
                          For Kids
                        </h3>

                        {/* Shapes */}
                        <div className="mb-6">
                          <h4 className="text-gray-400 font-semibold text-sm mb-3 uppercase tracking-wide">Shapes</h4>
                          <div className="space-y-2">
                            <Link href="/products?category=eyeglasses&gender=kids&frame_shape=round" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Round</Link>
                            <Link href="/products?category=eyeglasses&gender=kids&frame_shape=square" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Square</Link>
                            <Link href="/products?category=eyeglasses&gender=kids&frame_shape=rectangle" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Rectangular</Link>
                            <Link href="/products?category=eyeglasses&gender=kids&frame_shape=oval" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Oval</Link>
                            <Link href="/products?category=eyeglasses&gender=kids&frame_shape=wayfarer" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Wayfarer</Link>
                          </div>
                        </div>

                        {/* Frame Types */}
                        <div className="mb-6">
                          <h4 className="text-gray-400 font-semibold text-sm mb-3 uppercase tracking-wide">Frame Type</h4>
                          <div className="space-y-2">
                            <Link href="/products?category=eyeglasses&gender=kids&frame_type=full-rim" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Full Rim</Link>
                            <Link href="/products?category=eyeglasses&gender=kids&material=flexible" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Flexible Frames</Link>
                            <Link href="/products?category=eyeglasses&gender=kids&feature=sports" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Sports Frames</Link>
                          </div>
                        </div>

                        {/* Top Picks */}
                        <div>
                          <h4 className="text-gray-400 font-semibold text-sm mb-3 uppercase tracking-wide">Top Picks</h4>
                          <div className="space-y-2">
                            <Link href="/products?category=eyeglasses&gender=kids&sort_by=popular" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Bestsellers</Link>
                            <Link href="/products?category=eyeglasses&gender=kids&age=0-5" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Age 0-5 Years</Link>
                            <Link href="/products?category=eyeglasses&gender=kids&age=6-12" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Age 6-12 Years</Link>
                            <Link href="/products?category=eyeglasses&gender=kids&age=13-18" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Age 13-18 Years</Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Banner */}
                    <div className="mt-8 pt-6 border-t border-gray-800">
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <Link href="/products?category=eyeglasses&material=titanium" className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group">
                          <div className="text-red-500 font-semibold mb-1 group-hover:scale-110 transition-transform">Premium Titanium</div>
                          <div className="text-gray-400 text-xs">Lightweight & Durable</div>
                        </Link>
                        <Link href="/products?category=eyeglasses&feature=blue-light" className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group">
                          <div className="text-red-500 font-semibold mb-1 group-hover:scale-110 transition-transform">Blue Light</div>
                          <div className="text-gray-400 text-xs">Screen Protection</div>
                        </Link>
                        <Link href="/products?category=eyeglasses&feature=anti-glare" className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group">
                          <div className="text-red-500 font-semibold mb-1 group-hover:scale-110 transition-transform">Anti-Glare</div>
                          <div className="text-gray-400 text-xs">Crystal Clear Vision</div>
                        </Link>
                        <Link href="/products?category=eyeglasses&feature=photochromic" className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group">
                          <div className="text-red-500 font-semibold mb-1 group-hover:scale-110 transition-transform">Photochromic</div>
                          <div className="text-gray-400 text-xs">Adaptive Lenses</div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Lenses with Mega Menu */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnterContactLenses}
              onMouseLeave={handleMouseLeaveContactLenses}
              onClick={(e) => e.stopPropagation()}
            >
              <Link href="/products?category=contact-lenses" className="relative text-gray-300 transition-all duration-300 font-semibold text-sm xl:text-lg group">
                <span className="relative z-10">Contact Lenses</span>
                {/* Active indicator - persistent when on contact lenses page */}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-300 ${
                  isMenuActive('contact-lenses') ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>

              {/* Mega Menu Dropdown for Contact Lenses */}
              {showContactLensesMegaMenu && (
                <div className="absolute left-0 top-full mt-2 w-screen max-w-5xl bg-gray-900/98 backdrop-blur-lg border border-gray-800 rounded-lg shadow-2xl z-50 animate-fade-in-up">
                  <div className="p-8">
                    <div className="grid grid-cols-3 gap-8">
                      {/* Lens Type Section */}
                      <div>
                        <h3 className="text-red-500 font-bold text-lg mb-4 flex items-center gap-2">
                          <Eye className="h-5 w-5" />
                          By Replacement
                        </h3>

                        <div className="space-y-2 mb-6">
                          <Link href="/products?category=contact-lenses&type=daily" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Daily Disposable</Link>
                          <Link href="/products?category=contact-lenses&type=weekly" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Weekly Disposable</Link>
                          <Link href="/products?category=contact-lenses&type=monthly" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Monthly Disposable</Link>
                          <Link href="/products?category=contact-lenses&type=yearly" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Yearly Disposable</Link>
                        </div>

                        <h4 className="text-gray-400 font-semibold text-sm mb-3 uppercase tracking-wide mt-6">By Color</h4>
                        <div className="space-y-2">
                          <Link href="/products?category=contact-lenses&color=clear" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Clear Lenses</Link>
                          <Link href="/products?category=contact-lenses&color=colored" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Colored Lenses</Link>
                          <Link href="/products?category=contact-lenses&color=blue" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Blue</Link>
                          <Link href="/products?category=contact-lenses&color=green" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Green</Link>
                          <Link href="/products?category=contact-lenses&color=gray" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Gray</Link>
                          <Link href="/products?category=contact-lenses&color=hazel" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Hazel</Link>
                        </div>
                      </div>

                      {/* Purpose Section */}
                      <div>
                        <h3 className="text-red-500 font-bold text-lg mb-4 flex items-center gap-2">
                          <Eye className="h-5 w-5" />
                          By Purpose
                        </h3>

                        <div className="space-y-2 mb-6">
                          <Link href="/products?category=contact-lenses&purpose=vision" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Vision Correction</Link>
                          <Link href="/products?category=contact-lenses&purpose=cosmetic" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Cosmetic/Fashion</Link>
                          <Link href="/products?category=contact-lenses&purpose=toric" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Toric (Astigmatism)</Link>
                          <Link href="/products?category=contact-lenses&purpose=multifocal" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Multifocal</Link>
                          <Link href="/products?category=contact-lenses&purpose=presbyopia" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Presbyopia</Link>
                        </div>

                        <h4 className="text-gray-400 font-semibold text-sm mb-3 uppercase tracking-wide mt-6">By Material</h4>
                        <div className="space-y-2">
                          <Link href="/products?category=contact-lenses&material=hydrogel" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Hydrogel</Link>
                          <Link href="/products?category=contact-lenses&material=silicone-hydrogel" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Silicone Hydrogel</Link>
                          <Link href="/products?category=contact-lenses&material=rgp" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Rigid Gas Permeable</Link>
                        </div>
                      </div>

                      {/* Features & Popular Section */}
                      <div>
                        <h3 className="text-red-500 font-bold text-lg mb-4 flex items-center gap-2">
                          <Eye className="h-5 w-5" />
                          Features
                        </h3>

                        <div className="space-y-2 mb-6">
                          <Link href="/products?category=contact-lenses&feature=uv-protection" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">UV Protection</Link>
                          <Link href="/products?category=contact-lenses&feature=moisture-lock" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Moisture Lock</Link>
                          <Link href="/products?category=contact-lenses&feature=extended-wear" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Extended Wear</Link>
                          <Link href="/products?category=contact-lenses&feature=breathable" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">High Breathability</Link>
                          <Link href="/products?category=contact-lenses&feature=sensitive" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">For Sensitive Eyes</Link>
                        </div>

                        <h4 className="text-gray-400 font-semibold text-sm mb-3 uppercase tracking-wide mt-6">Popular</h4>
                        <div className="space-y-2">
                          <Link href="/products?category=contact-lenses&sort_by=popular" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Bestsellers</Link>
                          <Link href="/products?category=contact-lenses&is_featured=true" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">New Arrivals</Link>
                          <Link href="/products?category=contact-lenses&brand=premium" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Premium Brands</Link>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Banner */}
                    <div className="mt-8 pt-6 border-t border-gray-800">
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <Link href="/products?category=contact-lenses&guide=first-time" className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group">
                          <div className="text-red-500 font-semibold mb-1 group-hover:scale-110 transition-transform">First Time User?</div>
                          <div className="text-gray-400 text-xs">Complete Guide</div>
                        </Link>
                        <Link href="/products?category=contact-lenses&offer=trial" className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group">
                          <div className="text-red-500 font-semibold mb-1 group-hover:scale-110 transition-transform">Trial Pack</div>
                          <div className="text-gray-400 text-xs">Try Before You Buy</div>
                        </Link>
                        <Link href="/products?category=contact-lenses&bundle=solution" className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group">
                          <div className="text-red-500 font-semibold mb-1 group-hover:scale-110 transition-transform">Solution Bundle</div>
                          <div className="text-gray-400 text-xs">Save on Combo</div>
                        </Link>
                        <Link href="/contact-lens-care" className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group">
                          <div className="text-red-500 font-semibold mb-1 group-hover:scale-110 transition-transform">Care Tips</div>
                          <div className="text-gray-400 text-xs">Maintain & Clean</div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sunglasses with Mega Menu */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnterSunglasses}
              onMouseLeave={handleMouseLeaveSunglasses}
              onClick={(e) => e.stopPropagation()}
            >
              <Link href="/products?category=sunglasses" className="relative text-gray-300 transition-all duration-300 font-semibold text-sm xl:text-lg group">
                <span className="relative z-10">Sunglasses</span>
                {/* Active indicator - persistent when on sunglasses page */}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-300 ${
                  isMenuActive('sunglasses') ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>

              {/* Mega Menu Dropdown for Sunglasses */}
              {showSunglassesMegaMenu && (
                <div className="absolute left-0 top-full mt-2 w-screen max-w-6xl bg-gray-900/98 backdrop-blur-lg border border-gray-800 rounded-lg shadow-2xl z-50 animate-fade-in-up">
                  <div className="p-8">
                    <div className="grid grid-cols-4 gap-6">
                      {/* Men's Section */}
                      <div>
                        <h3 className="text-red-500 font-bold text-lg mb-4 flex items-center gap-2">
                          <Sun className="h-5 w-5" />
                          For Men's
                        </h3>

                        <h4 className="text-gray-400 font-semibold text-sm mb-3 uppercase tracking-wide">Shapes</h4>
                        <div className="space-y-2 mb-4">
                          <Link href="/products?category=sunglasses&gender=men&frame_shape=aviator" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Aviator</Link>
                          <Link href="/products?category=sunglasses&gender=men&frame_shape=wayfarer" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Wayfarer</Link>
                          <Link href="/products?category=sunglasses&gender=men&frame_shape=square" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Square</Link>
                          <Link href="/products?category=sunglasses&gender=men&frame_shape=rectangle" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Rectangular</Link>
                          <Link href="/products?category=sunglasses&gender=men&frame_shape=round" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Round</Link>
                          <Link href="/products?category=sunglasses&gender=men&frame_shape=sport" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Sport</Link>
                        </div>

                        <h4 className="text-gray-400 font-semibold text-sm mb-3 uppercase tracking-wide">Top Picks</h4>
                        <div className="space-y-2">
                          <Link href="/products?category=sunglasses&gender=men&sort_by=popular" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Bestsellers</Link>
                          <Link href="/products?category=sunglasses&gender=men&is_featured=true" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">New Arrivals</Link>
                        </div>
                      </div>

                      {/* Women's Section */}
                      <div>
                        <h3 className="text-red-500 font-bold text-lg mb-4 flex items-center gap-2">
                          <Sun className="h-5 w-5" />
                          For Women's
                        </h3>

                        <h4 className="text-gray-400 font-semibold text-sm mb-3 uppercase tracking-wide">Shapes</h4>
                        <div className="space-y-2 mb-4">
                          <Link href="/products?category=sunglasses&gender=women&frame_shape=cat-eye" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Cat-Eye</Link>
                          <Link href="/products?category=sunglasses&gender=women&frame_shape=oversized" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Oversized</Link>
                          <Link href="/products?category=sunglasses&gender=women&frame_shape=butterfly" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Butterfly</Link>
                          <Link href="/products?category=sunglasses&gender=women&frame_shape=round" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Round</Link>
                          <Link href="/products?category=sunglasses&gender=women&frame_shape=wayfarer" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Wayfarer</Link>
                          <Link href="/products?category=sunglasses&gender=women&frame_shape=geometric" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Geometric</Link>
                        </div>

                        <h4 className="text-gray-400 font-semibold text-sm mb-3 uppercase tracking-wide">Top Picks</h4>
                        <div className="space-y-2">
                          <Link href="/products?category=sunglasses&gender=women&sort_by=popular" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Bestsellers</Link>
                          <Link href="/products?category=sunglasses&gender=women&is_featured=true" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">New Arrivals</Link>
                        </div>
                      </div>

                      {/* Lens Types Section */}
                      <div>
                        <h3 className="text-red-500 font-bold text-lg mb-4 flex items-center gap-2">
                          <Sun className="h-5 w-5" />
                          Lens Types
                        </h3>

                        <div className="space-y-2 mb-6">
                          <Link href="/products?category=sunglasses&lens=polarized" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Polarized</Link>
                          <Link href="/products?category=sunglasses&lens=mirrored" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Mirrored</Link>
                          <Link href="/products?category=sunglasses&lens=gradient" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Gradient</Link>
                          <Link href="/products?category=sunglasses&lens=photochromic" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Photochromic</Link>
                          <Link href="/products?category=sunglasses&lens=prescription" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Prescription</Link>
                        </div>

                        <h4 className="text-gray-400 font-semibold text-sm mb-3 uppercase tracking-wide">Kids</h4>
                        <div className="space-y-2">
                          <Link href="/products?category=sunglasses&gender=kids" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">All Kids Sunglasses</Link>
                          <Link href="/products?category=sunglasses&gender=kids&age=0-5" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Age 0-5 Years</Link>
                          <Link href="/products?category=sunglasses&gender=kids&age=6-12" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Age 6-12 Years</Link>
                        </div>
                      </div>

                      {/* Activities Section */}
                      <div>
                        <h3 className="text-red-500 font-bold text-lg mb-4 flex items-center gap-2">
                          <Sun className="h-5 w-5" />
                          By Activity
                        </h3>

                        <div className="space-y-2 mb-6">
                          <Link href="/products?category=sunglasses&activity=driving" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Driving</Link>
                          <Link href="/products?category=sunglasses&activity=sports" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Sports</Link>
                          <Link href="/products?category=sunglasses&activity=cycling" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Cycling</Link>
                          <Link href="/products?category=sunglasses&activity=running" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Running</Link>
                          <Link href="/products?category=sunglasses&activity=beach" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Beach/Casual</Link>
                          <Link href="/products?category=sunglasses&activity=fishing" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Fishing</Link>
                          <Link href="/products?category=sunglasses&activity=golf" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Golf</Link>
                        </div>

                        <h4 className="text-gray-400 font-semibold text-sm mb-3 uppercase tracking-wide">Frame Type</h4>
                        <div className="space-y-2">
                          <Link href="/products?category=sunglasses&frame_type=full-rim" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Full Rim</Link>
                          <Link href="/products?category=sunglasses&frame_type=half-rim" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Half Rim</Link>
                          <Link href="/products?category=sunglasses&frame_type=rimless" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Rimless</Link>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Banner */}
                    <div className="mt-8 pt-6 border-t border-gray-800">
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <Link href="/products?category=sunglasses&uv=400" className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group">
                          <div className="text-red-500 font-semibold mb-1 group-hover:scale-110 transition-transform">UV400 Protection</div>
                          <div className="text-gray-400 text-xs">100% UV Block</div>
                        </Link>
                        <Link href="/products?category=sunglasses&lens=polarized" className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group">
                          <div className="text-red-500 font-semibold mb-1 group-hover:scale-110 transition-transform">Polarized Collection</div>
                          <div className="text-gray-400 text-xs">Glare Free Vision</div>
                        </Link>
                        <Link href="/products?category=sunglasses&style=designer" className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group">
                          <div className="text-red-500 font-semibold mb-1 group-hover:scale-110 transition-transform">Designer Brands</div>
                          <div className="text-gray-400 text-xs">Luxury Collection</div>
                        </Link>
                        <Link href="/products?category=sunglasses&price=under-2000" className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group">
                          <div className="text-red-500 font-semibold mb-1 group-hover:scale-110 transition-transform">Under ₹2000</div>
                          <div className="text-gray-400 text-xs">Budget Friendly</div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Accessories with Mega Menu */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnterAccessories}
              onMouseLeave={handleMouseLeaveAccessories}
              onClick={(e) => e.stopPropagation()}
            >
              <Link href="/products?category=accessories" className="relative text-gray-300 transition-all duration-300 font-semibold text-sm xl:text-lg group">
                <span className="relative z-10">Accessories</span>
                {/* Active indicator - persistent when on accessories page */}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-300 ${
                  isMenuActive('accessories') ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>

              {/* Mega Menu Dropdown for Accessories */}
              {showAccessoriesMegaMenu && (
                <div className="absolute left-0 top-full mt-2 w-screen max-w-5xl bg-gray-900/98 backdrop-blur-lg border border-gray-800 rounded-lg shadow-2xl z-50 animate-fade-in-up">
                  <div className="p-8">
                    <div className="grid grid-cols-3 gap-8">
                      {/* Cases & Storage Section */}
                      <div>
                        <h3 className="text-red-500 font-bold text-lg mb-4 flex items-center gap-2">
                          <Package className="h-5 w-5" />
                          Cases & Storage
                        </h3>

                        <div className="space-y-2">
                          <Link href="/products?category=accessories&type=hard-case" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Hard Cases</Link>
                          <Link href="/products?category=accessories&type=soft-pouch" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Soft Pouches</Link>
                          <Link href="/products?category=accessories&type=leather-case" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Leather Cases</Link>
                          <Link href="/products?category=accessories&type=zipper-case" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Zipper Cases</Link>
                          <Link href="/products?category=accessories&type=travel-case" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Travel Cases</Link>
                          <Link href="/products?category=accessories&type=eyewear-stand" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Eyewear Stands</Link>
                          <Link href="/products?category=accessories&type=organizer" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Multi-Eyewear Organizers</Link>
                        </div>
                      </div>

                      {/* Cleaning & Care Section */}
                      <div>
                        <h3 className="text-red-500 font-bold text-lg mb-4 flex items-center gap-2">
                          <Package className="h-5 w-5" />
                          Cleaning & Care
                        </h3>

                        <div className="space-y-2 mb-6">
                          <Link href="/products?category=accessories&type=cleaning-cloth" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Microfiber Cloths</Link>
                          <Link href="/products?category=accessories&type=cleaning-solution" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Cleaning Solutions</Link>
                          <Link href="/products?category=accessories&type=cleaning-spray" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Cleaning Sprays</Link>
                          <Link href="/products?category=accessories&type=anti-fog" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Anti-Fog Spray</Link>
                          <Link href="/products?category=accessories&type=cleaning-kit" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Complete Cleaning Kits</Link>
                        </div>

                        <h4 className="text-gray-400 font-semibold text-sm mb-3 uppercase tracking-wide">Contact Lens Care</h4>
                        <div className="space-y-2">
                          <Link href="/products?category=accessories&type=lens-solution" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Lens Solutions</Link>
                          <Link href="/products?category=accessories&type=lens-case" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Lens Cases</Link>
                          <Link href="/products?category=accessories&type=lens-applicator" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Lens Applicators</Link>
                        </div>
                      </div>

                      {/* Chains, Straps & More Section */}
                      <div>
                        <h3 className="text-red-500 font-bold text-lg mb-4 flex items-center gap-2">
                          <Package className="h-5 w-5" />
                          Chains & Straps
                        </h3>

                        <div className="space-y-2 mb-6">
                          <Link href="/products?category=accessories&type=eyeglass-chain" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Eyeglass Chains</Link>
                          <Link href="/products?category=accessories&type=sports-strap" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Sports Straps</Link>
                          <Link href="/products?category=accessories&type=beaded-chain" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Beaded Chains</Link>
                          <Link href="/products?category=accessories&type=leather-cord" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Leather Cords</Link>
                          <Link href="/products?category=accessories&type=metal-chain" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Metal Chains</Link>
                        </div>

                        <h4 className="text-gray-400 font-semibold text-sm mb-3 uppercase tracking-wide">Repair & Parts</h4>
                        <div className="space-y-2">
                          <Link href="/products?category=accessories&type=repair-kit" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Repair Kits</Link>
                          <Link href="/products?category=accessories&type=nose-pads" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Nose Pads</Link>
                          <Link href="/products?category=accessories&type=screws" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Screws & Tools</Link>
                          <Link href="/products?category=accessories&type=temple-tips" className="block text-gray-300 hover:text-red-500 hover:translate-x-1 transition-all duration-200 text-sm">Temple Tips</Link>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Banner */}
                    <div className="mt-8 pt-6 border-t border-gray-800">
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <Link href="/products?category=accessories&bundle=essential" className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group">
                          <div className="text-red-500 font-semibold mb-1 group-hover:scale-110 transition-transform">Essential Bundle</div>
                          <div className="text-gray-400 text-xs">Save on Combos</div>
                        </Link>
                        <Link href="/products?category=accessories&gift=ready" className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group">
                          <div className="text-red-500 font-semibold mb-1 group-hover:scale-110 transition-transform">Gift Sets</div>
                          <div className="text-gray-400 text-xs">Perfect Presents</div>
                        </Link>
                        <Link href="/products?category=accessories&eco=friendly" className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group">
                          <div className="text-red-500 font-semibold mb-1 group-hover:scale-110 transition-transform">Eco-Friendly</div>
                          <div className="text-gray-400 text-xs">Sustainable Options</div>
                        </Link>
                        <Link href="/products?category=accessories&sort_by=popular" className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group">
                          <div className="text-red-500 font-semibold mb-1 group-hover:scale-110 transition-transform">Bestsellers</div>
                          <div className="text-gray-400 text-xs">Most Popular</div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-2 xl:mx-8 justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSearch(!showSearch);
              }}
              className="p-2 hover:bg-gray-800/50 rounded-full transition-all duration-300"
            >
              <Search className="h-5 w-5 xl:h-6 xl:w-6 text-gray-400 hover:text-red-500 transition-colors" />
            </button>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
            {/* Search Icon (Mobile) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSearch(true);
              }}
              className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-800/50 rounded-full transition-all duration-300"
            >
              <Search className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 hover:text-red-500 transition-colors" />
            </button>

            {/* Notification Bell Icon - Only for logged-in customers */}
            {isAuthenticated && user?.role === 'customer' && (
              <Link
                href="/notifications"
                className="relative p-1.5 sm:p-2 hover:bg-gray-800/50 rounded-full transition-all duration-300"
              >
                <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 hover:text-red-500 transition-colors" />
                {/* Notification Badge - show if there are unread notifications */}
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
              </Link>
            )}

            {/* Become a Reseller - Only show when not logged in */}
            {!isAuthenticated && (
              <Link
                href="/become-a-reseller"
                className="hidden md:flex items-center gap-1.5 text-gray-300 hover:text-red-500 transition-all duration-300 px-2 py-1.5 rounded-lg hover:bg-gray-800/50 font-normal text-sm"
              >
                <Store className="h-4 w-4" />
                <span>Become a Reseller</span>
              </Link>
            )}

            {/* Become a Seller - Only show when not logged in */}
            {!isAuthenticated && (
              <Link
                href="/become-a-seller"
                className="hidden md:flex items-center gap-1.5 text-gray-300 hover:text-red-500 transition-all duration-300 px-2 py-1.5 rounded-lg hover:bg-gray-800/50 font-normal text-sm"
              >
                <Store className="h-4 w-4" />
                <span>Become a Seller</span>
              </Link>
            )}

            {/* User Account */}
            <div className="relative">
              {isAuthenticated && user ? (
                <div>
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

                      {/* Menu Items - Role Based */}
                      <div className="py-2">
                        <Link
                          href={
                            user.role === 'seller' ? '/seller/profile' :
                            user.role === 'reseller' ? '/reseller/profile' :
                            '/profile'
                          }
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group"
                        >
                          <User className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
                          <span>My Profile</span>
                        </Link>

                        {/* Seller-specific menu items */}
                        {user.role === 'seller' && (
                          <>
                            <Link
                              href="/seller/admin"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group"
                            >
                              <Settings className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
                              <span>Dashboard</span>
                            </Link>
                          </>
                        )}

                        {/* Reseller-specific menu items */}
                        {user.role === 'reseller' && (
                          <>
                            <Link
                              href="/reseller/catalog"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group"
                            >
                              <Package className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
                              <span>Product Catalog</span>
                            </Link>
                            <Link
                              href="/reseller/shared-catalog"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group"
                            >
                              <Share2 className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
                              <span>Shared Catalog</span>
                            </Link>
                            <Link
                              href="/reseller/bulk-orders"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group"
                            >
                              <Package className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
                              <span>Bulk Orders</span>
                            </Link>
                            <Link
                              href="/reseller/pricing"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group"
                            >
                              <DollarSign className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
                              <span>Volume Pricing</span>
                            </Link>
                            <Link
                              href="/reseller/order-history"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group"
                            >
                              <FileText className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
                              <span>Order History</span>
                            </Link>
                            <Link
                              href="/reseller/analytics"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group"
                            >
                              <BarChart3 className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
                              <span>Analytics</span>
                            </Link>
                          </>
                        )}

                        {/* Customer-specific menu items */}
                        {user.role === 'customer' && (
                          <>
                            <Link
                              href="/orders"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group"
                            >
                              <Package className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
                              <span>My Orders</span>
                            </Link>

                            <Link
                              href="/wishlist"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group"
                            >
                              <Heart className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
                              <span>Wishlist</span>
                            </Link>

                            <Link
                              href="/addresses"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group"
                            >
                              <MapPin className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
                              <span>My Addresses</span>
                            </Link>

                            <Link
                              href="/enak-coin"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group"
                            >
                              <Coins className="h-5 w-5 text-gray-400 group-hover:text-yellow-500" />
                              <span>Enak Coin</span>
                            </Link>
                          </>
                        )}

                        <Link
                          href="/settings"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group"
                        >
                          <Settings className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
                          <span>Settings</span>
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
              ) : (
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowGuestMenu(!showGuestMenu);
                    }}
                    className="flex items-center gap-1 sm:gap-2 hover:bg-gray-800 px-1.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors text-white group"
                  >
                    <User className="h-5 w-5 sm:h-6 sm:w-6" />
                    <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 ${showGuestMenu ? 'rotate-180' : ''}`} />
                  </button>
                  {showGuestMenu && (
                    <div onClick={(e) => e.stopPropagation()} className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl py-2 z-50 animate-fade-in-up">
                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setShowGuestMenu(false);
                            router.push('/account');
                          }}
                          className="w-full text-left flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group"
                        >
                          <User className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
                          <span>Login / Register</span>
                        </button>

                        <Link
                          href="/contact"
                          onClick={() => setShowGuestMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group"
                        >
                          <MessageCircle className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
                          <span>Customer Support</span>
                        </Link>

                        <Link
                          href="/help"
                          onClick={() => setShowGuestMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group"
                        >
                          <HeadphonesIcon className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
                          <span>Help & FAQs</span>
                        </Link>

                        <Link
                          href="/settings"
                          onClick={() => setShowGuestMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group"
                        >
                          <Settings className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
                          <span>Settings</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link href="/cart" className="relative">
              <Button variant="ghost" className="relative hover:bg-gray-800 text-white p-1.5 sm:p-2">
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-orange-500 text-white text-[10px] sm:text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center animate-pulse">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden text-white p-1.5 sm:p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-2 sm:space-y-4 border-t border-gray-800">
            <Link
              href="/products?category=eyeglasses"
              className="block text-gray-300 hover:text-red-500 py-3 font-semibold text-lg border-l-4 border-transparent hover:border-red-600 pl-4 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Eyeglasses
            </Link>
            {/* Contact Lenses option */}
            <Link
              href="/products?category=contact-lenses"
              className="block text-gray-300 hover:text-red-500 py-3 font-semibold text-lg border-l-4 border-transparent hover:border-red-600 pl-4 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact Lenses
            </Link>
            <Link
              href="/products?category=sunglasses"
              className="block text-gray-300 hover:text-red-500 py-3 font-semibold text-lg border-l-4 border-transparent hover:border-red-600 pl-4 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sunglasses
            </Link>
            <Link
              href="/products?category=accessories"
              className="block text-gray-300 hover:text-red-500 py-3 font-semibold text-lg border-l-4 border-transparent hover:border-red-600 pl-4 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Accessories
            </Link>
            {/* Become a Reseller - Only show when not logged in */}
            {!isAuthenticated && (
              <Link
                href="/become-a-reseller"
                className="flex items-center gap-2 text-gray-300 hover:text-red-500 py-3 font-semibold text-lg border-l-4 border-transparent hover:border-red-600 pl-4 transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Store className="h-5 w-5" />
                Become a Reseller
              </Link>
            )}
            {/* Become a Seller - Only show when not logged in */}
            {!isAuthenticated && (
              <Link
                href="/become-a-seller"
                className="flex items-center gap-2 text-gray-300 hover:text-red-500 py-3 font-semibold text-lg border-l-4 border-transparent hover:border-red-600 pl-4 transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Store className="h-5 w-5" />
                Become a Seller
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Desktop Search Overlay */}
      {showSearch && (
        <div className="hidden md:block absolute top-full left-0 right-0 bg-gray-900/98 border-b border-gray-800 shadow-2xl z-40" onClick={(e) => e.stopPropagation()}>
          <div className="max-w-3xl mx-auto p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(searchQuery);
                    }
                  }}
                  placeholder="Type to search for glasses, sunglasses, frames..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  autoFocus
                />
                <Search className="absolute left-4 top-3.5 h-6 w-6 text-gray-400" />
              </div>
              <button
                onClick={() => handleSearch(searchQuery)}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold text-lg"
              >
                Search
              </button>
              <button
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery('');
                }}
                className="p-3 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Desktop Search Suggestions */}
            <div>
              <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wide">Popular Searches</p>
              <div className="grid grid-cols-2 gap-2">
                {searchSuggestions.slice(0, 8).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(suggestion)}
                    className="text-left px-4 py-2.5 text-gray-300 bg-gray-800/50 hover:bg-gray-800 hover:text-white rounded-lg transition-colors flex items-center gap-3"
                  >
                    <Search className="h-4 w-4 text-gray-500" />
                    <span>{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Search Overlay */}
      {showSearch && (
        <div className="md:hidden fixed inset-0 bg-black/95 z-50 p-4" onClick={(e) => e.stopPropagation()}>
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery('');
                }}
                className="text-white"
              >
                <X className="h-6 w-6" />
              </button>
              <h2 className="text-white text-lg font-semibold">Search Products</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(searchQuery);
                    }
                  }}
                  placeholder="Type to search for glasses..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  autoFocus
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
              <button
                onClick={() => handleSearch(searchQuery)}
                className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </div>

          {/* Mobile Search Suggestions */}
          <div className="space-y-2">
            <p className="text-xs text-gray-400 px-2 mb-3">Popular Searches</p>
            {searchSuggestions.slice(0, 8).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSearch(suggestion)}
                className="w-full text-left px-4 py-3 text-gray-300 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-3"
              >
                <Search className="h-4 w-4 text-gray-500" />
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
