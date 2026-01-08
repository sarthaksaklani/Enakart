// src/app/orders/[id]/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Download,
  Home,
  XCircle,
  RotateCcw,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import InvoiceTemplate from '@/components/invoice/InvoiceTemplate';

import type { Order, OrderSource } from '@/types';

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/account');
      return;
    }

    // In a real app, fetch order details from API
    // For now, we'll create a mock order based on the order ID
    // Determine order source based on user role
    const orderSource: OrderSource = user?.role === 'reseller' ? 'reseller' : 'customer';

    const mockOrder: Order = {
      id: params.id as string,
      user_id: user?.id || '',
      order_number: `ORD-${Date.now()}`,
      order_source: orderSource,
      status: 'pending',
      payment_status: 'pending',
      total_amount: 5000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      shipping_address: {
        id: '1',
        user_id: user?.id || '',
        full_name: user ? `${user.first_name} ${user.last_name}` : 'Customer Name',
        phone: user?.mobile || '9876543210',
        address_line1: user?.address_line1 || '123 Main Street',
        address_line2: user?.address_line2,
        city: user?.city || 'Mumbai',
        state: user?.state || 'Maharashtra',
        pincode: user?.pincode || '400001',
        is_default: true,
      },
      items: [],
    };

    setOrder(mockOrder);
    setIsLoading(false);
  }, [params.id, isAuthenticated, router, user]);

  const handleCancelOrder = async () => {
    if (!order || isCancelling) return;

    const confirmCancel = window.confirm('Are you sure you want to cancel this order?');
    if (!confirmCancel) return;

    setIsCancelling(true);

    try {
      const response = await fetch('/api/orders/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: order.id }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Order cancelled successfully!');
        setOrder({ ...order, status: 'cancelled' });
      } else {
        alert('Failed to cancel order. Please try again.');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReturnOrder = async () => {
    if (!order || isReturning) return;

    const confirmReturn = window.confirm(
      'Are you sure you want to return this order? Our team will contact you for pickup.'
    );
    if (!confirmReturn) return;

    setIsReturning(true);

    try {
      const response = await fetch('/api/orders/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: order.id }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Return request submitted successfully! Our team will contact you soon.');
        setOrder({ ...order, status: 'return_requested' });
      } else {
        alert('Failed to submit return request. Please try again.');
      }
    } catch (error) {
      console.error('Error requesting return:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsReturning(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Order not found</h2>
          <Link href="/products">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate subtotal and tax from order items
  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% GST

  const handleDownloadInvoice = () => {
    if (showInvoice) {
      window.print();
    } else {
      setShowInvoice(true);
      setTimeout(() => window.print(), 100);
    }
  };

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/orders"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to My Orders
        </Link>

        {/* Dynamic Status Message */}
        {order.status === 'cancelled' ? (
          <div className="bg-gradient-to-r from-red-900/50 to-gray-900/50 border-2 border-red-500 rounded-xl p-8 mb-8 text-center">
            <XCircle className="h-20 w-20 text-red-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-2">Order Cancelled</h1>
            <p className="text-gray-300 text-lg mb-4">
              This order has been cancelled. Refund will be processed within 5-7 business days.
            </p>
            <div className="bg-black/30 rounded-lg p-4 inline-block">
              <p className="text-gray-400 text-sm mb-1">Order Number</p>
              <p className="text-2xl font-bold text-red-500">{order.order_number}</p>
            </div>
          </div>
        ) : order.status === 'return_requested' ? (
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-2 border-purple-500 rounded-xl p-8 mb-8 text-center">
            <RotateCcw className="h-20 w-20 text-purple-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-2">Return Request Submitted</h1>
            <p className="text-gray-300 text-lg mb-4">
              Your return request has been received. Our team will contact you within 24 hours to arrange pickup.
            </p>
            <div className="bg-black/30 rounded-lg p-4 inline-block">
              <p className="text-gray-400 text-sm mb-1">Order Number</p>
              <p className="text-2xl font-bold text-purple-400">{order.order_number}</p>
            </div>
          </div>
        ) : order.status === 'delivered' ? (
          <div className="bg-gradient-to-r from-green-900/50 to-green-800/50 border-2 border-green-500 rounded-xl p-8 mb-8 text-center">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-2">Order Delivered</h1>
            <p className="text-gray-300 text-lg mb-4">
              Your order has been successfully delivered. Thank you for shopping with us!
            </p>
            <div className="bg-black/30 rounded-lg p-4 inline-block">
              <p className="text-gray-400 text-sm mb-1">Order Number</p>
              <p className="text-2xl font-bold text-green-500">{order.order_number}</p>
            </div>
          </div>
        ) : order.status === 'shipped' ? (
          <div className="bg-gradient-to-r from-blue-900/50 to-indigo-800/50 border-2 border-blue-500 rounded-xl p-8 mb-8 text-center">
            <Truck className="h-20 w-20 text-blue-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-2">Order Shipped</h1>
            <p className="text-gray-300 text-lg mb-4">
              Your order is on its way! Track your shipment to see delivery progress.
            </p>
            <div className="bg-black/30 rounded-lg p-4 inline-block">
              <p className="text-gray-400 text-sm mb-1">Order Number</p>
              <p className="text-2xl font-bold text-blue-400">{order.order_number}</p>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-green-900/50 to-green-800/50 border-2 border-green-500 rounded-xl p-8 mb-8 text-center">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-300 text-lg mb-4">
              Thank you for your order. We have received your order and will process it shortly.
            </p>
            <div className="bg-black/30 rounded-lg p-4 inline-block">
              <p className="text-gray-400 text-sm mb-1">Order Number</p>
              <p className="text-2xl font-bold text-orange-500">{order.order_number}</p>
            </div>
          </div>
        )}

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Order Info */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-500" />
              Order Information
            </h2>
            <div className="space-y-3 text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-400">Order ID:</span>
                <span className="font-semibold">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Order Date:</span>
                <span className="font-semibold">
                  {new Date(order.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-sm font-semibold">
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Payment Status:</span>
                <span className="px-3 py-1 bg-orange-500/20 text-orange-500 rounded-full text-sm font-semibold">
                  {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Truck className="h-5 w-5 text-orange-500" />
              Delivery Information
            </h2>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-400 text-sm">Expected Delivery</p>
                  <p className="font-semibold">
                    {deliveryDate.toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Truck className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-400 text-sm">Shipping</p>
                  <p className="font-semibold text-green-500">Free Delivery</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Package className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-400 text-sm">Tracking</p>
                  <p className="font-semibold">Available after shipment</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-orange-500" />
            Shipping Address
          </h2>
          <div className="text-gray-300 space-y-1">
            <p className="font-semibold text-white text-lg">{order.shipping_address.full_name}</p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              {order.shipping_address.phone}
            </p>
            <p className="mt-2">{order.shipping_address.address_line1}</p>
            {order.shipping_address.address_line2 && (
              <p>{order.shipping_address.address_line2}</p>
            )}
            <p>
              {order.shipping_address.city}, {order.shipping_address.state} -{' '}
              {order.shipping_address.pincode}
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-orange-500" />
            Payment Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-300">
              <span>Subtotal</span>
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
            <div className="border-t border-gray-700 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold text-white">Total Amount</span>
                <span className="text-2xl font-bold text-orange-500">
                  ₹{order.total_amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Action Alerts - Cancel/Return/Info Note */}
        {order.status !== 'cancelled' && order.status !== 'return_requested' && (
          <div className="mb-8">
            {/* Cancel Order - Before Shipped */}
            {(order.status === 'pending' ||
              order.status === 'confirmed' ||
              order.status === 'processing') && (
              <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-600/50 rounded-xl p-6 mb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <XCircle className="h-6 w-6 text-red-500 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        Need to Cancel?
                      </h3>
                      <p className="text-gray-300 text-sm mb-4">
                        You can cancel this order anytime before it's shipped. Once cancelled,
                        you'll receive a full refund within 5-7 business days.
                      </p>
                    </div>
                  </div>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white whitespace-nowrap ml-4"
                    onClick={handleCancelOrder}
                    disabled={isCancelling}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                  </Button>
                </div>
              </div>
            )}

            {/* Info Note - Between Shipped and Delivered */}
            {order.status === 'shipped' && (
              <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-600/50 rounded-xl p-6 mb-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-blue-400 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      Order In Transit
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Your order is on its way! You can exchange or return this order after
                      it's delivered. We offer a hassle-free return policy within 7 days of delivery.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Return Order - After Delivered */}
            {order.status === 'delivered' && (
              <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-600/50 rounded-xl p-6 mb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <RotateCcw className="h-6 w-6 text-purple-400 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        Return or Exchange
                      </h3>
                      <p className="text-gray-300 text-sm mb-4">
                        Not satisfied with your order? You can return or exchange it within 7 days
                        of delivery. Our team will arrange a free pickup from your location.
                      </p>
                    </div>
                  </div>
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 text-white whitespace-nowrap ml-4"
                    onClick={handleReturnOrder}
                    disabled={isReturning}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    {isReturning ? 'Processing...' : 'Return Order'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => router.push('/products')}
          >
            <Home className="h-5 w-5 mr-2" />
            Continue Shopping
          </Button>
          <Button
            className="bg-gray-800 hover:bg-gray-700 text-white"
            onClick={handleDownloadInvoice}
          >
            <Download className="h-5 w-5 mr-2" />
            Download Invoice
          </Button>
          <Button
            className="bg-gray-800 hover:bg-gray-700 text-white"
            onClick={() => alert('Track order feature coming soon!')}
          >
            <Truck className="h-5 w-5 mr-2" />
            Track Order
          </Button>
        </div>

        {/* Additional Info */}
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-800/50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-400" />
            What is Next?
          </h3>
          <div className="text-gray-300 space-y-2 text-sm">
            <p>✓ You will receive an order confirmation email shortly</p>
            <p>✓ We will send you tracking details once your order is shipped</p>
            <p>✓ Expected delivery: 3-5 business days</p>
            <p>✓ Need help? Contact our support team at support@opticalstore.com</p>
          </div>
        </div>

        {/* Hidden Invoice Component for Printing */}
        {showInvoice && (
          <div className="hidden print:block">
            <InvoiceTemplate
              order={order}
              showBranding={order.order_source === 'customer'}
            />
          </div>
        )}
      </div>

      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block,
          .print\\:block * {
            visibility: visible;
          }
          .print\\:block {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
