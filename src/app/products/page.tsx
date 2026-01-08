// src/app/products/page.tsx

'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';
import { SortDropdown } from '@/components/products/SortDropdown';
import { ProductFilters as Filters, Product, ProductCategory } from '@/types';
import { Glasses, Sun, Package, Eye } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [filters, setFilters] = useState<Filters>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from API
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        const data = await response.json();

        if (data.success) {
          setProducts(data.products);
        } else {
          console.error('Failed to fetch products:', data.error);
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Initialize filters from URL query parameters
  useEffect(() => {
    const categoryParam = searchParams.get('category') as ProductCategory | null;
    const searchParam = searchParams.get('search');

    const newFilters: Filters = {};

    // Redirect customers trying to access lens category to home page
    if (categoryParam === 'lens' && isAuthenticated && user?.role === 'customer') {
      router.push('/');
      return;
    }

    if (categoryParam && ['eyeglasses', 'lens', 'sunglasses', 'accessories', 'contact-lenses'].includes(categoryParam)) {
      newFilters.category = categoryParam;
    }

    if (searchParam) {
      newFilters.search = searchParam;
    }

    setFilters(newFilters);
  }, [searchParams, isAuthenticated, user, router]);

  // Filter products based on current filters
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter - check multiple fields
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower) ||
          product.brand.toLowerCase().includes(searchLower) ||
          product.frame_color.toLowerCase().includes(searchLower) ||
          (product.frame_shape && product.frame_shape.toLowerCase().includes(searchLower)) ||
          (product.frame_material && product.frame_material.toLowerCase().includes(searchLower)) ||
          product.gender.toLowerCase().includes(searchLower);

        if (!matchesSearch) {
          return false;
        }
      }

      // Category filter
      if (filters.category && product.category !== filters.category) {
        return false;
      }

      // Product Type filter (alternative category filter)
      if (filters.product_type && product.category !== filters.product_type) {
        return false;
      }

      // Gender filter
      if (filters.gender && product.gender !== filters.gender && product.gender !== 'unisex') {
        return false;
      }

      // Frame shape filter
      if (filters.frame_shape && product.frame_shape !== filters.frame_shape) {
        return false;
      }

      // Frame material filter
      if (filters.frame_material && product.frame_material !== filters.frame_material) {
        return false;
      }

      // Frame type filter
      if (filters.frame_type) {
        // Note: Products don't have frame_type in the schema yet, but filter is ready
        // This will work once products have frame_type property
        const productFrameType = (product as any).frame_type;
        if (productFrameType && productFrameType !== filters.frame_type) {
          return false;
        }
      }

      // Frame colors filter (multiple selection)
      if (filters.frame_colors && filters.frame_colors.length > 0) {
        if (!filters.frame_colors.includes(product.frame_color)) {
          return false;
        }
      }

      // Brands filter (multiple selection)
      if (filters.brands && filters.brands.length > 0) {
        if (!filters.brands.includes(product.brand)) {
          return false;
        }
      }

      // Brand filter (single selection - for backward compatibility)
      if (filters.brand && product.brand !== filters.brand) {
        return false;
      }

      // Frame size filter
      if (filters.frame_size) {
        // Note: Products don't have frame_size in the schema yet
        const productFrameSize = (product as any).frame_size;
        if (productFrameSize && productFrameSize !== filters.frame_size) {
          return false;
        }
      }

      // Frame width filter
      if (filters.frame_width) {
        const productFrameWidth = (product as any).frame_width;
        if (productFrameWidth && productFrameWidth !== filters.frame_width) {
          return false;
        }
      }

      // Weight group filter
      if (filters.weight_group) {
        const productWeightGroup = (product as any).weight_group;
        if (productWeightGroup && productWeightGroup !== filters.weight_group) {
          return false;
        }
      }

      // Prescription type filter
      if (filters.prescription_type) {
        const productPrescriptionType = (product as any).prescription_type;
        if (productPrescriptionType && productPrescriptionType !== filters.prescription_type) {
          return false;
        }
      }

      // Collection filter
      if (filters.collection) {
        const productCollection = (product as any).collection;
        if (productCollection && productCollection !== filters.collection) {
          return false;
        }
      }

      // Glass color filter
      if (filters.glass_color) {
        const productGlassColor = (product as any).glass_color;
        if (productGlassColor && productGlassColor !== filters.glass_color) {
          return false;
        }
      }

      // Country of origin filter
      if (filters.country_of_origin) {
        const productCountry = (product as any).country_of_origin;
        if (productCountry && productCountry !== filters.country_of_origin) {
          return false;
        }
      }

      // Price range filter
      if (filters.min_price && product.price < filters.min_price) {
        return false;
      }
      if (filters.max_price && product.price > filters.max_price) {
        return false;
      }

      return true;
    });
  }, [filters, products]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const products = [...filteredProducts];

    switch (filters.sort_by) {
      case 'price_asc':
        return products.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return products.sort((a, b) => b.price - a.price);
      case 'newest':
        return products.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case 'popular':
        return products.filter(p => p.is_featured).concat(products.filter(p => !p.is_featured));
      default:
        return products;
    }
  }, [filteredProducts, filters.sort_by]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  // Get category info for header
  const getCategoryInfo = () => {
    switch (filters.category) {
      case 'eyeglasses':
        return {
          title: 'Eyeglasses',
          description: 'Discover our premium collection of eyeglasses where style meets perfect vision.',
          icon: Glasses,
          bgImage: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1920&h=600&fit=crop',
        };
      case 'lens':
        return {
          title: 'Lenses',
          description: 'Experience crystal-clear vision with our advanced lens technology and coatings.',
          icon: Eye,
          bgImage: 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?w=1920&h=600&fit=crop',
        };
      case 'sunglasses':
        return {
          title: 'Sunglasses',
          description: 'Protect your eyes in style with our exclusive sunglasses range.',
          icon: Sun,
          bgImage: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1920&h=600&fit=crop',
        };
      case 'accessories':
        return {
          title: 'Eyewear Accessories',
          description: 'Elevate your eyewear experience with our curated collection of premium accessories.',
          icon: Package,
          bgImage: 'https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=1920&h=600&fit=crop',
        };
      case 'contact-lenses':
        return {
          title: 'Contact Lenses',
          description: 'Discover our premium collection of contact lenses for clear, comfortable vision all day long.',
          icon: Eye,
          bgImage: 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?w=1920&h=600&fit=crop',
        };
      default:
        return null;
    }
  };

  const categoryInfo = getCategoryInfo();

  // Show loading state
  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      {/* Category-Specific Hero */}
      {categoryInfo ? (
        <section className="relative h-[50vh] min-h-[400px] w-full overflow-hidden mb-12">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={categoryInfo.bgImage}
              alt={categoryInfo.title}
              fill
              className="object-cover"
              priority
            />
            {/* Simple gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 h-full flex items-end pb-16">
            <div className="w-full mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
              <div className="max-w-2xl">
                {/* Title */}
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                  {categoryInfo.title}
                </h1>

                {/* Description */}
                <p className="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed">
                  {categoryInfo.description}
                </p>

                {/* Simple stats */}
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{sortedProducts.length} Products</span>
                  <span>•</span>
                  <span>{sortedProducts.filter(p => p.is_featured).length} Featured</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* Default Page Header for "All Products" or Search Results */
        <div className="mb-8 pt-8 px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="w-full mx-auto">
            {filters.search ? (
              <>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Search Results for "{filters.search}"
                </h1>
                <p className="text-gray-400">
                  Found {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
                </p>
              </>
            ) : (
              <>
                <h1 className="text-4xl font-bold text-white mb-2">All Products</h1>
                <p className="text-gray-400">
                  Showing {sortedProducts.length} of {products.length} products
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <div className="w-full mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 pb-12">

      {/* Sort Dropdown - Right aligned */}
      <div className="mb-8 flex items-center justify-end">
        <SortDropdown
          value={filters.sort_by || ''}
          onChange={(value) => setFilters({ ...filters, sort_by: value as any })}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar - Always visible with increased width */}
        <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0">
          <ProductFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </aside>

        {/* Product Grid with animations - Reduced items per row */}
        <main className="flex-1">
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {sortedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="opacity-0 animate-fadeIn"
                  style={{
                    animationDelay: `${index * 0.05}s`,
                    animationFillMode: 'forwards',
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-zinc-900 rounded-lg border border-zinc-800">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 rounded-full bg-red-600/20 flex items-center justify-center mx-auto mb-6">
                  <Package className="h-10 w-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  No products found
                </h3>
                <p className="text-gray-400 mb-8">
                  Try adjusting your filters or search criteria
                </p>
                <button
                  onClick={handleClearFilters}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:shadow-red-600/50 transition-all duration-300 hover:scale-105"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><p className="text-white">Loading...</p></div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
