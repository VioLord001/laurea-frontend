'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Login failed');
      localStorage.setItem('laurea_token', data.token);
      localStorage.setItem('laurea_user', JSON.stringify(data.user));
      router.push(data.user.role === 'admin' ? '/admin/dashboard' : '/');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your details and try again.');
    }
    setIsLoading(false);
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#1c1208 0%,#2d1f0a 50%,#3d2b0e 100%)',padding:'2rem 1rem'}}>
      <div style={{width:'100%',maxWidth:'400px'}}>

        <div style={{textAlign:'center',marginBottom:'2rem'}}>
          <div style={{color:'#f5ede0',fontSize:'20px',fontWeight:'600',letterSpacing:'4px',textTransform:'uppercase'}}>Laurea</div>
          <div style={{color:'#b8966a',fontSize:'9px',letterSpacing:'5px',textTransform:'uppercase',marginTop:'4px'}}>Fashion House</div>
        </div>

        <div style={{background:'#fff',borderRadius:'16px',padding:'2.5rem',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
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
                onChange={(e) => setForm({...form, email: e.target.value})}
                placeholder="you@example.com"
                required
                style={{width:'100%',border:'1.5px solid #e8e0d4',padding:'13px 16px',fontSize:'14px',color:'#1c1208',outline:'none',borderRadius:'8px',background:'#faf8f5',transition:'border-color 0.15s'}}
                onFocus={(e) => e.target.style.borderColor = '#b8966a'}
                onBlur={(e) => e.target.style.borderColor = '#e8e0d4'}
              />
            </div>

            <div style={{marginBottom:'0.5rem'}}>
              <label style={{fontSize:'11px',fontWeight:'600',color:'#8a7a6a',textTransform:'uppercase',letterSpacing:'0.5px',display:'block',marginBottom:'6px'}}>Password</label>
              <div style={{position:'relative'}}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({...form, password: e.target.value})}
                  placeholder="••••••••"
                  required
                  style={{width:'100%',border:'1.5px solid #e8e0d4',padding:'13px 48px 13px 16px',fontSize:'14px',color:'#1c1208',outline:'none',borderRadius:'8px',background:'#faf8f5',transition:'border-color 0.15s'}}
                  onFocus={(e) => e.target.style.borderColor = '#b8966a'}
                  onBlur={(e) => e.target.style.borderColor = '#e8e0d4'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{position:'absolute',right:'14px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:'16px',color:'#8a7a6a',padding:'4px'}}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div style={{textAlign:'right',marginBottom:'1.5rem'}}>
              <Link href="/auth/forgot-password" style={{fontSize:'12px',color:'#b8966a',textDecoration:'none'}}>Forgot password?</Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{width:'100%',background:isLoading?'#3d2b1a':'#1c1208',color:'#f5ede0',border:'none',padding:'14px',fontSize:'13px',fontWeight:'600',letterSpacing:'1px',textTransform:'uppercase',cursor:isLoading?'default':'pointer',borderRadius:'8px',transition:'background 0.15s'}}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p style={{textAlign:'center',fontSize:'13px',color:'#8a7a6a',marginTop:'1.75rem'}}>
            New to Laurea?{' '}
            <Link href="/auth/register" style={{color:'#b8966a',textDecoration:'none',fontWeight:'600'}}>Create an account</Link>
          </p>
        </div>

        <p style={{textAlign:'center',fontSize:'11px',color:'rgba(245,237,224,0.4)',marginTop:'1.5rem'}}>
          © 2026 Laurea Fashion House
        </p>
      </div>
    </div>
  );
}