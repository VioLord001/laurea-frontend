import { create } from 'zustand';
import { persist } from 'zustand/middleware';
const useAuthStore = create(persist((set, get) => ({
  user: null, token: null, isLoading: false,
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      localStorage.setItem('laurea_token', data.token);
      set({ user: data.user, token: data.token, isLoading: false });
      return data;
    } catch (err) { set({ isLoading: false }); throw err; }
  },
  register: async (formData) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      localStorage.setItem('laurea_token', data.token);
      set({ user: data.user, token: data.token, isLoading: false });
      return data;
    } catch (err) { set({ isLoading: false }); throw err; }
  },
  logout: () => { localStorage.removeItem('laurea_token'); set({ user: null, token: null }); },
  isAuthenticated: () => !!get().token,
  isAdmin: () => get().user?.role === 'admin',
}), { name: 'laurea-auth', partialize: (s) => ({ user: s.user, token: s.token }) }));
export default useAuthStore; 
