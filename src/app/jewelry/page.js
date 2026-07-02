'use client';
import Link from 'next/link';

const CATS = [
  { name:'Necklaces', photo:'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80', styles:['Chains','Pendants','Chokers','Layered necklaces'] },
  { name:'Rings', photo:'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80', styles:['Statement rings','Stacking rings','Engagement rings'] },
  { name:'Earrings', photo:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80', styles:['Studs','Hoops','Drop earrings','Ear cuffs'] },
  { name:'Bracelets', photo:'https://images.unsplash.com/photo-1573408301185-9519f94f9b4f?w=400&q=80', styles:['Bangles','Charm bracelets','Tennis bracelets'] },
  { name:'Anklets', photo:'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&q=80', styles:['Chain anklets','Beaded anklets','Charm anklets'] },
  { name:'Sets', photo:'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=400&q=80', styles:['Necklace sets','Matching sets','Gift sets'] },
  { name:'Fine Jewellery', photo:'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80', styles:['Gold jewellery','Silver jewellery','Diamond pieces'] },
];

export default function JewelryPage() {
  return (
    <div style={{minHeight:'100vh',background:'#faf8f5'}}>
      <div style={{position:'relative',height:'300px',overflow:'hidden'}}>
        <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1400&q=80" alt="Jewellery" style={{width:'100%',height:'100%',objectFit:'cover'}} />
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to right,rgba(28,18,8,0.75) 40%,rgba(28,18,8,0.2))'}} />
        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',padding:'0 3rem'}}>
          <div>
            <nav style={{fontSize:'11px',color:'rgba(245,237,224,0.5)',marginBottom:'8px'}}>
              <Link href="/" style={{color:'rgba(245,237,224,0.5)',textDecoration:'none'}}>Home</Link>
              <span style={{margin:'0 8px'}}>›</span>
              <span style={{color:'#b8966a'}}>Jewellery</span>
            </nav>
            <h1 style={{fontSize:'36px',fontWeight:'300',color:'#f5ede0',marginBottom:'6px'}}>Jewellery</h1>
            <p style={{fontSize:'13px',color:'rgba(245,237,224,0.6)'}}>Necklaces, rings, earrings and more</p>
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