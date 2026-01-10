// src/app/cart/page.tsx

'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Eye } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotal, setLensChoice, fetchCart, loading } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const total = getTotal();

  // Fetch cart from database on page load
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  // Check if all eyeglasses have lens choice selected (for customers only)
  const canProceedToCheckout = () => {
    if (!isAuthenticated) return true; // Non-authenticated users can always try
    if (user?.role !== 'customer') return true; // Non-customers don't need to select lens choice

    // Check if all eyeglasses items have a lens choice
    const eyeglassesItems = items.filter(item => item.product.category === 'eyeglasses');
    if (eyeglassesItems.length === 0) return true; // No eyeglasses, can proceed

    return eyeglassesItems.every(item => item.lensChoice && item.lensChoice !== 'none');
  };

  const handleProceedToCheckout = () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      alert('Please login to proceed with checkout');
      router.push('/account');
      return;
    }

    // Check if all eyeglasses have lens choice selected
    if (!canProceedToCheckout()) {
      alert('Please select a lens option for all eyeglasses before proceeding');
      return;
    }

    // Navigate to checkout page
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center py-20">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">Your Cart is Empty</h1>
          <p className="text-gray-400 text-xl mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/products" className="text-orange-500 hover:text-orange-400 flex items-center gap-2 mb-4">
            <ArrowLeft className="h-5 w-5" />
            Continue Shopping
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Shopping Cart</h1>
          <p className="text-gray-400">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-orange-500/50 transition"
              >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="relative h-32 w-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800">
                    <Image
                      src={(() => {
                        // Handle images - could be array, string, or null
                        let imageUrl = 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400';

                        if (item.product.images) {
                          // If it's already an array
                          if (Array.isArray(item.product.images) && item.product.images.length > 0) {
                            imageUrl = item.product.images[0];
                          }
                          // If it's a string that looks like JSON
                          else if (typeof item.product.images === 'string') {
                            try {
                              const parsed = JSON.parse(item.product.images);
                              if (Array.isArray(parsed) && parsed.length > 0) {
                                imageUrl = parsed[0];
                              }
                            } catch (e) {
                              // If parsing fails, use as-is if it's a URL
                              const imagesStr = item.product.images as string;
                              if (imagesStr.startsWith('http')) {
                                imageUrl = imagesStr;
                              }
                            }
                          }
                        }

                        return imageUrl;
                      })()}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">
                          {item.product.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          ID: {item.product.id}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-gray-400 hover:text-red-500 transition p-2 hover:bg-red-500/10 rounded-lg"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-orange-500">
                        ₹{item.product.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-gray-500 ml-2">per item</span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400">Quantity:</span>
                      <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-700 rounded-lg transition text-white"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-700 rounded-lg transition text-white"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <span className="text-gray-400 ml-auto">
                        Subtotal:{' '}
                        <span className="text-white font-semibold">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </span>
                    </div>

                    {/* Lens Options for Eyeglasses - Only for Customers */}
                    {item.product.category === 'eyeglasses' && isAuthenticated && user?.role === 'customer' && (
                      <div className="mt-4 pt-4 border-t border-gray-800">
                        {/* Show lens details if added */}
                        {item.lens && item.lensPrescription ? (
                          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Eye className="h-5 w-5 text-blue-400" />
                                <div>
                                  <p className="text-white font-semibold text-sm">{item.lens.name}</p>
                                  <p className="text-blue-400 text-sm">₹{item.lens.price.toLocaleString('en-IN')}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => router.push(`/lens-wizard?productId=${item.product.id}`)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg transition-colors"
                                title="Edit lens details"
                              >
                                <Eye className="h-4 w-4 text-blue-400" />
                                <span className="text-xs text-blue-400 font-medium">Edit</span>
                              </button>
                            </div>

                            {/* Prescription details */}
                            <div className="mt-2 pt-2 border-t border-blue-500/30">
                              <p className="text-xs text-gray-400 mb-1">
                                Method: {item.lensPrescription.entryMethod === 'upload' ? 'Uploaded Prescription' : 'Manual Entry'}
                              </p>
                              {item.lensPrescription.entryMethod === 'manual' && (
                                <div className="text-xs text-gray-300">
                                  {item.lensPrescription.sameForBothEyes ? (
                                    <p>Power: SPH {item.lensPrescription.bothEyes?.sphere}</p>
                                  ) : (
                                    <>
                                      <p>Left Eye: SPH {item.lensPrescription.leftEye?.sphere}</p>
                                      <p>Right Eye: SPH {item.lensPrescription.rightEye?.sphere}</p>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-gray-300 font-semibold mb-3 text-sm">Select Lens Option:</p>

                            <div className="space-y-3">
                              {/* Option 1: Continue without Lenses */}
                              <button
                                onClick={() => setLensChoice(item.product.id, 'without-lens')}
                                className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                                  item.lensChoice === 'without-lens'
                                    ? 'border-orange-500 bg-orange-500/10'
                                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                      item.lensChoice === 'without-lens'
                                        ? 'border-orange-500 bg-orange-500'
                                        : 'border-gray-600'
                                    }`}>
                                      {item.lensChoice === 'without-lens' && (
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                      )}
                                    </div>
                                    <div>
                                      <p className="text-white font-semibold text-sm">Continue without Lenses</p>
                                      <p className="text-gray-400 text-xs mt-0.5">
                                        Use your own lenses or purchase separately
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </button>

                              {/* Option 2: Add Lens to your Frame */}
                              <button
                                onClick={() => {
                                  // Navigate to lens wizard page
                                  router.push(`/lens-wizard?productId=${item.product.id}`);
                                }}
                                className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                                  item.lensChoice === 'with-lens'
                                    ? 'border-blue-500 bg-blue-500/10'
                                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                      item.lensChoice === 'with-lens'
                                        ? 'border-blue-500 bg-blue-500'
                                        : 'border-gray-600'
                                    }`}>
                                      {item.lensChoice === 'with-lens' && (
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                      )}
                                    </div>
                                    <div>
                                      <p className="text-white font-semibold text-sm">Add Lens to your Frame</p>
                                      <p className="text-gray-400 text-xs mt-0.5">
                                        Choose from our premium lens options
                                      </p>
                                    </div>
                                  </div>
                                  {item.lensChoice === 'with-lens' && (
                                    <Eye className="h-5 w-5 text-blue-400" />
                                  )}
                                </div>
                              </button>
                            </div>

                            {/* Show warning if no option selected */}
                            {(!item.lensChoice || item.lensChoice === 'none') && (
                              <p className="text-yellow-500 text-xs mt-2 flex items-center gap-1">
                                <span className="inline-block w-1 h-1 bg-yellow-500 rounded-full"></span>
                                Please select one option to proceed to checkout
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span className="text-green-500">FREE</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax (18% GST)</span>
                  <span>₹{Math.round(total * 0.18).toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold text-white">Total</span>
                    <span className="text-2xl font-bold text-orange-500">
                      ₹{Math.round(total * 1.18).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className={`w-full font-semibold text-lg mb-4 transition-all duration-300 ${
                  canProceedToCheckout()
                    ? 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-60'
                }`}
                onClick={handleProceedToCheckout}
                disabled={!canProceedToCheckout()}
              >
                Proceed to Checkout
              </Button>

              {/* Show warning message if customer hasn't selected lens options */}
              {isAuthenticated && user?.role === 'customer' && !canProceedToCheckout() && (
                <p className="text-yellow-500 text-xs text-center mb-4 flex items-center justify-center gap-2">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Please select lens options for all eyeglasses
                </p>
              )}

              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Free shipping on all orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>14-day easy returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Secure payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-6">You May Also Like</h2>
          <p className="text-gray-400 mb-8">Complete your look with these popular items</p>
          {/* Add recommended products here */}
        </div>
      </div>
    </div>
  );
}
