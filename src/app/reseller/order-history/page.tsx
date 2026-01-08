'use client';

import { BackButton } from '@/components/reseller/BackButton';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OrderHistoryPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'reseller') {
      router.push('/account');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'reseller') {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <BackButton />
        <h1 className="text-4xl font-bold mb-2">Order History</h1>
        <p className="text-gray-400">View your past bulk orders and transactions</p>
      </div>
    </div>
  );
}
