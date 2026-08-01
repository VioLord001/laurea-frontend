'use client';
import { useState, useEffect } from 'react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const token = localStorage.getItem('laurea_token');
    if (!token) { setLoading(false); return; }
    fetch(`${api}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { setUsers(data.users || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const getToken = () => localStorage.getItem('laurea_token') || '';

  const toggleApprove = async (id, current) => {
    const res = await fetch(`${api}/admin/users/${id}/approve`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_approved: !current })
    });
    const data = await res.json();
    setMessage(data.message);
    setUsers(users.map(u => u.id === id ? { ...u, is_approved: !current } : u));
    setTimeout(() => setMessage(''), 3000);
  };

  const changeRole = async (id, role) => {
    const res = await fetch(`${api}/admin/users/${id}/role`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    const data = await res.json();
    if (data.success !== false) {
      setUsers(users.map(u => u.id === id ? { ...u, role } : u));
      setMessage(`✅ User role updated to ${role}${role === 'employee' ? ' — they will see employee setup on next login' : ''}`);
    } else {
      setMessage(`❌ ${data.message}`);
    }
    setTimeout(() => setMessage(''), 4000);
  };

  const getRoleBadgeStyle = (role) => {
    const styles = {
      admin: { background:'#1c1208', color:'#b8966a' },
      employee: { background:'#1a3a6b', color:'#7eb3ff' },
      customer: { background:'#f0ece8', color:'#8a7a6a' },
    };
    return styles[role] || styles.customer;
  };

  return (
    <div>
      <div style={{marginBottom:'1.5rem'}}>
        <h1 style={{fontSize:'24px',fontWeight:'600',color:'#1c1208'}}>User Management</h1>
        <p style={{fontSize:'13px',color:'#8a7a6a',marginTop:'4px'}}>{users.length} registered users</p>
      </div>

      <div style={{background:'#fdf6ec',border:'1px solid #f0c040',borderRadius:'10px',padding:'12px 16px',marginBottom:'1.25rem',fontSize:'12px',color:'#8a7a6a',lineHeight:'1.7'}}>
        💡 <strong>How roles work:</strong><br/>
        <strong style={{color:'#1c1208'}}>Customer</strong> — normal shopper, goes to homepage after login<br/>
        <strong style={{color:'#1c1208'}}>Employee</strong> — goes to employee setup page after login to fill in their details<br/>
        <strong style={{color:'#1c1208'}}>Admin</strong> — goes to admin dashboard after login
      </div>

      {message && (
        <div style={{background:message.includes('❌')?'#fff0f0':'#f0fff4',border:`1px solid ${message.includes('❌')?'#ffcccc':'#ccffcc'}`,padding:'12px 16px',borderRadius:'8px',marginBottom:'1rem',fontSize:'13px',color:'#1c1208'}}>
          {message}
        </div>
      )}

      {loading ? (
        <div style={{textAlign:'center',padding:'3rem',color:'#8a7a6a'}}>Loading users...</div>
      ) : users.length === 0 ? (
        <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'3rem',textAlign:'center'}}>
          <div style={{fontSize:'48px',marginBottom:'1rem'}}>👥</div>
          <p style={{fontSize:'13px',color:'#8a7a6a'}}>No users registered yet</p>
        </div>
      ) : (
        <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',overflow:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',minWidth:'900px'}}>
            <thead>
              <tr style={{background:'#faf8f5',borderBottom:'1px solid #e0d8cc'}}>
                {['Name','Email','Current Role','Last Login','Logins','Status','Change Role','Actions'].map(h=>(
                  <th key={h} style={{padding:'12px 14px',textAlign:'left',fontSize:'10px',fontWeight:'600',color:'#8a7a6a',textTransform:'uppercase',letterSpacing:'0.5px',whiteSpace:'nowrap'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={user.id} style={{borderBottom:'1px solid #f0ece8',background:i%2===0?'#fff':'#fdfcfb'}}>

                  <td style={{padding:'12px 14px',fontSize:'13px',fontWeight:'500',color:'#1c1208',whiteSpace:'nowrap'}}>
                    {user.first_name} {user.last_name}
                  </td>

                  <td style={{padding:'12px 14px',fontSize:'12px',color:'#8a7a6a'}}>
                    {user.email}
                  </td>

                  <td style={{padding:'12px 14px'}}>
                    <span style={{...getRoleBadgeStyle(user.role),padding:'3px 10px',borderRadius:'20px',fontSize:'10px',fontWeight:'600',textTransform:'uppercase',whiteSpace:'nowrap'}}>
                      {user.role === 'employee' ? '🧑‍💼 Employee' : user.role === 'admin' ? '⚙️ Admin' : '🛍️ Customer'}
                    </span>
                  </td>

                  <td style={{padding:'12px 14px',fontSize:'11px',color:'#8a7a6a',whiteSpace:'nowrap'}}>
                    {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                  </td>

                  <td style={{padding:'12px 14px',fontSize:'13px',fontWeight:'600',color:'#b8966a',textAlign:'center'}}>
                    {user.login_count || 0}
                  </td>

                  <td style={{padding:'12px 14px'}}>
                    <span style={{background:user.is_approved!==false?'#eaf3de':'#fff0f0',color:user.is_approved!==false?'#3b6d11':'#cc0000',padding:'3px 10px',borderRadius:'20px',fontSize:'10px',fontWeight:'600',textTransform:'uppercase',whiteSpace:'nowrap'}}>
                      {user.is_approved !== false ? 'Active' : 'Blocked'}
                    </span>
                  </td>

                  <td style={{padding:'12px 14px'}}>
                    <div style={{display:'flex',gap:'4px',flexWrap:'nowrap'}}>
                      <button onClick={()=>changeRole(user.id,'customer')} disabled={user.role==='customer'}
                        style={{padding:'5px 10px',fontSize:'10px',fontWeight:'600',cursor:user.role==='customer'?'default':'pointer',borderRadius:'4px',border:'1px solid #e0d8cc',background:user.role==='customer'?'#f0ece8':'#fff',color:user.role==='customer'?'#b8966a':'#8a7a6a',opacity:user.role==='customer'?0.6:1,textTransform:'uppercase',whiteSpace:'nowrap'}}>
                        🛍️ Customer
                      </button>
                      <button onClick={()=>changeRole(user.id,'employee')} disabled={user.role==='employee'}
                        style={{padding:'5px 10px',fontSize:'10px',fontWeight:'600',cursor:user.role==='employee'?'default':'pointer',borderRadius:'4px',border:`1px solid ${user.role==='employee'?'#1a3a6b':'#e0d8cc'}`,background:user.role==='employee'?'#1a3a6b':'#fff',color:user.role==='employee'?'#fff':'#1a3a6b',opacity:user.role==='employee'?0.7:1,textTransform:'uppercase',whiteSpace:'nowrap'}}>
                        🧑‍💼 Employee
                      </button>
                      <button onClick={()=>changeRole(user.id,'admin')} disabled={user.role==='admin'}
                        style={{padding:'5px 10px',fontSize:'10px',fontWeight:'600',cursor:user.role==='admin'?'default':'pointer',borderRadius:'4px',border:`1px solid ${user.role==='admin'?'#1c1208':'#e0d8cc'}`,background:user.role==='admin'?'#1c1208':'#fff',color:user.role==='admin'?'#b8966a':'#1c1208',opacity:user.role==='admin'?0.7:1,textTransform:'uppercase',whiteSpace:'nowrap'}}>
                        ⚙️ Admin
                      </button>
                    </div>
                  </td>

                  <td style={{padding:'12px 14px'}}>
                    <button onClick={()=>toggleApprove(user.id, user.is_approved!==false)}
                      style={{background:user.is_approved!==false?'#fff0f0':'#eaf3de',color:user.is_approved!==false?'#cc0000':'#3b6d11',border:`1px solid ${user.is_approved!==false?'#ffcccc':'#97c459'}`,padding:'5px 12px',fontSize:'11px',fontWeight:'600',cursor:'pointer',borderRadius:'4px',textTransform:'uppercase',whiteSpace:'nowrap'}}>
                      {user.is_approved !== false ? 'Block' : 'Unblock'}
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}