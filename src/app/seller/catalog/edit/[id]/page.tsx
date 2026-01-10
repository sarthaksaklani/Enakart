'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Upload, X, ArrowLeft, Save, Loader2, Trash2, Package } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  brand: string;
  category_id: string;
  gender: string;
  frame_shape: string;
  frame_material: string;
  lens_type: string;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_trending: boolean;
  images: string[] | string;
}

export default function EditProductPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock_quantity: 0,
    low_stock_threshold: 10,
    brand: '',
    category_id: '',
    gender: 'unisex',
    frame_shape: 'round',
    frame_material: 'metal',
    lens_type: 'non-prescription',
    is_featured: false,
    is_new_arrival: false,
    is_trending: false,
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'seller') {
      router.push('/account');
      return;
    }

    fetchProduct();
    fetchCategories();
  }, [isAuthenticated, user, router, productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/seller/products/${productId}`, {
        headers: {
          'x-user-id': user?.id || '',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch product');
      }

      const prod = data.product;
      setProduct(prod);

      // Parse images
      let parsedImages: string[] = [];
      if (prod.images) {
        if (Array.isArray(prod.images)) {
          parsedImages = prod.images;
        } else if (typeof prod.images === 'string') {
          try {
            parsedImages = JSON.parse(prod.images);
          } catch {
            if (prod.images.startsWith('http')) {
              parsedImages = [prod.images];
            }
          }
        }
      }
      setImages(parsedImages);

      // Set form data
      setFormData({
        name: prod.name || '',
        description: prod.description || '',
        price: prod.price || 0,
        stock_quantity: prod.stock_quantity || 0,
        low_stock_threshold: prod.low_stock_threshold || 10,
        brand: prod.brand || '',
        category_id: prod.category_id || '',
        gender: prod.gender || 'unisex',
        frame_shape: prod.frame_shape || 'round',
        frame_material: prod.frame_material || 'metal',
        lens_type: prod.lens_type || 'non-prescription',
        is_featured: prod.is_featured || false,
        is_new_arrival: prod.is_new_arrival || false,
        is_trending: prod.is_trending || false,
      });
    } catch (err: any) {
      console.error('Error fetching product:', err);
      alert(err.message || 'Failed to load product');
      router.push('/seller/catalog');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingImages(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        // Try Supabase upload first
        let response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        let data = await response.json();

        // Fallback to base64 if bucket not found
        if (!response.ok && data.error?.includes('Bucket not found')) {
          response = await fetch('/api/upload-base64', {
            method: 'POST',
            body: formData,
          });
          data = await response.json();
        }

        if (!response.ok) {
          throw new Error(data.error || 'Failed to upload image');
        }

        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages([...images, ...uploadedUrls]);
    } catch (error: any) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images: ' + error.message);
    } finally {
      setUploadingImages(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) return;

    setUploadingImages(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        let response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        let data = await response.json();

        if (!response.ok && data.error?.includes('Bucket not found')) {
          response = await fetch('/api/upload-base64', {
            method: 'POST',
            body: formData,
          });
          data = await response.json();
        }

        if (!response.ok) {
          throw new Error(data.error || 'Failed to upload image');
        }

        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages([...images, ...uploadedUrls]);
    } catch (error: any) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images: ' + error.message);
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert('Please enter product name');
      return;
    }

    if (!formData.brand.trim()) {
      alert('Please enter brand name');
      return;
    }

    if (!formData.category_id) {
      alert('Please select a category');
      return;
    }

    if (formData.price <= 0) {
      alert('Please enter a valid price');
      return;
    }

    if (formData.stock_quantity < 0) {
      alert('Please enter a valid stock quantity');
      return;
    }

    if (images.length === 0) {
      alert('Please upload at least one image');
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData = {
        ...formData,
        price: Number(formData.price),
        stock_quantity: Number(formData.stock_quantity),
        images: images,
      };

      const response = await fetch(`/api/seller/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || '',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update product');
      }

      alert('Product updated successfully!');
      router.push('/seller/catalog');
    } catch (error: any) {
      console.error('Error updating product:', error);
      alert(error.message || 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'seller') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/seller/catalog"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Catalog
          </Link>
          <h1 className="text-4xl font-bold mb-2">Edit Product</h1>
          <p className="text-gray-400">Update your product details and images</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Package className="h-6 w-6 text-red-500" />
              Basic Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., Classic Aviator Sunglasses"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Brand *
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., Ray-Ban"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Describe your product..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="unisex">Unisex</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Frame Shape
                  </label>
                  <select
                    value={formData.frame_shape}
                    onChange={(e) => setFormData({ ...formData, frame_shape: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="round">Round</option>
                    <option value="square">Square</option>
                    <option value="rectangular">Rectangular</option>
                    <option value="cat-eye">Cat Eye</option>
                    <option value="aviator">Aviator</option>
                    <option value="wayfarer">Wayfarer</option>
                    <option value="oval">Oval</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Frame Material
                  </label>
                  <select
                    value={formData.frame_material}
                    onChange={(e) => setFormData({ ...formData, frame_material: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="metal">Metal</option>
                    <option value="plastic">Plastic</option>
                    <option value="acetate">Acetate</option>
                    <option value="titanium">Titanium</option>
                    <option value="wood">Wood</option>
                    <option value="carbon-fiber">Carbon Fiber</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Lens Type
                  </label>
                  <select
                    value={formData.lens_type}
                    onChange={(e) => setFormData({ ...formData, lens_type: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="non-prescription">Non-Prescription</option>
                    <option value="prescription">Prescription</option>
                    <option value="blue-light">Blue Light</option>
                    <option value="photochromic">Photochromic</option>
                    <option value="polarized">Polarized</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="999"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="10"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Low Stock Alert At
                  </label>
                  <input
                    type="number"
                    value={formData.low_stock_threshold}
                    onChange={(e) => setFormData({ ...formData, low_stock_threshold: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="10"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Alert when stock falls below this number</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 text-red-600 bg-zinc-800 border-zinc-700 rounded focus:ring-red-500"
                  />
                  <label htmlFor="is_featured" className="text-sm text-gray-300">
                    Mark as Featured Product
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_new_arrival"
                    checked={formData.is_new_arrival}
                    onChange={(e) => setFormData({ ...formData, is_new_arrival: e.target.checked })}
                    className="w-4 h-4 text-red-600 bg-zinc-800 border-zinc-700 rounded focus:ring-red-500"
                  />
                  <label htmlFor="is_new_arrival" className="text-sm text-gray-300">
                    Mark as New Arrival
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_trending"
                    checked={formData.is_trending}
                    onChange={(e) => setFormData({ ...formData, is_trending: e.target.checked })}
                    className="w-4 h-4 text-red-600 bg-zinc-800 border-zinc-700 rounded focus:ring-red-500"
                  />
                  <label htmlFor="is_trending" className="text-sm text-gray-300">
                    Mark as Trending
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Upload className="h-6 w-6 text-red-500" />
              Product Images
            </h2>

            {/* Image Upload Area */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-zinc-700 hover:border-zinc-600'
              }`}
            >
              <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-300 mb-2">Drag & drop images here, or click to select</p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={uploadingImages}
              />
              <label
                htmlFor="image-upload"
                className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer transition-colors"
              >
                {uploadingImages ? 'Uploading...' : 'Choose from Gallery'}
              </label>
              <p className="text-sm text-gray-500 mt-2">Supports: JPG, PNG, WebP (Max 5MB each)</p>
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-gray-400 mb-3">{images.length} image(s) uploaded</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="relative h-32 bg-zinc-800 rounded-lg overflow-hidden">
                        <Image
                          src={url}
                          alt={`Product ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting || uploadingImages}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating Product...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Update Product
                </>
              )}
            </button>

            <Link
              href="/seller/catalog"
              className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
