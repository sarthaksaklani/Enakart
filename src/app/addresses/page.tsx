// src/app/addresses/page.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, ArrowLeft, Plus, Home, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

export default function AddressesPage() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <MapPin className="h-20 w-20 text-gray-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Login Required</h2>
          <p className="text-gray-400 mb-8">
            Please login to manage your addresses
          </p>
          <Link href="/account">
            <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Mock addresses
  const addresses = [
    {
      id: 1,
      type: 'Home',
      icon: Home,
      name: `${user?.first_name} ${user?.last_name}`,
      address: user?.address_line1 || '123 Main Street',
      city: user?.city || 'Mumbai',
      state: user?.state || 'Maharashtra',
      pincode: user?.pincode || '400001',
      isDefault: true,
    },
    {
      id: 2,
      type: 'Work',
      icon: Briefcase,
      name: `${user?.first_name} ${user?.last_name}`,
      address: '456 Office Complex',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400002',
      isDefault: false,
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">My Addresses</h1>
              <p className="text-gray-400 mt-2">Manage your saved addresses</p>
            </div>
            <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3">
              <Plus className="h-5 w-5 mr-2" />
              Add New Address
            </Button>
          </div>
        </div>
      </div>

      {/* Addresses List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 hover:border-red-600/50 transition-all duration-300 group relative"
            >
              {address.isDefault && (
                <span className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">
                  Default
                </span>
              )}

              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-zinc-800 rounded-lg">
                  <address.icon className="h-6 w-6 text-red-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">{address.type}</h3>
                  <p className="text-gray-400 text-sm">{address.name}</p>
                </div>
              </div>

              <div className="space-y-1 text-gray-300 mb-6">
                <p>{address.address}</p>
                <p>
                  {address.city}, {address.state} - {address.pincode}
                </p>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2">
                  Edit
                </Button>
                <Button className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-red-400 hover:text-red-300 py-2">
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
