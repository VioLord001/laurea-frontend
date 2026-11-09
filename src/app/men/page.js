'use client';
import Link from 'next/link';
import useMobile from '../../hooks/useMobile';

const CATS = [
  { name:'T-Shirts', slug:'t-shirts', photo:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80' },
  { name:'Trousers', slug:'trousers', photo:'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80' },
  { name:'Denim', slug:'denim', photo:'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80' },
  { name:'Outerwear', slug:'outerwear', photo:'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80' },
  { name:'Suits', slug:'suits', photo:'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80' },
  { name:'Activewear', slug:'activewear', photo:'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80' },
  { name:'Swimwear', slug:'swimwear', photo:'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&q=80' },
  { name:'Sleepwear', slug:'sleepwear', photo:'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&q=80' },
  { name:'Knitwear', slug:'knitwear', photo:'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=400&q=80' },
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
        <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(1,1fr)':'repeat(5,1fr)',gap:isMobile?'10px':'16px'}}>
          {CATS.map((cat) => (
            <Link key={cat.slug} href={`/men/${cat.slug}`} style={{textDecoration:'none',background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',overflow:'hidden',display:'block'}}>
              <div style={{height:isMobile?'220px':'200px',overflow:'hidden'}}>
                <img src={cat.photo} alt={cat.name} style={{width:'100%',height:'100%',objectFit:'cover'}} />
              </div>
              <div style={{padding:isMobile?'8px':'12px'}}>
                <h2 style={{fontSize:isMobile?'11px':'12px',fontWeight:'600',letterSpacing:'1px',textTransform:'uppercase',color:'#1c1208'}}>{cat.name}</h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
