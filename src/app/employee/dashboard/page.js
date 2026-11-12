'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EmployeeDashboardPage() {
  const [employee, setEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [receipts, setReceipts] = useState([]);
  const [receiptsLoading, setReceiptsLoading] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [receiptToast, setReceiptToast] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bankForm, setBankForm] = useState({
    bank1_holder:'', bank1_name:'', bank1_agency:'', bank1_account:'', bank1_pix:'', bank1_cpf:'',
    bank2_holder:'', bank2_name:'', bank2_agency:'', bank2_account:'', bank2_pix:'', bank2_cpf:''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
  
  // Load pending receipts when receipts tab is active
  useEffect(() => {
    const loadReceipts = async () => {
      if (activeTab !== 'receipts') return;
      setReceiptsLoading(true);
      try {
        const res = await fetch('/api/admin/receipts');
        const data = await res.json();
        setReceipts(data.receipts || []);
      } catch {}
      finally { setReceiptsLoading(false); }
    };
    loadReceipts();
    const interval = setInterval(loadReceipts, 20000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleReceiptAction = async (orderId, action) => {
    try {
      await fetch('/api/admin/confirm', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId, action }) });
      setReceiptToast(action === 'approve' ? '✅ Order approved!' : '❌ Order rejected');
      setTimeout(() => setReceiptToast(''), 3000);
      setSelectedReceipt(null);
      const res = await fetch('/api/admin/receipts');
      const data = await res.json();
      setReceipts(data.receipts || []);
    } catch { setReceiptToast('Failed. Please try again.'); setTimeout(() => setReceiptToast(''), 3000); }
  };

  return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('laurea_user');
    if (!stored) { router.push('/employee/login'); return; }
    const emp = JSON.parse(stored);
    if (emp.role !== 'employee') { router.push('/'); return; }
    if (!emp.employee_profile_completed) { router.push('/employee/setup'); return; }
    setEmployee(emp);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('laurea_token');
    localStorage.removeItem('laurea_user');
    router.push('/employee/login');
  };

  const handleSaveBank = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    const token = localStorage.getItem('laurea_token');
    try {
      const res = await fetch(`${api}/employees/bank-details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(bankForm)
      });
      const data = await res.json();
      if (data.success) { setMessage('success'); } else { setMessage('error'); alert(data.message || 'Please fill in all required fields.'); }
    } catch { setMessage('error'); }
    setSaving(false);
    setTimeout(() => setMessage(''), 6000);
  };

  if (!employee) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f0f4ff'}}>
      <div style={{width:'36px',height:'36px',border:'3px solid #2563eb',borderTopColor:'transparent',borderRadius:'50%'}}></div>
    </div>
  );

  if (employee.is_approved === false) {
    return (
      <div style={{minHeight:'100vh',background:'#f0f4ff',display:'flex',alignItems:'center',justifyContent:'center',padding:'1.5rem'}}>
        <div style={{background:'#fff',border:'1px solid #dbeafe',borderRadius:'20px',padding:'2.5rem 1.5rem',maxWidth:'420px',width:'100%',textAlign:'center',boxShadow:'0 4px 20px rgba(37,99,235,0.08)'}}>
          <div style={{width:'72px',height:'72px',background:'#eff6ff',border:'2px solid #bfdbfe',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'32px',margin:'0 auto 1.5rem'}}>⏳</div>
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#1e3a8a',marginBottom:'8px'}}>Application Under Review</h1>
          <p style={{fontSize:'13px',color:'#64748b',lineHeight:'1.8',marginBottom:'1.5rem'}}>Your application is being reviewed. You will receive an email once approved.</p>
          <div style={{background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:'10px',padding:'1rem',marginBottom:'1.5rem',fontSize:'13px',color:'#3b82f6'}}>⏱️ Reviews typically take <strong>24-48 hours.</strong></div>
          <div style={{fontSize:'12px',color:'#94a3b8',marginBottom:'1.5rem'}}>{employee.first_name} {employee.last_name} · {employee.email}</div>
          <button onClick={handleLogout} style={{background:'#eff6ff',border:'1px solid #bfdbfe',color:'#2563eb',padding:'11px 24px',fontSize:'13px',cursor:'pointer',borderRadius:'10px',fontFamily:'inherit',fontWeight:'500'}}>Sign Out</button>
        </div>
      </div>
    );
  }

  const tabs = [
    {id:'dashboard',icon:'🏠',label:'Overview'},
    {id:'profile',icon:'👤',label:'My Profile'},
    {id:'bank',icon:'🏦',label:'Bank Details'},
    {id:'tasks',icon:'📋',label:'Tasks'},
    {id:'earnings',icon:'💰',label:'Earnings'},
  ];

  const inp = {width:'100%',border:'1px solid #e2e8f0',padding:'12px 14px',fontSize:'14px',color:'#1e293b',outline:'none',borderRadius:'10px',background:'#f8fafc',boxSizing:'border-box',marginBottom:'12px',fontFamily:'Inter,sans-serif',transition:'border-color 0.2s'};
  const lbl = {fontSize:'11px',fontWeight:'600',color:'#64748b',textTransform:'uppercase',letterSpacing:'0.8px',display:'block',marginBottom:'5px'};
  const getInitials = () => `${employee.first_name?.[0]||""}${employee.last_name?.[0]||""}`.toUpperCase();

  return (
    <div style={{minHeight:'100vh',background:'#f0f4ff',fontFamily:"'Inter',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input,select,textarea { font-family: 'Inter',sans-serif; }
        input:focus,select:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.1) !important; outline: none; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .tab-content { animation: fadeIn 0.2s ease; }
      `}</style>

      <div style={{background:'#1e3a8a',padding:'0.875rem 1rem',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:50,boxShadow:'0 2px 8px rgba(30,58,138,0.3)'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <button onClick={()=>setSidebarOpen(!sidebarOpen)} style={{background:'rgba(255,255,255,0.1)',border:'none',color:'#fff',fontSize:'16px',cursor:'pointer',padding:'6px 8px',borderRadius:'8px',lineHeight:1}}>☰</button>
          <div>
            <div style={{fontSize:'13px',fontWeight:'700',color:'#fff',letterSpacing:'3px',textTransform:'uppercase'}}>Laurea</div>
            <div style={{fontSize:'9px',color:'rgba(255,255,255,0.6)',letterSpacing:'2px',textTransform:'uppercase'}}>Employee Portal</div>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:'12px',fontWeight:'600',color:'#fff'}}>{employee.first_name}</div>
            <div style={{fontSize:'10px',color:'rgba(255,255,255,0.6)',textTransform:'capitalize'}}>{employee.job_position||'Employee'}</div>
          </div>
          <div style={{width:'34px',height:'34px',borderRadius:'50%',background:'linear-gradient(135deg,#60a5fa,#2563eb)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:'700',color:'#fff',border:'2px solid rgba(255,255,255,0.3)'}}>
            {getInitials()}
          </div>
        </div>
      </div>

      {sidebarOpen && <div onClick={()=>setSidebarOpen(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',zIndex:98}} />}

      <div style={{position:'fixed',top:0,left:sidebarOpen?'0':'-260px',width:'260px',height:'100%',background:'#fff',zIndex:99,transition:'left 0.3s ease',display:'flex',flexDirection:'column',boxShadow:'4px 0 24px rgba(0,0,0,0.12)'}}>
        <div style={{background:'#1e3a8a',padding:'1.5rem',display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{width:'40px',height:'40px',borderRadius:'50%',background:'linear-gradient(135deg,#60a5fa,#2563eb)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'15px',fontWeight:'700',color:'#fff'}}>{getInitials()}</div>
          <div>
            <div style={{fontSize:'14px',fontWeight:'700',color:'#fff'}}>{employee.first_name} {employee.last_name}</div>
            <div style={{fontSize:'11px',color:'rgba(255,255,255,0.6)',textTransform:'capitalize'}}>{employee.job_position||'Employee'}</div>
          </div>
        </div>
        <nav style={{flex:1,padding:'0.75rem 0',overflowY:'auto'}}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={()=>{ setActiveTab(tab.id); setSidebarOpen(false); }}
              style={{width:'100%',display:'flex',alignItems:'center',gap:'12px',padding:'13px 1.25rem',background:activeTab===tab.id?'#eff6ff':'transparent',border:'none',borderLeft:activeTab===tab.id?'3px solid #2563eb':'3px solid transparent',cursor:'pointer',fontSize:'14px',color:activeTab===tab.id?'#2563eb':'#475569',textAlign:'left',fontFamily:'inherit',fontWeight:activeTab===tab.id?'600':'400',transition:'all 0.15s'}}>
              <span style={{fontSize:'18px'}}>{tab.icon}</span><span>{tab.label}</span>
            </button>
          ))}
        </nav>
        <div style={{padding:'1rem 1.25rem',borderTop:'1px solid #f1f5f9'}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:'6px',fontSize:'12px',color:'#94a3b8',textDecoration:'none',marginBottom:'8px'}}>← Main Website</Link>
          <button onClick={handleLogout} style={{width:'100%',background:'#fef2f2',border:'1px solid #fecaca',color:'#dc2626',padding:'11px',fontSize:'13px',cursor:'pointer',borderRadius:'8px',fontFamily:'inherit',fontWeight:'500'}}>Sign Out</button>
        </div>
      </div>

      <div style={{padding:'1rem',maxWidth:'520px',margin:'0 auto'}}>

        {activeTab === 'dashboard' && (
          <div className="tab-content">
            <div style={{marginBottom:'1.5rem',paddingTop:'0.25rem'}}>
              <h1 style={{fontSize:'20px',fontWeight:'700',color:'#1e3a8a',marginBottom:'2px'}}>Good {new Date().getHours()<12?'morning':new Date().getHours()<17?'afternoon':'evening'}, {employee.first_name} 👋</h1>
              <p style={{fontSize:'13px',color:'#64748b'}}>Welcome to your employee portal.</p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem',marginBottom:'1.25rem'}}>
              {[
                {label:'Tasks',value:'0',icon:'📋',color:'#2563eb'},
                {label:'Earnings',value:'$0',icon:'💰',color:'#16a34a'},
                {label:'Days Active',value:'1',icon:'📅',color:'#0284c7'},
                {label:'Status',value:'Active',icon:'✅',color:'#16a34a'},
              ].map((stat,i) => (
                <div key={i} style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'14px',padding:'1rem',boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
                  <div style={{fontSize:'24px',marginBottom:'8px'}}>{stat.icon}</div>
                  <div style={{fontSize:'22px',fontWeight:'700',color:stat.color,marginBottom:'2px'}}>{stat.value}</div>
                  <div style={{fontSize:'11px',color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.6px'}}>{stat.label}</div>
                </div>
              ))}
            </div>
            <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'14px',padding:'1.25rem',marginBottom:'1rem',boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
                <span style={{fontSize:'14px',fontWeight:'600',color:'#1e293b'}}>Employment Details</span>
                <button onClick={()=>setActiveTab('profile')} style={{background:'none',border:'none',color:'#2563eb',fontSize:'12px',cursor:'pointer',fontFamily:'inherit',fontWeight:'500'}}>View all →</button>
              </div>
              {[
                {label:'Position',value:employee.job_position||'—'},
                {label:'Department',value:employee.department||'—'},
                {label:'Type',value:employee.employment_type?.replace(/_/g,' ')||'—'},
              ].map((item,i) => (
                <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:i<2?'1px solid #f1f5f9':'none'}}>
                  <span style={{fontSize:'12px',color:'#64748b',textTransform:'uppercase',letterSpacing:'0.6px',fontWeight:'600'}}>{item.label}</span>
                  <span style={{fontSize:'13px',color:'#1e293b',fontWeight:'500',textTransform:'capitalize'}}>{item.value}</span>
                </div>
              ))}
            </div>
            <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'14px',padding:'1.25rem',boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
              <div style={{fontSize:'14px',fontWeight:'600',color:'#1e293b',marginBottom:'1rem'}}>Quick Actions</div>
              <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                {[{label:'Add Bank Details',tab:'bank',icon:'🏦'},{label:'View Profile',tab:'profile',icon:'👤'},{label:'My Tasks',tab:'tasks',icon:'📋'}].map((action,i) => (
                  <button key={i} onClick={()=>setActiveTab(action.tab)} style={{background:'#f8fafc',border:'1px solid #e2e8f0',color:'#1e293b',padding:'12px 16px',fontSize:'13px',fontWeight:'500',cursor:'pointer',borderRadius:'10px',display:'flex',alignItems:'center',gap:'10px',fontFamily:'inherit',textAlign:'left'}}>
                    <span style={{fontSize:'18px'}}>{action.icon}</span><span>{action.label}</span><span style={{marginLeft:'auto',color:'#94a3b8'}}>→</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="tab-content">
            <h1 style={{fontSize:'20px',fontWeight:'700',color:'#1e3a8a',marginBottom:'1.25rem',paddingTop:'0.25rem'}}>My Profile</h1>
            <div style={{background:'#1e3a8a',borderRadius:'14px',padding:'1.25rem',display:'flex',alignItems:'center',gap:'12px',marginBottom:'1rem'}}>
              <div style={{width:'52px',height:'52px',borderRadius:'50%',background:'linear-gradient(135deg,#60a5fa,#2563eb)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',fontWeight:'700',color:'#fff',flexShrink:0}}>{getInitials()}</div>
              <div>
                <div style={{fontSize:'16px',fontWeight:'700',color:'#fff'}}>{employee.first_name} {employee.last_name}</div>
                <div style={{fontSize:'12px',color:'rgba(255,255,255,0.7)',marginBottom:'6px'}}>{employee.email}</div>
                <div style={{display:'inline-flex',alignItems:'center',gap:'5px',background:'rgba(74,222,128,0.2)',border:'1px solid rgba(74,222,128,0.4)',borderRadius:'6px',padding:'3px 10px',fontSize:'10px',color:'#4ade80'}}>
                  <span style={{width:'5px',height:'5px',background:'#4ade80',borderRadius:'50%'}}></span>Active
                </div>
              </div>
            </div>
            <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'14px',overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
              {[
                {label:'First Name',value:employee.first_name},{label:'Last Name',value:employee.last_name},
                {label:'Email',value:employee.email},{label:'Phone',value:employee.phone},
                {label:'Role',value:employee.role},{label:'Nationality',value:employee.nationality},
                {label:'Country',value:employee.country_of_residence},{label:'City',value:employee.city},
              ].map((field,i,arr) => (
                <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 1.25rem',borderBottom:i<arr.length-1?'1px solid #f1f5f9':'none'}}>
                  <span style={{fontSize:'12px',color:'#64748b',textTransform:'uppercase',letterSpacing:'0.6px',fontWeight:'600'}}>{field.label}</span>
                  <span style={{fontSize:'13px',color:field.value?'#1e293b':'#cbd5e1',fontWeight:'500',maxWidth:'55%',textAlign:'right'}}>{field.value||'—'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bank' && (
          <div className="tab-content">
            <h1 style={{fontSize:'20px',fontWeight:'700',color:'#1e3a8a',marginBottom:'4px',paddingTop:'0.25rem'}}>🏦 Bank Details</h1>
            <p style={{fontSize:'13px',color:'#64748b',marginBottom:'1.5rem'}}>Add up to two bank accounts for receiving payments.</p>
            {message === 'success' && <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:'10px',padding:'14px',marginBottom:'1.25rem',fontSize:'13px',color:'#15803d'}}>✅ Bank details saved! Cards have been sent by email.</div>}
            {message === 'error' && <div style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:'10px',padding:'14px',marginBottom:'1.25rem',fontSize:'13px',color:'#dc2626'}}>❌ Failed to save. Please fill in all required fields.</div>}
            <form onSubmit={handleSaveBank}>
              {[1,2].map(n => (
                <div key={n} style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'14px',padding:'1.25rem',marginBottom:'1rem',boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'1.25rem',paddingBottom:'0.875rem',borderBottom:'1px solid #f1f5f9'}}>
                    <div style={{width:'30px',height:'30px',borderRadius:'8px',background:'#eff6ff',border:'1px solid #bfdbfe',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:'700',color:'#2563eb'}}>{n}</div>
                    <div><div style={{fontSize:'14px',fontWeight:'600',color:'#1e293b'}}>Bank Account {n}</div><div style={{fontSize:'11px',color:'#94a3b8'}}>Fields marked * are required</div></div>
                  </div>
                  <label style={lbl}>Account Holder *</label>
                  <input style={inp} value={bankForm[`bank${n}_holder`]} onChange={e=>setBankForm({...bankForm,[`bank${n}_holder`]:e.target.value})} placeholder="Full name" required />
                  <label style={lbl}>Bank Name *</label>
                  <input style={inp} value={bankForm[`bank${n}_name`]} onChange={e=>setBankForm({...bankForm,[`bank${n}_name`]:e.target.value})} placeholder="e.g. Itau, Nubank" required />
                  <label style={lbl}>Agency</label>
                  <input style={inp} value={bankForm[`bank${n}_agency`]} onChange={e=>setBankForm({...bankForm,[`bank${n}_agency`]:e.target.value})} placeholder="e.g. 0001" />
                  <label style={lbl}>Account Number *</label>
                  <input style={inp} value={bankForm[`bank${n}_account`]} onChange={e=>setBankForm({...bankForm,[`bank${n}_account`]:e.target.value})} placeholder="e.g. 12345-6" required />
                  <label style={lbl}>PIX Key *</label>
                  <input style={inp} value={bankForm[`bank${n}_pix`]} onChange={e=>setBankForm({...bankForm,[`bank${n}_pix`]:e.target.value})} placeholder="CPF, email, phone or random key" required />
                  <label style={lbl}>CPF *</label>
                  <input style={inp} value={bankForm[`bank${n}_cpf`]} onChange={e=>setBankForm({...bankForm,[`bank${n}_cpf`]:e.target.value})} placeholder="000.000.000-00" required />
                </div>
              ))}
              <div style={{background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:'10px',padding:'12px 14px',fontSize:'12px',color:'#3b82f6',marginBottom:'1.25rem',lineHeight:'1.8'}}>
                🔒 Your bank details are secure and encrypted.<br/>📧 Card will be sent to <strong>{employee.email}</strong>
              </div>
              <button type="submit" disabled={saving} style={{width:'100%',background:'linear-gradient(135deg,#2563eb,#1d4ed8)',color:'#fff',border:'none',padding:'14px',fontSize:'14px',fontWeight:'600',cursor:'pointer',borderRadius:'12px',fontFamily:'inherit',opacity:saving?0.7:1,boxShadow:'0 2px 10px rgba(37,99,235,0.3)'}}>
                {saving ? '📤 Saving...' : '💾 Save & Send Card by Email'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="tab-content">
            <h1 style={{fontSize:'20px',fontWeight:'700',color:'#1e3a8a',marginBottom:'1.25rem',paddingTop:'0.25rem'}}>My Tasks</h1>
            <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'14px',padding:'2.5rem 1.5rem',textAlign:'center',boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
              <div style={{fontSize:'44px',marginBottom:'1rem'}}>📋</div>
              <h3 style={{fontSize:'15px',color:'#475569',marginBottom:'6px',fontWeight:'600'}}>No tasks yet</h3>
              <p style={{fontSize:'13px',color:'#94a3b8'}}>Tasks assigned to you will appear here.</p>
            </div>
          </div>
        )}

        
          {activeTab === 'receipts' && (
            <div>
              {receiptToast && (
                <div style={{ position: 'fixed', top: '20px', right: '20px', background: receiptToast.startsWith('✅') ? '#16a34a' : receiptToast.startsWith('❌') ? '#dc2626' : '#1c1208', color: '#fff', padding: '12px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', zIndex: 9999, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>{receiptToast}</div>
              )}
              {selectedReceipt && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setSelectedReceipt(null)}>
                  <div style={{ background: '#fff', borderRadius: '14px', padding: '1.5rem', maxWidth: '480px', width: '100%', maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1c1208', margin: 0 }}>Receipt — Order #{selectedReceipt.orderId}</h3>
                      <button onClick={() => setSelectedReceipt(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#8a7a6a' }}>✕</button>
                    </div>
                    <div style={{ background: '#faf8f5', borderRadius: '8px', padding: '12px', marginBottom: '1rem', fontSize: '13px', color: '#1c1208', lineHeight: '1.7' }}>
                      <div><strong>Order:</strong> #{selectedReceipt.orderId}</div>
                      <div><strong>Total:</strong> ${selectedReceipt.total}</div>
                      {selectedReceipt.items && <div><strong>Items:</strong> {selectedReceipt.items}</div>}
                      <div><strong>Submitted:</strong> {new Date(selectedReceipt.submittedAt).toLocaleString()}</div>
                      <div><strong>Status:</strong> <span style={{ textTransform: 'capitalize', fontWeight: '600', color: selectedReceipt.status === 'approved' ? '#16a34a' : selectedReceipt.status === 'rejected' ? '#dc2626' : '#b8966a' }}>{selectedReceipt.status}</span></div>
                    </div>
                    {selectedReceipt.receiptUrl && (
                      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                        {selectedReceipt.receiptUrl.endsWith('.pdf') ? (
                          <a href={selectedReceipt.receiptUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#b8966a', fontSize: '13px' }}>📄 View PDF Receipt</a>
                        ) : (
                          <img src={selectedReceipt.receiptUrl} alt="Receipt" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', objectFit: 'contain', border: '1px solid #e0d8cc' }} />
                        )}
                      </div>
                    )}
                    {selectedReceipt.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => handleReceiptAction(selectedReceipt.orderId, 'approve')} style={{ flex: 1, background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>✓ Approve Order</button>
                        <button onClick={() => handleReceiptAction(selectedReceipt.orderId, 'reject')} style={{ flex: 1, background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>✗ Reject</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1c1208', margin: '0 0 4px' }}>Receipt Confirmations</h2>
                  <p style={{ fontSize: '12px', color: '#8a7a6a', margin: 0 }}>Auto-refreshes every 20 seconds</p>
                </div>
                <div style={{ background: receipts.filter(r => r.status === 'pending').length > 0 ? '#fef3c7' : '#f0fdf4', border: `1px solid ${receipts.filter(r => r.status === 'pending').length > 0 ? '#fbbf24' : '#86efac'}`, borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: '600', color: receipts.filter(r => r.status === 'pending').length > 0 ? '#92400e' : '#166534' }}>
                  {receipts.filter(r => r.status === 'pending').length} pending
                </div>
              </div>
              {receiptsLoading && receipts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#8a7a6a', fontSize: '13px' }}>Loading receipts...</div>
              ) : receipts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#8a7a6a' }}>
                  <p style={{ fontSize: '36px', margin: '0 0 12px' }}>🧾</p>
                  <p style={{ fontSize: '14px', margin: 0 }}>No receipts yet. When a customer submits a WhatsApp payment receipt, it will appear here.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[...receipts].reverse().map((r, i) => (
                    <div key={i} style={{ background: '#fff', border: `1px solid ${r.status === 'pending' ? '#fbbf24' : r.status === 'approved' ? '#86efac' : '#fca5a5'}`, borderRadius: '10px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setSelectedReceipt(r)}>
                      <div style={{ width: '48px', height: '48px', background: '#faf8f5', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, border: '1px solid #e0d8cc' }}>
                        {r.receiptUrl && !r.receiptUrl.endsWith('.pdf') ? (
                          <img src={r.receiptUrl} alt="Receipt" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📄</div>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#1c1208', margin: '0 0 2px' }}>Order #{r.orderId}</p>
                        <p style={{ fontSize: '11px', color: '#8a7a6a', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.items}</p>
                        <p style={{ fontSize: '11px', color: '#8a7a6a', margin: 0 }}>{new Date(r.submittedAt).toLocaleString()}</p>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontSize: '14px', fontWeight: '700', color: '#1c1208', margin: '0 0 4px' }}>${r.total}</p>
                        <span style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '3px 8px', borderRadius: '20px', background: r.status === 'pending' ? '#fef3c7' : r.status === 'approved' ? '#dcfce7' : '#fee2e2', color: r.status === 'pending' ? '#92400e' : r.status === 'approved' ? '#166534' : '#991b1b' }}>{r.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'earnings' && (
          <div className="tab-content">
            <h1 style={{fontSize:'20px',fontWeight:'700',color:'#1e3a8a',marginBottom:'1.25rem',paddingTop:'0.25rem'}}>Earnings</h1>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'0.75rem',marginBottom:'1rem'}}>
              {[{label:'Total',value:'$0.00',color:'#2563eb'},{label:'Month',value:'$0.00',color:'#16a34a'},{label:'Pending',value:'$0.00',color:'#0284c7'}].map((stat,i) => (
                <div key={i} style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'12px',padding:'1rem 0.75rem',textAlign:'center',boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
                  <div style={{fontSize:'18px',fontWeight:'700',color:stat.color,marginBottom:'4px'}}>{stat.value}</div>
                  <div style={{fontSize:'10px',color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.5px'}}>{stat.label}</div>
                </div>
              ))}
            </div>
            <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:'14px',padding:'2.5rem 1.5rem',textAlign:'center',boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
              <div style={{fontSize:'44px',marginBottom:'1rem'}}>💰</div>
              <h3 style={{fontSize:'15px',color:'#475569',marginBottom:'6px',fontWeight:'600'}}>No earnings yet</h3>
              <p style={{fontSize:'13px',color:'#94a3b8',marginBottom:'1rem'}}>Add your bank details to start receiving payments.</p>
              <button onClick={()=>setActiveTab('bank')} style={{background:'#eff6ff',border:'1px solid #bfdbfe',color:'#2563eb',padding:'10px 20px',fontSize:'13px',cursor:'pointer',borderRadius:'8px',fontFamily:'inherit',fontWeight:'500'}}>Add Bank Details →</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
