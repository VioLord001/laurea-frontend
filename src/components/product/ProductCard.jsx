'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag } from 'lucide-react';
import useCartStore from '@/store/useCartStore';
import { clsx } from 'clsx';

const badgeClasses = {
  sale: 'badge-sale', new: 'badge-new', hot: 'badge-hot', exclusive: 'badge-excl'
};

export default function ProductCard({ product }) {
  const [wished, setWished] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const discount = product.compare_price
    ? Math.round((1 - product.price / product.compare_price) * 100)
    : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative overflow-hidden bg-stone-50 aspect-[3/4]">
        {/* Product image */}
        {product.primary_image ? (
          <Image src={product.primary_image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:640px) 50vw, 25vw" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-stone-100 to-stone-200">
            {product.department === 'women' ? '👗' : product.department === 'men' ? '👔' : product.department === 'kids' ? '🧒' : product.department === 'bags' ? '👜' : product.department === 'jewelry' ? '💍' : product.department === 'shoes' ? '👟' : '🛍'}
          </div>
        )}

        {/* Badge */}
        {product.badge && (
          <span className={clsx('absolute top-2 left-2', badgeClasses[product.badge] || 'badge-new')}>
            {product.badge === 'excl' ? 'Exclusive' : product.badge.charAt(0).toUpperCase() + product.badge.slice(1)}
          </span>
        )}

        {/* Wishlist button */}
        <button onClick={(e) => { e.preventDefault(); setWished(!wished); }}
          className={clsx('absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 border border-stone-200 flex items-center justify-center transition-all hover:scale-110', wished && 'text-gold border-gold')}
          aria-label="Add to wishlist">
          <Heart size={14} fill={wished ? '#b8966a' : 'none'} />
        </button>

        {/* Quick add overlay */}
        <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button onClick={handleAddToCart}
            className={clsx('w-full py-3 text-[10px] font-medium tracking-widest uppercase flex items-center justify-center gap-2 transition-colors',
              addedToCart ? 'bg-gold text-dark' : 'bg-dark text-cream hover:bg-gold hover:text-dark')}>
            <ShoppingBag size={13} />
            {addedToCart ? 'Added!' : 'Add to bag'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="pt-3 pb-4">
        <p className="text-[9px] tracking-widest uppercase text-stone-400 mb-1">{product.category_name || product.department}</p>
        <h3 className="text-sm text-stone-800 line-clamp-2 leading-snug mb-2">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">${parseFloat(product.price).toFixed(2)}</span>
          {product.compare_price && (
            <>
              <span className="text-xs text-stone-400 line-through">${parseFloat(product.compare_price).toFixed(2)}</span>
              <span className="text-xs text-gold font-medium">-{discount}%</span>
            </>
          )}
        </div>
        {product.average_rating > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-gold">{'★'.repeat(Math.round(product.average_rating))}</span>
            <span className="text-[10px] text-stone-400">({product.review_count})</span>
          </div>
        )}
      </div>
    </Link>
  );
}
