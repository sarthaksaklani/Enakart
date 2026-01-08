// src/app/wishlist/page.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ArrowLeft, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { ProductCard } from '@/components/products/ProductCard';
import { dummyProducts } from '@/lib/data/dummyProducts';

export default function WishlistPage() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Heart className="h-20 w-20 text-gray-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Login Required</h2>
          <p className="text-gray-400 mb-8">
            Please login to view your wishlist
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

  // Mock wishlist items (first 4 products)
  const wishlistItems = dummyProducts.slice(0, 4);

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
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 text-red-500 fill-red-500" />
            <div>
              <h1 className="text-3xl font-bold text-white">My Wishlist</h1>
              <p className="text-gray-400 mt-1">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wishlist Items */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {wishlistItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Heart className="h-20 w-20 text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Your Wishlist is Empty</h2>
            <p className="text-gray-400 mb-8">
              Save your favorite items to buy them later
            </p>
            <Link href="/products">
              <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Start Shopping
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
