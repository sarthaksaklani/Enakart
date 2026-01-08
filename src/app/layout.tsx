// src/app/layout.tsx

import type { Metadata } from 'next';
import './globals.css';
import { ConditionalNavbar } from '@/components/layout/ConditionalNavbar';
import { ConditionalFooter } from '@/components/layout/ConditionalFooter';

export const metadata: Metadata = {
  title: 'एnakart - Premium Eyewear Online',
  description: 'Buy eyeglasses, sunglasses, and contact lenses online with virtual try-on',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body className="font-sans antialiased">
        <ConditionalNavbar />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <ConditionalFooter />
      </body>
    </html>
  );
}
