'use client';
import Link from 'next/link';

const CATS = [
  { name:'Sneakers', photo:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', styles:['White sneakers','Running shoes','Platform sneakers'] },
  { name:'Heels', photo:'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80', styles:['Stilettos','Block heels','Kitten heels','Wedges'] },
  { name:'Boots', photo:'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&q=80', styles:['Ankle boots','Knee-high boots','Chelsea boots'] },
  { name:'Sandals', photo:'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&q=80', styles:['Flat sandals','Heeled sandals','Slides','Flip flops'] },
  { name:'Flats', photo:'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&q=80', styles:['Ballet flats','Loafers','Mules','Espadrilles'] },
  { name:'Men\'s Shoes', photo:'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&q=80', styles:['Oxford shoes','Derby shoes','Loafers','Brogues'] },
  { name:'Kids Shoes', photo:'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400&q=80', styles:['School shoes','Sneakers','Sandals','Boots'] },
  { name:'Sports Shoes', photo:'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80', styles:['Running shoes','Training shoes','Football boots'] },
];

export default function ShoesPage() {
  return (
    <div style={{minHeight:'100vh',background:'#faf8f5'}}>
      <div style={{position:'relative',height:'300px',overflow:'hidden'}}>
        <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1400&q=80" alt="Shoes" style={{width:'100%',height:'100%',objectFit:'cover'}} />
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to right,rgba(28,18,8,0.75) 40%,rgba(28,18,8,0.2))'}} />
        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',padding:'0 3rem'}}>
          <div>
            <nav style={{fontSize:'11px',color:'rgba(245,237,224,0.5)',marginBottom:'8px'}}>
              <Link href="/" style={{color:'rgba(245,237,224,0.5)',textDecoration:'none'}}>Home</Link>
              <span style={{margin:'0 8px'}}>›</span>
              <span style={{color:'#b8966a'}}>Shoes</span>
            </nav>
            <h1 style={{fontSize:'36px',fontWeight:'300',color:'#f5ede0',marginBottom:'6px'}}>Shoes</h1>
            <p style={{fontSize:'13px',color:'rgba(245,237,224,0.6)'}}>Sneakers, heels, boots, sandals and more</p>
          </div>
        </div>
      </div>
      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'3rem 2rem'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px'}}>
          {CATS.map((cat) => (
            <div key={cat.name} style={{background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',overflow:'hidden',cursor:'pointer',transition:'transform 0.2s'}}
              onMouseEnter={e=>e.currentTarget.style.transform='translateY(-4px)'}
              onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
              <div style={{height:'200px',overflow:'hidden'}}>
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