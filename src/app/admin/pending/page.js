'use client';
import { useState, useEffect } from 'react';

export default function PendingEmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState('');
  const [viewing, setViewing] = useState(null);
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
      setViewing(null);
      setMessage(`✅ ${name} has been approved! They will receive an email.`);
    } else {
      setMessage(`❌ ${data.message}`);
    }
    setTimeout(() => setMessage(''), 5000);
  };

  const handleReject = async (id, name) => {
    if (!reason.trim()) { alert('Please enter a reason for rejection.'); return; }
    const res = await fetch(`${api}/admin/approve-employee/${id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved: false, reason })
    });
    const data = await res.json();
    if (data.success) {
      setEmployees(employees.filter(e => e.id !== id));
      setViewing(null);
      setRejecting(null);
      setReason('');
      setMessage(`✅ ${name} has been rejected. They will receive an email with your reason.`);
    } else {
      setMessage(`❌ ${data.message}`);
    }
    setTimeout(() => setMessage(''), 5000);
  };

  const field = (label, value) => (
    <div style={{marginBottom:'10px'}}>
      <div style={{fontSize:'10px',color:'#8a7a6a',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'3px'}}>{label}</div>
      <div style={{fontSize:'13px',color:'#1c1208',fontWeight:'500'}}>{value || '—'}</div>
    </div>
  );

  return (
    <div>
      <div style={{marginBottom:'1.5rem'}}>
        <h1 style={{fontSize:'24px',fontWeight:'600',color:'#1c1208'}}>Pending Employee Applications</h1>
        <p style={{fontSize:'13px',color:'#8a7a6a',marginTop:'4px'}}>{employees.length} pending review</p>
      </div>

      <div style={{background:'#fdf6ec',border:'1px solid #f0c040',borderRadius:'10px',padding:'12px 16px',marginBottom:'1.25rem',fontSize:'12px',color:'#8a7a6a',lineHeight:'1.7'}}>
        💡 Click <strong>View Details</strong> to review the employee's full information and uploaded ID before approving or rejecting.
      </div>

      {message && (
        <div style={{background:message.includes('❌')?'#fff0f0':'#f0fff4',border:`1px solid ${message.includes('❌')?'#ffcccc':'#ccffcc'}`,padding:'12px 16px',borderRadius:'8px',marginBottom:'1rem',fontSize:'13px',color:'#1c1208'}}>
          {message}
        </div>
      )}

      {/* Detail view modal */}
      {viewing && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',zIndex:1000,overflowY:'auto',padding:'2rem'}}>
          <div style={{background:'#fff',borderRadius:'16px',maxWidth:'700px',margin:'0 auto',padding:'2rem',position:'relative'}}>
            <button onClick={()=>setViewing(null)}
              style={{position:'absolute',top:'1rem',right:'1rem',background:'none',border:'none',fontSize:'20px',cursor:'pointer',color:'#8a7a6a'}}>
              ✕
            </button>

            <h2 style={{fontSize:'20px',fontWeight:'600',color:'#1c1208',marginBottom:'1.5rem'}}>
              Employee Application — {viewing.first_name} {viewing.last_name}
            </h2>

            {/* Personal Info */}
            <div style={{background:'#faf8f5',border:'1px solid #e0d8cc',borderRadius:'10px',padding:'1.25rem',marginBottom:'1rem'}}>
              <h3 style={{fontSize:'14px',fontWeight:'600',color:'#1c1208',marginBottom:'1rem'}}>👤 Personal Information</h3>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                {field('Full Name', `${viewing.first_name} ${viewing.last_name}`)}
                {field('Email', viewing.email)}
                {field('Registered', new Date(viewing.created_at).toLocaleDateString())}
                {field('Email Verified', viewing.is_email_verified ? '✅ Yes' : '❌ No')}
                {field('Login Count', viewing.login_count || 0)}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{display:'flex',gap:'10px',marginBottom:'1rem'}}>
              <button onClick={()=>handleApprove(viewing.id, `${viewing.first_name} ${viewing.last_name}`)}
                style={{flex:1,background:'#eaf3de',color:'#3b6d11',border:'1px solid #97c459',padding:'12px',fontSize:'13px',fontWeight:'600',cursor:'pointer',borderRadius:'8px',textTransform:'uppercase',letterSpacing:'1px'}}>
                ✅ Approve Employee
              </button>
              <button onClick={()=>setRejecting(viewing.id)}
                style={{flex:1,background:'#fff0f0',color:'#cc0000',border:'1px solid #ffcccc',padding:'12px',fontSize:'13px',fontWeight:'600',cursor:'pointer',borderRadius:'8px',textTransform:'uppercase',letterSpacing:'1px'}}>
                ❌ Reject Application
              </button>
            </div>

            {/* Rejection form */}
            {rejecting === viewing.id && (
              <div style={{background:'#fff0f0',border:'1px solid #ffcccc',borderRadius:'10px',padding:'1rem',marginBottom:'1rem'}}>
                <p style={{fontSize:'13px',fontWeight:'600',color:'#cc0000',marginBottom:'8px'}}>
                  Reason for rejection (will be sent to {viewing.first_name} by email):
                </p>
                <textarea
                  value={reason}
                  onChange={e=>setReason(e.target.value)}
                  placeholder="e.g. Invalid ID photo, information does not match, fake details..."
                  style={{width:'100%',border:'1px solid #ffcccc',padding:'10px',fontSize:'13px',borderRadius:'6px',minHeight:'80px',boxSizing:'border-box',marginBottom:'10px',resize:'vertical'}}
                />
                <div style={{display:'flex',gap:'8px'}}>
                  <button onClick={()=>handleReject(viewing.id, `${viewing.first_name} ${viewing.last_name}`)}
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
              <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:'1rem',alignItems:'center'}}>
                <div>
                  <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}>
                    <div style={{width:'44px',height:'44px',borderRadius:'50%',background:'#f5ede0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px'}}>👤</div>
                    <div>
                      <div style={{fontSize:'16px',fontWeight:'600',color:'#1c1208'}}>{emp.first_name} {emp.last_name}</div>
                      <div style={{fontSize:'12px',color:'#8a7a6a'}}>{emp.email}</div>
                    </div>
                  </div>
                  <div style={{display:'flex',gap:'16px',flexWrap:'wrap',fontSize:'12px',color:'#8a7a6a'}}>
                    <span>📅 {new Date(emp.created_at).toLocaleDateString()}</span>
                    <span>📧 {emp.is_email_verified ? '✅ Verified' : '❌ Not verified'}</span>
                    <span>🔑 Logins: {emp.login_count || 0}</span>
                  </div>
                </div>
                <div style={{display:'flex',gap:'8px',flexDirection:'column'}}>
                  <button onClick={()=>{ setViewing(emp); setRejecting(null); setReason(''); }}
                    style={{background:'#1c1208',color:'#f5ede0',border:'none',padding:'10px 16px',fontSize:'12px',fontWeight:'600',cursor:'pointer',borderRadius:'6px',textTransform:'uppercase',letterSpacing:'1px',whiteSpace:'nowrap'}}>
                    👁️ View Details
                  </button>
                  <button onClick={()=>handleApprove(emp.id, `${emp.first_name} ${emp.last_name}`)}
                    style={{background:'#eaf3de',color:'#3b6d11',border:'1px solid #97c459',padding:'10px 16px',fontSize:'12px',fontWeight:'600',cursor:'pointer',borderRadius:'6px',textTransform:'uppercase',letterSpacing:'1px'}}>
                    ✅ Approve
                  </button>
                  <button onClick={()=>{ setViewing(emp); setRejecting(emp.id); }}
                    style={{background:'#fff0f0',color:'#cc0000',border:'1px solid #ffcccc',padding:'10px 16px',fontSize:'12px',fontWeight:'600',cursor:'pointer',borderRadius:'6px',textTransform:'uppercase',letterSpacing:'1px'}}>
                    ❌ Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}