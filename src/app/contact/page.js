export default function Page() {
  return (
    <div style={{ minHeight: '100vh', background: '#faf8f5', fontFamily: "'Inter',sans-serif" }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>✉️</div>
          <h1 style={{ fontSize: '32px', fontWeight: '300', color: '#1c1208', margin: '0 0 8px', letterSpacing: '-0.5px' }}>Contact Us</h1>
          <p style={{ fontSize: '15px', color: '#8a7a6a', margin: 0 }}>We'd love to hear from you.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {[
            { icon: '✉️', label: 'Email', value: 'hello@laureafashionhouse.com', link: 'mailto:hello@laureafashionhouse.com' },
            { icon: '💬', label: 'WhatsApp', value: '+1 (555) 000-0000', link: 'https://wa.me/15550000000' },
            { icon: '🕐', label: 'Hours', value: 'Mon–Fri, 9am–6pm WAT', link: null },
          ].map((c, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #e0d8cc', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{c.icon}</div>
              <div style={{ fontSize: '11px', color: '#a89880', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{c.label}</div>
              {c.link ? <a href={c.link} style={{ fontSize: '14px', color: '#b8966a', textDecoration: 'none', fontWeight: '500' }}>{c.value}</a> : <div style={{ fontSize: '14px', color: '#1c1208' }}>{c.value}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
