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
  const [giftCard, setGiftCard] = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', zip: '', country: 'US' });
  const finalTotal = Math.max(0, total - promoDiscount);
  const handleField = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const applyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true); setPromoMsg('');
    try {
      const res = await promoAPI.validate(promoCode.trim());
      const discount = res.data?.discount || 0;
      setPromoDiscount(discount);
      setPromoMsg('Code applied — $' + discount.toFixed(2) + ' off');
    } catch { setPromoDiscount(0); setPromoMsg('Invalid or expired code'); }
    finally { setPromoLoading(false); }
  };

  const handleShippingNext = (e) => {
    e.preventDefault();
    for (const f of ['firstName','lastName','email','address','city','state','zip']) {
      if (!form[f].trim()) { setError('Please fill in ' + f); return; }
    }
    setError(''); setStep(2);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true); setError('');
    try {
      const orderRes = await orderAPI.create({
        items: items.map((item) => ({ productId: item.product.id, quantity: item.quantity, price: item.product.price, variant: item.variant })),
        shipping: { ...form }, promoCode: promoCode || undefined, giftCard: giftCard || undefined, total: finalTotal,
      });
      const orderId = orderRes.data?.order?.id || orderRes.data?.id;
      const intentRes = await paymentAPI.createIntent(orderId);
      const clientSecret = intentRes.data?.clientSecret;
      if (!clientSecret) throw new Error('Payment setup failed. Please try again.');
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement), billing_details: { name: form.firstName + ' ' + form.lastName, email: form.email, address: { line1: form.address, city: form.city, state: form.state, postal_code: form.zip, country: form.country } } },
      });
      if (stripeError) throw new Error(stripeError.message);
      if (paymentIntent.status === 'succeeded') { clearCart(); router.push('/order-confirmation?order=' + orderId); }
    } catch (err) { setError(err.message || 'Payment failed. Please try again.'); }
    finally { setLoading(false); }
  };

  const inp = { width: '100%', border: '1px solid #e0d8cc', borderRadius: '6px', padding: '10px 12px', fontSize: '13px', outline: 'none', boxSizing: 'border-box', background: '#fff' };
  const lbl = { fontSize: '11px', color: '#8a7a6a', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' };

  const summary = (
    <div style={{ background: '#fff', border: '1px solid #e0d8cc', borderRadius: '12px', padding: '1.25rem', marginBottom: isMobile ? '1.5rem' : 0 }}>
      <h2 style={{ fontSize: '13px', fontWeight: '600', color: '#1c1208', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Order Summary</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1rem' }}>
        {items.map((item) => {
          const img = item.product.primary_image || item.product.images?.[0];
          return (
            <div key={item.key} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '60px', background: '#f5ede0', borderRadius: '4px', flexShrink: 0, overflow: 'hidden' }}>
                {img ? <img src={img} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🛍</div>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '12px', color: '#1c1208', fontWeight: '500', lineHeight: '1.3', marginBottom: '2px' }}>{item.product.name}</p>
                <p style={{ fontSize: '10px', color: '#8a7a6a' }}>Qty: {item.quantity}</p>
              </div>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#1c1208', flexShrink: 0 }}>${(parseFloat(item.product.price) * item.quantity).toFixed(2)}</p>
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
          {['Shipping','Payment'].map((s, i) => (
            <div key={s} style={{ flex: 1, textAlign: 'center', paddingBottom: '10px', borderBottom: '2px solid ' + (step === i+1 ? '#b8966a' : '#e0d8cc'), color: step === i+1 ? '#b8966a' : '#8a7a6a', fontSize: '11px', fontWeight: step === i+1 ? '600' : '400', letterSpacing: '1px', textTransform: 'uppercase' }}>
              {i+1}. {s}
            </div>
          ))}
        </div>
        {error && <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', color: '#cc0000', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', marginBottom: '1rem' }}>{error}</div>}

        {step === 1 && (
          <form onSubmit={handleShippingNext}>
            <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#1c1208', marginBottom: '1.25rem' }}>Shipping Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              {[['firstName','First name'],['lastName','Last name']].map(([name, label]) => (
                <div key={name}><label style={lbl}>{label}</label><input name={name} value={form[name]} onChange={handleField} required style={inp} /></div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              {[['email','Email'],['phone','Phone (optional)']].map(([name, label]) => (
                <div key={name}><label style={lbl}>{label}</label><input name={name} value={form[name]} onChange={handleField} type={name==='email'?'email':'text'} style={inp} /></div>
              ))}
            </div>
            <div style={{ marginBottom: '12px' }}><label style={lbl}>Street address</label><input name="address" value={form.address} onChange={handleField} required style={inp} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '2fr 1fr 1fr', gap: '12px', marginBottom: '1.5rem' }}>
              {[['city','City'],['state','State'],['zip','ZIP']].map(([name, label]) => (
                <div key={name}><label style={lbl}>{label}</label><input name={name} value={form[name]} onChange={handleField} required style={inp} /></div>
              ))}
            </div>
            <button type="submit" style={{ width: '100%', background: '#1c1208', color: '#f5ede0', border: 'none', padding: '14px', fontSize: '12px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '6px' }}>
              Continue to Payment
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handlePayment}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
              <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#8a7a6a', fontSize: '12px', cursor: 'pointer', padding: 0 }}>Back</button>
              <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#1c1208', margin: 0 }}>Payment</h2>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={lbl}>Credit / Debit card</label>
              <div style={{ border: '1px solid #e0d8cc', borderRadius: '6px', padding: '12px 14px', background: '#fff' }}><CardElement options={CARD_STYLE} /></div>
              <p style={{ fontSize: '10px', color: '#a89880', marginTop: '6px' }}>Secured by Stripe — your card details are never stored</p>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={lbl}>Gift card code (optional)</label>
              <input value={giftCard} onChange={(e) => setGiftCard(e.target.value)} placeholder="Enter gift card code" style={inp} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={lbl}>Promo code</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="e.g. LAUREA20" style={{ flex: 1, border: '1px solid #e0d8cc', borderRadius: '6px', padding: '10px 12px', fontSize: '13px', outline: 'none', background: '#fff' }} />
                <button type="button" onClick={applyPromo} disabled={promoLoading} style={{ background: '#f5ede0', border: '1px solid #e0d8cc', borderRadius: '6px', padding: '10px 16px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', textTransform: 'uppercase' }}>
                  {promoLoading ? '...' : 'Apply'}
                </button>
              </div>
              {promoMsg && <p style={{ fontSize: '11px', marginTop: '6px', color: promoDiscount > 0 ? '#3b6d11' : '#cc0000' }}>{promoMsg}</p>}
            </div>
            <button type="submit" disabled={!stripe || loading} style={{ width: '100%', background: loading ? '#8a7a6a' : '#b8966a', color: '#fff', border: 'none', padding: '14px', fontSize: '12px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', borderRadius: '6px' }}>
              {loading ? 'Processing...' : 'Pay $' + finalTotal.toFixed(2)}
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
  const subtotal = items.reduce((sum, item) => sum + parseFloat(item.product.price || 0) * item.quantity, 0);
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
