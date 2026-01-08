'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ClearAuthPage() {
  const { logout, user } = useAuthStore();
  const router = useRouter();
  const [cleared, setCleared] = useState(false);

  const handleClearAuth = () => {
    // Clear auth store
    logout();

    // Clear all localStorage
    localStorage.clear();

    // Clear sessionStorage
    sessionStorage.clear();

    setCleared(true);
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Clear Authentication Data</h1>

        <div className="bg-zinc-900 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-red-500">Current Status</h2>
          {user ? (
            <div className="space-y-2">
              <p className="text-lg">
                <span className="text-gray-400">Name:</span>{' '}
                <span className="text-white">{user.first_name} {user.last_name}</span>
              </p>
              <p className="text-lg">
                <span className="text-gray-400">Email:</span>{' '}
                <span className="text-white">{user.email}</span>
              </p>
              <p className="text-lg">
                <span className="text-gray-400">Role:</span>{' '}
                <span className="text-white">{user.role || 'NOT SET (This is the problem!)'}</span>
              </p>
            </div>
          ) : (
            <p className="text-lg text-green-500">No user data found - You are logged out!</p>
          )}
        </div>

        {!cleared ? (
          <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-yellow-500">⚠️ Instructions</h2>
            <ol className="list-decimal list-inside space-y-3 text-lg">
              <li>Click the "Clear All Data & Logout" button below</li>
              <li>Then click "Go to Registration Page"</li>
              <li>Register again as a <strong>Seller</strong></li>
              <li>Make sure to select <strong>"Seller"</strong> in the first step</li>
              <li>Fill in all required information including business details</li>
              <li>After successful registration, the seller menu will appear!</li>
            </ol>
          </div>
        ) : (
          <div className="bg-green-900/30 border border-green-600 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-green-500">✓ Success!</h2>
            <p className="text-lg mb-4">
              All authentication data has been cleared. You are now logged out.
            </p>
            <p className="text-lg">
              Click the button below to go to the registration page and create a new seller account.
            </p>
          </div>
        )}

        <div className="flex gap-4">
          {!cleared ? (
            <button
              onClick={handleClearAuth}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-lg transition-colors"
            >
              Clear All Data & Logout
            </button>
          ) : (
            <>
              <button
                onClick={() => router.push('/account')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg transition-colors"
              >
                Go to Registration Page
              </button>
              <button
                onClick={() => router.push('/')}
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-4 rounded-lg transition-colors"
              >
                Go to Home
              </button>
            </>
          )}
        </div>

        <div className="mt-8 bg-blue-900/30 border border-blue-600 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-500">ℹ️ What Was Wrong?</h2>
          <p className="text-lg mb-4">
            The backend API had a bug where it wasn't saving the <strong>role</strong> field
            during registration. This has now been <strong>FIXED</strong>!
          </p>
          <p className="text-lg mb-4">
            Your old account was created with the bug, so it doesn't have a role assigned.
            That's why you don't see the seller menu options.
          </p>
          <p className="text-lg">
            When you re-register now, the role will be saved correctly and you'll see all
            the seller-specific menu items like Catalog Management, Orders, Analytics, etc.
          </p>
        </div>
      </div>
    </div>
  );
}
