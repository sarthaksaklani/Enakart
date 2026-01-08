// src/app/seller/uploaded-catalogs/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import {
  Package,
  Calendar,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';

// Mock catalog data - replace with actual data from database
interface Catalog {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  uploadedAt: Date;
  image: string;
}

export default function UploadedCatalogsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'seller') {
      router.push('/account');
      return;
    }

    // Mock data - replace with actual API call
    const mockCatalogs: Catalog[] = [
      {
        id: '1',
        name: 'Ray-Ban Aviator Classic',
        category: 'sunglasses',
        price: 12999,
        stock: 50,
        uploadedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400',
      },
      {
        id: '2',
        name: 'Oakley Round Eyeglasses',
        category: 'eyeglasses',
        price: 8999,
        stock: 30,
        uploadedAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
        image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400',
      },
      {
        id: '3',
        name: 'Premium Blue Light Glasses',
        category: 'eyeglasses',
        price: 5999,
        stock: 100,
        uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400',
      },
    ];

    setCatalogs(mockCatalogs);
    setLoading(false);
  }, [isAuthenticated, user, router]);

  const getTimeAgo = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this catalog?')) {
      setCatalogs(catalogs.filter(c => c.id !== id));
    }
  };

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
          <h1 className="text-4xl font-bold mb-2">Uploaded Catalogs</h1>
          <p className="text-gray-400">
            Manage your uploaded products and inventory.
          </p>
        </div>

        {/* Info Alert */}
        <div className="bg-blue-900/20 border border-blue-600/50 rounded-lg p-4 mb-8 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-blue-300 text-sm">
              <strong>Catalog Management:</strong> All your uploaded catalogs are visible to customers. Manage your inventory, pricing, and product details here.
            </p>
          </div>
        </div>

        {/* Add New Catalog Button */}
        <div className="mb-8">
          <Link href="/seller/catalog/add">
            <Button className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3">
              <Package className="h-5 w-5 mr-2" />
              Upload New Catalog
            </Button>
          </Link>
        </div>

        {/* All Catalogs */}
        {catalogs.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Package className="h-6 w-6 text-red-500" />
              All Catalogs
              <span className="text-sm text-gray-400 font-normal">
                ({catalogs.length} {catalogs.length === 1 ? 'item' : 'items'})
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {catalogs.map((catalog) => (
                <div key={catalog.id} className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-700 hover:border-red-600 transition-all">
                  {/* Image */}
                  <div className="relative h-48 bg-zinc-800">
                    <Image
                      src={catalog.image}
                      alt={catalog.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <h3 className="text-lg font-bold text-white line-clamp-2">
                      {catalog.name}
                    </h3>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 capitalize">{catalog.category}</span>
                      <span className="text-white font-bold">₹{catalog.price.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400">Stock: {catalog.stock}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>Uploaded {getTimeAgo(catalog.uploadedAt)}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2"
                        onClick={() => router.push(`/seller/catalog/edit/${catalog.id}`)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2"
                        onClick={() => handleDelete(catalog.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {catalogs.length === 0 && (
          <div className="text-center py-20">
            <Package className="h-20 w-20 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Catalogs Uploaded</h3>
            <p className="text-gray-400 mb-6">Start by uploading your first product catalog</p>
            <Link href="/seller/catalog/add">
              <Button className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3">
                <Package className="h-5 w-5 mr-2" />
                Upload New Catalog
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
