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

const COUNTRIES = [
  { code: 'US', name: 'United States' }, { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' }, { code: 'AU', name: 'Australia' },
  { code: 'NG', name: 'Nigeria' }, { code: 'GH', name: 'Ghana' },
  { code: 'ZA', name: 'South Africa' }, { code: 'KE', name: 'Kenya' },
  { code: 'DE', name: 'Germany' }, { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' }, { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' }, { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' }, { code: 'DK', name: 'Denmark' },
  { code: 'CH', name: 'Switzerland' }, { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Belgium' }, { code: 'PT', name: 'Portugal' },
  { code: 'IE', name: 'Ireland' }, { code: 'PL', name: 'Poland' },
  { code: 'AE', name: 'United Arab Emirates' }, { code: 'SA', name: 'Saudi Arabia' },
  { code: 'IN', name: 'India' }, { code: 'SG', name: 'Singapore' },
  { code: 'JP', name: 'Japan' }, { code: 'KR', name: 'South Korea' },
  { code: 'CN', name: 'China' }, { code: 'HK', name: 'Hong Kong' },
  { code: 'NZ', name: 'New Zealand' }, { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' }, { code: 'AR', name: 'Argentina' },
  { code: 'CO', name: 'Colombia' }, { code: 'CL', name: 'Chile' },
];

const PAYMENT_METHODS = [
  { id: 'card', label: 'Debit / Credit Card', icon: '💳', desc: 'Visa, Mastercard, Amex' },
  { id: 'bank', label: 'Bank Transfer', icon: '🏦', desc: 'Direct bank payment' },
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
  const [error, setError] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoMsg, setPromoMsg] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [giftCardCode, setGiftCardCode] = useState("");
  const [giftCardMsg, setGiftCardMsg] = useState("");
  const [bankConfirmed, setBankConfirmed] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", address: "", city: "", state: "", zip: "", country: "US" });
  const finalTotal = Math.max(0, total - promoDiscount);
  const handleField = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const applyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true); setPromoMsg("");
    try {
      const res = await promoAPI.validate(promoCode.trim());
      const discount = res.data?.discount || 0;
      setPromoDiscount(discount);
      setPromoMsg("Code applied — $" + discount.toFixed(2) + " off");
    } catch { setPromoDiscount(0); setPromoMsg("Invalid or expired code"); }
    finally { setPromoLoading(false); }
  };

  const handleShippingNext = (e) => {
    e.preventDefault();
    for (const f of ["firstName", "lastName", "email", "address", "city", "country"]) {
      if (!form[f].trim()) { setError("Please fill in all required fields"); return; }
    }
    setError(""); setStep(2);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const orderData = {
        items: items.map((item) => ({ productId: item.product.id, quantity: item.quantity, price: item.product.price, variant: item.variant })),
        shipping: { ...form }, promoCode: promoCode || undefined, total: finalTotal, paymentMethod,
      };
      if (paymentMethod === "gift") {
        if (!giftCardCode.trim()) { setError("Please enter your gift card code"); setLoading(false); return; }
        orderData.giftCard = giftCardCode.trim();
        const orderRes = await orderAPI.create(orderData);
        const orderId = orderRes.data?.order?.id || orderRes.data?.id;
        clearCart(); router.push("/order-confirmation?order=" + orderId); return;
      }
      if (paymentMethod === "bank") {
        const orderRes = await orderAPI.create({ ...orderData, status: "pending_payment" });
        const orderId = orderRes.data?.order?.id || orderRes.data?.id;
        clearCart(); router.push("/order-confirmation?order=" + orderId + "&method=bank"); return;
      }
      if (!stripe || !elements) return;
      const orderRes = await orderAPI.create(orderData);
      const orderId = orderRes.data?.order?.id || orderRes.data?.id;
      const intentRes = await paymentAPI.createIntent(orderId);
      const clientSecret = intentRes.data?.clientSecret;
      if (!clientSecret) throw new Error("Payment setup failed. Please try again.");
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement), billing_details: { name: form.firstName + " " + form.lastName, email: form.email, address: { line1: form.address, city: form.city, state: form.state, postal_code: form.zip, country: form.country } } },
      });
      if (stripeError) throw new Error(stripeError.message);
      if (paymentIntent.status === "succeeded") { clearCart(); router.push("/order-confirmation?order=" + orderId); }
    } catch (err) { setError(err.message || "Payment failed. Please try again."); }
    finally { setLoading(false); }
  };

  const inp = { width: "100%", border: "1px solid #e0d8cc", borderRadius: "6px", padding: "10px 12px", fontSize: "13px", outline: "none", boxSizing: "border-box", background: "#fff" };
  const lbl = { fontSize: "11px", color: "#8a7a6a", display: "block", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" };

  const summary = (
    <div style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: "12px", padding: "1.25rem", marginBottom: isMobile ? "1.5rem" : 0 }}>
      <h2 style={{ fontSize: "13px", fontWeight: "600", color: "#1c1208", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "1px" }}>Order Summary</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "1rem" }}>
        {items.map((item) => {
          const img = item.product.primary_image || item.product.images?.[0];
          return (
            <div key={item.key} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <div style={{ width: "48px", height: "60px", background: "#f5ede0", borderRadius: "4px", flexShrink: 0, overflow: "hidden" }}>
                {img ? <img src={img} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🛍</div>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "12px", color: "#1c1208", fontWeight: "500", lineHeight: "1.3", marginBottom: "2px" }}>{item.product.name}</p>
                <p style={{ fontSize: "10px", color: "#8a7a6a" }}>Qty: {item.quantity}</p>
              </div>
              <p style={{ fontSize: "13px", fontWeight: "600", color: "#1c1208", flexShrink: 0 }}>${(parseFloat(item.product.price) * item.quantity).toFixed(2)}</p>
            </div>
          );
        })}
      </div>
      <div style={{ borderTop: "1px solid #e0d8cc", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#8a7a6a" }}><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#8a7a6a" }}><span>Shipping</span><span style={{ color: shipping === 0 ? "#3b6d11" : "#1c1208" }}>{shipping === 0 ? "Free" : "$" + shipping.toFixed(2)}</span></div>
        {promoDiscount > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#3b6d11" }}><span>Discount</span><span>-${promoDiscount.toFixed(2)}</span></div>}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", fontWeight: "700", color: "#1c1208", borderTop: "1px solid #e0d8cc", paddingTop: "10px", marginTop: "4px" }}><span>Total</span><span>${finalTotal.toFixed(2)}</span></div>
      </div>
    </div>
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 320px", gap: isMobile ? "0" : "2rem", alignItems: "start" }}>
      <div>
        {isMobile && summary}
        <div style={{ display: "flex", marginBottom: "2rem" }}>
          {["Shipping", "Payment"].map((s, i) => (
            <div key={s} style={{ flex: 1, textAlign: "center", paddingBottom: "10px", borderBottom: "2px solid " + (step === i + 1 ? "#b8966a" : "#e0d8cc"), color: step === i + 1 ? "#b8966a" : "#8a7a6a", fontSize: "11px", fontWeight: step === i + 1 ? "600" : "400", letterSpacing: "1px", textTransform: "uppercase" }}>
              {i + 1}. {s}
            </div>
          ))}
        </div>
        {error && <div style={{ background: "#fff0f0", border: "1px solid #ffcccc", color: "#cc0000", padding: "10px 14px", borderRadius: "6px", fontSize: "13px", marginBottom: "1rem" }}>{error}</div>}

        {step === 1 && (
          <form onSubmit={handleShippingNext}>
            <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#1c1208", marginBottom: "1.25rem" }}>Shipping Details</h2>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              {[["firstName", "First name"], ["lastName", "Last name"]].map(([name, label]) => (
                <div key={name}><label style={lbl}>{label} <span style={{ color: "#cc0000" }}>*</span></label><input name={name} value={form[name]} onChange={handleField} required style={inp} /></div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <div><label style={lbl}>Email <span style={{ color: "#cc0000" }}>*</span></label><input name="email" value={form.email} onChange={handleField} type="email" required style={inp} /></div>
              <div><label style={lbl}>Phone <span style={{ color: "#a89880", textTransform: "none" }}>(optional)</span></label><input name="phone" value={form.phone} onChange={handleField} style={inp} /></div>
            </div>
            <div style={{ marginBottom: "12px" }}>
              <label style={lbl}>Country <span style={{ color: "#cc0000" }}>*</span></label>
              <select name="country" value={form.country} onChange={handleField} required style={{ ...inp, appearance: "none", WebkitAppearance: "none", backgroundImage: "url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%238a7a6a'/%3E%3C/svg%3E")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: "32px", cursor: "pointer" }}>
                <option value="">Select your country...</option>
                {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: "12px" }}>
              <label style={lbl}>Street address <span style={{ color: "#cc0000" }}>*</span></label>
              <input name="address" value={form.address} onChange={handleField} required style={inp} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr 1fr", gap: "12px", marginBottom: "1.5rem" }}>
              <div><label style={lbl}>City <span style={{ color: "#cc0000" }}>*</span></label><input name="city" value={form.city} onChange={handleField} required style={inp} /></div>
              <div><label style={lbl}>State / Region</label><input name="state" value={form.state} onChange={handleField} style={inp} /></div>
              <div><label style={lbl}>Postal / ZIP</label><input name="zip" value={form.zip} onChange={handleField} style={inp} /></div>
            </div>
            <button type="submit" style={{ width: "100%", background: "#1c1208", color: "#f5ede0", border: "none", padding: "14px", fontSize: "12px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer", borderRadius: "6px" }}>
              Continue to Payment
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handlePayment}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.25rem" }}>
              <button type="button" onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "#8a7a6a", fontSize: "12px", cursor: "pointer", padding: 0 }}>← Back</button>
              <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#1c1208", margin: 0 }}>Payment Method</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "1.5rem" }}>
              {PAYMENT_METHODS.map((method) => (
                <label key={method.id} style={{ display: "flex", alignItems: "center", gap: "12px", border: "2px solid " + (paymentMethod === method.id ? "#b8966a" : "#e0d8cc"), borderRadius: "8px", padding: "12px 14px", cursor: "pointer", background: paymentMethod === method.id ? "#fdf8f2" : "#fff", transition: "all 0.15s" }}>
                  <input type="radio" name="paymentMethod" value={method.id} checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} style={{ accentColor: "#b8966a", width: "16px", height: "16px", flexShrink: 0 }} />
                  <span style={{ fontSize: "20px" }}>{method.icon}</span>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: "600", color: "#1c1208", margin: 0 }}>{method.label}</p>
                    <p style={{ fontSize: "11px", color: "#8a7a6a", margin: 0 }}>{method.desc}</p>
                  </div>
                </label>
              ))}
            </div>
            {paymentMethod === "card" && (
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={lbl}>Card details <span style={{ color: "#cc0000" }}>*</span></label>
                <div style={{ border: "1px solid #e0d8cc", borderRadius: "6px", padding: "12px 14px", background: "#fff" }}><CardElement options={CARD_STYLE} /></div>
                <p style={{ fontSize: "10px", color: "#a89880", marginTop: "6px" }}>🔒 Secured by Stripe — your card details are never stored</p>
              </div>
            )}
            {paymentMethod === "bank" && (
              <div style={{ background: "#f5f9ff", border: "1px solid #c8d8f0", borderRadius: "8px", padding: "1rem", marginBottom: "1.25rem" }}>
                <p style={{ fontSize: "13px", fontWeight: "600", color: "#1c1208", marginBottom: "8px" }}>Bank Transfer Instructions</p>
                <p style={{ fontSize: "12px", color: "#4a6080", lineHeight: "1.6", margin: 0 }}>After placing your order, you will receive an email with our bank account details. Your order will be processed once payment is confirmed (1–3 business days).</p>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px", cursor: "pointer" }}>
                  <input type="checkbox" checked={bankConfirmed} onChange={(e) => setBankConfirmed(e.target.checked)} style={{ accentColor: "#b8966a", width: "14px", height: "14px" }} />
                  <span style={{ fontSize: "12px", color: "#1c1208" }}>I understand my order will ship after payment is received</span>
                </label>
              </div>
            )}
            {paymentMethod === "gift" && (
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={lbl}>Gift card code <span style={{ color: "#cc0000" }}>*</span></label>
                <input value={giftCardCode} onChange={(e) => setGiftCardCode(e.target.value)} placeholder="Enter your gift card code" style={inp} />
                {giftCardMsg && <p style={{ fontSize: "11px", marginTop: "6px", color: "#cc0000" }}>{giftCardMsg}</p>}
                <p style={{ fontSize: "11px", color: "#8a7a6a", marginTop: "6px" }}>Gift cards cover the full order total. Any remaining balance is non-refundable.</p>
              </div>
            )}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={lbl}>Promo code <span style={{ color: "#a89880", textTransform: "none" }}>(optional)</span></label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="e.g. LAUREA20" style={{ flex: 1, border: "1px solid #e0d8cc", borderRadius: "6px", padding: "10px 12px", fontSize: "13px", outline: "none", background: "#fff" }} />
                <button type="button" onClick={applyPromo} disabled={promoLoading} style={{ background: "#f5ede0", border: "1px solid #e0d8cc", borderRadius: "6px", padding: "10px 16px", fontSize: "11px", fontWeight: "600", cursor: "pointer", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                  {promoLoading ? "..." : "Apply"}
                </button>
              </div>
              {promoMsg && <p style={{ fontSize: "11px", marginTop: "6px", color: promoDiscount > 0 ? "#3b6d11" : "#cc0000" }}>{promoMsg}</p>}
            </div>
            <button type="submit" disabled={!stripe || loading || (paymentMethod === "bank" && !bankConfirmed)} style={{ width: "100%", background: loading ? "#8a7a6a" : "#b8966a", color: "#fff", border: "none", padding: "14px", fontSize: "12px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", cursor: (loading || (paymentMethod === "bank" && !bankConfirmed)) ? "not-allowed" : "pointer", borderRadius: "6px", opacity: (paymentMethod === "bank" && !bankConfirmed) ? 0.6 : 1 }}>
              {loading ? "Processing..." : paymentMethod === "bank" ? "Place Order — Pay by Bank Transfer" : paymentMethod === "gift" ? "Redeem & Place Order" : "Pay $" + finalTotal.toFixed(2)}
            </button>
          </form>
        )}
      </div>
      {!isMobile && <div style={{ position: "sticky", top: "80px" }}>{summary}</div>}
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
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
        <p style={{ fontSize: "48px" }}>🛒</p>
        <h2 style={{ fontSize: "20px", fontWeight: "300", color: "#1c1208" }}>Your bag is empty</h2>
        <Link href="/" style={{ background: "#1c1208", color: "#f5ede0", padding: "12px 28px", textDecoration: "none", fontSize: "12px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", borderRadius: "6px" }}>Continue shopping</Link>
      </div>
    );
  }
  return (
    <div style={{ minHeight: "100vh", background: "#faf8f5", padding: "1.5rem 1rem" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <nav style={{ fontSize: "11px", color: "#8a7a6a", marginBottom: "1.5rem", display: "flex", gap: "6px" }}>
          <Link href="/" style={{ color: "#8a7a6a", textDecoration: "none" }}>Home</Link>
          <span>›</span>
          <Link href="/cart" style={{ color: "#8a7a6a", textDecoration: "none" }}>Bag</Link>
          <span>›</span>
          <span style={{ color: "#1c1208" }}>Checkout</span>
        </nav>
        <h1 style={{ fontSize: "22px", fontWeight: "300", color: "#1c1208", marginBottom: "1.5rem" }}>Checkout</h1>
        <Elements stripe={stripePromise}>
          <CheckoutForm items={items} subtotal={subtotal} shipping={shipping} total={total} clearCart={clearCart} />
        </Elements>
      </div>
    </div>
  );
}
