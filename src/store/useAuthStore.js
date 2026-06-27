// ============================================
// AUTH STORE — Zustand user session state
// ============================================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await authAPI.login({ email, password });
          localStorage.setItem('laurea_token', data.token);
          set({ user: data.user, token: data.token, isLoading: false });
          toast.success(`Welcome back, ${data.user.firstName}!`);
          return data;
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      register: async (formData) => {
        set({ isLoading: true });
        try {
          const { data } = await authAPI.register(formData);
          localStorage.setItem('laurea_token', data.token);
          set({ user: data.user, token: data.token, isLoading: false });
          toast.success(`Welcome to Laurea, ${data.user.firstName}!`);
          return data;
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      logout: async () => {
        try { await authAPI.logout(); } catch (_) {}
        localStorage.removeItem('laurea_token');
        set({ user: null, token: null });
        toast.success('Logged out.');
      },

      fetchMe: async () => {
        try {
          const { data } = await authAPI.me();
          set({ user: data.user });
        } catch (_) {
          set({ user: null, token: null });
        }
      },

      isAuthenticated: () => !!get().token,
      isAdmin: () => get().user?.role === 'admin' || get().user?.role === 'superadmin',
    }),
    { name: 'laurea-auth', partialize: (s) => ({ user: s.user, token: s.token }) }
  )
);

export default useAuthStore;
