'use client';
import Link from 'next/link';

const CATS = [
  { name:'Tops', photo:'https://images.unsplash.com/photo-1562572159-4efd90898929?w=400&q=80', styles:['T-shirts','Crop tops','Blouses','Bodysuits','Tank tops'] },
  { name:'Bottoms', photo:'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&q=80', styles:['Trousers','Wide-leg','Mini skirts','Midi skirts','Leggings'] },
  { name:'Denim', photo:'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=80', styles:['Skinny jeans','Wide-leg jeans','Mom jeans','Denim jackets'] },
  { name:'Dresses', photo:'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80', styles:['Mini dresses','Midi dresses','Maxi dresses','Wrap dresses'] },
  { name:'Outerwear', photo:'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=400&q=80', styles:['Coats','Puffer jackets','Trench coats','Blazers'] },
  { name:'Sleepwear', photo:'https://images.unsplash.com/photo-1631947430066-48c30d57b943?w=400&q=80', styles:['Pyjama sets','Robes','Loungewear sets'] },
  { name:'Activewear', photo:'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&q=80', styles:['Sports bras','Leggings','Gym sets'] },
  { name:'Swimwear', photo:'https://images.unsplash.com/photo-1570976447640-ac859083963f?w=400&q=80', styles:['Bikinis','One-pieces','Coverups'] },
  { name:'Lingerie', photo:'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&q=80', styles:['Bra sets','Shapewear','Bodysuits'] },
  { name:'Co-ords', photo:'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80', styles:['Trouser sets','Skirt sets','Linen sets'] },
  { name:'Knitwear', photo:'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80', styles:['Jumpers','Cardigans','Knit dresses'] },
  { name:'Shirts', photo:'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80', styles:['Oversized shirts','Linen shirts','Satin shirts'] },
  { name:'Jumpsuits', photo:'https://images.unsplash.com/photo-1533399710673-63c31d504bd5?w=400&q=80', styles:['Playsuits','Casual jumpsuits','Party jumpsuits'] },
  { name:'Blazers', photo:'https://images.unsplash.com/photo-1548372290-8d01b6c8e78c?w=400&q=80', styles:['Power blazers','Oversized blazers'] },
  { name:'Cardigans', photo:'https://images.unsplash.com/photo-1608234808654-2a8875faa7fd?w=400&q=80', styles:['Long cardigans','Cropped cardigans'] },
];

export default function WomenPage() {
  return (
    <div style={{minHeight:'100vh',background:'#faf8f5'}}>
      <div style={{position:'relative',height:'300px',overflow:'hidden'}}>
        <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=80" alt="Women" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top'}} />
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to right,rgba(28,18,8,0.75) 40%,rgba(28,18,8,0.2))'}} />
        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',padding:'0 3rem'}}>
          <div>
            <nav style={{fontSize:'11px',color:'rgba(245,237,224,0.5)',marginBottom:'8px'}}>
              <Link href="/" style={{color:'rgba(245,237,224,0.5)',textDecoration:'none'}}>Home</Link>
              <span style={{margin:'0 8px'}}>›</span>
              <span style={{color:'#b8966a'}}>Women</span>
            </nav>
            <h1 style={{fontSize:'36px',fontWeight:'300',color:'#f5ede0',marginBottom:'6px'}}>Women's Fashion</h1>
            <p style={{fontSize:'13px',color:'rgba(245,237,224,0.6)'}}>Clothing, dresses, activewear and more</p>
          </div>
        </div>
      </div>
      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'3rem 2rem'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'16px'}}>
          {CATS.map((cat) => (
            <div key={cat.name} style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',overflow:'hidden',cursor:'pointer',transition:'transform 0.2s'}}
              onMouseEnter={e=>e.currentTarget.style.transform='translateY(-4px)'}
              onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
              <div style={{height:'160px',overflow:'hidden'}}>
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