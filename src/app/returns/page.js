export default function Page() {
  return (
    <div style={{ minHeight: '100vh', background: '#faf8f5', fontFamily: "'Inter',sans-serif" }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>↩️</div>
          <h1 style={{ fontSize: '32px', fontWeight: '300', color: '#1c1208', margin: '0 0 8px', letterSpacing: '-0.5px' }}>Returns & Refunds</h1>
          <p style={{ fontSize: '15px', color: '#8a7a6a', margin: 0 }}>Easy 30-day returns on all orders.</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {[
            { icon: '✅', title: '30-Day Returns', body: 'Return any unworn item within 30 days of delivery for a full refund or exchange. Items must be in original condition with tags attached.' },
            { icon: '📦', title: 'How to Return', body: '1. Email us at returns@laureafashionhouse.com with your order number.\n2. Pack items securely in original packaging if possible.\n3. Drop off at any courier. We cover return shipping on faulty items.' },
            { icon: '💳', title: 'Refunds', body: 'Refunds are processed within 5–7 business days of receiving your return. The amount is credited back to your original payment method.' },
            { icon: '❌', title: 'Non-Returnable Items', body: 'Sale items, swimwear, underwear, pierced jewellery, and gift cards cannot be returned for hygiene and safety reasons.' },
          ].map((item, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #e0d8cc', borderRadius: '12px', padding: '1.5rem', display: 'flex', gap: '1rem' }}>
              <span style={{ fontSize: '24px', flexShrink: 0 }}>{item.icon}</span>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1c1208', margin: '0 0 6px' }}>{item.title}</h3>
                <p style={{ fontSize: '13px', color: '#8a7a6a', margin: 0, lineHeight: '1.7', whiteSpace: 'pre-line' }}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
