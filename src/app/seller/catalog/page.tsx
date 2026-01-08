'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Upload, Plus, Edit2, Trash2, Eye, Package, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  created_at: string;
  images: string[];
  categories?: {
    name: string;
  };
}

export default function CatalogManagementPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'seller') {
      router.push('/account');
      return;
    }

    fetchProducts();
  }, [isAuthenticated, user, router]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/seller/products', {
        headers: {
          'x-user-id': user?.id || '',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch products');
      }

      setProducts(data.products || []);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/seller/products/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': user?.id || '',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete product');
      }

      // Remove from local state
      setProducts(products.filter(p => p.id !== id));
      alert('Product deleted successfully!');
    } catch (err: any) {
      console.error('Error deleting product:', err);
      alert(err.message || 'Failed to delete product');
    }
  };

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

  const totalProducts = products.length;
  const activeListings = products.filter(p => p.stock_quantity > 0).length;
  const outOfStock = products.filter(p => p.stock_quantity === 0).length;

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Catalog Management</h1>
            <p className="text-gray-400">Upload and manage your products and inventory</p>
          </div>
          <Link href="/seller/catalog/add" className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition-colors">
            <Plus className="w-5 h-5" />
            Add New Product
          </Link>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-900 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400">Total Products</h3>
              <Package className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold">{totalProducts}</p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400">Active Listings</h3>
              <Eye className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold">{activeListings}</p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400">Out of Stock</h3>
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold">{outOfStock}</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-600/50 rounded-lg p-4 mb-8">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* All Products */}
        {products.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Package className="h-6 w-6 text-red-500" />
              All Products
              <span className="text-sm text-gray-400 font-normal">
                ({products.length} {products.length === 1 ? 'item' : 'items'})
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-700 hover:border-red-600 transition-all">
                  {/* Image */}
                  <div className="relative h-48 bg-zinc-800">
                    <Image
                      src={(() => {
                        // Handle images - could be array, string, or null
                        let imageUrl = 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400';

                        if (product.images) {
                          // If it's already an array
                          if (Array.isArray(product.images) && product.images.length > 0) {
                            imageUrl = product.images[0];
                          }
                          // If it's a string that looks like JSON
                          else if (typeof product.images === 'string') {
                            try {
                              const parsed = JSON.parse(product.images);
                              if (Array.isArray(parsed) && parsed.length > 0) {
                                imageUrl = parsed[0];
                              }
                            } catch (e) {
                              // If parsing fails, use as-is if it's a URL
                              if (product.images.startsWith('http')) {
                                imageUrl = product.images;
                              }
                            }
                          }
                        }

                        return imageUrl;
                      })()}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <h3 className="text-lg font-bold text-white line-clamp-2">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 capitalize">{product.categories?.name || 'Uncategorized'}</span>
                      <span className="text-white font-bold">₹{product.price.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className={`${product.stock_quantity === 0 ? 'text-red-500' : product.stock_quantity < 10 ? 'text-yellow-500' : 'text-gray-400'}`}>
                        Stock: {product.stock_quantity}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>Added {getTimeAgo(new Date(product.created_at))}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2"
                        onClick={() => router.push(`/seller/catalog/edit/${product.id}`)}
                      >
                        <Edit2 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2"
                        onClick={() => handleDelete(product.id)}
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
        {!loading && products.length === 0 && (
          <div className="bg-zinc-900 rounded-lg p-8">
            <div className="flex flex-col items-center justify-center py-12">
              <Upload className="w-16 h-16 text-gray-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">No Products Yet</h3>
              <p className="text-gray-400 text-center mb-6">
                Start by uploading your first product to your catalog
              </p>
              <Link href="/seller/catalog/add" className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition-colors inline-block">
                Upload Product
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
