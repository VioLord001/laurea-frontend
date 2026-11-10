export default function Page() {
  return (
    <div style={{ minHeight: '100vh', background: '#faf8f5', fontFamily: "'Inter',sans-serif" }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>🌿</div>
          <h1 style={{ fontSize: '32px', fontWeight: '300', color: '#1c1208', margin: '0 0 8px', letterSpacing: '-0.5px' }}>Sustainability</h1>
          <p style={{ fontSize: '15px', color: '#8a7a6a', margin: 0 }}>Our commitment to a better planet.</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {[
            { icon: '♻️', title: 'Sustainable Materials', body: 'We prioritise organic, recycled, and low-impact fabrics across our collections. At least 60% of our materials are sustainably sourced.' },
            { icon: '🚢', title: 'Carbon-Conscious Shipping', body: 'We consolidate shipments and partner with carriers committed to reducing emissions. We offset 100% of our direct shipping carbon.' },
            { icon: '📦', title: 'Minimal Packaging', body: 'Our packaging is 100% recyclable or biodegradable. We have eliminated single-use plastic from all our orders.' },
            { icon: '🤝', title: 'Ethical Production', body: 'Every supplier we work with is vetted for fair wages, safe conditions and ethical labour practices.' },
          ].map((item, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #e0d8cc', borderRadius: '12px', padding: '1.5rem', display: 'flex', gap: '1rem' }}>
              <span style={{ fontSize: '28px', flexShrink: 0 }}>{item.icon}</span>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1c1208', margin: '0 0 6px' }}>{item.title}</h3>
                <p style={{ fontSize: '13px', color: '#8a7a6a', margin: 0, lineHeight: '1.7' }}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
