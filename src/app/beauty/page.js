'use client';
import Link from 'next/link';
import useMobile from '../../hooks/useMobile';

const CATS = [
  { name:'Skincare', photo:'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80', styles:['Moisturisers','Serums','Cleansers'] },
  { name:'Makeup', photo:'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80', styles:['Foundation','Lipstick','Eyeshadow'] },
  { name:'Hair Care', photo:'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=400&q=80', styles:['Shampoo','Conditioner','Hair oils'] },
  { name:'Fragrance', photo:'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80', styles:['Perfumes','Body sprays','Eau de toilette'] },
  { name:'Body Care', photo:'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80', styles:['Body lotions','Scrubs','Bath oils'] },
  { name:'Nail Care', photo:'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80', styles:['Nail polish','Nail kits','Gel nails'] },
];

export default function BeautyPage() {
  const isMobile = useMobile();
  return (
    <div style={{minHeight:'100vh',background:'#faf8f5'}}>
      <div style={{position:'relative',height:isMobile?'200px':'300px',overflow:'hidden'}}>
        <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1400&q=80" alt="Beauty" style={{width:'100%',height:'100%',objectFit:'cover'}} />
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to right,rgba(28,18,8,0.75) 40%,rgba(28,18,8,0.2))'}} />
        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',padding:isMobile?'0 1.5rem':'0 3rem'}}>
          <div>
            <nav style={{fontSize:'11px',color:'rgba(245,237,224,0.5)',marginBottom:'8px'}}>
              <Link href="/" style={{color:'rgba(245,237,224,0.5)',textDecoration:'none'}}>Home</Link>
              <span style={{margin:'0 8px'}}>›</span>
              <span style={{color:'#b8966a'}}>Beauty</span>
            </nav>
            <h1 style={{fontSize:isMobile?'24px':'36px',fontWeight:'300',color:'#f5ede0',marginBottom:'6px'}}>Beauty</h1>
            <p style={{fontSize:'13px',color:'rgba(245,237,224,0.6)'}}>Skincare, makeup, fragrance and more</p>
          </div>
        </div>
      </div>
      <div style={{maxWidth:'1200px',margin:'0 auto',padding:isMobile?'1.5rem 1rem':'3rem 2rem'}}>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(3,1fr)',gap:isMobile?'10px':'16px'}}>
          {CATS.map((cat) => (
            <Link key={cat.name} href={`/products?department=beauty&category=${cat.name.toLowerCase()}`} style={{textDecoration:'none',background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',overflow:'hidden',display:'block'}}>
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