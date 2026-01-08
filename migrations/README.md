# Database Migrations

This folder contains SQL migration files for the Optical Store database.

## Migration Files (in order)

1. **000_initial_schema.sql** - Base database schema with all tables
2. **001_add_user_roles.sql** - Add role-based fields to users table
3. **002_add_order_source.sql** - Add order source tracking

## How to Run Migrations

### Option 1: Supabase Dashboard (Recommended for first time)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste each migration file content in order
4. Click **Run** for each migration

### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref wlhougvaibxgpooxwfyi

# Run migrations
supabase db push
```

### Option 3: Using Node.js script

```bash
npm run migrate
```

## Database Schema Overview

### Core Tables
- **users** - User accounts with role-based fields
- **categories** - Product categories
- **products** - Products catalog
- **addresses** - User shipping/billing addresses

### Shopping Flow
- **cart** - Shopping carts
- **cart_items** - Items in cart with customization
- **orders** - Customer orders
- **order_items** - Individual items in orders

### Features
- **wishlist** - User wishlists
- **notifications** - User notifications
- **payments** - Payment transactions
- **reviews** - Product reviews
- **coupons** - Discount coupons
- **coupon_usage** - Coupon usage tracking

## Security

- Row Level Security (RLS) is enabled on all sensitive tables
- Users can only access their own data
- Authentication is handled through Supabase Auth

## Notes

- All tables have `created_at` and `updated_at` timestamps
- UUID is used for all primary keys
- Proper indexes are created for performance
- Foreign key constraints maintain data integrity
