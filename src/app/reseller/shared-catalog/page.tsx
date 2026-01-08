'use client';

import { BackButton } from '@/components/reseller/BackButton';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Share2,
  Calendar,
  Eye,
  MessageCircle,
  Download,
  Copy,
  CheckCircle,
  Filter,
  Search,
  ExternalLink
} from 'lucide-react';

interface SharedCatalogItem {
  id: string;
  productName: string;
  productImage: string;
  sharedOn: string; // date
  platform: 'whatsapp' | 'telegram' | 'instagram' | 'facebook' | 'link';
  views: number;
  clicks: number;
  shareLink: string;
  category: string;
}

export default function SharedCatalogPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'reseller') {
      router.push('/account');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'reseller') {
    return null;
  }

  // Dummy data - replace with actual API call
  const sharedCatalogs: SharedCatalogItem[] = [
    {
      id: '1',
      productName: 'Ray-Ban Aviator Sunglasses',
      productImage: 'https://picsum.photos/200/200?random=1',
      sharedOn: '2024-12-20',
      platform: 'whatsapp',
      views: 45,
      clicks: 12,
      shareLink: 'https://enakart.com/share/abc123',
      category: 'Sunglasses'
    },
    {
      id: '2',
      productName: 'Premium Blue Light Glasses',
      productImage: 'https://picsum.photos/200/200?random=2',
      sharedOn: '2024-12-19',
      platform: 'instagram',
      views: 128,
      clicks: 34,
      shareLink: 'https://enakart.com/share/def456',
      category: 'Eyeglasses'
    },
    {
      id: '3',
      productName: 'Contact Lens Solution Bundle',
      productImage: 'https://picsum.photos/200/200?random=3',
      sharedOn: '2024-12-18',
      platform: 'whatsapp',
      views: 67,
      clicks: 23,
      shareLink: 'https://enakart.com/share/ghi789',
      category: 'Accessories'
    },
    {
      id: '4',
      productName: 'Designer Cat Eye Frames',
      productImage: 'https://picsum.photos/200/200?random=4',
      sharedOn: '2024-12-17',
      platform: 'facebook',
      views: 89,
      clicks: 19,
      shareLink: 'https://enakart.com/share/jkl012',
      category: 'Eyeglasses'
    },
    {
      id: '5',
      productName: 'Sports Polarized Sunglasses',
      productImage: 'https://picsum.photos/200/200?random=5',
      sharedOn: '2024-12-16',
      platform: 'telegram',
      views: 156,
      clicks: 42,
      shareLink: 'https://enakart.com/share/mno345',
      category: 'Sunglasses'
    }
  ];

  const handleCopyLink = (shareLink: string, id: string) => {
    navigator.clipboard.writeText(shareLink);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'whatsapp':
        return '💬';
      case 'instagram':
        return '📷';
      case 'facebook':
        return '👍';
      case 'telegram':
        return '✈️';
      default:
        return '🔗';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'whatsapp':
        return 'bg-green-600';
      case 'instagram':
        return 'bg-pink-600';
      case 'facebook':
        return 'bg-blue-600';
      case 'telegram':
        return 'bg-sky-600';
      default:
        return 'bg-gray-600';
    }
  };

  const filteredCatalogs = sharedCatalogs.filter(item => {
    const matchesPlatform = selectedPlatform === 'all' || item.platform === selectedPlatform;
    const matchesSearch = item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  const totalViews = sharedCatalogs.reduce((sum, item) => sum + item.views, 0);
  const totalClicks = sharedCatalogs.reduce((sum, item) => sum + item.clicks, 0);
  const totalShares = sharedCatalogs.length;

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <BackButton />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Share2 className="w-10 h-10 text-red-500" />
            Shared Catalogs
          </h1>
          <p className="text-gray-400">
            Track all products and catalogs you've shared across different platforms
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-200 text-sm mb-1">Total Shares</p>
                <p className="text-4xl font-bold">{totalShares}</p>
              </div>
              <Share2 className="w-12 h-12 text-red-200 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm mb-1">Total Views</p>
                <p className="text-4xl font-bold">{totalViews}</p>
              </div>
              <Eye className="w-12 h-12 text-blue-200 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm mb-1">Total Clicks</p>
                <p className="text-4xl font-bold">{totalClicks}</p>
              </div>
              <MessageCircle className="w-12 h-12 text-green-200 opacity-50" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-zinc-900 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Platform Filter */}
            <div className="md:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-red-500 appearance-none"
                >
                  <option value="all">All Platforms</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="telegram">Telegram</option>
                  <option value="link">Direct Link</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Shared Items List */}
        <div className="space-y-4">
          {filteredCatalogs.length === 0 ? (
            <div className="bg-zinc-900 rounded-lg p-12 text-center">
              <Share2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No shared catalogs found</h3>
              <p className="text-gray-500">
                {searchQuery || selectedPlatform !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Start sharing products to see them here'}
              </p>
            </div>
          ) : (
            filteredCatalogs.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-900 rounded-lg p-6 hover:bg-zinc-800 transition-colors border border-zinc-800 hover:border-zinc-700"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">
                          {item.productName}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(item.sharedOn).toLocaleDateString()}
                          </span>
                          <span className="px-2 py-1 bg-zinc-800 rounded text-xs">
                            {item.category}
                          </span>
                        </div>
                      </div>

                      {/* Platform Badge */}
                      <div className={`${getPlatformColor(item.platform)} px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1`}>
                        <span>{getPlatformIcon(item.platform)}</span>
                        <span className="capitalize">{item.platform}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 mb-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">{item.views} views</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{item.clicks} clicks</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        CTR: {((item.clicks / item.views) * 100).toFixed(1)}%
                      </div>
                    </div>

                    {/* Share Link */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-zinc-800 rounded-lg px-4 py-2 text-sm text-gray-300 font-mono truncate">
                        {item.shareLink}
                      </div>
                      <button
                        onClick={() => handleCopyLink(item.shareLink, item.id)}
                        className="bg-zinc-800 hover:bg-zinc-700 p-2 rounded-lg transition-colors"
                        title="Copy link"
                      >
                        {copiedId === item.id ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Copy className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() => window.open(item.shareLink, '_blank')}
                        className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition-colors"
                        title="Open link"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-red-500" />
            How Shared Catalogs Work
          </h3>
          <div className="text-gray-400 space-y-2 text-sm">
            <p>• Every time you share a product using the share buttons in the catalog, it gets tracked here</p>
            <p>• Monitor how many people viewed and clicked your shared links</p>
            <p>• Track performance across different platforms (WhatsApp, Instagram, Facebook, etc.)</p>
            <p>• Use this data to understand which products resonate with your customers</p>
            <p>• Click on any share link to view or re-share the product</p>
          </div>
        </div>
      </div>
    </div>
  );
}
