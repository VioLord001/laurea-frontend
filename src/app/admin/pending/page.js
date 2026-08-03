'use client';
import { useState, useEffect } from 'react';

export default function PendingEmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState('');
  const api = process.env.NEXT_PUBLIC_API_URL;

  const getToken = () => localStorage.getItem('laurea_token') || '';

  useEffect(() => {
    const token = localStorage.getItem('laurea_token');
    if (!token) { setLoading(false); return; }
    fetch(`${api}/admin/pending-employees`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { setEmployees(data.employees || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleApprove = async (id, name) => {
    const res = await fetch(`${api}/admin/approve-employee/${id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved: true })
    });
    const data = await res.json();
    if (data.success) {
      setEmployees(employees.filter(e => e.id !== id));
      setMessage(`✅ ${name} has been approved! They will receive an email.`);
    } else {
      setMessage(`❌ ${data.message}`);
    }
    setTimeout(() => setMessage(''), 5000);
  };

  const handleReject = async (id, name) => {
    const res = await fetch(`${api}/admin/approve-employee/${id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved: false, reason })
    });
    const data = await res.json();
    if (data.success) {
      setEmployees(employees.filter(e => e.id !== id));
      setMessage(`✅ ${name} has been rejected. They will receive an email.`);
      setRejecting(null);
      setReason('');
    } else {
      setMessage(`❌ ${data.message}`);
    }
    setTimeout(() => setMessage(''), 5000);
  };

  return (
    <div>
      <div style={{marginBottom:'1.5rem'}}>
        <h1 style={{fontSize:'24px',fontWeight:'600',color:'#1c1208'}}>Pending Employee Applications</h1>
        <p style={{fontSize:'13px',color:'#8a7a6a',marginTop:'4px'}}>{employees.length} pending review</p>
      </div>

      <div style={{background:'#fdf6ec',border:'1px solid #f0c040',borderRadius:'10px',padding:'12px 16px',marginBottom:'1.25rem',fontSize:'12px',color:'#8a7a6a',lineHeight:'1.7'}}>
        💡 Review each employee application carefully. Check their details and ID before approving. They will receive an email notification when you approve or reject.
      </div>

      {message && (
        <div style={{background:message.includes('❌')?'#fff0f0':'#f0fff4',border:`1px solid ${message.includes('❌')?'#ffcccc':'#ccffcc'}`,padding:'12px 16px',borderRadius:'8px',marginBottom:'1rem',fontSize:'13px',color:'#1c1208'}}>
          {message}
        </div>
      )}

      {loading ? (
        <div style={{textAlign:'center',padding:'3rem',color:'#8a7a6a'}}>Loading...</div>
      ) : employees.length === 0 ? (
        <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'3rem',textAlign:'center'}}>
          <div style={{fontSize:'48px',marginBottom:'1rem'}}>✅</div>
          <h3 style={{fontSize:'16px',color:'#1c1208',marginBottom:'8px'}}>No pending applications</h3>
          <p style={{fontSize:'13px',color:'#8a7a6a'}}>All employee applications have been reviewed</p>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
          {employees.map(emp => (
            <div key={emp.id} style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'1.5rem'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:'1rem',alignItems:'start'}}>
                <div>
                  <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}>
                    <div style={{width:'44px',height:'44px',borderRadius:'50%',background:'#f5ede0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px'}}>👤</div>
                    <div>
                      <div style={{fontSize:'16px',fontWeight:'600',color:'#1c1208'}}>{emp.first_name} {emp.last_name}</div>
                      <div style={{fontSize:'12px',color:'#8a7a6a'}}>{emp.email}</div>
                    </div>
                  </div>
                  <div style={{display:'flex',gap:'16px',flexWrap:'wrap',fontSize:'12px',color:'#8a7a6a'}}>
                    <span>📅 Registered: {new Date(emp.created_at).toLocaleDateString()}</span>
                    <span>📧 Email {emp.is_email_verified ? '✅ Verified' : '❌ Not verified'}</span>
                    <span>🔑 Logins: {emp.login_count || 0}</span>
                  </div>
                </div>

                <div style={{display:'flex',gap:'8px',flexDirection:'column',minWidth:'160px'}}>
                  <button onClick={()=>handleApprove(emp.id, `${emp.first_name} ${emp.last_name}`)}
                    style={{background:'#eaf3de',color:'#3b6d11',border:'1px solid #97c459',padding:'10px 16px',fontSize:'12px',fontWeight:'600',cursor:'pointer',borderRadius:'6px',textTransform:'uppercase',letterSpacing:'1px'}}>
                    ✅ Approve
                  </button>
                  <button onClick={()=>setRejecting(emp.id)}
                    style={{background:'#fff0f0',color:'#cc0000',border:'1px solid #ffcccc',padding:'10px 16px',fontSize:'12px',fontWeight:'600',cursor:'pointer',borderRadius:'6px',textTransform:'uppercase',letterSpacing:'1px'}}>
                    ❌ Reject
                  </button>
                </div>
              </div>

              {rejecting === emp.id && (
                <div style={{marginTop:'1rem',padding:'1rem',background:'#fff0f0',border:'1px solid #ffcccc',borderRadius:'8px'}}>
                  <p style={{fontSize:'13px',fontWeight:'600',color:'#cc0000',marginBottom:'8px'}}>Reason for rejection (will be sent to employee):</p>
                  <textarea
                    value={reason}
                    onChange={e=>setReason(e.target.value)}
                    placeholder="e.g. Invalid ID photo, incomplete information, fake details..."
                    style={{width:'100%',border:'1px solid #ffcccc',padding:'10px',fontSize:'13px',borderRadius:'6px',minHeight:'80px',boxSizing:'border-box',marginBottom:'10px',resize:'vertical'}}
                  />
                  <div style={{display:'flex',gap:'8px'}}>
                    <button onClick={()=>handleReject(emp.id, `${emp.first_name} ${emp.last_name}`)}
                      style={{background:'#cc0000',color:'#fff',border:'none',padding:'10px 20px',fontSize:'12px',fontWeight:'600',cursor:'pointer',borderRadius:'6px',textTransform:'uppercase'}}>
                      Confirm Rejection
                    </button>
                    <button onClick={()=>{ setRejecting(null); setReason(''); }}
                      style={{background:'none',border:'1px solid #e0d8cc',padding:'10px 20px',fontSize:'12px',cursor:'pointer',borderRadius:'6px',color:'#8a7a6a'}}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}