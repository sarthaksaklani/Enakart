'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AlertCircle, MessageSquare, CheckCircle2, Clock } from 'lucide-react';

export default function ComplaintsPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'seller') {
      router.push('/account');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'seller') {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Complaints & Issues</h1>
          <p className="text-gray-400">Handle customer complaints and issues</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-900 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400">Open</h3>
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold">0</p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400">In Progress</h3>
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold">0</p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400">Resolved</h3>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold">0</p>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg p-8">
          <div className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">No Complaints</h3>
            <p className="text-gray-400 text-center">
              Customer complaints will appear here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
