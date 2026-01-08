# Order Source Feature Documentation

## Overview
This feature separates customer orders from reseller orders in the seller dashboard and applies conditional branding to invoices based on the order source.

## Key Changes

### 1. Type System Updates
**File:** `src/types/index.ts`

Added new type and field:
```typescript
export type OrderSource = 'customer' | 'reseller';

export interface Order {
  // ... existing fields
  order_source: OrderSource; // New field
}
```

### 2. Seller Dashboard - Order Tabs
**File:** `src/app/seller/orders/page.tsx`

- Added tab navigation to separate customer and reseller orders
- Two tabs: "Orders from Customers" and "Orders from Resellers"
- Stats (Pending, Processing, Completed, Cancelled) now filter by active tab
- Dynamic empty state messages based on active tab

**Features:**
- Tab switching updates displayed orders and statistics
- Clean UI with icons (Users for customers, Store for resellers)
- Real-time filtering based on `order_source` field

### 3. Invoice Template Component
**File:** `src/components/invoice/InvoiceTemplate.tsx`

A reusable invoice template with conditional branding:

**With Branding (Customer Orders):**
- Enakart logo and company name
- Website and contact information
- "Thank you for shopping with Enakart!" footer
- Full company branding throughout

**Without Branding (Reseller Orders):**
- Plain "INVOICE" header
- No company logos or marketing
- Minimal footer with only legal text
- Professional, white-label appearance

**Invoice Includes:**
- Order details (number, ID, date, payment status)
- Shipping address
- Itemized product list with images
- Subtotal, tax (18% GST), and total
- Professional table layout

### 4. Printable Invoice Component
**File:** `src/components/invoice/PrintableInvoice.tsx`

Wrapper component that:
- Determines branding based on `order.order_source`
- Provides print functionality via button
- Hides print button during print preview
- Handles print-specific CSS

### 5. Order Creation API
**File:** `src/app/api/orders/create/route.ts`

**Changes:**
- Added validation for `order_source` field
- Must be either 'customer' or 'reseller'
- Returns 400 error if invalid
- Stores `order_source` in order object

**Request Body:**
```json
{
  "user_id": "string",
  "order_source": "customer" | "reseller",
  "items": [...],
  "shipping_address": {...},
  "total_amount": number
}
```

### 6. Customer Order Detail Page
**File:** `src/app/orders/[id]/page.tsx`

**Updates:**
- Automatically determines order source based on user role
- Imports and uses `InvoiceTemplate` component
- Added `showInvoice` state for print management
- Calculates subtotal and tax from order items
- New `handleDownloadInvoice()` function
- Hidden invoice component shown only during print
- Print-specific CSS to show only invoice when printing

**Logic:**
```typescript
const orderSource = user?.role === 'reseller' ? 'reseller' : 'customer';
```

### 7. Database Migration
**File:** `migrations/002_add_order_source.sql`

```sql
ALTER TABLE orders
ADD COLUMN order_source VARCHAR(20) NOT NULL DEFAULT 'customer'
CHECK (order_source IN ('customer', 'reseller'));

CREATE INDEX idx_orders_order_source ON orders(order_source);
```

## How It Works

### Order Placement Flow

1. **User Places Order:**
   - User role is checked (customer or reseller)
   - `order_source` is set based on role
   - Order is created via API with source included

2. **Order Storage:**
   - Order is stored in database with `order_source` field
   - Index allows fast filtering by source

3. **Seller Dashboard:**
   - Seller views orders separated by tabs
   - Can switch between customer and reseller orders
   - Statistics update based on active tab

4. **Invoice Generation:**
   - When user downloads invoice, `order_source` is checked
   - If `order_source === 'customer'`, show Enakart branding
   - If `order_source === 'reseller'`, hide branding
   - Invoice is rendered and print dialog opens

### Invoice Branding Logic

```typescript
const showBranding = order.order_source === 'customer';

<InvoiceTemplate
  order={order}
  showBranding={showBranding}
/>
```

## User Experience

### For Customers
- See Enakart branding on all invoices
- Professional branded invoice with logo
- Marketing footer with company info

### For Resellers
- Clean, white-label invoices
- No Enakart branding visible
- Can use as their own invoice to end clients
- Maintains professional appearance

### For Sellers
- Organized dashboard with separate views
- Easy filtering between customer and reseller orders
- Clear statistics for each order type
- Efficient order management

## Testing the Feature

### 1. Test Order Creation
```bash
# As customer
POST /api/orders/create
{
  "user_id": "customer_id",
  "order_source": "customer",
  ...
}

# As reseller
POST /api/orders/create
{
  "user_id": "reseller_id",
  "order_source": "reseller",
  ...
}
```

### 2. Test Seller Dashboard
1. Login as seller
2. Navigate to `/seller/orders`
3. Click "Orders from Customers" tab
4. Verify customer orders display
5. Click "Orders from Resellers" tab
6. Verify reseller orders display
7. Check statistics update correctly

### 3. Test Invoice Branding
1. Place order as customer
2. View order details
3. Click "Download Invoice"
4. Verify Enakart branding is visible

5. Place order as reseller
6. View order details
7. Click "Download Invoice"
8. Verify NO Enakart branding

## File Structure
```
src/
├── types/index.ts (Updated)
├── app/
│   ├── seller/orders/page.tsx (Updated)
│   ├── orders/[id]/page.tsx (Updated)
│   └── api/orders/create/route.ts (Updated)
└── components/
    └── invoice/
        ├── InvoiceTemplate.tsx (New)
        └── PrintableInvoice.tsx (New)

migrations/
└── 002_add_order_source.sql (New)
```

## Future Enhancements

1. **Custom Branding for Resellers:**
   - Allow resellers to upload their own logo
   - Customize invoice colors and footer text

2. **Bulk Invoice Download:**
   - Download multiple invoices at once
   - ZIP file export for resellers

3. **Invoice Templates:**
   - Multiple template options
   - Customizable fields

4. **Analytics:**
   - Revenue breakdown by order source
   - Customer vs reseller performance metrics

5. **Email Invoices:**
   - Automatically email invoices
   - Different templates for customer vs reseller

## Migration Instructions

### Database
Run the migration:
```sql
\i migrations/002_add_order_source.sql
```

### Application
1. No code changes needed - feature is complete
2. Restart the application
3. Verify types are recognized
4. Test order creation and invoice generation

## API Changes

### Order Creation Endpoint
**New Required Field:**
- `order_source`: Must be 'customer' or 'reseller'

**Validation:**
- Returns 400 if order_source is missing
- Returns 400 if order_source is invalid

## Notes

- All customer orders show Enakart branding by default
- All reseller orders hide branding by default
- Branding cannot be changed after order creation
- Order source is determined at creation time based on user role
- Database migration sets default to 'customer' for existing orders

## Support

For questions or issues with this feature:
1. Check order creation logs for validation errors
2. Verify user role is correctly set
3. Ensure order_source field is included in API requests
4. Check invoice template is receiving correct props
