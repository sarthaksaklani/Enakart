'use client';

import { ResellerProductCard } from '@/components/products/ResellerProductCard';
import { dummyProducts } from '@/lib/data/dummyProducts';

export default function ResellerDashboard() {
  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="w-full mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Reseller Dashboard</h1>
          <p className="text-gray-400 mb-2">Browse products - Hover over any product to see share buttons!</p>
          <p className="text-sm text-gray-500">Showing {dummyProducts.length} products</p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {dummyProducts.map((product, index) => (
            <div
              key={product.id}
              className="opacity-0 animate-fadeIn"
              style={{
                animationDelay: `${index * 0.05}s`,
                animationFillMode: 'forwards',
              }}
            >
              <ResellerProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
