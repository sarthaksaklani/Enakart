// scripts/seedMoreProducts.mjs
// Seed 50+ products into Supabase database

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env.local file
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};

  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...values] = trimmed.split('=');
      if (key && values.length) {
        env[key.trim()] = values.join('=').trim();
      }
    }
  });

  return env;
}

const env = loadEnv();
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🌱 Starting to seed more products...\n');

// Helper function to create slug from name
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Get category IDs
const { data: categories } = await supabase.from('categories').select('id, slug');
const categoryMap = {};
categories.forEach(cat => categoryMap[cat.slug] = cat.id);

// 50+ products data
const allProducts = [
  // Eyeglasses (20 products)
  { name: 'Classic Rectangle Metal Frame', description: 'Professional rectangle metal frames for office and formal occasions', price: 2299, brand: 'ExecutiveEyes', category_slug: 'eyeglasses', frame_shape: 'rectangle', frame_material: 'metal', frame_color: 'Gold', gender: 'men', images: ['https://images.unsplash.com/photo-1614715838608-dd527c46231d?w=500'], stock_quantity: 35, is_featured: true },
  { name: 'Round Rose Gold Sunglasses', description: 'Trendy round sunglasses with rose gold frame and mirror lenses', price: 2699, original_price: 3299, brand: 'TrendyLook', category_slug: 'sunglasses', frame_shape: 'round', frame_material: 'metal', frame_color: 'Rose Gold', gender: 'women', images: ['https://images.unsplash.com/photo-1609010697446-11f2155278f0?w=500'], stock_quantity: 28 },
  { name: 'Kids Colorful Round Frames', description: 'Durable and flexible frames for kids with vibrant colors', price: 1299, brand: 'KiddoVision', category_slug: 'eyeglasses', frame_shape: 'round', frame_material: 'plastic', frame_color: 'Red', gender: 'kids', images: ['https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500'], stock_quantity: 60 },
  { name: 'Wooden Wayfarer Eco Frames', description: 'Eco-friendly wooden frames with wayfarer design', price: 3499, original_price: 4299, brand: 'EcoOptics', category_slug: 'eyeglasses', frame_shape: 'wayfarer', frame_material: 'wood', frame_color: 'Brown', gender: 'unisex', images: ['https://images.unsplash.com/photo-1622519407650-3df9883f76e5?w=500'], stock_quantity: 15, is_featured: true },
  { name: 'Oversized Square Sunglasses', description: 'Bold oversized square sunglasses with maximum UV protection', price: 2899, brand: 'BoldStyle', category_slug: 'sunglasses', frame_shape: 'square', frame_material: 'acetate', frame_color: 'Black', gender: 'women', images: ['https://images.unsplash.com/photo-1508296695146-257a814070b4?w=500'], stock_quantity: 22 },
  { name: 'Ultra-thin Titanium Rectangle', description: 'Ultra-lightweight titanium frames with minimalist rectangle design', price: 3799, brand: 'MinimalEyes', category_slug: 'eyeglasses', frame_shape: 'rectangle', frame_material: 'titanium', frame_color: 'Gunmetal', gender: 'men', images: ['https://images.unsplash.com/photo-1586105251261-72a756497a11?w=500'], stock_quantity: 18 },
  { name: 'Round Vintage Gold Wire', description: 'Delicate gold wire frames with round lenses', price: 1899, brand: 'HeritageLens', category_slug: 'eyeglasses', frame_shape: 'round', frame_material: 'metal', frame_color: 'Gold', gender: 'unisex', images: ['https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500'], stock_quantity: 37 },
  { name: 'Designer Cat Eye Gradient', description: 'Premium cat-eye sunglasses with gradient lenses', price: 4299, original_price: 5499, brand: 'LuxeOptics', category_slug: 'sunglasses', frame_shape: 'cat-eye', frame_material: 'acetate', frame_color: 'Burgundy', gender: 'women', images: ['https://images.unsplash.com/photo-1508296695146-257a814070b4?w=500'], stock_quantity: 12, is_featured: true },
  { name: 'Square Blue Light Blocker', description: 'Square frames with advanced blue light filtering', price: 1699, brand: 'DigitalEyes', category_slug: 'eyeglasses', frame_shape: 'square', frame_material: 'plastic', frame_color: 'Navy Blue', gender: 'unisex', images: ['https://images.unsplash.com/photo-1622519407650-3df9883f76e5?w=500'], stock_quantity: 55, is_trending: true },
  { name: 'Aviator Photochromic Transition', description: 'Smart aviator frames with photochromic lenses', price: 3299, brand: 'SmartOptics', category_slug: 'eyeglasses', frame_shape: 'aviator', frame_material: 'metal', frame_color: 'Bronze', gender: 'unisex', images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500'], stock_quantity: 24, is_featured: true },
  { name: 'Kids Square Flex Frames', description: 'Flexible and durable square frames for active kids', price: 1399, brand: 'JuniorSpecs', category_slug: 'eyeglasses', frame_shape: 'square', frame_material: 'plastic', frame_color: 'Blue', gender: 'kids', images: ['https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500'], stock_quantity: 48 },
  { name: 'Wayfarer Bamboo Eco Sunglasses', description: 'Sustainable bamboo sunglasses with wayfarer styling', price: 2599, brand: 'GreenShades', category_slug: 'sunglasses', frame_shape: 'wayfarer', frame_material: 'wood', frame_color: 'Natural', gender: 'unisex', images: ['https://images.unsplash.com/photo-1622519407650-3df9883f76e5?w=500'], stock_quantity: 19 },
  { name: 'Rectangle Titanium Business', description: 'Professional titanium rectangle frames', price: 3599, brand: 'ExecutivePro', category_slug: 'eyeglasses', frame_shape: 'rectangle', frame_material: 'titanium', frame_color: 'Black', gender: 'men', images: ['https://images.unsplash.com/photo-1614715838608-dd527c46231d?w=500'], stock_quantity: 21 },
  { name: 'Round Mirror Lens Sunglasses', description: 'Trendy round sunglasses with mirror finish', price: 1999, original_price: 2699, brand: 'MirrorStyle', category_slug: 'sunglasses', frame_shape: 'round', frame_material: 'metal', frame_color: 'Silver', gender: 'women', images: ['https://images.unsplash.com/photo-1609010697446-11f2155278f0?w=500'], stock_quantity: 32 },
  { name: 'Aviator Gold Classic Premium', description: 'Premium gold aviator sunglasses with superior lens quality', price: 3999, original_price: 4999, brand: 'PremiumVision', category_slug: 'sunglasses', frame_shape: 'aviator', frame_material: 'metal', frame_color: 'Gold', gender: 'men', images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500'], stock_quantity: 16, is_featured: true },
  { name: 'Cat Eye Gradient Fashion', description: 'Fashion-forward cat-eye frames with gradient color', price: 2499, brand: 'FashionFirst', category_slug: 'eyeglasses', frame_shape: 'cat-eye', frame_material: 'acetate', frame_color: 'Purple', gender: 'women', images: ['https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500'], stock_quantity: 23 },
  { name: 'Square Gaming Glasses', description: 'Specialized gaming glasses with blue light protection', price: 1799, brand: 'GamerVision', category_slug: 'eyeglasses', frame_shape: 'square', frame_material: 'plastic', frame_color: 'Black/Red', gender: 'unisex', images: ['https://images.unsplash.com/photo-1622519407650-3df9883f76e5?w=500'], stock_quantity: 44, is_trending: true },
  { name: 'Wayfarer Matte Black Classic', description: 'Iconic wayfarer design in matte black', price: 2199, brand: 'IconicFrames', category_slug: 'sunglasses', frame_shape: 'wayfarer', frame_material: 'acetate', frame_color: 'Matte Black', gender: 'unisex', images: ['https://images.unsplash.com/photo-1622519407650-3df9883f76e5?w=500'], stock_quantity: 51, is_featured: true },
  { name: 'Round Acetate Colorful', description: 'Bold round frames in vibrant acetate colors', price: 1699, brand: 'ColorPop', category_slug: 'eyeglasses', frame_shape: 'round', frame_material: 'acetate', frame_color: 'Green', gender: 'unisex', images: ['https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500'], stock_quantity: 38 },
  { name: 'Rectangle Sports Performance', description: 'High-performance sports eyeglasses with rubberized grip', price: 2899, brand: 'ProAthlete', category_slug: 'eyeglasses', frame_shape: 'rectangle', frame_material: 'plastic', frame_color: 'Orange', gender: 'men', images: ['https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=500'], stock_quantity: 27 },

  // Accessories (15 products)
  { name: 'Anti-Fog Lens Spray', description: 'Professional anti-fog spray for eyeglasses, 50ml bottle', price: 399, original_price: 599, brand: 'FogFree', category_slug: 'accessories', frame_color: 'Clear', gender: 'unisex', images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500'], stock_quantity: 180 },
  { name: 'Eyeglass Chain Gold Plated', description: 'Elegant gold-plated eyeglass chain with adjustable length', price: 899, brand: 'ChainStyle', category_slug: 'accessories', frame_color: 'Gold', gender: 'women', images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500'], stock_quantity: 75, is_featured: true },
  { name: 'Sports Eyewear Strap', description: 'Durable neoprene sports strap for active lifestyles', price: 349, brand: 'SportSecure', category_slug: 'accessories', frame_color: 'Black', gender: 'unisex', images: ['https://images.unsplash.com/photo-1577803645773-f96470509666?w=500'], stock_quantity: 150 },
  { name: 'Lens Cleaning Kit Complete', description: 'Complete kit with solution, cloth, brush, and case', price: 699, original_price: 999, brand: 'CleanPro', category_slug: 'accessories', frame_color: 'Blue', gender: 'unisex', images: ['https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500'], stock_quantity: 120, is_featured: true },
  { name: 'Soft Pouch Glasses Case', description: 'Lightweight soft pouch, compact and portable', price: 199, brand: 'PocketCase', category_slug: 'accessories', frame_color: 'Grey', gender: 'unisex', images: ['https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=500'], stock_quantity: 200 },
  { name: 'Beaded Eyeglass Chain Colorful', description: 'Handcrafted beaded chain in bohemian style', price: 549, brand: 'BohoChain', category_slug: 'accessories', frame_color: 'Multi', gender: 'women', images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500'], stock_quantity: 90 },
  { name: 'Hard Shell Zippered Case', description: 'Protective hard shell case with extra space', price: 599, brand: 'TravelSafe', category_slug: 'accessories', frame_color: 'Black', gender: 'unisex', images: ['https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=500'], stock_quantity: 130 },
  { name: 'Lens Cleaning Solution 100ml', description: 'Professional-grade lens cleaning solution', price: 449, brand: 'OptiClean', category_slug: 'accessories', frame_color: 'Clear', gender: 'unisex', images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500'], stock_quantity: 160 },
  { name: 'Leather Cord Eyeglass Holder', description: 'Genuine leather cord with minimalist design', price: 649, brand: 'LeatherCraft', category_slug: 'accessories', frame_color: 'Brown', gender: 'men', images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500'], stock_quantity: 85 },
  { name: 'Magnetic Eyewear Stand', description: 'Modern magnetic stand holding up to 3 pairs', price: 1299, original_price: 1799, brand: 'HomeOrganize', category_slug: 'accessories', frame_color: 'Walnut', gender: 'unisex', images: ['https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=500'], stock_quantity: 50, is_featured: true },
  { name: 'Silicone Nose Pads Set', description: 'Replacement nose pads, pack of 10 pairs', price: 249, brand: 'ComfortFit', category_slug: 'accessories', frame_color: 'Clear', gender: 'unisex', images: ['https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500'], stock_quantity: 300 },
  { name: 'Pearl Chain Eyeglass Holder', description: 'Elegant pearl-style chain, classic accessory', price: 999, brand: 'PearlStyle', category_slug: 'accessories', frame_color: 'White', gender: 'women', images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500'], stock_quantity: 70, is_featured: true },
  { name: 'Eyeglass Repair Kit Mini', description: 'Compact repair kit with screwdrivers and screws', price: 399, brand: 'FixIt', category_slug: 'accessories', frame_color: 'Silver', gender: 'unisex', images: ['https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500'], stock_quantity: 140 },
  { name: 'UV Protection Coating Spray', description: 'Add UV protection to any eyewear, 30ml spray', price: 599, brand: 'UVGuard', category_slug: 'accessories', frame_color: 'Clear', gender: 'unisex', images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500'], stock_quantity: 110 },
  { name: 'Designer Glasses Display Tray', description: 'Premium velvet tray for storing 6 pairs', price: 1599, brand: 'LuxDisplay', category_slug: 'accessories', frame_color: 'Black', gender: 'unisex', images: ['https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=500'], stock_quantity: 40 },

  // Contact Lenses (15 products)
  { name: 'Daily Disposable Contact Lenses', description: 'Ultra-comfortable daily disposable lenses, 30 per box', price: 899, original_price: 1299, brand: 'AcuvueDaily', category_slug: 'contact-lenses', frame_color: 'Clear', gender: 'unisex', images: ['https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?w=500'], stock_quantity: 150, is_featured: true },
  { name: 'Monthly Silicone Hydrogel Lenses', description: 'Premium monthly lenses, 6 per box', price: 1599, original_price: 2199, brand: 'Biofinity', category_slug: 'contact-lenses', frame_color: 'Clear', gender: 'unisex', images: ['https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?w=500'], stock_quantity: 120, is_featured: true },
  { name: 'Colored Contact Lenses - Blue', description: 'Natural-looking blue colored lenses, monthly replacement', price: 1199, original_price: 1699, brand: 'FreshLook', category_slug: 'contact-lenses', frame_color: 'Blue', gender: 'unisex', images: ['https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?w=500'], stock_quantity: 80, is_featured: true },
  { name: 'Colored Contact Lenses - Green', description: 'Vibrant green lenses with UV protection', price: 1199, original_price: 1699, brand: 'FreshLook', category_slug: 'contact-lenses', frame_color: 'Green', gender: 'unisex', images: ['https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?w=500'], stock_quantity: 75 },
  { name: 'Colored Contact Lenses - Hazel', description: 'Warm hazel colored lenses for natural enhancement', price: 1199, original_price: 1699, brand: 'FreshLook', category_slug: 'contact-lenses', frame_color: 'Hazel', gender: 'unisex', images: ['https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?w=500'], stock_quantity: 85 },
  { name: 'Colored Contact Lenses - Gray', description: 'Sophisticated gray lenses with subtle enhancement', price: 1199, original_price: 1699, brand: 'FreshLook', category_slug: 'contact-lenses', frame_color: 'Gray', gender: 'unisex', images: ['https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?w=500'], stock_quantity: 70 },
  { name: 'Toric Lenses for Astigmatism', description: 'Specialized toric lenses, 6 per box', price: 2499, original_price: 3299, brand: 'AcuvueOasys', category_slug: 'contact-lenses', frame_color: 'Clear', gender: 'unisex', images: ['https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?w=500'], stock_quantity: 60, is_featured: true },
  { name: 'Multifocal Contact Lenses', description: 'Advanced multifocal lenses for presbyopia, 6 per box', price: 2999, original_price: 3999, brand: 'AirOptix', category_slug: 'contact-lenses', frame_color: 'Clear', gender: 'unisex', images: ['https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?w=500'], stock_quantity: 50 },
  { name: 'Weekly Disposable Lenses', description: 'Convenient weekly disposable lenses, 4 per box', price: 799, original_price: 1099, brand: 'PureVision', category_slug: 'contact-lenses', frame_color: 'Clear', gender: 'unisex', images: ['https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?w=500'], stock_quantity: 100 },
  { name: 'UV Protection Contact Lenses', description: 'Daily lenses with UV protection, 30 per box', price: 1099, original_price: 1499, brand: 'Acuvue', category_slug: 'contact-lenses', frame_color: 'Clear', gender: 'unisex', images: ['https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?w=500'], stock_quantity: 110, is_featured: true },
  { name: 'High Definition Contact Lenses', description: 'Premium HD lenses for crisp vision, 6 per box', price: 2199, original_price: 2899, brand: 'UltraHD', category_slug: 'contact-lenses', frame_color: 'Clear', gender: 'unisex', images: ['https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?w=500'], stock_quantity: 65 },
  { name: 'Extended Wear Lenses', description: 'Up to 7 days continuous wear, 6 per box', price: 2799, original_price: 3699, brand: 'Night&Day', category_slug: 'contact-lenses', frame_color: 'Clear', gender: 'unisex', images: ['https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?w=500'], stock_quantity: 45, is_featured: true },
  { name: 'Moisture Lock Lenses', description: 'Hydrating daily disposable lenses, 30 per box', price: 999, original_price: 1399, brand: 'HydraLens', category_slug: 'contact-lenses', frame_color: 'Clear', gender: 'unisex', images: ['https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?w=500'], stock_quantity: 130 },
  { name: 'Sports Performance Lenses', description: 'Designed for active lifestyles, 6 per box', price: 1899, original_price: 2499, brand: 'ActiveVision', category_slug: 'contact-lenses', frame_color: 'Clear', gender: 'unisex', images: ['https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?w=500'], stock_quantity: 75 },
  { name: 'Sensitive Eyes Lenses', description: 'Hypoallergenic daily disposable, 30 per box', price: 1199, original_price: 1599, brand: 'SensitiveCare', category_slug: 'contact-lenses', frame_color: 'Clear', gender: 'unisex', images: ['https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?w=500'], stock_quantity: 95, is_featured: true },
];

// Transform and insert
const productsToInsert = allProducts.map((product) => {
  const slug = createSlug(product.name);
  return {
    name: product.name,
    slug: slug,
    description: product.description,
    short_description: product.description.substring(0, 100),
    sku: `SKU-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    category_id: categoryMap[product.category_slug],
    price: product.price,
    original_price: product.original_price || null,
    discount_percentage: product.original_price ? ((product.original_price - product.price) / product.original_price * 100).toFixed(2) : null,
    brand: product.brand,
    frame_material: product.frame_material || null,
    frame_shape: product.frame_shape || null,
    frame_color: product.frame_color,
    gender: product.gender,
    stock_quantity: product.stock_quantity,
    is_in_stock: product.stock_quantity > 0,
    images: JSON.stringify(product.images || []),
    featured_image: product.images[0] || null,
    is_active: true,
    is_featured: product.is_featured || false,
    is_trending: product.is_trending || false,
    is_new_arrival: product.is_new_arrival || false,
  };
});

console.log(`📦 Inserting ${productsToInsert.length} products...\n`);

const { data, error } = await supabase.from('products').insert(productsToInsert).select();

if (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

console.log(`✅ Successfully inserted ${data.length} products!`);
console.log(`📊 Total products now in database\n`);
console.log('🎉 Seeding completed!');
