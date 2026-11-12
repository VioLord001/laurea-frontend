'use client';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useCartStore from '@/store/useCartStore';
import { orderAPI, paymentAPI, promoAPI } from '@/lib/api';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
const CARD_STYLE = { style: { base: { fontSize: '14px', color: '#1c1208', fontFamily: 'inherit', '::placeholder': { color: '#a89880' } }, invalid: { color: '#cc0000' } } };
const AGENT_WHATSAPP = '5513955466720';

const COUNTRIES = [
  { code: 'US', name: 'United States' }, { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' }, { code: 'AU', name: 'Australia' },
  { code: 'NG', name: 'Nigeria' }, { code: 'GH', name: 'Ghana' },
  { code: 'ZA', name: 'South Africa' }, { code: 'KE', name: 'Kenya' },
  { code: 'DE', name: 'Germany' }, { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' }, { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' }, { code: 'SE', name: 'Sweden' },
  { code: 'AE', name: 'United Arab Emirates' }, { code: 'SA', name: 'Saudi Arabia' },
  { code: 'IN', name: 'India' }, { code: 'SG', name: 'Singapore' },
  { code: 'JP', name: 'Japan' }, { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' }, { code: 'NZ', name: 'New Zealand' },
];

const PAYMENT_METHODS = [
  { id: 'card', label: 'Debit / Credit Card', icon: '💳', desc: 'Visa, Mastercard, Amex' },
  { id: 'bank', label: 'Bank Transfer', icon: '🏦', desc: 'Direct bank payment' },
  { id: 'third_party', label: 'Pay via WhatsApp Agent', icon: '💬', desc: 'Pay through our agent — no card needed' },
  { id: 'gift', label: 'Redeem Gift Card', icon: '🎁', desc: 'Enter your gift card code' },
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

function CheckoutForm({ items, subtotal, shipping, total, clearCart }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoMsg, setPromoMsg] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [giftCardCode, setGiftCardCode] = useState('');
  const [bankConfirmed, setBankConfirmed] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', zip: '', country: '' });
  const finalTotal = Math.max(0, total - promoDiscount);
  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const applyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true); setPromoMsg('');
    try {
      const res = await promoAPI.validate(promoCode.trim());
      const d = res.data?.discount || 0;
      setPromoDiscount(d);
      setPromoMsg('Code applied — $' + d.toFixed(2) + ' off');
    } catch { setPromoDiscount(0); setPromoMsg('Invalid or expired code'); }
    finally { setPromoLoading(false); }
  };

  const goToPayment = (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.address || !form.city || !form.country) {
      setError('Please fill in all required fields'); return;
    }
    setError(''); setStep(2);
  };

  const buildWhatsAppUrl = (orderId) => {
    const lines = items.map(i => `  • ${i.product.name} x${i.quantity} — $${(parseFloat(i.product.price) * i.quantity).toFixed(2)}`).join('\n');
    const msg = encodeURIComponent(
      `Hello Laurea Fashion House Agent 👋\n\nI would like to pay for my order via Third Party Payment.\n\n📦 *Order Reference:* ${orderId}\n👤 *Name:* ${form.firstName} ${form.lastName}\n\n*Items:*\n${lines}\n\n💰 *Total Amount:* $${finalTotal.toFixed(2)}\n\nPlease confirm payment details. Thank you!`
    );
    return `https://wa.me/${AGENT_WHATSAPP}?text=${msg}`;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const orderData = {
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity, price: i.product.price, variant: i.variant })),
        shipping: { ...form }, promoCode: promoCode || undefined, total: finalTotal, paymentMethod,
      };

      if (paymentMethod === 'third_party') {
        const r = await orderAPI.create({ ...orderData, status: 'pending_third_party' });
        const id = r.data?.order?.id || r.data?.id || `ORD-${Date.now()}`;
        const itemsParam = encodeURIComponent(items.map(i => `${i.product.name} x${i.quantity}`).join(', '));
        window.open(buildWhatsAppUrl(id), '_blank');
        clearCart();
        router.push(`/upload-receipt?orderId=${id}&total=${finalTotal.toFixed(2)}&items=${itemsParam}`);
        return;
      }

      if (paymentMethod === 'gift') {
        if (!giftCardCode.trim()) { setError('Please enter your gift card code'); setLoading(false); return; }
        const r = await orderAPI.create({ ...orderData, giftCard: giftCardCode.trim() });
        const id = r.data?.order?.id || r.data?.id;
        clearCart(); router.push('/order-confirmation?order=' + id); return;
      }
      if (paymentMethod === 'bank') {
        const r = await orderAPI.create({ ...orderData, status: 'pending_payment' });
        const id = r.data?.order?.id || r.data?.id;
        clearCart(); router.push('/order-confirmation?order=' + id + '&method=bank'); return;
      }
      if (!stripe || !elements) return;
      const r = await orderAPI.create(orderData);
      const id = r.data?.order?.id || r.data?.id;
      const ir = await paymentAPI.createIntent(id);
      const secret = ir.data?.clientSecret;
      if (!secret) throw new Error('Payment setup failed. Please try again.');
      const { error: se, paymentIntent } = await stripe.confirmCardPayment(secret, {
        payment_method: { card: elements.getElement(CardElement), billing_details: { name: form.firstName + ' ' + form.lastName, email: form.email } },
      });
      if (se) throw new Error(se.message);
      if (paymentIntent.status === 'succeeded') { clearCart(); router.push('/order-confirmation?order=' + id); }
    } catch (err) { setError(err.message || 'Payment failed.'); }
    finally { setLoading(false); }
  };

  const inp = { width: '100%', border: '1px solid #e0d8cc', borderRadius: '6px', padding: '10px 12px', fontSize: '13px', outline: 'none', boxSizing: 'border-box', background: '#fff' };
  const lbl = { fontSize: '11px', color: '#8a7a6a', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' };
  const req = <span style={{ color: '#cc0000' }}>*</span>;

  const summary = (
    <div style={{ background: '#fff', border: '1px solid #e0d8cc', borderRadius: '12px', padding: '1.25rem', marginBottom: isMobile ? '1.5rem' : 0 }}>
      <h2 style={{ fontSize: '13px', fontWeight: '600', color: '#1c1208', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Order Summary</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1rem' }}>
        {items.map((item) => {
          const img = item.product.primary_image || item.product.images?.[0];
          return (
            <div key={item.key} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '60px', background: '#f5ede0', borderRadius: '4px', flexShrink: 0, overflow: 'hidden' }}>
                {img ? <img src={img} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '20px' }}>🛍</span>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '12px', color: '#1c1208', fontWeight: '500', margin: '0 0 2px' }}>{item.product.name}</p>
                <p style={{ fontSize: '10px', color: '#8a7a6a', margin: 0 }}>Qty: {item.quantity}</p>
              </div>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#1c1208', flexShrink: 0, margin: 0 }}>${(parseFloat(item.product.price) * item.quantity).toFixed(2)}</p>
            </div>
          );
        })}
      </div>
      <div style={{ borderTop: '1px solid #e0d8cc', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8a7a6a' }}><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8a7a6a' }}><span>Shipping</span><span style={{ color: shipping === 0 ? '#3b6d11' : '#1c1208' }}>{shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)}</span></div>
        {promoDiscount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#3b6d11' }}><span>Discount</span><span>-${promoDiscount.toFixed(2)}</span></div>}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: '700', color: '#1c1208', borderTop: '1px solid #e0d8cc', paddingTop: '10px', marginTop: '4px' }}><span>Total</span><span>${finalTotal.toFixed(2)}</span></div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 320px', gap: isMobile ? '0' : '2rem', alignItems: 'start' }}>
      <div>
        {isMobile && summary}
        <div style={{ display: 'flex', marginBottom: '2rem' }}>
          {['Shipping', 'Payment'].map((s, i) => (
            <div key={s} style={{ flex: 1, textAlign: 'center', paddingBottom: '10px', borderBottom: '2px solid ' + (step === i + 1 ? '#b8966a' : '#e0d8cc'), color: step === i + 1 ? '#b8966a' : '#8a7a6a', fontSize: '11px', fontWeight: step === i + 1 ? '600' : '400', letterSpacing: '1px', textTransform: 'uppercase' }}>
              {i + 1}. {s}
            </div>
          ))}
        </div>
        {error && <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', color: '#cc0000', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', marginBottom: '1rem' }}>{error}</div>}

        {step === 1 && (
          <form onSubmit={goToPayment}>
            <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#1c1208', marginBottom: '1.25rem' }}>Shipping Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div><label style={lbl}>First name {req}</label><input name="firstName" value={form.firstName} onChange={set} required style={inp} /></div>
              <div><label style={lbl}>Last name {req}</label><input name="lastName" value={form.lastName} onChange={set} required style={inp} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div><label style={lbl}>Email {req}</label><input name="email" value={form.email} onChange={set} type="email" required style={inp} /></div>
              <div><label style={lbl}>Phone</label><input name="phone" value={form.phone} onChange={set} style={inp} /></div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={lbl}>Country {req}</label>
              <select name="country" value={form.country} onChange={set} required style={{ ...inp, cursor: 'pointer' }}>
                <option value="">Select your country...</option>
                {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={lbl}>Street address {req}</label>
              <input name="address" value={form.address} onChange={set} required style={inp} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '2fr 1fr 1fr', gap: '12px', marginBottom: '1.5rem' }}>
              <div><label style={lbl}>City {req}</label><input name="city" value={form.city} onChange={set} required style={inp} /></div>
              <div><label style={lbl}>State / Region</label><input name="state" value={form.state} onChange={set} style={inp} /></div>
              <div><label style={lbl}>Postal / ZIP</label><input name="zip" value={form.zip} onChange={set} style={inp} /></div>
            </div>
            <button type="submit" style={{ width: '100%', background: '#1c1208', color: '#f5ede0', border: 'none', padding: '14px', fontSize: '12px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '6px' }}>
              Continue to Payment
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handlePayment}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
              <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#8a7a6a', fontSize: '12px', cursor: 'pointer', padding: 0 }}>← Back</button>
              <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#1c1208', margin: 0 }}>Payment Method</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
              {PAYMENT_METHODS.map((m) => (
                <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', border: '2px solid ' + (paymentMethod === m.id ? (m.id === 'third_party' ? '#25D366' : '#b8966a') : '#e0d8cc'), borderRadius: '8px', padding: '12px 14px', cursor: 'pointer', background: paymentMethod === m.id ? (m.id === 'third_party' ? '#f0fdf4' : '#fdf8f2') : '#fff' }}>
                  <input type="radio" name="paymentMethod" value={m.id} checked={paymentMethod === m.id} onChange={() => setPaymentMethod(m.id)} style={{ accentColor: m.id === 'third_party' ? '#25D366' : '#b8966a', width: '16px', height: '16px', flexShrink: 0 }} />
                  <span style={{ fontSize: '20px' }}>{m.icon}</span>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#1c1208', margin: 0 }}>{m.label}</p>
                    <p style={{ fontSize: '11px', color: '#8a7a6a', margin: 0 }}>{m.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {paymentMethod === 'card' && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={lbl}>Card details {req}</label>
                <div style={{ border: '1px solid #e0d8cc', borderRadius: '6px', padding: '12px 14px', background: '#fff' }}><CardElement options={CARD_STYLE} /></div>
                <p style={{ fontSize: '10px', color: '#a89880', marginTop: '6px' }}>🔒 Secured by Stripe — your card details are never stored</p>
              </div>
            )}

            {paymentMethod === 'bank' && (
              <div style={{ background: '#f5f9ff', border: '1px solid #c8d8f0', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#1c1208', marginBottom: '8px' }}>Bank Transfer Instructions</p>
                <p style={{ fontSize: '12px', color: '#4a6080', lineHeight: '1.6', margin: 0 }}>After placing your order, you will receive an email with our bank account details. Your order ships once payment clears (1-3 business days).</p>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={bankConfirmed} onChange={(e) => setBankConfirmed(e.target.checked)} style={{ accentColor: '#b8966a', width: '14px', height: '14px' }} />
                  <span style={{ fontSize: '12px', color: '#1c1208' }}>I understand my order ships after payment is received</span>
                </label>
              </div>
            )}

            {paymentMethod === 'third_party' && (
              <div style={{ background: '#f0fdf4', border: '2px solid #86efac', borderRadius: '10px', padding: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.864L.054 23.447a.75.75 0 0 0 .917.973l5.698-1.49A11.953 11.953 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.869 0-3.618-.49-5.129-1.345l-.369-.214-3.829 1.001 1.019-3.72-.228-.376A9.959 9.959 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                  <p style={{ fontSize: '13px', fontWeight: '700', color: '#15803d', margin: 0 }}>WhatsApp Agent Payment</p>
                </div>
                <p style={{ fontSize: '12px', color: '#166534', lineHeight: '1.7', margin: 0 }}>
                  When you click <strong>"Place Order"</strong> below:<br/>
                  1. WhatsApp will open with your order details pre-written<br/>
                  2. Send the message to our agent<br/>
                  3. Make payment & receive your receipt<br/>
                  4. Upload the receipt on the next page<br/>
                  5. Your order is confirmed within <strong>10 minutes</strong> ✓
                </p>
              </div>
            )}

            {paymentMethod === 'gift' && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={lbl}>Gift card code {req}</label>
                <input value={giftCardCode} onChange={(e) => setGiftCardCode(e.target.value)} placeholder="Enter your gift card code" style={inp} />
                <p style={{ fontSize: '11px', color: '#8a7a6a', marginTop: '6px' }}>Gift cards cover the full order total.</p>
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={lbl}>Promo code (optional)</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="e.g. LAUREA20" style={{ flex: 1, border: '1px solid #e0d8cc', borderRadius: '6px', padding: '10px 12px', fontSize: '13px', outline: 'none', background: '#fff' }} />
                <button type="button" onClick={applyPromo} disabled={promoLoading} style={{ background: '#f5ede0', border: '1px solid #e0d8cc', borderRadius: '6px', padding: '10px 16px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  {promoLoading ? '...' : 'Apply'}
                </button>
              </div>
              {promoMsg && <p style={{ fontSize: '11px', marginTop: '6px', color: promoDiscount > 0 ? '#3b6d11' : '#cc0000' }}>{promoMsg}</p>}
            </div>

            <button type="submit"
              disabled={!stripe || loading || (paymentMethod === 'bank' && !bankConfirmed)}
              style={{
                width: '100%',
                background: loading ? '#8a7a6a' : paymentMethod === 'third_party' ? '#25D366' : '#b8966a',
                color: '#fff', border: 'none', padding: '14px', fontSize: '12px', fontWeight: '600',
                letterSpacing: '1px', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
                borderRadius: '6px', opacity: (paymentMethod === 'bank' && !bankConfirmed) ? 0.6 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}>
              {loading ? 'Processing...' :
                paymentMethod === 'third_party' ? '💬 Place Order & Open WhatsApp' :
                paymentMethod === 'bank' ? 'Place Order — Pay by Bank Transfer' :
                paymentMethod === 'gift' ? 'Redeem & Place Order' :
                'Pay $' + finalTotal.toFixed(2)}
            </button>
          </form>
        )}
      </div>
      {!isMobile && <div style={{ position: 'sticky', top: '80px' }}>{summary}</div>}
    </div>
  );
}

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotal = items.reduce((sum, i) => sum + parseFloat(i.product.price || 0) * i.quantity, 0);
  const shipping = subtotal >= 30 ? 0 : 4.99;
  const total = subtotal + shipping;
  if (items.length === 0) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <p style={{ fontSize: '48px' }}>🛒</p>
        <h2 style={{ fontSize: '20px', fontWeight: '300', color: '#1c1208' }}>Your bag is empty</h2>
        <Link href="/" style={{ background: '#1c1208', color: '#f5ede0', padding: '12px 28px', textDecoration: 'none', fontSize: '12px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', borderRadius: '6px' }}>Continue shopping</Link>
      </div>
    );
  }
  return (
    <div style={{ minHeight: '100vh', background: '#faf8f5', padding: '1.5rem 1rem' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <nav style={{ fontSize: '11px', color: '#8a7a6a', marginBottom: '1.5rem', display: 'flex', gap: '6px' }}>
          <Link href="/" style={{ color: '#8a7a6a', textDecoration: 'none' }}>Home</Link>
          <span>›</span>
          <Link href="/cart" style={{ color: '#8a7a6a', textDecoration: 'none' }}>Bag</Link>
          <span>›</span>
          <span style={{ color: '#1c1208' }}>Checkout</span>
        </nav>
        <h1 style={{ fontSize: '22px', fontWeight: '300', color: '#1c1208', marginBottom: '1.5rem' }}>Checkout</h1>
        <Elements stripe={stripePromise}>
          <CheckoutForm items={items} subtotal={subtotal} shipping={shipping} total={total} clearCart={clearCart} />
        </Elements>
      </div>
    </div>
  );
}
