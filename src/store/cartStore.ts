// src/store/cartStore.ts

import { create } from 'zustand';
import { Product, CartItem, LensChoice, LensPrescription } from '@/types';

interface CartStore {
  items: CartItem[];
  loading: boolean;
  error: string | null;

  // Core actions
  fetchCart: () => Promise<void>;
  addItem: (product: Product, quantity?: number, prescriptionFile?: string) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;

  // Utility methods
  getTotal: () => number;
  getItemCount: () => number;

  // Lens related
  addLensToItem: (productId: string, lens: Product) => void;
  setLensChoice: (productId: string, choice: LensChoice) => void;
  setLensPrescription: (productId: string, prescription: LensPrescription) => void;
}

// Helper to get user ID from auth
const getUserId = (): string | null => {
  if (typeof window === 'undefined') return null;

  // Get from auth store or session storage
  const authData = localStorage.getItem('auth-storage');
  if (authData) {
    try {
      const parsed = JSON.parse(authData);
      return parsed.state?.user?.id || null;
    } catch {
      return null;
    }
  }
  return null;
};

export const useCartStore = create<CartStore>()((set, get) => ({
  items: [],
  loading: false,
  error: null,

  // Fetch cart from database
  fetchCart: async () => {
    const userId = getUserId();
    if (!userId) {
      set({ items: [], loading: false });
      return;
    }

    set({ loading: true, error: null });

    try {
      const response = await fetch('/api/cart', {
        headers: {
          'x-user-id': userId,
        },
      });

      const data = await response.json();

      if (data.success && data.cart) {
        // Transform API response to CartItem format
        const items: CartItem[] = data.cart.items.map((item: any) => ({
          product: {
            id: item.product_id,
            name: item.product?.name || '',
            price: item.price,
            images: item.product?.images || [],
            category: item.product?.category || '',
            brand: item.product?.brand || '',
            description: item.product?.description || '',
            stock_quantity: item.product?.stock_quantity || 0,
            is_featured: item.product?.is_featured || false,
            frame_color: item.product?.frame_color || '',
            gender: item.product?.gender || 'unisex',
          },
          quantity: item.quantity,
          lens: item.lens_type ? {
            id: 'lens-' + item.lens_type,
            name: item.lens_type,
            price: item.lens_price || 0,
            category: 'lens',
            images: [],
            brand: '',
            description: '',
            stock_quantity: 999,
            is_featured: false,
            frame_color: '',
            gender: 'unisex',
          } : undefined,
          lensChoice: item.lens_type ? 'with-lens' : undefined,
          lensPrescription: item.lens_prescription || undefined,
          prescription_file: undefined,
        }));

        set({ items, loading: false });
      } else {
        set({ items: [], loading: false });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      set({ error: 'Failed to fetch cart', loading: false });
    }
  },

  // Add item to cart
  addItem: async (product, quantity = 1, prescriptionFile) => {
    const userId = getUserId();
    if (!userId) {
      alert('Please login to add items to cart');
      return;
    }

    set({ loading: true, error: null });

    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity,
          price: product.price,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh cart from server
        await get().fetchCart();
      } else {
        set({ error: data.error || 'Failed to add item', loading: false });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      set({ error: 'Failed to add item to cart', loading: false });
    }
  },

  // Remove item from cart
  removeItem: async (productId) => {
    const userId = getUserId();
    if (!userId) return;

    set({ loading: true, error: null });

    try {
      const response = await fetch('/api/cart/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({
          product_id: productId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh cart from server
        await get().fetchCart();
      } else {
        set({ error: data.error || 'Failed to remove item', loading: false });
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      set({ error: 'Failed to remove item', loading: false });
    }
  },

  // Update item quantity
  updateQuantity: async (productId, quantity) => {
    const userId = getUserId();
    if (!userId) return;

    if (quantity <= 0) {
      await get().removeItem(productId);
      return;
    }

    set({ loading: true, error: null });

    try {
      const response = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({
          product_id: productId,
          quantity,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh cart from server
        await get().fetchCart();
      } else {
        set({ error: data.error || 'Failed to update quantity', loading: false });
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      set({ error: 'Failed to update quantity', loading: false });
    }
  },

  // Clear cart
  clearCart: async () => {
    const userId = getUserId();
    if (!userId) return;

    set({ loading: true, error: null });

    try {
      // Remove all items one by one
      const items = get().items;
      for (const item of items) {
        await fetch('/api/cart/remove', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId,
          },
          body: JSON.stringify({
            product_id: item.product.id,
          }),
        });
      }

      set({ items: [], loading: false });
    } catch (error) {
      console.error('Error clearing cart:', error);
      set({ error: 'Failed to clear cart', loading: false });
    }
  },

  // Get cart total
  getTotal: () => {
    const items = get().items;
    return items.reduce((total, item) => {
      const productTotal = item.product.price * item.quantity;
      const lensTotal = item.lens ? item.lens.price * item.quantity : 0;
      return total + productTotal + lensTotal;
    }, 0);
  },

  // Get item count
  getItemCount: () => {
    const items = get().items;
    return items.reduce((count, item) => count + item.quantity, 0);
  },

  // Add lens to item (local state for now, will sync on checkout)
  addLensToItem: (productId, lens) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId ? { ...item, lens, lensChoice: 'with-lens' } : item
      ),
    }));
  },

  // Set lens choice (local state)
  setLensChoice: (productId, choice) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId ? { ...item, lensChoice: choice } : item
      ),
    }));
  },

  // Set lens prescription (local state)
  setLensPrescription: (productId, prescription) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId ? { ...item, lensPrescription: prescription } : item
      ),
    }));
  },
}));
