'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('login');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const router = useRouter();
  const api = process.env.NEXT_PUBLIC_API_URL;

  // Restore step and email if user switched apps
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
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch(`${api}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Login failed');
      if (data.requires2FA) {
        localStorage.setItem('laurea_login_step', 'verify');
        localStorage.setItem('laurea_login_email', form.email);
        setStep('verify');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your details and try again.');
    }
    setIsLoading(false);
  };

  const handleCodeChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      const next = document.getElementById(`login-code-${index + 1}`);
      if (next) next.focus();
    }
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prev = document.getElementById(`login-code-${index - 1}`);
      if (prev) prev.focus();
    }
  };

  const clearLoginStorage = () => {
    localStorage.removeItem('laurea_login_step');
    localStorage.removeItem('laurea_login_email');
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length < 6) { setError('Please enter the complete 6-digit code.'); return; }
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch(`${api}/auth/verify-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, code: fullCode })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Invalid code');
      localStorage.setItem('laurea_token', data.token);
      localStorage.setItem('laurea_user', JSON.stringify(data.user));
      clearLoginStorage();
      if (data.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (data.user.role === 'employee') {
        if (data.user.employee_profile_completed) {
          router.push('/employee/dashboard');
        } else {
          router.push('/employee/setup');
        }
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.');
    }
    setIsLoading(false);
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
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#1c1208 0%,#2d1f0a 50%,#3d2b0e 100%)',padding:'2rem 1rem'}}>
      <div style={{width:'100%',maxWidth:'400px'}}>

        <div style={{textAlign:'center',marginBottom:'2rem'}}>
          <div style={{color:'#f5ede0',fontSize:'20px',fontWeight:'600',letterSpacing:'4px',textTransform:'uppercase'}}>Laurea</div>
          <div style={{color:'#b8966a',fontSize:'9px',letterSpacing:'5px',textTransform:'uppercase',marginTop:'4px'}}>Fashion House</div>
        </div>

        <div style={{background:'#fff',borderRadius:'16px',padding:'2.5rem',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>

          {/* Login form */}
          {step === 'login' && (
            <>
              <h1 style={{fontSize:'22px',fontWeight:'500',color:'#1c1208',marginBottom:'6px',textAlign:'center'}}>Welcome back</h1>
              <p style={{fontSize:'13px',color:'#8a7a6a',textAlign:'center',marginBottom:'1.75rem'}}>Sign in to your Laurea account</p>

              {error && (
                <div style={{background:'#fff0f0',border:'1px solid #ffcccc',color:'#cc0000',padding:'12px 14px',borderRadius:'8px',fontSize:'13px',marginBottom:'1.25rem',display:'flex',alignItems:'flex-start',gap:'8px'}}>
                  <span style={{flexShrink:0}}>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{marginBottom:'1.25rem'}}>
                  <label style={{fontSize:'11px',fontWeight:'600',color:'#8a7a6a',textTransform:'uppercase',letterSpacing:'0.5px',display:'block',marginBottom:'6px'}}>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e=>setForm({...form,email:e.target.value})}
                    placeholder="you@example.com"
                    required
                    style={{width:'100%',border:'1.5px solid #e8e0d4',padding:'13px 16px',fontSize:'14px',color:'#1c1208',outline:'none',borderRadius:'8px',background:'#faf8f5',transition:'border-color 0.15s',boxSizing:'border-box'}}
                    onFocus={e=>e.target.style.borderColor='#b8966a'}
                    onBlur={e=>e.target.style.borderColor='#e8e0d4'}
                  />
                </div>

                <div style={{marginBottom:'0.5rem'}}>
                  <label style={{fontSize:'11px',fontWeight:'600',color:'#8a7a6a',textTransform:'uppercase',letterSpacing:'0.5px',display:'block',marginBottom:'6px'}}>Password</label>
                  <div style={{position:'relative'}}>
                    <input
                      type={showPassword?'text':'password'}
                      value={form.password}
                      onChange={e=>setForm({...form,password:e.target.value})}
                      placeholder="••••••••"
                      required
                      style={{width:'100%',border:'1.5px solid #e8e0d4',padding:'13px 48px 13px 16px',fontSize:'14px',color:'#1c1208',outline:'none',borderRadius:'8px',background:'#faf8f5',transition:'border-color 0.15s',boxSizing:'border-box'}}
                      onFocus={e=>e.target.style.borderColor='#b8966a'}
                      onBlur={e=>e.target.style.borderColor='#e8e0d4'}
                    />
                    <button type="button" onClick={()=>setShowPassword(!showPassword)}
                      style={{position:'absolute',right:'14px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:'16px',color:'#8a7a6a',padding:'4px'}}>
                      {showPassword?'🙈':'👁️'}
                    </button>
                  </div>
                </div>

                <div style={{textAlign:'right',marginBottom:'1.5rem'}}>
                  <Link href="/auth/forgot-password" style={{fontSize:'12px',color:'#b8966a',textDecoration:'none'}}>Forgot password?</Link>
                </div>

                <button type="submit" disabled={isLoading}
                  style={{width:'100%',background:isLoading?'#3d2b1a':'#1c1208',color:'#f5ede0',border:'none',padding:'14px',fontSize:'13px',fontWeight:'600',letterSpacing:'1px',textTransform:'uppercase',cursor:isLoading?'default':'pointer',borderRadius:'8px',transition:'background 0.15s',boxSizing:'border-box'}}>
                  {isLoading?'Signing in...':'Sign in'}
                </button>
              </form>

              <p style={{textAlign:'center',fontSize:'13px',color:'#8a7a6a',marginTop:'1.75rem'}}>
                New to Laurea?{' '}
                <Link href="/auth/register" style={{color:'#b8966a',textDecoration:'none',fontWeight:'600'}}>Create an account</Link>
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
                  💡 Switch to your email app to get the code — this screen will stay when you come back!
                </div>
              </div>

              {error && (
                <div style={{background:'#fff0f0',border:'1px solid #ffcccc',color:'#cc0000',padding:'12px 14px',borderRadius:'8px',fontSize:'13px',marginBottom:'1.25rem',display:'flex',gap:'8px'}}>
                  <span>⚠️</span><span>{error}</span>
                </div>
              )}

              {resendMessage && (
                <div style={{background:'#f0fff4',border:'1px solid #ccffcc',color:'#1a7a3a',padding:'12px 14px',borderRadius:'8px',fontSize:'13px',marginBottom:'1.25rem',textAlign:'center'}}>
                  {resendMessage}
                </div>
              )}

              {/* 6 digit code boxes */}
              <div style={{display:'flex',gap:'8px',justifyContent:'center',marginBottom:'1.5rem'}}>
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`login-code-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e=>handleCodeChange(index,e.target.value)}
                    onKeyDown={e=>handleCodeKeyDown(index,e)}
                    style={{width:'46px',height:'56px',textAlign:'center',fontSize:'22px',fontWeight:'600',color:'#1c1208',border:'2px solid #e0d8cc',borderRadius:'8px',outline:'none',background:'#faf8f5',transition:'border-color 0.15s'}}
                    onFocus={e=>e.target.style.borderColor='#b8966a'}
                    onBlur={e=>e.target.style.borderColor=digit?'#b8966a':'#e0d8cc'}
                  />
                ))}
              </div>

              <button onClick={handleVerify} disabled={isLoading}
                style={{width:'100%',background:isLoading?'#3d2b1a':'#1c1208',color:'#f5ede0',border:'none',padding:'14px',fontSize:'13px',fontWeight:'600',letterSpacing:'1px',textTransform:'uppercase',cursor:isLoading?'default':'pointer',borderRadius:'8px',marginBottom:'1rem',boxSizing:'border-box'}}>
                {isLoading?'Verifying...':'Verify & Sign In'}
              </button>

              <div style={{textAlign:'center',marginBottom:'1rem'}}>
                <p style={{fontSize:'13px',color:'#8a7a6a',marginBottom:'8px'}}>Did not receive the code?</p>
                <button onClick={handleResend} disabled={resending}
                  style={{background:'none',border:'none',color:'#b8966a',fontSize:'13px',fontWeight:'600',cursor:'pointer',textDecoration:'underline'}}>
                  {resending?'Sending...':'Resend code'}
                </button>
              </div>

              <button onClick={()=>{
                setStep('login');
                setCode(['','','','','','']);
                setError('');
                clearLoginStorage();
              }}
                style={{width:'100%',background:'none',border:'1px solid #e0d8cc',color:'#8a7a6a',padding:'12px',fontSize:'13px',cursor:'pointer',borderRadius:'8px',boxSizing:'border-box'}}>
                ← Back to login
              </button>
            </>
          )}
        </div>

        <p style={{textAlign:'center',fontSize:'11px',color:'rgba(245,237,224,0.4)',marginTop:'1.5rem'}}>
          © 2026 Laurea Fashion House
        </p>
      </div>
    </div>
  );
}