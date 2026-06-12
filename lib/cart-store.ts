"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductCardData } from "@/components/product-card";

export interface CartItem {
  product: ProductCardData;
  quantity: number;
  selectedSize: string; // e.g., "250ml", "500ml", "1L"
  price: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: ProductCardData, quantity: number, size: string, price: number) => void;
  removeItem: (slug: string, size: string) => void;
  updateQuantity: (slug: string, size: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, quantity, size, price) =>
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.product.slug === product.slug &&
              item.selectedSize === size
          );
          if (existingIndex > -1) {
            const newItems = [...state.items];
            newItems[existingIndex].quantity += quantity;
            return { items: newItems };
          }
          return {
            items: [
              ...state.items,
              { product, quantity, selectedSize: size, price },
            ],
          };
        }),
      removeItem: (slug, size) =>
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.product.slug === slug && item.selectedSize === size)
          ),
        })),
      updateQuantity: (slug, size, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.product.slug === slug && item.selectedSize === size
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "chekku-oil-cart",
    }
  )
);
