// src/store/sellerAdminStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SellerAdminState {
  isAdminMode: boolean;
  toggleAdminMode: () => void;
  setAdminMode: (mode: boolean) => void;
}

export const useSellerAdminStore = create<SellerAdminState>()(
  persist(
    (set) => ({
      isAdminMode: false,
      toggleAdminMode: () => set((state) => ({ isAdminMode: !state.isAdminMode })),
      setAdminMode: (mode) => set({ isAdminMode: mode }),
    }),
    {
      name: 'seller-admin-storage',
    }
  )
);
