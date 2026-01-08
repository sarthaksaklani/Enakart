// src/app/lens-wizard/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { LensWizard } from '@/components/products/LensWizard';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';

export default function LensWizardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { items } = useCartStore();

  const productId = searchParams.get('productId');
  const [frameProduct, setFrameProduct] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    // Find the product in cart
    if (productId) {
      const cartItem = items.find(item => item.product.id === productId);
      if (cartItem) {
        setFrameProduct({
          id: cartItem.product.id,
          name: cartItem.product.name,
        });
      } else {
        // If product not in cart, redirect to products page
        router.push('/products');
      }
    } else {
      // No product ID provided, redirect to products page
      router.push('/products');
    }
  }, [productId, items, router]);

  if (!frameProduct) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <LensWizard
      frameProductId={frameProduct.id}
      frameProductName={frameProduct.name}
    />
  );
}
