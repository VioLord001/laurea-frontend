'use client';
import { useState, useEffect } from 'react';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const api = process.env.NEXT_PUBLIC_API_URL;

  const getToken = () => localStorage.getItem('laurea_token') || '';

  useEffect(() => {
    const token = localStorage.getItem('laurea_token');
    if (!token) { setLoading(false); return; }
    fetch(`${api}/admin/customers`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { setCustomers(data.customers || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const changeRole = async (id, role) => {
    const res = await fetch(`${api}/admin/users/${id}/role`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    const data = await res.json();
    if (data.success !== false) {
      setCustomers(customers.map(c => c.id === id ? { ...c, role } : c));
      setMessage(`✅ ${customers.find(c=>c.id===id)?.first_name} is now ${role === 'employee' ? 'an Employee' : role === 'admin' ? 'an Admin' : 'a Customer'}${role === 'employee' ? ' — they will complete setup on next login' : ''}`);
    } else {
      setMessage(`❌ ${data.message}`);
    }
    setTimeout(() => setMessage(''), 4000);
  };

  const getRoleBadge = (role) => {
    if (role === 'admin') return { bg:'#1c1208', color:'#b8966a', label:'⚙️ Admin' };
    if (role === 'employee') return { bg:'#1a3a6b', color:'#7eb3ff', label:'🧑‍💼 Employee' };
    return { bg:'#f0ece8', color:'#8a7a6a', label:'🛍️ Customer' };
  };

  return (
    <div>
      <h1 style={{fontSize:'24px',fontWeight:'600',color:'#1c1208',marginBottom:'8px'}}>Customers</h1>
      <p style={{fontSize:'13px',color:'#8a7a6a',marginBottom:'1rem'}}>{customers.length} registered customers</p>

      <div style={{background:'#fdf6ec',border:'1px solid #f0c040',borderRadius:'10px',padding:'12px 16px',marginBottom:'1.25rem',fontSize:'12px',color:'#8a7a6a',lineHeight:'1.7'}}>
        💡 Use the role buttons to switch any user to <strong>Employee</strong> or <strong>Admin</strong>. Employees will be taken to the setup page on their next login.
      </div>

      {message && (
        <div style={{background:message.includes('❌')?'#fff0f0':'#f0fff4',border:`1px solid ${message.includes('❌')?'#ffcccc':'#ccffcc'}`,padding:'12px 16px',borderRadius:'8px',marginBottom:'1rem',fontSize:'13px',color:'#1c1208'}}>
          {message}
        </div>
      )}

      {loading ? (
        <div style={{textAlign:'center',padding:'3rem',color:'#8a7a6a'}}>Loading...</div>
      ) : customers.length === 0 ? (
        <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'3rem',textAlign:'center'}}>
          <div style={{fontSize:'48px',marginBottom:'1rem'}}>👥</div>
          <h3 style={{fontSize:'16px',color:'#1c1208',marginBottom:'8px'}}>No customers yet</h3>
          <p style={{fontSize:'13px',color:'#8a7a6a'}}>Customers appear here when they register</p>
        </div>
      ) : (
        <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',overflow:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',minWidth:'800px'}}>
            <thead>
              <tr style={{background:'#faf8f5',borderBottom:'1px solid #e0d8cc'}}>
                {['Name','Email','Joined','Current Role','Switch Role'].map(h=>(
                  <th key={h} style={{padding:'12px 16px',textAlign:'left',fontSize:'11px',fontWeight:'600',color:'#8a7a6a',textTransform:'uppercase',letterSpacing:'0.5px',whiteSpace:'nowrap'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((c,i) => {
                const badge = getRoleBadge(c.role);
                return (
                  <tr key={c.id} style={{borderBottom:'1px solid #f0ece8',background:i%2===0?'#fff':'#fdfcfb'}}>
                    <td style={{padding:'12px 16px',fontSize:'13px',fontWeight:'500',color:'#1c1208',whiteSpace:'nowrap'}}>
                      {c.first_name} {c.last_name}
                    </td>
                    <td style={{padding:'12px 16px',fontSize:'13px',color:'#8a7a6a'}}>
                      {c.email}
                    </td>
                    <td style={{padding:'12px 16px',fontSize:'13px',color:'#8a7a6a',whiteSpace:'nowrap'}}>
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                    <td style={{padding:'12px 16px'}}>
                      <span style={{background:badge.bg,color:badge.color,padding:'3px 10px',borderRadius:'20px',fontSize:'10px',fontWeight:'600',textTransform:'uppercase',whiteSpace:'nowrap'}}>
                        {badge.label}
                      </span>
                    </td>
                    <td style={{padding:'12px 16px'}}>
                      <div style={{display:'flex',gap:'4px',flexWrap:'nowrap'}}>
                        <button onClick={()=>changeRole(c.id,'customer')} disabled={c.role==='customer'}
                          style={{padding:'5px 10px',fontSize:'10px',fontWeight:'600',cursor:c.role==='customer'?'default':'pointer',borderRadius:'4px',border:'1px solid #e0d8cc',background:c.role==='customer'?'#f0ece8':'#fff',color:c.role==='customer'?'#b8966a':'#8a7a6a',opacity:c.role==='customer'?0.5:1,textTransform:'uppercase',whiteSpace:'nowrap'}}>
                          🛍️ Customer
                        </button>
                        <button onClick={()=>changeRole(c.id,'employee')} disabled={c.role==='employee'}
                          style={{padding:'5px 10px',fontSize:'10px',fontWeight:'600',cursor:c.role==='employee'?'default':'pointer',borderRadius:'4px',border:`1px solid ${c.role==='employee'?'#1a3a6b':'#e0d8cc'}`,background:c.role==='employee'?'#1a3a6b':'#fff',color:c.role==='employee'?'#fff':'#1a3a6b',opacity:c.role==='employee'?0.6:1,textTransform:'uppercase',whiteSpace:'nowrap'}}>
                          🧑‍💼 Employee
                        </button>
                        <button onClick={()=>changeRole(c.id,'admin')} disabled={c.role==='admin'}
                          style={{padding:'5px 10px',fontSize:'10px',fontWeight:'600',cursor:c.role==='admin'?'default':'pointer',borderRadius:'4px',border:`1px solid ${c.role==='admin'?'#1c1208':'#e0d8cc'}`,background:c.role==='admin'?'#1c1208':'#fff',color:c.role==='admin'?'#b8966a':'#1c1208',opacity:c.role==='admin'?0.6:1,textTransform:'uppercase',whiteSpace:'nowrap'}}>
                          ⚙️ Admin
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}