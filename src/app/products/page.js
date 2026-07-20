'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function ProductsContent() {
  const searchParams = useSearchParams();
  const department = searchParams.get('department');
  const category = searchParams.get('category');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const params = new URLSearchParams();
    if (department) params.append('department', department);
    if (category) params.append('category', category);
    params.append('limit', '50');
    fetch(`${api}/products?${params.toString()}`)
      .then(r => r.json())
      .then(data => { setProducts(data.products || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [department, category]);

  const addToBag = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    const cart = JSON.parse(localStorage.getItem('laurea_cart') || '[]');
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.primary_image,
      department: product.department,
      slug: product.slug
    });
    localStorage.setItem('laurea_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    alert('Added to bag!');
  };

  const title = category || department || 'All Products';

  return (
    <div style={{minHeight:'100vh',background:'#faf8f5'}}>
      <div style={{background:'#1c1208',padding:'2rem 3rem'}}>
        <nav style={{fontSize:'11px',color:'rgba(245,237,224,0.5)',marginBottom:'8px'}}>
          <Link href="/" style={{color:'rgba(245,237,224,0.5)',textDecoration:'none'}}>Home</Link>
          <span style={{margin:'0 8px'}}>›</span>
          {department && (
            <>
              <Link href={`/${department}`} style={{color:'rgba(245,237,224,0.5)',textDecoration:'none',textTransform:'capitalize'}}>{department}</Link>
              <span style={{margin:'0 8px'}}>›</span>
            </>
          )}
          <span style={{color:'#b8966a',textTransform:'capitalize'}}>{title}</span>
        </nav>
        <h1 style={{fontSize:'28px',fontWeight:'300',color:'#f5ede0',textTransform:'capitalize'}}>{title}</h1>
        <p style={{fontSize:'13px',color:'rgba(245,237,224,0.5)',marginTop:'4px'}}>{loading ? 'Loading...' : `${products.length} products`}</p>
      </div>

      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'3rem 2rem'}}>
        {loading ? (
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px'}}>
            {Array.from({length:8}).map((_,i) => (
              <div key={i} style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',overflow:'hidden'}}>
                <div style={{height:'260px',background:'#f0ece8'}} />
                <div style={{padding:'12px'}}>
                  <div style={{height:'12px',background:'#f0ece8',borderRadius:'4px',marginBottom:'8px'}} />
                  <div style={{height:'10px',background:'#f0ece8',borderRadius:'4px',width:'60%'}} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{textAlign:'center',padding:'4rem 2rem'}}>
            <div style={{fontSize:'64px',marginBottom:'1rem'}}>🛍️</div>
            <h2 style={{fontSize:'20px',fontWeight:'300',color:'#1c1208',marginBottom:'8px'}}>No products yet</h2>
            <p style={{fontSize:'13px',color:'#8a7a6a',marginBottom:'2rem'}}>Products will appear here once added from the admin panel</p>
            <Link href="/" style={{background:'#1c1208',color:'#f5ede0',padding:'12px 24px',textDecoration:'none',fontSize:'12px',fontWeight:'600',letterSpacing:'1px',textTransform:'uppercase',borderRadius:'6px'}}>Continue shopping</Link>
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px'}}>
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`} style={{textDecoration:'none',background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',overflow:'hidden',cursor:'pointer',transition:'transform 0.2s',display:'block'}}
                onMouseEnter={e=>e.currentTarget.style.transform='translateY(-4px)'}
                onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
                <div style={{height:'260px',background:'linear-gradient(145deg,#f5ede0,#e8ddd0)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden'}}>
                  {product.primary_image ? (
                    <img src={product.primary_image} alt={product.name} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                  ) : (
                    <span style={{fontSize:'64px'}}>
                      {product.department==='women'?'👗':product.department==='men'?'👔':product.department==='kids'?'🧒':product.department==='bags'?'👜':product.department==='jewelry'?'💍':product.department==='shoes'?'👟':product.department==='beauty'?'💄':'🛍️'}
                    </span>
                  )}
                  {product.badge && (
                    <span style={{position:'absolute',top:'10px',left:'10px',background:product.badge==='sale'?'#b8966a':product.badge==='new'?'#1c1208':'#8c3a1a',color:'#fff',fontSize:'9px',fontWeight:'600',padding:'3px 8px',textTransform:'uppercase',letterSpacing:'1px',borderRadius:'2px'}}>
                      {product.badge}
                    </span>
                  )}
                  <div style={{position:'absolute',inset:0,background:'rgba(28,18,8,0)',transition:'background 0.2s'}}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(28,18,8,0.1)'}
                    onMouseLeave={e=>e.currentTarget.style.background='rgba(28,18,8,0)'}>
                  </div>
                </div>
                <div style={{padding:'14px'}}>
                  <p style={{fontSize:'9px',color:'#b8966a',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'4px'}}>{product.department}</p>
                  <p style={{fontSize:'13px',fontWeight:'500',color:'#1c1208',marginBottom:'8px',lineHeight:'1.4'}}>{product.name}</p>
                  <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'12px'}}>
                    <span style={{fontSize:'16px',fontWeight:'600',color:'#1c1208'}}>${parseFloat(product.price).toFixed(2)}</span>
                    {product.compare_price && <span style={{fontSize:'12px',color:'#8a7a6a',textDecoration:'line-through'}}>${parseFloat(product.compare_price).toFixed(2)}</span>}
                  </div>
                  <button onClick={(e)=>addToBag(e,product)} style={{width:'100%',background:'#1c1208',color:'#f5ede0',border:'none',padding:'10px',fontSize:'11px',fontWeight:'600',letterSpacing:'1px',textTransform:'uppercase',cursor:'pointer',borderRadius:'4px'}}>
                    Add to bag
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div style={{minHeight:'100vh',background:'#faf8f5',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:'48px',marginBottom:'1rem'}}>🛍️</div>
          <p style={{fontSize:'13px',color:'#8a7a6a'}}>Loading products...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}