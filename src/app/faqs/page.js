export default function Page() {
  return (
    <div style={{ minHeight: '100vh', background: '#faf8f5', fontFamily: "'Inter',sans-serif" }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>❓</div>
          <h1 style={{ fontSize: '32px', fontWeight: '300', color: '#1c1208', margin: '0 0 8px', letterSpacing: '-0.5px' }}>FAQs</h1>
          <p style={{ fontSize: '15px', color: '#8a7a6a', margin: 0 }}>Answers to our most common questions.</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            ['How long does shipping take?', 'Standard shipping takes 3–7 business days. Express shipping (1–2 days) is available at checkout. International orders may take 7–14 days.'],
            ['Can I change or cancel my order?', 'Orders can be changed or cancelled within 1 hour of placing them. After that, the order enters processing. Contact us immediately at hello@laureafashionhouse.com.'],
            ['How do I know my size?', 'Visit our Sizing Guide page for detailed measurements. If you are between sizes, we recommend sizing up for a comfortable fit.'],
            ['Are your products authentic?', 'Yes. Every Laurea piece is designed and quality-checked in-house. We do not sell third-party or replica items.'],
            ['Do you ship internationally?', 'Yes, we ship to over 30 countries. Shipping costs and delivery times vary by location and are shown at checkout.'],
            ['How do I use a promo code?', 'Enter your promo code in the "Promo Code" field on the checkout page and click Apply before completing payment.'],
          ].map(([q, a], i) => (
            <details key={i} style={{ background: '#fff', border: '1px solid #e0d8cc', borderRadius: '12px', padding: '1rem 1.25rem' }}>
              <summary style={{ fontSize: '14px', fontWeight: '600', color: '#1c1208', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {q} <span style={{ color: '#b8966a', fontSize: '18px', marginLeft: '8px' }}>+</span>
              </summary>
              <p style={{ fontSize: '13px', color: '#8a7a6a', margin: '10px 0 0', lineHeight: '1.7' }}>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
