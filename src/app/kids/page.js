'use client';
import Link from 'next/link';

const CATS = [
  { name:'Girls Tops', photo:'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&q=80', styles:['T-shirts','Blouses','Crop tops'] },
  { name:'Boys Tops', photo:'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&q=80', styles:['T-shirts','Polo shirts','Hoodies'] },
  { name:'Girls Dresses', photo:'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=400&q=80', styles:['Casual dresses','Party dresses','School dresses'] },
  { name:'Boys Bottoms', photo:'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=80', styles:['Jeans','Shorts','Joggers','Chinos'] },
  { name:'Outerwear', photo:'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=400&q=80', styles:['Puffer jackets','Raincoats','Coats'] },
  { name:'School Uniform', photo:'https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=400&q=80', styles:['Shirts','Trousers','Skirts','Blazers'] },
  { name:'Activewear', photo:'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&q=80', styles:['Tracksuits','Gym sets','Sports tops'] },
  { name:'Swimwear', photo:'https://images.unsplash.com/photo-1570976447640-ac859083963f?w=400&q=80', styles:['Swimsuits','Swim shorts','Rash guards'] },
  { name:'Sleepwear', photo:'https://images.unsplash.com/photo-1631947430066-48c30d57b943?w=400&q=80', styles:['Pyjama sets','Onesies','Nightgowns'] },
  { name:'Accessories', photo:'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=400&q=80', styles:['Hats','Bags','Socks','Belts'] },
];

export default function KidsPage() {
  return (
    <div style={{minHeight:'100vh',background:'#faf8f5'}}>
      <div style={{position:'relative',height:'300px',overflow:'hidden'}}>
        <img src="https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=1400&q=80" alt="Kids" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center'}} />
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to right,rgba(28,18,8,0.75) 40%,rgba(28,18,8,0.2))'}} />
        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',padding:'0 3rem'}}>
          <div>
            <nav style={{fontSize:'11px',color:'rgba(245,237,224,0.5)',marginBottom:'8px'}}>
              <Link href="/" style={{color:'rgba(245,237,224,0.5)',textDecoration:'none'}}>Home</Link>
              <span style={{margin:'0 8px'}}>›</span>
              <span style={{color:'#b8966a'}}>Kids</span>
            </nav>
            <h1 style={{fontSize:'36px',fontWeight:'300',color:'#f5ede0',marginBottom:'6px'}}>Kids' Fashion</h1>
            <p style={{fontSize:'13px',color:'rgba(245,237,224,0.6)'}}>Clothing for boys, girls and babies</p>
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