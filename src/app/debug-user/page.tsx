'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function DebugUserPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Debug User Information</h1>
          <div className="bg-red-900 rounded-lg p-6">
            <p className="text-xl">You are not logged in!</p>
            <button
              onClick={() => router.push('/account')}
              className="mt-4 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Debug User Information</h1>

        <div className="bg-zinc-900 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-red-500">Authentication Status</h2>
          <div className="space-y-2">
            <p className="text-lg">
              <span className="text-gray-400">Is Authenticated:</span>{' '}
              <span className={isAuthenticated ? 'text-green-500' : 'text-red-500'}>
                {isAuthenticated ? 'YES' : 'NO'}
              </span>
            </p>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-red-500">User Role Information</h2>
          <div className="space-y-2">
            <p className="text-lg">
              <span className="text-gray-400">Role:</span>{' '}
              <span className="text-white font-bold">{user?.role || 'UNDEFINED'}</span>
            </p>
            <p className="text-lg">
              <span className="text-gray-400">Role Type:</span>{' '}
              <span className="text-white">{typeof user?.role}</span>
            </p>
            <p className="text-lg">
              <span className="text-gray-400">Is Seller?:</span>{' '}
              <span className={user?.role === 'seller' ? 'text-green-500' : 'text-red-500'}>
                {user?.role === 'seller' ? 'YES' : 'NO'}
              </span>
            </p>
            <p className="text-lg">
              <span className="text-gray-400">Is Reseller?:</span>{' '}
              <span className={user?.role === 'reseller' ? 'text-green-500' : 'text-red-500'}>
                {user?.role === 'reseller' ? 'YES' : 'NO'}
              </span>
            </p>
            <p className="text-lg">
              <span className="text-gray-400">Is Customer?:</span>{' '}
              <span className={user?.role === 'customer' ? 'text-green-500' : 'text-red-500'}>
                {user?.role === 'customer' ? 'YES' : 'NO'}
              </span>
            </p>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-red-500">Full User Object</h2>
          <pre className="bg-black p-4 rounded overflow-auto text-sm">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div className="bg-zinc-900 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-red-500">What Should Happen</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 mb-2">If you are a SELLER, you should see these menu items in the navbar dropdown:</p>
              <ul className="list-disc list-inside space-y-1 text-white">
                <li>My Profile</li>
                <li>Catalog Management</li>
                <li>Orders</li>
                <li>Analytics</li>
                <li>Complaints</li>
                <li>Messages</li>
                <li>Settings</li>
              </ul>
            </div>

            {user?.role !== 'seller' && (
              <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4 mt-4">
                <p className="text-yellow-400 font-bold mb-2">⚠️ Problem Detected!</p>
                <p className="text-yellow-300">
                  Your role is <strong>"{user?.role}"</strong> but it should be <strong>"seller"</strong> to see seller menu items.
                </p>
                <p className="text-yellow-300 mt-2">
                  You need to re-register with a seller account or update your role in the database.
                </p>
              </div>
            )}

            {user?.role === 'seller' && (
              <div className="bg-green-900/30 border border-green-600 rounded-lg p-4 mt-4">
                <p className="text-green-400 font-bold mb-2">✓ Role is Correct!</p>
                <p className="text-green-300">
                  Your role is correctly set to "seller". The seller menu items should be visible in the navbar dropdown.
                </p>
                <p className="text-green-300 mt-2">
                  If you still don't see them, try refreshing the page or clearing your browser cache.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => router.push('/account')}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold"
          >
            Go to Account
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-zinc-700 hover:bg-zinc-600 px-6 py-3 rounded-lg font-semibold"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
}
