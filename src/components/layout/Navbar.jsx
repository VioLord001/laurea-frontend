'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag, Heart, User, Search, Menu, X } from 'lucide-react';
import useCartStore from '@/store/useCartStore';
import useAuthStore from '@/store/useAuthStore';

const DEPARTMENTS = [
  { name: 'Women', href: '/women' },
  { name: 'Men', href: '/men' },
  { name: 'Kids', href: '/kids' },
  { name: 'Bags', href: '/bags' },
  { name: 'Jewellery', href: '/jewelry' },
  { name: 'Shoes', href: '/shoes' },
  { name: 'Beauty', href: '/beauty' },
  { name: 'Home & Living', href: '/home' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const itemCount = useCartStore((s) => s.getItemCount());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const { user, isAuthenticated } = useAuthStore();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-gold py-2 px-4 text-center text-xs tracking-widest uppercase text-dark">
        Free shipping on orders over $30 &nbsp;·&nbsp; Use code LAUREA20 for 20% off
      </div>

      <header className="bg-white border-b border-stone-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-16 gap-4">

            {/* Mobile menu button */}
            <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 text-center">
              <div className="text-lg font-semibold tracking-[0.3em] text-stone-900 uppercase">Laurea</div>
              <div className="text-[8px] tracking-[0.4em] text-gold uppercase">Fashion House</div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex flex-1 justify-center gap-1">
              {DEPARTMENTS.map((dept) => (
                <Link key={dept.name} href={dept.href}
                  className="px-3 py-1.5 text-[10px] tracking-widest uppercase text-stone-500 hover:text-stone-900 transition-colors whitespace-nowrap border-b-2 border-transparent hover:border-gold">
                  {dept.name}
                </Link>
              ))}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-2 ml-auto">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center border-b border-stone-300">
                  <input autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..." className="text-sm outline-none w-36 py-1 bg-transparent" />
                  <button type="button" onClick={() => setSearchOpen(false)} className="p-1"><X size={14} /></button>
                </form>
              ) : (
                <button onClick={() => setSearchOpen(true)} className="p-2 text-stone-600 hover:text-stone-900" aria-label="Search">
                  <Search size={18} />
                </button>
              )}

              <Link href="/account/wishlist" className="p-2 text-stone-600 hover:text-stone-900" aria-label="Wishlist">
                <Heart size={18} />
              </Link>

              <button onClick={toggleCart} className="p-2 text-stone-600 hover:text-stone-900 relative" aria-label="Shopping bag">
                <ShoppingBag size={18} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gold text-white text-[9px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>

              <Link href={isAuthenticated() ? '/account' : '/auth/login'}
                className="p-2 text-stone-600 hover:text-stone-900" aria-label="Account">
                <User size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-stone-100 bg-white">
            <nav className="flex flex-col py-2">
              {DEPARTMENTS.map((dept) => (
                <Link key={dept.name} href={dept.href} onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm tracking-wider uppercase text-stone-600 hover:bg-stone-50 hover:text-stone-900">
                  {dept.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
