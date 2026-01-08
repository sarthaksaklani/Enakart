'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BadgeCheck, Star, ThumbsUp, ThumbsDown, AlertTriangle, TrendingUp, MessageSquare } from 'lucide-react';
import Image from 'next/image';

interface QualityReview {
  id: string;
  productName: string;
  productImage: string;
  customerName: string;
  rating: number;
  review: string;
  date: Date;
  isQualityIssue: boolean;
}

export default function QualityPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [reviews, setReviews] = useState<QualityReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'good' | 'issues'>('all');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'seller') {
      router.push('/account');
      return;
    }

    // Mock data - replace with actual API call
    const mockReviews: QualityReview[] = [
      {
        id: '1',
        productName: 'Ray-Ban Aviator Classic',
        productImage: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400',
        customerName: 'Rahul Sharma',
        rating: 5,
        review: 'Excellent quality! The sunglasses are exactly as described. Very satisfied with the purchase.',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isQualityIssue: false,
      },
      {
        id: '2',
        productName: 'Oakley Round Eyeglasses',
        productImage: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400',
        customerName: 'Priya Patel',
        rating: 2,
        review: 'The frame quality is not good. It feels cheap and flimsy. Not worth the price.',
        date: new Date(Date.now() - 5 * 60 * 60 * 1000),
        isQualityIssue: true,
      },
      {
        id: '3',
        productName: 'Premium Blue Light Glasses',
        productImage: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400',
        customerName: 'Amit Kumar',
        rating: 4,
        review: 'Good quality glasses. The blue light protection works well. Minor scratches on arrival.',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        isQualityIssue: false,
      },
      {
        id: '4',
        productName: 'Polarized Sports Sunglasses',
        productImage: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
        customerName: 'Sneha Reddy',
        rating: 5,
        review: 'Perfect for sports activities! Great quality and comfortable fit. Highly recommend!',
        date: new Date(Date.now() - 48 * 60 * 60 * 1000),
        isQualityIssue: false,
      },
      {
        id: '5',
        productName: 'Ray-Ban Aviator Classic',
        productImage: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400',
        customerName: 'Vikram Singh',
        rating: 1,
        review: 'Very disappointed. The product has manufacturing defects. Lens coating is uneven.',
        date: new Date(Date.now() - 72 * 60 * 60 * 1000),
        isQualityIssue: true,
      },
    ];

    setReviews(mockReviews);
    setLoading(false);
  }, [isAuthenticated, user, router]);

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'
            }`}
          />
        ))}
      </div>
    );
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

  const filteredReviews = reviews.filter(review => {
    if (filterType === 'all') return true;
    if (filterType === 'good') return !review.isQualityIssue && review.rating >= 4;
    if (filterType === 'issues') return review.isQualityIssue || review.rating <= 2;
    return true;
  });

  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const qualityIssues = reviews.filter(r => r.isQualityIssue || r.rating <= 2).length;
  const positiveReviews = reviews.filter(r => r.rating >= 4 && !r.isQualityIssue).length;

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
          <h1 className="text-4xl font-bold mb-2">Quality Control & Reviews</h1>
          <p className="text-gray-400">Monitor product quality and customer feedback</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border border-blue-600/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Total Reviews</h3>
              <MessageSquare className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold">{totalReviews}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 border border-yellow-600/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Average Rating</h3>
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold">{averageRating.toFixed(1)}</p>
              <span className="text-yellow-500">★</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-900/20 to-green-800/20 border border-green-600/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Positive Reviews</h3>
              <ThumbsUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold">{positiveReviews}</p>
            <p className="text-green-400 text-xs mt-1">{((positiveReviews / totalReviews) * 100).toFixed(0)}% of total</p>
          </div>

          <div className="bg-gradient-to-br from-red-900/20 to-red-800/20 border border-red-600/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Quality Issues</h3>
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold">{qualityIssues}</p>
            <p className="text-red-400 text-xs mt-1">Requires attention</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6 flex gap-3 flex-wrap">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filterType === 'all'
                ? 'bg-red-600 text-white'
                : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
            }`}
          >
            All Reviews ({totalReviews})
          </button>
          <button
            onClick={() => setFilterType('good')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filterType === 'good'
                ? 'bg-green-600 text-white'
                : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
            }`}
          >
            Positive ({positiveReviews})
          </button>
          <button
            onClick={() => setFilterType('issues')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filterType === 'issues'
                ? 'bg-red-600 text-white'
                : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
            }`}
          >
            Quality Issues ({qualityIssues})
          </button>
        </div>

        {/* Reviews List */}
        {filteredReviews.length > 0 ? (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className={`bg-zinc-900 rounded-lg p-6 border transition-colors ${
                  review.isQualityIssue
                    ? 'border-red-600/50 hover:border-red-600'
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Product Info */}
                  <div className="flex gap-4 flex-1">
                    <div className="relative w-20 h-20 bg-zinc-800 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={review.productImage}
                        alt={review.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">{review.productName}</h3>
                      <p className="text-sm text-gray-400 mb-2">Reviewed by {review.customerName}</p>
                      <div className="flex items-center gap-3">
                        {getRatingStars(review.rating)}
                        <span className="text-sm text-gray-400">{getTimeAgo(review.date)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="flex-1">
                    <p className="text-gray-300 mb-3">{review.review}</p>
                    {review.isQualityIssue && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-900/30 border border-red-600/50 text-red-400 rounded-full text-xs font-semibold">
                        <AlertTriangle className="h-3 w-3" />
                        Quality Issue Reported
                      </div>
                    )}
                    {!review.isQualityIssue && review.rating >= 4 && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-900/30 border border-green-600/50 text-green-400 rounded-full text-xs font-semibold">
                        <BadgeCheck className="h-3 w-3" />
                        Quality Approved
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-zinc-900 rounded-lg p-12 text-center">
            <BadgeCheck className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Reviews Found</h3>
            <p className="text-gray-400">
              {filterType === 'all'
                ? 'No customer reviews yet.'
                : filterType === 'good'
                ? 'No positive reviews yet.'
                : 'No quality issues reported.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
