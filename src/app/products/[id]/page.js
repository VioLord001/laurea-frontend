'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ShoppingBag, Check, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!id) return;
    fetch(`${api}/products/${id}`)
      .then((r) => r.json())
      .then((data) => { setProduct(data.product || data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAddToBag = () => {
    if (!product) return;
    addItem({ id: product.id, name: product.name, price: parseFloat(product.price), image: product.images?.[0] || product.primary_image || '/placeholder.jpg', quantity: 1 });
    setAdded(true);
    toast.success('Added to bag!');
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-gray-200 aspect-[3/4]" />
        <div className="space-y-4 pt-4">
          <div className="h-3 bg-gray-200 rounded w-1/4" />
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-12 bg-gray-200 rounded w-full mt-8" />
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-24 text-center">
      <p className="text-gray-400">Product not found.</p>
      <Link href="/" className="mt-4 inline-block text-sm underline">Back to home</Link>
    </div>
  );

  const price = parseFloat(product.price || 0);
  const comparePrice = parseFloat(product.compare_price || 0);
  const images = product.images || (product.primary_image ? [product.primary_image] : []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft size={16} /> Back
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-3">
          <div className="bg-gray-100 aspect-[3/4] overflow-hidden">
            {images[selectedImage] ? (
              <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`flex-shrink-0 w-20 h-24 overflow-hidden border-2 ${selectedImage === i ? 'border-black' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-6">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">{product.brand || product.category_name}</p>
            <h1 className="text-2xl font-light tracking-wide">{product.name}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl font-semibold">₦{price.toLocaleString()}</span>
            {comparePrice > price && <span className="text-lg text-gray-400 line-through">₦{comparePrice.toLocaleString()}</span>}
            {comparePrice > price && <span className="text-sm bg-black text-white px-2 py-0.5">SALE</span>}
          </div>
          {product.description && <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>}
          <button onClick={handleAddToBag} className="w-full bg-black text-white py-4 text-sm tracking-widest uppercase hover:bg-gray-900 transition-colors flex items-center justify-center gap-2">
            {added ? <><Check size={16} /> Added to Bag</> : <><ShoppingBag size={16} /> Add to Bag</>}
          </button>
          {product.stock_quantity !== undefined && (
            <p className="text-xs text-gray-400">{product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}</p>
          )}
        </div>
      </div>
    </div>
  );
}
