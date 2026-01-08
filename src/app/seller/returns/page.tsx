'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RefreshCcw, Check, X, AlertCircle, DollarSign, Calendar } from 'lucide-react';
import Image from 'next/image';

interface ReturnRequest {
  id: string;
  orderId: string;
  productName: string;
  productImage: string;
  customerName: string;
  customerEmail: string;
  reason: string;
  returnCategory: 'customer_returned' | 'customer_rejected' | 'unavailable' | 'damaged' | 'defective' | 'wrong_item';
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  requestDate: Date;
  refundAmount: number;
  quantity: number;
}

export default function ReturnsPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'rejected' | 'processing'>('all');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'seller') {
      router.push('/account');
      return;
    }

    // Mock data - replace with actual API call
    const mockReturns: ReturnRequest[] = [
      {
        id: '1',
        orderId: 'ORD-2024-001',
        productName: 'Ray-Ban Aviator Classic',
        productImage: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400',
        customerName: 'Rahul Sharma',
        customerEmail: 'rahul@example.com',
        reason: 'Product damaged during delivery',
        returnCategory: 'damaged',
        status: 'approved',
        requestDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
        refundAmount: 12999,
        quantity: 1,
      },
      {
        id: '2',
        orderId: 'ORD-2024-002',
        productName: 'Oakley Round Eyeglasses',
        productImage: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400',
        customerName: 'Priya Patel',
        customerEmail: 'priya@example.com',
        reason: 'Customer rejected the order at delivery',
        returnCategory: 'customer_rejected',
        status: 'approved',
        requestDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
        refundAmount: 8999,
        quantity: 1,
      },
      {
        id: '3',
        orderId: 'ORD-2024-003',
        productName: 'Premium Blue Light Glasses',
        productImage: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400',
        customerName: 'Amit Kumar',
        customerEmail: 'amit@example.com',
        reason: 'Customer unavailable at delivery address',
        returnCategory: 'unavailable',
        status: 'rejected',
        requestDate: new Date(Date.now() - 48 * 60 * 60 * 1000),
        refundAmount: 5999,
        quantity: 1,
      },
      {
        id: '4',
        orderId: 'ORD-2024-004',
        productName: 'Polarized Sports Sunglasses',
        productImage: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
        customerName: 'Sneha Reddy',
        customerEmail: 'sneha@example.com',
        reason: 'Customer initiated return - Changed mind',
        returnCategory: 'customer_returned',
        status: 'processing',
        requestDate: new Date(Date.now() - 5 * 60 * 60 * 1000),
        refundAmount: 7999,
        quantity: 1,
      },
      {
        id: '5',
        orderId: 'ORD-2024-005',
        productName: 'Classic Wayfarer Sunglasses',
        productImage: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
        customerName: 'Vikram Singh',
        customerEmail: 'vikram@example.com',
        reason: 'Product has manufacturing defect',
        returnCategory: 'defective',
        status: 'approved',
        requestDate: new Date(Date.now() - 72 * 60 * 60 * 1000),
        refundAmount: 9999,
        quantity: 1,
      },
      {
        id: '6',
        orderId: 'ORD-2024-006',
        productName: 'Designer Reading Glasses',
        productImage: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400',
        customerName: 'Anjali Mehta',
        customerEmail: 'anjali@example.com',
        reason: 'Wrong item delivered',
        returnCategory: 'wrong_item',
        status: 'approved',
        requestDate: new Date(Date.now() - 36 * 60 * 60 * 1000),
        refundAmount: 6499,
        quantity: 1,
      },
    ];

    setReturns(mockReturns);
    setLoading(false);
  }, [isAuthenticated, user, router]);

  const getReturnCategoryLabel = (category: string) => {
    switch (category) {
      case 'customer_returned':
        return 'Customer Returned';
      case 'customer_rejected':
        return 'Customer Rejected at Delivery';
      case 'unavailable':
        return 'Customer Unavailable';
      case 'damaged':
        return 'Damaged Product';
      case 'defective':
        return 'Defective Product';
      case 'wrong_item':
        return 'Wrong Item Delivered';
      default:
        return 'Other';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-900/30 border border-green-600/50 text-green-400 rounded-full text-xs font-semibold">
            <Check className="h-3 w-3" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-900/30 border border-red-600/50 text-red-400 rounded-full text-xs font-semibold">
            <X className="h-3 w-3" />
            Rejected
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-900/30 border border-blue-600/50 text-blue-400 rounded-full text-xs font-semibold">
            <RefreshCcw className="h-3 w-3 animate-spin" />
            Processing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-900/30 border border-gray-600/50 text-gray-400 rounded-full text-xs font-semibold">
            <AlertCircle className="h-3 w-3" />
            Unknown
          </span>
        );
    }
  };

  const getTimeAgo = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  const filteredReturns = returns.filter(ret => {
    if (filterStatus === 'all') return true;
    return ret.status === filterStatus;
  });

  const processingCount = returns.filter(r => r.status === 'processing').length;
  const approvedCount = returns.filter(r => r.status === 'approved').length;
  const rejectedCount = returns.filter(r => r.status === 'rejected').length;
  const totalRefundAmount = returns
    .filter(r => r.status === 'approved')
    .reduce((sum, r) => sum + r.refundAmount, 0);

  if (!isAuthenticated || user?.role !== 'seller') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Returns Management</h1>
          <p className="text-gray-400">View product returns status and reasons</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border border-blue-600/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Processing</h3>
              <RefreshCcw className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold">{processingCount}</p>
          </div>

          <div className="bg-gradient-to-br from-green-900/20 to-green-800/20 border border-green-600/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Approved</h3>
              <Check className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold">{approvedCount}</p>
          </div>

          <div className="bg-gradient-to-br from-red-900/20 to-red-800/20 border border-red-600/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Rejected</h3>
              <X className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold">{rejectedCount}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-600/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Total Refunds</h3>
              <DollarSign className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold">₹{(totalRefundAmount / 1000).toFixed(1)}K</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6 flex gap-3 flex-wrap">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filterStatus === 'all'
                ? 'bg-red-600 text-white'
                : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
            }`}
          >
            All Returns ({returns.length})
          </button>
          <button
            onClick={() => setFilterStatus('processing')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filterStatus === 'processing'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
            }`}
          >
            Processing ({processingCount})
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filterStatus === 'approved'
                ? 'bg-green-600 text-white'
                : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
            }`}
          >
            Approved ({approvedCount})
          </button>
          <button
            onClick={() => setFilterStatus('rejected')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filterStatus === 'rejected'
                ? 'bg-red-600 text-white'
                : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
            }`}
          >
            Rejected ({rejectedCount})
          </button>
        </div>

        {/* Returns List */}
        {filteredReturns.length > 0 ? (
          <div className="space-y-4">
            {filteredReturns.map((returnReq) => (
              <div
                key={returnReq.id}
                className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 hover:border-zinc-700 transition-colors"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Product Info */}
                  <div className="flex gap-4 flex-1">
                    <div className="relative w-20 h-20 bg-zinc-800 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={returnReq.productImage}
                        alt={returnReq.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">{returnReq.productName}</h3>
                      <p className="text-sm text-gray-400 mb-1">Order ID: {returnReq.orderId}</p>
                      <p className="text-sm text-gray-400">Quantity: {returnReq.quantity}</p>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Customer</p>
                    <p className="text-white font-semibold">{returnReq.customerName}</p>
                    <p className="text-sm text-gray-400">{returnReq.customerEmail}</p>
                  </div>

                  {/* Return Details */}
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Return Category</p>
                    <p className="text-white font-semibold mb-2">{getReturnCategoryLabel(returnReq.returnCategory)}</p>
                    <p className="text-xs text-gray-500 mb-1">Reason</p>
                    <p className="text-gray-300 text-sm mb-2">{returnReq.reason}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>{getTimeAgo(returnReq.requestDate)}</span>
                    </div>
                  </div>

                  {/* Refund & Status */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Refund Amount</p>
                      <p className="text-2xl font-bold text-white">₹{returnReq.refundAmount.toLocaleString('en-IN')}</p>
                    </div>
                    {getStatusBadge(returnReq.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-zinc-900 rounded-lg p-12 text-center">
            <RefreshCcw className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Return Requests</h3>
            <p className="text-gray-400">
              {filterStatus === 'all'
                ? 'No return requests at the moment.'
                : `No ${filterStatus} return requests.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
