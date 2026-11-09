'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart, Check } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToBag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.primary_image || product.images?.[0] || '/placeholder.jpg',
      quantity: 1,
    });
    setAdded(true);
    toast.success('Added to bag!');
    setTimeout(() => setAdded(false), 2000);
  };

  const price = parseFloat(product.price || 0);
  const comparePrice = parseFloat(product.compare_price || 0);
  const hasDiscount = comparePrice > price;

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative overflow-hidden bg-gray-100 aspect-[3/4]">
        {product.primary_image || product.images?.[0] ? (
          <img
            src={product.primary_image || product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1">
            SALE
          </div>
        )}
        <button
          onClick={handleAddToBag}
          className="absolute bottom-0 left-0 right-0 bg-black text-white py-3 text-sm tracking-widest uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2"
        >
          {added ? (
            <><Check size={16} /> Added</>
          ) : (
            <><ShoppingBag size={16} /> Add to Bag</>
          )}
        </button>
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-xs text-gray-500 uppercase tracking-wider">{product.brand || product.category_name}</p>
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">₦{price.toLocaleString()}</span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">₦{comparePrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
