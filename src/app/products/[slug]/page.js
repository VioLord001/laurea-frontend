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
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (params.slug) {
      fetch(`${api}/products/${params.slug}`)
        .then(r => r.json())
        .then(data => { setProduct(data.product); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [params.slug]);

  const handleAddToBag = () => {
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

  const sizes = product.tags || [];
  const discount = product.compare_price ? Math.round((1 - product.price / product.compare_price) * 100) : null;
  const inp = {width:'100%',border:'1px solid #e0d8cc',padding:'10px 12px',fontSize:'13px',color:'#1c1208',outline:'none',borderRadius:'6px',background:'#faf8f5'};
  const lbl = {fontSize:'11px',fontWeight:'600',color:'#8a7a6a',textTransform:'uppercase',letterSpacing:'0.5px',display:'block',marginBottom:'6px'};

  return (
    <div style={{minHeight:'100vh',background:'#faf8f5'}}>
      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'2rem'}}>
        <nav style={{fontSize:'11px',color:'#8a7a6a',marginBottom:'1.5rem',display:'flex',gap:'6px',alignItems:'center',flexWrap:'wrap'}}>
          <Link href="/" style={{color:'#8a7a6a',textDecoration:'none'}}>Home</Link>
          <span>›</span>
          <Link href={`/${product.department}`} style={{color:'#8a7a6a',textDecoration:'none',textTransform:'capitalize'}}>{product.department}</Link>
          <span>›</span>
          <span style={{color:'#1c1208'}}>{product.name}</span>
        </nav>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'3rem',background:'#fff',borderRadius:'16px',overflow:'hidden',border:'1px solid #e0d8cc'}}>
          <div style={{background:'linear-gradient(145deg,#f5ede0,#e8ddd0)',minHeight:'500px',display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
            {product.primary_image ? (
              <img src={product.primary_image} alt={product.name} style={{width:'100%',height:'100%',objectFit:'cover',minHeight:'500px'}} />
            ) : (
              <span style={{fontSize:'96px'}}>
                {product.department==='women'?'👗':product.department==='men'?'👔':product.department==='kids'?'🧒':product.department==='bags'?'👜':product.department==='jewelry'?'💍':product.department==='shoes'?'👟':'🛍️'}
              </span>
            )}
            {product.badge && (
              <span style={{position:'absolute',top:'16px',left:'16px',background:product.badge==='sale'?'#b8966a':'#1c1208',color:'#fff',fontSize:'10px',fontWeight:'600',padding:'4px 10px',textTransform:'uppercase',letterSpacing:'1px',borderRadius:'3px'}}>
                {product.badge}
              </span>
            )}
          </div>
          <div style={{padding:'2rem'}}>
            <p style={{fontSize:'10px',color:'#b8966a',textTransform:'uppercase',letterSpacing:'2px',marginBottom:'8px'}}>{product.department} · {product.category_name}</p>
            <h1 style={{fontSize:'24px',fontWeight:'400',color:'#1c1208',marginBottom:'12px',lineHeight:'1.3'}}>{product.name}</h1>
            <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'20px'}}>
              <span style={{fontSize:'28px',fontWeight:'600',color:'#1c1208'}}>${parseFloat(product.price).toFixed(2)}</span>
              {product.compare_price && (
                <>
                  <span style={{fontSize:'16px',color:'#8a7a6a',textDecoration:'line-through'}}>${parseFloat(product.compare_price).toFixed(2)}</span>
                  <span style={{fontSize:'12px',color:'#b8966a',fontWeight:'600',background:'#f5ede0',padding:'3px 8px',borderRadius:'3px'}}>-{discount}% OFF</span>
                </>
              )}
            </div>
            {product.description && (
              <p style={{fontSize:'13px',color:'#8a7a6a',lineHeight:'1.8',marginBottom:'20px'}}>{product.description}</p>
            )}
            {sizes.length > 0 && (
              <div style={{marginBottom:'20px'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'8px'}}>
                  <label style={lbl}>Select Size</label>
                  <button type="button" onClick={()=>setShowMeasurements(!showMeasurements)}
                    style={{background:'none',border:'none',color:'#b8966a',fontSize:'12px',cursor:'pointer',textDecoration:'underline'}}>
                    {showMeasurements ? 'Hide measurements' : 'Enter measurements for best fit'}
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
            )}{showMeasurements && (
              <div style={{background:'#faf8f5',border:'1px solid #e0d8cc',borderRadius:'10px',padding:'1.25rem',marginBottom:'20px'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
                  <h3 style={{fontSize:'13px',fontWeight:'600',color:'#1c1208'}}>📏 Enter Your Measurements</h3>
                  <div style={{display:'flex',gap:'6px'}}>
                    {['cm','inches'].map(u => (
                      <button key={u} type="button" onClick={()=>setMeasurements({...measurements,unit:u})}
                        style={{padding:'4px 10px',fontSize:'11px',border:`1px solid ${measurements.unit===u?'#1c1208':'#e0d8cc'}`,background:measurements.unit===u?'#1c1208':'#fff',color:measurements.unit===u?'#f5ede0':'#8a7a6a',borderRadius:'4px',cursor:'pointer'}}>
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                  {[
                    {key:'bust',label:'Bust / Chest',placeholder:`e.g. 90 ${measurements.unit}`},
                    {key:'waist',label:'Waist',placeholder:`e.g. 70 ${measurements.unit}`},
                    {key:'hips',label:'Hips',placeholder:`e.g. 96 ${measurements.unit}`},
                    {key:'height',label:'Height',placeholder:`e.g. 165 ${measurements.unit}`},
                    {key:'weight',label:'Weight (optional)',placeholder:'e.g. 60 kg'},
                  ].map(field => (
                    <div key={field.key}>
                      <label style={{fontSize:'11px',fontWeight:'600',color:'#8a7a6a',textTransform:'uppercase',letterSpacing:'0.5px',display:'block',marginBottom:'4px'}}>{field.label}</label>
                      <input style={{...inp,marginBottom:'0'}} value={measurements[field.key]}
                        onChange={e=>setMeasurements({...measurements,[field.key]:e.target.value})}
                        placeholder={field.placeholder} />
                    </div>
                  ))}
                </div>
                <p style={{fontSize:'11px',color:'#8a7a6a',marginTop:'10px',lineHeight:'1.6'}}>
                  Your measurements help us recommend the best size. Based on standard sizing we recommend size: <strong style={{color:'#b8966a'}}>{selectedSize || 'please select a size above'}</strong>
                </p>
              </div>
            )}
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
            <button onClick={handleAddToBag}
              style={{width:'100%',background:added?'#b8966a':'#1c1208',color:added?'#1c1208':'#f5ede0',border:'none',padding:'16px',fontSize:'13px',fontWeight:'600',letterSpacing:'2px',textTransform:'uppercase',cursor:'pointer',borderRadius:'8px',marginBottom:'10px',transition:'all 0.2s'}}>
              {added ? '✓ Added to bag!' : 'Add to bag'}
            </button>
            <button style={{width:'100%',background:'transparent',color:'#1c1208',border:'1.5px solid #1c1208',padding:'14px',fontSize:'13px',fontWeight:'600',letterSpacing:'2px',textTransform:'uppercase',cursor:'pointer',borderRadius:'8px',marginBottom:'20px'}}>
              ♡ Add to wishlist
            </button>
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