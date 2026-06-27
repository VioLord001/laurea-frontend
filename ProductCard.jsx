'use client';
import Link from 'next/link';

export default function ProductCard({ product }) {
  const discount = product.compare_price
    ? Math.round((1 - product.price / product.compare_price) * 100)
    : null;
  return (
    <Link href={`/products/${product.slug}`} style={{textDecoration:'none',color:'inherit'}}>
      <div style={{border:'1px solid #e0d8cc',borderRadius:'8px',overflow:'hidden',cursor:'pointer',transition:'transform 0.15s'}}>
        <div style={{height:'200px',background:'linear-gradient(145deg,#f5ede0,#e8ddd0)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'64px'}}>
          {product.department === 'women' ? '👗' : product.department === 'men' ? '👔' : product.department === 'kids' ? '🧒' : product.department === 'bags' ? '👜' : product.department === 'jewelry' ? '💍' : product.department === 'shoes' ? '👟' : '🛍'}
        </div>
        <div style={{padding:'12px'}}>
          <p style={{fontSize:'10px',color:'#8a7a6a',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'4px'}}>{product.department}</p>
          <p style={{fontSize:'13px',color:'#2a1e10',marginBottom:'8px',lineHeight:'1.3'}}>{product.name}</p>
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <span style={{fontSize:'14px',fontWeight:'600',color:'#2a1e10'}}>${parseFloat(product.price).toFixed(2)}</span>
            {product.compare_price && <span style={{fontSize:'11px',color:'#8a7a6a',textDecoration:'line-through'}}>${parseFloat(product.compare_price).toFixed(2)}</span>}
            {discount && <span style={{fontSize:'10px',color:'#b8966a',fontWeight:'600'}}>-{discount}%</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}