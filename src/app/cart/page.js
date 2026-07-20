'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('laurea_cart') || '[]');
    setCart(stored);
  }, []);

  const removeItem = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem('laurea_cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const total = cart.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
  const delivery = total >= 30 ? 0 : 4.99;

  return (
    <div style={{minHeight:'100vh',background:'#faf8f5',padding:'2rem'}}>
      <div style={{maxWidth:'900px',margin:'0 auto'}}>

        <nav style={{fontSize:'11px',color:'#8a7a6a',marginBottom:'1.5rem',display:'flex',gap:'6px'}}>
          <Link href="/" style={{color:'#8a7a6a',textDecoration:'none'}}>Home</Link>
          <span>›</span>
          <span style={{color:'#1c1208'}}>Your Bag</span>
        </nav>

        <h1 style={{fontSize:'28px',fontWeight:'300',color:'#1c1208',marginBottom:'6px'}}>Your Bag</h1>
        <p style={{fontSize:'13px',color:'#8a7a6a',marginBottom:'2rem'}}>{cart.length} {cart.length===1?'item':'items'}</p>

        {cart.length === 0 ? (
          <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'4rem',textAlign:'center'}}>
            <div style={{fontSize:'64px',marginBottom:'1rem'}}>🛒</div>
            <h2 style={{fontSize:'20px',fontWeight:'300',color:'#1c1208',marginBottom:'8px'}}>Your bag is empty</h2>
            <p style={{fontSize:'13px',color:'#8a7a6a',marginBottom:'2rem'}}>Add items to your bag to see them here</p>
            <Link href="/" style={{background:'#1c1208',color:'#f5ede0',padding:'12px 28px',textDecoration:'none',fontSize:'12px',fontWeight:'600',letterSpacing:'1px',textTransform:'uppercase',borderRadius:'6px'}}>
              Continue shopping
            </Link>
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:'1.5rem',alignItems:'start'}}>

            {/* Cart items */}
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {cart.map((item, index) => (
                <div key={index} style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'1rem',display:'flex',gap:'1rem',alignItems:'center'}}>
                  <div style={{width:'90px',height:'90px',background:'linear-gradient(145deg,#f5ede0,#e8ddd0)',borderRadius:'8px',flexShrink:0,overflow:'hidden'}}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                    ) : (
                      <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'32px'}}>
                        {item.department==='women'?'👗':item.department==='men'?'👔':item.department==='kids'?'🧒':item.department==='bags'?'👜':item.department==='jewelry'?'💍':item.department==='shoes'?'👟':'🛍️'}
                      </div>
                    )}
                  </div>
                  <div style={{flex:1}}>
                    <p style={{fontSize:'9px',color:'#b8966a',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'4px'}}>{item.department}</p>
                    <p style={{fontSize:'13px',fontWeight:'500',color:'#1c1208',marginBottom:'4px',lineHeight:'1.3'}}>{item.name}</p>
                    <div style={{display:'flex',gap:'12px'}}>
                      {item.size && <p style={{fontSize:'11px',color:'#8a7a6a'}}>Size: <strong>{item.size}</strong></p>}
                      {item.color && <p style={{fontSize:'11px',color:'#8a7a6a'}}>Color: <strong>{item.color}</strong></p>}
                    </div>
                  </div>
                  <div style={{textAlign:'right',flexShrink:0}}>
                    <p style={{fontSize:'18px',fontWeight:'600',color:'#1c1208',marginBottom:'8px'}}>${parseFloat(item.price).toFixed(2)}</p>
                    <button onClick={()=>removeItem(index)}
                      style={{background:'none',border:'1px solid #ffcccc',color:'#cc0000',fontSize:'11px',cursor:'pointer',padding:'4px 10px',borderRadius:'4px'}}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <Link href="/" style={{display:'inline-block',fontSize:'12px',color:'#8a7a6a',textDecoration:'none',marginTop:'4px'}}>
                ← Continue shopping
              </Link>
            </div>

            {/* Order summary */}
            <div style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'1.5rem',position:'sticky',top:'80px'}}>
              <h2 style={{fontSize:'15px',fontWeight:'600',color:'#1c1208',marginBottom:'1.25rem'}}>Order Summary</h2>

              <div style={{display:'flex',justifyContent:'space-between',fontSize:'13px',color:'#8a7a6a',marginBottom:'8px'}}>
                <span>Subtotal ({cart.length} {cart.length===1?'item':'items'})</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'13px',color:'#8a7a6a',marginBottom:'8px'}}>
                <span>Delivery</span>
                <span style={{color:delivery===0?'#3b6d11':'#1c1208'}}>{delivery===0?'Free':'$'+delivery.toFixed(2)}</span>
              </div>
              {delivery > 0 && (
                <p style={{fontSize:'11px',color:'#b8966a',marginBottom:'8px'}}>Add ${(30-total).toFixed(2)} more for free delivery</p>
              )}
              <div style={{borderTop:'1px solid #e0d8cc',marginTop:'12px',paddingTop:'12px',display:'flex',justifyContent:'space-between',fontSize:'16px',fontWeight:'600',color:'#1c1208',marginBottom:'1.5rem'}}>
                <span>Total</span>
                <span>${(total + delivery).toFixed(2)}</span>
              </div>

              <button style={{width:'100%',background:'#1c1208',color:'#f5ede0',border:'none',padding:'14px',fontSize:'12px',fontWeight:'600',letterSpacing:'1px',textTransform:'uppercase',cursor:'pointer',borderRadius:'6px',marginBottom:'10px'}}>
                Proceed to checkout
              </button>

              <div style={{display:'flex',flexDirection:'column',gap:'6px',marginTop:'1rem'}}>
                {[
                  {icon:'🔒',text:'Secure checkout'},
                  {icon:'↩️',text:'Free returns within 30 days'},
                  {icon:'📦',text:'Dispatched within 1-3 business days'},
                ].map((item,i) => (
                  <div key={i} style={{display:'flex',gap:'8px',alignItems:'center',fontSize:'11px',color:'#8a7a6a'}}>
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}