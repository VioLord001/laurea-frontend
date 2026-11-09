'use client';
import Link from 'next/link';

const CATS = [
  { name:'Tops', photo:'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80', styles:['T-shirts','Crop tops','Blouses','Bodysuits'] },
  { name:'Bottoms', photo:'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80', styles:['Trousers','Wide-leg','Mini skirts','Leggings'] },
  { name:'Denim', photo:'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=80', styles:['Skinny jeans','Wide-leg jeans','Mom jeans'] },
  { name:'Dresses', photo:'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80', styles:['Mini dresses','Midi dresses','Wrap dresses'] },
  { name:'Outerwear', photo:'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&q=80', styles:['Coats','Puffer jackets','Trench coats'] },
  { name:'Sleepwear', photo:'https://images.unsplash.com/photo-1631947430066-48c30d57b943?w=400&q=80', styles:['Pyjama sets','Robes','Loungewear'] },
  { name:'Activewear', photo:'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=400&q=80', styles:['Sports bras','Leggings','Gym sets'] },
  { name:'Swimwear', photo:'https://images.unsplash.com/photo-1570976447640-ac859083963f?w=400&q=80', styles:['Bikinis','One-pieces','Coverups'] },
  { name:'Lingerie', photo:'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&q=80', styles:['Bra sets','Shapewear','Bodysuits'] },
  { name:'Co-ords', photo:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80', styles:['Trouser sets','Skirt sets','Linen sets'] },
  { name:'Knitwear', photo:'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80', styles:['Jumpers','Cardigans','Knit dresses'] },
  { name:'Shirts', photo:'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80', styles:['Oversized','Linen shirts','Satin shirts'] },
  { name:'Jumpsuits', photo:'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=400&q=80', styles:['Playsuits','Casual','Party jumpsuits'] },
  { name:'Blazers', photo:'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400&q=80', styles:['Power blazers','Oversized','Checked'] },
  { name:'Cardigans', photo:'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&q=80', styles:['Long cardigans','Cropped','Open-front'] },
];

export default function WomenPage() {
  return (
    <div style={{minHeight:'100vh',background:'#fff'}}>
      {/* Hero banner */}
      <div style={{position:'relative',height:'420px',overflow:'hidden'}}>
        <img src="https://images.unsplash.com/photo-1745962978987-010bc11e700c?w=1400&q=80" alt="Women's Fashion" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top'}} />
        <div style={{position:'absolute',inset:0,background:'rgba(13,27,42,0.5)'}} />
        <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:'2rem 2.5rem'}}>
          <nav style={{fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',color:'rgba(255,255,255,0.6)',marginBottom:'8px'}}>
            <Link href="/" style={{color:'rgba(255,255,255,0.6)',textDecoration:'none'}}>Home</Link>
            <span style={{margin:'0 8px'}}>›</span>
            <span style={{color:'#fff'}}>Women</span>
          </nav>
          <h1 style={{fontSize:'36px',fontWeight:'300',color:'#fff',fontFamily:'serif',marginBottom:'4px'}}>Women&apos;s Fashion</h1>
          <p style={{fontSize:'12px',color:'rgba(255,255,255,0.65)',letterSpacing:'1px'}}>Clothing, dresses, activewear &amp; more</p>
        </div>
      </div>

      {/* Categories grid */}
      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'2.5rem 1.5rem'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:'16px'}}>
          {CATS.map((cat) => (
            <Link key={cat.name} href={`/women/${cat.name.toLowerCase().replace(/ /g,'-')}`}
              style={{textDecoration:'none',position:'relative',borderRadius:'12px',overflow:'hidden',display:'block',height:'200px'}}>
              <img src={cat.photo} alt={cat.name} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top',transition:'transform 0.3s'}}
                />
              <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(13,27,42,0.75) 40%,transparent)'}} />
              <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'12px'}}>
                <p style={{fontSize:'11px',fontWeight:'600',letterSpacing:'2px',textTransform:'uppercase',color:'#fff',marginBottom:'4px'}}>{cat.name}</p>
                <div style={{display:'flex',flexWrap:'wrap',gap:'3px'}}>
                  {cat.styles.slice(0,2).map((s) => (
                    <span key={s} style={{fontSize:'8px',background:'rgba(255,255,255,0.2)',color:'rgba(255,255,255,0.85)',padding:'2px 6px',borderRadius:'2px'}}>{s}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
