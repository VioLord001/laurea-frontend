'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { register: registerUser, isLoading } = useAuthStore();
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    try { await registerUser(form); router.push('/account'); }
    catch (err) { setError(err.response?.data?.message || 'Registration failed.'); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 py-12 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif font-light">Create your account</h1>
          <p className="text-sm text-stone-500 mt-1">Join the Laurea community</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white border border-stone-200 p-8 space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2">{error}</div>}
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[10px] tracking-widest uppercase text-stone-500 block mb-1.5">First name</label>
              <input type="text" value={form.firstName} onChange={(e) => setForm({...form, firstName: e.target.value})} className="input-field" required /></div>
            <div><label className="text-[10px] tracking-widest uppercase text-stone-500 block mb-1.5">Last name</label>
              <input type="text" value={form.lastName} onChange={(e) => setForm({...form, lastName: e.target.value})} className="input-field" required /></div>
          </div>
          <div><label className="text-[10px] tracking-widest uppercase text-stone-500 block mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="input-field" required /></div>
          <div><label className="text-[10px] tracking-widest uppercase text-stone-500 block mb-1.5">Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} className="input-field" placeholder="Min 8 characters" required /></div>
          <button type="submit" disabled={isLoading} className="btn-primary w-full disabled:opacity-50">{isLoading ? 'Creating...' : 'Create account'}</button>
        </form>
        <p className="text-center text-sm text-stone-500 mt-6">Already have an account?{' '}<Link href="/auth/login" className="text-gold hover:underline">Sign in</Link></p>
      </div>
    </div>
  );
}
