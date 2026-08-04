'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EmployeeDashboardPage() {
  const [employee, setEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bankForm, setBankForm] = useState({ accountName:'', accountNumber:'', bankName:'', bankCode:'', country:'', swiftCode:'', pix:'', cpf:'' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const api = process.env.NEXT_PUBLIC_API_URL;

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
    return nat.includes('brazil') || nat.includes('brasil') || nat.includes('brazilian') || nat.includes('brasilei') || country.includes('brazil') || country.includes('brasil');
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
      setMessage(data.success ? '✅ Bank details saved!' : '❌ Failed to save. Please try again.');
    } catch { setMessage('❌ Connection failed.'); }
    setSaving(false);
  };

  const inp = { width:'100%', border:'1px solid #e0d8cc', padding:'10px 12px', fontSize:'13px', color:'#1c1208', outline:'none', borderRadius:'6px', background:'#faf8f5', boxSizing:'border-box', marginBottom:'12px' };
  const lbl = { fontSize:'11px', fontWeight:'600', color:'#8a7a6a', textTransform:'uppercase', letterSpacing:'0.5px', display:'block', marginBottom:'5px' };

  if (!employee) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#faf8f5'}}>
      <p style={{color:'#8a7a6a'}}>Loading...</p>
    </div>
  );

  // Show pending approval screen
  if (employee.is_approved === false) {
    return (
      <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#1c1208 0%,#2d1f0a 100%)',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem'}}>
        <div style={{background:'#fff',borderRadius:'16px',padding:'2.5rem',maxWidth:'480px',width:'100%',textAlign:'center',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
          <div style={{fontSize:'64px',marginBottom:'1rem'}}>⏳</div>
          <h1 style={{fontSize:'22px',fontWeight:'600',color:'#1c1208',marginBottom:'8px'}}>Application Under Review</h1>
          <p style={{fontSize:'13px',color:'#8a7a6a',lineHeight:'1.8',marginBottom:'1.5rem'}}>
            Thank you for completing your employee setup! Your application and documents are currently being reviewed by the Laurea Fashion House admin team.
          </p>
          <div style={{background:'#fdf6ec',border:'1px solid #f0c040',borderRadius:'10px',padding:'1rem',marginBottom:'1.5rem',fontSize:'13px',color:'#8a6000',lineHeight:'1.7'}}>
            ⏱️ Reviews typically take <strong>24 to 48 hours</strong>.<br/>
            You will receive an email once your account is approved.
          </div>
          <div style={{background:'#faf8f5',border:'1px solid #e0d8cc',borderRadius:'10px',padding:'1rem',marginBottom:'1.5rem',fontSize:'13px',color:'#8a7a6a',textAlign:'left'}}>
            <div style={{fontWeight:'600',color:'#1c1208',marginBottom:'8px'}}>Your Details:</div>
            <div>👤 {employee.first_name} {employee.last_name}</div>
            <div>📧 {employee.email}</div>
          </div>
          <button onClick={handleLogout}
            style={{background:'#1c1208',color:'#f5ede0',border:'none',padding:'12px 28px',fontSize:'13px',fontWeight:'600',cursor:'pointer',borderRadius:'8px',letterSpacing:'1px',textTransform:'uppercase'}}>
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    {id:'dashboard',icon:'📊',label:'Dashboard'},
    {id:'profile',icon:'👤',label:'My Profile'},
    {id:'bank',icon:'🏦',label:'Bank Details'},
    {id:'tasks',icon:'📋',label:'My Tasks'},
    {id:'earnings',icon:'💰',label:'Earnings'},
  ];

  return (
    <div style={{minHeight:'100vh',background:'#faf8f5',display:'flex'}}>

      {/* Sidebar */}
      <div style={{width:'220px',background:'#1c1208',minHeight:'100vh',padding:'1.5rem 0',flexShrink:0,position:'relative'}}>
        <div style={{padding:'0 1.5rem',marginBottom:'2rem'}}>
          <div style={{color:'#f5ede0',fontSize:'13px',fontWeight:'600',letterSpacing:'3px',textTransform:'uppercase'}}>Laurea</div>
          <div style={{color:'#b8966a',fontSize:'8px',letterSpacing:'2px',textTransform:'uppercase',marginTop:'2px'}}>Employee Portal</div>
        </div>

        <div style={{padding:'0 1.5rem',marginBottom:'1.5rem'}}>
          <div style={{background:'rgba(245,237,224,0.05)',borderRadius:'8px',padding:'12px'}}>
            <div style={{fontSize:'12px',color:'#f5ede0',fontWeight:'500'}}>{employee.first_name} {employee.last_name}</div>
            <div style={{fontSize:'10px',color:'#b8966a',marginTop:'2px'}}>{employee.role}</div>
            <div style={{fontSize:'9px',color:'rgba(245,237,224,0.4)',marginTop:'4px'}}>{employee.email}</div>
          </div>
        </div>

        {tabs.map(tab => (
          <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
            style={{width:'100%',display:'flex',alignItems:'center',gap:'10px',padding:'12px 1.5rem',background:activeTab===tab.id?'rgba(184,150,106,0.15)':'none',border:'none',borderLeft:activeTab===tab.id?'3px solid #b8966a':'3px solid transparent',cursor:'pointer',fontSize:'12px',color:activeTab===tab.id?'#b8966a':'rgba(245,237,224,0.6)',textAlign:'left',fontWeight:activeTab===tab.id?'600':'400'}}>
            <span>{tab.icon}</span><span>{tab.label}</span>
          </button>
        ))}

        <div style={{padding:'0 1.5rem',position:'absolute',bottom:'1.5rem',width:'220px',boxSizing:'border-box'}}>
          <Link href="/" style={{display:'block',textAlign:'center',fontSize:'11px',color:'rgba(245,237,224,0.4)',textDecoration:'none',marginBottom:'8px'}}>← Main Website</Link>
          <button onClick={handleLogout} style={{width:'100%',background:'rgba(245,237,224,0.05)',border:'1px solid rgba(245,237,224,0.1)',color:'rgba(245,237,224,0.5)',padding:'10px',fontSize:'12px',cursor:'pointer',borderRadius:'6px'}}>
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{flex:1,padding:'2rem',overflowY:'auto'}}>

        {activeTab === 'dashboard' && (
          <div>
            <h1 style={{fontSize:'22px',fontWeight:'600',color:'#1c1208',marginBottom:'4px'}}>Welcome, {employee.first_name}! 👋</h1>
            <p style={{fontSize:'13px',color:'#8a7a6a',marginBottom:'2rem'}}>Here is your employee overview for today</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem',marginBottom:'2rem'}}>
              {[
                {icon:'📦',label:'Tasks Assigned',value:'0'},
                {icon:'💰',label:'Total Earnings',value:'$0.00'},
                {icon:'📅',label:'Days Active',value:'1'},
              ].map((stat,i) => (
                <div key={i} style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'1.25rem'}}>
                  <div style={{fontSize:'28px',marginBottom:'8px'}}>{stat.icon}</div>
                  <div style={{fontSize:'22px',fontWeight:'600',color:'#1c1208',marginBottom:'4px'}}>{stat.value}</div>
                  <div style={{fontSize:'11px',color:'#8a7a6a',textTransform:'uppercase',letterSpacing:'0.5px'}}>{stat.label}</div>
                </div>
              ))}
            </div>
            <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'1.5rem',marginBottom:'1rem'}}>
              <h2 style={{fontSize:'15px',fontWeight:'600',color:'#1c1208',marginBottom:'12px'}}>My Details</h2>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',fontSize:'13px',color:'#8a7a6a'}}>
                <div><strong style={{color:'#1c1208'}}>Name:</strong> {employee.first_name} {employee.last_name}</div>
                <div><strong style={{color:'#1c1208'}}>Email:</strong> {employee.email}</div>
                <div><strong style={{color:'#1c1208'}}>Role:</strong> {employee.role}</div>
                <div><strong style={{color:'#1c1208'}}>Phone:</strong> {employee.phone || 'Not set'}</div>
              </div>
            </div>
            <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'1.5rem'}}>
              <h2 style={{fontSize:'15px',fontWeight:'600',color:'#1c1208',marginBottom:'12px'}}>Quick Actions</h2>
              <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
                <button onClick={()=>setActiveTab('bank')} style={{background:'#1c1208',color:'#f5ede0',border:'none',padding:'10px 20px',fontSize:'12px',fontWeight:'600',cursor:'pointer',borderRadius:'6px',letterSpacing:'1px',textTransform:'uppercase'}}>🏦 Add Bank Details</button>
                <button onClick={()=>setActiveTab('profile')} style={{background:'#f5ede0',color:'#1c1208',border:'1px solid #e0d8cc',padding:'10px 20px',fontSize:'12px',fontWeight:'600',cursor:'pointer',borderRadius:'6px',letterSpacing:'1px',textTransform:'uppercase'}}>👤 View Profile</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            <h1 style={{fontSize:'22px',fontWeight:'600',color:'#1c1208',marginBottom:'2rem'}}>My Profile</h1>
            <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'1.5rem'}}>
              <div style={{display:'flex',gap:'1.5rem',alignItems:'center',marginBottom:'1.5rem',paddingBottom:'1.5rem',borderBottom:'1px solid #e0d8cc'}}>
                <div style={{width:'80px',height:'80px',borderRadius:'50%',background:'#f5ede0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'32px'}}>👤</div>
                <div>
                  <div style={{fontSize:'18px',fontWeight:'600',color:'#1c1208'}}>{employee.first_name} {employee.last_name}</div>
                  <div style={{fontSize:'13px',color:'#b8966a'}}>{employee.role}</div>
                  <div style={{fontSize:'12px',color:'#8a7a6a'}}>{employee.email}</div>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',fontSize:'13px'}}>
                {[
                  {label:'First Name',value:employee.first_name},
                  {label:'Last Name',value:employee.last_name},
                  {label:'Email',value:employee.email},
                  {label:'Phone',value:employee.phone},
                  {label:'Role',value:employee.role},
                ].map((field,i) => (
                  <div key={i} style={{borderBottom:'1px solid #f5ede0',paddingBottom:'10px'}}>
                    <div style={{fontSize:'10px',color:'#8a7a6a',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'3px'}}>{field.label}</div>
                    <div style={{color:'#1c1208',fontWeight:'500'}}>{field.value || '—'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bank' && (
          <div>
            <h1 style={{fontSize:'22px',fontWeight:'600',color:'#1c1208',marginBottom:'4px'}}>Bank Details</h1>
            <p style={{fontSize:'13px',color:'#8a7a6a',marginBottom:'2rem'}}>Add your bank details to receive payments</p>
            {message && <div style={{background:message.includes('❌')?'#fff0f0':'#f0fff4',border:`1px solid ${message.includes('❌')?'#ffcccc':'#ccffcc'}`,borderRadius:'8px',padding:'12px 16px',marginBottom:'1rem',fontSize:'13px'}}>{message}</div>}

            {isBrazilian() ? (
              <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'1.5rem'}}>
                <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'1.25rem',paddingBottom:'1rem',borderBottom:'1px solid #f0ece8'}}>
                  <span style={{fontSize:'24px'}}>🇧🇷</span>
                  <div>
                    <div style={{fontSize:'14px',fontWeight:'600',color:'#1c1208'}}>Dados Bancários Brasileiros</div>
                    <div style={{fontSize:'12px',color:'#8a7a6a'}}>Brazilian Bank Details</div>
                  </div>
                </div>
                <form onSubmit={handleSaveBank}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                    <div>
                      <label style={lbl}>Nome Completo / Full Name *</label>
                      <input style={inp} value={bankForm.accountName} onChange={e=>setBankForm({...bankForm,accountName:e.target.value})} placeholder="Nome completo" required />
                      <label style={lbl}>Nome do Banco / Bank Name *</label>
                      <input style={inp} value={bankForm.bankName} onChange={e=>setBankForm({...bankForm,bankName:e.target.value})} placeholder="ex: Banco do Brasil, Itaú, Bradesco, Nubank" required />
                      <label style={lbl}>Número da Agência / Agency Number *</label>
                      <input style={inp} value={bankForm.bankCode} onChange={e=>setBankForm({...bankForm,bankCode:e.target.value})} placeholder="ex: 0001" required />
                    </div>
                    <div>
                      <label style={lbl}>Número da Conta / Account Number *</label>
                      <input style={inp} value={bankForm.accountNumber} onChange={e=>setBankForm({...bankForm,accountNumber:e.target.value})} placeholder="ex: 12345-6" required />
                      <label style={lbl}>Chave PIX / PIX Key *</label>
                      <input style={inp} value={bankForm.pix} onChange={e=>setBankForm({...bankForm,pix:e.target.value})} placeholder="CPF, e-mail, telefone ou chave aleatória" required />
                      <label style={lbl}>CPF *</label>
                      <input style={inp} value={bankForm.cpf} onChange={e=>setBankForm({...bankForm,cpf:e.target.value})} placeholder="ex: 000.000.000-00" required />
                    </div>
                  </div>
                  <div style={{background:'#fdf6ec',border:'1px solid #f0c040',borderRadius:'8px',padding:'12px',fontSize:'12px',color:'#8a7a6a',marginBottom:'1rem',lineHeight:'1.7'}}>
                    🔒 Seus dados bancários estão seguros e criptografados. Os pagamentos serão enviados diretamente para esta conta.
                  </div>
                  <button type="submit" disabled={saving} style={{background:'#b8966a',color:'#1c1208',border:'none',padding:'13px 28px',fontSize:'12px',fontWeight:'600',letterSpacing:'1px',textTransform:'uppercase',cursor:'pointer',borderRadius:'6px',opacity:saving?0.7:1}}>
                    {saving?'Salvando...':'Salvar Dados Bancários'}
                  </button>
                </form>
              </div>
            ) : (
              <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'1.5rem'}}>
                <form onSubmit={handleSaveBank}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
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
                  <div style={{background:'#faf8f5',border:'1px solid #e0d8cc',borderRadius:'8px',padding:'12px',fontSize:'12px',color:'#8a7a6a',marginBottom:'1rem',lineHeight:'1.7'}}>
                    🔒 Your bank details are encrypted and secure. Payments will be sent directly to this account.
                  </div>
                  <button type="submit" disabled={saving} style={{background:'#b8966a',color:'#1c1208',border:'none',padding:'13px 28px',fontSize:'12px',fontWeight:'600',letterSpacing:'1px',textTransform:'uppercase',cursor:'pointer',borderRadius:'6px',opacity:saving?0.7:1}}>
                    {saving?'Saving...':'Save Bank Details'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div>
            <h1 style={{fontSize:'22px',fontWeight:'600',color:'#1c1208',marginBottom:'2rem'}}>My Tasks</h1>
            <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'3rem',textAlign:'center'}}>
              <div style={{fontSize:'48px',marginBottom:'1rem'}}>📋</div>
              <p style={{fontSize:'13px',color:'#8a7a6a'}}>No tasks assigned yet. Check back later.</p>
            </div>
          </div>
        )}

        {activeTab === 'earnings' && (
          <div>
            <h1 style={{fontSize:'22px',fontWeight:'600',color:'#1c1208',marginBottom:'2rem'}}>Earnings</h1>
            <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'3rem',textAlign:'center'}}>
              <div style={{fontSize:'48px',marginBottom:'1rem'}}>💰</div>
              <p style={{fontSize:'13px',color:'#8a7a6a'}}>No earnings yet. Add your bank details to receive payments.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}