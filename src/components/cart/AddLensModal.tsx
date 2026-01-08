// src/components/cart/AddLensModal.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { X, Eye, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AddLensModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

export const AddLensModal: React.FC<AddLensModalProps> = ({
  isOpen,
  onClose,
  productName,
}) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleAddLenses = () => {
    onClose();
    router.push('/products?category=lens');
  };

  const handleSkip = () => {
    onClose();
  };

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-zinc-900 rounded-xl border-2 border-orange-500 p-6 sm:p-8 max-w-md w-full animate-fadeIn shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-orange-500/20 p-4 rounded-full">
            <Eye className="h-12 w-12 text-orange-500" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white text-center mb-3">
          Add Lenses to Your Frame?
        </h2>

        {/* Description */}
        <p className="text-gray-300 text-center mb-6">
          You've added <span className="font-semibold text-orange-500">{productName}</span> to your cart.
          Would you like to add prescription lenses to complete your eyeglasses?
        </p>

        {/* Benefits */}
        <div className="bg-zinc-800 rounded-lg p-4 mb-6 space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span className="text-gray-300 text-sm">Wide range of lens options available</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span className="text-gray-300 text-sm">Blue light protection available</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span className="text-gray-300 text-sm">Anti-glare & scratch-resistant coatings</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span className="text-gray-300 text-sm">Custom prescription lenses</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleAddLenses}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 text-base"
          >
            <Eye className="h-5 w-5 mr-2" />
            Add Lenses Now
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          <Button
            onClick={handleSkip}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-gray-300 font-semibold py-3 text-base"
          >
            Skip for Now
          </Button>
        </div>

        {/* Note */}
        <p className="text-gray-500 text-xs text-center mt-4">
          You can add lenses later from your cart
        </p>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
