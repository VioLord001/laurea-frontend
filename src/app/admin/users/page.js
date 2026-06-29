'use client';
import { useState, useEffect } from 'react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const api = process.env.NEXT_PUBLIC_API_URL;
  const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('laurea_token') : '';

  useEffect(() => {
    fetch(`${api}/admin/users`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json())
      .then(data => { setUsers(data.users || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

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
    await fetch(`${api}/admin/users/${id}/role`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    setUsers(users.map(u => u.id === id ? { ...u, role } : u));
    setMessage(`User role updated to ${role}`);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div>
      <div style={{marginBottom:'1.5rem'}}>
        <h1 style={{fontSize:'24px',fontWeight:'600',color:'#1c1208'}}>User Management</h1>
        <p style={{fontSize:'13px',color:'#8a7a6a',marginTop:'4px'}}>{users.length} registered users</p>
      </div>

      {message && <div style={{background:'#f0fff4',border:'1px solid #ccffcc',padding:'12px 16px',borderRadius:'8px',marginBottom:'1rem',fontSize:'13px',color:'#1c1208'}}>{message}</div>}

      {loading ? (
        <div style={{textAlign:'center',padding:'3rem',color:'#8a7a6a'}}>Loading users...</div>
      ) : (
        <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',overflow:'hidden'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'#faf8f5',borderBottom:'1px solid #e0d8cc'}}>
                {['Name','Email','Role','Last Login','Logins','Status','Actions'].map(h=>(
                  <th key={h} style={{padding:'12px 14px',textAlign:'left',fontSize:'10px',fontWeight:'600',color:'#8a7a6a',textTransform:'uppercase',letterSpacing:'0.5px'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={user.id} style={{borderBottom:'1px solid #f0ece8',background:i%2===0?'#fff':'#fdfcfb'}}>
                  <td style={{padding:'12px 14px',fontSize:'13px',fontWeight:'500',color:'#1c1208'}}>{user.first_name} {user.last_name}</td>
                  <td style={{padding:'12px 14px',fontSize:'12px',color:'#8a7a6a'}}>{user.email}</td>
                  <td style={{padding:'12px 14px'}}>
                    <select value={user.role} onChange={e=>changeRole(user.id,e.target.value)}
                      style={{border:'1px solid #e0d8cc',padding:'4px 8px',fontSize:'11px',borderRadius:'4px',background:'#fff',cursor:'pointer'}}>
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td style={{padding:'12px 14px',fontSize:'11px',color:'#8a7a6a'}}>{user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}</td>
                  <td style={{padding:'12px 14px',fontSize:'13px',fontWeight:'600',color:'#b8966a',textAlign:'center'}}>{user.login_count || 0}</td>
                  <td style={{padding:'12px 14px'}}>
                    <span style={{background:user.is_approved!==false?'#eaf3de':'#fff0f0',color:user.is_approved!==false?'#3b6d11':'#cc0000',padding:'3px 10px',borderRadius:'20px',fontSize:'10px',fontWeight:'600',textTransform:'uppercase'}}>
                      {user.is_approved !== false ? 'Active' : 'Blocked'}
                    </span>
                  </td>
                  <td style={{padding:'12px 14px'}}>
                    <button onClick={()=>toggleApprove(user.id, user.is_approved!==false)}
                      style={{background:user.is_approved!==false?'#fff0f0':'#eaf3de',color:user.is_approved!==false?'#cc0000':'#3b6d11',border:`1px solid ${user.is_approved!==false?'#ffcccc':'#97c459'}`,padding:'5px 12px',fontSize:'11px',fontWeight:'600',cursor:'pointer',borderRadius:'4px',textTransform:'uppercase'}}>
                      {user.is_approved !== false ? 'Block' : 'Approve'}
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