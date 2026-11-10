export default function Page() {
  return (
    <div style={{ minHeight: '100vh', background: '#faf8f5', fontFamily: "'Inter',sans-serif" }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>💼</div>
          <h1 style={{ fontSize: '32px', fontWeight: '300', color: '#1c1208', margin: '0 0 8px', letterSpacing: '-0.5px' }}>Careers</h1>
          <p style={{ fontSize: '15px', color: '#8a7a6a', margin: 0 }}>Join the Laurea team.</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: '#fff', border: '1px solid #e0d8cc', borderRadius: '12px', padding: '1.5rem' }}>
            <p style={{ fontSize: '14px', color: '#5a4a3a', lineHeight: '1.9', margin: 0 }}>We are always looking for talented, passionate people to join the Laurea family. We offer a creative environment, competitive compensation, and the chance to shape the future of fashion.</p>
          </div>
          {[
            { title: 'Fashion Stylist', dept: 'Design', type: 'Full-time', location: 'Remote' },
            { title: 'Customer Experience Lead', dept: 'Support', type: 'Full-time', location: 'Remote' },
            { title: 'Social Media Manager', dept: 'Marketing', type: 'Part-time', location: 'Remote' },
          ].map((job, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #e0d8cc', borderRadius: '12px', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1c1208', margin: '0 0 4px' }}>{job.title}</h3>
                <div style={{ fontSize: '12px', color: '#8a7a6a' }}>{job.dept} · {job.type} · {job.location}</div>
              </div>
              <a href="mailto:careers@laureafashionhouse.com" style={{ background: '#1c1208', color: '#f5ede0', padding: '10px 20px', borderRadius: '8px', fontSize: '11px', fontWeight: '600', textDecoration: 'none', letterSpacing: '1px', textTransform: 'uppercase' }}>Apply</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
