'use client';
import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function UploadReceiptInner() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get('orderId') || '';
  const total = params.get('total') || '';
  const items = params.get('items') ? decodeURIComponent(params.get('items')) : '';
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!['image/jpeg','image/png','image/jpg','application/pdf'].includes(f.type)) {
      setError('Please upload a JPG, PNG, or PDF file'); return;
    }
    if (f.size > 10 * 1024 * 1024) { setError('File must be under 10MB'); return; }
    setError('');
    setFile(f);
    if (f.type !== 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(f);
    } else { setPreview(null); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError('Please select your receipt file'); return; }
    setUploading(true); setError('');
    try {
      const fd = new FormData();
      fd.append('receipt', file);
      fd.append('orderId', orderId);
      fd.append('total', total);
      fd.append('items', items);
      const res = await fetch('/api/third-party/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Upload failed');
      setDone(true);
    } catch (err) { setError('Upload failed. Please try again.'); }
    finally { setUploading(false); }
  };

  if (done) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '64px' }}>✅</div>
        <h1 style={{ fontSize: '24px', fontWeight: '300', color: '#1c1208' }}>Receipt Submitted!</h1>
        <p style={{ fontSize: '14px', color: '#8a7a6a', maxWidth: '360px', lineHeight: '1.7' }}>
          Your receipt has been received. Your order <strong style={{ color: '#1c1208' }}>{orderId}</strong> will be confirmed within <strong style={{ color: '#1c1208' }}>10 minutes</strong>.
        </p>
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '1rem 1.5rem', maxWidth: '340px' }}>
          <p style={{ fontSize: '12px', color: '#166534', margin: 0, lineHeight: '1.7' }}>
            💬 You can also check your WhatsApp for confirmation from our agent.
          </p>
        </div>
        <Link href="/" style={{ background: '#1c1208', color: '#f5ede0', padding: '12px 28px', textDecoration: 'none', fontSize: '12px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', borderRadius: '6px' }}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#faf8f5', padding: '1.5rem 1rem' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <nav style={{ fontSize: '11px', color: '#8a7a6a', marginBottom: '1.5rem', display: 'flex', gap: '6px' }}>
          <Link href="/" style={{ color: '#8a7a6a', textDecoration: 'none' }}>Home</Link>
          <span>›</span>
          <span style={{ color: '#1c1208' }}>Upload Receipt</span>
        </nav>
        <h1 style={{ fontSize: '22px', fontWeight: '300', color: '#1c1208', marginBottom: '0.5rem' }}>Upload Payment Receipt</h1>
        <p style={{ fontSize: '13px', color: '#8a7a6a', marginBottom: '1.5rem' }}>Upload the receipt sent to you by our WhatsApp agent to confirm your order.</p>

        <div style={{ background: '#fff', border: '1px solid #e0d8cc', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '11px', color: '#8a7a6a', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px' }}>Order Details</p>
          <p style={{ fontSize: '13px', fontWeight: '600', color: '#1c1208', margin: '0 0 4px' }}>Order #{orderId}</p>
          {items && <p style={{ fontSize: '12px', color: '#8a7a6a', margin: '0 0 4px' }}>{items}</p>}
          {total && <p style={{ fontSize: '14px', fontWeight: '700', color: '#1c1208', margin: 0 }}>Total: ${total}</p>}
        </div>

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', cursor: 'pointer' }}>
            <div style={{ border: '2px dashed #e0d8cc', borderRadius: '10px', padding: '2rem', textAlign: 'center', background: file ? '#f0fdf4' : '#fff', borderColor: file ? '#86efac' : '#e0d8cc', transition: 'all 0.2s' }}>
              {preview ? (
                <img src={preview} alt="Receipt preview" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '6px', objectFit: 'contain' }} />
              ) : (
                <>
                  <p style={{ fontSize: '36px', margin: '0 0 8px' }}>{file ? '📄' : '📸'}</p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#1c1208', margin: '0 0 4px' }}>{file ? file.name : 'Tap to upload receipt'}</p>
                  <p style={{ fontSize: '11px', color: '#8a7a6a', margin: 0 }}>JPG, PNG or PDF — max 10MB</p>
                </>
              )}
            </div>
            <input type="file" accept="image/jpeg,image/png,image/jpg,application/pdf" onChange={handleFile} style={{ display: 'none' }} />
          </label>

          {error && <p style={{ color: '#cc0000', fontSize: '12px', marginTop: '8px' }}>{error}</p>}

          <button type="submit" disabled={!file || uploading} style={{ width: '100%', marginTop: '1.25rem', background: !file || uploading ? '#8a7a6a' : '#25D366', color: '#fff', border: 'none', padding: '14px', fontSize: '12px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', cursor: !file || uploading ? 'not-allowed' : 'pointer', borderRadius: '6px' }}>
            {uploading ? 'Uploading...' : '✓ Submit Receipt'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function UploadReceiptPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', color: '#8a7a6a' }}>Loading...</div>}>
      <UploadReceiptInner />
    </Suspense>
  );
}
