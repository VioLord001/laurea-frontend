'use client';
import { useState, useEffect } from 'react';

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', password:'' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const api = process.env.NEXT_PUBLIC_API_URL;

  const getToken = () => localStorage.getItem('laurea_token');

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${api}/admin/employees`, { headers: { Authorization: `Bearer ${getToken()}` } });
      const data = await res.json();
      setEmployees(data.employees || []);
    } catch { setEmployees([]); }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch(`${api}/admin/employees/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`✅ Employee account created! ID: ${data.employee.employee_id}`);
        setForm({ firstName:'', lastName:'', email:'', password:'' });
        setShowForm(false);
        fetchEmployees();
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch { setMessage('❌ Failed to create employee account.'); }
    setSaving(false);
  };

  const inp = { width:'100%', border:'1px solid #e0d8cc', padding:'10px 12px', fontSize:'13px', color:'#1c1208', outline:'none', borderRadius:'6px', background:'#faf8f5', boxSizing:'border-box', marginBottom:'12px' };
  const lbl = { fontSize:'11px', fontWeight:'600', color:'#8a7a6a', textTransform:'uppercase', letterSpacing:'0.5px', display:'block', marginBottom:'5px' };

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.5rem'}}>
        <div>
          <h1 style={{fontSize:'24px',fontWeight:'600',color:'#1c1208'}}>Employees</h1>
          <p style={{fontSize:'13px',color:'#8a7a6a',marginTop:'2px'}}>{employees.length} employees registered</p>
        </div>
        <button onClick={()=>setShowForm(!showForm)}
          style={{background:'#1c1208',color:'#f5ede0',border:'none',padding:'10px 20px',fontSize:'12px',fontWeight:'600',letterSpacing:'1px',textTransform:'uppercase',cursor:'pointer',borderRadius:'6px'}}>
          {showForm ? '✕ Cancel' : '+ Create Employee Account'}
        </button>
      </div>

      {message && (
        <div style={{background:message.includes('❌')?'#fff0f0':'#f0fff4',border:`1px solid ${message.includes('❌')?'#ffcccc':'#ccffcc'}`,padding:'12px 16px',borderRadius:'8px',marginBottom:'1rem',fontSize:'13px'}}>
          {message}
        </div>
      )}

      {showForm && (
        <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'1.5rem',marginBottom:'2rem'}}>
          <h2 style={{fontSize:'16px',fontWeight:'600',color:'#1c1208',marginBottom:'1.25rem'}}>Create Employee Account</h2>
          <p style={{fontSize:'12px',color:'#8a7a6a',marginBottom:'1rem'}}>Create login credentials for your employee. They will log in and complete their profile details.</p>
          <form onSubmit={handleCreate}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
              <div>
                <label style={lbl}>First Name *</label>
                <input style={inp} value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} placeholder="First name" required />
                <label style={lbl}>Email Address *</label>
                <input style={inp} type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="employee@email.com" required />
              </div>
              <div>
                <label style={lbl}>Last Name *</label>
                <input style={inp} value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} placeholder="Last name" required />
                <label style={lbl}>Temporary Password *</label>
                <input style={inp} type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Min 8 characters" required minLength={8} />
              </div>
            </div>
            <div style={{background:'#fdf6ec',border:'1px solid #f0c040',borderRadius:'8px',padding:'12px',fontSize:'12px',color:'#8a7a6a',marginBottom:'1rem',lineHeight:'1.7'}}>
              💡 Share the email and temporary password with your employee. They will log in at <strong>laureafashionhouse.com/employee/login</strong> and complete their profile.
            </div>
            <button type="submit" disabled={saving}
              style={{background:'#b8966a',color:'#1c1208',border:'none',padding:'12px 28px',fontSize:'12px',fontWeight:'600',letterSpacing:'1px',textTransform:'uppercase',cursor:'pointer',borderRadius:'6px',opacity:saving?0.7:1}}>
              {saving?'Creating...':'Create Account'}
            </button>
          </form>
        </div>
      )}

      {employees.length === 0 ? (
        <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'3rem',textAlign:'center'}}>
          <div style={{fontSize:'48px',marginBottom:'1rem'}}>👥</div>
          <h3 style={{fontSize:'16px',color:'#1c1208',marginBottom:'8px'}}>No employees yet</h3>
          <p style={{fontSize:'13px',color:'#8a7a6a',marginBottom:'1.5rem'}}>Create employee accounts and share their login credentials</p>
          <button onClick={()=>setShowForm(true)} style={{background:'#1c1208',color:'#f5ede0',border:'none',padding:'10px 24px',fontSize:'12px',fontWeight:'600',cursor:'pointer',borderRadius:'6px',textTransform:'uppercase',letterSpacing:'1px'}}>
            Create First Employee
          </button>
        </div>
      ) : (
        <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',overflow:'hidden'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'#faf8f5',borderBottom:'1px solid #e0d8cc'}}>
                {['Employee ID','Name','Email','Position','Department','Status','Profile'].map(h => (
                  <th key={h} style={{padding:'12px 16px',fontSize:'11px',fontWeight:'600',color:'#8a7a6a',textTransform:'uppercase',letterSpacing:'0.5px',textAlign:'left'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((emp,i) => (
                <tr key={emp.id} style={{borderBottom:'1px solid #f5ede0',background:i%2===0?'#fff':'#faf8f5'}}>
                  <td style={{padding:'12px 16px',fontSize:'12px',color:'#b8966a',fontWeight:'600'}}>{emp.employee_id}</td>
                  <td style={{padding:'12px 16px',fontSize:'13px',color:'#1c1208',fontWeight:'500'}}>{emp.first_name} {emp.last_name}</td>
                  <td style={{padding:'12px 16px',fontSize:'12px',color:'#8a7a6a'}}>{emp.email}</td>
                  <td style={{padding:'12px 16px',fontSize:'12px',color:'#8a7a6a'}}>{emp.job_position || '—'}</td>
                  <td style={{padding:'12px 16px',fontSize:'12px',color:'#8a7a6a'}}>{emp.department || '—'}</td>
                  <td style={{padding:'12px 16px'}}>
                    <span style={{background:emp.is_active?'rgba(59,109,17,0.1)':'rgba(204,0,0,0.1)',color:emp.is_active?'#3b6d11':'#cc0000',fontSize:'10px',fontWeight:'600',padding:'3px 8px',borderRadius:'4px',textTransform:'uppercase'}}>
                      {emp.is_active?'Active':'Inactive'}
                    </span>
                  </td>
                  <td style={{padding:'12px 16px'}}>
                    <span style={{background:emp.profile_completed?'rgba(59,109,17,0.1)':'rgba(240,192,64,0.1)',color:emp.profile_completed?'#3b6d11':'#8a6000',fontSize:'10px',fontWeight:'600',padding:'3px 8px',borderRadius:'4px',textTransform:'uppercase'}}>
                      {emp.profile_completed?'✓ Complete':'⏳ Pending'}
                    </span>
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