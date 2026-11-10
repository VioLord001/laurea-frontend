export default function Page() {
  return (
    <div style={{ minHeight: '100vh', background: '#faf8f5', fontFamily: "'Inter',sans-serif" }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔒</div>
          <h1 style={{ fontSize: '32px', fontWeight: '300', color: '#1c1208', margin: '0 0 8px', letterSpacing: '-0.5px' }}>Privacy Policy</h1>
          <p style={{ fontSize: '15px', color: '#8a7a6a', margin: 0 }}>How we collect, use and protect your data.</p>
        </div>
        
        <div style={{ background: '#fff', border: '1px solid #e0d8cc', borderRadius: '12px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {[
            ['What we collect', 'We collect your name, email, shipping address, and payment information when you place an order. We also collect browsing data to improve your experience.'],
            ['How we use it', 'Your data is used to process orders, send shipping updates, and (with your consent) send promotional emails. We never sell your personal data to third parties.'],
            ['Cookies', 'We use cookies to keep you logged in, remember your cart, and analyse site traffic. You can disable cookies in your browser settings at any time.'],
            ['Your rights', 'You have the right to access, correct, or delete your personal data at any time. Email privacy@laureafashionhouse.com to make a request.'],
            ['Data security', 'All data is encrypted in transit (SSL/TLS). Payment details are handled by Stripe and never stored on our servers.'],
            ['Contact', 'For privacy concerns, contact privacy@laureafashionhouse.com. Last updated: November 2026.'],
          ].map(([heading, body]) => (
            <div key={heading}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1c1208', margin: '0 0 6px' }}>{heading}</h3>
              <p style={{ fontSize: '13px', color: '#8a7a6a', margin: 0, lineHeight: '1.7' }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
