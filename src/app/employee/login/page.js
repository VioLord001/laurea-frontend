'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function EmployeeLoginPage() {
  const [form, setForm] = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState('login');
  const [code, setCode] = useState(['','','','','','']);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const router = useRouter();
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const savedStep = localStorage.getItem('laurea_login_step');
    const savedEmail = localStorage.getItem('laurea_login_email');
    if (savedStep === 'verify' && savedEmail) {
      setStep('verify');
      setForm(f => ({ ...f, email: savedEmail }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${api}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.requires2FA) {
        localStorage.setItem('laurea_login_step', 'verify');
        localStorage.setItem('laurea_login_email', form.email);
        setStep('verify');
      } else if (data.success) {
        localStorage.setItem('laurea_token', data.token);
        localStorage.setItem('laurea_user', JSON.stringify(data.user));
        if (data.user.employee_profile_completed) {
          router.push('/employee/dashboard');
        } else {
          router.push('/employee/setup');
        }
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch {
      setError('Connection failed. Please try again.');
    }
    setLoading(false);
  };

  const handleCodeChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      const next = document.getElementById(`emp-code-${index + 1}`);
      if (next) next.focus();
    }
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prev = document.getElementById(`emp-code-${index - 1}`);
      if (prev) prev.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length < 6) { setError('Please enter the complete 6-digit code.'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${api}/auth/verify-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, code: fullCode })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('laurea_token', data.token);
        localStorage.setItem('laurea_user', JSON.stringify(data.user));
        localStorage.removeItem('laurea_login_step');
        localStorage.removeItem('laurea_login_email');
        if (data.user.employee_profile_completed) {
          router.push('/employee/dashboard');
        } else {
          router.push('/employee/setup');
        }
      } else {
        setError(data.message || 'Invalid code');
      }
    } catch {
      setError('Connection failed. Please try again.');
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setResending(true);
    setResendMessage('');
    try {
      const res = await fetch(`${api}/auth/resend-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, type: 'login' })
      });
      const data = await res.json();
      if (data.success) setResendMessage('New code sent! Check your email.');
      else setResendMessage('Failed to resend. Please try again.');
    } catch { setResendMessage('Failed to resend. Please try again.'); }
    setResending(false);
    setTimeout(() => setResendMessage(''), 5000);
  };

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0f0a04 0%,#1c1208 60%,#2d1f0a 100%)',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem 1rem',fontFamily:"'Inter',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'); * { box-sizing: border-box; }`}</style>

      <div style={{width:'100%',maxWidth:'420px'}}>

        {/* Logo */}
        <div style={{textAlign:'center',marginBottom:'2.5rem'}}>
          <Link href="/" style={{textDecoration:'none',display:'inline-block'}}>
            <div style={{color:'#f5ede0',fontSize:'22px',fontWeight:'700',letterSpacing:'6px',textTransform:'uppercase'}}>Laurea</div>
            <div style={{color:'rgba(184,150,106,0.6)',fontSize:'8px',letterSpacing:'5px',textTransform:'uppercase',marginTop:'4px'}}>Fashion House</div>
          </Link>
          <div style={{marginTop:'1.5rem',display:'inline-block',background:'rgba(184,150,106,0.1)',border:'1px solid rgba(184,150,106,0.25)',borderRadius:'6px',padding:'5px 14px'}}>
            <span style={{fontSize:'10px',color:'rgba(184,150,106,0.8)',letterSpacing:'2px',textTransform:'uppercase',fontWeight:'600'}}>Employee Portal</span>
          </div>
        </div>

        {/* Card */}
        <div style={{background:'rgba(255,255,255,0.03)',backdropFilter:'blur(20px)',border:'1px solid rgba(184,150,106,0.15)',borderRadius:'24px',padding:'2.5rem',boxShadow:'0 25px 80px rgba(0,0,0,0.5)'}}>

          {step === 'login' && (
            <>
              <h1 style={{fontSize:'22px',fontWeight:'700',color:'#f5ede0',marginBottom:'6px',textAlign:'center'}}>Welcome back</h1>
              <p style={{fontSize:'13px',color:'rgba(245,237,224,0.4)',textAlign:'center',marginBottom:'2rem'}}>Sign in to your employee account</p>

              {error && (
                <div style={{background:'rgba(204,0,0,0.1)',border:'1px solid rgba(204,0,0,0.3)',borderRadius:'10px',padding:'12px 14px',marginBottom:'1.25rem',fontSize:'13px',color:'#ff6b6b',display:'flex',gap:'8px',alignItems:'flex-start'}}>
                  <span style={{flexShrink:0}}>⚠️</span><span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{marginBottom:'1rem'}}>
                  <label style={{fontSize:'10px',fontWeight:'600',color:'rgba(184,150,106,0.8)',textTransform:'uppercase',letterSpacing:'1px',display:'block',marginBottom:'8px'}}>Email Address</label>
                  <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="your@email.com" required
                    style={{width:'100%',border:'1px solid rgba(184,150,106,0.2)',padding:'13px 16px',fontSize:'14px',color:'#f5ede0',outline:'none',borderRadius:'12px',background:'rgba(255,255,255,0.04)',fontFamily:'Inter,sans-serif',transition:'border-color 0.2s'}}
                    onFocus={e=>e.target.style.borderColor='rgba(184,150,106,0.5)'}
                    onBlur={e=>e.target.style.borderColor='rgba(184,150,106,0.2)'} />
                </div>

                <div style={{marginBottom:'2rem'}}>
                  <label style={{fontSize:'10px',fontWeight:'600',color:'rgba(184,150,106,0.8)',textTransform:'uppercase',letterSpacing:'1px',display:'block',marginBottom:'8px'}}>Password</label>
                  <div style={{position:'relative'}}>
                    <input type={showPassword?'text':'password'} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••" required
                      style={{width:'100%',border:'1px solid rgba(184,150,106,0.2)',padding:'13px 48px 13px 16px',fontSize:'14px',color:'#f5ede0',outline:'none',borderRadius:'12px',background:'rgba(255,255,255,0.04)',fontFamily:'Inter,sans-serif',transition:'border-color 0.2s'}}
                      onFocus={e=>e.target.style.borderColor='rgba(184,150,106,0.5)'}
                      onBlur={e=>e.target.style.borderColor='rgba(184,150,106,0.2)'} />
                    <button type="button" onClick={()=>setShowPassword(!showPassword)}
                      style={{position:'absolute',right:'14px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:'16px',color:'rgba(245,237,224,0.4)',padding:'4px'}}>
                      {showPassword?'🙈':'👁️'}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  style={{width:'100%',background:'linear-gradient(135deg,#b8966a,#8a6a3e)',color:'#1c1208',border:'none',padding:'14px',fontSize:'13px',fontWeight:'700',letterSpacing:'1.5px',textTransform:'uppercase',cursor:loading?'default':'pointer',borderRadius:'12px',opacity:loading?0.7:1,fontFamily:'Inter,sans-serif',transition:'opacity 0.2s'}}>
                  {loading?'Signing in...':'Sign In'}
                </button>
              </form>

              <p style={{textAlign:'center',fontSize:'12px',color:'rgba(245,237,224,0.3)',marginTop:'1.75rem',lineHeight:'1.6'}}>
                Your account is created by admin.<br/>Contact your manager if you cannot log in.
              </p>
            </>
          )}

          {step === 'verify' && (
            <>
              <div style={{textAlign:'center',marginBottom:'1.75rem'}}>
                <div style={{width:'64px',height:'64px',background:'rgba(184,150,106,0.1)',border:'1px solid rgba(184,150,106,0.2)',borderRadius:'16px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'28px',margin:'0 auto 1rem'}}>🔐</div>
                <h1 style={{fontSize:'20px',fontWeight:'700',color:'#f5ede0',marginBottom:'8px'}}>Check your email</h1>
                <p style={{fontSize:'13px',color:'rgba(245,237,224,0.4)',lineHeight:'1.6'}}>
                  We sent a 6-digit code to<br/>
                  <strong style={{color:'rgba(184,150,106,0.8)'}}>{form.email}</strong>
                </p>
                <div style={{background:'rgba(184,150,106,0.06)',border:'1px solid rgba(184,150,106,0.15)',borderRadius:'8px',padding:'10px',marginTop:'12px',fontSize:'11px',color:'rgba(245,237,224,0.4)'}}>
                  💡 Switch to your email app — this screen will stay when you come back!
                </div>
              </div>

              {error && (
                <div style={{background:'rgba(204,0,0,0.1)',border:'1px solid rgba(204,0,0,0.3)',borderRadius:'10px',padding:'12px 14px',marginBottom:'1.25rem',fontSize:'13px',color:'#ff6b6b'}}>
                  ⚠️ {error}
                </div>
              )}

              {resendMessage && (
                <div style={{background:'rgba(59,109,17,0.1)',border:'1px solid rgba(59,109,17,0.3)',borderRadius:'10px',padding:'12px 14px',marginBottom:'1.25rem',fontSize:'13px',color:'#7bc44e',textAlign:'center'}}>
                  {resendMessage}
                </div>
              )}

              {/* Code boxes */}
              <div style={{display:'flex',gap:'8px',justifyContent:'center',marginBottom:'1.75rem'}}>
                {code.map((digit, index) => (
                  <input key={index} id={`emp-code-${index}`} type="text" inputMode="numeric" maxLength={1} value={digit}
                    onChange={e=>handleCodeChange(index,e.target.value)}
                    onKeyDown={e=>handleCodeKeyDown(index,e)}
                    style={{width:'46px',height:'56px',textAlign:'center',fontSize:'22px',fontWeight:'700',color:'#f5ede0',border:'1px solid rgba(184,150,106,0.2)',borderRadius:'12px',outline:'none',background:'rgba(255,255,255,0.04)',fontFamily:'Inter,sans-serif',transition:'border-color 0.2s'}}
                    onFocus={e=>e.target.style.borderColor='rgba(184,150,106,0.6)'}
                    onBlur={e=>e.target.style.borderColor=digit?'rgba(184,150,106,0.4)':'rgba(184,150,106,0.2)'} />
                ))}
              </div>

              <button onClick={handleVerify} disabled={loading}
                style={{width:'100%',background:'linear-gradient(135deg,#b8966a,#8a6a3e)',color:'#1c1208',border:'none',padding:'14px',fontSize:'13px',fontWeight:'700',letterSpacing:'1.5px',textTransform:'uppercase',cursor:loading?'default':'pointer',borderRadius:'12px',marginBottom:'1rem',opacity:loading?0.7:1,fontFamily:'Inter,sans-serif'}}>
                {loading?'Verifying...':'Verify & Sign In'}
              </button>

              <div style={{textAlign:'center',marginBottom:'1rem'}}>
                <p style={{fontSize:'12px',color:'rgba(245,237,224,0.3)',marginBottom:'8px'}}>Did not receive the code?</p>
                <button onClick={handleResend} disabled={resending}
                  style={{background:'none',border:'none',color:'rgba(184,150,106,0.7)',fontSize:'13px',fontWeight:'600',cursor:'pointer',textDecoration:'underline',fontFamily:'Inter,sans-serif'}}>
                  {resending?'Sending...':'Resend code'}
                </button>
              </div>

              <button onClick={()=>{ setStep('login'); setCode(['','','','','','']); setError(''); localStorage.removeItem('laurea_login_step'); localStorage.removeItem('laurea_login_email'); }}
                style={{width:'100%',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',color:'rgba(245,237,224,0.4)',padding:'12px',fontSize:'13px',cursor:'pointer',borderRadius:'12px',fontFamily:'Inter,sans-serif'}}>
                ← Back to login
              </button>
            </>
          )}
        </div>

        <p style={{textAlign:'center',marginTop:'1.5rem'}}>
          <Link href="/" style={{fontSize:'11px',color:'rgba(245,237,224,0.2)',textDecoration:'none'}}>← Back to website</Link>
        </p>
      </div>
    </div>
  );
}