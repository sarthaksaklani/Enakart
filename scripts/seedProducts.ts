// scripts/seedProducts.ts
// Script to seed the database with dummy products

import { createClient } from '@supabase/supabase-js';
import { dummyProducts } from '../src/lib/data/dummyProducts';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Missing Supabase environment variables');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedProducts() {
  console.log('🌱 Starting product seeding...');
  console.log(`📦 Preparing to insert ${dummyProducts.length} products\n`);

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

    // Ask user if they want to clear existing products
    console.log('⚠️  This will insert all products. If you want to clear existing products first,');
    console.log('   you can run: DELETE FROM products; in your Supabase SQL editor.\n');

    // Insert products in batches to avoid rate limits
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

      // Small delay to avoid rate limiting
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

// Run the seeding function
seedProducts()
  .then(() => {
    console.log('\n✨ Seeding process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding process failed:', error);
    process.exit(1);
  });
