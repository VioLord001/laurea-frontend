'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EmployeeDashboardPage() {
  const [employee, setEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
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
      if (data.success) {
        setMessage('success');
      } else {
        setMessage('error');
        alert(data.message || 'Please fill in all required fields.');
      }
    } catch { setMessage('error'); }
    setSaving(false);
    setTimeout(() => setMessage(''), 6000);
  };

  if (!employee) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0f0a04'}}>
      <div style={{width:'40px',height:'40px',border:'2px solid #b8966a',borderTopColor:'transparent',borderRadius:'50%'}}></div>
    </div>
  );

  if (employee.is_approved === false) {
    return (
      <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0f0a04 0%,#1c1208 50%,#2d1f0a 100%)',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem'}}>
        <div style={{background:'rgba(255,255,255,0.03)',backdropFilter:'blur(20px)',border:'1px solid rgba(184,150,106,0.2)',borderRadius:'24px',padding:'3rem',maxWidth:'480px',width:'100%',textAlign:'center'}}>
          <div style={{width:'80px',height:'80px',background:'rgba(184,150,106,0.1)',border:'2px solid rgba(184,150,106,0.3)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'36px',margin:'0 auto 1.5rem'}}>⏳</div>
          <h1 style={{fontSize:'24px',fontWeight:'600',color:'#f5ede0',marginBottom:'8px'}}>Em análise.</h1>
          <p style={{fontSize:'14px',color:'rgba(245,237,224,0.5)',lineHeight:'1.8',marginBottom:'2rem'}}>
            Sua candidatura está sendo analisada pela equipe da Laurea Fashion House. Você receberá um e-mail assim que for aprovada.
          </p>
          <div style={{background:'rgba(184,150,106,0.08)',border:'1px solid rgba(184,150,106,0.2)',borderRadius:'12px',padding:'1rem',marginBottom:'2rem',fontSize:'13px',color:'rgba(245,237,224,0.6)'}}>
            ⏱️ As avaliações levam <strong style={{color:'#b8966a'}}>de 24 a 48 horas.</strong>
          </div>
          <div style={{fontSize:'13px',color:'rgba(245,237,224,0.4)',marginBottom:'1.5rem'}}>
            {employee.first_name} {employee.last_name} · {employee.email}
          </div>
          <button onClick={handleLogout} style={{background:'transparent',border:'1px solid rgba(184,150,106,0.4)',color:'#b8966a',padding:'12px 28px',fontSize:'13px',cursor:'pointer',borderRadius:'8px',letterSpacing:'1px',textTransform:'uppercase'}}>
            Sair
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

  const inp = {width:'100%',border:'1px solid rgba(184,150,106,0.2)',padding:'12px 14px',fontSize:'13px',color:'#f5ede0',outline:'none',borderRadius:'10px',background:'rgba(255,255,255,0.04)',boxSizing:'border-box',marginBottom:'12px',fontFamily:'Inter,sans-serif',transition:'border-color 0.2s'};
  const lbl = {fontSize:'10px',fontWeight:'600',color:'rgba(184,150,106,0.8)',textTransform:'uppercase',letterSpacing:'1px',display:'block',marginBottom:'6px'};
  const getInitials = () => `${employee.first_name?.[0]||''}${employee.last_name?.[0]||''}`.toUpperCase();

  const Sidebar = () => (
    <div style={{width:'260px',background:'linear-gradient(180deg,#0f0a04 0%,#1a1005 100%)',minHeight:'100vh',display:'flex',flexDirection:'column',borderRight:'1px solid rgba(184,150,106,0.1)',flexShrink:0,position:isMobile?'fixed':'relative',left:isMobile?(sidebarOpen?'0':'-260px'):'auto',top:0,bottom:0,zIndex:100,transition:'left 0.3s ease'}}>
      <div style={{padding:'2rem 1.5rem 1.5rem',borderBottom:'1px solid rgba(184,150,106,0.08)'}}>
        <div style={{color:'#f5ede0',fontSize:'15px',fontWeight:'600',letterSpacing:'5px',textTransform:'uppercase'}}>Laurea</div>
        <div style={{color:'rgba(184,150,106,0.6)',fontSize:'8px',letterSpacing:'4px',textTransform:'uppercase',marginTop:'3px'}}>Fashion House</div>
        <div style={{marginTop:'10px',display:'inline-block',background:'rgba(184,150,106,0.1)',border:'1px solid rgba(184,150,106,0.2)',borderRadius:'4px',padding:'3px 10px',fontSize:'9px',color:'#b8966a',letterSpacing:'2px',textTransform:'uppercase'}}>Employee Portal</div>
      </div>

      <div style={{padding:'1.5rem',borderBottom:'1px solid rgba(184,150,106,0.08)'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <div style={{width:'44px',height:'44px',borderRadius:'12px',background:'linear-gradient(135deg,#b8966a,#8a6a3e)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px',fontWeight:'700',color:'#1c1208',flexShrink:0}}>
            {getInitials()}
          </div>
          <div style={{overflow:'hidden'}}>
            <div style={{fontSize:'13px',color:'#f5ede0',fontWeight:'600',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{employee.first_name} {employee.last_name}</div>
            <div style={{fontSize:'10px',color:'rgba(184,150,106,0.7)',marginTop:'2px',textTransform:'capitalize'}}>{employee.job_position||'Employee'}</div>
          </div>
        </div>
        <div style={{marginTop:'12px',background:'rgba(59,109,17,0.1)',border:'1px solid rgba(59,109,17,0.3)',borderRadius:'6px',padding:'5px 10px',display:'inline-flex',alignItems:'center',gap:'6px',fontSize:'10px',color:'#7bc44e',letterSpacing:'1px',textTransform:'uppercase'}}>
          <span style={{width:'6px',height:'6px',background:'#7bc44e',borderRadius:'50%',display:'inline-block'}}></span>
          Active
        </div>
      </div>

      <nav style={{padding:'1rem 0',flex:1}}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={()=>{ setActiveTab(tab.id); if(isMobile) setSidebarOpen(false); }}
            style={{width:'100%',display:'flex',alignItems:'center',gap:'12px',padding:'12px 1.5rem',background:activeTab===tab.id?'rgba(184,150,106,0.08)':'transparent',border:'none',borderLeft:activeTab===tab.id?'2px solid #b8966a':'2px solid transparent',cursor:'pointer',fontSize:'13px',color:activeTab===tab.id?'#b8966a':'rgba(245,237,224,0.4)',textAlign:'left',transition:'all 0.15s',fontFamily:'inherit'}}>
            <span style={{fontSize:'16px',opacity:0.8}}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      <div style={{padding:'1.5rem',borderTop:'1px solid rgba(184,150,106,0.08)'}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'12px',color:'rgba(245,237,224,0.3)',textDecoration:'none',marginBottom:'10px'}}>← Main Website</Link>
        <button onClick={handleLogout} style={{width:'100%',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',color:'rgba(245,237,224,0.4)',padding:'10px',fontSize:'12px',cursor:'pointer',borderRadius:'8px',fontFamily:'inherit'}}>
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:'100vh',background:'#0d0905',display:'flex',fontFamily:"'Inter',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input,select,textarea { font-family: 'Inter',sans-serif; }
        input:focus,select:focus { border-color: rgba(184,150,106,0.5) !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(184,150,106,0.2); border-radius: 2px; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .tab-content { animation: fadeIn 0.2s ease; }
        .stat-card:hover { border-color: rgba(184,150,106,0.3) !important; transform: translateY(-2px); transition: all 0.2s; }
      `}</style>

      {isMobile && sidebarOpen && (
        <div onClick={()=>setSidebarOpen(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',zIndex:99}} />
      )}

      <Sidebar />

      <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0,overflowX:'hidden'}}>

        <div style={{background:'rgba(15,10,4,0.8)',backdropFilter:'blur(10px)',borderBottom:'1px solid rgba(184,150,106,0.08)',padding:isMobile?'1rem':'1rem 2rem',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:50}}>
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            {isMobile && (
              <button onClick={()=>setSidebarOpen(true)} style={{background:'none',border:'none',color:'rgba(245,237,224,0.6)',fontSize:'20px',cursor:'pointer',padding:'4px'}}>☰</button>
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
          <div style={{width:'32px',height:'32px',borderRadius:'8px',background:'linear-gradient(135deg,#b8966a,#8a6a3e)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:'700',color:'#1c1208'}}>
            {getInitials()}
          </div>
        </div>

        <div style={{flex:1,padding:isMobile?'1.25rem':'2rem',overflowY:'auto'}}>

          {activeTab === 'dashboard' && (
            <div className="tab-content">
              <div style={{marginBottom:'2rem'}}>
                <h1 style={{fontSize:isMobile?'20px':'26px',fontWeight:'700',color:'#f5ede0',marginBottom:'4px'}}>
                  Good {new Date().getHours()<12?'morning':new Date().getHours()<17?'afternoon':'evening'}, {employee.first_name} 👋
                </h1>
                <p style={{fontSize:'13px',color:'rgba(245,237,224,0.4)'}}>Welcome to your Laurea Fashion House employee portal.</p>
              </div>

              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr 1fr':'repeat(4,1fr)',gap:'1rem',marginBottom:'2rem'}}>
                {[
                  {label:'Tasks',value:'0',icon:'◫',color:'#b8966a'},
                  {label:'Earnings',value:'$0',icon:'◉',color:'#7bc44e'},
                  {label:'Days Active',value:'1',icon:'◎',color:'#6ab3ff'},
                  {label:'Status',value:'Active',icon:'⊕',color:'#b8966a'},
                ].map((stat,i) => (
                  <div key={i} className="stat-card" style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(184,150,106,0.1)',borderRadius:'16px',padding:'1.25rem',cursor:'default'}}>
                    <div style={{fontSize:'20px',color:stat.color,marginBottom:'12px'}}>{stat.icon}</div>
                    <div style={{fontSize:isMobile?'20px':'24px',fontWeight:'700',color:'#f5ede0',marginBottom:'4px'}}>{stat.value}</div>
                    <div style={{fontSize:'11px',color:'rgba(245,237,224,0.3)',textTransform:'uppercase',letterSpacing:'1px'}}>{stat.label}</div>
                  </div>
                ))}
              </div>

              <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(184,150,106,0.1)',borderRadius:'20px',padding:'1.5rem',marginBottom:'1rem'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.25rem'}}>
                  <h2 style={{fontSize:'14px',fontWeight:'600',color:'#f5ede0',letterSpacing:'0.5px'}}>Employment Details</h2>
                  <button onClick={()=>setActiveTab('profile')} style={{background:'none',border:'none',color:'rgba(184,150,106,0.7)',fontSize:'12px',cursor:'pointer',fontFamily:'inherit'}}>View all →</button>
                </div>
                <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr 1fr',gap:'1rem'}}>
                  {[
                    {label:'Position',value:employee.job_position||'—'},
                    {label:'Department',value:employee.department||'—'},
                    {label:'Employment',value:employee.employment_type?.replace(/_/g,' ')||'—'},
                  ].map((item,i) => (
                    <div key={i} style={{background:'rgba(184,150,106,0.04)',borderRadius:'12px',padding:'1rem'}}>
                      <div style={{fontSize:'10px',color:'rgba(184,150,106,0.6)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'6px'}}>{item.label}</div>
                      <div style={{fontSize:'14px',color:'#f5ede0',fontWeight:'500',textTransform:'capitalize'}}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(184,150,106,0.1)',borderRadius:'20px',padding:'1.5rem'}}>
                <h2 style={{fontSize:'14px',fontWeight:'600',color:'#f5ede0',marginBottom:'1rem',letterSpacing:'0.5px'}}>Quick Actions</h2>
                <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
                  {[
                    {label:'Add Bank Details',tab:'bank',icon:'◈'},
                    {label:'View Profile',tab:'profile',icon:'◎'},
                    {label:'My Tasks',tab:'tasks',icon:'◫'},
                  ].map((action,i) => (
                    <button key={i} onClick={()=>setActiveTab(action.tab)}
                      style={{background:'rgba(184,150,106,0.08)',border:'1px solid rgba(184,150,106,0.2)',color:'#b8966a',padding:'10px 18px',fontSize:'12px',fontWeight:'500',cursor:'pointer',borderRadius:'10px',display:'flex',alignItems:'center',gap:'8px',fontFamily:'inherit',letterSpacing:'0.5px'}}>
                      {action.icon} {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="tab-content">
              <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(184,150,106,0.1)',borderRadius:'20px',overflow:'hidden',marginBottom:'1.5rem'}}>
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
                        <div style={{fontSize:'13px',color:field.value?'#f5ede0':'rgba(245,237,224,0.2)',fontWeight:'500'}}>{field.value||'—'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bank' && (
            <div className="tab-content">
              <h1 style={{fontSize:'22px',fontWeight:'700',color:'#f5ede0',marginBottom:'4px'}}>🏦 Dados Bancários / Bank Details</h1>
              <p style={{fontSize:'13px',color:'rgba(245,237,224,0.4)',marginBottom:'2rem'}}>
                Adicione duas contas bancárias. Um cartão em Português será enviado ao seu e-mail e outro em Inglês ao admin.
              </p>

              {message === 'success' && (
                <div style={{background:'rgba(59,109,17,0.1)',border:'1px solid rgba(59,109,17,0.3)',borderRadius:'10px',padding:'16px',marginBottom:'1.5rem',fontSize:'13px',color:'#7bc44e',lineHeight:'1.8'}}>
                  ✅ Dados bancários salvos com sucesso!<br/>
                  <span style={{fontSize:'12px',color:'rgba(245,237,224,0.4)'}}>
                    📧 Cartão em Português enviado para o seu e-mail.<br/>
                    📧 Cartão em Inglês enviado para o admin.
                  </span>
                </div>
              )}
              {message === 'error' && (
                <div style={{background:'rgba(204,0,0,0.1)',border:'1px solid rgba(204,0,0,0.3)',borderRadius:'10px',padding:'16px',marginBottom:'1.5rem',fontSize:'13px',color:'#ff6b6b'}}>
                  ❌ Falha ao salvar. Por favor preencha todos os campos obrigatórios.
                </div>
              )}

              <form onSubmit={handleSaveBank}>

                {/* Bank Account 1 */}
                <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(184,150,106,0.15)',borderRadius:'16px',padding:'1.5rem',marginBottom:'1rem'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'1.25rem',paddingBottom:'1rem',borderBottom:'1px solid rgba(184,150,106,0.08)'}}>
                    <div style={{width:'36px',height:'36px',borderRadius:'10px',background:'rgba(184,150,106,0.15)',border:'1px solid rgba(184,150,106,0.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'15px',fontWeight:'700',color:'#b8966a',flexShrink:0}}>1</div>
                    <div>
                      <div style={{fontSize:'15px',fontWeight:'600',color:'#f5ede0'}}>Conta Bancária 1 / Bank Account 1</div>
                      <div style={{fontSize:'11px',color:'rgba(184,150,106,0.5)'}}>Todos os campos marcados com * são obrigatórios</div>
                    </div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:'1rem'}}>
                    <div>
                      <label style={lbl}>Titular / Account Holder *</label>
                      <input style={inp} value={bankForm.bank1_holder} onChange={e=>setBankForm({...bankForm,bank1_holder:e.target.value})} placeholder="Nome completo do titular" required />
                      <label style={lbl}>Banco / Bank Name *</label>
                      <input style={inp} value={bankForm.bank1_name} onChange={e=>setBankForm({...bankForm,bank1_name:e.target.value})} placeholder="ex: Itaú, Bradesco, Nubank" required />
                      <label style={lbl}>Agência / Agency</label>
                      <input style={inp} value={bankForm.bank1_agency} onChange={e=>setBankForm({...bankForm,bank1_agency:e.target.value})} placeholder="ex: 0001" />
                    </div>
                    <div>
                      <label style={lbl}>Conta / Account Number *</label>
                      <input style={inp} value={bankForm.bank1_account} onChange={e=>setBankForm({...bankForm,bank1_account:e.target.value})} placeholder="ex: 12345-6" required />
                      <label style={lbl}>Chave PIX / PIX Key *</label>
                      <input style={inp} value={bankForm.bank1_pix} onChange={e=>setBankForm({...bankForm,bank1_pix:e.target.value})} placeholder="CPF, e-mail, telefone ou chave aleatória" required />
                      <label style={lbl}>CPF *</label>
                      <input style={inp} value={bankForm.bank1_cpf} onChange={e=>setBankForm({...bankForm,bank1_cpf:e.target.value})} placeholder="000.000.000-00" required />
                    </div>
                  </div>
                </div>

                {/* Bank Account 2 */}
                <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(184,150,106,0.15)',borderRadius:'16px',padding:'1.5rem',marginBottom:'1.5rem'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'1.25rem',paddingBottom:'1rem',borderBottom:'1px solid rgba(184,150,106,0.08)'}}>
                    <div style={{width:'36px',height:'36px',borderRadius:'10px',background:'rgba(184,150,106,0.15)',border:'1px solid rgba(184,150,106,0.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'15px',fontWeight:'700',color:'#b8966a',flexShrink:0}}>2</div>
                    <div>
                      <div style={{fontSize:'15px',fontWeight:'600',color:'#f5ede0'}}>Conta Bancária 2 / Bank Account 2</div>
                      <div style={{fontSize:'11px',color:'rgba(184,150,106,0.5)'}}>Todos os campos marcados com * são obrigatórios</div>
                    </div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:'1rem'}}>
                    <div>
                      <label style={lbl}>Titular / Account Holder *</label>
                      <input style={inp} value={bankForm.bank2_holder} onChange={e=>setBankForm({...bankForm,bank2_holder:e.target.value})} placeholder="Nome completo do titular" required />
                      <label style={lbl}>Banco / Bank Name *</label>
                      <input style={inp} value={bankForm.bank2_name} onChange={e=>setBankForm({...bankForm,bank2_name:e.target.value})} placeholder="ex: Itaú, Bradesco, Nubank" required />
                      <label style={lbl}>Agência / Agency</label>
                      <input style={inp} value={bankForm.bank2_agency} onChange={e=>setBankForm({...bankForm,bank2_agency:e.target.value})} placeholder="ex: 0001" />
                    </div>
                    <div>
                      <label style={lbl}>Conta / Account Number *</label>
                      <input style={inp} value={bankForm.bank2_account} onChange={e=>setBankForm({...bankForm,bank2_account:e.target.value})} placeholder="ex: 12345-6" required />
                      <label style={lbl}>Chave PIX / PIX Key *</label>
                      <input style={inp} value={bankForm.bank2_pix} onChange={e=>setBankForm({...bankForm,bank2_pix:e.target.value})} placeholder="CPF, e-mail, telefone ou chave aleatória" required />
                      <label style={lbl}>CPF *</label>
                      <input style={inp} value={bankForm.bank2_cpf} onChange={e=>setBankForm({...bankForm,bank2_cpf:e.target.value})} placeholder="000.000.000-00" required />
                    </div>
                  </div>
                </div>

                <div style={{background:'rgba(184,150,106,0.06)',border:'1px solid rgba(184,150,106,0.15)',borderRadius:'10px',padding:'14px 16px',fontSize:'12px',color:'rgba(245,237,224,0.4)',marginBottom:'1.5rem',lineHeight:'1.8'}}>
                  🔒 Seus dados bancários estão seguros e criptografados.<br/>
                  📧 Cartão em Português → <strong style={{color:'rgba(184,150,106,0.6)'}}>{employee.email}</strong><br/>
                  📧 Cartão em Inglês → admin@laureafashionhouse.com
                </div>

                <button type="submit" disabled={saving}
                  style={{background:'linear-gradient(135deg,#b8966a,#8a6a3e)',color:'#1c1208',border:'none',padding:'15px 32px',fontSize:'13px',fontWeight:'700',cursor:'pointer',borderRadius:'12px',letterSpacing:'1px',textTransform:'uppercase',fontFamily:'inherit',opacity:saving?0.7:1,width:isMobile?'100%':'auto'}}>
                  {saving ? '📤 Salvando e Enviando...' : '💾 Salvar e Enviar Cartão por Email'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="tab-content">
              <h1 style={{fontSize:'22px',fontWeight:'700',color:'#f5ede0',marginBottom:'2rem'}}>My Tasks</h1>
              <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(184,150,106,0.1)',borderRadius:'20px',padding:'3rem',textAlign:'center'}}>
                <div style={{fontSize:'48px',marginBottom:'1rem',opacity:0.5}}>◫</div>
                <h3 style={{fontSize:'16px',color:'rgba(245,237,224,0.6)',marginBottom:'8px',fontWeight:'500'}}>No tasks yet</h3>
                <p style={{fontSize:'13px',color:'rgba(245,237,224,0.3)'}}>Tasks assigned to you will appear here.</p>
              </div>
            </div>
          )}

          {activeTab === 'earnings' && (
            <div className="tab-content">
              <h1 style={{fontSize:'22px',fontWeight:'700',color:'#f5ede0',marginBottom:'2rem'}}>Earnings</h1>
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