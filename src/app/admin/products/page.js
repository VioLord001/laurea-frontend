'use client';
import { useState, useRef } from 'react';

const CATEGORIES = {
  women: ['Tops','Bottoms','Denim','Dresses','Outerwear','Sleepwear','Activewear','Swimwear','Lingerie','Co-ords','Knitwear','Shirts','Jumpsuits','Blazers','Cardigans'],
  men: ['T-Shirts','Shirts','Trousers','Denim','Outerwear','Suits','Activewear','Swimwear','Sleepwear','Knitwear'],
  kids: ['Girls Tops','Boys Tops','Girls Dresses','Boys Bottoms','Outerwear','School Uniform','Activewear','Swimwear','Sleepwear','Accessories'],
  bags: ['Handbags','Crossbody','Clutches','Backpacks','Tote Bags','Wallets','Travel Bags',"Men's Bags"],
  jewelry: ['Necklaces','Rings','Earrings','Bracelets','Anklets','Sets','Fine Jewellery'],
  shoes: ['Sneakers','Heels','Boots','Sandals','Flats',"Men's Shoes",'Kids Shoes','Sports Shoes'],
  beauty: ['Skincare','Makeup','Hair Care','Fragrance','Body Care','Nail Care'],
  home: ['Bedding','Candles','Cushions','Kitchen','Storage','Wall Art'],
};

const SIZES = {
  women: ['XXS','XS','S','M','L','XL','XXL','3XL','4XL','One Size'],
  men: ['XS','S','M','L','XL','XXL','3XL','4XL','One Size'],
  kids: ['0-3M','3-6M','6-12M','1-2Y','2-3Y','3-4Y','4-5Y','5-6Y','6-7Y','7-8Y','8-9Y','9-10Y','10-11Y','11-12Y','12-13Y','13-14Y'],
  bags: ['One Size'],
  jewelry: ['One Size','XS','S','M','L','XL'],
  shoes: ['UK 3','UK 4','UK 5','UK 6','UK 7','UK 8','UK 9','UK 10','UK 11','UK 12','EU 36','EU 37','EU 38','EU 39','EU 40','EU 41','EU 42','EU 43','EU 44','EU 45'],
  beauty: ['One Size','30ml','50ml','100ml','150ml','200ml'],
  home: ['One Size','Small','Medium','Large','XL'],
};

const COLORS = ['Black','White','Red','Blue','Green','Yellow','Pink','Purple','Orange','Brown','Grey','Beige','Navy','Cream','Gold','Silver','Multicolor'];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name:'', price:'', compare_price:'', department:'women',
    category:'Tops', description:'', badge:'', isFeatured:false,
    sizes:[], colors:[], stock:''
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [editProduct, setEditProduct] = useState(null);
  const fileRef = useRef();
  const api = process.env.NEXT_PUBLIC_API_URL;

  const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('laurea_token') : '';

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${api}/products?limit=100`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch { setProducts([]); }
  };

  useState(() => { fetchProducts(); }, []);

  const handleDepartmentChange = (dept) => {
    setForm(f => ({ ...f, department: dept, category: CATEGORIES[dept][0], sizes: [], colors: [] }));
  };

  const toggleSize = (size) => {
    setForm(f => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter(s => s !== size) : [...f.sizes, size]
    }));
  };

  const toggleColor = (color) => {
    setForm(f => ({
      ...f,
      colors: f.colors.includes(color) ? f.colors.filter(c => c !== color) : [...f.colors, color]
    }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      price: product.price,
      compare_price: product.compare_price || '',
      department: product.department,
      category: product.category_name || CATEGORIES[product.department]?.[0] || '',
      description: product.description || '',
      badge: product.badge || '',
      isFeatured: product.is_featured || false,
      sizes: product.sizes || [],
      colors: product.colors || [],
      stock: product.stock || ''
    });
    setPhotoPreview(product.primary_image || '');
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDownloadPhoto = async (product) => {
    if (!product.primary_image) { alert('This product has no photo yet.'); return; }
    try {
      const res = await fetch(product.primary_image);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${product.name.replace(/\s+/g, '-')}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { alert('Could not download photo.'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    const token = getToken();
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    try {
      let productId = editProduct?.id;
      const payload = { ...form, tags: form.sizes };
      if (editProduct) {
        await fetch(`${api}/products/${productId}`, { method: 'PUT', headers, body: JSON.stringify(payload) });
        setMessage('✅ Product updated successfully!');
      } else {
        const res = await fetch(`${api}/products`, { method: 'POST', headers, body: JSON.stringify(payload) });
        const data = await res.json();
        productId = data.product?.id;
        setMessage('✅ Product created successfully!');
      }
      if (photo && productId) {
        const formData = new FormData();
        formData.append('images', photo);
        await fetch(`${api}/products/${productId}/images`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData });
        setMessage('✅ Product saved with photo!');
      }
      setShowForm(false);
      setEditProduct(null);
      setForm({ name:'', price:'', compare_price:'', department:'women', category:'Tops', description:'', badge:'', isFeatured:false, sizes:[], colors:[], stock:'' });
      setPhoto(null);
      setPhotoPreview('');
      fetchProducts();
    } catch { setMessage('❌ Error saving product. Please try again.'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await fetch(`${api}/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` } });
    fetchProducts();
  };

  const inp = { width:'100%', border:'1px solid #e0d8cc', padding:'10px 12px', fontSize:'13px', color:'#1c1208', outline:'none', borderRadius:'4px', marginBottom:'12px', background:'#faf8f5' };
  const lbl = { fontSize:'11px', fontWeight:'600', color:'#8a7a6a', textTransform:'uppercase', letterSpacing:'0.5px', display:'block', marginBottom:'4px' };

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.5rem'}}>
        <div>
          <h1 style={{fontSize:'24px',fontWeight:'600',color:'#1c1208'}}>Products</h1>
          <p style={{fontSize:'13px',color:'#8a7a6a',marginTop:'2px'}}>{products.length} products total</p>
        </div>
        <button onClick={()=>{setShowForm(!showForm);setEditProduct(null);setForm({name:'',price:'',compare_price:'',department:'women',category:'Tops',description:'',badge:'',isFeatured:false,sizes:[],colors:[],stock:''});setPhotoPreview('');}}
          style={{background:'#1c1208',color:'#f5ede0',border:'none',padding:'10px 20px',fontSize:'12px',fontWeight:'600',letterSpacing:'1px',textTransform:'uppercase',cursor:'pointer',borderRadius:'6px'}}>
          {showForm ? '✕ Cancel' : '+ Add Product'}
        </button>
      </div>

      {message && (
        <div style={{background:message.includes('❌')?'#fff0f0':'#f0fff4',border:`1px solid ${message.includes('❌')?'#ffcccc':'#ccffcc'}`,padding:'12px 16px',borderRadius:'8px',marginBottom:'1rem',fontSize:'13px'}}>
          {message}
        </div>
      )}

      {showForm && (
        <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'1.5rem',marginBottom:'2rem'}}>
          <h2 style={{fontSize:'16px',fontWeight:'600',color:'#1c1208',marginBottom:'1.25rem'}}>{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem'}}>
              <div>
                <label style={lbl}>Product Name *</label>
                <input style={inp} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Floral Wrap Midi Dress" required />

                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                  <div>
                    <label style={lbl}>Price (USD) *</label>
                    <input style={inp} type="number" step="0.01" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="29.99" required />
                  </div>
                  <div>
                    <label style={lbl}>Compare Price</label>
                    <input style={inp} type="number" step="0.01" value={form.compare_price} onChange={e=>setForm({...form,compare_price:e.target.value})} placeholder="59.99" />
                  </div>
                </div>

                <label style={lbl}>Stock Quantity</label>
                <input style={inp} type="number" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} placeholder="e.g. 50" />

                <label style={lbl}>Department *</label>
                <select style={inp} value={form.department} onChange={e=>handleDepartmentChange(e.target.value)}>
                  {Object.keys(CATEGORIES).map(d => (
                    <option key={d} value={d}>{d.charAt(0).toUpperCase()+d.slice(1)}</option>
                  ))}
                </select>

                <label style={lbl}>Category *</label>
                <select style={inp} value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                  {(CATEGORIES[form.department] || []).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <label style={lbl}>Badge</label>
                <select style={inp} value={form.badge} onChange={e=>setForm({...form,badge:e.target.value})}>
                  <option value="">No badge</option>
                  <option value="new">New</option>
                  <option value="sale">Sale</option>
                  <option value="hot">Hot</option>
                  <option value="excl">Exclusive</option>
                </select>

                <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px',background:'#faf8f5',padding:'10px 12px',border:'1px solid #e0d8cc',borderRadius:'4px'}}>
                  <input type="checkbox" id="featured" checked={form.isFeatured} onChange={e=>setForm({...form,isFeatured:e.target.checked})} style={{width:'16px',height:'16px',cursor:'pointer'}} />
                  <label htmlFor="featured" style={{fontSize:'13px',color:'#1c1208',cursor:'pointer',fontWeight:'500'}}>⭐ Show on homepage as Featured Product</label>
                </div>

                <label style={lbl}>Description</label>
                <textarea style={{...inp,height:'80px',resize:'vertical'}} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Describe the product..." />
              </div>

              <div>
                <label style={lbl}>Product Photo</label>
                <div style={{border:'2px dashed #e0d8cc',borderRadius:'8px',padding:'1rem',textAlign:'center',cursor:'pointer',background:'#faf8f5',marginBottom:'12px'}} onClick={()=>fileRef.current.click()}>
                  {photoPreview ? (
                    <img src={photoPreview} alt="preview" style={{width:'100%',height:'180px',objectFit:'cover',borderRadius:'6px'}} />
                  ) : (
                    <div style={{padding:'1.5rem'}}>
                      <div style={{fontSize:'36px',marginBottom:'8px'}}>📷</div>
                      <div style={{fontSize:'13px',color:'#8a7a6a'}}>Click to upload product photo</div>
                      <div style={{fontSize:'11px',color:'#b8966a',marginTop:'4px'}}>JPG, PNG up to 5MB</div>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{display:'none'}} />
                {photoPreview && (
                  <button type="button" onClick={()=>{setPhoto(null);setPhotoPreview('');}}
                    style={{background:'none',border:'1px solid #e0d8cc',padding:'6px 12px',fontSize:'11px',cursor:'pointer',borderRadius:'4px',marginBottom:'12px'}}>
                    Remove photo
                  </button>
                )}

                <label style={lbl}>Available Sizes — click to select multiple</label>
                <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'12px',background:'#faf8f5',padding:'10px',borderRadius:'4px',border:'1px solid #e0d8cc'}}>
                  {(SIZES[form.department] || []).map(size => (
                    <button key={size} type="button" onClick={()=>toggleSize(size)}
                      style={{padding:'5px 10px',fontSize:'11px',fontWeight:'500',border:`1px solid ${form.sizes.includes(size)?'#1c1208':'#e0d8cc'}`,background:form.sizes.includes(size)?'#1c1208':'#fff',color:form.sizes.includes(size)?'#f5ede0':'#8a7a6a',borderRadius:'4px',cursor:'pointer',transition:'all 0.15s'}}>
                      {size}
                    </button>
                  ))}
                </div>

                <label style={lbl}>Available Colors — click to select multiple</label>
                <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'12px',background:'#faf8f5',padding:'10px',borderRadius:'4px',border:'1px solid #e0d8cc'}}>
                  {COLORS.map(color => (
                    <button key={color} type="button" onClick={()=>toggleColor(color)}
                      style={{padding:'5px 10px',fontSize:'11px',fontWeight:'500',border:`1px solid ${form.colors.includes(color)?'#b8966a':'#e0d8cc'}`,background:form.colors.includes(color)?'#b8966a':'#fff',color:form.colors.includes(color)?'#1c1208':'#8a7a6a',borderRadius:'4px',cursor:'pointer',transition:'all 0.15s'}}>
                      {color}
                    </button>
                  ))}
                </div>

                <div style={{background:'#faf8f5',border:'1px solid #e0d8cc',borderRadius:'8px',padding:'1rem'}}>
                  <div style={{fontSize:'11px',fontWeight:'600',color:'#8a7a6a',textTransform:'uppercase',marginBottom:'8px'}}>Summary</div>
                  <div style={{fontSize:'12px',color:'#1c1208',lineHeight:'1.9'}}>
                    <strong>Department:</strong> {form.department}<br/>
                    <strong>Category:</strong> {form.category}<br/>
                    <strong>Sizes:</strong> {form.sizes.length > 0 ? form.sizes.join(', ') : 'None selected'}<br/>
                    <strong>Colors:</strong> {form.colors.length > 0 ? form.colors.join(', ') : 'None selected'}<br/>
                    <strong>Featured:</strong> {form.isFeatured ? '⭐ Yes' : 'No'}
                  </div>
                </div>
              </div>
            </div>

            <div style={{display:'flex',gap:'10px',marginTop:'1.5rem'}}>
              <button type="submit" disabled={saving}
                style={{background:'#b8966a',color:'#1c1208',border:'none',padding:'12px 28px',fontSize:'12px',fontWeight:'600',letterSpacing:'1px',textTransform:'uppercase',cursor:'pointer',borderRadius:'6px',opacity:saving?0.7:1}}>
                {saving ? 'Saving...' : editProduct ? 'Update Product' : 'Save Product'}
              </button>
              <button type="button" onClick={()=>{setShowForm(false);setEditProduct(null);}}
                style={{background:'none',border:'1px solid #e0d8cc',padding:'12px 20px',fontSize:'12px',cursor:'pointer',borderRadius:'6px'}}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {products.length === 0 ? (
        <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'3rem',textAlign:'center'}}>
          <div style={{fontSize:'48px',marginBottom:'1rem'}}>📦</div>
          <h3 style={{fontSize:'16px',color:'#1c1208',marginBottom:'8px'}}>No products yet</h3>
          <p style={{fontSize:'13px',color:'#8a7a6a',marginBottom:'1.5rem'}}>Add your first product to get started</p>
          <button onClick={()=>setShowForm(true)}
            style={{background:'#1c1208',color:'#f5ede0',border:'none',padding:'10px 24px',fontSize:'12px',fontWeight:'600',cursor:'pointer',borderRadius:'6px',textTransform:'uppercase',letterSpacing:'1px'}}>
            Add First Product
          </button>
        </div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'1rem'}}>
          {products.map((product) => (
            <div key={product.id} style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',overflow:'hidden'}}>
              <div style={{height:'200px',background:'linear-gradient(145deg,#f5ede0,#e8ddd0)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
                {product.primary_image ? (
                  <img src={product.primary_image} alt={product.name} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                ) : (
                  <span style={{fontSize:'48px'}}>
                    {product.department==='women'?'👗':product.department==='men'?'👔':product.department==='kids'?'🧒':product.department==='bags'?'👜':product.department==='jewelry'?'💍':product.department==='shoes'?'👟':'🛍'}
                  </span>
                )}
                {product.badge && (
                  <span style={{position:'absolute',top:'8px',left:'8px',background:product.badge==='sale'?'#b8966a':product.badge==='new'?'#1c1208':'#8c3a1a',color:'#fff',fontSize:'9px',fontWeight:'600',padding:'3px 8px',textTransform:'uppercase',letterSpacing:'1px',borderRadius:'2px'}}>
                    {product.badge}
                  </span>
                )}
                {product.is_featured && (
                  <span style={{position:'absolute',top:'8px',right:'8px',background:'#f0c040',color:'#1c1208',fontSize:'9px',fontWeight:'600',padding:'3px 8px',borderRadius:'2px'}}>
                    ⭐ Featured
                  </span>
                )}
              </div>
              <div style={{padding:'1rem'}}>
                <div style={{display:'flex',gap:'6px',marginBottom:'6px',flexWrap:'wrap'}}>
                  <span style={{fontSize:'9px',background:'#f5ede0',color:'#b8966a',padding:'2px 8px',borderRadius:'3px',textTransform:'uppercase',letterSpacing:'0.5px'}}>{product.department}</span>
                  {product.category_name && <span style={{fontSize:'9px',background:'#f0ece8',color:'#8a7a6a',padding:'2px 8px',borderRadius:'3px'}}>{product.category_name}</span>}
                </div>
                <div style={{fontSize:'13px',fontWeight:'500',color:'#1c1208',marginBottom:'4px',lineHeight:'1.3'}}>{product.name}</div>
                {product.tags && product.tags.length > 0 && (
                  <div style={{display:'flex',flexWrap:'wrap',gap:'4px',marginBottom:'6px'}}>
                    {product.tags.slice(0,4).map(tag => (
                      <span key={tag} style={{fontSize:'9px',background:'#f5ede0',color:'#8a7a6a',padding:'2px 6px',borderRadius:'3px',border:'1px solid #e0d8cc'}}>{tag}</span>
                    ))}
                  </div>
                )}
                <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'12px'}}>
                  <span style={{fontSize:'16px',fontWeight:'600',color:'#1c1208'}}>${parseFloat(product.price).toFixed(2)}</span>
                  {product.compare_price && <span style={{fontSize:'12px',color:'#8a7a6a',textDecoration:'line-through'}}>${parseFloat(product.compare_price).toFixed(2)}</span>}
                </div>
                <div style={{display:'flex',gap:'6px'}}>
                  <button onClick={()=>handleEdit(product)} style={{flex:1,background:'#1c1208',color:'#f5ede0',border:'none',padding:'8px',fontSize:'11px',fontWeight:'600',cursor:'pointer',borderRadius:'4px',textTransform:'uppercase'}}>Edit</button>
                  <button onClick={()=>handleDownloadPhoto(product)} style={{flex:1,background:'#f5ede0',color:'#1c1208',border:'1px solid #e0d8cc',padding:'8px',fontSize:'11px',fontWeight:'600',cursor:'pointer',borderRadius:'4px',textTransform:'uppercase'}}>⬇ Photo</button>
                  <button onClick={()=>handleDelete(product.id)} style={{background:'#fff0f0',color:'#cc0000',border:'1px solid #ffcccc',padding:'8px 12px',fontSize:'11px',cursor:'pointer',borderRadius:'4px'}}>🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}