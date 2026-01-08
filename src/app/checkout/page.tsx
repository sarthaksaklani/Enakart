// src/app/checkout/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, CreditCard, Truck, Package, CheckCircle } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';

interface ShippingAddress {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  pincode: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart, fetchCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const [step, setStep] = useState<'address' | 'review' | 'payment'>('address');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    full_name: user ? `${user.first_name} ${user.last_name}` : '',
    phone: user?.mobile || '',
    address_line1: user?.address_line1 || '',
    address_line2: user?.address_line2 || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
  });

  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});

  const subtotal = getTotal();
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch cart and redirect if not authenticated or cart is empty
  useEffect(() => {
    if (!isAuthenticated) {
      alert('Please login to proceed with checkout');
      router.push('/account');
      return;
    }

    // Fetch cart from database
    fetchCart();
  }, [isAuthenticated, fetchCart, router]);

  // Check if cart is empty after fetching
  useEffect(() => {
    if (isAuthenticated && items.length === 0) {
      // Give a moment for cart to load
      const timer = setTimeout(() => {
        if (items.length === 0) {
          router.push('/cart');
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, items, router]);

  const validateAddress = (): boolean => {
    const newErrors: Partial<ShippingAddress> = {};

    if (!shippingAddress.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    if (!shippingAddress.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(shippingAddress.phone)) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
    }

    if (!shippingAddress.address_line1.trim()) {
      newErrors.address_line1 = 'Address is required';
    }

    if (!shippingAddress.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!shippingAddress.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!shippingAddress.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(shippingAddress.pincode)) {
      newErrors.pincode = 'Enter a valid 6-digit pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAddress()) {
      setStep('review');
    }
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);

    try {
      // Helper to extract first image from various formats
      const getFirstImage = (images: any): string => {
        let imageUrl = 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400';

        if (images) {
          if (Array.isArray(images) && images.length > 0) {
            imageUrl = images[0];
          } else if (typeof images === 'string') {
            try {
              const parsed = JSON.parse(images);
              if (Array.isArray(parsed) && parsed.length > 0) {
                imageUrl = parsed[0];
              }
            } catch (e) {
              if (images.startsWith('http')) {
                imageUrl = images;
              }
            }
          }
        }

        return imageUrl;
      };

      // Step 1: Create order in database
      const orderData = {
        user_id: user?.id,
        items: items.map((item) => ({
          product_id: item.product.id,
          product_name: item.product.name,
          product_image: getFirstImage(item.product.images),
          quantity: item.quantity,
          price: item.product.price,
          prescription_file: item.prescription_file,
        })),
        shipping_address: shippingAddress,
        total_amount: total,
        subtotal: subtotal,
        tax: tax,
      };

      const orderResponse = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || '',
        },
        body: JSON.stringify(orderData),
      });

      const orderResult = await orderResponse.json();

      if (!orderResult.success) {
        alert(orderResult.error || 'Failed to create order. Please try again.');
        setIsSubmitting(false);
        return;
      }

      const orderId = orderResult.data.order_id;
      console.log('✅ Order created:', orderId);

      // Step 2: Create Razorpay payment order
      const paymentResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'INR',
          order_id: orderId,
        }),
      });

      const paymentResult = await paymentResponse.json();

      if (!paymentResult.success) {
        alert('Failed to initialize payment. Please try again.');
        setIsSubmitting(false);
        return;
      }

      const razorpayOrder = paymentResult.order;
      const testMode = paymentResult.testMode;

      console.log('💳 Razorpay order created:', razorpayOrder.id);

      // Step 3: Open Razorpay payment modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_dummy',
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'एnakart',
        description: `Order #${orderId}`,
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          // Payment successful, verify on backend
          console.log('💰 Payment successful:', response);

          try {
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: orderId,
                testMode: testMode,
              }),
            });

            const verifyResult = await verifyResponse.json();

            if (verifyResult.success) {
              // Payment verified, clear cart and redirect
              await clearCart();
              router.push(`/orders/${orderId}?payment=success`);
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: shippingAddress.full_name,
          contact: shippingAddress.phone,
        },
        theme: {
          color: '#f97316', // Orange-500
        },
        modal: {
          ondismiss: function() {
            console.log('⚠️ Payment cancelled');
            alert('Payment was cancelled. Your order is saved and you can complete payment later.');
            setIsSubmitting(false);
          }
        }
      };

      // Check if Razorpay is loaded
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          console.error('❌ Payment failed:', response.error);
          alert(`Payment failed: ${response.error.description}`);
          setIsSubmitting(false);
        });
        rzp.open();
      } else {
        alert('Payment gateway not loaded. Please refresh and try again.');
        setIsSubmitting(false);
      }

    } catch (error) {
      console.error('Order submission error:', error);
      alert('Failed to place order. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated || items.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => step === 'address' ? router.push('/cart') : setStep('address')}
            className="text-orange-500 hover:text-orange-400 flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            {step === 'address' ? 'Back to Cart' : 'Back to Address'}
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">Checkout</h1>
          <p className="text-gray-400">Complete your order</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 ${step === 'address' ? 'text-orange-500' : 'text-gray-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 'address' ? 'bg-orange-500 text-white' : 'bg-gray-800'}`}>
                <Truck className="h-5 w-5" />
              </div>
              <span className="font-semibold hidden sm:inline">Shipping</span>
            </div>
            <div className="w-20 h-1 bg-gray-800"></div>
            <div className={`flex items-center gap-2 ${step === 'review' ? 'text-orange-500' : 'text-gray-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 'review' ? 'bg-orange-500 text-white' : 'bg-gray-800'}`}>
                <Package className="h-5 w-5" />
              </div>
              <span className="font-semibold hidden sm:inline">Review</span>
            </div>
            <div className="w-20 h-1 bg-gray-800"></div>
            <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-orange-500' : 'text-gray-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-orange-500 text-white' : 'bg-gray-800'}`}>
                <CreditCard className="h-5 w-5" />
              </div>
              <span className="font-semibold hidden sm:inline">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Shipping Address Form */}
            {step === 'address' && (
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h2 className="text-2xl font-bold text-white mb-6">Shipping Address</h2>
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.full_name}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, full_name: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter your full name"
                    />
                    {errors.full_name && (
                      <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="10-digit mobile number"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.address_line1}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, address_line1: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="House no., Building name"
                    />
                    {errors.address_line1 && (
                      <p className="text-red-500 text-sm mt-1">{errors.address_line1}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.address_line2}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, address_line2: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Road name, Area, Colony"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, city: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="City"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.state}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, state: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="State"
                      />
                      {errors.state && (
                        <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.pincode}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, pincode: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="6-digit pincode"
                      maxLength={6}
                    />
                    {errors.pincode && (
                      <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg"
                  >
                    Continue to Review
                  </Button>
                </form>
              </div>
            )}

            {/* Order Review */}
            {step === 'review' && (
              <div className="space-y-6">
                {/* Shipping Address Review */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white">Shipping Address</h2>
                    <button
                      onClick={() => setStep('address')}
                      className="text-orange-500 hover:text-orange-400 text-sm font-semibold"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="text-gray-300 space-y-1">
                    <p className="font-semibold text-white">{shippingAddress.full_name}</p>
                    <p>{shippingAddress.phone}</p>
                    <p>{shippingAddress.address_line1}</p>
                    {shippingAddress.address_line2 && <p>{shippingAddress.address_line2}</p>}
                    <p>
                      {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h2 className="text-2xl font-bold text-white mb-6">Order Items</h2>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-4">
                        <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800">
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
                                    if (item.product.images.startsWith('http')) {
                                      imageUrl = item.product.images;
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
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">{item.product.name}</h3>
                          <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                          <p className="text-orange-500 font-semibold">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Placing Order...
                    </div>
                  ) : (
                    'Place Order'
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal ({items.length} items)</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span className="text-green-500">FREE</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax (18% GST)</span>
                  <span>₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold text-white">Total</span>
                    <span className="text-2xl font-bold text-orange-500">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Free shipping on all orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>14-day easy returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Secure payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
