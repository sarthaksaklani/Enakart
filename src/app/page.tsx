// src/app/page.tsx

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { ChevronRight } from 'lucide-react';
import { dummyProducts } from '@/lib/data/dummyProducts';
import { ProductCard } from '@/components/products/ProductCard';
import { useAuthStore } from '@/store/authStore';
import { useState, useEffect } from 'react';
import { Product, ProductCategory, FrameShape, FrameMaterial, Gender } from '@/types';

// Mock seller catalog data - should be fetched from database
interface SellerCatalog {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  original_price?: number;
  stock_quantity: number;
  uploadedAt: Date;
  images: string[];
  brand: string;
  frame_shape?: FrameShape;
  frame_material?: FrameMaterial;
  frame_color: string;
  gender: Gender;
  is_featured: boolean;
  description: string;
  specifications?: any;
  created_at: string;
  updated_at: string;
}

export default function HomePage() {
  const { user } = useAuthStore();
  const [sellerCatalogs, setSellerCatalogs] = useState<SellerCatalog[]>([]);

  const featuredProducts = dummyProducts.filter(p => p.is_featured);
  const eyeglasses = dummyProducts.filter(p => p.category === 'eyeglasses').slice(0, 6);
  const sunglasses = dummyProducts.filter(p => p.category === 'sunglasses').slice(0, 6);
  const menProducts = dummyProducts.filter(p => p.gender === 'men').slice(0, 6);
  const womenProducts = dummyProducts.filter(p => p.gender === 'women').slice(0, 6);

  // Check if user is a seller and fetch their recently uploaded catalogs
  useEffect(() => {
    if (user?.role === 'seller') {
      // Mock data - replace with actual API call to fetch seller's catalogs
      const mockSellerCatalogs: SellerCatalog[] = [
        {
          id: 'seller-1',
          name: 'Ray-Ban Aviator Classic',
          category: 'sunglasses',
          price: 12999,
          original_price: 15999,
          stock_quantity: 50,
          uploadedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
          images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400'],
          brand: 'Ray-Ban',
          frame_shape: 'aviator',
          frame_material: 'metal',
          frame_color: 'Gold',
          gender: 'unisex',
          is_featured: true,
          description: 'Classic aviator sunglasses',
          specifications: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'seller-2',
          name: 'Premium Blue Light Glasses',
          category: 'eyeglasses',
          price: 5999,
          stock_quantity: 100,
          uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          images: ['https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400'],
          brand: 'Blue Shield',
          frame_shape: 'round',
          frame_material: 'plastic',
          frame_color: 'Black',
          gender: 'unisex',
          is_featured: false,
          description: 'Blue light blocking glasses',
          specifications: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      // Show all catalogs on seller homepage
      setSellerCatalogs(mockSellerCatalogs);
    }
  }, [user]);

  const isSeller = user?.role === 'seller';
  const hasRecentCatalogs = sellerCatalogs.length > 0;

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Banner - Netflix Style */}
      <section className="relative h-[70vh] sm:h-[80vh] lg:h-[85vh] w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1920&h=1080&fit=crop"
            alt="Hero Banner"
            fill
            className="object-cover animate-slow-zoom"
            priority
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
          {/* Subtle red tint overlay */}
          <div className="absolute inset-0 bg-red-900/5"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16">
            <div className="max-w-3xl space-y-4 sm:space-y-6 animate-fade-in-up">
              {/* Trending badge */}
              <div className="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                TRENDING NOW
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Premium Eyewear
                <br />
                <span className="text-red-600">Redefined</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 leading-relaxed max-w-2xl">
                Discover our exclusive collection of designer frames and sunglasses.
                Virtual try-on, premium materials, and styles that make a statement.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-32 bg-gradient-to-t from-black to-transparent"></div>
      </section>

      {/* Seller's Uploaded Catalogs */}
      {isSeller && hasRecentCatalogs && (
        <section className="py-10 sm:py-12 lg:py-16 px-3 sm:px-4 lg:px-6 xl:px-8 bg-gradient-to-b from-red-950/10 to-black border-y border-red-900/20">
          <div className="w-full mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 flex items-center gap-2">
                  Your Uploaded Catalogs
                </h2>
                <p className="text-sm sm:text-base text-gray-400">Manage your product listings</p>
              </div>
              <Link href="/seller/uploaded-catalogs" className="text-red-500 hover:text-red-400 flex items-center gap-1 font-semibold transition-colors group text-sm sm:text-base">
                View All Catalogs
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
              {sellerCatalogs.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-10 sm:py-12 lg:py-16 px-3 sm:px-4 lg:px-6 xl:px-8 bg-black">
        <div className="w-full mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">Featured Collection</h2>
              <p className="text-sm sm:text-base text-gray-400">Handpicked favorites just for you</p>
            </div>
            <Link href="/products?featured=true" className="text-red-500 hover:text-red-400 flex items-center gap-1 font-semibold transition-colors group text-sm sm:text-base">
              Explore All
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {featuredProducts.slice(0, 6).map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eyeglasses Row */}
      <section className="py-8 sm:py-10 lg:py-12 px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="w-full mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">Eyeglasses</h2>
              <p className="text-sm sm:text-base text-gray-400">Perfect vision, premium style</p>
            </div>
            <Link href="/products?category=eyeglasses" className="text-red-500 hover:text-red-400 flex items-center gap-1 font-semibold transition-colors group text-sm sm:text-base">
              Explore All
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {eyeglasses.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Sunglasses Row */}
      <section className="py-8 sm:py-10 lg:py-12 px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="w-full mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">Sunglasses</h2>
              <p className="text-sm sm:text-base text-gray-400">Style meets sun protection</p>
            </div>
            <Link href="/products?category=sunglasses" className="text-red-500 hover:text-red-400 flex items-center gap-1 font-semibold transition-colors group text-sm sm:text-base">
              Explore All
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {sunglasses.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Category Banner - Men */}
      <section className="py-8 sm:py-10 lg:py-12 px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="w-full mx-auto">
          <div className="relative h-48 sm:h-60 md:h-72 rounded-lg overflow-hidden mb-4 sm:mb-6 group">
            <Image
              src="https://images.unsplash.com/photo-1614715838608-dd527c46231d?w=1920&h=400&fit=crop"
              alt="Men's Collection"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            <div className="absolute inset-0 flex items-end p-4 sm:p-6 md:p-8 lg:p-12">
              <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                <div className="inline-block bg-red-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded text-xs sm:text-sm font-bold">
                  NEW ARRIVALS
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">Men's Collection</h2>
                <p className="text-sm sm:text-base lg:text-lg text-gray-200 max-w-md">Bold designs for the modern gentleman</p>
                <Link href="/products?gender=men">
                  <Button className="bg-white text-black hover:bg-gray-200 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 font-bold shadow-xl hover:scale-105 transition-transform duration-300 text-sm sm:text-base">
                    Shop Men's
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {menProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Category Banner - Women */}
      <section className="py-8 sm:py-10 lg:py-12 px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="w-full mx-auto">
          <div className="relative h-48 sm:h-60 md:h-72 rounded-lg overflow-hidden mb-4 sm:mb-6 group">
            <Image
              src="https://images.unsplash.com/photo-1508296695146-257a814070b4?w=1920&h=400&fit=crop"
              alt="Women's Collection"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            <div className="absolute inset-0 flex items-end p-4 sm:p-6 md:p-8 lg:p-12">
              <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                <div className="inline-block bg-red-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded text-xs sm:text-sm font-bold">
                  BEST SELLERS
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">Women's Collection</h2>
                <p className="text-sm sm:text-base lg:text-lg text-gray-200 max-w-md">Elegant styles that make a statement</p>
                <Link href="/products?gender=women">
                  <Button className="bg-white text-black hover:bg-gray-200 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 font-bold shadow-xl hover:scale-105 transition-transform duration-300 text-sm sm:text-base">
                    Shop Women's
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {womenProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4 lg:px-6 xl:px-8 bg-zinc-950 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-600 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full mx-auto relative z-10">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
              Why Choose <span className="text-red-600">ए</span>nakart
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-400">Experience the difference with premium eyewear</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center p-6 sm:p-8 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-all duration-300 hover:scale-105 group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-red-600 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-red-600/50">
                <svg className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Quality Guaranteed</h3>
              <p className="text-sm sm:text-base text-gray-400">100% authentic products from trusted brands with lifetime warranty</p>
            </div>

            <div className="text-center p-6 sm:p-8 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-all duration-300 hover:scale-105 group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-red-600 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-red-600/50">
                <svg className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Fast Delivery</h3>
              <p className="text-sm sm:text-base text-gray-400">Free express shipping on all orders above ₹999</p>
            </div>

            <div className="text-center p-6 sm:p-8 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-all duration-300 hover:scale-105 group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-red-600 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-red-600/50">
                <svg className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Easy Returns</h3>
              <p className="text-sm sm:text-base text-gray-400">14-day hassle-free returns and exchanges</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-3 sm:px-4 lg:px-6 xl:px-8 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-black"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-red-600/10 via-transparent to-transparent"></div>
        </div>

        <div className="w-full max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
            Ready to find your <span className="text-red-600">perfect frame</span>?
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 lg:mb-10 leading-relaxed px-4">
            Join thousands of happy customers who found their style with us
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link href="/products">
              <Button size="lg" className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg shadow-2xl shadow-red-600/50 hover:scale-105 transition-all duration-300">
                Explore Collection
                <ChevronRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </Link>
            <Link href="/account">
              <Button size="lg" className="w-full sm:w-auto bg-white text-black hover:bg-gray-200 font-bold px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg shadow-xl hover:scale-105 transition-all duration-300">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Spacer */}
      <div className="h-10 sm:h-20"></div>
    </div>
  );
}
