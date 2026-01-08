// src/components/products/ProductCard.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, Share2, Zap, Link2 } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { calculateDiscount } from '@/lib/utils/format';
import { AddLensModal } from '@/components/cart/AddLensModal';

interface ProductCardProps {
  product: Product;
}

// WhatsApp icon SVG component
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

// Share Modal Component
const ShareModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}> = ({ isOpen, onClose, product }) => {
  if (!isOpen) return null;

  const productUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/products/${product.id}`;
  const shareText = `Check out this amazing ${product.name} - ₹${product.price.toLocaleString('en-IN')}`;

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: WhatsAppIcon,
      color: 'bg-green-500 hover:bg-green-600',
      url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + productUrl)}`,
    },
    {
      name: 'Telegram',
      color: 'bg-blue-500 hover:bg-blue-600',
      url: `https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareText)}`,
      icon: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
    },
    {
      name: 'Facebook',
      color: 'bg-blue-600 hover:bg-blue-700',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
      icon: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      name: 'Twitter',
      color: 'bg-sky-500 hover:bg-sky-600',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl)}`,
      icon: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      color: 'bg-blue-700 hover:bg-blue-800',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(productUrl)}`,
      icon: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
    },
    {
      name: 'Email',
      color: 'bg-gray-600 hover:bg-gray-700',
      url: `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(productUrl)}`,
      icon: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      ),
    },
  ];

  const handleShare = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 rounded-lg border-2 border-zinc-800 p-6 max-w-md w-full animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Share Product</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {shareOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.name}
                onClick={() => handleShare(option.url)}
                className={`w-full flex items-center gap-4 p-4 ${option.color} text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg`}
              >
                <Icon className="h-6 w-6" />
                <span className="font-semibold text-lg">Share on {option.name}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 p-3 bg-zinc-800 rounded-lg">
          <p className="text-xs text-gray-400 mb-2">Product Link:</p>
          <p className="text-sm text-white break-all">{productUrl}</p>
        </div>
      </div>
    </div>
  );
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const { user, isAuthenticated } = useAuthStore();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLensModal, setShowLensModal] = useState(false);
  const isReseller = user?.role === 'reseller';
  const isSeller = user?.role === 'seller';
  const isCustomer = user?.role === 'customer' || !user;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    // Check if user is authenticated
    if (!isAuthenticated) {
      alert('Please login or register to add items to cart');
      router.push('/account');
      return;
    }

    addItem(product, 1);

    // Show lens modal if product is eyeglasses
    if (product.category === 'eyeglasses') {
      setShowLensModal(true);
    } else {
      alert(`${product.name} added to cart!`);
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();

    // Check if user is authenticated
    if (!isAuthenticated) {
      alert('Please login or register to continue');
      router.push('/account');
      return;
    }

    addItem(product, 1);
    router.push('/cart');
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    const productUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/products/${product.id}`;
    navigator.clipboard.writeText(productUrl);
    alert('Product link copied to clipboard!');
  };

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.preventDefault();
    const productUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/products/${product.id}`;
    const message = `Check out this amazing ${product.name} - ₹${product.price.toLocaleString('en-IN')} ${productUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowShareModal(true);
  };

  const discount = product.original_price
    ? calculateDiscount(product.original_price, product.price)
    : 0;

  // Safely get first image URL
  const getImageUrl = () => {
    try {
      // If images is a string, try to parse it
      if (typeof product.images === 'string') {
        const parsed = JSON.parse(product.images);
        return Array.isArray(parsed) && parsed.length > 0
          ? parsed[0]
          : '/placeholder-product.png';
      }

      // If images is an array
      if (Array.isArray(product.images) && product.images.length > 0) {
        return product.images[0];
      }

      // Fallback placeholder
      return '/placeholder-product.png';
    } catch (error) {
      console.error('Error parsing product images:', error);
      return '/placeholder-product.png';
    }
  };

  const imageUrl = getImageUrl();

  return (
    <>
      <Link href={`/products/${product.id}`}>
        <div className="relative bg-zinc-900 rounded-md overflow-hidden group cursor-pointer transition-all duration-300 border-2 border-transparent hover:border-red-600">
        {/* Image Container */}
        <div className="relative h-32 sm:h-36 bg-zinc-800 overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={imageUrl === '/placeholder-product.png'}
          />

          {/* Attractive overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Badges - Attractive style */}
          <div className="absolute top-1 sm:top-1.5 left-1 sm:left-1.5 flex flex-col gap-0.5 sm:gap-1 z-10">
            {discount > 0 && (
              <span className="bg-red-600 text-white text-[8px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.5 rounded shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                {discount}% OFF
              </span>
            )}
            {product.is_featured && (
              <span className="bg-yellow-500 text-black text-[8px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.5 rounded shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                ⭐ FEATURED
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            className="absolute top-1 sm:top-1.5 right-1 sm:right-1.5 bg-black/60 backdrop-blur-sm p-1 sm:p-1.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:scale-110 transition-all duration-300 z-10"
            onClick={(e) => {
              e.preventDefault();
              alert('Wishlist feature coming soon!');
            }}
          >
            <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
          </button>

          {/* Out of Stock Overlay */}
          {product.stock_quantity === 0 && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-bold text-sm bg-red-600 px-4 py-2 rounded">OUT OF STOCK</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-1.5 sm:p-2 space-y-0.5 sm:space-y-1">
          {/* Brand */}
          <p className="text-[10px] sm:text-xs text-red-500 uppercase tracking-wider font-bold">
            {product.brand}
          </p>

          {/* Product Name */}
          <h3 className="font-semibold text-white text-[11px] sm:text-xs line-clamp-2 leading-tight">
            {product.name}
          </h3>

          {/* Tags - Hide on mobile, show on larger screens */}
          <div className="hidden sm:flex flex-wrap gap-1">
            <span className="text-[10px] text-gray-400 bg-zinc-800 px-2 py-0.5 rounded-full border border-zinc-700">
              {product.frame_shape}
            </span>
            <span className="text-[10px] text-gray-400 bg-zinc-800 px-2 py-0.5 rounded-full border border-zinc-700">
              {product.gender}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-1 pt-0.5">
            <span className="text-sm sm:text-base font-bold text-white">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.original_price && (
              <span className="text-[10px] sm:text-xs text-gray-500 line-through">
                ₹{product.original_price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Action Buttons - Shows on hover for customers */}
          {isCustomer && !isSeller && (
            <div className="pt-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <div className="flex gap-1 sm:gap-1.5">
                {/* Add to Cart Button */}
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] sm:text-xs py-1 sm:py-1.5 rounded shadow-lg hover:shadow-red-600/50 transition-all duration-300"
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                >
                  <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                    <ShoppingCart className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    <span className="text-[9px] sm:text-[10px]">{product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                  </div>
                </Button>

                {/* Buy Now Button */}
                <Button
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-[10px] sm:text-xs py-1 sm:py-1.5 rounded shadow-lg hover:shadow-yellow-500/50 transition-all duration-300"
                  onClick={handleBuyNow}
                  disabled={product.stock_quantity === 0}
                >
                  <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                    <Zap className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    <span className="text-[9px] sm:text-[10px]">Buy Now</span>
                  </div>
                </Button>

                {/* Copy Link Button */}
                <Button
                  className="bg-zinc-700 hover:bg-zinc-600 text-white font-bold p-1 sm:p-1.5 rounded shadow-lg transition-all duration-300"
                  onClick={handleCopyLink}
                >
                  <Link2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </Button>
              </div>
            </div>
          )}

          {/* Seller: Show only add to cart */}
          {isSeller && (
            <div className="pt-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <Button
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] sm:text-xs py-1 sm:py-1.5 rounded shadow-lg hover:shadow-red-600/50 transition-all duration-300"
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
              >
                <div className="flex items-center justify-center">
                  <ShoppingCart className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                  <span className="hidden sm:inline text-[10px]">{product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                  <span className="sm:hidden text-[9px]">Add</span>
                </div>
              </Button>
            </div>
          )}
        </div>

        {/* Reseller: Add to Cart button in bottom left on hover */}
        {isReseller && (
          <div className="absolute bottom-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
            <Button
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] sm:text-xs py-1 sm:py-1.5 px-2 sm:px-3 rounded shadow-lg hover:shadow-red-600/50 transition-all duration-300"
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
            >
              <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                <ShoppingCart className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span className="text-[9px] sm:text-[10px]">{product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
              </div>
            </Button>
          </div>
        )}

        {/* Reseller: Share buttons in bottom right on hover */}
        {isReseller && (
          <div className="absolute bottom-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 flex gap-1">
            <Button
              className="bg-green-500 hover:bg-green-600 text-white font-bold text-[10px] sm:text-xs py-1 sm:py-1.5 px-2 sm:px-3 rounded shadow-lg hover:shadow-green-500/50 transition-all duration-300"
              onClick={handleWhatsAppShare}
            >
              <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                <WhatsAppIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span className="text-[9px] sm:text-[10px]">Share</span>
              </div>
            </Button>
            <Button
              className="bg-zinc-700 hover:bg-zinc-600 text-white font-bold p-1 sm:p-1.5 rounded shadow-lg transition-all duration-300"
              onClick={handleShareClick}
            >
              <Share2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            </Button>
          </div>
        )}
      </div>

      </Link>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        product={product}
      />

      {/* Add Lens Modal */}
      <AddLensModal
        isOpen={showLensModal}
        onClose={() => setShowLensModal(false)}
        productName={product.name}
      />
    </>
  );
};
