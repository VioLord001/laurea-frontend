export default function Page() {
  return (
    <div style={{ minHeight: '100vh', background: '#faf8f5', fontFamily: "'Inter',sans-serif" }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>📰</div>
          <h1 style={{ fontSize: '32px', fontWeight: '300', color: '#1c1208', margin: '0 0 8px', letterSpacing: '-0.5px' }}>Press</h1>
          <p style={{ fontSize: '15px', color: '#8a7a6a', margin: 0 }}>Media resources and press coverage.</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: '#fff', border: '1px solid #e0d8cc', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1c1208', margin: '0 0 8px' }}>Press Enquiries</h3>
            <p style={{ fontSize: '13px', color: '#8a7a6a', margin: '0 0 12px', lineHeight: '1.7' }}>For media enquiries, interview requests, or press kit downloads, please contact our communications team.</p>
            <a href="mailto:press@laureafashionhouse.com" style={{ background: '#1c1208', color: '#f5ede0', padding: '10px 20px', borderRadius: '8px', fontSize: '11px', fontWeight: '600', textDecoration: 'none', letterSpacing: '1px', textTransform: 'uppercase', display: 'inline-block' }}>press@laureafashionhouse.com</a>
          </div>
        </div>
      </div>
    </div>
  );
}
