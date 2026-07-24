'use client';
import Link from 'next/link';
import useMobile from '../../hooks/useMobile';

const CATS = [
  { name:'Bedding', photo:'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80', styles:['Duvet sets','Pillows','Bed sheets'] },
  { name:'Candles', photo:'https://images.unsplash.com/photo-1470309864661-68328b2cd0a5?w=400&q=80', styles:['Scented candles','Pillar candles','Diffusers'] },
  { name:'Cushions', photo:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80', styles:['Throw cushions','Floor cushions','Outdoor cushions'] },
  { name:'Kitchen', photo:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80', styles:['Mugs','Plates','Cutlery','Cookware'] },
  { name:'Storage', photo:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', styles:['Baskets','Boxes','Organisers'] },
  { name:'Wall Art', photo:'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400&q=80', styles:['Prints','Frames','Mirrors','Wall hangings'] },
];

export default function HomeLivingPage() {
  const isMobile = useMobile();
  return (
    <div style={{minHeight:'100vh',background:'#faf8f5'}}>
      <div style={{position:'relative',height:isMobile?'200px':'300px',overflow:'hidden'}}>
        <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&q=80" alt="Home" style={{width:'100%',height:'100%',objectFit:'cover'}} />
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to right,rgba(28,18,8,0.75) 40%,rgba(28,18,8,0.2))'}} />
        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',padding:isMobile?'0 1.5rem':'0 3rem'}}>
          <div>
            <nav style={{fontSize:'11px',color:'rgba(245,237,224,0.5)',marginBottom:'8px'}}>
              <Link href="/" style={{color:'rgba(245,237,224,0.5)',textDecoration:'none'}}>Home</Link>
              <span style={{margin:'0 8px'}}>›</span>
              <span style={{color:'#b8966a'}}>Home & Living</span>
            </nav>
            <h1 style={{fontSize:isMobile?'24px':'36px',fontWeight:'300',color:'#f5ede0',marginBottom:'6px'}}>Home & Living</h1>
            <p style={{fontSize:'13px',color:'rgba(245,237,224,0.6)'}}>Bedding, candles, kitchen and more</p>
          </div>
        </div>
      </div>
      <div style={{maxWidth:'1200px',margin:'0 auto',padding:isMobile?'1.5rem 1rem':'3rem 2rem'}}>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(3,1fr)',gap:isMobile?'10px':'16px'}}>
          {CATS.map((cat) => (
            <Link key={cat.name} href={`/products?department=home&category=${cat.name.toLowerCase()}`} style={{textDecoration:'none',background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',overflow:'hidden',display:'block'}}>
              <div style={{height:isMobile?'140px':'220px',overflow:'hidden'}}>
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