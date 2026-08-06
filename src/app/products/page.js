'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function ProductsContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [addedIds, setAddedIds] = useState({});
  const searchParams = useSearchParams();
  const api = process.env.NEXT_PUBLIC_API_URL;

  const department = searchParams.get('department');
  const category = searchParams.get('category');

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (department) params.set('department', department);
    if (category) params.set('category', category);
    params.set('limit', '50');
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
      department: product.department
    });
    localStorage.setItem('laurea_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    setAddedIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAddedIds(prev => ({ ...prev, [product.id]: false })), 2000);
  };

  return (
    <div style={{minHeight:'100vh',background:'#faf8f5',overflowX:'hidden',width:'100%',boxSizing:'border-box'}}>
      <div style={{maxWidth:'1400px',margin:'0 auto',padding:isMobile?'0.75rem':'2rem',boxSizing:'border-box',width:'100%'}}>

        {/* Header */}
        <div style={{marginBottom:'1.25rem'}}>
          <p style={{fontSize:'12px',color:'#8a7a6a',textTransform:'capitalize'}}>
            {department || 'All'}{category ? ` › ${category}` : ''}
          </p>
          <h1 style={{fontSize:isMobile?'18px':'26px',fontWeight:'400',color:'#1c1208',marginTop:'4px',textTransform:'capitalize'}}>
            {category || department || 'All Products'}
          </h1>
          {!loading && <p style={{fontSize:'12px',color:'#8a7a6a',marginTop:'4px'}}>{products.length} products</p>}
        </div>

        {/* Products grid */}
        {loading ? (
          <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,minmax(0,1fr))':'repeat(4,1fr)',gap:isMobile?'8px':'1rem'}}>
            {[...Array(8)].map((_,i) => (
              <div key={i} style={{background:'#fff',borderRadius:'12px',overflow:'hidden',border:'1px solid #e0d8cc'}}>
                <div style={{paddingTop:'120%',background:'#f0ece8',position:'relative'}}>
                  <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,#f0ece8 25%,#e8e0d8 50%,#f0ece8 75%)',backgroundSize:'200% 100%',animation:'shimmer 1.5s infinite'}} />
                </div>
                <div style={{padding:'10px'}}>
                  <div style={{height:'12px',background:'#f0ece8',borderRadius:'4px',marginBottom:'6px'}} />
                  <div style={{height:'12px',background:'#f0ece8',borderRadius:'4px',width:'60%',marginBottom:'10px'}} />
                  <div style={{height:'32px',background:'#f0ece8',borderRadius:'6px'}} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{textAlign:'center',padding:'4rem 2rem'}}>
            <div style={{fontSize:'48px',marginBottom:'1rem'}}>🛍️</div>
            <h2 style={{fontSize:'18px',color:'#1c1208',marginBottom:'8px',fontWeight:'400'}}>No products yet</h2>
            <p style={{fontSize:'13px',color:'#8a7a6a'}}>Check back soon for new arrivals!</p>
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,minmax(0,1fr))':'repeat(4,1fr)',gap:isMobile?'8px':'1rem',width:'100%'}}>
            {products.map(product => (
              <Link key={product.id} href={`/products/${product.slug}`} style={{textDecoration:'none',display:'block',minWidth:0}}>
                <div style={{background:'#fff',borderRadius:'12px',overflow:'hidden',border:'1px solid #e0d8cc',display:'flex',flexDirection:'column',height:'100%',transition:'box-shadow 0.2s'}}
                  onMouseEnter={e=>e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)'}
                  onMouseLeave={e=>e.currentTarget.style.boxShadow='none'}>

                  {/* Image */}
                  <div style={{position:'relative',paddingTop:'120%',background:'linear-gradient(145deg,#f5ede0,#e8ddd0)',flexShrink:0}}>
                    {product.primary_image ? (
                      <img src={product.primary_image} alt={product.name}
                        style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top'}} />
                    ) : (
                      <div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'40px'}}>
                        {product.department==='women'?'👗':product.department==='men'?'👔':product.department==='kids'?'🧒':product.department==='bags'?'👜':'🛍️'}
                      </div>
                    )}
                    {product.badge && (
                      <span style={{position:'absolute',top:'8px',left:'8px',background:product.badge==='sale'?'#b8966a':'#1c1208',color:'#fff',fontSize:'9px',fontWeight:'600',padding:'3px 8px',textTransform:'uppercase',letterSpacing:'1px',borderRadius:'3px'}}>
                        {product.badge}
                      </span>
                    )}
                    {product.compare_price && (
                      <span style={{position:'absolute',top:'8px',right:'8px',background:'#cc0000',color:'#fff',fontSize:'9px',fontWeight:'600',padding:'3px 8px',borderRadius:'3px'}}>
                        -{Math.round((1-product.price/product.compare_price)*100)}%
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{padding:isMobile?'8px':'14px',display:'flex',flexDirection:'column',flex:1}}>

                    <p style={{fontSize:'9px',color:'#b8966a',textTransform:'uppercase',letterSpacing:'1.5px',marginBottom:'4px'}}>
                      {product.department}
                    </p>

                    <h3 style={{fontSize:isMobile?'11px':'12px',fontWeight:'400',color:'#1c1208',lineHeight:'1.5',marginBottom:'8px',flex:1,display:'-webkit-box',WebkitLineClamp:3,WebkitBoxOrient:'vertical',overflow:'hidden'}}>
                      {product.name}
                    </h3>

                    <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'8px',flexWrap:'wrap'}}>
                      <span style={{fontSize:isMobile?'13px':'16px',fontWeight:'600',color:'#1c1208'}}>
                        ${parseFloat(product.price).toFixed(2)}
                      </span>
                      {product.compare_price && (
                        <span style={{fontSize:'11px',color:'#8a7a6a',textDecoration:'line-through'}}>
                          ${parseFloat(product.compare_price).toFixed(2)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => addToBag(e, product)}
                      style={{width:'100%',background:addedIds[product.id]?'#b8966a':'#1c1208',color:addedIds[product.id]?'#1c1208':'#f5ede0',border:'none',padding:isMobile?'8px 4px':'11px',fontSize:isMobile?'9px':'11px',fontWeight:'600',letterSpacing:isMobile?'0.5px':'1.5px',textTransform:'uppercase',cursor:'pointer',borderRadius:'6px',transition:'all 0.2s',marginTop:'auto',whiteSpace:'nowrap',fontFamily:'inherit',boxSizing:'border-box'}}>
                      {addedIds[product.id] ? '✓ Added!' : 'Add to Bag'}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div style={{minHeight:'100vh',background:'#faf8f5',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <p style={{color:'#8a7a6a',fontSize:'13px'}}>Loading products...</p>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}