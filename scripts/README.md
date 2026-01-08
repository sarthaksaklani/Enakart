# Database Seeding Scripts

This directory contains scripts to seed your Supabase database with dummy products.

## Prerequisites

Before running the seeding scripts, ensure you have:

1. **Supabase Project Setup**: Create a Supabase project at [supabase.com](https://supabase.com)

2. **Environment Variables**: Set up your `.env.local` file with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Database Schema**: Create the `products` table in your Supabase database with this SQL:

```sql
-- Create products table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  original_price INTEGER,
  brand TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('eyeglasses', 'sunglasses', 'contact-lenses')),
  frame_shape TEXT CHECK (frame_shape IN ('round', 'square', 'rectangle', 'cat-eye', 'aviator', 'wayfarer')),
  frame_material TEXT CHECK (frame_material IN ('metal', 'plastic', 'acetate', 'titanium', 'wood')),
  frame_color TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('men', 'women', 'unisex', 'kids')),
  images TEXT[] NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  specifications JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (optional, but recommended)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON products
  FOR SELECT USING (true);

-- Create policy to allow insert (for seeding)
-- Note: In production, you should restrict this to authenticated users only
CREATE POLICY "Allow insert for authenticated users" ON products
  FOR INSERT WITH CHECK (true);
```

## Running the Seeding Script

### Option 1: Using npm script (Recommended)

```bash
npm run seed:products
```

This will insert all 50 dummy products into your Supabase database.

### Option 2: Using Node.js directly

```bash
node scripts/seedProductsSimple.mjs
```

## What Gets Seeded?

The script will insert **50 diverse products** including:

- **Categories**: Eyeglasses, Sunglasses
- **Frame Shapes**: Round, Square, Rectangle, Cat-eye, Aviator, Wayfarer
- **Materials**: Metal, Plastic, Acetate, Titanium, Wood
- **Genders**: Men, Women, Unisex, Kids
- **Price Range**: ₹1,199 to ₹5,299
- **Features**: Blue light blockers, polarized lenses, photochromic, eco-friendly materials, and more

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Check that your `.env.local` file exists and contains the correct variables
- Make sure the file is in the root directory of your project

### Error: "products table does not exist"
- Run the SQL schema provided above in your Supabase SQL editor
- Make sure you're connected to the correct database

### Error: "new row violates row-level security policy"
- Check your RLS policies in Supabase
- For development, you can temporarily disable RLS or create permissive policies
- Make sure the policy allows INSERT operations

### Error: "duplicate key value violates unique constraint"
- Products with IDs 1-50 already exist in your database
- Either delete existing products or modify the IDs in the seeding script

## Clearing Products

If you want to start fresh, run this SQL in your Supabase SQL editor:

```sql
DELETE FROM products;
```

Or delete specific products by ID:

```sql
DELETE FROM products WHERE id IN ('1', '2', '3');
```

## Files in this Directory

- `seedProductsSimple.mjs` - Simple ES Module script with all 50 products (recommended)
- `seedProducts.ts` - TypeScript version with batch processing (requires compilation)
- `seedProducts.js` - Node.js CommonJS version with sample products
- `README.md` - This file

## Notes

- The script uses the same dummy data as `src/lib/data/dummyProducts.ts`
- All products have placeholder Unsplash images
- Stock quantities are pre-set but can be modified after seeding
- Some products are marked as "featured" for homepage display
