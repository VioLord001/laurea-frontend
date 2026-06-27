'use client';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import useCartStore from '@/store/useCartStore';
import Link from 'next/link';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal, getTotal } = useCartStore();
  const subtotal = getSubtotal();
  const shipping = subtotal >= 30 ? 0 : 4.99;
  const total = getTotal();

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/40 z-40" onClick={closeCart} />}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 bottom-0 w-[360px] bg-white z-50 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-100">
          <h2 className="text-sm font-medium tracking-widest uppercase">
            Your bag {items.length > 0 && <span className="text-stone-400 font-normal">({items.length})</span>}
          </h2>
          <button onClick={closeCart} className="p-1 hover:text-gold transition-colors" aria-label="Close cart">
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-stone-400">
              <ShoppingBag size={48} strokeWidth={1} />
              <p className="text-xs tracking-widest uppercase">Your bag is empty</p>
              <button onClick={closeCart} className="btn-primary text-xs">Continue shopping</button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.key} className="flex gap-3 pb-4 border-b border-stone-100">
                  <div className="w-16 h-20 bg-stone-100 flex-shrink-0 flex items-center justify-center text-2xl rounded">
                    {item.product.department === 'women' ? '👗' : item.product.department === 'men' ? '👔' : '🛍'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-stone-800 line-clamp-2 leading-snug">{item.product.name}</p>
                    <p className="text-[10px] text-stone-400 mt-0.5">
                      {item.variant.size && `Size: ${item.variant.size}`}
                      {item.variant.color && ` · ${item.variant.color}`}
                    </p>
                    <p className="text-sm font-medium mt-1">${(parseFloat(item.product.price) * item.quantity).toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.key, item.quantity - 1)} className="w-6 h-6 border border-stone-200 flex items-center justify-center hover:border-stone-800 transition-colors" aria-label="Decrease"><Minus size={10} /></button>
                      <span className="text-xs w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.key, item.quantity + 1)} className="w-6 h-6 border border-stone-200 flex items-center justify-center hover:border-stone-800 transition-colors" aria-label="Increase"><Plus size={10} /></button>
                      <button onClick={() => removeItem(item.key)} className="ml-auto p-1 text-stone-400 hover:text-red-500 transition-colors" aria-label="Remove"><Trash2 size={13} /></button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-stone-100 p-5 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-stone-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-stone-500"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
              <div className="flex justify-between font-medium text-stone-900 pt-2 border-t border-stone-100"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
            <Link href="/checkout" onClick={closeCart} className="btn-gold w-full text-center block">
              Checkout securely
            </Link>
            <button onClick={closeCart} className="btn-outline w-full text-center block text-[10px]">
              Continue shopping
            </button>
            <div className="flex justify-center gap-4 pt-1">
              {['🔒 Secure', '🚚 Free ship $30+', '↩ Free returns'].map((perk) => (
                <span key={perk} className="text-[9px] text-stone-400">{perk}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
