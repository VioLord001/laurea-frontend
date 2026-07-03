'use client';
import Link from 'next/link';

const CATS = [
  { name:'Handbags', photo:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80', styles:['Tote bags','Satchels','Shoulder bags'] },
  { name:'Crossbody', photo:'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80', styles:['Mini crossbody','Chain bags','Belt bags'] },
  { name:'Clutches', photo:'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&q=80', styles:['Evening clutches','Envelope clutches','Wristlets'] },
  { name:'Backpacks', photo:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80', styles:['Mini backpacks','Fashion backpacks','Travel backpacks'] },
  { name:'Tote Bags', photo:'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&q=80', styles:['Canvas totes','Leather totes','Printed totes'] },
  { name:'Wallets', photo:'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80', styles:['Card holders','Zip wallets','Purses'] },
  { name:'Travel Bags', photo:'https://images.unsplash.com/photo-1473188588951-666fce8e7c68?w=400&q=80', styles:['Weekender bags','Duffle bags','Travel sets'] },
  { name:"Men's Bags", photo:'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=400&q=80', styles:['Briefcases','Messenger bags','Laptop bags'] },
];

export default function BagsPage() {
  return (
    <div style={{minHeight:'100vh',background:'#faf8f5'}}>
      <div style={{position:'relative',height:'300px',overflow:'hidden'}}>
        <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1400&q=80" alt="Bags" style={{width:'100%',height:'100%',objectFit:'cover'}} />
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to right,rgba(28,18,8,0.75) 40%,rgba(28,18,8,0.2))'}} />
        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',padding:'0 3rem'}}>
          <div>
            <nav style={{fontSize:'11px',color:'rgba(245,237,224,0.5)',marginBottom:'8px'}}>
              <Link href="/" style={{color:'rgba(245,237,224,0.5)',textDecoration:'none'}}>Home</Link>
              <span style={{margin:'0 8px'}}>›</span>
              <span style={{color:'#b8966a'}}>Bags</span>
            </nav>
            <h1 style={{fontSize:'36px',fontWeight:'300',color:'#f5ede0',marginBottom:'6px'}}>Bags & Accessories</h1>
            <p style={{fontSize:'13px',color:'rgba(245,237,224,0.6)'}}>Handbags, clutches, backpacks and more</p>
          </div>
        </div>
      </div>
      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'3rem 2rem'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px'}}>
          {CATS.map((cat) => (
            <Link key={cat.name} href={`/products?department=bags&category=${cat.name.toLowerCase()}`} style={{textDecoration:'none',background:'#fff',border:'1px solid #e0d8cc',borderRadius:'12px',overflow:'hidden',cursor:'pointer',transition:'transform 0.2s',display:'block'}}
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
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}