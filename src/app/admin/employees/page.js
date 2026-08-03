'use client';
import { useState, useEffect } from 'react';

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const api = process.env.NEXT_PUBLIC_API_URL;

  const getToken = () => localStorage.getItem('laurea_token') || '';

  useEffect(() => {
    const token = localStorage.getItem('laurea_token');
    if (!token) { setLoading(false); return; }
    fetch(`${api}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        const emp = (data.users || []).filter(u => u.role === 'employee');
        setEmployees(emp);
        setLoading(false);
      })
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
      if (role !== 'employee') {
        setEmployees(employees.filter(e => e.id !== id));
        setMessage(`✅ User moved to ${role} — removed from employees list`);
      } else {
        setMessage(`✅ Role updated to employee`);
      }
    } else {
      setMessage(`❌ ${data.message}`);
    }
    setTimeout(() => setMessage(''), 4000);
  };

  const forceLogout = async (id, name) => {
    if (!confirm(`Force logout ${name}?`)) return;
    const res = await fetch(`${api}/admin/users/${id}/force-logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    setMessage(data.success ? `✅ ${name} has been logged out.` : `❌ ${data.message}`);
    setTimeout(() => setMessage(''), 4000);
  };

  const toggleApprove = async (id, current) => {
    const res = await fetch(`${api}/admin/users/${id}/approve`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_approved: !current })
    });
    const data = await res.json();
    setMessage(data.message);
    setEmployees(employees.map(e => e.id === id ? { ...e, is_approved: !current } : e));
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.5rem'}}>
        <div>
          <h1 style={{fontSize:'24px',fontWeight:'600',color:'#1c1208'}}>Employees</h1>
          <p style={{fontSize:'13px',color:'#8a7a6a',marginTop:'2px'}}>{employees.length} employees registered</p>
        </div>
      </div>

      <div style={{background:'#fdf6ec',border:'1px solid #f0c040',borderRadius:'10px',padding:'12px 16px',marginBottom:'1.25rem',fontSize:'12px',color:'#8a7a6a',lineHeight:'1.7'}}>
        💡 These are all users with the <strong>Employee</strong> role. To add someone as employee — go to <strong>Users</strong> or <strong>Customers</strong> page and click 🧑‍💼 Employee button.
      </div>

      {message && (
        <div style={{background:message.includes('❌')?'#fff0f0':'#f0fff4',border:`1px solid ${message.includes('❌')?'#ffcccc':'#ccffcc'}`,padding:'12px 16px',borderRadius:'8px',marginBottom:'1rem',fontSize:'13px',color:'#1c1208'}}>
          {message}
        </div>
      )}

      {loading ? (
        <div style={{textAlign:'center',padding:'3rem',color:'#8a7a6a'}}>Loading employees...</div>
      ) : employees.length === 0 ? (
        <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'3rem',textAlign:'center'}}>
          <div style={{fontSize:'48px',marginBottom:'1rem'}}>🧑‍💼</div>
          <h3 style={{fontSize:'16px',color:'#1c1208',marginBottom:'8px'}}>No employees yet</h3>
          <p style={{fontSize:'13px',color:'#8a7a6a'}}>Go to Users or Customers page and set role to Employee</p>
        </div>
      ) : (
        <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',overflow:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',minWidth:'800px'}}>
            <thead>
              <tr style={{background:'#faf8f5',borderBottom:'1px solid #e0d8cc'}}>
                {['Name','Email','Last Login','Logins','Status','Change Role','Actions'].map(h=>(
                  <th key={h} style={{padding:'12px 14px',textAlign:'left',fontSize:'10px',fontWeight:'600',color:'#8a7a6a',textTransform:'uppercase',letterSpacing:'0.5px',whiteSpace:'nowrap'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, i) => (
                <tr key={emp.id} style={{borderBottom:'1px solid #f0ece8',background:i%2===0?'#fff':'#fdfcfb'}}>
                  <td style={{padding:'12px 14px',fontSize:'13px',fontWeight:'500',color:'#1c1208',whiteSpace:'nowrap'}}>
                    {emp.first_name} {emp.last_name}
                  </td>
                  <td style={{padding:'12px 14px',fontSize:'12px',color:'#8a7a6a'}}>
                    {emp.email}
                  </td>
                  <td style={{padding:'12px 14px',fontSize:'11px',color:'#8a7a6a',whiteSpace:'nowrap'}}>
                    {emp.last_login ? new Date(emp.last_login).toLocaleDateString() : 'Never'}
                  </td>
                  <td style={{padding:'12px 14px',fontSize:'13px',fontWeight:'600',color:'#b8966a',textAlign:'center'}}>
                    {emp.login_count || 0}
                  </td>
                  <td style={{padding:'12px 14px'}}>
                    <span style={{background:emp.is_approved!==false?'#eaf3de':'#fff0f0',color:emp.is_approved!==false?'#3b6d11':'#cc0000',padding:'3px 10px',borderRadius:'20px',fontSize:'10px',fontWeight:'600',textTransform:'uppercase'}}>
                      {emp.is_approved !== false ? 'Active' : 'Blocked'}
                    </span>
                  </td>
                  <td style={{padding:'12px 14px'}}>
                    <div style={{display:'flex',gap:'4px'}}>
                      <button onClick={()=>changeRole(emp.id,'customer')}
                        style={{padding:'5px 10px',fontSize:'10px',fontWeight:'600',cursor:'pointer',borderRadius:'4px',border:'1px solid #e0d8cc',background:'#fff',color:'#8a7a6a',textTransform:'uppercase',whiteSpace:'nowrap'}}>
                        🛍️ Customer
                      </button>
                      <button onClick={()=>changeRole(emp.id,'admin')}
                        style={{padding:'5px 10px',fontSize:'10px',fontWeight:'600',cursor:'pointer',borderRadius:'4px',border:'1px solid #e0d8cc',background:'#fff',color:'#1c1208',textTransform:'uppercase',whiteSpace:'nowrap'}}>
                        ⚙️ Admin
                      </button>
                    </div>
                  </td>
                  <td style={{padding:'12px 14px'}}>
                    <div style={{display:'flex',gap:'6px',flexDirection:'column'}}>
                      <button onClick={()=>toggleApprove(emp.id, emp.is_approved!==false)}
                        style={{background:emp.is_approved!==false?'#fff0f0':'#eaf3de',color:emp.is_approved!==false?'#cc0000':'#3b6d11',border:`1px solid ${emp.is_approved!==false?'#ffcccc':'#97c459'}`,padding:'5px 12px',fontSize:'11px',fontWeight:'600',cursor:'pointer',borderRadius:'4px',textTransform:'uppercase',whiteSpace:'nowrap'}}>
                        {emp.is_approved !== false ? 'Block' : 'Unblock'}
                      </button>
                      <button onClick={()=>forceLogout(emp.id, `${emp.first_name} ${emp.last_name}`)}
                        style={{background:'#fff8e1',color:'#8a6000',border:'1px solid #f0c040',padding:'5px 12px',fontSize:'11px',fontWeight:'600',cursor:'pointer',borderRadius:'4px',textTransform:'uppercase',whiteSpace:'nowrap'}}>
                        🚪 Force Logout
                      </button>
                    </div>
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