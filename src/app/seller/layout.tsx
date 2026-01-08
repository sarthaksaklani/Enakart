// src/app/seller/layout.tsx

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, ChevronDown, LogOut, HeadphonesIcon, MessageCircle, Bell } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useState, useEffect } from 'react';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Check if we're in the admin panel or any seller page
  const isAdminPanel = pathname?.startsWith('/seller');

  // Hide header on dashboard page
  const isDashboardPage = pathname === '/seller/admin';

  // Check if we're on the profile page
  const isProfilePage = pathname === '/seller/profile';

  // Check if we're on the lens details page (it has its own back button)
  const isLensDetailsPage = pathname === '/seller/lens-details';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false);
    };

    if (showUserMenu) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <div className="min-h-screen bg-black">
      {/* Dashboard Navbar - Shown on all seller pages except dashboard */}
      {isAdminPanel && !isDashboardPage && (
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

              {/* Right Side - Notification & Account Menu */}
              <div className="flex items-center gap-2 sm:gap-4">
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

                {/* Account Menu */}
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
                      {user?.first_name}
                    </span>
                    <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {showUserMenu && (
                    <div onClick={(e) => e.stopPropagation()} className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl py-2 z-50 animate-fade-in-up">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-700">
                        <p className="text-white font-semibold">{user?.first_name} {user?.last_name}</p>
                        <p className="text-gray-400 text-sm truncate">{user?.email}</p>
                      </div>

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
        </nav>
      )}

      {/* Back to Dashboard/Home Link - Below Navbar */}
      {isAdminPanel && !isDashboardPage && !isLensDetailsPage && (
        <div className="bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href={isProfilePage ? "/" : "/seller/admin"}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">{isProfilePage ? "Back to Home" : "Back to Dashboard"}</span>
            </Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
