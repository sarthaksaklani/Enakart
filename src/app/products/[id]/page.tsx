// src/app/products/[id]/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingCart,
  Heart,
  Truck,
  Package,
  Shield,
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  Minus,
  Plus
} from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { ProductCard } from '@/components/products/ProductCard';
import { AddLensModal } from '@/components/cart/AddLensModal';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showLensModal, setShowLensModal] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        // Fetch all products
        const response = await fetch('/api/products');
        const data = await response.json();

        if (data.success && data.products) {
          // Find the product by ID
          const foundProduct = data.products.find((p: Product) => p.id === params.id);
          if (foundProduct) {
            setProduct(foundProduct);

            // Get related products from same category
            const related = data.products
              .filter((p: any) => p.id !== foundProduct.id && p.category_id === foundProduct.category_id)
              .slice(0, 4);
            setRelatedProducts(related);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Product not found</h2>
          <Link href="/products">
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate delivery date (3-5 business days)
  const getDeliveryDate = () => {
    const today = new Date();
    const minDays = 3;
    const maxDays = 5;

    const minDate = new Date(today);
    minDate.setDate(today.getDate() + minDays);

    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + maxDays);

    return {
      min: minDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      max: maxDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  };

  const deliveryDate = getDeliveryDate();
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleAddToCart = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      alert('Please login or register to add items to cart');
      router.push('/account');
      return;
    }

    await addItem(product, quantity);

    // Show lens modal if product is eyeglasses
    if (product.category === 'eyeglasses') {
      setShowLensModal(true);
    } else {
      alert(`${quantity} x ${product.name} added to cart!`);
    }
  };

  const handleBuyNow = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      alert('Please login or register to continue');
      router.push('/account');
      return;
    }

    await addItem(product, quantity);
    router.push('/cart');
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Back Button */}
      <div className="bg-zinc-900">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            Back to Products
          </button>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative h-96 lg:h-[600px] bg-zinc-900 rounded-lg overflow-hidden group">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />

              {/* Image Navigation */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) =>
                      prev === 0 ? product.images.length - 1 : prev - 1
                    )}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) =>
                      prev === product.images.length - 1 ? 0 : prev + 1
                    )}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discount > 0 && (
                  <span className="bg-red-600 text-white text-sm font-bold px-3 py-1.5 rounded shadow-lg">
                    {discount}% OFF
                  </span>
                )}
                {product.is_featured && (
                  <span className="bg-yellow-500 text-black text-sm font-bold px-3 py-1.5 rounded shadow-lg">
                    ⭐ FEATURED
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-24 bg-zinc-900 rounded-lg overflow-hidden transition-all duration-300 ${
                      selectedImage === index
                        ? 'ring-2 ring-red-600 scale-105'
                        : 'hover:ring-2 hover:ring-gray-600'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand */}
            <div>
              <p className="text-red-500 text-sm font-bold uppercase tracking-wider">
                {product.brand}
              </p>
            </div>

            {/* Product Name */}
            <h1 className="text-4xl font-bold text-white leading-tight">
              {product.name}
            </h1>

            {/* Rating (Mock) */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < 4 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`}
                  />
                ))}
              </div>
              <span className="text-gray-400 text-sm">(128 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-white">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.original_price && (
                <>
                  <span className="text-2xl text-gray-500 line-through">
                    ₹{product.original_price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-red-500 text-xl font-bold">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock_quantity > 0 ? (
                <>
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-green-500 font-semibold">
                    In Stock ({product.stock_quantity} available)
                  </span>
                </>
              ) : (
                <span className="text-red-500 font-semibold">Out of Stock</span>
              )}
            </div>

            {/* Description */}
            <div className="bg-zinc-900 rounded-lg p-6 space-y-3">
              <h3 className="text-xl font-bold text-white">Description</h3>
              <p className="text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            <div className="bg-zinc-900 rounded-lg p-6 space-y-4">
              <h3 className="text-xl font-bold text-white">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Category</p>
                  <p className="text-white font-semibold capitalize">{product.category}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Frame Shape</p>
                  <p className="text-white font-semibold capitalize">{product.frame_shape}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Material</p>
                  <p className="text-white font-semibold capitalize">{product.frame_material}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Color</p>
                  <p className="text-white font-semibold capitalize">{product.frame_color}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Gender</p>
                  <p className="text-white font-semibold capitalize">{product.gender}</p>
                </div>
                {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-gray-400 text-sm capitalize">{key.replace('_', ' ')}</p>
                    <p className="text-white font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-zinc-900 rounded-lg p-6 space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Truck className="h-5 w-5 text-red-500" />
                Delivery Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-white font-semibold">Free Delivery</p>
                    <p className="text-gray-400 text-sm">On orders above ₹999</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-white font-semibold">
                      Expected Delivery: {deliveryDate.min} - {deliveryDate.max}
                    </p>
                    <p className="text-gray-400 text-sm">3-5 business days</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-white font-semibold">14-Day Return Policy</p>
                    <p className="text-gray-400 text-sm">Easy returns and exchanges</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            {product.stock_quantity > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-white font-semibold">Quantity:</span>
                <div className="flex items-center gap-3 bg-zinc-900 rounded-lg p-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-zinc-800 rounded transition-colors"
                  >
                    <Minus className="h-4 w-4 text-white" />
                  </button>
                  <span className="text-white font-bold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="p-2 hover:bg-zinc-800 rounded transition-colors"
                  >
                    <Plus className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 text-lg shadow-xl hover:shadow-red-600/50 transition-all duration-300 hover:scale-105"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`px-6 py-4 font-bold transition-all duration-300 ${
                    isWishlisted
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-white' : ''}`} />
                </Button>
              </div>
              <Button
                onClick={handleBuyNow}
                disabled={product.stock_quantity === 0}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 text-lg shadow-xl hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105"
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">You Might Also Like</h2>
              <p className="text-gray-400">Similar products in this category</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Lens Modal */}
      <AddLensModal
        isOpen={showLensModal}
        onClose={() => setShowLensModal(false)}
        productName={product.name}
      />
    </div>
  );
}
