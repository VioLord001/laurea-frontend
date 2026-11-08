'use client';
import { useState, useEffect } from 'react';

export default function LoginActivityPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const token = localStorage.getItem('laurea_token');
    if (!token) { setLoading(false); return; }
    fetch(`${api}/admin/login-activity`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { setSessions(data.sessions || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const getDeviceIcon = (device) => {
    if (!device) return '💻';
    const d = device.toLowerCase();
    if (d.includes('mobile') || d.includes('android') || d.includes('iphone')) return '📱';
    if (d.includes('tablet') || d.includes('ipad')) return '📱';
    if (d.includes('mac')) return '💻';
    if (d.includes('windows')) return '🖥️';
    return '💻';
  };

  const getBrowserName = (device) => {
    if (!device) return 'Unknown';
    const d = device.toLowerCase();
    if (d.includes('chrome')) return 'Chrome';
    if (d.includes('firefox')) return 'Firefox';
    if (d.includes('safari') && !d.includes('chrome')) return 'Safari';
    if (d.includes('edge')) return 'Edge';
    if (d.includes('opera')) return 'Opera';
    return 'Unknown Browser';
  };

  const getOSName = (device) => {
    if (!device) return 'Unknown';
    const d = device.toLowerCase();
    if (d.includes('windows')) return 'Windows';
    if (d.includes('mac os')) return 'macOS';
    if (d.includes('android')) return 'Android';
    if (d.includes('iphone') || d.includes('ipad')) return 'iOS';
    if (d.includes('linux')) return 'Linux';
    return 'Unknown OS';
  };

  const getRoleBadge = (role) => {
    if (role === 'admin') return { bg:'#1c1208', color:'#b8966a', label:'Admin' };
    if (role === 'employee') return { bg:'#1a3a6b', color:'#7eb3ff', label:'Employee' };
    return { bg:'#f0ece8', color:'#8a7a6a', label:'Customer' };
  };

  const filtered = filter === 'all' ? sessions : sessions.filter(s => s.role === filter);

  const formatTime = (ts) => {
    if (!ts) return '—';
    const d = new Date(ts);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
  };

  return (
    <div>
      <div style={{marginBottom:'1.5rem'}}>
        <h1 style={{fontSize:'24px',fontWeight:'600',color:'#1c1208'}}>Login Activity</h1>
        <p style={{fontSize:'13px',color:'#8a7a6a',marginTop:'4px'}}>{sessions.length} login sessions recorded</p>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'1.5rem'}}>
        {[
          {icon:'👥',label:'Total Logins',value:sessions.length},
          {icon:'🧑‍💼',label:'Employee Logins',value:sessions.filter(s=>s.role==='employee').length},
          {icon:'⚙️',label:'Admin Logins',value:sessions.filter(s=>s.role==='admin').length},
          {icon:'🛍️',label:'Customer Logins',value:sessions.filter(s=>s.role==='customer').length},
        ].map((stat,i) => (
          <div key={i} style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'1rem'}}>
            <div style={{fontSize:'24px',marginBottom:'4px'}}>{stat.icon}</div>
            <div style={{fontSize:'20px',fontWeight:'600',color:'#1c1208'}}>{stat.value}</div>
            <div style={{fontSize:'11px',color:'#8a7a6a',textTransform:'uppercase',letterSpacing:'0.5px'}}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{display:'flex',gap:'8px',marginBottom:'1.25rem'}}>
        {['all','customer','employee','admin'].map(f => (
          <button key={f} onClick={()=>setFilter(f)}
            style={{padding:'6px 16px',fontSize:'12px',fontWeight:'600',border:`1px solid ${filter===f?'#1c1208':'#e0d8cc'}`,background:filter===f?'#1c1208':'#fff',color:filter===f?'#f5ede0':'#8a7a6a',borderRadius:'6px',cursor:'pointer',textTransform:'capitalize'}}>
            {f === 'all' ? 'All Users' : f}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{textAlign:'center',padding:'3rem',color:'#8a7a6a'}}>Loading activity...</div>
      ) : filtered.length === 0 ? (
        <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'3rem',textAlign:'center'}}>
          <div style={{fontSize:'48px',marginBottom:'1rem'}}>🔔</div>
          <p style={{fontSize:'13px',color:'#8a7a6a'}}>No login activity yet</p>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
          {filtered.map((session, i) => {
            const badge = getRoleBadge(session.role);
            return (
              <div key={i} style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'1rem',display:'grid',gridTemplateColumns:'auto 1fr auto',gap:'1rem',alignItems:'center'}}>

                {/* Device icon */}
                <div style={{width:'48px',height:'48px',background:'#faf8f5',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px',flexShrink:0}}>
                  {getDeviceIcon(session.device)}
                </div>

                {/* Main info */}
                <div>
                  <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px',flexWrap:'wrap'}}>
                    <span style={{fontSize:'14px',fontWeight:'600',color:'#1c1208'}}>
                      {session.first_name} {session.last_name}
                    </span>
                    <span style={{...badge,padding:'2px 8px',borderRadius:'20px',fontSize:'9px',fontWeight:'600',textTransform:'uppercase'}}>
                      {badge.label}
                    </span>
                  </div>
                  <div style={{fontSize:'12px',color:'#8a7a6a',marginBottom:'6px'}}>{session.email}</div>
                  <div style={{display:'flex',gap:'16px',flexWrap:'wrap'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'4px',fontSize:'12px',color:'#8a7a6a'}}>
                      <span>🌍</span>
                      <span>{session.country || 'Unknown'}</span>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:'4px',fontSize:'12px',color:'#8a7a6a'}}>
                      <span>🏙️</span>
                      <span>{session.city || 'Unknown'}</span>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:'4px',fontSize:'12px',color:'#8a7a6a'}}>
                      <span>📍</span>
                      <span>{session.ip_address || 'Unknown'}</span>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:'4px',fontSize:'12px',color:'#8a7a6a'}}>
                      <span>💻</span>
                      <span>{getBrowserName(session.device)} on {getOSName(session.device)}</span>
                    </div>
                  </div>
                </div>

                {/* Time */}
                <div style={{textAlign:'right',flexShrink:0}}>
                  <div style={{fontSize:'12px',fontWeight:'600',color:'#1c1208',marginBottom:'2px'}}>
                    {formatTime(session.logged_in_at)}
                  </div>
                  <div style={{fontSize:'10px',color:'#8a7a6a',textTransform:'uppercase',letterSpacing:'0.5px'}}>
                    🕐 Login Time
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}