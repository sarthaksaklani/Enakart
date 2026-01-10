// src/types/index.ts

// User Types
export type UserRole = 'customer' | 'seller' | 'reseller';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  gender: 'male' | 'female' | 'other';
  mobile: string;
  phone?: string; // Alternative phone
  role: UserRole;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  // Seller specific fields
  business_name?: string;
  gst_number?: string;
  business_address?: string;
  business_license?: string;
  // Reseller specific fields
  reseller_type?: string;
  company_name?: string;
  tax_id?: string;
  created_at: string;
  updated_at: string;
}

export interface UserRegistration {
  first_name: string;
  last_name: string;
  gender: 'male' | 'female' | 'other';
  mobile: string;
  email: string;
  role: UserRole;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  // Seller specific fields
  business_name?: string;
  gst_number?: string;
  business_address?: string;
  business_license?: string;
  // Reseller specific fields
  reseller_type?: string;
  company_name?: string;
  tax_id?: string;
}

export interface LoginCredentials {
  identifier: string; // email or mobile
  otp?: string;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

// Product Types
export type ProductCategory = 'eyeglasses' | 'lens' | 'sunglasses' | 'accessories' | 'contact-lenses';
export type FrameShape = 'round' | 'square' | 'rectangle' | 'cat-eye' | 'aviator' | 'wayfarer' | 'rounded-square' | 'rounded-rectangle' | 'oval' | 'pento' | 'hexagonal' | 'polygonal' | 'butterfly' | 'geometric' | 'oversized' | 'sport';
export type FrameMaterial = 'metal' | 'plastic' | 'acetate' | 'titanium' | 'wood';
export type FrameType = 'full-rim' | 'half-rim' | 'rimless';
export type Gender = 'men' | 'women' | 'unisex' | 'kids';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number; // For showing discounts
  brand: string;
  category: ProductCategory;
  frame_shape?: FrameShape;
  frame_material?: FrameMaterial;
  frame_color: string;
  gender: Gender;
  images: string[]; // Array of image URLs
  stock_quantity: number;
  is_featured: boolean;
  specifications?: Record<string, string>; // Flexible specs like lens_width, bridge_width
  created_at: string;
  updated_at: string;
}

// Cart Types
export type LensChoice = 'none' | 'without-lens' | 'with-lens';
export type LensType = 'single-vision' | 'bifocal' | 'progressive' | 'blu-cut' | 'cr-lens' | 'photochromic' | 'anti-glare';
export type PrescriptionEntryMethod = 'upload' | 'manual';

export interface LensPower {
  sphere: string;
  cylinder?: string;
  axis?: string;
  add?: string; // For bifocal/progressive
}

export interface LensPrescription {
  entryMethod: PrescriptionEntryMethod;
  prescriptionFile?: string; // For upload method
  lensType: LensType;
  sameForBothEyes: boolean;
  leftEye?: LensPower;
  rightEye?: LensPower;
  bothEyes?: LensPower; // When same for both eyes
  price: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  prescription_file?: string; // Optional prescription URL (deprecated - use lensPrescription)
  lens?: Product; // Optional lens product for eyeglasses
  lensChoice?: LensChoice; // Track whether customer chose to continue without lens or add lens
  lensPrescription?: LensPrescription; // Detailed lens prescription data
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// Order Types
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'return_requested' | 'return_approved' | 'return_picked_up' | 'return_received' | 'refunded';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'refund_initiated' | 'refund_processing';
export type OrderSource = 'customer' | 'reseller'; // Track whether order is from customer or reseller

export interface Order {
  id: string;
  user_id: string;
  order_number: string; // Human-readable order number
  order_source: OrderSource; // Track order source for invoice branding
  total_amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_id?: string; // Razorpay payment ID
  shipping_address: Address;
  prescription_files?: string[]; // URLs to uploaded prescriptions
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string; // Store name in case product is deleted later
  product_image: string;
  quantity: number;
  price: number; // Price at time of purchase
  prescription_file?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Filter Types for Product Listing
export interface ProductFilters {
  category?: ProductCategory;
  brand?: string;
  brands?: string[]; // Multiple brand selection
  frame_shape?: FrameShape;
  frame_material?: FrameMaterial;
  frame_type?: FrameType;
  frame_color?: string;
  frame_colors?: string[]; // Multiple color selection
  frame_size?: string;
  frame_width?: string;
  gender?: Gender;
  min_price?: number;
  max_price?: number;
  sort_by?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
  search?: string;
  // New filters
  weight_group?: string;
  prescription_type?: string;
  supported_powers?: string;
  collection?: string;
  glass_color?: string;
  sub_collection?: string;
  country_of_origin?: string;
  product_type?: string;
  // Contact Lenses specific
  type?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  color?: string;
  purpose?: 'vision' | 'cosmetic' | 'toric' | 'multifocal' | 'presbyopia';
  material?: string;
  feature?: string;
  // Sunglasses specific
  lens?: 'polarized' | 'mirrored' | 'gradient' | 'photochromic' | 'prescription';
  activity?: 'driving' | 'sports' | 'cycling' | 'running' | 'beach' | 'fishing' | 'golf';
  uv?: string;
  // Accessories specific
  accessory_type?: string;
  // Common
  age?: string;
  style?: string;
  is_featured?: boolean;
  offer?: string;
  bundle?: string;
  guide?: string;
  gift?: string;
  eco?: string;
  price?: string;
  // Additional filter fields
  replacement_type?: string;
  lens_color?: string;
  lens_purpose?: string;
  discount_range?: string;
  pack_size?: string;
  [key: string]: any; // Allow any additional fields
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
