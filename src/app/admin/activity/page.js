'use client';
import { useState, useEffect } from 'react';

export default function LoginActivity() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = process.env.NEXT_PUBLIC_API_URL;
  const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('laurea_token') : '';

  useEffect(() => {
    fetch(`${api}/admin/login-activity`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json())
      .then(data => { setSessions(data.sessions || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{marginBottom:'1.5rem'}}>
        <h1 style={{fontSize:'24px',fontWeight:'600',color:'#1c1208'}}>🔔 Login Activity</h1>
        <p style={{fontSize:'13px',color:'#8a7a6a',marginTop:'4px'}}>See every time someone logs into your website</p>
      </div>
      {loading ? (
        <div style={{textAlign:'center',padding:'3rem',color:'#8a7a6a'}}>Loading activity...</div>
      ) : sessions.length === 0 ? (
        <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'3rem',textAlign:'center'}}>
          <div style={{fontSize:'48px',marginBottom:'1rem'}}>🔔</div>
          <h3 style={{fontSize:'16px',color:'#1c1208',marginBottom:'8px'}}>No login activity yet</h3>
          <p style={{fontSize:'13px',color:'#8a7a6a'}}>Activity will appear here when customers log in</p>
        </div>
      ) : (
        <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',overflow:'hidden'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'#faf8f5',borderBottom:'1px solid #e0d8cc'}}>
                {['User','Email','Role','Login Time','IP Address','Device'].map(h=>(
                  <th key={h} style={{padding:'12px 14px',textAlign:'left',fontSize:'10px',fontWeight:'600',color:'#8a7a6a',textTransform:'uppercase',letterSpacing:'0.5px'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sessions.map((session, i) => (
                <tr key={i} style={{borderBottom:'1px solid #f0ece8',background:i%2===0?'#fff':'#fdfcfb'}}>
                  <td style={{padding:'12px 14px',fontSize:'13px',fontWeight:'500',color:'#1c1208'}}>{session.first_name} {session.last_name}</td>
                  <td style={{padding:'12px 14px',fontSize:'12px',color:'#8a7a6a'}}>{session.email}</td>
                  <td style={{padding:'12px 14px'}}>
                    <span style={{background:session.role==='admin'?'#b8966a':'#f0ece8',color:session.role==='admin'?'#1c1208':'#8a7a6a',padding:'3px 10px',borderRadius:'20px',fontSize:'10px',fontWeight:'600',textTransform:'uppercase'}}>{session.role}</span>
                  </td>
                  <td style={{padding:'12px 14px',fontSize:'12px',color:'#8a7a6a'}}>{new Date(session.logged_in_at).toLocaleString()}</td>
                  <td style={{padding:'12px 14px',fontSize:'12px',color:'#8a7a6a'}}>{session.ip_address || 'Unknown'}</td>
                  <td style={{padding:'12px 14px',fontSize:'11px',color:'#8a7a6a',maxWidth:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{session.device ? session.device.substring(0,50) : 'Unknown'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}