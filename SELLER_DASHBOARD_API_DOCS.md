# Seller Dashboard - Complete API Documentation

## 🎉 Overview

Complete seller dashboard backend is now ready! All APIs are built and integrated with Supabase database.

---

## 📋 Table of Contents

1. [Product Management APIs](#product-management-apis)
2. [Order Management APIs](#order-management-apis)
3. [Inventory APIs](#inventory-apis)
4. [Analytics APIs](#analytics-apis)
5. [Payment/Earnings APIs](#payment-earnings-apis)
6. [Frontend Integration](#frontend-integration)
7. [Testing Guide](#testing-guide)

---

## 🛍️ Product Management APIs

### 1. Get All Products
**Endpoint:** `GET /api/seller/products`

**Headers:**
```json
{
  "x-user-id": "seller-user-id"
}
```

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "id": "uuid",
      "name": "Product Name",
      "description": "Product description",
      "price": 9999,
      "stock_quantity": 50,
      "images": ["url1", "url2"],
      "brand": "Brand Name",
      "categories": {
        "id": "uuid",
        "name": "Eyeglasses",
        "slug": "eyeglasses"
      },
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 2. Get Single Product
**Endpoint:** `GET /api/seller/products/[id]`

**Headers:**
```json
{
  "x-user-id": "seller-user-id"
}
```

**Response:**
```json
{
  "success": true,
  "product": { /* product details */ }
}
```

### 3. Create New Product
**Endpoint:** `POST /api/seller/products`

**Headers:**
```json
{
  "x-user-id": "seller-user-id",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 9999,
  "category_id": "category-uuid",
  "stock_quantity": 50,
  "images": ["image-url-1", "image-url-2"],
  "brand": "Brand Name",
  "frame_material": "Acetate",
  "frame_shape": "Round",
  "lens_type": "Single Vision",
  "gender": "unisex",
  "is_featured": false,
  "is_new": true,
  "is_trending": false
}
```

**Response:**
```json
{
  "success": true,
  "product": { /* created product */ }
}
```

### 4. Update Product
**Endpoint:** `PUT /api/seller/products/[id]`

**Headers:**
```json
{
  "x-user-id": "seller-user-id",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "name": "Updated Name",
  "price": 10999,
  "stock_quantity": 100
  // ... any other fields to update
}
```

**Response:**
```json
{
  "success": true,
  "product": { /* updated product */ }
}
```

### 5. Delete Product
**Endpoint:** `DELETE /api/seller/products/[id]`

**Headers:**
```json
{
  "x-user-id": "seller-user-id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## 📦 Order Management APIs

### 1. Get All Orders
**Endpoint:** `GET /api/seller/orders?status=pending&source=customer`

**Query Parameters:**
- `status` (optional): `pending`, `processing`, `shipped`, `delivered`, `cancelled`
- `source` (optional): `customer`, `reseller`

**Headers:**
```json
{
  "x-user-id": "seller-user-id"
}
```

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "id": "order-uuid",
      "order_number": "ORD-1234567890",
      "total_amount": 15000,
      "status": "pending",
      "order_source": "customer",
      "created_at": "2024-01-01T00:00:00Z",
      "users": {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "mobile_number": "9876543210"
      },
      "order_items": [
        {
          "id": "item-uuid",
          "quantity": 2,
          "price": 7500,
          "product_snapshot": {
            "name": "Product Name",
            "image": "url"
          }
        }
      ]
    }
  ],
  "stats": {
    "total": 100,
    "pending": 10,
    "processing": 20,
    "shipped": 30,
    "delivered": 35,
    "cancelled": 5,
    "totalRevenue": 500000
  }
}
```

### 2. Update Order Status
**Endpoint:** `PUT /api/seller/orders/[id]/status`

**Headers:**
```json
{
  "x-user-id": "seller-user-id",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "status": "shipped",
  "tracking_number": "TRACK123456" // optional, for shipped status
}
```

**Valid Statuses:**
- `pending`
- `processing`
- `shipped`
- `delivered`
- `cancelled`

**Response:**
```json
{
  "success": true,
  "order": { /* updated order */ },
  "message": "Order status updated to shipped"
}
```

---

## 📊 Inventory APIs

### 1. Get Inventory Status
**Endpoint:** `GET /api/seller/inventory?threshold=10`

**Query Parameters:**
- `threshold` (optional, default: 10): Low stock threshold

**Headers:**
```json
{
  "x-user-id": "seller-user-id"
}
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalProducts": 60,
    "inStock": 45,
    "lowStock": 10,
    "outOfStock": 5,
    "totalValue": 500000
  },
  "inventory": {
    "lowStock": [
      {
        "id": "product-uuid",
        "name": "Product Name",
        "stock_quantity": 5,
        "price": 9999,
        "images": ["url"],
        "categories": { "name": "Eyeglasses" }
      }
    ],
    "outOfStock": [ /* products with 0 stock */ ],
    "inStock": [ /* products with stock > threshold */ ]
  },
  "threshold": 10
}
```

### 2. Update Product Stock
**Endpoint:** `PUT /api/seller/inventory/[productId]`

**Headers:**
```json
{
  "x-user-id": "seller-user-id",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "stock_quantity": 50,
  "action": "set" // or "add" or "subtract"
}
```

**Actions:**
- `set`: Set stock to exact value
- `add`: Add to current stock
- `subtract`: Subtract from current stock (minimum 0)

**Response:**
```json
{
  "success": true,
  "product": { /* updated product */ },
  "message": "Stock updated from 30 to 50"
}
```

---

## 📈 Analytics APIs

### 1. Get Analytics Dashboard
**Endpoint:** `GET /api/seller/analytics?period=month`

**Query Parameters:**
- `period` (optional, default: month): `day`, `week`, `month`, `year`

**Headers:**
```json
{
  "x-user-id": "seller-user-id"
}
```

**Response:**
```json
{
  "success": true,
  "analytics": {
    "revenue": {
      "total": 125000,
      "growth": 15.2,
      "avgOrderValue": 3654
    },
    "orders": {
      "total": 342,
      "completed": 300,
      "pending": 20,
      "processing": 15,
      "cancelled": 7
    },
    "products": {
      "total": 60,
      "inStock": 55,
      "outOfStock": 5
    },
    "salesByCategory": {
      "Eyeglasses": 150,
      "Sunglasses": 120,
      "Accessories": 50
    },
    "topProducts": [
      {
        "name": "Product Name",
        "quantity": 50,
        "revenue": 50000
      }
    ],
    "dailySales": {
      "2024-01-01": 5000,
      "2024-01-02": 7000
    },
    "period": "month"
  }
}
```

---

## 💰 Payment/Earnings APIs

### 1. Get Earnings & Payment History
**Endpoint:** `GET /api/seller/payments?period=month`

**Query Parameters:**
- `period` (optional, default: all): `all`, `week`, `month`

**Headers:**
```json
{
  "x-user-id": "seller-user-id"
}
```

**Response:**
```json
{
  "success": true,
  "earnings": {
    "summary": {
      "totalEarnings": 450000,
      "pendingPayouts": 50000,
      "totalTransactions": 300,
      "avgTransactionValue": 1500
    },
    "monthlyEarnings": {
      "2024-01": 50000,
      "2024-02": 75000
    },
    "paymentMethods": {
      "razorpay": {
        "count": 250,
        "amount": 400000
      },
      "cod": {
        "count": 50,
        "amount": 50000
      }
    },
    "recentPayments": [
      {
        "id": "payment-uuid",
        "amount": 15000,
        "payment_method": "razorpay",
        "payment_status": "completed",
        "created_at": "2024-01-01T00:00:00Z",
        "orders": {
          "order_number": "ORD-1234567890",
          "total_amount": 15000,
          "users": {
            "first_name": "John",
            "last_name": "Doe"
          }
        }
      }
    ],
    "period": "month"
  }
}
```

---

## 🎨 Frontend Integration

### Example: Fetch Products in React Component

```tsx
'use client';

import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';

export default function CatalogPage() {
  const { user } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/seller/products', {
        headers: {
          'x-user-id': user?.id || '',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
}
```

### Example: Update Order Status

```tsx
const updateOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    const response = await fetch(`/api/seller/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': user?.id || '',
      },
      body: JSON.stringify({
        status: newStatus,
        tracking_number: 'TRACK123' // if status is shipped
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Order status updated!');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 🧪 Testing Guide

### 1. Test Product Management

```bash
# Start dev server
npm run dev

# Login as seller (you need to have a seller account)
# Go to: http://localhost:3000/seller/catalog

# The catalog page will now show real products from database
# Try:
# - View all products
# - Delete a product
# - Click "Add New Product" (form needs to be created)
```

### 2. Test with cURL

```bash
# Get all products (replace USER_ID with actual seller user ID)
curl -X GET http://localhost:3000/api/seller/products \
  -H "x-user-id: USER_ID"

# Get orders
curl -X GET "http://localhost:3000/api/seller/orders?status=pending" \
  -H "x-user-id: USER_ID"

# Update order status
curl -X PUT http://localhost:3000/api/seller/orders/ORDER_ID/status \
  -H "x-user-id: USER_ID" \
  -H "Content-Type: application/json" \
  -d '{"status": "processing"}'

# Get analytics
curl -X GET "http://localhost:3000/api/seller/analytics?period=month" \
  -H "x-user-id: USER_ID"

# Get inventory
curl -X GET "http://localhost:3000/api/seller/inventory?threshold=10" \
  -H "x-user-id: USER_ID"

# Get earnings
curl -X GET "http://localhost:3000/api/seller/payments?period=month" \
  -H "x-user-id: USER_ID"
```

---

## 📁 File Structure

```
src/app/api/seller/
├── products/
│   ├── route.ts                 # GET all, POST new
│   └── [id]/
│       └── route.ts             # GET, PUT, DELETE single product
├── orders/
│   ├── route.ts                 # GET all orders with filters
│   └── [id]/
│       └── status/
│           └── route.ts         # PUT update order status
├── inventory/
│   ├── route.ts                 # GET inventory status
│   └── [id]/
│       └── route.ts             # PUT update stock
├── analytics/
│   └── route.ts                 # GET analytics dashboard
└── payments/
    └── route.ts                 # GET earnings & payments
```

---

## ✅ What's Complete

### Backend APIs (100% Done):
- ✅ Product CRUD (Create, Read, Update, Delete)
- ✅ Order management with filtering
- ✅ Order status updates
- ✅ Inventory tracking
- ✅ Stock management
- ✅ Analytics dashboard with metrics
- ✅ Earnings & payment history

### Frontend Integration:
- ✅ Catalog page connected to API
- ✅ Real-time product loading
- ✅ Delete product functionality
- 🚧 Orders page (needs API integration)
- 🚧 Analytics page (needs API integration)
- 🚧 Inventory page (needs API integration)
- 🚧 Payments page (needs API integration)
- 🚧 Add/Edit product forms (need to be created)

---

## 🚀 Next Steps

### High Priority:
1. **Create Add/Edit Product Forms**
   - Form validation
   - Image upload functionality
   - Category selection

2. **Integrate Orders Page**
   - Fetch orders from API
   - Add status update UI
   - Filter by status/source

3. **Integrate Analytics Page**
   - Fetch analytics data
   - Display charts
   - Show metrics cards

### Medium Priority:
4. **Integrate Inventory Page**
   - Show low stock alerts
   - Add stock update UI

5. **Integrate Payments Page**
   - Show earnings summary
   - Display payment history

### Lower Priority:
6. **Add Notifications**
   - New order notifications
   - Low stock alerts
   - Payment confirmations

---

## 🎯 Summary

**Seller Dashboard Progress: ~80% Complete**

### What's Working:
- ✅ Complete backend API infrastructure
- ✅ Product management APIs
- ✅ Order management with filtering
- ✅ Inventory tracking
- ✅ Analytics with growth metrics
- ✅ Payment/earnings tracking
- ✅ Catalog page with real data

### What Needs Work:
- 🔨 Add/Edit product forms
- 🔨 Remaining page integrations
- 🔨 Image upload functionality
- 🔨 Charts/graphs for analytics

**The foundation is solid!** All core APIs are built and tested. The remaining work is primarily frontend integration and UI enhancements.

---

## 📞 Support

**API Endpoints:**
- Products: `/api/seller/products`
- Orders: `/api/seller/orders`
- Inventory: `/api/seller/inventory`
- Analytics: `/api/seller/analytics`
- Payments: `/api/seller/payments`

**All APIs require:**
- Header: `x-user-id` with seller's user ID
- User must have `role: 'seller'` in database

**Happy Selling!** 🚀
