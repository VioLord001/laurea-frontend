'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const { t, lang, changeLang } = useLanguage();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem('laurea_cart') || '[]');
      setCartCount(cart.length);
    };
    updateCart();
    window.addEventListener('cartUpdated', updateCart);
    return () => window.removeEventListener('cartUpdated', updateCart);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('laurea_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('laurea_token');
    localStorage.removeItem('laurea_user');
    setUser(null);
    router.push('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { href:'/women', label:t('women') },
    { href:'/men', label:t('men') },
    { href:'/kids', label:t('kids') },
    { href:'/bags', label:t('bags') },
    { href:'/jewelry', label:t('jewellery') },
    { href:'/shoes', label:t('shoes') },
    { href:'/beauty', label:t('beauty') },
    { href:'/home', label:t('home') },
  ];

  const langOptions = [
    { code:'en', label:'EN', flag:'🇬🇧' },
    { code:'pt', label:'PT', flag:'🇧🇷' },
    { code:'es', label:'ES', flag:'🇪🇸' },
  ];

  return (
    <>
      {/* Promo bar */}
      <div style={{background:'#b8966a',color:'#1c1208',textAlign:'center',padding:'8px 1rem',fontSize:'12px',fontWeight:'500',letterSpacing:'0.5px'}}>
        {t('freeDelivery')} · {t('useCode')} <strong>LAUREA20</strong> for 20% {t('off')}
      </div>

      {/* Main navbar */}
      <nav style={{background:'#1c1208',padding:'0 1.5rem',position:'sticky',top:0,zIndex:50,borderBottom:'1px solid rgba(184,150,106,0.15)'}}>
        <div style={{maxWidth:'1400px',margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',height:'60px'}}>

          {/* Logo */}
          <Link href="/" style={{textDecoration:'none',flexShrink:0}}>
            <div style={{color:'#f5ede0',fontSize:'16px',fontWeight:'600',letterSpacing:'4px',textTransform:'uppercase',lineHeight:'1'}}>LAUREA</div>
            <div style={{color:'#b8966a',fontSize:'7px',letterSpacing:'3px',textTransform:'uppercase',marginTop:'2px'}}>
              {lang==='pt'?'CASA DE MODA':lang==='es'?'CASA DE MODA':'FASHION HOUSE'}
            </div>
          </Link>

          {/* Desktop nav links */}
          {!isMobile && (
            <div style={{display:'flex',gap:'1.5rem',alignItems:'center'}}>
              {navLinks.map(link => (
                <Link key={link.href} href={link.href}
                  style={{color:'rgba(245,237,224,0.7)',textDecoration:'none',fontSize:'12px',fontWeight:'500',letterSpacing:'1.5px',textTransform:'uppercase',transition:'color 0.15s'}}
                  onMouseEnter={e=>e.target.style.color='#b8966a'}
                  onMouseLeave={e=>e.target.style.color='rgba(245,237,224,0.7)'}>
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>

            {/* Language switcher */}
            <div style={{display:'flex',gap:'4px'}}>
              {langOptions.map(l => (
                <button key={l.code} onClick={()=>changeLang(l.code)}
                  style={{background:lang===l.code?'rgba(184,150,106,0.2)':'transparent',border:`1px solid ${lang===l.code?'rgba(184,150,106,0.5)':'transparent'}`,color:lang===l.code?'#b8966a':'rgba(245,237,224,0.4)',padding:'3px 7px',fontSize:'10px',cursor:'pointer',borderRadius:'4px',fontWeight:lang===l.code?'700':'400',fontFamily:'inherit',transition:'all 0.15s'}}>
                  {l.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <button onClick={()=>setSearchOpen(!searchOpen)}
              style={{background:'none',border:'none',color:'rgba(245,237,224,0.7)',cursor:'pointer',fontSize:'18px',padding:'4px',display:'flex',alignItems:'center'}}>
              🔍
            </button>

            {/* User */}
            {user ? (
              <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                {!isMobile && <span style={{fontSize:'12px',color:'rgba(245,237,224,0.6)'}}>{user.first_name}</span>}
                <button onClick={handleLogout}
                  style={{background:'none',border:'1px solid rgba(245,237,224,0.2)',color:'rgba(245,237,224,0.6)',padding:'5px 12px',fontSize:'11px',cursor:'pointer',borderRadius:'4px',fontFamily:'inherit',letterSpacing:'0.5px'}}>
                  {t('logout')}
                </button>
              </div>
            ) : (
              <Link href="/auth/login"
                style={{color:'rgba(245,237,224,0.7)',textDecoration:'none',fontSize:'12px',letterSpacing:'1px',textTransform:'uppercase'}}>
                {t('login')}
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart" style={{textDecoration:'none',position:'relative'}}>
              <div style={{background:'#b8966a',color:'#1c1208',padding:'6px 14px',borderRadius:'6px',fontSize:'12px',fontWeight:'700',letterSpacing:'1px',display:'flex',alignItems:'center',gap:'6px'}}>
                🛒 {t('bag')}
                {cartCount > 0 && (
                  <span style={{background:'#1c1208',color:'#b8966a',borderRadius:'50%',width:'18px',height:'18px',fontSize:'10px',fontWeight:'700',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>

            {/* Mobile hamburger */}
            {isMobile && (
              <button onClick={()=>setMenuOpen(!menuOpen)}
                style={{background:'none',border:'none',color:'rgba(245,237,224,0.7)',fontSize:'22px',cursor:'pointer',padding:'4px'}}>
                {menuOpen ? '✕' : '☰'}
              </button>
            )}
          </div>
        </div>

        {/* Search dropdown */}
        {searchOpen && (
          <div style={{borderTop:'1px solid rgba(184,150,106,0.1)',padding:'12px 0'}}>
            <form onSubmit={handleSearch} style={{maxWidth:'500px',margin:'0 auto',display:'flex',gap:'8px'}}>
              <input
                type="text"
                value={searchQuery}
                onChange={e=>setSearchQuery(e.target.value)}
                placeholder={lang==='pt'?'Pesquisar produtos...':lang==='es'?'Buscar productos...':'Search products...'}
                autoFocus
                style={{flex:1,background:'rgba(255,255,255,0.08)',border:'1px solid rgba(184,150,106,0.3)',color:'#f5ede0',padding:'10px 14px',fontSize:'13px',borderRadius:'8px',outline:'none',fontFamily:'inherit'}}
              />
              <button type="submit"
                style={{background:'#b8966a',color:'#1c1208',border:'none',padding:'10px 20px',fontSize:'12px',fontWeight:'700',cursor:'pointer',borderRadius:'8px',fontFamily:'inherit',letterSpacing:'1px'}}>
                {lang==='pt'?'BUSCAR':lang==='es'?'BUSCAR':'SEARCH'}
              </button>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {isMobile && menuOpen && (
          <div style={{borderTop:'1px solid rgba(184,150,106,0.1)',padding:'1rem 0',background:'#1c1208'}}>

            {/* Mobile nav links */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2px',marginBottom:'1rem'}}>
              {navLinks.map(link => (
                <Link key={link.href} href={link.href}
                  onClick={()=>setMenuOpen(false)}
                  style={{color:'rgba(245,237,224,0.7)',textDecoration:'none',fontSize:'12px',fontWeight:'500',letterSpacing:'1.5px',textTransform:'uppercase',padding:'12px 1rem',display:'block',borderBottom:'1px solid rgba(184,150,106,0.06)'}}>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile search */}
            <div style={{padding:'0 1rem',marginBottom:'1rem'}}>
              <form onSubmit={handleSearch} style={{display:'flex',gap:'8px'}}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e=>setSearchQuery(e.target.value)}
                  placeholder={lang==='pt'?'Pesquisar...':lang==='es'?'Buscar...':'Search...'}
                  style={{flex:1,background:'rgba(255,255,255,0.08)',border:'1px solid rgba(184,150,106,0.3)',color:'#f5ede0',padding:'10px 14px',fontSize:'13px',borderRadius:'8px',outline:'none',fontFamily:'inherit'}}
                />
                <button type="submit"
                  style={{background:'#b8966a',color:'#1c1208',border:'none',padding:'10px 16px',fontSize:'11px',fontWeight:'700',cursor:'pointer',borderRadius:'8px',fontFamily:'inherit'}}>
                  🔍
                </button>
              </form>
            </div>

            {/* Mobile login/logout */}
            <div style={{padding:'0 1rem',borderTop:'1px solid rgba(184,150,106,0.1)',paddingTop:'1rem'}}>
              {user ? (
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span style={{fontSize:'13px',color:'rgba(245,237,224,0.6)'}}>{user.first_name} {user.last_name}</span>
                  <button onClick={()=>{ handleLogout(); setMenuOpen(false); }}
                    style={{background:'rgba(184,150,106,0.1)',border:'1px solid rgba(184,150,106,0.3)',color:'#b8966a',padding:'8px 16px',fontSize:'12px',cursor:'pointer',borderRadius:'6px',fontFamily:'inherit'}}>
                    {t('logout')}
                  </button>
                </div>
              ) : (
                <Link href="/auth/login" onClick={()=>setMenuOpen(false)}
                  style={{display:'block',background:'#b8966a',color:'#1c1208',textAlign:'center',padding:'12px',textDecoration:'none',fontSize:'12px',fontWeight:'700',letterSpacing:'2px',textTransform:'uppercase',borderRadius:'8px'}}>
                  {t('login')}
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}