'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EmployeeDashboardPage() {
  const [employee, setEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bankForm, setBankForm] = useState({ accountName:'', accountNumber:'', bankName:'', bankCode:'', country:'', swiftCode:'', pix:'', cpf:'' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
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

  const isBrazilian = () => {
    if (!employee) return false;
    const nat = (employee.nationality || '').toLowerCase();
    const country = (employee.country_of_residence || '').toLowerCase();
    return nat.includes('brazil') || nat.includes('brasil') || nat.includes('brazilian') || country.includes('brazil') || country.includes('brasil');
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
      setMessage(data.success ? 'success' : 'error');
    } catch { setMessage('error'); }
    setSaving(false);
    setTimeout(() => setMessage(''), 4000);
  };

  if (!employee) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0f0a04'}}>
      <div style={{textAlign:'center'}}>
        <div style={{width:'40px',height:'40px',border:'2px solid #b8966a',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.8s linear infinite',margin:'0 auto'}}></div>
      </div>
    </div>
  );

  if (employee.is_approved === false) {
    return (
      <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0f0a04 0%,#1c1208 50%,#2d1f0a 100%)',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem'}}>
        <div style={{background:'rgba(255,255,255,0.03)',backdropFilter:'blur(20px)',border:'1px solid rgba(184,150,106,0.2)',borderRadius:'24px',padding:'3rem',maxWidth:'480px',width:'100%',textAlign:'center'}}>
          <div style={{width:'80px',height:'80px',background:'rgba(184,150,106,0.1)',border:'2px solid rgba(184,150,106,0.3)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'36px',margin:'0 auto 1.5rem'}}>⏳</div>
          <h1 style={{fontSize:'24px',fontWeight:'600',color:'#f5ede0',marginBottom:'8px'}}>Under Review</h1>
          <p style={{fontSize:'14px',color:'rgba(245,237,224,0.5)',lineHeight:'1.8',marginBottom:'2rem'}}>
            Your application is being reviewed by the Laurea Fashion House team. You will receive an email once approved.
          </p>
          <div style={{background:'rgba(184,150,106,0.08)',border:'1px solid rgba(184,150,106,0.2)',borderRadius:'12px',padding:'1rem',marginBottom:'2rem',fontSize:'13px',color:'rgba(245,237,224,0.6)'}}>
            ⏱️ Reviews take <strong style={{color:'#b8966a'}}>24 to 48 hours</strong>
          </div>
          <div style={{fontSize:'13px',color:'rgba(245,237,224,0.4)',marginBottom:'1.5rem'}}>
            {employee.first_name} {employee.last_name} · {employee.email}
          </div>
          <button onClick={handleLogout} style={{background:'transparent',border:'1px solid rgba(184,150,106,0.4)',color:'#b8966a',padding:'12px 28px',fontSize:'13px',cursor:'pointer',borderRadius:'8px',letterSpacing:'1px',textTransform:'uppercase'}}>
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    {id:'dashboard',icon:'⊞',label:'Overview'},
    {id:'profile',icon:'◎',label:'My Profile'},
    {id:'bank',icon:'◈',label:'Bank Details'},
    {id:'tasks',icon:'◫',label:'Tasks'},
    {id:'earnings',icon:'◉',label:'Earnings'},
  ];

  const inp = {width:'100%',border:'1px solid rgba(184,150,106,0.2)',padding:'12px 14px',fontSize:'13px',color:'#f5ede0',outline:'none',borderRadius:'10px',background:'rgba(255,255,255,0.04)',boxSizing:'border-box',marginBottom:'12px'};
  const lbl = {fontSize:'10px',fontWeight:'600',color:'rgba(184,150,106,0.8)',textTransform:'uppercase',letterSpacing:'1px',display:'block',marginBottom:'6px'};

  const getInitials = () => `${employee.first_name?.[0] || ''}${employee.last_name?.[0] || ''}`.toUpperCase();

  const Sidebar = () => (
    <div style={{width:'260px',background:'linear-gradient(180deg,#0f0a04 0%,#1a1005 100%)',minHeight:'100vh',display:'flex',flexDirection:'column',borderRight:'1px solid rgba(184,150,106,0.1)',flexShrink:0,position:isMobile?'fixed':'relative',left:isMobile?(sidebarOpen?'0':'-260px'):'auto',top:0,bottom:0,zIndex:100,transition:'left 0.3s ease'}}>

      {/* Logo */}
      <div style={{padding:'2rem 1.5rem 1.5rem',borderBottom:'1px solid rgba(184,150,106,0.08)'}}>
        <div style={{color:'#f5ede0',fontSize:'15px',fontWeight:'600',letterSpacing:'5px',textTransform:'uppercase'}}>Laurea</div>
        <div style={{color:'rgba(184,150,106,0.6)',fontSize:'8px',letterSpacing:'4px',textTransform:'uppercase',marginTop:'3px'}}>Fashion House</div>
        <div style={{marginTop:'10px',display:'inline-block',background:'rgba(184,150,106,0.1)',border:'1px solid rgba(184,150,106,0.2)',borderRadius:'4px',padding:'3px 10px',fontSize:'9px',color:'#b8966a',letterSpacing:'2px',textTransform:'uppercase'}}>
          Employee Portal
        </div>
      </div>

      {/* Profile card */}
      <div style={{padding:'1.5rem',borderBottom:'1px solid rgba(184,150,106,0.08)'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <div style={{width:'44px',height:'44px',borderRadius:'12px',background:'linear-gradient(135deg,#b8966a,#8a6a3e)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px',fontWeight:'700',color:'#1c1208',flexShrink:0}}>
            {getInitials()}
          </div>
          <div style={{overflow:'hidden'}}>
            <div style={{fontSize:'13px',color:'#f5ede0',fontWeight:'600',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{employee.first_name} {employee.last_name}</div>
            <div style={{fontSize:'10px',color:'rgba(184,150,106,0.7)',marginTop:'2px',textTransform:'capitalize'}}>{employee.job_position || 'Employee'}</div>
          </div>
        </div>
        <div style={{marginTop:'12px',background:'rgba(59,109,17,0.1)',border:'1px solid rgba(59,109,17,0.3)',borderRadius:'6px',padding:'5px 10px',display:'inline-flex',alignItems:'center',gap:'6px',fontSize:'10px',color:'#7bc44e',letterSpacing:'1px',textTransform:'uppercase'}}>
          <span style={{width:'6px',height:'6px',background:'#7bc44e',borderRadius:'50%',display:'inline-block'}}></span>
          Active
        </div>
      </div>

      {/* Navigation */}
      <nav style={{padding:'1rem 0',flex:1}}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={()=>{ setActiveTab(tab.id); if(isMobile) setSidebarOpen(false); }}
            style={{width:'100%',display:'flex',alignItems:'center',gap:'12px',padding:'12px 1.5rem',background:activeTab===tab.id?'rgba(184,150,106,0.08)':'transparent',border:'none',borderLeft:activeTab===tab.id?'2px solid #b8966a':'2px solid transparent',cursor:'pointer',fontSize:'13px',color:activeTab===tab.id?'#b8966a':'rgba(245,237,224,0.4)',textAlign:'left',transition:'all 0.15s',fontFamily:'inherit'}}>
            <span style={{fontSize:'16px',opacity:0.8}}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{padding:'1.5rem',borderTop:'1px solid rgba(184,150,106,0.08)'}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'12px',color:'rgba(245,237,224,0.3)',textDecoration:'none',marginBottom:'10px'}}>
          ← Main Website
        </Link>
        <button onClick={handleLogout} style={{width:'100%',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',color:'rgba(245,237,224,0.4)',padding:'10px',fontSize:'12px',cursor:'pointer',borderRadius:'8px',fontFamily:'inherit',transition:'all 0.15s'}}>
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:'100vh',background:'#0d0905',display:'flex',fontFamily:"'Inter', sans-serif"}}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input, select, textarea { font-family: 'Inter', sans-serif; }
        input:focus, select:focus, textarea:focus { border-color: rgba(184,150,106,0.5) !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(184,150,106,0.2); border-radius: 2px; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .tab-content { animation: fadeIn 0.2s ease; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .stat-card:hover { border-color: rgba(184,150,106,0.3) !important; transform: translateY(-2px); transition: all 0.2s; }
      `}</style>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div onClick={()=>setSidebarOpen(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',zIndex:99}} />
      )}

      <Sidebar />

      {/* Main content */}
      <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0,overflowX:'hidden'}}>

        {/* Top bar */}
        <div style={{background:'rgba(15,10,4,0.8)',backdropFilter:'blur(10px)',borderBottom:'1px solid rgba(184,150,106,0.08)',padding:isMobile?'1rem':'1rem 2rem',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:50}}>
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            {isMobile && (
              <button onClick={()=>setSidebarOpen(true)} style={{background:'none',border:'none',color:'rgba(245,237,224,0.6)',fontSize:'20px',cursor:'pointer',padding:'4px'}}>
                ☰
              </button>
            )}
            <div>
              <div style={{fontSize:isMobile?'13px':'15px',fontWeight:'600',color:'#f5ede0',textTransform:'capitalize'}}>
                {tabs.find(t=>t.id===activeTab)?.label}
              </div>
              <div style={{fontSize:'11px',color:'rgba(184,150,106,0.6)'}}>
                {new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
              </div>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <div style={{width:'32px',height:'32px',borderRadius:'8px',background:'linear-gradient(135deg,#b8966a,#8a6a3e)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:'700',color:'#1c1208'}}>
              {getInitials()}
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{flex:1,padding:isMobile?'1.25rem':'2rem',overflowY:'auto'}}>

          {/* OVERVIEW TAB */}
          {activeTab === 'dashboard' && (
            <div className="tab-content">
              <div style={{marginBottom:'2rem'}}>
                <h1 style={{fontSize:isMobile?'20px':'26px',fontWeight:'700',color:'#f5ede0',marginBottom:'4px'}}>
                  Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {employee.first_name} 👋
                </h1>
                <p style={{fontSize:'13px',color:'rgba(245,237,224,0.4)'}}>Welcome to your Laurea Fashion House employee portal.</p>
              </div>

              {/* Stats */}
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr 1fr':'repeat(4,1fr)',gap:'1rem',marginBottom:'2rem'}}>
                {[
                  {label:'Tasks',value:'0',icon:'◫',color:'#b8966a'},
                  {label:'Earnings',value:'$0',icon:'◉',color:'#7bc44e'},
                  {label:'Days Active',value:'1',icon:'◎',color:'#6ab3ff'},
                  {label:'Status',value:'Active',icon:'⊕',color:'#b8966a'},
                ].map((stat,i) => (
                  <div key={i} className="stat-card" style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(184,150,106,0.1)',borderRadius:'16px',padding:'1.25rem',cursor:'default'}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
                      <span style={{fontSize:'20px',color:stat.color}}>{stat.icon}</span>
                    </div>
                    <div style={{fontSize:isMobile?'20px':'24px',fontWeight:'700',color:'#f5ede0',marginBottom:'4px'}}>{stat.value}</div>
                    <div style={{fontSize:'11px',color:'rgba(245,237,224,0.3)',textTransform:'uppercase',letterSpacing:'1px'}}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Profile summary card */}
              <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(184,150,106,0.1)',borderRadius:'20px',padding:'1.5rem',marginBottom:'1.5rem'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.25rem'}}>
                  <h2 style={{fontSize:'14px',fontWeight:'600',color:'#f5ede0',letterSpacing:'0.5px'}}>Employment Details</h2>
                  <button onClick={()=>setActiveTab('profile')} style={{background:'none',border:'none',color:'rgba(184,150,106,0.7)',fontSize:'12px',cursor:'pointer',fontFamily:'inherit'}}>View all →</button>
                </div>
                <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr 1fr',gap:'1rem'}}>
                  {[
                    {label:'Position',value:employee.job_position || '—'},
                    {label:'Department',value:employee.department || '—'},
                    {label:'Employment',value:employee.employment_type?.replace(/_/g,' ') || '—'},
                  ].map((item,i) => (
                    <div key={i} style={{background:'rgba(184,150,106,0.04)',borderRadius:'12px',padding:'1rem'}}>
                      <div style={{fontSize:'10px',color:'rgba(184,150,106,0.6)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'6px'}}>{item.label}</div>
                      <div style={{fontSize:'14px',color:'#f5ede0',fontWeight:'500',textTransform:'capitalize'}}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(184,150,106,0.1)',borderRadius:'20px',padding:'1.5rem'}}>
                <h2 style={{fontSize:'14px',fontWeight:'600',color:'#f5ede0',marginBottom:'1rem',letterSpacing:'0.5px'}}>Quick Actions</h2>
                <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
                  {[
                    {label:'Add Bank Details',tab:'bank',icon:'◈'},
                    {label:'View Profile',tab:'profile',icon:'◎'},
                    {label:'My Tasks',tab:'tasks',icon:'◫'},
                  ].map((action,i) => (
                    <button key={i} onClick={()=>setActiveTab(action.tab)}
                      style={{background:'rgba(184,150,106,0.08)',border:'1px solid rgba(184,150,106,0.2)',color:'#b8966a',padding:'10px 18px',fontSize:'12px',fontWeight:'500',cursor:'pointer',borderRadius:'10px',display:'flex',alignItems:'center',gap:'8px',fontFamily:'inherit',transition:'all 0.15s',letterSpacing:'0.5px'}}>
                      {action.icon} {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="tab-content">
              <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(184,150,106,0.1)',borderRadius:'20px',overflow:'hidden',marginBottom:'1.5rem'}}>
                {/* Profile header */}
                <div style={{background:'linear-gradient(135deg,rgba(184,150,106,0.15),rgba(184,150,106,0.05))',padding:'2rem',display:'flex',alignItems:'center',gap:'1.5rem',flexWrap:'wrap'}}>
                  <div style={{width:'72px',height:'72px',borderRadius:'16px',background:'linear-gradient(135deg,#b8966a,#8a6a3e)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'28px',fontWeight:'700',color:'#1c1208',flexShrink:0}}>
                    {getInitials()}
                  </div>
                  <div>
                    <h2 style={{fontSize:'20px',fontWeight:'700',color:'#f5ede0',marginBottom:'4px'}}>{employee.first_name} {employee.last_name}</h2>
                    <div style={{fontSize:'13px',color:'rgba(184,150,106,0.8)',marginBottom:'8px'}}>{employee.email}</div>
                    <div style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'rgba(59,109,17,0.15)',border:'1px solid rgba(59,109,17,0.3)',borderRadius:'6px',padding:'4px 12px',fontSize:'10px',color:'#7bc44e',textTransform:'uppercase',letterSpacing:'1px'}}>
                      <span style={{width:'6px',height:'6px',background:'#7bc44e',borderRadius:'50%'}}></span>
                      Active Employee
                    </div>
                  </div>
                </div>

                {/* Details grid */}
                <div style={{padding:'1.5rem'}}>
                  <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:'1px',background:'rgba(184,150,106,0.08)',borderRadius:'12px',overflow:'hidden'}}>
                    {[
                      {label:'First Name',value:employee.first_name},
                      {label:'Last Name',value:employee.last_name},
                      {label:'Email',value:employee.email},
                      {label:'Phone',value:employee.phone},
                      {label:'Role',value:employee.role},
                      {label:'Nationality',value:employee.nationality},
                      {label:'Country',value:employee.country_of_residence},
                      {label:'City',value:employee.city},
                    ].map((field,i) => (
                      <div key={i} style={{background:'rgba(15,10,4,0.8)',padding:'1rem 1.25rem'}}>
                        <div style={{fontSize:'10px',color:'rgba(184,150,106,0.6)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'4px'}}>{field.label}</div>
                        <div style={{fontSize:'13px',color:field.value?'#f5ede0':'rgba(245,237,224,0.2)',fontWeight:'500'}}>{field.value || '—'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BANK DETAILS TAB */}
          {activeTab === 'bank' && (
            <div className="tab-content">
              <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(184,150,106,0.1)',borderRadius:'20px',padding:'1.5rem'}}>
                <div style={{marginBottom:'1.5rem'}}>
                  <h2 style={{fontSize:'16px',fontWeight:'600',color:'#f5ede0',marginBottom:'4px'}}>
                    {isBrazilian() ? '🇧🇷 Dados Bancários' : '🏦 Bank Details'}
                  </h2>
                  <p style={{fontSize:'12px',color:'rgba(245,237,224,0.4)'}}>
                    {isBrazilian() ? 'Adicione seus dados bancários para receber pagamentos' : 'Add your bank details to receive payments'}
                  </p>
                </div>

                {message === 'success' && (
                  <div style={{background:'rgba(59,109,17,0.1)',border:'1px solid rgba(59,109,17,0.3)',borderRadius:'10px',padding:'12px 16px',marginBottom:'1rem',fontSize:'13px',color:'#7bc44e'}}>
                    ✅ {isBrazilian() ? 'Dados bancários salvos!' : 'Bank details saved successfully!'}
                  </div>
                )}
                {message === 'error' && (
                  <div style={{background:'rgba(204,0,0,0.1)',border:'1px solid rgba(204,0,0,0.3)',borderRadius:'10px',padding:'12px 16px',marginBottom:'1rem',fontSize:'13px',color:'#ff6b6b'}}>
                    ❌ {isBrazilian() ? 'Falha ao salvar. Tente novamente.' : 'Failed to save. Please try again.'}
                  </div>
                )}

                <form onSubmit={handleSaveBank}>
                  {isBrazilian() ? (
                    <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:'1rem'}}>
                      <div>
                        <label style={lbl}>Nome Completo *</label>
                        <input style={inp} value={bankForm.accountName} onChange={e=>setBankForm({...bankForm,accountName:e.target.value})} placeholder="Nome completo" required />
                        <label style={lbl}>Nome do Banco *</label>
                        <input style={inp} value={bankForm.bankName} onChange={e=>setBankForm({...bankForm,bankName:e.target.value})} placeholder="ex: Itaú, Bradesco, Nubank" required />
                        <label style={lbl}>Número da Agência *</label>
                        <input style={inp} value={bankForm.bankCode} onChange={e=>setBankForm({...bankForm,bankCode:e.target.value})} placeholder="ex: 0001" required />
                      </div>
                      <div>
                        <label style={lbl}>Número da Conta *</label>
                        <input style={inp} value={bankForm.accountNumber} onChange={e=>setBankForm({...bankForm,accountNumber:e.target.value})} placeholder="ex: 12345-6" required />
                        <label style={lbl}>Chave PIX *</label>
                        <input style={inp} value={bankForm.pix} onChange={e=>setBankForm({...bankForm,pix:e.target.value})} placeholder="CPF, e-mail, telefone ou chave aleatória" required />
                        <label style={lbl}>CPF *</label>
                        <input style={inp} value={bankForm.cpf} onChange={e=>setBankForm({...bankForm,cpf:e.target.value})} placeholder="000.000.000-00" required />
                      </div>
                    </div>
                  ) : (
                    <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:'1rem'}}>
                      <div>
                        <label style={lbl}>Account Name *</label>
                        <input style={inp} value={bankForm.accountName} onChange={e=>setBankForm({...bankForm,accountName:e.target.value})} placeholder="Full name on account" required />
                        <label style={lbl}>Account Number *</label>
                        <input style={inp} value={bankForm.accountNumber} onChange={e=>setBankForm({...bankForm,accountNumber:e.target.value})} placeholder="0123456789" required />
                        <label style={lbl}>Bank Name *</label>
                        <input style={inp} value={bankForm.bankName} onChange={e=>setBankForm({...bankForm,bankName:e.target.value})} placeholder="e.g. Access Bank" required />
                      </div>
                      <div>
                        <label style={lbl}>Bank Code</label>
                        <input style={inp} value={bankForm.bankCode} onChange={e=>setBankForm({...bankForm,bankCode:e.target.value})} placeholder="e.g. 044" />
                        <label style={lbl}>Country</label>
                        <input style={inp} value={bankForm.country} onChange={e=>setBankForm({...bankForm,country:e.target.value})} placeholder="e.g. Nigeria" />
                        <label style={lbl}>SWIFT Code</label>
                        <input style={inp} value={bankForm.swiftCode} onChange={e=>setBankForm({...bankForm,swiftCode:e.target.value})} placeholder="International transfers" />
                      </div>
                    </div>
                  )}

                  <div style={{background:'rgba(184,150,106,0.06)',border:'1px solid rgba(184,150,106,0.15)',borderRadius:'10px',padding:'12px',fontSize:'12px',color:'rgba(245,237,224,0.4)',marginBottom:'1.5rem',lineHeight:'1.7'}}>
                    🔒 {isBrazilian() ? 'Seus dados bancários estão seguros e criptografados.' : 'Your bank details are encrypted and secure.'}
                  </div>

                  <button type="submit" disabled={saving}
                    style={{background:'linear-gradient(135deg,#b8966a,#8a6a3e)',color:'#1c1208',border:'none',padding:'14px 32px',fontSize:'13px',fontWeight:'700',cursor:'pointer',borderRadius:'10px',letterSpacing:'1px',textTransform:'uppercase',opacity:saving?0.7:1,fontFamily:'inherit'}}>
                    {saving ? (isBrazilian()?'Salvando...':'Saving...') : (isBrazilian()?'Salvar Dados Bancários':'Save Bank Details')}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TASKS TAB */}
          {activeTab === 'tasks' && (
            <div className="tab-content">
              <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(184,150,106,0.1)',borderRadius:'20px',padding:'3rem',textAlign:'center'}}>
                <div style={{fontSize:'48px',marginBottom:'1rem',opacity:0.5}}>◫</div>
                <h3 style={{fontSize:'16px',color:'rgba(245,237,224,0.6)',marginBottom:'8px',fontWeight:'500'}}>No tasks yet</h3>
                <p style={{fontSize:'13px',color:'rgba(245,237,224,0.3)'}}>Tasks assigned to you will appear here.</p>
              </div>
            </div>
          )}

          {/* EARNINGS TAB */}
          {activeTab === 'earnings' && (
            <div className="tab-content">
              <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(184,150,106,0.1)',borderRadius:'20px',padding:'1.5rem',marginBottom:'1rem'}}>
                <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr 1fr',gap:'1rem'}}>
                  {[
                    {label:'Total Earnings',value:'$0.00',color:'#b8966a'},
                    {label:'This Month',value:'$0.00',color:'#7bc44e'},
                    {label:'Pending',value:'$0.00',color:'#6ab3ff'},
                  ].map((stat,i) => (
                    <div key={i} style={{background:'rgba(184,150,106,0.04)',border:'1px solid rgba(184,150,106,0.1)',borderRadius:'12px',padding:'1.25rem',textAlign:'center'}}>
                      <div style={{fontSize:'24px',fontWeight:'700',color:stat.color,marginBottom:'6px'}}>{stat.value}</div>
                      <div style={{fontSize:'11px',color:'rgba(245,237,224,0.4)',textTransform:'uppercase',letterSpacing:'1px'}}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(184,150,106,0.1)',borderRadius:'20px',padding:'3rem',textAlign:'center'}}>
                <div style={{fontSize:'48px',marginBottom:'1rem',opacity:0.5}}>◉</div>
                <h3 style={{fontSize:'16px',color:'rgba(245,237,224,0.6)',marginBottom:'8px',fontWeight:'500'}}>No earnings yet</h3>
                <p style={{fontSize:'13px',color:'rgba(245,237,224,0.3)'}}>Add your bank details to start receiving payments.</p>
                <button onClick={()=>setActiveTab('bank')} style={{marginTop:'1rem',background:'rgba(184,150,106,0.1)',border:'1px solid rgba(184,150,106,0.2)',color:'#b8966a',padding:'10px 20px',fontSize:'12px',cursor:'pointer',borderRadius:'8px',fontFamily:'inherit'}}>
                  Add Bank Details →
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}