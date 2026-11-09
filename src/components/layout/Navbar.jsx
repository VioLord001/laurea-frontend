'use client';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Heart, User, Search, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useCartStore from '@/store/useCartStore';
import useAuthStore from '@/store/useAuthStore';

const DEPARTMENTS = [
  { name: 'Home', href: '/' },
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
  const [accountOpen, setAccountOpen] = useState(false);
  const dropdownRef = useRef(null);
  const itemCount = useCartStore((s) => s.getItemCount());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const { user, token, logout } = useAuthStore();
  const router = useRouter();

  const isLoggedIn = !!token;
  const isStaff = user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'employee';

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
  };

  const handleLogout = async () => {
    setAccountOpen(false);
    await logout();
    router.push('/');
  };

  const getDashboardHref = () => {
    if (user?.role === 'admin' || user?.role === 'superadmin') return '/admin/dashboard';
    if (user?.role === 'employee') return '/employee/dashboard';
    return null;
  };

  return (
    <>
      <header className="bg-white border-b border-stone-100 sticky top-0 z-50">
        <div className="w-full px-3 md:px-6">
          <div className="flex items-center h-16 gap-4">

            <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <Link href="/" className="flex-shrink-0 text-center">
              <div className="text-lg font-semibold tracking-[0.3em] text-stone-900 uppercase">Laurea</div>
              <div className="text-[8px] tracking-[0.4em] text-gold uppercase">Fashion House</div>
            </Link>

            <nav className="hidden lg:flex flex-1 justify-center gap-1">
              {DEPARTMENTS.map((dept) => (
                <Link key={dept.name} href={dept.href}
                  className="px-3 py-1.5 text-[10px] tracking-widest uppercase text-stone-500 hover:text-stone-900 transition-colors whitespace-nowrap border-b-2 border-transparent hover:border-gold">
                  {dept.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 ml-auto">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center border-b border-stone-300">
                  <input autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..." className="text-sm outline-none w-36 py-1 bg-transparent" />
                  <button type="button" onClick={() => setSearchOpen(false)} className="p-1"><X size={14} /></button>
                </form>
              ) : (
                <button onClick={() => setSearchOpen(true)} className="p-2 text-stone-600 hover:text-stone-900" aria-label="Search">
                  <Search size={16} className="md:w-[18px] md:h-[18px]" />
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

              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setAccountOpen(!accountOpen)}
                  className="p-2 text-stone-600 hover:text-stone-900" aria-label="Account">
                  <User size={18} />
                </button>

                {accountOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-stone-200 shadow-lg z-50">
                    {isLoggedIn ? (
                      <>
                        <div className="px-4 py-3 border-b border-stone-100">
                          <p className="text-xs text-stone-500">Signed in as</p>
                          <p className="text-sm font-medium text-stone-900 truncate">{user?.firstName} {user?.lastName}</p>
                        </div>
                        {isStaff && (
                          <Link href={getDashboardHref()} onClick={() => setAccountOpen(false)}
                            className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50">
                            My Dashboard
                          </Link>
                        )}
                        {!isStaff && (
                          <Link href="/account/orders" onClick={() => setAccountOpen(false)}
                            className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50">
                            My Orders
                          </Link>
                        )}
                        <button onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-stone-50 border-t border-stone-100">
                          Sign out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/auth/login" onClick={() => setAccountOpen(false)}
                          className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50">
                          Sign in
                        </Link>
                        <Link href="/auth/register" onClick={() => setAccountOpen(false)}
                          className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 border-t border-stone-100">
                          Create account
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

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
