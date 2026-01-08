// scripts/seedProducts.mjs
// Seed products into Supabase database

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
  env.SUPABASE_SERVICE_ROLE_KEY  // Use service role key for admin operations
);

console.log('🌱 Starting database seeding...\n');

// Helper function to create slug from name
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Step 1: Get category IDs
console.log('📦 Fetching categories...');
const { data: categories, error: catError } = await supabase
  .from('categories')
  .select('id, slug');

if (catError) {
  console.error('❌ Error fetching categories:', catError);
  process.exit(1);
}

const categoryMap = {};
categories.forEach(cat => {
  categoryMap[cat.slug] = cat.id;
});

console.log('✅ Categories loaded:', Object.keys(categoryMap).join(', '));
console.log();

// Sample products (first 20 for testing)
const sampleProducts = [
  {
    name: 'Classic Aviator Gold',
    description: 'Timeless aviator sunglasses with gold frame and gradient lenses. Perfect for any occasion.',
    short_description: 'Classic gold aviator sunglasses',
    price: 2499.00,
    original_price: 3499.00,
    discount_percentage: 28.57,
    brand: 'RayStyle',
    category_slug: 'sunglasses',
    frame_shape: 'aviator',
    frame_material: 'metal',
    frame_color: 'Gold',
    gender: 'unisex',
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500', 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=500'],
    stock_quantity: 50,
    is_featured: true,
    is_trending: false,
    is_new_arrival: true
  },
  {
    name: 'Round Vintage Eyeglasses',
    description: 'Retro round frame eyeglasses with acetate material. Includes anti-glare coating.',
    short_description: 'Vintage round frame glasses',
    price: 1899.00,
    original_price: 2499.00,
    discount_percentage: 24.01,
    brand: 'VisionPro',
    category_slug: 'eyeglasses',
    frame_shape: 'round',
    frame_material: 'acetate',
    frame_color: 'Black',
    gender: 'unisex',
    images: ['https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500', 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=500'],
    stock_quantity: 30,
    is_featured: true,
    is_trending: true,
    is_new_arrival: false
  },
  {
    name: 'Wayfarer Blue Light Glasses',
    description: 'Modern wayfarer style with blue light blocking technology. Perfect for screen time.',
    short_description: 'Blue light blocking wayfarer',
    price: 1599.00,
    brand: 'TechVision',
    category_slug: 'eyeglasses',
    frame_shape: 'wayfarer',
    frame_material: 'plastic',
    frame_color: 'Black',
    gender: 'unisex',
    images: ['https://images.unsplash.com/photo-1622519407650-3df9883f76e5?w=500', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500'],
    stock_quantity: 45,
    is_featured: false,
    is_trending: true,
    is_new_arrival: true
  },
  {
    name: 'Cat Eye Sunglasses Pink',
    description: 'Stylish cat-eye sunglasses for women. UV400 protection with polarized lenses.',
    short_description: 'Pink cat-eye sunglasses',
    price: 2199.00,
    original_price: 2999.00,
    discount_percentage: 26.68,
    brand: 'GlamourEyes',
    category_slug: 'sunglasses',
    frame_shape: 'cat-eye',
    frame_material: 'acetate',
    frame_color: 'Pink',
    gender: 'women',
    images: ['https://images.unsplash.com/photo-1508296695146-257a814070b4?w=500', 'https://images.unsplash.com/photo-1475116127127-e3ce09ee84e1?w=500'],
    stock_quantity: 25,
    is_featured: true,
    is_trending: false,
    is_new_arrival: false
  },
  {
    name: 'Square Titanium Frames',
    description: 'Lightweight titanium frames with square design. Durable and comfortable for all-day wear.',
    short_description: 'Lightweight titanium frames',
    price: 3299.00,
    brand: 'TitanPro',
    category_slug: 'eyeglasses',
    frame_shape: 'square',
    frame_material: 'titanium',
    frame_color: 'Silver',
    gender: 'men',
    images: ['https://images.unsplash.com/photo-1586105251261-72a756497a11?w=500', 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=500'],
    stock_quantity: 20,
    is_featured: false,
    is_trending: false,
    is_new_arrival: true
  },
  {
    name: 'Premium Leather Glasses Case',
    description: 'Luxurious genuine leather hard case for eyeglasses. Scratch-resistant interior.',
    short_description: 'Leather glasses case',
    price: 799.00,
    original_price: 1199.00,
    discount_percentage: 33.36,
    brand: 'LuxCase',
    category_slug: 'accessories',
    frame_color: 'Brown',
    gender: 'unisex',
    images: ['https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=500', 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=500'],
    stock_quantity: 100,
    is_featured: true,
    is_trending: false,
    is_new_arrival: false
  },
  {
    name: 'Microfiber Cleaning Cloth Set',
    description: 'Pack of 5 ultra-soft microfiber cleaning cloths. Perfect for glasses and screens.',
    short_description: 'Microfiber cloth set',
    price: 299.00,
    brand: 'ClearView',
    category_slug: 'accessories',
    frame_color: 'Multi',
    gender: 'unisex',
    images: ['https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500'],
    stock_quantity: 250,
    is_featured: false,
    is_trending: false,
    is_new_arrival: false
  },
  {
    name: 'Sport Wrap Rectangle Sunglasses',
    description: 'Wraparound sports sunglasses with hydrophobic coating. Ideal for cycling and running.',
    short_description: 'Sports wraparound sunglasses',
    price: 2399.00,
    brand: 'ActiveVision',
    category_slug: 'sunglasses',
    frame_shape: 'rectangle',
    frame_material: 'plastic',
    frame_color: 'Matte Black',
    gender: 'unisex',
    images: ['https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=500', 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=500'],
    stock_quantity: 41,
    is_featured: false,
    is_trending: true,
    is_new_arrival: false
  },
  {
    name: 'Pilot Aviator Chrome',
    description: 'Classic pilot aviator style with chrome finish. Polarized lenses for glare reduction.',
    short_description: 'Chrome pilot aviators',
    price: 2799.00,
    original_price: 3499.00,
    discount_percentage: 20.00,
    brand: 'SkyView',
    category_slug: 'sunglasses',
    frame_shape: 'aviator',
    frame_material: 'metal',
    frame_color: 'Silver',
    gender: 'men',
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500', 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=500'],
    stock_quantity: 33,
    is_featured: true,
    is_trending: false,
    is_new_arrival: false
  },
  {
    name: 'Retro Cat Eye Tortoise',
    description: 'Vintage-inspired cat-eye frames in tortoise shell pattern. Acetate construction.',
    short_description: 'Retro tortoise cat-eye',
    price: 2199.00,
    brand: 'VintageVogue',
    category_slug: 'eyeglasses',
    frame_shape: 'cat-eye',
    frame_material: 'acetate',
    frame_color: 'Tortoise',
    gender: 'women',
    images: ['https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500', 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=500'],
    stock_quantity: 26,
    is_featured: true,
    is_trending: true,
    is_new_arrival: true
  }
];

// Transform products for database insertion
const productsToInsert = sampleProducts.map((product) => {
  const slug = createSlug(product.name);
  const categoryId = categoryMap[product.category_slug];

  if (!categoryId) {
    console.warn(`⚠️  Category not found for: ${product.category_slug}`);
  }

  return {
    name: product.name,
    slug: slug,
    description: product.description,
    short_description: product.short_description,
    sku: `SKU-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    category_id: categoryId,
    price: product.price,
    original_price: product.original_price || null,
    discount_percentage: product.discount_percentage || null,
    brand: product.brand,
    frame_material: product.frame_material || null,
    frame_shape: product.frame_shape || null,
    frame_color: product.frame_color,
    gender: product.gender,
    stock_quantity: product.stock_quantity,
    is_in_stock: product.stock_quantity > 0,
    images: JSON.stringify(product.images || []),
    featured_image: product.images && product.images[0] ? product.images[0] : null,
    is_active: true,
    is_featured: product.is_featured || false,
    is_trending: product.is_trending || false,
    is_new_arrival: product.is_new_arrival || false,
  };
});

console.log(`📦 Inserting ${productsToInsert.length} products...\n`);

// Insert products
const { data: insertedProducts, error: insertError } = await supabase
  .from('products')
  .insert(productsToInsert)
  .select();

if (insertError) {
  console.error('❌ Error inserting products:', insertError.message);
  console.error('Details:', insertError);
  process.exit(1);
}

console.log(`✅ Successfully inserted ${insertedProducts.length} products!`);
console.log();

// Display summary
console.log('📊 Summary:');
console.log(`   - Total products: ${insertedProducts.length}`);
console.log(`   - Featured: ${insertedProducts.filter(p => p.is_featured).length}`);
console.log(`   - Trending: ${insertedProducts.filter(p => p.is_trending).length}`);
console.log(`   - New Arrivals: ${insertedProducts.filter(p => p.is_new_arrival).length}`);
console.log();
console.log('🎉 Database seeding completed successfully!');
console.log();
console.log('🌐 You can now visit http://localhost:3000 to see your products!');
