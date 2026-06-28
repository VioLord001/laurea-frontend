'use client';
import { useState, useEffect } from 'react';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = process.env.NEXT_PUBLIC_API_URL;
  const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('laurea_token') : '';

  useEffect(() => {
    fetch(`${api}/admin/customers`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json())
      .then(data => { setCustomers(data.customers || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 style={{fontSize:'24px',fontWeight:'600',color:'#1c1208',marginBottom:'8px'}}>Customers</h1>
      <p style={{fontSize:'13px',color:'#8a7a6a',marginBottom:'1.5rem'}}>{customers.length} registered customers</p>
      {loading ? (
        <div style={{textAlign:'center',padding:'3rem',color:'#8a7a6a'}}>Loading...</div>
      ) : customers.length === 0 ? (
        <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'3rem',textAlign:'center'}}>
          <div style={{fontSize:'48px',marginBottom:'1rem'}}>👥</div>
          <h3 style={{fontSize:'16px',color:'#1c1208',marginBottom:'8px'}}>No customers yet</h3>
          <p style={{fontSize:'13px',color:'#8a7a6a'}}>Customers appear here when they register</p>
        </div>
      ) : (
        <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',overflow:'hidden'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'#faf8f5',borderBottom:'1px solid #e0d8cc'}}>
                {['Name','Email','Joined','Role'].map(h=>(
                  <th key={h} style={{padding:'12px 16px',textAlign:'left',fontSize:'11px',fontWeight:'600',color:'#8a7a6a',textTransform:'uppercase',letterSpacing:'0.5px'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((c,i)=>(
                <tr key={c.id} style={{borderBottom:'1px solid #f0ece8',background:i%2===0?'#fff':'#fdfcfb'}}>
                  <td style={{padding:'12px 16px',fontSize:'13px',fontWeight:'500',color:'#1c1208'}}>{c.first_name} {c.last_name}</td>
                  <td style={{padding:'12px 16px',fontSize:'13px',color:'#8a7a6a'}}>{c.email}</td>
                  <td style={{padding:'12px 16px',fontSize:'13px',color:'#8a7a6a'}}>{new Date(c.created_at).toLocaleDateString()}</td>
                  <td style={{padding:'12px 16px'}}><span style={{background:c.role==='admin'?'#b8966a':'#f0ece8',color:c.role==='admin'?'#1c1208':'#8a7a6a',padding:'3px 10px',borderRadius:'20px',fontSize:'10px',fontWeight:'600',textTransform:'uppercase'}}>{c.role}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}