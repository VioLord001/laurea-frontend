'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try { await login(form.email, form.password); router.push('/account'); }
    catch (err) { setError(err.response?.data?.message || 'Login failed.'); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 py-12 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif font-light">Welcome back</h1>
          <p className="text-sm text-stone-500 mt-1">Sign in to your Laurea account</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white border border-stone-200 p-8 space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2">{error}</div>}
          <div><label className="text-[10px] tracking-widest uppercase text-stone-500 block mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="input-field" required /></div>
          <div><label className="text-[10px] tracking-widest uppercase text-stone-500 block mb-1.5">Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} className="input-field" required /></div>
          <div className="flex justify-end"><Link href="/auth/forgot-password" className="text-[10px] text-gold hover:underline">Forgot password?</Link></div>
          <button type="submit" disabled={isLoading} className="btn-primary w-full disabled:opacity-50">{isLoading ? 'Signing in...' : 'Sign in'}</button>
        </form>
        <p className="text-center text-sm text-stone-500 mt-6">New to Laurea?{' '}<Link href="/auth/register" className="text-gold hover:underline">Create an account</Link></p>
      </div>
    </div>
  );
}
