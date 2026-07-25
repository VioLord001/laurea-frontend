'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

function ProductContent() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [measurements, setMeasurements] = useState({
    bust:'', waist:'', hips:'', height:'', weight:'', unit:'cm'
  });
  const [added, setAdded] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (params.slug) {
      fetch(`${api}/products/${params.slug}`)
        .then(r => r.json())
        .then(data => { setProduct(data.product); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [params.slug]);

  const handleAddToBag = () => {
    const cart = JSON.parse(localStorage.getItem('laurea_cart') || '[]');
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.primary_image,
      size: selectedSize,
      color: selectedColor,
      department: product.department
    });
    localStorage.setItem('laurea_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#faf8f5'}}>
      <p style={{color:'#8a7a6a',fontSize:'13px'}}>Loading product...</p>
    </div>
  );

  if (!product) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#faf8f5'}}>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:'48px',marginBottom:'1rem'}}>😔</div>
        <h2 style={{fontSize:'18px',color:'#1c1208',marginBottom:'8px'}}>Product not found</h2>
        <Link href="/" style={{color:'#b8966a',textDecoration:'none',fontSize:'13px'}}>Go back home</Link>
      </div>
    </div>
  );

  const allImages = product.images && product.images.length > 0
    ? product.images.map(img => img.url)
    : product.primary_image
    ? [product.primary_image]
    : [];

  const sizes = product.tags || [];
  const discount = product.compare_price ? Math.round((1 - product.price / product.compare_price) * 100) : null;
  const inp = {width:'100%',border:'1px solid #e0d8cc',padding:'10px 12px',fontSize:'13px',color:'#1c1208',outline:'none',borderRadius:'6px',background:'#faf8f5',boxSizing:'border-box'};
  const lbl = {fontSize:'11px',fontWeight:'600',color:'#8a7a6a',textTransform:'uppercase',letterSpacing:'0.5px',display:'block',marginBottom:'6px'};

  return (
    <div style={{minHeight:'100vh',background:'#faf8f5'}}>

      {/* Breadcrumb */}
      <div style={{maxWidth:'1200px',margin:'0 auto',padding:isMobile?'0.75rem 1rem':'1rem 2rem'}}>
        <nav style={{fontSize:'11px',color:'#8a7a6a',display:'flex',gap:'6px',alignItems:'center',flexWrap:'wrap'}}>
          <Link href="/" style={{color:'#8a7a6a',textDecoration:'none'}}>Home</Link>
          <span>›</span>
          <Link href={`/${product.department}`} style={{color:'#8a7a6a',textDecoration:'none',textTransform:'capitalize'}}>{product.department}</Link>
          <span>›</span>
          <span style={{color:'#1c1208'}}>{product.category_name || product.department}</span>
        </nav>
      </div>

      <div style={{maxWidth:'1200px',margin:'0 auto',padding:isMobile?'0':'0 2rem 2rem'}}>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:'0',background:'#fff',borderRadius:isMobile?'0':'16px',overflow:'hidden',border:isMobile?'none':'1px solid #e0d8cc'}}>

          {/* Photo Gallery */}
          <div style={{width:'100%'}}>

            {/* Main photo — full width */}
            <div style={{position:'relative',width:'100%',height:isMobile?'420px':'520px',background:'linear-gradient(145deg,#f5ede0,#e8ddd0)',overflow:'hidden'}}>
              {allImages.length > 0 ? (
                <img
                  src={allImages[activePhoto]}
                  alt={product.name}
                  style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top',display:'block'}}
                />
              ) : (
                <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'96px'}}>
                  {product.department==='women'?'👗':product.department==='men'?'👔':product.department==='kids'?'🧒':product.department==='bags'?'👜':product.department==='jewelry'?'💍':product.department==='shoes'?'👟':'🛍️'}
                </div>
              )}

              {/* Badge */}
              {product.badge && (
                <span style={{position:'absolute',top:'12px',left:'12px',background:product.badge==='sale'?'#b8966a':'#1c1208',color:'#fff',fontSize:'10px',fontWeight:'600',padding:'4px 10px',textTransform:'uppercase',letterSpacing:'1px',borderRadius:'3px',zIndex:2}}>
                  {product.badge}
                </span>
              )}

              {/* Navigation arrows — both inside photo */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={()=>setActivePhoto(p=>p>0?p-1:allImages.length-1)}
                    style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',background:'rgba(255,255,255,0.95)',border:'none',width:'36px',height:'36px',borderRadius:'50%',cursor:'pointer',fontSize:'20px',fontWeight:'bold',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 2px 8px rgba(0,0,0,0.2)',zIndex:2,color:'#1c1208'}}>
                    ‹
                  </button>
                  <button
                    onClick={()=>setActivePhoto(p=>p<allImages.length-1?p+1:0)}
                    style={{position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',background:'rgba(255,255,255,0.95)',border:'none',width:'36px',height:'36px',borderRadius:'50%',cursor:'pointer',fontSize:'20px',fontWeight:'bold',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 2px 8px rgba(0,0,0,0.2)',zIndex:2,color:'#1c1208'}}>
                    ›
                  </button>

                  {/* Dot indicators */}
                  <div style={{position:'absolute',bottom:'12px',left:'50%',transform:'translateX(-50%)',display:'flex',gap:'6px',zIndex:2}}>
                    {allImages.map((_,i) => (
                      <div key={i} onClick={()=>setActivePhoto(i)}
                        style={{width:'7px',height:'7px',borderRadius:'50%',background:activePhoto===i?'#b8966a':'rgba(255,255,255,0.7)',cursor:'pointer',transition:'background 0.15s',boxShadow:'0 1px 3px rgba(0,0,0,0.3)'}}>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div style={{display:'flex',gap:'8px',overflowX:'auto',padding:'10px 12px',background:'#fff',borderTop:'1px solid #f0ece8'}}>
                {allImages.map((img, index) => (
                  <div key={index} onClick={()=>setActivePhoto(index)}
                    style={{width:'64px',height:'64px',borderRadius:'6px',overflow:'hidden',cursor:'pointer',border:`2px solid ${activePhoto===index?'#b8966a':'#e0d8cc'}`,flexShrink:0,transition:'border 0.15s'}}>
                    <img src={img} alt={`Photo ${index+1}`} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div style={{padding:isMobile?'1.25rem':'2rem',borderTop:isMobile?'1px solid #e0d8cc':'none',borderLeft:isMobile?'none':'1px solid #e0d8cc'}}>

            <p style={{fontSize:'10px',color:'#b8966a',textTransform:'uppercase',letterSpacing:'2px',marginBottom:'8px'}}>{product.department} · {product.category_name}</p>
            <h1 style={{fontSize:isMobile?'17px':'22px',fontWeight:'400',color:'#1c1208',marginBottom:'14px',lineHeight:'1.4'}}>{product.name}</h1>

            {/* Price */}
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'20px',flexWrap:'wrap'}}>
              <span style={{fontSize:isMobile?'24px':'28px',fontWeight:'600',color:'#1c1208'}}>${parseFloat(product.price).toFixed(2)}</span>
              {product.compare_price && (
                <>
                  <span style={{fontSize:'15px',color:'#8a7a6a',textDecoration:'line-through'}}>${parseFloat(product.compare_price).toFixed(2)}</span>
                  <span style={{fontSize:'12px',color:'#b8966a',fontWeight:'600',background:'#f5ede0',padding:'3px 8px',borderRadius:'3px'}}>-{discount}% OFF</span>
                </>
              )}
            </div>

            {product.description && (
              <p style={{fontSize:'13px',color:'#8a7a6a',lineHeight:'1.8',marginBottom:'20px'}}>{product.description}</p>
            )}

            {/* Size selector */}
            {sizes.length > 0 && (
              <div style={{marginBottom:'20px'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'8px',flexWrap:'wrap',gap:'6px'}}>
                  <label style={lbl}>Select Size</label>
                  <button type="button" onClick={()=>setShowMeasurements(!showMeasurements)}
                    style={{background:'none',border:'none',color:'#b8966a',fontSize:'11px',cursor:'pointer',textDecoration:'underline'}}>
                    {showMeasurements ? 'Hide' : 'Enter measurements for best fit'}
                  </button>
                </div>
                <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                  {sizes.map(size => (
                    <button key={size} type="button" onClick={()=>setSelectedSize(size)}
                      style={{padding:'8px 14px',fontSize:'12px',fontWeight:'500',border:`1.5px solid ${selectedSize===size?'#1c1208':'#e0d8cc'}`,background:selectedSize===size?'#1c1208':'#fff',color:selectedSize===size?'#f5ede0':'#8a7a6a',borderRadius:'6px',cursor:'pointer',transition:'all 0.15s'}}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Measurements */}
            {showMeasurements && (
              <div style={{background:'#faf8f5',border:'1px solid #e0d8cc',borderRadius:'10px',padding:'1rem',marginBottom:'20px'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px',flexWrap:'wrap',gap:'8px'}}>
                  <h3 style={{fontSize:'13px',fontWeight:'600',color:'#1c1208'}}>📏 Your Measurements</h3>
                  <div style={{display:'flex',gap:'6px'}}>
                    {['cm','inches'].map(u => (
                      <button key={u} type="button" onClick={()=>setMeasurements({...measurements,unit:u})}
                        style={{padding:'4px 10px',fontSize:'11px',border:`1px solid ${measurements.unit===u?'#1c1208':'#e0d8cc'}`,background:measurements.unit===u?'#1c1208':'#fff',color:measurements.unit===u?'#f5ede0':'#8a7a6a',borderRadius:'4px',cursor:'pointer'}}>
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
                  {[
                    {key:'bust',label:'Bust / Chest',placeholder:`e.g. 90 ${measurements.unit}`},
                    {key:'waist',label:'Waist',placeholder:`e.g. 70 ${measurements.unit}`},
                    {key:'hips',label:'Hips',placeholder:`e.g. 96 ${measurements.unit}`},
                    {key:'height',label:'Height',placeholder:`e.g. 165 ${measurements.unit}`},
                    {key:'weight',label:'Weight (optional)',placeholder:'e.g. 60 kg'},
                  ].map(field => (
                    <div key={field.key}>
                      <label style={{fontSize:'10px',fontWeight:'600',color:'#8a7a6a',textTransform:'uppercase',letterSpacing:'0.5px',display:'block',marginBottom:'4px'}}>{field.label}</label>
                      <input style={{...inp,fontSize:'12px',padding:'8px 10px'}} value={measurements[field.key]}
                        onChange={e=>setMeasurements({...measurements,[field.key]:e.target.value})}
                        placeholder={field.placeholder} />
                    </div>
                  ))}
                </div>
                <p style={{fontSize:'11px',color:'#8a7a6a',marginTop:'10px',lineHeight:'1.6'}}>
                  Currently selected: <strong style={{color:'#b8966a'}}>{selectedSize || 'no size selected'}</strong>
                </p>
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div style={{marginBottom:'20px'}}>
                <label style={lbl}>Select Color</label>
                <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                  {product.colors.map(color => (
                    <button key={color} type="button" onClick={()=>setSelectedColor(color)}
                      style={{padding:'6px 12px',fontSize:'11px',border:`1.5px solid ${selectedColor===color?'#b8966a':'#e0d8cc'}`,background:selectedColor===color?'#b8966a':'#fff',color:selectedColor===color?'#1c1208':'#8a7a6a',borderRadius:'6px',cursor:'pointer'}}>
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Buttons */}
            <button onClick={handleAddToBag}
              style={{width:'100%',background:added?'#b8966a':'#1c1208',color:added?'#1c1208':'#f5ede0',border:'none',padding:'14px',fontSize:'13px',fontWeight:'600',letterSpacing:'2px',textTransform:'uppercase',cursor:'pointer',borderRadius:'8px',marginBottom:'10px',transition:'all 0.2s',boxSizing:'border-box'}}>
              {added ? '✓ Added to bag!' : 'Add to bag'}
            </button>

            <button style={{width:'100%',background:'transparent',color:'#1c1208',border:'1.5px solid #1c1208',padding:'12px',fontSize:'13px',fontWeight:'600',letterSpacing:'2px',textTransform:'uppercase',cursor:'pointer',borderRadius:'8px',marginBottom:'20px',boxSizing:'border-box'}}>
              ♡ Add to wishlist
            </button>

            {/* Delivery info */}
            <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
              {[
                {icon:'🚚',text:'Free delivery on orders over $30'},
                {icon:'↩️',text:'Free returns within 30 days'},
                {icon:'🔒',text:'Secure checkout — your data is safe'},
                {icon:'📦',text:'Dispatched within 1-3 business days'},
              ].map((item,i) => (
                <div key={i} style={{display:'flex',gap:'10px',alignItems:'center',fontSize:'12px',color:'#8a7a6a'}}>
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={
      <div style={{minHeight:'100vh',background:'#faf8f5',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <p style={{color:'#8a7a6a',fontSize:'13px'}}>Loading...</p>
      </div>
    }>
      <ProductContent />
    </Suspense>
  );
}