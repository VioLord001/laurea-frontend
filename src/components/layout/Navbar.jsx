'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('laurea_user');
    if (stored) setUser(JSON.parse(stored));
    updateCart();
    window.addEventListener('cartUpdated', updateCart);
    return () => window.removeEventListener('cartUpdated', updateCart);
  }, []);

  const updateCart = () => {
    const cart = JSON.parse(localStorage.getItem('laurea_cart') || '[]');
    setCartCount(cart.length);
  };

  const handleLogout = () => {
    localStorage.removeItem('laurea_token');
    localStorage.removeItem('laurea_user');
    setUser(null);
    router.push('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const departments = [
    { name:'Women', href:'/women' },
    { name:'Men', href:'/men' },
    { name:'Kids', href:'/kids' },
    { name:'Bags', href:'/bags' },
    { name:'Jewellery', href:'/jewelry' },
    { name:'Shoes', href:'/shoes' },
    { name:'Beauty', href:'/beauty' },
    { name:'Home', href:'/home' },
  ];

  return (
    <>
      {/* Promo bar */}
      <div style={{background:'#b8966a',color:'#1c1208',textAlign:'center',padding:'7px',fontSize:'11px',letterSpacing:'1px',fontWeight:'500'}}>
        Free delivery on orders over $30 · Use code <strong>LAUREA20</strong> for 20% off your first order
      </div>

      {/* Main navbar */}
      <nav style={{background:'#1c1208',position:'sticky',top:0,zIndex:1000,borderBottom:'1px solid rgba(245,237,224,0.1)'}}>
        <div style={{width:'100%',padding:'0',display:'flex',alignItems:'center',justifyContent:'space-between',height:'60px'}}>

          {/* Logo — flush left edge */}
          <Link href="/" style={{textDecoration:'none',flexShrink:0,paddingLeft:'1.5rem'}}>
            <div style={{color:'#f5ede0',fontSize:'15px',fontWeight:'600',letterSpacing:'4px',textTransform:'uppercase',lineHeight:'1'}}>Laurea</div>
            <div style={{color:'#b8966a',fontSize:'7px',letterSpacing:'4px',textTransform:'uppercase',marginTop:'2px'}}>Fashion House</div>
          </Link>

          {/* Everything flush right edge */}
          <div style={{display:'flex',alignItems:'center',gap:'18px',paddingRight:'1.5rem'}}>

            {/* Department links */}
            {departments.map(dept => (
              <Link key={dept.name} href={dept.href}
                style={{textDecoration:'none',fontSize:'11px',fontWeight:'500',color:'rgba(245,237,224,0.7)',letterSpacing:'1px',textTransform:'uppercase',transition:'color 0.15s',whiteSpace:'nowrap'}}
                onMouseEnter={e=>e.target.style.color='#b8966a'}
                onMouseLeave={e=>e.target.style.color='rgba(245,237,224,0.7)'}>
                {dept.name}
              </Link>
            ))}

            {/* Divider */}
            <div style={{width:'1px',height:'20px',background:'rgba(245,237,224,0.15)',flexShrink:0}} />

            {/* Search */}
            <button onClick={()=>setSearchOpen(!searchOpen)}
              style={{background:'none',border:'none',cursor:'pointer',color:'rgba(245,237,224,0.7)',fontSize:'18px',padding:'4px',transition:'color 0.15s',flexShrink:0}}
              onMouseEnter={e=>e.currentTarget.style.color='#b8966a'}
              onMouseLeave={e=>e.currentTarget.style.color='rgba(245,237,224,0.7)'}>
              🔍
            </button>

            {/* Account */}
            {user ? (
              <div style={{display:'flex',alignItems:'center',gap:'10px',flexShrink:0}}>
                <Link href={user.role==='admin'?'/admin/dashboard':'/account'}
                  style={{textDecoration:'none',fontSize:'11px',color:'rgba(245,237,224,0.7)',fontWeight:'500',transition:'color 0.15s',whiteSpace:'nowrap'}}
                  onMouseEnter={e=>e.target.style.color='#b8966a'}
                  onMouseLeave={e=>e.target.style.color='rgba(245,237,224,0.7)'}>
                  👤 {user.first_name}
                </Link>
                <button onClick={handleLogout}
                  style={{background:'none',border:'none',fontSize:'11px',color:'rgba(245,237,224,0.4)',cursor:'pointer',textDecoration:'underline',whiteSpace:'nowrap'}}>
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/auth/login"
                style={{textDecoration:'none',fontSize:'11px',color:'rgba(245,237,224,0.7)',fontWeight:'500',letterSpacing:'1px',textTransform:'uppercase',transition:'color 0.15s',whiteSpace:'nowrap',flexShrink:0}}
                onMouseEnter={e=>e.target.style.color='#b8966a'}
                onMouseLeave={e=>e.target.style.color='rgba(245,237,224,0.7)'}>
                👤 Login
              </Link>
            )}

            {/* Cart button */}
            <Link href="/cart" style={{textDecoration:'none',position:'relative',display:'flex',alignItems:'center',gap:'8px',background:'#b8966a',color:'#1c1208',padding:'10px 22px',borderRadius:'6px',fontSize:'14px',fontWeight:'700',letterSpacing:'1px',textTransform:'uppercase',transition:'background 0.15s',flexShrink:0}}
              onMouseEnter={e=>e.currentTarget.style.background='#a07858'}
              onMouseLeave={e=>e.currentTarget.style.background='#b8966a'}>
              🛒 Bag
              {cartCount > 0 && (
                <span style={{position:'absolute',top:'-8px',right:'-8px',background:'#f5ede0',color:'#1c1208',borderRadius:'50%',width:'22px',height:'22px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:'700',border:'2px solid #1c1208'}}>
                  {cartCount}
                </span>
              )}
            </Link>

          </div>
        </div>

        {/* Search dropdown */}
        {searchOpen && (
          <div style={{borderTop:'1px solid rgba(245,237,224,0.1)',padding:'12px 2rem',background:'#2d1f0a'}}>
            <form onSubmit={handleSearch} style={{maxWidth:'600px',margin:'0 auto',display:'flex',gap:'8px'}}>
              <input
                value={searchQuery}
                onChange={e=>setSearchQuery(e.target.value)}
                placeholder="Search for products, brands, categories..."
                autoFocus
                style={{flex:1,border:'1px solid rgba(245,237,224,0.2)',padding:'10px 14px',fontSize:'13px',color:'#f5ede0',outline:'none',borderRadius:'6px',background:'rgba(245,237,224,0.05)'}}
              />
              <button type="submit"
                style={{background:'#b8966a',color:'#1c1208',border:'none',padding:'10px 20px',fontSize:'12px',fontWeight:'600',cursor:'pointer',borderRadius:'6px',letterSpacing:'1px',textTransform:'uppercase'}}>
                Search
              </button>
              <button type="button" onClick={()=>setSearchOpen(false)}
                style={{background:'none',border:'1px solid rgba(245,237,224,0.2)',padding:'10px 14px',fontSize:'12px',cursor:'pointer',borderRadius:'6px',color:'rgba(245,237,224,0.6)'}}>
                Cancel
              </button>
            </form>
          </div>
        )}
      </nav>
    </>
  );
}