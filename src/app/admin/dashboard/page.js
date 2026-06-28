'use client';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div>
      <h1 style={{fontSize:'24px',fontWeight:'600',color:'#1c1208',marginBottom:'8px'}}>Dashboard</h1>
      <p style={{fontSize:'13px',color:'#8a7a6a',marginBottom:'2rem'}}>Welcome to Laurea Fashion House Admin Panel</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'2rem'}}>
        {[
          {label:'Total Products',value:'0',icon:'📦',color:'#b8966a'},
          {label:'Total Orders',value:'0',icon:'🛒',color:'#3fb950'},
          {label:'Total Customers',value:'0',icon:'👥',color:'#58a6ff'},
          {label:'Total Revenue',value:'$0.00',icon:'💰',color:'#f85149'},
        ].map((card)=>(
          <div key={card.label} style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'1.5rem'}}>
            <div style={{fontSize:'28px',marginBottom:'8px'}}>{card.icon}</div>
            <div style={{fontSize:'24px',fontWeight:'600',color:card.color,marginBottom:'4px'}}>{card.value}</div>
            <div style={{fontSize:'12px',color:'#8a7a6a',textTransform:'uppercase',letterSpacing:'0.5px'}}>{card.label}</div>
          </div>
        ))}
      </div>
      <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'1.5rem'}}>
        <h2 style={{fontSize:'16px',fontWeight:'600',color:'#1c1208',marginBottom:'1rem'}}>Quick Actions</h2>
        <div style={{display:'flex',gap:'1rem',flexWrap:'wrap'}}>
          <Link href="/admin/products" style={{background:'#1c1208',color:'#f5ede0',padding:'10px 20px',textDecoration:'none',fontSize:'12px',fontWeight:'600',letterSpacing:'1px',textTransform:'uppercase',borderRadius:'6px'}}>Add New Product</Link>
          <Link href="/admin/orders" style={{background:'#b8966a',color:'#1c1208',padding:'10px 20px',textDecoration:'none',fontSize:'12px',fontWeight:'600',letterSpacing:'1px',textTransform:'uppercase',borderRadius:'6px'}}>View Orders</Link>
          <Link href="/admin/customers" style={{background:'#f5ede0',color:'#1c1208',padding:'10px 20px',textDecoration:'none',fontSize:'12px',fontWeight:'600',letterSpacing:'1px',textTransform:'uppercase',borderRadius:'6px',border:'1px solid #e0d8cc'}}>View Customers</Link>
        </div>
      </div>
    </div>
  );
}