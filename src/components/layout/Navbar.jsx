'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('laurea_user');
    if (stored) setUser(JSON.parse(stored));
    updateCart();
    window.addEventListener('cartUpdated', updateCart);
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener('resize', check);
    return () => {
      window.removeEventListener('cartUpdated', updateCart);
      window.removeEventListener('resize', check);
    };
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
    setMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMenuOpen(false);
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
        Free delivery on orders over $30 · Use code <strong>LAUREA20</strong> for 20% off
      </div>

      {/* Main navbar */}
      <nav style={{background:'#1c1208',position:'sticky',top:0,zIndex:1000,borderBottom:'1px solid rgba(245,237,224,0.1)'}}>
        <div style={{width:'100%',padding:'0 1rem',display:'flex',alignItems:'center',justifyContent:'space-between',height:'56px'}}>

          {/* Logo */}
          <Link href="/" style={{textDecoration:'none',flexShrink:0}} onClick={()=>setMenuOpen(false)}>
            <div style={{color:'#f5ede0',fontSize:'14px',fontWeight:'600',letterSpacing:'4px',textTransform:'uppercase',lineHeight:'1'}}>Laurea</div>
            <div style={{color:'#b8966a',fontSize:'7px',letterSpacing:'4px',textTransform:'uppercase',marginTop:'2px'}}>Fashion House</div>
          </Link>

          {/* Desktop links */}
          {!isMobile && (
            <div style={{display:'flex',alignItems:'center',gap:'18px'}}>
              {departments.map(dept => (
                <Link key={dept.name} href={dept.href}
                  style={{textDecoration:'none',fontSize:'11px',fontWeight:'500',color:'rgba(245,237,224,0.7)',letterSpacing:'1px',textTransform:'uppercase',whiteSpace:'nowrap'}}
                  onMouseEnter={e=>e.target.style.color='#b8966a'}
                  onMouseLeave={e=>e.target.style.color='rgba(245,237,224,0.7)'}>
                  {dept.name}
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>

            {/* Search — desktop only */}
            {!isMobile && (
              <button onClick={()=>setSearchOpen(!searchOpen)}
                style={{background:'none',border:'none',cursor:'pointer',color:'rgba(245,237,224,0.7)',fontSize:'18px',padding:'4px'}}>
                🔍
              </button>
            )}

            {/* Account — desktop only */}
            {!isMobile && (
              user ? (
                <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                  <Link href={user.role==='admin'?'/admin/dashboard':'/account'}
                    style={{textDecoration:'none',fontSize:'11px',color:'rgba(245,237,224,0.7)',fontWeight:'500'}}>
                    👤 {user.first_name}
                  </Link>
                  <button onClick={handleLogout}
                    style={{background:'none',border:'none',fontSize:'11px',color:'rgba(245,237,224,0.4)',cursor:'pointer',textDecoration:'underline'}}>
                    Logout
                  </button>
                </div>
              ) : (
                <Link href="/auth/login"
                  style={{textDecoration:'none',fontSize:'11px',color:'rgba(245,237,224,0.7)',fontWeight:'500',letterSpacing:'1px',textTransform:'uppercase'}}>
                  👤 Login
                </Link>
              )
            )}

            {/* Cart button */}
            <Link href="/cart" style={{textDecoration:'none',position:'relative',display:'flex',alignItems:'center',gap:'6px',background:'#b8966a',color:'#1c1208',padding:isMobile?'8px 14px':'10px 20px',borderRadius:'6px',fontSize:isMobile?'12px':'14px',fontWeight:'700',letterSpacing:'1px',textTransform:'uppercase'}}>
              🛒 {!isMobile && 'Bag'}
              {cartCount > 0 && (
                <span style={{position:'absolute',top:'-8px',right:'-8px',background:'#f5ede0',color:'#1c1208',borderRadius:'50%',width:'20px',height:'20px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:'700',border:'2px solid #1c1208'}}>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Hamburger — mobile only */}
            {isMobile && (
              <button onClick={()=>setMenuOpen(!menuOpen)}
                style={{background:'none',border:'none',cursor:'pointer',color:'#f5ede0',fontSize:'22px',padding:'4px',lineHeight:1}}>
                {menuOpen ? '✕' : '☰'}
              </button>
            )}

          </div>
        </div>

        {/* Search dropdown — desktop */}
        {!isMobile && searchOpen && (
          <div style={{borderTop:'1px solid rgba(245,237,224,0.1)',padding:'12px 2rem',background:'#2d1f0a'}}>
            <form onSubmit={handleSearch} style={{maxWidth:'600px',margin:'0 auto',display:'flex',gap:'8px'}}>
              <input
                value={searchQuery}
                onChange={e=>setSearchQuery(e.target.value)}
                placeholder="Search products..."
                autoFocus
                style={{flex:1,border:'1px solid rgba(245,237,224,0.2)',padding:'10px 14px',fontSize:'13px',color:'#f5ede0',outline:'none',borderRadius:'6px',background:'rgba(245,237,224,0.05)'}}
              />
              <button type="submit" style={{background:'#b8966a',color:'#1c1208',border:'none',padding:'10px 20px',fontSize:'12px',fontWeight:'600',cursor:'pointer',borderRadius:'6px'}}>
                Search
              </button>
              <button type="button" onClick={()=>setSearchOpen(false)} style={{background:'none',border:'1px solid rgba(245,237,224,0.2)',padding:'10px 14px',fontSize:'12px',cursor:'pointer',borderRadius:'6px',color:'rgba(245,237,224,0.6)'}}>
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Mobile menu dropdown */}
        {isMobile && menuOpen && (
          <div style={{background:'#2d1f0a',borderTop:'1px solid rgba(245,237,224,0.1)',padding:'1rem'}}>

            {/* Mobile search */}
            <form onSubmit={handleSearch} style={{display:'flex',gap:'8px',marginBottom:'1rem'}}>
              <input
                value={searchQuery}
                onChange={e=>setSearchQuery(e.target.value)}
                placeholder="Search products..."
                style={{flex:1,border:'1px solid rgba(245,237,224,0.2)',padding:'10px 12px',fontSize:'13px',color:'#f5ede0',outline:'none',borderRadius:'6px',background:'rgba(245,237,224,0.05)'}}
              />
              <button type="submit" style={{background:'#b8966a',color:'#1c1208',border:'none',padding:'10px 16px',fontSize:'12px',fontWeight:'600',cursor:'pointer',borderRadius:'6px'}}>
                🔍
              </button>
            </form>

            {/* Mobile department links */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'1rem'}}>
              {departments.map(dept => (
                <Link key={dept.name} href={dept.href} onClick={()=>setMenuOpen(false)}
                  style={{textDecoration:'none',fontSize:'13px',fontWeight:'500',color:'rgba(245,237,224,0.8)',letterSpacing:'1px',textTransform:'uppercase',padding:'10px 12px',background:'rgba(245,237,224,0.05)',borderRadius:'6px',border:'1px solid rgba(245,237,224,0.1)'}}>
                  {dept.name}
                </Link>
              ))}
            </div>

            {/* Mobile account */}
            <div style={{borderTop:'1px solid rgba(245,237,224,0.1)',paddingTop:'1rem',display:'flex',gap:'10px'}}>
              {user ? (
                <>
                  <Link href={user.role==='admin'?'/admin/dashboard':'/account'} onClick={()=>setMenuOpen(false)}
                    style={{textDecoration:'none',fontSize:'13px',color:'rgba(245,237,224,0.7)',flex:1,padding:'10px',background:'rgba(245,237,224,0.05)',borderRadius:'6px',textAlign:'center'}}>
                    👤 {user.first_name}
                  </Link>
                  <button onClick={handleLogout}
                    style={{background:'rgba(245,237,224,0.05)',border:'1px solid rgba(245,237,224,0.1)',fontSize:'13px',color:'rgba(245,237,224,0.5)',cursor:'pointer',padding:'10px',borderRadius:'6px',flex:1}}>
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/auth/login" onClick={()=>setMenuOpen(false)}
                  style={{textDecoration:'none',fontSize:'13px',color:'#f5ede0',flex:1,padding:'10px',background:'#b8966a',borderRadius:'6px',textAlign:'center',fontWeight:'600',color:'#1c1208'}}>
                  👤 Login
                </Link>
              )}
            </div>

          </div>
        )}
      </nav>
    </>
  );
}