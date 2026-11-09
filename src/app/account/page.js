'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';

export default function AccountPage() {
  const { user, token } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (!token) router.push('/auth/login'); }, [token, router]);
  if (!user) return null;
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-serif font-light mb-2">My Account</h1>
      <p className="text-stone-500 text-sm mb-8">Welcome back, {user.firstName} {user.lastName}</p>
      <div className="border border-stone-200 p-6 space-y-3">
        <p className="text-sm"><span className="text-[10px] tracking-widest uppercase text-stone-400 block mb-1">Email</span>{user.email}</p>
        <p className="text-sm"><span className="text-[10px] tracking-widest uppercase text-stone-400 block mb-1">Role</span>{user.role}</p>
      </div>
    </div>
  );
}
