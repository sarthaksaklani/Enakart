// src/components/layout/ConditionalFooter.tsx

'use client';

import { usePathname } from 'next/navigation';

export const ConditionalFooter = () => {
  const pathname = usePathname();

  // Hide footer on seller pages
  const hideFooter = pathname?.startsWith('/seller');

  if (hideFooter) {
    return null;
  }

  return (
    <footer className="bg-zinc-950 text-gray-400 py-6 sm:py-8 border-t border-zinc-800">
      <div className="w-full px-3 sm:px-4 text-center">
        <p className="text-xs sm:text-sm">
          &copy; 2024 <span className="text-red-600">ए</span>nakart. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
