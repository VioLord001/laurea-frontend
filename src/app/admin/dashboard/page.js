'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products:0, orders:0, customers:0, revenue:0 });
  const [recentLogins, setRecentLogins] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = process.env.NEXT_PUBLIC_API_URL;
  const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('laurea_token') : '';

  useEffect(() => {
    fetch(`${api}/admin/dashboard`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json())
      .then(data => {
        if (data.stats) setStats(data.stats);
        if (data.recentLogins) setRecentLogins(data.recentLogins);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const cards = [
    { label:'Total Products', value:stats.products, icon:'📦', color:'#b8966a', href:'/admin/products' },
    { label:'Total Orders', value:stats.orders, icon:'🛒', color:'#3fb950', href:'/admin/orders' },
    { label:'Total Customers', value:stats.customers, icon:'👥', color:'#58a6ff', href:'/admin/customers' },
    { label:'Total Revenue', value:`$${parseFloat(stats.revenue||0).toFixed(2)}`, icon:'💰', color:'#f85149', href:'/admin/orders' },
  ];

  return (
    <div>
      <div style={{marginBottom:'2rem'}}>
        <h1 style={{fontSize:'24px',fontWeight:'600',color:'#1c1208'}}>Dashboard</h1>
        <p style={{fontSize:'13px',color:'#8a7a6a',marginTop:'4px'}}>Welcome to Laurea Fashion House Admin Panel</p>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'2rem'}}>
        {cards.map((card) => (
          <Link key={card.label} href={card.href} style={{textDecoration:'none',background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'1.5rem',display:'block',transition:'transform 0.15s'}}>
            <div style={{fontSize:'28px',marginBottom:'8px'}}>{card.icon}</div>
            <div style={{fontSize:'28px',fontWeight:'600',color:card.color,marginBottom:'4px'}}>{loading?'...':card.value}</div>
            <div style={{fontSize:'11px',color:'#8a7a6a',textTransform:'uppercase',letterSpacing:'0.5px'}}>{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'1.5rem',marginBottom:'1.5rem'}}>
        <h2 style={{fontSize:'15px',fontWeight:'600',color:'#1c1208',marginBottom:'1rem'}}>Quick Actions</h2>
        <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
          {[
            {label:'➕ Add Product',href:'/admin/products',bg:'#1c1208',color:'#f5ede0'},
            {label:'🛒 View Orders',href:'/admin/orders',bg:'#b8966a',color:'#1c1208'},
            {label:'👥 Manage Users',href:'/admin/users',bg:'#f5ede0',color:'#1c1208'},
            {label:'💳 Payment Settings',href:'/admin/payments',bg:'#f5ede0',color:'#1c1208'},
            {label:'🔔 Login Activity',href:'/admin/activity',bg:'#f5ede0',color:'#1c1208'},
          ].map((btn) => (
            <Link key={btn.label} href={btn.href} style={{background:btn.bg,color:btn.color,padding:'10px 18px',textDecoration:'none',fontSize:'12px',fontWeight:'600',letterSpacing:'1px',textTransform:'uppercase',borderRadius:'6px',border:'1px solid #e0d8cc'}}>
              {btn.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent login activity */}
      <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'1.5rem'}}>
        <h2 style={{fontSize:'15px',fontWeight:'600',color:'#1c1208',marginBottom:'1rem'}}>🔔 Recent Login Activity</h2>
        {recentLogins.length === 0 ? (
          <p style={{fontSize:'13px',color:'#8a7a6a',textAlign:'center',padding:'2rem'}}>No login activity yet</p>
        ) : (
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'#faf8f5',borderBottom:'1px solid #e0d8cc'}}>
                {['User','Email','Login Time','Device','Logins'].map(h=>(
                  <th key={h} style={{padding:'10px 14px',textAlign:'left',fontSize:'10px',fontWeight:'600',color:'#8a7a6a',textTransform:'uppercase',letterSpacing:'0.5px'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentLogins.map((session, i) => (
                <tr key={i} style={{borderBottom:'1px solid #f0ece8'}}>
                  <td style={{padding:'10px 14px',fontSize:'13px',fontWeight:'500',color:'#1c1208'}}>{session.first_name} {session.last_name}</td>
                  <td style={{padding:'10px 14px',fontSize:'12px',color:'#8a7a6a'}}>{session.email}</td>
                  <td style={{padding:'10px 14px',fontSize:'12px',color:'#8a7a6a'}}>{session.last_login ? new Date(session.last_login).toLocaleString() : 'Never'}</td>
                  <td style={{padding:'10px 14px',fontSize:'11px',color:'#8a7a6a',maxWidth:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{session.device ? session.device.substring(0,40)+'...' : 'Unknown'}</td>
                  <td style={{padding:'10px 14px',fontSize:'13px',fontWeight:'600',color:'#b8966a'}}>{session.login_count || 1}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}