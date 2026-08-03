'use client';
import { useState } from 'react';
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
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#1c1208 0%,#2d1f0a 100%)',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem'}}>
      <div style={{width:'100%',maxWidth:'420px'}}>

        <div style={{textAlign:'center',marginBottom:'2rem'}}>
          <Link href="/" style={{textDecoration:'none'}}>
            <div style={{color:'#f5ede0',fontSize:'20px',fontWeight:'600',letterSpacing:'4px',textTransform:'uppercase'}}>Laurea</div>
            <div style={{color:'#b8966a',fontSize:'9px',letterSpacing:'4px',textTransform:'uppercase',marginTop:'2px'}}>Fashion House</div>
          </Link>
          <div style={{marginTop:'1.5rem',background:'rgba(184,150,106,0.15)',border:'1px solid rgba(184,150,106,0.3)',borderRadius:'6px',padding:'6px 16px',display:'inline-block'}}>
            <span style={{fontSize:'11px',color:'#b8966a',letterSpacing:'2px',textTransform:'uppercase',fontWeight:'600'}}>👤 Employee Portal</span>
          </div>
        </div>

        <div style={{background:'#fff',borderRadius:'16px',padding:'2rem',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>

          {/* Login form */}
          {step === 'login' && (
            <>
              <h1 style={{fontSize:'20px',fontWeight:'600',color:'#1c1208',marginBottom:'4px',textAlign:'center'}}>Employee Login</h1>
              <p style={{fontSize:'12px',color:'#8a7a6a',textAlign:'center',marginBottom:'1.5rem'}}>Sign in with your company credentials</p>

              {error && (
                <div style={{background:'#fff0f0',border:'1px solid #ffcccc',borderRadius:'8px',padding:'10px 14px',marginBottom:'1rem',fontSize:'12px',color:'#cc0000'}}>
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <label style={{fontSize:'11px',fontWeight:'600',color:'#8a7a6a',textTransform:'uppercase',letterSpacing:'0.5px',display:'block',marginBottom:'6px'}}>Email Address</label>
                <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="your@email.com" required
                  style={{width:'100%',border:'1px solid #e0d8cc',padding:'12px 14px',fontSize:'13px',color:'#1c1208',outline:'none',borderRadius:'8px',background:'#faf8f5',boxSizing:'border-box',marginBottom:'1rem'}} />

                <label style={{fontSize:'11px',fontWeight:'600',color:'#8a7a6a',textTransform:'uppercase',letterSpacing:'0.5px',display:'block',marginBottom:'6px'}}>Password</label>
                <div style={{position:'relative',marginBottom:'1.5rem'}}>
                  <input type={showPassword?'text':'password'} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Enter your password" required
                    style={{width:'100%',border:'1px solid #e0d8cc',padding:'12px 44px 12px 14px',fontSize:'13px',color:'#1c1208',outline:'none',borderRadius:'8px',background:'#faf8f5',boxSizing:'border-box'}} />
                  <button type="button" onClick={()=>setShowPassword(!showPassword)}
                    style={{position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:'16px'}}>
                    {showPassword?'🙈':'👁️'}
                  </button>
                </div>

                <button type="submit" disabled={loading}
                  style={{width:'100%',background:'#1c1208',color:'#f5ede0',border:'none',padding:'14px',fontSize:'13px',fontWeight:'600',letterSpacing:'2px',textTransform:'uppercase',cursor:'pointer',borderRadius:'8px',opacity:loading?0.7:1,boxSizing:'border-box'}}>
                  {loading?'Signing in...':'Sign In'}
                </button>
              </form>

              <p style={{textAlign:'center',fontSize:'12px',color:'#8a7a6a',marginTop:'1.5rem',paddingTop:'1.5rem',borderTop:'1px solid #e0d8cc'}}>
                Your account is created by admin. Contact your manager if you cannot log in.
              </p>
            </>
          )}

          {/* 2FA verification screen */}
          {step === 'verify' && (
            <>
              <div style={{textAlign:'center',marginBottom:'1.5rem'}}>
                <div style={{fontSize:'48px',marginBottom:'12px'}}>🔐</div>
                <h1 style={{fontSize:'20px',fontWeight:'600',color:'#1c1208',marginBottom:'8px'}}>Verify your login</h1>
                <p style={{fontSize:'13px',color:'#8a7a6a',lineHeight:'1.6'}}>
                  We sent a 6-digit code to<br/>
                  <strong style={{color:'#1c1208'}}>{form.email}</strong>
                </p>
                <div style={{background:'#fdf6ec',border:'1px solid #f0c040',borderRadius:'8px',padding:'10px',marginTop:'12px',fontSize:'12px',color:'#8a6000'}}>
                  💡 Switch to your email app — this screen will stay when you come back!
                </div>
              </div>

              {error && (
                <div style={{background:'#fff0f0',border:'1px solid #ffcccc',color:'#cc0000',padding:'10px 14px',borderRadius:'8px',fontSize:'12px',marginBottom:'1rem'}}>
                  ⚠️ {error}
                </div>
              )}

              {resendMessage && (
                <div style={{background:'#f0fff4',border:'1px solid #ccffcc',color:'#1a7a3a',padding:'10px 14px',borderRadius:'8px',fontSize:'12px',marginBottom:'1rem',textAlign:'center'}}>
                  {resendMessage}
                </div>
              )}

              <div style={{display:'flex',gap:'8px',justifyContent:'center',marginBottom:'1.5rem'}}>
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`emp-code-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e=>handleCodeChange(index,e.target.value)}
                    onKeyDown={e=>handleCodeKeyDown(index,e)}
                    style={{width:'46px',height:'56px',textAlign:'center',fontSize:'22px',fontWeight:'600',color:'#1c1208',border:'2px solid #e0d8cc',borderRadius:'8px',outline:'none',background:'#faf8f5'}}
                    onFocus={e=>e.target.style.borderColor='#b8966a'}
                    onBlur={e=>e.target.style.borderColor=digit?'#b8966a':'#e0d8cc'}
                  />
                ))}
              </div>

              <button onClick={handleVerify} disabled={loading}
                style={{width:'100%',background:'#1c1208',color:'#f5ede0',border:'none',padding:'14px',fontSize:'13px',fontWeight:'600',letterSpacing:'2px',textTransform:'uppercase',cursor:'pointer',borderRadius:'8px',marginBottom:'1rem',opacity:loading?0.7:1,boxSizing:'border-box'}}>
                {loading?'Verifying...':'Verify & Sign In'}
              </button>

              <div style={{textAlign:'center',marginBottom:'1rem'}}>
                <p style={{fontSize:'12px',color:'#8a7a6a',marginBottom:'8px'}}>Did not receive the code?</p>
                <button onClick={handleResend} disabled={resending}
                  style={{background:'none',border:'none',color:'#b8966a',fontSize:'12px',fontWeight:'600',cursor:'pointer',textDecoration:'underline'}}>
                  {resending?'Sending...':'Resend code'}
                </button>
              </div>

              <button onClick={()=>{ setStep('login'); setCode(['','','','','','']); setError(''); localStorage.removeItem('laurea_login_step'); localStorage.removeItem('laurea_login_email'); }}
                style={{width:'100%',background:'none',border:'1px solid #e0d8cc',color:'#8a7a6a',padding:'12px',fontSize:'13px',cursor:'pointer',borderRadius:'8px',boxSizing:'border-box'}}>
                ← Back to login
              </button>
            </>
          )}
        </div>

        <p style={{textAlign:'center',marginTop:'1rem'}}>
          <Link href="/" style={{fontSize:'11px',color:'rgba(245,237,224,0.4)',textDecoration:'none'}}>← Back to website</Link>
        </p>
      </div>
    </div>
  );
}