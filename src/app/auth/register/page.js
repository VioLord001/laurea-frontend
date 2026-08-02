'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('register');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const router = useRouter();
  const api = process.env.NEXT_PUBLIC_API_URL;

  const inputStyle = {width:'100%',border:'1.5px solid #e8e0d4',padding:'13px 16px',fontSize:'14px',color:'#1c1208',outline:'none',borderRadius:'8px',background:'#faf8f5',transition:'border-color 0.15s',boxSizing:'border-box'};
  const labelStyle = {fontSize:'11px',fontWeight:'600',color:'#8a7a6a',textTransform:'uppercase',letterSpacing:'0.5px',display:'block',marginBottom:'6px'};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setIsLoading(true);
    try {
      const res = await fetch(`${api}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Registration failed');
      if (data.requiresVerification) {
        setStep('verify');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
      const next = document.getElementById(`code-${index + 1}`);
      if (next) next.focus();
    }
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prev = document.getElementById(`code-${index - 1}`);
      if (prev) prev.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length < 6) { setError('Please enter the complete 6-digit code.'); return; }
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch(`${api}/auth/verify-registration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, code: fullCode })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Invalid code');
      localStorage.setItem('laurea_token', data.token);
      localStorage.setItem('laurea_user', JSON.stringify(data.user));
      router.push('/');
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
        body: JSON.stringify({ email: form.email, type: 'register' })
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
      <div style={{width:'100%',maxWidth:'420px'}}>

        <div style={{textAlign:'center',marginBottom:'2rem'}}>
          <div style={{color:'#f5ede0',fontSize:'20px',fontWeight:'600',letterSpacing:'4px',textTransform:'uppercase'}}>Laurea</div>
          <div style={{color:'#b8966a',fontSize:'9px',letterSpacing:'5px',textTransform:'uppercase',marginTop:'4px'}}>Fashion House</div>
        </div>

        <div style={{background:'#fff',borderRadius:'16px',padding:'2.5rem',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>

          {/* Registration form */}
          {step === 'register' && (
            <>
              <h1 style={{fontSize:'22px',fontWeight:'500',color:'#1c1208',marginBottom:'6px',textAlign:'center'}}>Create your account</h1>
              <p style={{fontSize:'13px',color:'#8a7a6a',textAlign:'center',marginBottom:'1.75rem'}}>Join the Laurea community</p>

              {error && (
                <div style={{background:'#fff0f0',border:'1px solid #ffcccc',color:'#cc0000',padding:'12px 14px',borderRadius:'8px',fontSize:'13px',marginBottom:'1.25rem',display:'flex',alignItems:'flex-start',gap:'8px'}}>
                  <span style={{flexShrink:0}}>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'1.25rem'}}>
                  <div>
                    <label style={labelStyle}>First name</label>
                    <input style={inputStyle} value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} required
                      onFocus={e=>e.target.style.borderColor='#b8966a'} onBlur={e=>e.target.style.borderColor='#e8e0d4'}/>
                  </div>
                  <div>
                    <label style={labelStyle}>Last name</label>
                    <input style={inputStyle} value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} required
                      onFocus={e=>e.target.style.borderColor='#b8966a'} onBlur={e=>e.target.style.borderColor='#e8e0d4'}/>
                  </div>
                </div>

                <div style={{marginBottom:'1.25rem'}}>
                  <label style={labelStyle}>Email</label>
                  <input type="email" style={inputStyle} value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required
                    onFocus={e=>e.target.style.borderColor='#b8966a'} onBlur={e=>e.target.style.borderColor='#e8e0d4'}/>
                </div>

                <div style={{marginBottom:'0.5rem'}}>
                  <label style={labelStyle}>Password</label>
                  <div style={{position:'relative'}}>
                    <input
                      type={showPassword?'text':'password'}
                      style={{...inputStyle,paddingRight:'48px'}}
                      value={form.password}
                      onChange={e=>setForm({...form,password:e.target.value})}
                      placeholder="Min 8 characters"
                      required
                      onFocus={e=>e.target.style.borderColor='#b8966a'}
                      onBlur={e=>e.target.style.borderColor='#e8e0d4'}
                    />
                    <button type="button" onClick={()=>setShowPassword(!showPassword)}
                      style={{position:'absolute',right:'14px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:'16px',color:'#8a7a6a',padding:'4px'}}>
                      {showPassword?'🙈':'👁️'}
                    </button>
                  </div>
                </div>

                <p style={{fontSize:'11px',color:'#aaa094',marginBottom:'1.5rem',marginTop:'8px'}}>
                  By creating an account you agree to our Terms and Privacy Policy.
                </p>

                <button type="submit" disabled={isLoading}
                  style={{width:'100%',background:isLoading?'#3d2b1a':'#1c1208',color:'#f5ede0',border:'none',padding:'14px',fontSize:'13px',fontWeight:'600',letterSpacing:'1px',textTransform:'uppercase',cursor:isLoading?'default':'pointer',borderRadius:'8px',boxSizing:'border-box'}}>
                  {isLoading?'Creating account...':'Create account'}
                </button>
              </form>

              <p style={{textAlign:'center',fontSize:'13px',color:'#8a7a6a',marginTop:'1.75rem'}}>
                Already have an account?{' '}
                <Link href="/auth/login" style={{color:'#b8966a',textDecoration:'none',fontWeight:'600'}}>Sign in</Link>
              </p>
            </>
          )}

          {/* Verification code screen */}
          {step === 'verify' && (
            <>
              <div style={{textAlign:'center',marginBottom:'1.5rem'}}>
                <div style={{fontSize:'48px',marginBottom:'12px'}}>📧</div>
                <h1 style={{fontSize:'20px',fontWeight:'600',color:'#1c1208',marginBottom:'8px'}}>Check your email</h1>
                <p style={{fontSize:'13px',color:'#8a7a6a',lineHeight:'1.6'}}>
                  We sent a 6-digit verification code to<br/>
                  <strong style={{color:'#1c1208'}}>{form.email}</strong>
                </p>
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

              {/* 6 digit code input */}
              <div style={{display:'flex',gap:'8px',justifyContent:'center',marginBottom:'1.5rem'}}>
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e=>handleCodeChange(index, e.target.value)}
                    onKeyDown={e=>handleCodeKeyDown(index, e)}
                    style={{width:'46px',height:'56px',textAlign:'center',fontSize:'22px',fontWeight:'600',color:'#1c1208',border:'2px solid #e0d8cc',borderRadius:'8px',outline:'none',background:'#faf8f5',transition:'border-color 0.15s'}}
                    onFocus={e=>e.target.style.borderColor='#b8966a'}
                    onBlur={e=>e.target.style.borderColor=digit?'#b8966a':'#e0d8cc'}
                  />
                ))}
              </div>

              <button onClick={handleVerify} disabled={isLoading}
                style={{width:'100%',background:isLoading?'#3d2b1a':'#1c1208',color:'#f5ede0',border:'none',padding:'14px',fontSize:'13px',fontWeight:'600',letterSpacing:'1px',textTransform:'uppercase',cursor:isLoading?'default':'pointer',borderRadius:'8px',marginBottom:'1rem',boxSizing:'border-box'}}>
                {isLoading?'Verifying...':'Verify Email'}
              </button>

              <div style={{textAlign:'center'}}>
                <p style={{fontSize:'13px',color:'#8a7a6a',marginBottom:'8px'}}>Did not receive the code?</p>
                <button onClick={handleResend} disabled={resending}
                  style={{background:'none',border:'none',color:'#b8966a',fontSize:'13px',fontWeight:'600',cursor:'pointer',textDecoration:'underline'}}>
                  {resending?'Sending...':'Resend code'}
                </button>
              </div>

              <button onClick={()=>setStep('register')}
                style={{width:'100%',background:'none',border:'1px solid #e0d8cc',color:'#8a7a6a',padding:'12px',fontSize:'13px',cursor:'pointer',borderRadius:'8px',marginTop:'1rem',boxSizing:'border-box'}}>
                ← Use a different email
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