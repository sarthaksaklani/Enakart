'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Upload, X, Plus, ArrowLeft, Copy, Trash2, Eye, Check, Package } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ProductVariant {
  id: string;
  color: string;
  size?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  images: string[];
}

interface ProductCatalog {
  id: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  gender: string;
  frameShape: string;
  frameMaterial: string;
  isFeatured: boolean;
  variants: ProductVariant[];
  specifications: {
    lensWidth?: string;
    bridgeWidth?: string;
    templeLength?: string;
    frameWidth?: string;
    lensType?: string;
    uvProtection?: string;
    polarized: boolean;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function AddProductPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [uploadMode, setUploadMode] = useState<'single' | 'bulk' | null>(null);
  const [catalogs, setCatalogs] = useState<ProductCatalog[]>([]);
  const [editingCatalogId, setEditingCatalogId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'seller') {
      router.push('/account');
      return;
    }

    fetchCategories();
  }, [isAuthenticated, user, router]);

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

  if (!isAuthenticated || user?.role !== 'seller') {
    return null;
  }

  const createNewCatalog = (): ProductCatalog => ({
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    name: '',
    description: '',
    brand: '',
    category: 'eyeglasses',
    gender: 'unisex',
    frameShape: 'round',
    frameMaterial: 'metal',
    isFeatured: false,
    variants: [
      {
        id: '1',
        color: '',
        price: 0,
        stock: 0,
        images: [],
      },
    ],
    specifications: {
      lensWidth: '',
      bridgeWidth: '',
      templeLength: '',
      frameWidth: '',
      lensType: '',
      uvProtection: '',
      polarized: false,
    },
  });

  const handleStartSingleUpload = () => {
    setUploadMode('single');
    setCatalogs([createNewCatalog()]);
    setEditingCatalogId(null);
  };

  const handleStartBulkUpload = () => {
    setUploadMode('bulk');
    setCatalogs([createNewCatalog()]);
    setEditingCatalogId(null);
  };

  const addNewCatalog = () => {
    setCatalogs([...catalogs, createNewCatalog()]);
  };

  const duplicateCatalog = (catalogId: string) => {
    const catalog = catalogs.find(c => c.id === catalogId);
    if (catalog) {
      const newCatalog = {
        ...JSON.parse(JSON.stringify(catalog)),
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      };
      setCatalogs([...catalogs, newCatalog]);
    }
  };

  const removeCatalog = (catalogId: string) => {
    if (catalogs.length > 1) {
      setCatalogs(catalogs.filter(c => c.id !== catalogId));
    }
  };

  const updateCatalog = (catalogId: string, updates: Partial<ProductCatalog>) => {
    setCatalogs(catalogs.map(c => c.id === catalogId ? { ...c, ...updates } : c));
  };

  const addVariantToCatalog = (catalogId: string) => {
    setCatalogs(catalogs.map(c => {
      if (c.id === catalogId) {
        return {
          ...c,
          variants: [
            ...c.variants,
            {
              id: Date.now().toString(),
              color: '',
              price: c.variants[0]?.price || 0,
              stock: 0,
              images: [],
            },
          ],
        };
      }
      return c;
    }));
  };

  const removeVariantFromCatalog = (catalogId: string, variantId: string) => {
    setCatalogs(catalogs.map(c => {
      if (c.id === catalogId && c.variants.length > 1) {
        return {
          ...c,
          variants: c.variants.filter(v => v.id !== variantId),
        };
      }
      return c;
    }));
  };

  const updateVariant = (catalogId: string, variantId: string, updates: Partial<ProductVariant>) => {
    setCatalogs(catalogs.map(c => {
      if (c.id === catalogId) {
        return {
          ...c,
          variants: c.variants.map(v => v.id === variantId ? { ...v, ...updates } : v),
        };
      }
      return c;
    }));
  };

  const handleImageUpload = async (catalogId: string, variantId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    // Show loading state or temporary preview
    const tempUrls = fileArray.map(file => URL.createObjectURL(file));
    updateVariant(catalogId, variantId, {
      images: [...catalogs.find(c => c.id === catalogId)?.variants.find(v => v.id === variantId)?.images || [], ...tempUrls]
    });

    // Upload files to server
    try {
      const uploadPromises = fileArray.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        // Try Supabase Storage first
        let response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        let data = await response.json();

        // If bucket error, fallback to base64 (no storage needed)
        if (!response.ok && data.error?.includes('Bucket not found')) {
          console.log('Bucket not found, using base64 fallback...');

          response = await fetch('/api/upload-base64', {
            method: 'POST',
            body: formData,
          });

          data = await response.json();
        }

        if (!response.ok) {
          throw new Error(data.error || 'Upload failed');
        }

        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      // Replace temp URLs with actual URLs
      setCatalogs(catalogs.map(c => {
        if (c.id === catalogId) {
          return {
            ...c,
            variants: c.variants.map(v => {
              if (v.id === variantId) {
                // Remove temp URLs and add real URLs
                const filteredImages = v.images.filter(img => !img.startsWith('blob:'));
                return { ...v, images: [...filteredImages, ...uploadedUrls] };
              }
              return v;
            }),
          };
        }
        return c;
      }));

      // Clean up blob URLs
      tempUrls.forEach(url => URL.revokeObjectURL(url));

    } catch (error: any) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images: ' + error.message);

      // Remove temp URLs on error
      setCatalogs(catalogs.map(c => {
        if (c.id === catalogId) {
          return {
            ...c,
            variants: c.variants.map(v => {
              if (v.id === variantId) {
                return { ...v, images: v.images.filter(img => !img.startsWith('blob:')) };
              }
              return v;
            }),
          };
        }
        return c;
      }));
    }
  };

  const removeImage = (catalogId: string, variantId: string, imageIndex: number) => {
    setCatalogs(catalogs.map(c => {
      if (c.id === catalogId) {
        return {
          ...c,
          variants: c.variants.map(v => {
            if (v.id === variantId) {
              return { ...v, images: v.images.filter((_, i) => i !== imageIndex) };
            }
            return v;
          }),
        };
      }
      return c;
    }));
  };

  const handleDragOver = (e: React.DragEvent, variantId: string) => {
    e.preventDefault();
    setIsDragging(variantId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(null);
  };

  const handleDrop = async (e: React.DragEvent, catalogId: string, variantId: string) => {
    e.preventDefault();
    setIsDragging(null);

    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));

    if (files.length === 0) {
      alert('Please drop image files only');
      return;
    }

    // Create a fake event to reuse handleImageUpload
    const fakeEvent = {
      target: {
        files: files
      }
    } as any;

    await handleImageUpload(catalogId, variantId, fakeEvent);
  };

  const handleSubmit = async () => {
    // Validate
    for (const catalog of catalogs) {
      if (!catalog.name || !catalog.brand || !catalog.description) {
        alert('Please fill all required fields (Name, Brand, Description)');
        return;
      }
      for (const variant of catalog.variants) {
        if (!variant.color || variant.price <= 0 || variant.stock < 0) {
          alert('Please fill all variant fields (Color, Price, Stock)');
          return;
        }
      }
    }

    setIsSubmitting(true);

    try {
      // Find category ID by slug
      const getCategoryId = (categorySlug: string) => {
        const category = categories.find(c => c.slug === categorySlug);
        return category?.id || categories[0]?.id; // fallback to first category
      };

      let successCount = 0;
      let failCount = 0;

      // Create products for each catalog and variant
      for (const catalog of catalogs) {
        for (const variant of catalog.variants) {
          try {
            const productData = {
              name: `${catalog.name} - ${variant.color}`,
              description: catalog.description || `${catalog.name} in ${variant.color} color`,
              brand: catalog.brand || 'Generic',
              category_id: getCategoryId(catalog.category),
              price: parseFloat(variant.price.toString()),
              original_price: variant.originalPrice ? parseFloat(variant.originalPrice.toString()) : null,
              stock_quantity: parseInt(variant.stock.toString()),
              images: variant.images || [],
              frame_material: catalog.frameMaterial || null,
              frame_shape: catalog.frameShape || null,
              frame_color: variant.color,
              gender: catalog.gender || 'unisex',
              is_featured: catalog.isFeatured || false,
              is_new: true,
            };

            const response = await fetch('/api/seller/products', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-user-id': user?.id || '',
              },
              body: JSON.stringify(productData),
            });

            const data = await response.json();

            if (response.ok) {
              successCount++;
              console.log('✅ Product created:', data.product?.name);
            } else {
              console.error('❌ Failed to create product:', data.error);
              console.error('Product data:', productData);
              failCount++;
            }
          } catch (error) {
            console.error('❌ Error creating product:', error);
            failCount++;
          }
        }
      }

      if (successCount > 0) {
        const message = `Successfully uploaded ${successCount} product(s)!${failCount > 0 ? ` (${failCount} failed - check console for details)` : ''}`;
        alert(message);
        router.push('/seller/catalog');
      } else {
        alert('Failed to upload products. Please check:\n1. All required fields are filled\n2. Images are uploaded\n3. Browser console (F12) for error details');
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      alert('An error occurred while uploading products');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!uploadMode) {
    return (
      <div className="min-h-screen bg-black text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link
              href="/seller/catalog"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Catalog
            </Link>
            <h1 className="text-4xl font-bold mb-2">Upload Product Catalog</h1>
            <p className="text-gray-400">Choose how you want to upload your products</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Single Upload Card */}
            <button
              onClick={handleStartSingleUpload}
              className="bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-800 hover:border-red-600 rounded-lg p-8 text-left transition-all group"
            >
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 group-hover:text-red-500 transition-colors">
                Single Catalog Upload
              </h3>
              <p className="text-gray-400 mb-4">
                Upload one product with multiple variants (colors, sizes) at a time.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Add multiple color variants
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Upload images for each variant
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Set individual prices & stock
                </li>
              </ul>
            </button>

            {/* Bulk Upload Card */}
            <button
              onClick={handleStartBulkUpload}
              className="bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-800 hover:border-red-600 rounded-lg p-8 text-left transition-all group"
            >
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Copy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 group-hover:text-red-500 transition-colors">
                Bulk Catalog Upload
              </h3>
              <p className="text-gray-400 mb-4">
                Upload multiple products at once and edit them simultaneously.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Add multiple catalogs at once
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Edit all products together
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Duplicate similar products
                </li>
              </ul>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <button
              onClick={() => {
                setUploadMode(null);
                setCatalogs([]);
              }}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Change Upload Mode
            </button>
            <h1 className="text-4xl font-bold mb-2">
              {uploadMode === 'single' ? 'Single Catalog Upload' : 'Bulk Catalog Upload'}
            </h1>
            <p className="text-gray-400">
              {uploadMode === 'single'
                ? 'Upload one product with multiple variants'
                : `Uploading ${catalogs.length} catalog${catalogs.length > 1 ? 's' : ''}`}
            </p>
          </div>

          {uploadMode === 'bulk' && (
            <button
              onClick={addNewCatalog}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Another Catalog
            </button>
          )}
        </div>

        {/* Catalogs List */}
        <div className="space-y-8">
          {catalogs.map((catalog, catalogIndex) => (
            <div key={catalog.id} className="bg-zinc-900 rounded-lg border border-zinc-800">
              {/* Catalog Header */}
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center font-bold text-xl">
                    {catalogIndex + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      {catalog.name || `Catalog ${catalogIndex + 1}`}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {catalog.variants.length} variant{catalog.variants.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {uploadMode === 'bulk' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => duplicateCatalog(catalog.id)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                    {catalogs.length > 1 && (
                      <button
                        onClick={() => removeCatalog(catalog.id)}
                        className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="text-lg font-bold mb-4 text-red-500">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Product Name *</label>
                      <input
                        type="text"
                        value={catalog.name}
                        onChange={(e) => updateCatalog(catalog.id, { name: e.target.value })}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
                        placeholder="e.g., Classic Aviator Sunglasses"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Brand *</label>
                      <input
                        type="text"
                        value={catalog.brand}
                        onChange={(e) => updateCatalog(catalog.id, { brand: e.target.value })}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
                        placeholder="e.g., Ray-Ban"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Category *</label>
                      <select
                        value={catalog.category}
                        onChange={(e) => updateCatalog(catalog.id, { category: e.target.value })}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
                      >
                        {categories.length > 0 ? (
                          categories.map(cat => (
                            <option key={cat.id} value={cat.slug}>{cat.name}</option>
                          ))
                        ) : (
                          <>
                            <option value="eyeglasses">Eyeglasses</option>
                            <option value="sunglasses">Sunglasses</option>
                            <option value="lens">Lens</option>
                            <option value="accessories">Accessories</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Gender *</label>
                      <select
                        value={catalog.gender}
                        onChange={(e) => updateCatalog(catalog.id, { gender: e.target.value })}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
                      >
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                        <option value="unisex">Unisex</option>
                        <option value="kids">Kids</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Frame Shape</label>
                      <select
                        value={catalog.frameShape}
                        onChange={(e) => updateCatalog(catalog.id, { frameShape: e.target.value })}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
                      >
                        <option value="round">Round</option>
                        <option value="square">Square</option>
                        <option value="rectangle">Rectangle</option>
                        <option value="cat-eye">Cat-Eye</option>
                        <option value="aviator">Aviator</option>
                        <option value="wayfarer">Wayfarer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Frame Material</label>
                      <select
                        value={catalog.frameMaterial}
                        onChange={(e) => updateCatalog(catalog.id, { frameMaterial: e.target.value })}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
                      >
                        <option value="metal">Metal</option>
                        <option value="plastic">Plastic</option>
                        <option value="acetate">Acetate</option>
                        <option value="titanium">Titanium</option>
                        <option value="wood">Wood</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Description *</label>
                      <textarea
                        value={catalog.description}
                        onChange={(e) => updateCatalog(catalog.id, { description: e.target.value })}
                        rows={3}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
                        placeholder="Describe your product..."
                      />
                    </div>
                  </div>
                </div>

                {/* Variants Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-bold text-red-500">Product Variants</h4>
                    <button
                      onClick={() => addVariantToCatalog(catalog.id)}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Variant
                    </button>
                  </div>

                  <div className="space-y-4">
                    {catalog.variants.map((variant, variantIndex) => (
                      <div key={variant.id} className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                        <div className="flex justify-between items-center mb-4">
                          <h5 className="font-semibold">Variant {variantIndex + 1}</h5>
                          {catalog.variants.length > 1 && (
                            <button
                              onClick={() => removeVariantFromCatalog(catalog.id, variant.id)}
                              className="p-1 bg-red-600 hover:bg-red-700 rounded transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <label className="block text-xs font-medium mb-1">Color *</label>
                            <input
                              type="text"
                              value={variant.color}
                              onChange={(e) => updateVariant(catalog.id, variant.id, { color: e.target.value })}
                              className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                              placeholder="e.g., Black"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium mb-1">Price *</label>
                            <input
                              type="number"
                              value={variant.price}
                              onChange={(e) => updateVariant(catalog.id, variant.id, { price: parseFloat(e.target.value) || 0 })}
                              className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                              placeholder="0"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium mb-1">Original Price</label>
                            <input
                              type="number"
                              value={variant.originalPrice || ''}
                              onChange={(e) => updateVariant(catalog.id, variant.id, { originalPrice: parseFloat(e.target.value) || undefined })}
                              className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                              placeholder="0"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium mb-1">Stock *</label>
                            <input
                              type="number"
                              value={variant.stock}
                              onChange={(e) => updateVariant(catalog.id, variant.id, { stock: parseInt(e.target.value) || 0 })}
                              className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                              placeholder="0"
                            />
                          </div>
                        </div>

                        {/* Images - Meesho Style */}
                        <div>
                          <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                            <Package className="w-4 h-4 text-red-500" />
                            Product Images
                            <span className="text-xs text-gray-400">(Upload from your device)</span>
                          </label>

                          {/* Upload Area - Meesho Style with Drag & Drop */}
                          <div
                            className={`border-2 border-dashed rounded-lg p-6 mb-4 transition-all ${
                              isDragging === variant.id
                                ? 'border-red-500 bg-red-900/20'
                                : 'border-zinc-700 bg-zinc-900/50 hover:border-red-500'
                            }`}
                            onDragOver={(e) => handleDragOver(e, variant.id)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, catalog.id, variant.id)}
                          >
                            {variant.images.length === 0 ? (
                              // Empty state - big upload button
                              <label className="cursor-pointer block">
                                <div className="flex flex-col items-center justify-center py-8">
                                  <div className="w-20 h-20 rounded-full bg-red-600/10 flex items-center justify-center mb-4">
                                    <Upload className="w-10 h-10 text-red-500" />
                                  </div>
                                  <h3 className="text-lg font-semibold mb-2">
                                    {isDragging === variant.id ? 'Drop Images Here' : 'Upload Product Photos'}
                                  </h3>
                                  <p className="text-gray-400 text-sm mb-4 text-center max-w-md">
                                    {isDragging === variant.id
                                      ? 'Release to upload images'
                                      : 'Click to select or drag & drop images from your gallery'}
                                  </p>
                                  {!isDragging && (
                                    <>
                                      <div className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                                        <Upload className="w-5 h-5" />
                                        Choose from Gallery
                                      </div>
                                      <p className="text-xs text-gray-500 mt-3">
                                        Supports: JPG, PNG (Max 5MB each, up to 8 images)
                                      </p>
                                    </>
                                  )}
                                </div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={(e) => handleImageUpload(catalog.id, variant.id, e)}
                                  className="hidden"
                                />
                              </label>
                            ) : (
                              // Images added - show grid with add more button
                              <div>
                                <div className="grid grid-cols-4 md:grid-cols-6 gap-3 mb-3">
                                  {variant.images.map((image, imageIndex) => (
                                    <div key={imageIndex} className="relative aspect-square rounded-lg overflow-hidden bg-zinc-800 border-2 border-zinc-700 group">
                                      <Image src={image} alt={`Product ${imageIndex + 1}`} fill className="object-cover" />
                                      <button
                                        onClick={() => removeImage(catalog.id, variant.id, imageIndex)}
                                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Remove image"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-xs text-white text-center">Image {imageIndex + 1}</p>
                                      </div>
                                    </div>
                                  ))}

                                  {/* Add More Button */}
                                  {variant.images.length < 8 && (
                                    <label className="aspect-square rounded-lg border-2 border-dashed border-zinc-700 hover:border-red-500 bg-zinc-800/50 hover:bg-zinc-800 cursor-pointer flex flex-col items-center justify-center transition-all group">
                                      <Upload className="w-6 h-6 text-gray-400 group-hover:text-red-500 mb-1" />
                                      <span className="text-xs text-gray-400 group-hover:text-red-500">Add More</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => handleImageUpload(catalog.id, variant.id, e)}
                                        className="hidden"
                                      />
                                    </label>
                                  )}
                                </div>

                                <div className="flex items-center justify-between text-xs text-gray-400 bg-zinc-800 px-3 py-2 rounded">
                                  <span>{variant.images.length} / 8 images uploaded</span>
                                  {variant.images.length < 8 && (
                                    <span className="text-red-400">Click "Add More" to add more images</span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Tips */}
                          <div className="bg-blue-900/10 border border-blue-600/30 rounded-lg p-3 text-xs">
                            <p className="text-blue-300 flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              <strong>Pro Tips:</strong> Use clear, high-quality images. First image will be the main product image.
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition-colors"
          >
            {isSubmitting ? 'Uploading...' : `Upload ${catalogs.length} Catalog${catalogs.length > 1 ? 's' : ''}`}
          </button>
          <Link
            href="/seller/catalog"
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-4 rounded-lg transition-colors text-center"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
