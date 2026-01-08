'use client';

import { BackButton } from '@/components/reseller/BackButton';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Plus, ShoppingCart } from 'lucide-react';

export default function BulkOrdersPage() {
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Bulk Orders</h1>
            <p className="text-gray-400">Place and manage your bulk orders</p>
          </div>
          <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition-colors">
            <Plus className="w-5 h-5" />
            New Bulk Order
          </button>
        </div>

        <div className="bg-zinc-900 rounded-lg p-8">
          <div className="flex flex-col items-center justify-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">No Active Orders</h3>
            <p className="text-gray-400 text-center mb-6">
              Start by creating your first bulk order
            </p>
            <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition-colors">
              Create Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
