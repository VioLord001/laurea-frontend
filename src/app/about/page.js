export default function Page() {
  return (
    <div style={{ minHeight: '100vh', background: '#faf8f5', fontFamily: "'Inter',sans-serif" }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>🏛️</div>
          <h1 style={{ fontSize: '32px', fontWeight: '300', color: '#1c1208', margin: '0 0 8px', letterSpacing: '-0.5px' }}>About Us</h1>
          <p style={{ fontSize: '15px', color: '#8a7a6a', margin: 0 }}>The story behind Laurea Fashion House.</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: '#fff', border: '1px solid #e0d8cc', borderRadius: '12px', padding: '2rem' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '300', color: '#1c1208', marginBottom: '1rem' }}>Our Story</h2>
            <p style={{ fontSize: '14px', color: '#5a4a3a', lineHeight: '1.9', margin: 0 }}>Laurea Fashion House was born from a belief that luxury should be accessible — that every person deserves to wear something that makes them feel confident, seen, and beautiful. Founded with a passion for timeless design and meticulous craftsmanship, we curate pieces that transcend seasons and trends.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {[['2020', 'Founded'], ['50+', 'Countries served'], ['10k+', 'Happy customers'], ['100%', 'Quality guaranteed']].map(([num, label]) => (
              <div key={label} style={{ background: '#1c1208', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#b8966a', marginBottom: '4px' }}>{num}</div>
                <div style={{ fontSize: '11px', color: 'rgba(245,237,224,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
