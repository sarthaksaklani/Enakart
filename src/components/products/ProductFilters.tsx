// src/components/products/ProductFilters.tsx

'use client';

import React, { useState, useMemo } from 'react';
import { ProductFilters as Filters, Product } from '@/types';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { dummyProducts } from '@/lib/data/dummyProducts';

interface ProductFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  onClearFilters: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  // State to track which filter sections are expanded
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    frameType: true,
    frameShape: true,
    frameColor: false,
    brands: true,
    price: true,
    gender: true,
  });

  // State for brand search
  const [brandSearch, setBrandSearch] = useState('');

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Calculate unique brands and their counts
  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    dummyProducts.forEach(product => {
      if (product.brand) {
        counts[product.brand] = (counts[product.brand] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([brand, count]) => ({ value: brand, label: brand, count }));
  }, []);

  // Calculate unique frame colors and their counts
  // For eyeglasses category, only show colors available in eyeglasses
  const colorCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    dummyProducts.forEach(product => {
      // Filter by category if eyeglasses is selected
      if (filters.category === 'eyeglasses' && product.category !== 'eyeglasses') {
        return; // Skip products that are not eyeglasses
      }
      if (product.frame_color) {
        counts[product.frame_color] = (counts[product.frame_color] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([color, count]) => ({ value: color, label: color, count }));
  }, [filters.category]);

  // Frame Type icons (visual buttons)
  const frameTypes = [
    { value: 'full-rim', label: 'Full Rim' },
    { value: 'half-rim', label: 'Rimless' },
    { value: 'rimless', label: 'Half Rim' },
  ];

  // Frame Shape icons (visual buttons)
  const frameShapes = [
    { value: 'square', label: 'Square' },
    { value: 'rectangle', label: 'Rectang...' },
    { value: 'cat-eye', label: 'Cat Eye' },
    { value: 'round', label: 'Round' },
    { value: 'geometric', label: 'Geomet...' },
    { value: 'aviator', label: 'Aviator' },
    { value: 'wayfarer', label: 'Clubma...' },
  ];

  const genders = [
    { value: 'men', label: 'Men' },
    { value: 'women', label: 'Women' },
    { value: 'unisex', label: 'Unisex' },
    { value: 'kids', label: 'Kids' },
  ];

  const frameSizes = [
    { value: 'narrow', label: 'Narrow' },
    { value: 'medium', label: 'Medium' },
    { value: 'wide', label: 'Wide' },
  ];

  const frameMaterials = [
    { value: 'metal', label: 'Metal' },
    { value: 'sheet', label: 'Sheet' },
    { value: 'acetate', label: 'Acetate' },
    { value: 'titanium', label: 'Titanium' },
  ];

  const weightGroups = [
    { value: 'light', label: 'Light (< 20g)' },
    { value: 'medium', label: 'Medium (20-30g)' },
    { value: 'heavy', label: 'Heavy (> 30g)' },
  ];

  const prescriptionTypes = [
    { value: 'single-vision', label: 'Single Vision' },
    { value: 'bifocal', label: 'Bifocal' },
    { value: 'progressive', label: 'Progressive' },
    { value: 'non-prescription', label: 'Non-Prescription' },
  ];

  const collections = [
    { value: 'classic', label: 'Classic Collection' },
    { value: 'premium', label: 'Premium Collection' },
    { value: 'sport', label: 'Sport Collection' },
    { value: 'vintage', label: 'Vintage Collection' },
  ];

  const glassColors = [
    { value: 'clear', label: 'Clear' },
    { value: 'blue-cut', label: 'Blue Cut' },
    { value: 'photochromic', label: 'Photochromic' },
    { value: 'tinted', label: 'Tinted' },
  ];

  // Sunglass Lens Colours
  const sunglassLensColors = [
    { value: 'black', label: 'Black' },
    { value: 'brown', label: 'Brown' },
    { value: 'gray', label: 'Gray' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'orange', label: 'Orange' },
    { value: 'red', label: 'Red' },
    { value: 'pink', label: 'Pink' },
    { value: 'purple', label: 'Purple' },
    { value: 'rose-gold', label: 'Rose Gold' },
    { value: 'silver-mirror', label: 'Silver Mirror' },
    { value: 'gold-mirror', label: 'Gold Mirror' },
    { value: 'blue-mirror', label: 'Blue Mirror' },
    { value: 'gradient', label: 'Gradient' },
    { value: 'transparent', label: 'Transparent' },
  ];

  // Sunglass Lens Types (from navbar)
  const sunglassLensTypes = [
    { value: 'polarized', label: 'Polarized' },
    { value: 'mirrored', label: 'Mirrored' },
    { value: 'gradient', label: 'Gradient' },
    { value: 'photochromic', label: 'Photochromic' },
    { value: 'prescription', label: 'Prescription' },
  ];

  const frameWidths = [
    { value: 'narrow', label: 'Narrow (< 13cm / 130mm)' },
    { value: 'medium', label: 'Medium (13-14cm / 130-140mm)' },
    { value: 'wide', label: 'Wide (> 14cm / 140mm)' },
  ];

  const countries = [
    { value: 'india', label: 'India' },
    { value: 'italy', label: 'Italy' },
    { value: 'china', label: 'China' },
    { value: 'usa', label: 'USA' },
    { value: 'japan', label: 'Japan' },
  ];

  const productTypes = [
    { value: 'eyeglasses', label: 'Eyeglasses' },
    { value: 'sunglasses', label: 'Sunglasses' },
    { value: 'contact-lenses', label: 'Contact Lenses' },
    { value: 'accessories', label: 'Accessories' },
  ];

  // Contact Lens specific filters
  const replacementTypes = [
    { value: 'daily', label: 'Daily Disposable' },
    { value: 'weekly', label: 'Weekly Disposable' },
    { value: 'monthly', label: 'Monthly Disposable' },
    { value: 'yearly', label: 'Yearly Disposable' },
  ];

  const lensColors = [
    { value: 'clear', label: 'Clear Lenses' },
    { value: 'colored', label: 'Colored Lenses' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'gray', label: 'Gray' },
    { value: 'hazel', label: 'Hazel' },
  ];

  const lensPurposes = [
    { value: 'vision', label: 'Vision Correction' },
    { value: 'cosmetic', label: 'Cosmetic/Fashion' },
    { value: 'toric', label: 'Toric (Astigmatism)' },
    { value: 'multifocal', label: 'Multifocal' },
    { value: 'presbyopia', label: 'Presbyopia' },
  ];

  const lensMaterials = [
    { value: 'hydrogel', label: 'Hydrogel' },
    { value: 'silicone-hydrogel', label: 'Silicone Hydrogel' },
    { value: 'rgp', label: 'Rigid Gas Permeable' },
  ];

  const lensFeatures = [
    { value: 'uv-protection', label: 'UV Protection' },
    { value: 'moisture-lock', label: 'Moisture Lock' },
    { value: 'extended-wear', label: 'Extended Wear' },
    { value: 'breathable', label: 'High Breathability' },
    { value: 'sensitive', label: 'For Sensitive Eyes' },
  ];

  const lensQuantities = [
    { value: '2', label: '2 Pair/Pack' },
    { value: '5', label: '5 Pair/Pack' },
    { value: '10', label: '10 Pair/Pack' },
    { value: '25', label: '25 Pair/Pack' },
    { value: '50', label: '50 Pair/Pack' },
    { value: '90', label: '90 Pair/Pack' },
  ];

  // Accessory Categories - Separate filter sections (from navbar)
  const casesStorage = [
    { value: 'hard-case', label: 'Hard Cases' },
    { value: 'soft-pouch', label: 'Soft Pouches' },
    { value: 'leather-case', label: 'Leather Cases' },
    { value: 'zipper-case', label: 'Zipper Cases' },
    { value: 'travel-case', label: 'Travel Cases' },
    { value: 'eyewear-stand', label: 'Eyewear Stands' },
    { value: 'organizer', label: 'Multi-Eyewear Organizers' },
  ];

  const cleaningSolutions = [
    { value: 'cleaning-cloth', label: 'Microfiber Cloths' },
    { value: 'cleaning-solution', label: 'Cleaning Solutions' },
    { value: 'cleaning-spray', label: 'Cleaning Sprays' },
    { value: 'anti-fog', label: 'Anti-Fog Spray' },
    { value: 'cleaning-kit', label: 'Complete Cleaning Kits' },
  ];

  const contactLensCare = [
    { value: 'lens-solution', label: 'Lens Solutions' },
    { value: 'lens-case', label: 'Lens Cases' },
    { value: 'lens-applicator', label: 'Lens Applicators' },
  ];

  const chainsStraps = [
    { value: 'eyeglass-chain', label: 'Eyeglass Chains' },
    { value: 'sports-strap', label: 'Sports Straps' },
    { value: 'beaded-chain', label: 'Beaded Chains' },
    { value: 'leather-cord', label: 'Leather Cords' },
    { value: 'metal-chain', label: 'Metal Chains' },
  ];

  // Brands for Accessories (Cleaning & Lens Care only)
  const accessoryBrands = [
    { value: 'bausch-lomb', label: 'Bausch & Lomb' },
    { value: 'alcon', label: 'Alcon' },
    { value: 'coopervision', label: 'CooperVision' },
    { value: 'zeiss', label: 'Zeiss' },
    { value: 'opti-free', label: 'Opti-Free' },
    { value: 'renu', label: 'ReNu' },
    { value: 'biotrue', label: 'Biotrue' },
    { value: 'clear-care', label: 'Clear Care' },
  ];

  // Handle frame color selection (multiple)
  const handleColorChange = (color: string) => {
    const currentColors = filters.frame_colors || [];
    const newColors = currentColors.includes(color)
      ? currentColors.filter(c => c !== color)
      : [...currentColors, color];
    onFilterChange({ ...filters, frame_colors: newColors.length > 0 ? newColors : undefined });
  };

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.frame_type) count++;
    if (filters.frame_shape) count++;
    if (filters.frame_colors?.length) count += filters.frame_colors.length;
    if (filters.brands?.length) count += filters.brands.length;
    if (filters.frame_size) count++;
    if (filters.min_price || filters.max_price) count++;
    if (filters.gender) count++;
    if (filters.frame_material) count++;
    if (filters.weight_group) count++;
    if (filters.prescription_type) count++;
    if (filters.collection) count++;
    if (filters.glass_color) count++;
    if (filters.frame_width) count++;
    if (filters.country_of_origin) count++;
    if (filters.product_type) count++;
    return count;
  }, [filters]);

  // Filter brands based on search
  const filteredBrands = useMemo(() => {
    if (!brandSearch) return brandCounts;
    return brandCounts.filter(brand =>
      brand.label.toLowerCase().includes(brandSearch.toLowerCase())
    );
  }, [brandCounts, brandSearch]);

  // Color mapping for visual swatches
  const getColorHex = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      'black': '#000000',
      'brown': '#8B4513',
      'blue': '#0000FF',
      'gold': '#FFD700',
      'silver': '#C0C0C0',
      'gray': '#808080',
      'grey': '#808080',
      'red': '#FF0000',
      'green': '#008000',
      'pink': '#FFC0CB',
      'purple': '#800080',
      'white': '#FFFFFF',
      'tortoise': '#8B4513',
      'transparent': 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)',
      'clear': 'rgba(255,255,255,0.3)',
    };
    const lowerColor = colorName.toLowerCase();
    for (const [key, value] of Object.entries(colorMap)) {
      if (lowerColor.includes(key)) {
        return value;
      }
    }
    return '#6B7280'; // default gray
  };

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-white uppercase tracking-wide">
            Filters
          </h2>
          {activeFilterCount > 0 && (
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-red-500 hover:text-red-400 font-medium transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
        {/* Frame Type - Visual Buttons */}
        {(filters.category === 'eyeglasses' || filters.category === 'sunglasses' || !filters.category) && (
          <div className="border-b border-zinc-800 p-4 bg-zinc-900/30">
            <h3 className="text-sm font-bold text-gray-300 uppercase mb-4 tracking-wide">
              FRAME TYPE
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {frameTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() =>
                    onFilterChange({
                      ...filters,
                      frame_type: filters.frame_type === type.value ? undefined : type.value as any,
                    })
                  }
                  className={`
                    flex flex-col items-center justify-center p-3 border rounded-lg transition-all duration-200
                    ${
                      filters.frame_type === type.value
                        ? 'border-red-600 bg-red-600/10 text-red-500'
                        : 'border-zinc-700 hover:border-zinc-600 text-gray-400 hover:text-gray-300'
                    }
                  `}
                >
                  {/* Clean, simple frame icons like reference image */}
                  <div className="w-14 h-14 mb-2 flex items-center justify-center">
                    {type.value === 'full-rim' && (
                      <svg className="w-full h-full" viewBox="0 0 56 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Left lens with full rim */}
                        <rect x="4" y="8" width="18" height="12" rx="2" stroke={filters.frame_type === type.value ? "#EF4444" : "#1F2937"} strokeWidth="2" fill="none"/>
                        {/* Right lens with full rim */}
                        <rect x="34" y="8" width="18" height="12" rx="2" stroke={filters.frame_type === type.value ? "#EF4444" : "#1F2937"} strokeWidth="2" fill="none"/>
                        {/* Bridge */}
                        <line x1="22" y1="14" x2="34" y2="14" stroke={filters.frame_type === type.value ? "#EF4444" : "#1F2937"} strokeWidth="2"/>
                        {/* Temple arms */}
                        <line x1="4" y1="14" x2="1" y2="14" stroke={filters.frame_type === type.value ? "#EF4444" : "#1F2937"} strokeWidth="2"/>
                        <line x1="52" y1="14" x2="55" y2="14" stroke={filters.frame_type === type.value ? "#EF4444" : "#1F2937"} strokeWidth="2"/>
                      </svg>
                    )}
                    {type.value === 'half-rim' && (
                      <svg className="w-full h-full" viewBox="0 0 56 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Left lens with half rim (top only) */}
                        <path d="M4 14 L4 10 Q4 8 6 8 L20 8 Q22 8 22 10 L22 14" stroke={filters.frame_type === type.value ? "#EF4444" : "#1F2937"} strokeWidth="2" fill="none"/>
                        <path d="M4 14 Q4 18 8 19 Q10 20 13 20 Q16 20 18 19 Q22 18 22 14" stroke={filters.frame_type === type.value ? "#EF4444" : "#1F2937"} strokeWidth="0.5" strokeDasharray="1 1" fill="none"/>
                        {/* Right lens with half rim (top only) */}
                        <path d="M34 14 L34 10 Q34 8 36 8 L50 8 Q52 8 52 10 L52 14" stroke={filters.frame_type === type.value ? "#EF4444" : "#1F2937"} strokeWidth="2" fill="none"/>
                        <path d="M34 14 Q34 18 38 19 Q40 20 43 20 Q46 20 48 19 Q52 18 52 14" stroke={filters.frame_type === type.value ? "#EF4444" : "#1F2937"} strokeWidth="0.5" strokeDasharray="1 1" fill="none"/>
                        {/* Bridge */}
                        <line x1="22" y1="10" x2="34" y2="10" stroke={filters.frame_type === type.value ? "#EF4444" : "#1F2937"} strokeWidth="2"/>
                        {/* Temple arms */}
                        <line x1="4" y1="10" x2="1" y2="10" stroke={filters.frame_type === type.value ? "#EF4444" : "#1F2937"} strokeWidth="2"/>
                        <line x1="52" y1="10" x2="55" y2="10" stroke={filters.frame_type === type.value ? "#EF4444" : "#1F2937"} strokeWidth="2"/>
                      </svg>
                    )}
                    {type.value === 'rimless' && (
                      <svg className="w-full h-full" viewBox="0 0 56 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Left lens (just glass outline, very minimal) */}
                        <rect x="4" y="8" width="18" height="12" rx="2" stroke={filters.frame_type === type.value ? "#EF4444" : "#1F2937"} strokeWidth="0.5" strokeDasharray="2 2" fill="none"/>
                        {/* Right lens (just glass outline, very minimal) */}
                        <rect x="34" y="8" width="18" height="12" rx="2" stroke={filters.frame_type === type.value ? "#EF4444" : "#1F2937"} strokeWidth="0.5" strokeDasharray="2 2" fill="none"/>
                        {/* Bridge (thin wire) */}
                        <line x1="22" y1="14" x2="34" y2="14" stroke={filters.frame_type === type.value ? "#EF4444" : "#1F2937"} strokeWidth="1.5"/>
                        {/* Nose pads */}
                        <circle cx="22" cy="15" r="1" fill={filters.frame_type === type.value ? "#EF4444" : "#1F2937"}/>
                        <circle cx="34" cy="15" r="1" fill={filters.frame_type === type.value ? "#EF4444" : "#1F2937"}/>
                        {/* Temple arms (thin wire) */}
                        <line x1="4" y1="14" x2="1" y2="14" stroke={filters.frame_type === type.value ? "#EF4444" : "#1F2937"} strokeWidth="1.5"/>
                        <line x1="52" y1="14" x2="55" y2="14" stroke={filters.frame_type === type.value ? "#EF4444" : "#1F2937"} strokeWidth="1.5"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-xs font-medium text-center">
                    {type.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Frame Shape - Visual Buttons */}
        {(filters.category === 'eyeglasses' || filters.category === 'sunglasses' || !filters.category) && (
          <div className="border-b border-zinc-800 p-4 bg-zinc-900/30">
            <h3 className="text-sm font-bold text-gray-300 uppercase mb-4 tracking-wide">
              FRAME SHAPE
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {frameShapes.map((shape) => (
                <button
                  key={shape.value}
                  onClick={() =>
                    onFilterChange({
                      ...filters,
                      frame_shape: filters.frame_shape === shape.value ? undefined : shape.value as any,
                    })
                  }
                  className={`
                    flex flex-col items-center justify-center p-3 border rounded-lg transition-all duration-200
                    ${
                      filters.frame_shape === shape.value
                        ? 'border-red-600 bg-red-600/10 text-red-500'
                        : 'border-zinc-700 hover:border-zinc-600 text-gray-400 hover:text-gray-300'
                    }
                  `}
                >
                  {/* Clean, simple shape icons like reference image */}
                  <div className="w-14 h-14 mb-2 flex items-center justify-center">
                    {shape.value === 'square' && (
                      <svg className="w-full h-full" viewBox="0 0 56 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="4" y="7" rx="1" ry="1" width="18" height="14" stroke={filters.frame_shape === shape.value ? "#EF4444" : "#1F2937"} strokeWidth="2" fill="none"/>
                        <rect x="34" y="7" rx="1" ry="1" width="18" height="14" stroke={filters.frame_shape === shape.value ? "#EF4444" : "#1F2937"} strokeWidth="2" fill="none"/>
                        <line x1="22" y1="14" x2="34" y2="14" stroke={filters.frame_shape === shape.value ? "#EF4444" : "#1F2937"} strokeWidth="2"/>
                      </svg>
                    )}
                    {shape.value === 'rectangle' && (
                      <svg className="w-full h-full" viewBox="0 0 56 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="10" rx="1" ry="1" width="20" height="8" stroke={filters.frame_shape === shape.value ? "#EF4444" : "#1F2937"} strokeWidth="2" fill="none"/>
                        <rect x="33" y="10" rx="1" ry="1" width="20" height="8" stroke={filters.frame_shape === shape.value ? "#EF4444" : "#1F2937"} strokeWidth="2" fill="none"/>
                        <line x1="23" y1="14" x2="33" y2="14" stroke={filters.frame_shape === shape.value ? "#EF4444" : "#1F2937"} strokeWidth="2"/>
                      </svg>
                    )}
                    {shape.value === 'cat-eye' && (
                      <svg className="w-full h-full" viewBox="0 0 56 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Left cat-eye lens */}
                        <path d="M3 14 Q3 9 6 8 Q10 7 14 8 Q18 9 20 11 Q21 12 20 14 Q19 17 16 19 Q13 21 9 20 Q5 18 3 14Z" stroke={filters.frame_shape === shape.value ? "#EF4444" : "#1F2937"} strokeWidth="2" fill="none"/>
                        {/* Right cat-eye lens */}
                        <path d="M36 11 Q37 9 38 8 Q42 7 46 8 Q50 9 53 14 Q51 18 47 20 Q43 21 40 19 Q37 17 36 14 Q35 12 36 11Z" stroke={filters.frame_shape === shape.value ? "#EF4444" : "#1F2937"} strokeWidth="2" fill="none"/>
                        {/* Bridge */}
                        <line x1="20" y1="12" x2="36" y2="12" stroke={filters.frame_shape === shape.value ? "#EF4444" : "#1F2937"} strokeWidth="2"/>
                      </svg>
                    )}
                    {shape.value === 'round' && (
                      <svg className="w-full h-full" viewBox="0 0 56 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="13" cy="14" r="8" stroke={filters.frame_shape === shape.value ? "#EF4444" : "#1F2937"} strokeWidth="2" fill="none"/>
                        <circle cx="43" cy="14" r="8" stroke={filters.frame_shape === shape.value ? "#EF4444" : "#1F2937"} strokeWidth="2" fill="none"/>
                        <line x1="21" y1="14" x2="35" y2="14" stroke={filters.frame_shape === shape.value ? "#EF4444" : "#1F2937"} strokeWidth="2"/>
                      </svg>
                    )}
                    {shape.value === 'geometric' && (
                      <svg className="w-full h-full" viewBox="0 0 56 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Left hexagonal lens */}
                        <polygon points="9,8 17,8 21,14 17,20 9,20 5,14" stroke={filters.frame_shape === shape.value ? "#EF4444" : "#1F2937"} strokeWidth="2" fill="none"/>
                        {/* Right hexagonal lens */}
                        <polygon points="35,14 39,8 47,8 51,14 47,20 39,20" stroke={filters.frame_shape === shape.value ? "#EF4444" : "#1F2937"} strokeWidth="2" fill="none"/>
                        {/* Bridge */}
                        <line x1="21" y1="14" x2="35" y2="14" stroke={filters.frame_shape === shape.value ? "#EF4444" : "#1F2937"} strokeWidth="2"/>
                      </svg>
                    )}
                    {shape.value === 'aviator' && (
                      <svg className="w-full h-full" viewBox="0 0 56 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Left aviator lens (teardrop) */}
                        <path d="M5 9 L5 16 Q5 20 9 21 Q13 20 13 16 L13 9 Q13 7 9 7 Q5 7 5 9Z" stroke={filters.frame_shape === shape.value ? "#EF4444" : "#1F2937"} strokeWidth="2" fill="none"/>
                        {/* Right aviator lens (teardrop) */}
                        <path d="M43 9 L43 16 Q43 20 47 21 Q51 20 51 16 L51 9 Q51 7 47 7 Q43 7 43 9Z" stroke={filters.frame_shape === shape.value ? "#EF4444" : "#1F2937"} strokeWidth="2" fill="none"/>
                        {/* Bridge with double bar */}
                        <line x1="13" y1="9" x2="43" y2="9" stroke={filters.frame_shape === shape.value ? "#EF4444" : "#1F2937"} strokeWidth="2"/>
                      </svg>
                    )}
                    {shape.value === 'wayfarer' && (
                      <svg className="w-full h-full" viewBox="0 0 56 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Left wayfarer lens (angular trapezoid) */}
                        <path d="M3 10 L7 7 L17 7 L21 10 L21 18 L17 21 L7 21 L3 18 Z" stroke={filters.frame_shape === shape.value ? "#EF4444" : "#1F2937"} strokeWidth="2" fill="none"/>
                        {/* Right wayfarer lens (angular trapezoid) */}
                        <path d="M35 10 L39 7 L49 7 L53 10 L53 18 L49 21 L39 21 L35 18 Z" stroke={filters.frame_shape === shape.value ? "#EF4444" : "#1F2937"} strokeWidth="2" fill="none"/>
                        {/* Bridge */}
                        <line x1="21" y1="11" x2="35" y2="11" stroke={filters.frame_shape === shape.value ? "#EF4444" : "#1F2937"} strokeWidth="2"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-xs font-medium text-center">
                    {shape.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Cases & Storage - Only for Accessories */}
        {filters.category === 'accessories' && (
          <div className="border-b border-zinc-800 bg-zinc-900/30">
            <button
              onClick={() => toggleSection('casesStorage')}
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
            >
              <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">CASES & STORAGE</span>
              {expandedSections['casesStorage'] ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>
            {expandedSections['casesStorage'] && (
              <div className="px-4 pb-4 space-y-2">
                {casesStorage.map((item) => (
                  <label key={item.value} className="flex items-center cursor-pointer hover:bg-zinc-800/50 p-2 rounded transition-colors">
                    <input
                      type="radio"
                      name="accessory_type"
                      value={item.value}
                      checked={filters.accessory_type === item.value}
                      onChange={(e) => onFilterChange({ ...filters, accessory_type: e.target.value })}
                      className="mr-3 w-4 h-4 border-zinc-600 bg-zinc-800 text-red-600 focus:ring-red-600"
                    />
                    <span className="text-sm text-gray-300">{item.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cleaning Solutions - Only for Accessories */}
        {filters.category === 'accessories' && (
          <div className="border-b border-zinc-800 bg-zinc-900/30">
            <button
              onClick={() => toggleSection('cleaningSolutions')}
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
            >
              <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">CLEANING SOLUTIONS</span>
              {expandedSections['cleaningSolutions'] ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>
            {expandedSections['cleaningSolutions'] && (
              <div className="px-4 pb-4 space-y-2">
                {cleaningSolutions.map((item) => (
                  <label key={item.value} className="flex items-center cursor-pointer hover:bg-zinc-800/50 p-2 rounded transition-colors">
                    <input
                      type="radio"
                      name="accessory_type"
                      value={item.value}
                      checked={filters.accessory_type === item.value}
                      onChange={(e) => onFilterChange({ ...filters, accessory_type: e.target.value })}
                      className="mr-3 w-4 h-4 border-zinc-600 bg-zinc-800 text-red-600 focus:ring-red-600"
                    />
                    <span className="text-sm text-gray-300">{item.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Contact Lens Care - Only for Accessories */}
        {filters.category === 'accessories' && (
          <div className="border-b border-zinc-800 bg-zinc-900/30">
            <button
              onClick={() => toggleSection('contactLensCareAcc')}
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
            >
              <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">CONTACT LENS CARE</span>
              {expandedSections['contactLensCareAcc'] ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>
            {expandedSections['contactLensCareAcc'] && (
              <div className="px-4 pb-4 space-y-2">
                {contactLensCare.map((item) => (
                  <label key={item.value} className="flex items-center cursor-pointer hover:bg-zinc-800/50 p-2 rounded transition-colors">
                    <input
                      type="radio"
                      name="accessory_type"
                      value={item.value}
                      checked={filters.accessory_type === item.value}
                      onChange={(e) => onFilterChange({ ...filters, accessory_type: e.target.value })}
                      className="mr-3 w-4 h-4 border-zinc-600 bg-zinc-800 text-red-600 focus:ring-red-600"
                    />
                    <span className="text-sm text-gray-300">{item.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Chains & Straps - Only for Accessories */}
        {filters.category === 'accessories' && (
          <div className="border-b border-zinc-800 bg-zinc-900/30">
            <button
              onClick={() => toggleSection('chainsStraps')}
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
            >
              <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">CHAINS & STRAPS</span>
              {expandedSections['chainsStraps'] ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>
            {expandedSections['chainsStraps'] && (
              <div className="px-4 pb-4 space-y-2">
                {chainsStraps.map((item) => (
                  <label key={item.value} className="flex items-center cursor-pointer hover:bg-zinc-800/50 p-2 rounded transition-colors">
                    <input
                      type="radio"
                      name="accessory_type"
                      value={item.value}
                      checked={filters.accessory_type === item.value}
                      onChange={(e) => onFilterChange({ ...filters, accessory_type: e.target.value })}
                      className="mr-3 w-4 h-4 border-zinc-600 bg-zinc-800 text-red-600 focus:ring-red-600"
                    />
                    <span className="text-sm text-gray-300">{item.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}


        {/* Frame Color - Checkboxes with counts and visual swatches */}
        {(filters.category === 'eyeglasses' || filters.category === 'sunglasses' || !filters.category) && (
          <div className="border-b border-zinc-800 bg-zinc-900/30">
            <button
              onClick={() => toggleSection('frameColor')}
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
            >
              <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">FRAME COLOR</span>
              {expandedSections['frameColor'] ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>
            {expandedSections['frameColor'] && (
              <div className="px-4 pb-4">
                <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
                  {colorCounts.map((color) => (
                    <label key={color.value} className="flex items-center cursor-pointer group hover:bg-zinc-800/50 p-2 rounded transition-colors">
                      <input
                        type="checkbox"
                        checked={(filters.frame_colors || []).includes(color.value)}
                        onChange={() => handleColorChange(color.value)}
                        className="mr-3 w-4 h-4 border-zinc-600 bg-zinc-800 rounded focus:ring-red-600 focus:ring-offset-zinc-900 text-red-600"
                      />
                      <div
                        className="w-5 h-5 rounded-full mr-2 border-2 border-zinc-600 flex-shrink-0"
                        style={{
                          backgroundColor: getColorHex(color.value),
                          ...(color.value.toLowerCase().includes('white') && { borderColor: '#9CA3AF' })
                        }}
                      />
                      <span className="text-sm text-gray-300 flex-1">
                        {color.label} <span className="text-gray-500">({color.count})</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Brands - Hidden for eyeglasses category */}
        {filters.category !== 'eyeglasses' && (
        <div className="border-b border-zinc-800 bg-zinc-900/30">
          <button
            onClick={() => toggleSection('brands')}
            className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
          >
            <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">BRANDS</span>
            {expandedSections['brands'] ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
          </button>
          {expandedSections['brands'] && (
            <div className="px-4 pb-4">
              {/* For Accessories: Show only cleaning & lens care brands */}
              {filters.category === 'accessories' ? (
                <div className="space-y-2">
                  {accessoryBrands.map((brand) => (
                    <label key={brand.value} className="flex items-center cursor-pointer hover:bg-zinc-800/50 p-2 rounded transition-colors">
                      <input
                        type="checkbox"
                        checked={(filters.brands || []).includes(brand.value)}
                        onChange={(e) => {
                          const currentBrands = filters.brands || [];
                          const newBrands = e.target.checked
                            ? [...currentBrands, brand.value]
                            : currentBrands.filter(b => b !== brand.value);
                          onFilterChange({ ...filters, brands: newBrands.length > 0 ? newBrands : undefined });
                        }}
                        className="mr-3 w-4 h-4 border-zinc-600 bg-zinc-800 rounded focus:ring-red-600 focus:ring-offset-zinc-900 text-red-600"
                      />
                      <span className="text-sm text-gray-300">{brand.label}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <>
                  {/* Brand search input - For other categories */}
                  <input
                    type="text"
                    placeholder="Search brands..."
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    className="w-full px-3 py-2 mb-3 border border-zinc-700 bg-zinc-800 text-gray-200 placeholder-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                  <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
                    {filteredBrands.length > 0 ? (
                      filteredBrands.map((brand) => (
                        <label key={brand.value} className="flex items-center cursor-pointer hover:bg-zinc-800/50 p-2 rounded transition-colors">
                          <input
                            type="checkbox"
                            checked={(filters.brands || []).includes(brand.value)}
                            onChange={(e) => {
                              const currentBrands = filters.brands || [];
                              const newBrands = e.target.checked
                                ? [...currentBrands, brand.value]
                                : currentBrands.filter(b => b !== brand.value);
                              onFilterChange({ ...filters, brands: newBrands.length > 0 ? newBrands : undefined });
                            }}
                            className="mr-3 w-4 h-4 border-zinc-600 bg-zinc-800 rounded focus:ring-red-600 focus:ring-offset-zinc-900 text-red-600"
                          />
                          <span className="text-sm text-gray-300">
                            {brand.label} <span className="text-gray-500">({brand.count})</span>
                          </span>
                        </label>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-2">No brands found</p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        )}

        {/* Frame Size */}
        {(filters.category === 'eyeglasses' || filters.category === 'sunglasses' || !filters.category) && (
          <div className="border-b border-zinc-800 bg-zinc-900/30">
            <button
              onClick={() => toggleSection('frameSize')}
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
            >
              <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">FRAME SIZE</span>
              {expandedSections['frameSize'] ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>
            {expandedSections['frameSize'] && (
              <div className="px-4 pb-4 space-y-2">
                {frameSizes.map((size) => (
                  <label key={size.value} className="flex items-center cursor-pointer hover:bg-zinc-800/50 p-2 rounded transition-colors">
                    <input
                      type="radio"
                      name="frame_size"
                      value={size.value}
                      checked={filters.frame_size === size.value}
                      onChange={(e) => onFilterChange({ ...filters, frame_size: e.target.value })}
                      className="mr-3 w-4 h-4 border-zinc-600 bg-zinc-800 text-red-600 focus:ring-red-600"
                    />
                    <span className="text-sm text-gray-300">{size.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Price Range with Dual-Handle Slider */}
        <div className="border-b border-zinc-800 bg-zinc-900/30">
          <button
            onClick={() => toggleSection('price')}
            className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
          >
            <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">PRICE RANGE</span>
            {expandedSections['price'] ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
          </button>
          {expandedSections['price'] && (
            <div className="px-4 pb-4">
              {/* Price Display */}
              <div className="flex justify-between mb-4">
                <div className="text-sm">
                  <span className="text-gray-400">Min: </span>
                  <span className="text-white font-semibold">₹{filters.min_price || 100}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-400">Max: </span>
                  <span className="text-white font-semibold">₹{filters.max_price || 5000}</span>
                </div>
              </div>

              {/* Dual-Handle Range Slider */}
              <div className="relative pt-2 pb-6">
                {/* Track Background */}
                <div className="absolute h-2 w-full bg-zinc-700 rounded-lg top-2"></div>

                {/* Active Range Highlight */}
                <div
                  className="absolute h-2 bg-red-600 rounded-lg top-2"
                  style={{
                    left: `${((filters.min_price || 100) - 100) / (5000 - 100) * 100}%`,
                    right: `${100 - ((filters.max_price || 5000) - 100) / (5000 - 100) * 100}%`
                  }}
                ></div>

                {/* Min Range Input */}
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="50"
                  value={filters.min_price || 100}
                  onChange={(e) => {
                    const newMin = Number(e.target.value);
                    const currentMax = filters.max_price || 5000;
                    if (newMin <= currentMax - 50) {
                      onFilterChange({ ...filters, min_price: newMin });
                    }
                  }}
                  className="absolute w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer pointer-events-none top-2
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto
                    [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-red-600
                    [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
                    [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform
                    [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5
                    [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white
                    [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-red-600
                    [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg
                    [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:transition-transform"
                  style={{ zIndex: filters.min_price === filters.max_price ? 5 : 3 }}
                />

                {/* Max Range Input */}
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="50"
                  value={filters.max_price || 5000}
                  onChange={(e) => {
                    const newMax = Number(e.target.value);
                    const currentMin = filters.min_price || 100;
                    if (newMax >= currentMin + 50) {
                      onFilterChange({ ...filters, max_price: newMax });
                    }
                  }}
                  className="absolute w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer pointer-events-none top-2
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto
                    [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-red-600
                    [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
                    [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform
                    [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5
                    [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white
                    [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-red-600
                    [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg
                    [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:transition-transform"
                  style={{ zIndex: 4 }}
                />
              </div>

              {/* Price Range Labels */}
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹100</span>
                <span>₹5000</span>
              </div>
            </div>
          )}
        </div>

        {/* Gender */}
        {(filters.category === 'eyeglasses' || filters.category === 'sunglasses' || !filters.category) && (
          <div className="border-b border-zinc-800 bg-zinc-900/30">
            <button
              onClick={() => toggleSection('gender')}
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
            >
              <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">GENDER</span>
              {expandedSections['gender'] ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>
            {expandedSections['gender'] && (
              <div className="px-4 pb-4 space-y-2">
                {genders.map((gen) => (
                  <label key={gen.value} className="flex items-center cursor-pointer hover:bg-zinc-800/50 p-2 rounded transition-colors">
                    <input
                      type="radio"
                      name="gender"
                      value={gen.value}
                      checked={filters.gender === gen.value}
                      onChange={(e) => onFilterChange({ ...filters, gender: e.target.value as any })}
                      className="mr-3 w-4 h-4 border-zinc-600 bg-zinc-800 text-red-600 focus:ring-red-600"
                    />
                    <span className="text-sm text-gray-300">{gen.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Contact Lens Specific Filters */}
        {/* Replacement Type - Only for Contact Lenses */}
        {filters.category === 'contact-lenses' && (
          <div className="border-b border-zinc-800 bg-zinc-900/30">
            <button
              onClick={() => toggleSection('replacementType')}
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
            >
              <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">REPLACEMENT TYPE</span>
              {expandedSections['replacementType'] ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>
            {expandedSections['replacementType'] && (
              <div className="px-4 pb-4 space-y-2">
                {replacementTypes.map((type) => (
                  <label key={type.value} className="flex items-center cursor-pointer hover:bg-zinc-800/50 p-2 rounded transition-colors">
                    <input
                      type="radio"
                      name="replacement_type"
                      value={type.value}
                      checked={filters.replacement_type === type.value}
                      onChange={(e) => onFilterChange({ ...filters, replacement_type: e.target.value })}
                      className="mr-3 w-4 h-4 border-zinc-600 bg-zinc-800 text-red-600 focus:ring-red-600"
                    />
                    <span className="text-sm text-gray-300">{type.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Lens Color - Only for Contact Lenses */}
        {filters.category === 'contact-lenses' && (
          <div className="border-b border-zinc-800 bg-zinc-900/30">
            <button
              onClick={() => toggleSection('lensColor')}
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
            >
              <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">LENS COLOR</span>
              {expandedSections['lensColor'] ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>
            {expandedSections['lensColor'] && (
              <div className="px-4 pb-4 space-y-2">
                {lensColors.map((color) => (
                  <label key={color.value} className="flex items-center cursor-pointer hover:bg-zinc-800/50 p-2 rounded transition-colors">
                    <input
                      type="radio"
                      name="lens_color"
                      value={color.value}
                      checked={filters.lens_color === color.value}
                      onChange={(e) => onFilterChange({ ...filters, lens_color: e.target.value })}
                      className="mr-3 w-4 h-4 border-zinc-600 bg-zinc-800 text-red-600 focus:ring-red-600"
                    />
                    <span className="text-sm text-gray-300">{color.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Lens Purpose - Only for Contact Lenses */}
        {filters.category === 'contact-lenses' && (
          <div className="border-b border-zinc-800 bg-zinc-900/30">
            <button
              onClick={() => toggleSection('lensPurpose')}
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
            >
              <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">PURPOSE</span>
              {expandedSections['lensPurpose'] ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>
            {expandedSections['lensPurpose'] && (
              <div className="px-4 pb-4 space-y-2">
                {lensPurposes.map((purpose) => (
                  <label key={purpose.value} className="flex items-center cursor-pointer hover:bg-zinc-800/50 p-2 rounded transition-colors">
                    <input
                      type="radio"
                      name="lens_purpose"
                      value={purpose.value}
                      checked={filters.lens_purpose === purpose.value}
                      onChange={(e) => onFilterChange({ ...filters, lens_purpose: e.target.value })}
                      className="mr-3 w-4 h-4 border-zinc-600 bg-zinc-800 text-red-600 focus:ring-red-600"
                    />
                    <span className="text-sm text-gray-300">{purpose.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Lens Material - Only for Contact Lenses */}
        {filters.category === 'contact-lenses' && (
          <div className="border-b border-zinc-800 bg-zinc-900/30">
            <button
              onClick={() => toggleSection('lensMaterial')}
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
            >
              <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">MATERIAL</span>
              {expandedSections['lensMaterial'] ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>
            {expandedSections['lensMaterial'] && (
              <div className="px-4 pb-4 space-y-2">
                {lensMaterials.map((material) => (
                  <label key={material.value} className="flex items-center cursor-pointer hover:bg-zinc-800/50 p-2 rounded transition-colors">
                    <input
                      type="radio"
                      name="lens_material"
                      value={material.value}
                      checked={filters.lens_material === material.value}
                      onChange={(e) => onFilterChange({ ...filters, lens_material: e.target.value })}
                      className="mr-3 w-4 h-4 border-zinc-600 bg-zinc-800 text-red-600 focus:ring-red-600"
                    />
                    <span className="text-sm text-gray-300">{material.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Lens Features - Only for Contact Lenses */}
        {filters.category === 'contact-lenses' && (
          <div className="border-b border-zinc-800 bg-zinc-900/30">
            <button
              onClick={() => toggleSection('lensFeatures')}
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
            >
              <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">FEATURES</span>
              {expandedSections['lensFeatures'] ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>
            {expandedSections['lensFeatures'] && (
              <div className="px-4 pb-4 space-y-2">
                {lensFeatures.map((feature) => (
                  <label key={feature.value} className="flex items-center cursor-pointer hover:bg-zinc-800/50 p-2 rounded transition-colors">
                    <input
                      type="checkbox"
                      checked={(filters.lens_features || []).includes(feature.value)}
                      onChange={(e) => {
                        const currentFeatures = filters.lens_features || [];
                        const newFeatures = e.target.checked
                          ? [...currentFeatures, feature.value]
                          : currentFeatures.filter(f => f !== feature.value);
                        onFilterChange({ ...filters, lens_features: newFeatures.length > 0 ? newFeatures : undefined });
                      }}
                      className="mr-3 w-4 h-4 border-zinc-600 bg-zinc-800 rounded focus:ring-red-600 focus:ring-offset-zinc-900 text-red-600"
                    />
                    <span className="text-sm text-gray-300">{feature.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quantity - Only for Contact Lenses */}
        {filters.category === 'contact-lenses' && (
          <div className="border-b border-zinc-800 bg-zinc-900/30">
            <button
              onClick={() => toggleSection('lensQuantity')}
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
            >
              <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">QUANTITY</span>
              {expandedSections['lensQuantity'] ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>
            {expandedSections['lensQuantity'] && (
              <div className="px-4 pb-4 space-y-2">
                {lensQuantities.map((quantity) => (
                  <label key={quantity.value} className="flex items-center cursor-pointer hover:bg-zinc-800/50 p-2 rounded transition-colors">
                    <input
                      type="radio"
                      name="lens_quantity"
                      value={quantity.value}
                      checked={filters.lens_quantity === quantity.value}
                      onChange={(e) => onFilterChange({ ...filters, lens_quantity: e.target.value })}
                      className="mr-3 w-4 h-4 border-zinc-600 bg-zinc-800 text-red-600 focus:ring-red-600"
                    />
                    <span className="text-sm text-gray-300">{quantity.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Material */}
        {(filters.category === 'eyeglasses' || filters.category === 'sunglasses' || !filters.category) && (
          <div className="border-b border-zinc-800 bg-zinc-900/30">
            <button
              onClick={() => toggleSection('material')}
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
            >
              <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">MATERIAL</span>
              {expandedSections['material'] ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>
            {expandedSections['material'] && (
              <div className="px-4 pb-4 space-y-2">
                {frameMaterials.map((material) => (
                  <label key={material.value} className="flex items-center cursor-pointer hover:bg-zinc-800/50 p-2 rounded transition-colors">
                    <input
                      type="radio"
                      name="frame_material"
                      value={material.value}
                      checked={filters.frame_material === material.value}
                      onChange={(e) => onFilterChange({ ...filters, frame_material: e.target.value as any })}
                      className="mr-3 w-4 h-4 border-zinc-600 bg-zinc-800 text-red-600 focus:ring-red-600"
                    />
                    <span className="text-sm text-gray-300">{material.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Weight Group - Hidden for eyeglasses, contact-lenses and accessories category */}
        {(filters.category === 'sunglasses' || (!filters.category)) && (
          <div className="border-b border-zinc-800 bg-zinc-900/30">
            <button
              onClick={() => toggleSection('weightGroup')}
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
            >
              <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">WEIGHT GROUP</span>
              {expandedSections['weightGroup'] ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>
            {expandedSections['weightGroup'] && (
              <div className="px-4 pb-4 space-y-2">
                {weightGroups.map((weight) => (
                  <label key={weight.value} className="flex items-center cursor-pointer hover:bg-zinc-800/50 p-2 rounded transition-colors">
                    <input
                      type="radio"
                      name="weight_group"
                      value={weight.value}
                      checked={filters.weight_group === weight.value}
                      onChange={(e) => onFilterChange({ ...filters, weight_group: e.target.value })}
                      className="mr-3 w-4 h-4 border-zinc-600 bg-zinc-800 text-red-600 focus:ring-red-600"
                    />
                    <span className="text-sm text-gray-300">{weight.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Prescription Type */}
        {(filters.category === 'eyeglasses' || !filters.category) && (
          <div className="border-b border-zinc-800 bg-zinc-900/30">
            <button
              onClick={() => toggleSection('prescriptionType')}
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
            >
              <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">PRESCRIPTION TYPE</span>
              {expandedSections['prescriptionType'] ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>
            {expandedSections['prescriptionType'] && (
              <div className="px-4 pb-4 space-y-2">
                {prescriptionTypes.map((type) => (
                  <label key={type.value} className="flex items-center cursor-pointer hover:bg-zinc-800/50 p-2 rounded transition-colors">
                    <input
                      type="radio"
                      name="prescription_type"
                      value={type.value}
                      checked={filters.prescription_type === type.value}
                      onChange={(e) => onFilterChange({ ...filters, prescription_type: e.target.value })}
                      className="mr-3 w-4 h-4 border-zinc-600 bg-zinc-800 text-red-600 focus:ring-red-600"
                    />
                    <span className="text-sm text-gray-300">{type.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Supported Powers - Hidden for eyeglasses, contact-lenses, sunglasses and accessories category */}
        {(filters.category !== 'eyeglasses' && filters.category !== 'contact-lenses' && filters.category !== 'sunglasses' && filters.category !== 'accessories' && filters.category) && (
          <div className="border-b border-zinc-800 bg-zinc-900/30">
            <button
              onClick={() => toggleSection('supportedPowers')}
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
            >
              <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">SUPPORTED POWERS</span>
              {expandedSections['supportedPowers'] ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>
            {expandedSections['supportedPowers'] && (
              <div className="px-4 pb-4">
                <input
                  type="text"
                  placeholder="e.g., -2.00 to +3.00"
                  value={filters.supported_powers || ''}
                  onChange={(e) => onFilterChange({ ...filters, supported_powers: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-zinc-700 bg-zinc-800 text-gray-200 placeholder-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>
            )}
          </div>
        )}

        {/* Collection */}
        <div className="border-b border-zinc-800 bg-zinc-900/30">
          <button
            onClick={() => toggleSection('collection')}
            className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
          >
            <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">COLLECTION</span>
            {expandedSections['collection'] ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
          </button>
          {expandedSections['collection'] && (
            <div className="px-4 pb-4 space-y-2">
              {collections.map((coll) => (
                <label key={coll.value} className="flex items-center cursor-pointer hover:bg-zinc-800/50 p-2 rounded transition-colors">
                  <input
                    type="radio"
                    name="collection"
                    value={coll.value}
                    checked={filters.collection === coll.value}
                    onChange={(e) => onFilterChange({ ...filters, collection: e.target.value })}
                    className="mr-3 w-4 h-4 border-zinc-600 bg-zinc-800 text-red-600 focus:ring-red-600"
                  />
                  <span className="text-sm text-gray-300">{coll.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Lens Colour for Sunglasses - Hidden for eyeglasses, contact-lenses and accessories category */}
        {(filters.category === 'sunglasses' || !filters.category) && (
          <div className="border-b border-zinc-800 bg-zinc-900/30">
            <button
              onClick={() => toggleSection('glassColor')}
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
            >
              <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">
                {filters.category === 'sunglasses' ? 'LENS COLOUR' : 'GLASS COLOR'}
              </span>
              {expandedSections['glassColor'] ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>
            {expandedSections['glassColor'] && (
              <div className="px-4 pb-4 space-y-2">
                {(filters.category === 'sunglasses' ? sunglassLensColors : glassColors).map((glass) => (
                  <label key={glass.value} className="flex items-center cursor-pointer hover:bg-zinc-800/50 p-2 rounded transition-colors">
                    <input
                      type="radio"
                      name="glass_color"
                      value={glass.value}
                      checked={filters.glass_color === glass.value}
                      onChange={(e) => onFilterChange({ ...filters, glass_color: e.target.value })}
                      className="mr-3 w-4 h-4 border-zinc-600 bg-zinc-800 text-red-600 focus:ring-red-600"
                    />
                    <span className="text-sm text-gray-300">{glass.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Lens Type - Only for Sunglasses */}
        {filters.category === 'sunglasses' && (
          <div className="border-b border-zinc-800 bg-zinc-900/30">
            <button
              onClick={() => toggleSection('lensType')}
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
            >
              <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">LENS TYPE</span>
              {expandedSections['lensType'] ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>
            {expandedSections['lensType'] && (
              <div className="px-4 pb-4 space-y-2">
                {sunglassLensTypes.map((type) => (
                  <label key={type.value} className="flex items-center cursor-pointer hover:bg-zinc-800/50 p-2 rounded transition-colors">
                    <input
                      type="radio"
                      name="lens_type"
                      value={type.value}
                      checked={filters.lens_type === type.value}
                      onChange={(e) => onFilterChange({ ...filters, lens_type: e.target.value })}
                      className="mr-3 w-4 h-4 border-zinc-600 bg-zinc-800 text-red-600 focus:ring-red-600"
                    />
                    <span className="text-sm text-gray-300">{type.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sub Collection - Hidden for eyeglasses, contact-lenses and accessories category */}
        {filters.category !== 'eyeglasses' && filters.category !== 'contact-lenses' && filters.category !== 'accessories' && (
        <div className="border-b border-zinc-800 bg-zinc-900/30">
          <button
            onClick={() => toggleSection('subCollection')}
            className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
          >
            <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">SUB COLLECTION</span>
            {expandedSections['subCollection'] ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
          </button>
          {expandedSections['subCollection'] && (
            <div className="px-4 pb-4">
              <input
                type="text"
                placeholder="Enter sub collection"
                value={filters.sub_collection || ''}
                onChange={(e) => onFilterChange({ ...filters, sub_collection: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-zinc-700 bg-zinc-800 text-gray-200 placeholder-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>
          )}
        </div>
        )}

        {/* Frame Width */}
        {(filters.category === 'eyeglasses' || filters.category === 'sunglasses' || !filters.category) && (
          <div className="border-b border-zinc-800 bg-zinc-900/30">
            <button
              onClick={() => toggleSection('frameWidth')}
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
            >
              <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">FRAME WIDTH</span>
              {expandedSections['frameWidth'] ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>
            {expandedSections['frameWidth'] && (
              <div className="px-4 pb-4 space-y-2">
                {frameWidths.map((width) => (
                  <label key={width.value} className="flex items-center cursor-pointer hover:bg-zinc-800/50 p-2 rounded transition-colors">
                    <input
                      type="radio"
                      name="frame_width"
                      value={width.value}
                      checked={filters.frame_width === width.value}
                      onChange={(e) => onFilterChange({ ...filters, frame_width: e.target.value })}
                      className="mr-3 w-4 h-4 border-zinc-600 bg-zinc-800 text-red-600 focus:ring-red-600"
                    />
                    <span className="text-sm text-gray-300">{width.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Country of Origin */}
        <div className="border-b border-zinc-800 bg-zinc-900/30">
          <button
            onClick={() => toggleSection('countryOfOrigin')}
            className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
          >
            <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">COUNTRY OF ORIGIN</span>
            {expandedSections['countryOfOrigin'] ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
          </button>
          {expandedSections['countryOfOrigin'] && (
            <div className="px-4 pb-4 space-y-2">
              {countries.map((country) => (
                <label key={country.value} className="flex items-center cursor-pointer hover:bg-zinc-800/50 p-2 rounded transition-colors">
                  <input
                    type="radio"
                    name="country_of_origin"
                    value={country.value}
                    checked={filters.country_of_origin === country.value}
                    onChange={(e) => onFilterChange({ ...filters, country_of_origin: e.target.value })}
                    className="mr-3 w-4 h-4 border-zinc-600 bg-zinc-800 text-red-600 focus:ring-red-600"
                  />
                  <span className="text-sm text-gray-300">{country.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Product Type - Hidden for eyeglasses, contact-lenses, sunglasses and accessories category */}
        {filters.category !== 'eyeglasses' && filters.category !== 'contact-lenses' && filters.category !== 'sunglasses' && filters.category !== 'accessories' && (
        <div className="border-b border-zinc-800 bg-zinc-900/30">
          <button
            onClick={() => toggleSection('productType')}
            className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
          >
            <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">PRODUCT TYPE</span>
            {expandedSections['productType'] ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
          </button>
          {expandedSections['productType'] && (
            <div className="px-4 pb-4 space-y-2">
              {productTypes.map((type) => (
                <label key={type.value} className="flex items-center cursor-pointer hover:bg-zinc-800/50 p-2 rounded transition-colors">
                  <input
                    type="radio"
                    name="product_type"
                    value={type.value}
                    checked={filters.product_type === type.value}
                    onChange={(e) => onFilterChange({ ...filters, product_type: e.target.value })}
                    className="mr-3 w-4 h-4 border-zinc-600 bg-zinc-800 text-red-600 focus:ring-red-600"
                  />
                  <span className="text-sm text-gray-300">{type.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
};
