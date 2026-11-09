'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '@/components/products/ProductCard';

const CATEGORY_MAP = {
  'activewear': 'Activewear',
  'denim': 'Denim',
  'knitwear': 'Knitwear',
  'outerwear': 'Outerwear',
  'sleepwear': 'Sleepwear',
  'suits': 'Suits',
  'swimwear': 'Swimwear',
  't-shirts': 'T-Shirts',
  'trousers': 'Trousers',
};

export default function MenCategoryPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryName = CATEGORY_MAP[category] || category?.replace(/-/g, ' ');
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!category) return;
    setLoading(true);
    fetch(`${api}/products?department=men&category=${encodeURIComponent(categoryName)}&limit=100`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Men</p>
        <h1 className="text-3xl font-light tracking-wide">{categoryName}</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-[3/4] mb-3" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-lg">No products found in {categoryName}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
