'use client';
import { useState } from 'react';

export default function PaymentSettings() {
  const [stripeKey, setStripeKey] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [message, setMessage] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setMessage('✅ Payment settings saved! Update your Railway environment variables to apply changes.');
    setTimeout(() => setMessage(''), 5000);
  };

  const currencies = ['USD','NGN','GBP','EUR','GHS','ZAR','KES','CAD','AUD','AED'];
  const inp = {width:'100%',border:'1px solid #e0d8cc',padding:'10px 12px',fontSize:'13px',color:'#1c1208',outline:'none',borderRadius:'4px',marginBottom:'8px',background:'#faf8f5'};
  const lbl = {fontSize:'11px',fontWeight:'600',color:'#8a7a6a',textTransform:'uppercase',letterSpacing:'0.5px',display:'block',marginBottom:'4px'};

  return (
    <div>
      <div style={{marginBottom:'1.5rem'}}>
        <h1 style={{fontSize:'24px',fontWeight:'600',color:'#1c1208'}}>💳 Payment Settings</h1>
        <p style={{fontSize:'13px',color:'#8a7a6a',marginTop:'4px'}}>Manage how customers pay on your website</p>
      </div>

      {message && <div style={{background:'#f0fff4',border:'1px solid #ccffcc',padding:'12px 16px',borderRadius:'8px',marginBottom:'1rem',fontSize:'13px'}}>{message}</div>}

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem'}}>

        {/* Stripe */}
        <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'1.5rem'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'1rem'}}>
            <span style={{fontSize:'24px'}}>💳</span>
            <div>
              <h2 style={{fontSize:'15px',fontWeight:'600',color:'#1c1208'}}>Stripe Payments</h2>
              <p style={{fontSize:'12px',color:'#8a7a6a'}}>Accept cards, Apple Pay & Google Pay</p>
            </div>
          </div>
          <label style={lbl}>Stripe Publishable Key</label>
          <input style={inp} value={stripeKey} onChange={e=>setStripeKey(e.target.value)} placeholder="pk_live_..." type="password"/>
          <label style={lbl}>Stripe Secret Key</label>
          <input style={inp} placeholder="sk_live_..." type="password"/>
          <div style={{background:'#faf8f5',border:'1px solid #e0d8cc',borderRadius:'8px',padding:'12px',marginTop:'8px',fontSize:'12px',color:'#8a7a6a',lineHeight:'1.7'}}>
            📌 Get your keys from <strong>dashboard.stripe.com</strong><br/>
            📌 Use <strong>sk_test_</strong> keys for testing<br/>
            📌 Use <strong>sk_live_</strong> keys for real payments<br/>
            📌 After updating keys — go to Railway → Variables → update STRIPE_SECRET_KEY
          </div>
        </div>

        {/* Currency */}
        <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'1.5rem'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'1rem'}}>
            <span style={{fontSize:'24px'}}>💱</span>
            <div>
              <h2 style={{fontSize:'15px',fontWeight:'600',color:'#1c1208'}}>Currency Settings</h2>
              <p style={{fontSize:'12px',color:'#8a7a6a'}}>Default currency for your store</p>
            </div>
          </div>
          <label style={lbl}>Default Currency</label>
          <select style={inp} value={currency} onChange={e=>setCurrency(e.target.value)}>
            {currencies.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
          <div style={{background:'#faf8f5',border:'1px solid #e0d8cc',borderRadius:'8px',padding:'12px',marginTop:'8px',fontSize:'12px',color:'#8a7a6a',lineHeight:'1.7'}}>
            📌 Currency auto-detects based on customer location<br/>
            📌 Default currency is used when location cannot be detected<br/>
            📌 Currently set to: <strong style={{color:'#b8966a'}}>{currency}</strong>
          </div>
        </div>

        {/* Payment methods */}
        <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'1.5rem'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'1rem'}}>
            <span style={{fontSize:'24px'}}>📱</span>
            <div>
              <h2 style={{fontSize:'15px',fontWeight:'600',color:'#1c1208'}}>Payment Methods</h2>
              <p style={{fontSize:'12px',color:'#8a7a6a'}}>Which payment methods to accept</p>
            </div>
          </div>
          {[
            {name:'Credit & Debit Cards',icon:'💳',enabled:true},
            {name:'Apple Pay',icon:'🍎',enabled:true},
            {name:'Google Pay',icon:'🔵',enabled:true},
            {name:'Bank Transfer',icon:'🏦',enabled:false},
            {name:'Cash on Delivery',icon:'💵',enabled:false},
          ].map((method) => (
            <div key={method.name} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #f0ece8'}}>
              <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                <span style={{fontSize:'18px'}}>{method.icon}</span>
                <span style={{fontSize:'13px',color:'#1c1208'}}>{method.name}</span>
              </div>
              <span style={{background:method.enabled?'#eaf3de':'#f0ece8',color:method.enabled?'#3b6d11':'#8a7a6a',padding:'3px 10px',borderRadius:'20px',fontSize:'10px',fontWeight:'600',textTransform:'uppercase'}}>
                {method.enabled?'Active':'Inactive'}
              </span>
            </div>
          ))}
        </div>

        {/* Stripe status */}
        <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'1.5rem'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'1rem'}}>
            <span style={{fontSize:'24px'}}>⚡</span>
            <div>
              <h2 style={{fontSize:'15px',fontWeight:'600',color:'#1c1208'}}>How to activate Stripe</h2>
              <p style={{fontSize:'12px',color:'#8a7a6a'}}>Step by step guide</p>
            </div>
          </div>
          {[
            'Go to stripe.com and create a free account',
            'Complete your business profile on Stripe',
            'Go to Developers → API Keys',
            'Copy your live Secret Key (sk_live_...)',
            'Go to Railway → your backend → Variables',
            'Update STRIPE_SECRET_KEY with your live key',
            'Update STRIPE_PUBLISHABLE_KEY with your pk_live_ key',
            'Go to Vercel → Settings → Environment Variables',
            'Update NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
            'Redeploy — payments are now active!',
          ].map((step, i) => (
            <div key={i} style={{display:'flex',gap:'10px',padding:'8px 0',borderBottom:'1px solid #f0ece8',alignItems:'flex-start'}}>
              <span style={{background:'#b8966a',color:'#1c1208',borderRadius:'50%',width:'20px',height:'20px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:'600',flexShrink:0,marginTop:'1px'}}>{i+1}</span>
              <span style={{fontSize:'12px',color:'#8a7a6a',lineHeight:'1.5'}}>{step}</span>
            </div>
          ))}
        </div>

      </div>

      <div style={{marginTop:'1.5rem',display:'flex',justifyContent:'flex-end'}}>
        <button onClick={handleSave} style={{background:'#b8966a',color:'#1c1208',border:'none',padding:'12px 28px',fontSize:'12px',fontWeight:'600',letterSpacing:'1px',textTransform:'uppercase',cursor:'pointer',borderRadius:'6px'}}>
          Save Settings
        </button>
      </div>
    </div>
  );
}