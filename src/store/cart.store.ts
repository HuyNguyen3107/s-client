import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OrderData } from "../features/order/types/order.types";

export interface CartItem {
  id: string; // unique id for cart item
  orderData: OrderData;
  customerInfo?: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    note?: string;
  };
  shippingFee: number;
  selectedShippingId?: string;
  appliedPromotionCode?: string;
  discount: number;
  subtotal: number; // total before shipping and discount
  total: number; // final total
  createdAt: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id" | "createdAt">) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const newItem: CartItem = {
          ...item,
          id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          items: [...state.items, newItem],
        }));
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateItem: (id, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getItemCount: () => {
        return get().items.length;
      },

      getTotalAmount: () => {
        return get().items.reduce((sum, item) => sum + item.total, 0);
      },
    }),
    {
      name: "soligant-cart-storage", // localStorage key
    }
  )
);
