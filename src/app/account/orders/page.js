'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, ChevronRight } from 'lucide-react';
import useAuthStore from '@/store/useAuthStore';

const STATUS_STYLES = {
  pending:    { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Pending' },
  confirmed:  { bg: 'bg-blue-50',   text: 'text-blue-700',   label: 'Confirmed' },
  processing: { bg: 'bg-blue-50',   text: 'text-blue-700',   label: 'Processing' },
  shipped:    { bg: 'bg-purple-50', text: 'text-purple-700', label: 'Shipped' },
  delivered:  { bg: 'bg-green-50',  text: 'text-green-700',  label: 'Delivered' },
  cancelled:  { bg: 'bg-red-50',    text: 'text-red-700',    label: 'Cancelled' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();
  const router = useRouter();
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!token) { router.push('/auth/login'); return; }
    fetch(`${api}/orders`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setOrders(data.orders || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const active = orders.filter(o => !['delivered','cancelled'].includes(o.status));
  const past = orders.filter(o => ['delivered','cancelled'].includes(o.status));

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-stone-400 text-sm">Loading orders...</p>
    </div>
  );

  const OrderCard = ({ order }) => {
    const s = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
    return (
      <div className="border border-stone-200 p-4 hover:border-stone-400 transition-colors">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-medium text-stone-900">Order #{order.id?.slice(-8).toUpperCase()}</span>
              <span className={`text-[10px] px-2 py-0.5 font-medium ${s.bg} ${s.text}`}>{s.label}</span>
            </div>
            <p className="text-xs text-stone-500 mb-1">{new Date(order.created_at).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</p>
            <p className="text-sm font-medium text-stone-900">${parseFloat(order.total_amount || 0).toFixed(2)}</p>
            {order.items_count && <p className="text-xs text-stone-400 mt-1">{order.items_count} item{order.items_count !== 1 ? 's' : ''}</p>}
          </div>
          <ChevronRight size={16} className="text-stone-400 mt-1 flex-shrink-0" />
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Package size={20} className="text-gold" />
        <h1 className="text-2xl font-serif font-light">My Orders</h1>
        <span className="text-sm text-stone-400">({orders.length} total)</span>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 border border-stone-200">
          <Package size={40} className="mx-auto text-stone-200 mb-4" />
          <p className="text-stone-500 mb-6">You haven't placed any orders yet</p>
          <Link href="/" className="btn-primary px-8 py-3 text-sm">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-8">
          {active.length > 0 && (
            <div>
              <h2 className="text-[10px] tracking-widest uppercase text-stone-500 mb-3">Active Orders</h2>
              <div className="space-y-3">
                {active.map(o => <OrderCard key={o.id} order={o} />)}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <h2 className="text-[10px] tracking-widest uppercase text-stone-500 mb-3">Past Orders</h2>
              <div className="space-y-3">
                {past.map(o => <OrderCard key={o.id} order={o} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
