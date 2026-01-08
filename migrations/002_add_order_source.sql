-- Migration: Add order_source field to orders table
-- Description: This migration adds an order_source column to track whether orders
--              come from customers or resellers, which determines invoice branding

-- Add order_source column to orders table
ALTER TABLE orders
ADD COLUMN order_source VARCHAR(20) NOT NULL DEFAULT 'customer'
CHECK (order_source IN ('customer', 'reseller'));

-- Add index on order_source for faster filtering
CREATE INDEX idx_orders_order_source ON orders(order_source);

-- Add comment to explain the column
COMMENT ON COLUMN orders.order_source IS 'Tracks whether order is from customer or reseller account - determines invoice branding';
