'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import useAuthStore from '@/store/useAuthStore';
import useCartStore from '@/store/useCartStore';

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();
  const { addItem } = useCartStore();
  const router = useRouter();
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!token) { router.push('/auth/login'); return; }
    fetch(`${api}/wishlist`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setItems(data.items || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const removeItem = async (productId) => {
    await fetch(`${api}/wishlist/${productId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    setItems(prev => prev.filter(i => i.product_id !== productId));
  };

  const moveToCart = (item) => {
    addItem({ id: item.product_id, name: item.name, price: item.price, image: item.image_url });
    removeItem(item.product_id);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-stone-400 text-sm">Loading wishlist...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Heart size={20} className="text-gold" />
        <h1 className="text-2xl font-serif font-light">My Wishlist</h1>
        <span className="text-sm text-stone-400">({items.length} items)</span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 border border-stone-200">
          <Heart size={40} className="mx-auto text-stone-200 mb-4" />
          <p className="text-stone-500 mb-6">Your wishlist is empty</p>
          <Link href="/" className="btn-primary px-8 py-3 text-sm">Start Shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="border border-stone-200 group">
              <div className="relative aspect-[3/4] bg-stone-50 overflow-hidden">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-200">No image</div>
                )}
                <button onClick={() => removeItem(item.product_id)}
                  className="absolute top-2 right-2 bg-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="p-3">
                <Link href={`/products/${item.slug}`}>
                  <p className="text-xs text-stone-800 font-medium truncate hover:text-gold">{item.name}</p>
                </Link>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm font-medium">${parseFloat(item.price).toFixed(2)}</p>
                  {item.compare_price && (
                    <p className="text-xs text-stone-400 line-through">${parseFloat(item.compare_price).toFixed(2)}</p>
                  )}
                </div>
                <button onClick={() => moveToCart(item)}
                  className="w-full mt-2 flex items-center justify-center gap-1.5 border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white transition-colors py-2 text-[10px] tracking-widest uppercase">
                  <ShoppingBag size={12} /> Add to Bag
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
