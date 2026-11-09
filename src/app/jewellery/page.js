'use client';
import Link from 'next/link';
import useMobile from '../../hooks/useMobile';

const CATS = [
  { name:'Necklaces', slug:'necklaces', photo:'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80' },
  { name:'Bracelets', slug:'bracelets', photo:'https://images.unsplash.com/photo-1573408301185-9519f94816e4?w=400&q=80' },
  { name:'Rings', slug:'rings', photo:'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80' },
  { name:'Earrings', slug:'earrings', photo:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80' },
];

export default function JewelleryPage() {
  const isMobile = useMobile();
  return (
    <div style={{minHeight:'100vh',background:'#faf8f5'}}>
      <div style={{position:'relative',height:isMobile?'200px':'300px',overflow:'hidden'}}>
        <img src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1400&q=80" alt="Jewellery" style={{width:'100%',height:'100%',objectFit:'cover'}} />
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to right,rgba(28,18,8,0.75) 40%,rgba(28,18,8,0.2))'}} />
        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',padding:isMobile?'0 1.5rem':'0 3rem'}}>
          <div>
            <nav style={{fontSize:'11px',color:'rgba(245,237,224,0.5)',marginBottom:'8px'}}>
              <Link href="/" style={{color:'rgba(245,237,224,0.5)',textDecoration:'none'}}>Home</Link>
              <span style={{margin:'0 8px'}}>›</span>
              <span style={{color:'#b8966a'}}>Jewellery</span>
            </nav>
            <h1 style={{fontSize:isMobile?'24px':'36px',fontWeight:'300',color:'#f5ede0',marginBottom:'6px'}}>Jewellery</h1>
            <p style={{fontSize:'13px',color:'rgba(245,237,224,0.6)'}}>Necklaces, rings, earrings and more</p>
          </div>
        </div>
      </div>
      <div style={{maxWidth:'1200px',margin:'0 auto',padding:isMobile?'1.5rem 1rem':'3rem 2rem'}}>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(1,1fr)':'repeat(4,1fr)',gap:isMobile?'16px':'16px'}}>
          {CATS.map((cat) => (
            <Link key={cat.slug} href={`/jewellery/${cat.slug}`} style={{textDecoration:'none',background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',overflow:'hidden',display:'block'}}>
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
