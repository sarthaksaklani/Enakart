// scripts/seedProducts.js
// Script to seed the database with dummy products (Node.js version)

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read environment variables from .env.local
function loadEnvFile() {
  const envPath = path.resolve(__dirname, '../.env.local');
  try {
    const envFile = fs.readFileSync(envPath, 'utf8');
    const envVars = {};

    envFile.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          envVars[key.trim()] = valueParts.join('=').trim();
        }
      }
    });

    return envVars;
  } catch (error) {
    console.error('❌ Error reading .env.local file:', error.message);
    process.exit(1);
  }
}

// Load dummy products
const dummyProducts = [
  {
    id: '1',
    name: 'Classic Aviator Gold',
    description: 'Timeless aviator sunglasses with gold frame and gradient lenses. Perfect for any occasion.',
    price: 2499,
    original_price: 3499,
    brand: 'RayStyle',
    category: 'sunglasses',
    frame_shape: 'aviator',
    frame_material: 'metal',
    frame_color: 'Gold',
    gender: 'unisex',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500',
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=500',
    ],
    stock_quantity: 50,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Round Vintage Eyeglasses',
    description: 'Retro round frame eyeglasses with acetate material. Includes anti-glare coating.',
    price: 1899,
    original_price: 2499,
    brand: 'VisionPro',
    category: 'eyeglasses',
    frame_shape: 'round',
    frame_material: 'acetate',
    frame_color: 'Black',
    gender: 'unisex',
    images: [
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500',
      'https://images.unsplash.com/photo-1577803645773-f96470509666?w=500',
    ],
    stock_quantity: 30,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Wayfarer Blue Light Glasses',
    description: 'Modern wayfarer style with blue light blocking technology. Perfect for screen time.',
    price: 1599,
    brand: 'TechVision',
    category: 'eyeglasses',
    frame_shape: 'wayfarer',
    frame_material: 'plastic',
    frame_color: 'Black',
    gender: 'unisex',
    images: [
      'https://images.unsplash.com/photo-1622519407650-3df9883f76e5?w=500',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
    ],
    stock_quantity: 45,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Cat Eye Sunglasses Pink',
    description: 'Stylish cat-eye sunglasses for women. UV400 protection with polarized lenses.',
    price: 2199,
    original_price: 2999,
    brand: 'GlamourEyes',
    category: 'sunglasses',
    frame_shape: 'cat-eye',
    frame_material: 'acetate',
    frame_color: 'Pink',
    gender: 'women',
    images: [
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=500',
      'https://images.unsplash.com/photo-1475116127127-e3ce09ee84e1?w=500',
    ],
    stock_quantity: 25,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Square Titanium Frames',
    description: 'Lightweight titanium frames with square design. Durable and comfortable for all-day wear.',
    price: 3299,
    brand: 'TitanPro',
    category: 'eyeglasses',
    frame_shape: 'square',
    frame_material: 'titanium',
    frame_color: 'Silver',
    gender: 'men',
    images: [
      'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=500',
      'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=500',
    ],
    stock_quantity: 20,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Rectangle Sports Sunglasses',
    description: 'Sporty rectangle sunglasses with wraparound design. Perfect for outdoor activities.',
    price: 1799,
    brand: 'SportVision',
    category: 'sunglasses',
    frame_shape: 'rectangle',
    frame_material: 'plastic',
    frame_color: 'Blue',
    gender: 'unisex',
    images: [
      'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=500',
      'https://images.unsplash.com/photo-1577803645773-f96470509666?w=500',
    ],
    stock_quantity: 40,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Classic Rectangle Metal Frame',
    description: 'Professional rectangle metal frames. Ideal for office and formal occasions.',
    price: 2299,
    brand: 'ExecutiveEyes',
    category: 'eyeglasses',
    frame_shape: 'rectangle',
    frame_material: 'metal',
    frame_color: 'Gold',
    gender: 'men',
    images: [
      'https://images.unsplash.com/photo-1614715838608-dd527c46231d?w=500',
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500',
    ],
    stock_quantity: 35,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Round Rose Gold Sunglasses',
    description: 'Trendy round sunglasses with rose gold frame. Mirror lens finish.',
    price: 2699,
    original_price: 3299,
    brand: 'TrendyLook',
    category: 'sunglasses',
    frame_shape: 'round',
    frame_material: 'metal',
    frame_color: 'Rose Gold',
    gender: 'women',
    images: [
      'https://images.unsplash.com/photo-1609010697446-11f2155278f0?w=500',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500',
    ],
    stock_quantity: 28,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Products 9-50 continued...
  {
    id: '9',
    name: 'Kids Colorful Round Frames',
    description: 'Durable and flexible frames for kids. Vibrant colors with anti-scratch coating.',
    price: 1299,
    brand: 'KiddoVision',
    category: 'eyeglasses',
    frame_shape: 'round',
    frame_material: 'plastic',
    frame_color: 'Red',
    gender: 'kids',
    images: [
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500',
      'https://images.unsplash.com/photo-1577803645773-f96470509666?w=500',
    ],
    stock_quantity: 60,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '10',
    name: 'Wooden Wayfarer Eco Frames',
    description: 'Eco-friendly wooden frames with wayfarer design. Sustainable and stylish.',
    price: 3499,
    original_price: 4299,
    brand: 'EcoOptics',
    category: 'eyeglasses',
    frame_shape: 'wayfarer',
    frame_material: 'wood',
    frame_color: 'Brown',
    gender: 'unisex',
    images: [
      'https://images.unsplash.com/photo-1622519407650-3df9883f76e5?w=500',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
    ],
    stock_quantity: 15,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Note: This file is truncated for brevity. The actual script would include all 50 products.
// For the full list, import from '../src/lib/data/dummyProducts' after compiling TypeScript,
// or manually copy all products here.

const env = loadEnvFile();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Missing Supabase environment variables');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedProducts() {
  console.log('🌱 Starting product seeding...');
  console.log(`📦 Preparing to insert ${dummyProducts.length} products\n`);
  console.log('⚠️  Note: This JavaScript version contains only 10 sample products.');
  console.log('   For all 50 products, use: npm run seed:products\n');

  try {
    // Check if products table exists and is accessible
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Error accessing products table:', countError.message);
      console.error('\nMake sure:');
      console.error('1. The "products" table exists in your Supabase database');
      console.error('2. Row Level Security (RLS) policies allow insertions');
      console.error('3. Your API key has the necessary permissions\n');
      process.exit(1);
    }

    console.log(`📊 Current products in database: ${count || 0}\n`);

    // Insert products in batches
    const batchSize = 10;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < dummyProducts.length; i += batchSize) {
      const batch = dummyProducts.slice(i, i + batchSize);

      console.log(`📤 Inserting products ${i + 1} to ${Math.min(i + batchSize, dummyProducts.length)}...`);

      const { data, error } = await supabase
        .from('products')
        .insert(batch)
        .select();

      if (error) {
        console.error(`❌ Error inserting batch: ${error.message}`);
        errorCount += batch.length;
      } else {
        successCount += data?.length || 0;
        console.log(`✅ Successfully inserted ${data?.length || 0} products`);
      }

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 Seeding Summary:');
    console.log('='.repeat(50));
    console.log(`✅ Successfully inserted: ${successCount} products`);
    if (errorCount > 0) {
      console.log(`❌ Failed to insert: ${errorCount} products`);
    }
    console.log('='.repeat(50) + '\n');

    if (successCount === dummyProducts.length) {
      console.log('🎉 All products have been successfully seeded!');
    } else {
      console.log('⚠️  Some products failed to insert. Check the errors above.');
    }

  } catch (error) {
    console.error('❌ Unexpected error during seeding:', error);
    process.exit(1);
  }
}

seedProducts()
  .then(() => {
    console.log('\n✨ Seeding process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding process failed:', error);
    process.exit(1);
  });
