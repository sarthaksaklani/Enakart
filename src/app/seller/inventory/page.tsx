'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Package, AlertTriangle, CheckCircle, XCircle, Loader2, AlertCircle as AlertIcon, Edit } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  stock_quantity: number;
  low_stock_threshold?: number;
  price: number;
  images: string[] | string;
  categories?: {
    name: string;
  };
}

interface InventoryData {
  stats: {
    totalProducts: number;
    inStock: number;
    lowStock: number;
    outOfStock: number;
    totalValue: number;
  };
  inventory: {
    lowStock: Product[];
    outOfStock: Product[];
    inStock: Product[];
  };
  threshold: number;
}

export default function InventoryPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [inventoryData, setInventoryData] = useState<InventoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'low' | 'out'>('all');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'seller') {
      router.push('/account');
      return;
    }

    fetchInventory();
  }, [isAuthenticated, user, router]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/seller/inventory?threshold=10', {
        headers: {
          'x-user-id': user?.id || '',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch inventory');
      }

      setInventoryData(data);
    } catch (err: any) {
      console.error('Error fetching inventory:', err);
      setError(err.message || 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (images: string[] | string): string => {
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
        } catch {
          if (images.startsWith('http')) {
            imageUrl = images;
          }
        }
      }
    }

    return imageUrl;
  };

  if (!isAuthenticated || user?.role !== 'seller') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Loading inventory...</p>
        </div>
      </div>
    );
  }

  if (!inventoryData) {
    return null;
  }

  const displayProducts = () => {
    switch (activeTab) {
      case 'low':
        return inventoryData.inventory.lowStock;
      case 'out':
        return inventoryData.inventory.outOfStock;
      default:
        return [
          ...inventoryData.inventory.outOfStock,
          ...inventoryData.inventory.lowStock,
          ...inventoryData.inventory.inStock,
        ];
    }
  };

  const products = displayProducts();

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Inventory Management</h1>
          <p className="text-gray-400">Track and manage your product stock levels</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-600/50 rounded-lg p-4 mb-8 flex items-center gap-3">
            <AlertIcon className="h-5 w-5 text-red-500" />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-900/30 to-zinc-900 border border-blue-800/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Total Products</h3>
              <Package className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold mb-1">{inventoryData.stats.totalProducts}</p>
            <p className="text-xs text-gray-400">All products in catalog</p>
          </div>

          <div className="bg-gradient-to-br from-green-900/30 to-zinc-900 border border-green-800/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">In Stock</h3>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold mb-1">{inventoryData.stats.inStock}</p>
            <p className="text-xs text-gray-400">Products with good stock</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-900/30 to-zinc-900 border border-yellow-800/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Low Stock</h3>
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold mb-1">{inventoryData.stats.lowStock}</p>
            <p className="text-xs text-gray-400">Below {inventoryData.threshold} units</p>
          </div>

          <div className="bg-gradient-to-br from-red-900/30 to-zinc-900 border border-red-800/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Out of Stock</h3>
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold mb-1">{inventoryData.stats.outOfStock}</p>
            <p className="text-xs text-gray-400">Needs restocking</p>
          </div>
        </div>

        {/* Total Inventory Value */}
        <div className="bg-gradient-to-br from-purple-900/20 to-zinc-900 border border-purple-800/30 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-400 text-sm mb-1">Total Inventory Value</h3>
              <p className="text-4xl font-bold text-white">₹{inventoryData.stats.totalValue.toLocaleString('en-IN')}</p>
              <p className="text-xs text-gray-400 mt-1">Based on current stock × price</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Package className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-4 border-b border-zinc-800">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 font-medium transition-all ${
                activeTab === 'all'
                  ? 'text-white border-b-2 border-red-500'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              All Products ({inventoryData.stats.totalProducts})
            </button>
            <button
              onClick={() => setActiveTab('low')}
              className={`px-6 py-3 font-medium transition-all flex items-center gap-2 ${
                activeTab === 'low'
                  ? 'text-white border-b-2 border-red-500'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              Low Stock ({inventoryData.stats.lowStock})
            </button>
            <button
              onClick={() => setActiveTab('out')}
              className={`px-6 py-3 font-medium transition-all flex items-center gap-2 ${
                activeTab === 'out'
                  ? 'text-white border-b-2 border-red-500'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <XCircle className="w-4 h-4" />
              Out of Stock ({inventoryData.stats.outOfStock})
            </button>
          </div>
        </div>

        {/* Products Table */}
        {products.length > 0 ? (
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-800/50">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-gray-400">Product</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-400">Category</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-400">Price</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-400">Stock</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-400">Value</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-400">Status</th>
                    <th className="text-right p-4 text-sm font-semibold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {products.map((product) => {
                    const threshold = product.low_stock_threshold || inventoryData.threshold;
                    const stockStatus =
                      product.stock_quantity === 0
                        ? 'out'
                        : product.stock_quantity <= threshold
                        ? 'low'
                        : 'good';

                    return (
                      <tr key={product.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={getImageUrl(product.images)}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-white font-medium line-clamp-1">{product.name}</p>
                              <p className="text-xs text-gray-500">ID: {product.id.slice(0, 8)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-300 capitalize">
                            {product.categories?.name || 'N/A'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-white font-semibold">₹{product.price.toLocaleString('en-IN')}</span>
                        </td>
                        <td className="p-4">
                          <span className={`font-semibold ${
                            stockStatus === 'out'
                              ? 'text-red-500'
                              : stockStatus === 'low'
                              ? 'text-yellow-500'
                              : 'text-green-500'
                          }`}>
                            {product.stock_quantity}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-300">
                            ₹{(product.price * product.stock_quantity).toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className="p-4">
                          {stockStatus === 'out' ? (
                            <span className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-semibold">
                              Out of Stock
                            </span>
                          ) : stockStatus === 'low' ? (
                            <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-xs font-semibold">
                              Low Stock
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-semibold">
                              In Stock
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <Link
                            href={`/seller/catalog/edit/${product.id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            Update
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-900 rounded-lg p-12 text-center border border-zinc-800">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Products Found</h3>
            <p className="text-gray-400 mb-6">
              {activeTab === 'low'
                ? 'No products with low stock'
                : activeTab === 'out'
                ? 'No products out of stock'
                : 'Start by adding products to your catalog'}
            </p>
            {activeTab === 'all' && (
              <Link
                href="/seller/catalog/add"
                className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                Add Product
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
