'use client';
import Link from 'next/link';

const CATS = [
  { name:'Skincare', photo:'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80', styles:['Moisturisers','Serums','Cleansers','Sunscreen'] },
  { name:'Makeup', photo:'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80', styles:['Foundation','Lipstick','Eyeshadow','Mascara'] },
  { name:'Hair Care', photo:'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=400&q=80', styles:['Shampoo','Conditioner','Hair oils','Hair masks'] },
  { name:'Fragrance', photo:'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&q=80', styles:['Perfumes','Body sprays','Eau de toilette'] },
  { name:'Body Care', photo:'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80', styles:['Body lotions','Scrubs','Bath oils','Soaps'] },
  { name:'Nail Care', photo:'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80', styles:['Nail polish','Nail kits','Gel nails','Nail art'] },
];

export default function BeautyPage() {
  return (
    <div style={{minHeight:'100vh',background:'#faf8f5'}}>
      <div style={{position:'relative',height:'300px',overflow:'hidden'}}>
        <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1400&q=80" alt="Beauty" style={{width:'100%',height:'100%',objectFit:'cover'}} />
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to right,rgba(28,18,8,0.75) 40%,rgba(28,18,8,0.2))'}} />
        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',padding:'0 3rem'}}>
          <div>
            <nav style={{fontSize:'11px',color:'rgba(245,237,224,0.5)',marginBottom:'8px'}}>
              <Link href="/" style={{color:'rgba(245,237,224,0.5)',textDecoration:'none'}}>Home</Link>
              <span style={{margin:'0 8px'}}>›</span>
              <span style={{color:'#b8966a'}}>Beauty</span>
            </nav>
            <h1 style={{fontSize:'36px',fontWeight:'300',color:'#f5ede0',marginBottom:'6px'}}>Beauty</h1>
            <p style={{fontSize:'13px',color:'rgba(245,237,224,0.6)'}}>Skincare, makeup, fragrance and more</p>
          </div>
        </div>
      </div>
      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'3rem 2rem'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px'}}>
          {CATS.map((cat) => (
            <div key={cat.name} style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',overflow:'hidden',cursor:'pointer',transition:'transform 0.2s'}}
              onMouseEnter={e=>e.currentTarget.style.transform='translateY(-4px)'}
              onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
              <div style={{height:'220px',overflow:'hidden'}}>
                <img src={cat.photo} alt={cat.name} style={{width:'100%',height:'100%',objectFit:'cover'}} />
              </div>
              <div style={{padding:'12px'}}>
                <h2 style={{fontSize:'12px',fontWeight:'600',letterSpacing:'1px',textTransform:'uppercase',color:'#1c1208',marginBottom:'6px'}}>{cat.name}</h2>
                <div style={{display:'flex',flexWrap:'wrap',gap:'4px'}}>
                  {cat.styles.slice(0,2).map((s) => (
                    <span key={s} style={{fontSize:'9px',background:'#f5ede0',color:'#8a7a6a',padding:'2px 6px',borderRadius:'3px'}}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}