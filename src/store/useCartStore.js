// ============================================
// CART STORE — Zustand global state
// ============================================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      addItem: (product, variant = {}) => {
        const { items } = get();
        const key = `${product.id}-${variant.size || ''}-${variant.color || ''}`;
        const existing = items.find((i) => i.key === key);

        if (existing) {
          set({ items: items.map((i) => i.key === key ? { ...i, quantity: i.quantity + 1 } : i) });
        } else {
          set({ items: [...items, { key, product, variant, quantity: 1 }] });
        }
        toast.success(`${product.name} added to bag`);
      },

      removeItem: (key) => {
        set((s) => ({ items: s.items.filter((i) => i.key !== key) }));
      },

      updateQuantity: (key, quantity) => {
        if (quantity <= 0) {
          get().removeItem(key);
          return;
        }
        set((s) => ({ items: s.items.map((i) => i.key === key ? { ...i, quantity } : i) }));
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () => get().items.reduce((sum, i) => sum + parseFloat(i.product.price) * i.quantity, 0),
      getTotal: () => {
        const subtotal = get().getSubtotal();
        const shipping = subtotal >= 30 ? 0 : 4.99;
        return subtotal + shipping;
      },
      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'laurea-cart', partialize: (s) => ({ items: s.items }) }
  )
);

export default useCartStore;
