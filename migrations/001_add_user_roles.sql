-- Migration: Add user roles and role-specific fields to users table
-- This migration adds support for customer, seller, and reseller user types

-- Step 1: Add role column to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'seller', 'reseller'));

-- Step 2: Add seller-specific columns
ALTER TABLE users
ADD COLUMN IF NOT EXISTS business_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS gst_number VARCHAR(15),
ADD COLUMN IF NOT EXISTS business_address TEXT,
ADD COLUMN IF NOT EXISTS business_license VARCHAR(100);

-- Step 3: Add reseller-specific columns
ALTER TABLE users
ADD COLUMN IF NOT EXISTS company_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS reseller_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS tax_id VARCHAR(50);

-- Step 4: Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_gst_number ON users(gst_number) WHERE gst_number IS NOT NULL;

-- Step 5: Add comments for documentation
COMMENT ON COLUMN users.role IS 'User role: customer, seller, or reseller';
COMMENT ON COLUMN users.business_name IS 'Business name for sellers';
COMMENT ON COLUMN users.gst_number IS 'GST number for sellers (Indian tax ID)';
COMMENT ON COLUMN users.business_address IS 'Business address for sellers';
COMMENT ON COLUMN users.business_license IS 'Business license number for sellers';
COMMENT ON COLUMN users.company_name IS 'Company name for resellers';
COMMENT ON COLUMN users.reseller_type IS 'Type of reseller (wholesale, retail, online, etc.)';
COMMENT ON COLUMN users.tax_id IS 'Tax ID or PAN for resellers';
