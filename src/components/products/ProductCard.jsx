'use client';
import { useState } from 'react';
import Link from 'next/link';
import useCartStore from '@/store/useCartStore';

export default function ProductCard({ product }) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToBag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const price = parseFloat(product.price || 0);
  const comparePrice = parseFloat(product.compare_price || 0);
  const hasDiscount = comparePrice > price;
  const image = product.primary_image || product.images?.[0];
  const isNew = product.is_new || product.tag === 'new';

  return (
    <Link href={`/products/${product.id}`} className="group block border border-gray-100 rounded overflow-hidden bg-white">
      <div className="relative overflow-hidden bg-gray-100 aspect-[3/4]">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">SALE</div>
        )}
        {isNew && !hasDiscount && (
          <div className="absolute top-2 left-2 bg-black text-white text-xs font-bold px-2 py-1 rounded">NEW</div>
        )}
      </div>
      <div className="p-3 space-y-1">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{product.category_name || product.brand}</p>
        <h3 className="text-sm text-gray-900 line-clamp-2 leading-snug">{product.name}</h3>
        <div className="flex items-center gap-2 pt-1">
          <span className="text-sm font-semibold">${price.toFixed(2)}</span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">${comparePrice.toFixed(2)}</span>
          )}
        </div>
        <button
          onClick={handleAddToBag}
          className="mt-2 w-full bg-black text-white py-2.5 text-xs tracking-widest uppercase font-medium hover:bg-gray-800 transition-colors"
        >
          {added ? '✓ ADDED' : 'ADD TO BAG'}
        </button>
      </div>
    </Link>
  );
}
