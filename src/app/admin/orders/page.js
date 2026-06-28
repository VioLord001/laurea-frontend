'use client';
import { useState, useEffect } from 'react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = process.env.NEXT_PUBLIC_API_URL;
  const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('laurea_token') : '';

  useEffect(() => {
    fetch(`${api}/admin/orders`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json())
      .then(data => { setOrders(data.orders || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    await fetch(`${api}/admin/orders/${id}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  const statusColors = { pending:'#f0ad4e', confirmed:'#5bc0de', processing:'#b8966a', shipped:'#0275d8', delivered:'#5cb85c', cancelled:'#d9534f' };

  return (
    <div>
      <h1 style={{fontSize:'24px',fontWeight:'600',color:'#1c1208',marginBottom:'8px'}}>Orders</h1>
      <p style={{fontSize:'13px',color:'#8a7a6a',marginBottom:'1.5rem'}}>{orders.length} orders total</p>
      {loading ? (
        <div style={{textAlign:'center',padding:'3rem',color:'#8a7a6a'}}>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'3rem',textAlign:'center'}}>
          <div style={{fontSize:'48px',marginBottom:'1rem'}}>🛒</div>
          <h3 style={{fontSize:'16px',color:'#1c1208',marginBottom:'8px'}}>No orders yet</h3>
          <p style={{fontSize:'13px',color:'#8a7a6a'}}>Orders will appear here when customers start buying</p>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
          {orders.map((order) => (
            <div key={order.id} style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'1.25rem'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px',flexWrap:'wrap',gap:'8px'}}>
                <div>
                  <div style={{fontSize:'14px',fontWeight:'600',color:'#1c1208'}}>{order.order_number}</div>
                  <div style={{fontSize:'12px',color:'#8a7a6a',marginTop:'2px'}}>{new Date(order.created_at).toLocaleDateString()}</div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                  <span style={{background:statusColors[order.status]||'#8a7a6a',color:'#fff',padding:'4px 12px',borderRadius:'20px',fontSize:'11px',fontWeight:'600',textTransform:'uppercase'}}>{order.status}</span>
                  <span style={{fontSize:'16px',fontWeight:'600',color:'#1c1208'}}>${parseFloat(order.total_amount).toFixed(2)}</span>
                </div>
              </div>
              <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
                {['confirmed','processing','shipped','delivered','cancelled'].map(status => (
                  <button key={status} onClick={() => updateStatus(order.id, status)} style={{padding:'5px 10px',fontSize:'10px',border:'1px solid #e0d8cc',background:order.status===status?'#1c1208':'#fff',color:order.status===status?'#f5ede0':'#8a7a6a',cursor:'pointer',borderRadius:'4px',textTransform:'uppercase',fontWeight:'600'}}>
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}