// src/components/layout/ConditionalNavbar.tsx

'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';

export const ConditionalNavbar = () => {
  const pathname = usePathname();

  // Hide navbar on seller dashboard and all seller pages
  const hideNavbar = pathname?.startsWith('/seller');

  if (hideNavbar) {
    return null;
  }

  return <Navbar />;
};
