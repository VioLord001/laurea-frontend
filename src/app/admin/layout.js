'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const navLinks = [
    { href: '/admin/dashboard', label: '📊 Dashboard' },
    { href: '/admin/products', label: '📦 Products' },
    { href: '/admin/orders', label: '🛒 Orders' },
    { href: '/admin/customers', label: '👥 Customers' },
  ];

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#f5f5f5'}}>
      <aside style={{width:'220px',background:'#1c1208',flexShrink:0,position:'sticky',top:0,height:'100vh',overflowY:'auto'}}>
        <div style={{padding:'1.5rem',borderBottom:'1px solid rgba(245,237,224,0.1)'}}>
          <div style={{color:'#f5ede0',fontSize:'14px',fontWeight:'600',letterSpacing:'3px',textTransform:'uppercase'}}>Laurea</div>
          <div style={{color:'#b8966a',fontSize:'8px',letterSpacing:'4px',textTransform:'uppercase',marginTop:'2px'}}>Admin Panel</div>
        </div>
        <nav style={{padding:'1rem 0'}}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} style={{display:'block',padding:'12px 1.5rem',color:pathname===link.href?'#b8966a':'rgba(245,237,224,0.6)',textDecoration:'none',fontSize:'13px',background:pathname===link.href?'rgba(184,150,106,0.1)':'transparent',borderLeft:pathname===link.href?'3px solid #b8966a':'3px solid transparent'}}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div style={{padding:'1rem 1.5rem',position:'absolute',bottom:0,left:0,right:0}}>
          <Link href="/" style={{display:'block',padding:'10px',background:'rgba(245,237,224,0.05)',color:'rgba(245,237,224,0.5)',textDecoration:'none',fontSize:'12px',textAlign:'center',border:'1px solid rgba(245,237,224,0.1)',borderRadius:'4px'}}>
            ← Back to website
          </Link>
        </div>
      </aside>
      <main style={{flex:1,padding:'2rem',overflowY:'auto'}}>
        {children}
      </main>
    </div>
  );
}