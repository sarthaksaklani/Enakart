// src/app/account/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { RegistrationForm } from '@/components/auth/RegistrationForm';
import { LoginForm } from '@/components/auth/LoginForm';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  // Use useEffect for redirects to avoid setState during render
  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect all authenticated users to home page
      // They can access dashboards via navbar links
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  if (isAuthenticated && user) {
    // All authenticated users are redirected to home page
    // Show loading/nothing while redirecting
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="text-red-600">ए</span>nakart
          </h1>
          <p className="text-gray-400">Your Account Portal</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 shadow-xl overflow-hidden">
          <div className="flex border-b border-gray-800">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all ${
                activeTab === 'login'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all ${
                activeTab === 'register'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'login' ? <LoginForm /> : <RegistrationForm />}
          </div>
        </div>

        <p className="text-center text-gray-400 mt-6 text-sm">
          {activeTab === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <button
                onClick={() => setActiveTab('register')}
                className="text-red-500 hover:text-red-400 font-semibold"
              >
                Register here
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setActiveTab('login')}
                className="text-red-500 hover:text-red-400 font-semibold"
              >
                Login here
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
