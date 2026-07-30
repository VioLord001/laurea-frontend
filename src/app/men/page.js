'use client';
import Link from 'next/link';
import useMobile from '../../hooks/useMobile';

const CATS = [
  { name:'T-Shirts', photo:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80', styles:['Plain tees','Graphic tees','Polo shirts'] },
  { name:'Trousers', photo:'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80', styles:['Chinos','Cargo pants','Formal trousers'] },
  { name:'Denim', photo:'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80', styles:['Skinny jeans','Straight jeans','Relaxed fit'] },
  { name:'Outerwear', photo:'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80', styles:['Puffer jackets','Coats','Windbreakers'] },
  { name:'Suits', photo:'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80', styles:['2-piece suits','3-piece suits','Blazers'] },
  { name:'Activewear', photo:'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80', styles:['Gym shorts','Training tops','Tracksuits'] },
  { name:'Swimwear', photo:'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&q=80', styles:['Swim shorts','Board shorts','Swim trunks'] },
  { name:'Sleepwear', photo:'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&q=80', styles:['Pyjama sets','Robes','Loungewear'] },
  { name:'Knitwear', photo:'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80', styles:['Jumpers','Cardigans','Turtlenecks'] },
];

export default function MenPage() {
  const isMobile = useMobile();
  return (
    <div style={{minHeight:'100vh',background:'#faf8f5'}}>
      <div style={{position:'relative',height:isMobile?'200px':'300px',overflow:'hidden'}}>
        <img src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=1400&q=80" alt="Men" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top'}} />
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to right,rgba(28,18,8,0.75) 40%,rgba(28,18,8,0.2))'}} />
        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',padding:isMobile?'0 1.5rem':'0 3rem'}}>
          <div>
            <nav style={{fontSize:'11px',color:'rgba(245,237,224,0.5)',marginBottom:'8px'}}>
              <Link href="/" style={{color:'rgba(245,237,224,0.5)',textDecoration:'none'}}>Home</Link>
              <span style={{margin:'0 8px'}}>›</span>
              <span style={{color:'#b8966a'}}>Men</span>
            </nav>
            <h1 style={{fontSize:isMobile?'24px':'36px',fontWeight:'300',color:'#f5ede0',marginBottom:'6px'}}>Men's Fashion</h1>
            <p style={{fontSize:'13px',color:'rgba(245,237,224,0.6)'}}>Shirts, suits, activewear and more</p>
          </div>
        </div>
      </div>
      <div style={{maxWidth:'1200px',margin:'0 auto',padding:isMobile?'1.5rem 1rem':'3rem 2rem'}}>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(5,1fr)',gap:isMobile?'10px':'16px'}}>
          {CATS.map((cat) => (
            <Link key={cat.name} href={`/products?department=men&category=${cat.name.toLowerCase()}`} style={{textDecoration:'none',background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',overflow:'hidden',display:'block'}}>
              <div style={{height:isMobile?'130px':'160px',overflow:'hidden'}}>
                <img src={cat.photo} alt={cat.name} style={{width:'100%',height:'100%',objectFit:'cover'}} />
              </div>
              <div style={{padding:isMobile?'8px':'12px'}}>
                <h2 style={{fontSize:isMobile?'11px':'12px',fontWeight:'600',letterSpacing:'1px',textTransform:'uppercase',color:'#1c1208',marginBottom:'4px'}}>{cat.name}</h2>
                <div style={{display:'flex',flexWrap:'wrap',gap:'4px'}}>
                  {cat.styles.slice(0,isMobile?1:2).map((s) => (
                    <span key={s} style={{fontSize:'9px',background:'#f5ede0',color:'#8a7a6a',padding:'2px 6px',borderRadius:'3px'}}>{s}</span>
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