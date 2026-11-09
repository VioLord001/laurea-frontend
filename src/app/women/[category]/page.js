'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import useCartStore from '@/store/useCartStore';

const CATEGORY_MAP = {
  'tops':'Tops','bottoms':'Bottoms','denim':'Denim','dresses':'Dresses',
  'outerwear':'Outerwear','sleepwear':'Sleepwear','activewear':'Activewear',
  'swimwear':'Swimwear','lingerie':'Lingerie','co-ords':'Co-ords',
  'knitwear':'Knitwear','shirts':'Shirts','jumpsuits':'Jumpsuits',
  'blazers':'Blazers','cardigans':'Cardigans',
};

export default function WomenCategoryPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem, openCart } = useCartStore();
  const api = process.env.NEXT_PUBLIC_API_URL;
  const categoryName = CATEGORY_MAP[category] || category;

  useEffect(() => {
    setLoading(true);
    fetch(`${api}/products?department=women&category=${encodeURIComponent(categoryName)}&limit=100`)
      .then(r => r.json())
      .then(data => { setProducts(data.products || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-[10px] tracking-widest uppercase text-stone-400 mb-6">
        <Link href="/" className="hover:text-stone-700">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/women" className="hover:text-stone-700">Women</Link>
        <span className="mx-2">›</span>
        <span className="text-stone-700">{categoryName}</span>
      </nav>
      <h1 className="text-2xl font-serif font-light mb-2">Women's {categoryName}</h1>
      <p className="text-sm text-stone-400 mb-8">{products.length} products</p>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_,i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-stone-100 aspect-[3/4] mb-3" />
              <div className="bg-stone-100 h-3 w-3/4 mb-2" />
              <div className="bg-stone-100 h-3 w-1/4" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 border border-stone-200">
          <p className="text-stone-400 mb-4">No products found</p>
          <Link href="/women" className="text-sm text-gold hover:underline">Back to Women</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(product => (
            <div key={product.id} className="group">
              <Link href={`/products/${product.slug}`}>
                <div className="relative aspect-[3/4] bg-stone-50 overflow-hidden mb-3">
                  {product.primary_image ? (
                    <img src={product.primary_image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-200 text-xs">No image</div>
                  )}
                  {product.badge && <span className="absolute top-2 left-2 bg-gold text-white text-[9px] px-2 py-0.5 tracking-widest uppercase">{product.badge}</span>}
                </div>
                <p className="text-xs text-stone-800 font-medium truncate mb-1">{product.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">${parseFloat(product.price).toFixed(2)}</span>
                  {product.compare_price && <span className="text-xs text-stone-400 line-through">${parseFloat(product.compare_price).toFixed(2)}</span>}
                </div>
              </Link>
              <button onClick={() => { addItem(product); openCart(); }} className="w-full mt-2 border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white transition-colors py-2 text-[10px] tracking-widest uppercase">
                Add to Bag
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
