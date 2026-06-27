'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header style={{background:'#1c1208',padding:'0 1.5rem',display:'flex',alignItems:'center',justifyContent:'space-between',height:'56px',position:'sticky',top:0,zIndex:100}}>
      <Link href="/" style={{textDecoration:'none'}}>
        <div style={{color:'#f5ede0',fontSize:'16px',fontWeight:'600',letterSpacing:'4px',textTransform:'uppercase'}}>Laurea</div>
        <div style={{color:'#b8966a',fontSize:'7px',letterSpacing:'5px',textTransform:'uppercase'}}>Fashion House</div>
      </Link>
      <nav style={{display:'flex',gap:'1rem'}}>
        <Link href="/women" style={{color:'#f5ede0',textDecoration:'none',fontSize:'12px',letterSpacing:'1px',textTransform:'uppercase'}}>Women</Link>
        <Link href="/men" style={{color:'#f5ede0',textDecoration:'none',fontSize:'12px',letterSpacing:'1px',textTransform:'uppercase'}}>Men</Link>
        <Link href="/kids" style={{color:'#f5ede0',textDecoration:'none',fontSize:'12px',letterSpacing:'1px',textTransform:'uppercase'}}>Kids</Link>
        <Link href="/auth/login" style={{color:'#b8966a',textDecoration:'none',fontSize:'12px',letterSpacing:'1px',textTransform:'uppercase'}}>Login</Link>
      </nav>
    </header>
  );
}