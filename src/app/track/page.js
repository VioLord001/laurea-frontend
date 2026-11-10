export default function Page() {
  return (
    <div style={{ minHeight: '100vh', background: '#faf8f5', fontFamily: "'Inter',sans-serif" }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>📦</div>
          <h1 style={{ fontSize: '32px', fontWeight: '300', color: '#1c1208', margin: '0 0 8px', letterSpacing: '-0.5px' }}>Track Your Order</h1>
          <p style={{ fontSize: '15px', color: '#8a7a6a', margin: 0 }}>Enter your order number to track your delivery.</p>
        </div>
        
        <div style={{ background: '#fff', border: '1px solid #e0d8cc', borderRadius: '16px', padding: '2rem', maxWidth: '480px' }}>
          <label style={{ fontSize: '11px', fontWeight: '600', color: '#8a7a6a', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>Order Number</label>
          <input placeholder="e.g. LFH-20261109-001" style={{ width: '100%', border: '1px solid #e0d8cc', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', outline: 'none', marginBottom: '12px', boxSizing: 'border-box' }} />
          <label style={{ fontSize: '11px', fontWeight: '600', color: '#8a7a6a', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>Email Address</label>
          <input type="email" placeholder="email@example.com" style={{ width: '100%', border: '1px solid #e0d8cc', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', outline: 'none', marginBottom: '16px', boxSizing: 'border-box' }} />
          <button style={{ width: '100%', background: '#1c1208', color: '#f5ede0', border: 'none', padding: '13px', fontSize: '12px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '8px' }}>Track Order</button>
          <p style={{ fontSize: '12px', color: '#a89880', marginTop: '12px', textAlign: 'center' }}>You can find your order number in your confirmation email.</p>
        </div>
      </div>
    </div>
  );
}
