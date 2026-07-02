'use client';
import Link from 'next/link';

const DEPARTMENTS = [
  { name:'Women', href:'/women', photo:'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80', sub:'15 categories' },
  { name:'Men', href:'/men', photo:'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400&q=80', sub:'15 categories' },
  { name:'Kids', href:'/kids', photo:'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&q=80', sub:'14 categories' },
  { name:'Bags', href:'/bags', photo:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80', sub:'8 types' },
  { name:'Jewellery', href:'/jewelry', photo:'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80', sub:'7 types' },
  { name:'Shoes', href:'/shoes', photo:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', sub:'8 types' },
  { name:'Beauty', href:'/beauty', photo:'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80', sub:'6 types' },
  { name:'Home', href:'/home', photo:'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80', sub:'6 types' },
];

const FLASH = [
  { photo:'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200&q=80', n:'Wrap dress', p:'$8.99', o:'$24.99' },
  { photo:'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&q=80', n:'Ring set', p:'$6.99', o:'$19.99' },
  { photo:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&q=80', n:'Crossbody bag', p:'$14.99', o:'$44.99' },
  { photo:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80', n:'White sneakers', p:'$12.99', o:'$39.99' },
  { photo:'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&q=80', n:'Lip set', p:'$8.99', o:'$22.99' },
  { photo:'https://images.unsplash.com/photo-1470309864661-68328b2cd0a5?w=200&q=80', n:'Oud candle', p:'$7.99', o:'$22.99' },
];

const ARRIVALS = [
  { href:'/women', photo:'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80', label:'Women', pos:'center top' },
  { href:'/men', photo:'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&q=80', label:'Men', pos:'center top' },
  { href:'/kids', photo:'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=600&q=80', label:'Kids', pos:'center top' },
];

const SOCIAL = [
  {n:'Instagram',i:'📸',h:'@laureafashion'},
  {n:'TikTok',i:'🎵',h:'@laureafashion'},
  {n:'Facebook',i:'📘',h:'Laurea Fashion'},
  {n:'Twitter',i:'🐦',h:'@laureafashion'},
  {n:'YouTube',i:'▶️',h:'Laurea Fashion'},
];

export default function HomePage() {
  return (
    <div style={{minHeight:'100vh'}}>

      {/* Hero */}
      <section style={{position:'relative',height:'90vh',minHeight:'500px',overflow:'hidden'}}>
        <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=80" alt="hero" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top'}} />
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to right,rgba(28,18,8,0.85) 40%,rgba(28,18,8,0.2))'}} />
        <div style={{position:'relative',zIndex:1,height:'100%',display:'flex',alignItems:'center',padding:'0 3rem'}}>
          <div style={{maxWidth:'520px'}}>
            <p style={{fontSize:'9px',letterSpacing:'5px',color:'#b8966a',textTransform:'uppercase',marginBottom:'12px'}}>2026 Collection</p>
            <h1 style={{fontSize:'48px',fontWeight:'300',color:'#f5ede0',lineHeight:'1.15',marginBottom:'12px'}}>
              Dress with<br /><em style={{color:'#b8966a'}}>intention.</em>
            </h1>
            <p style={{fontSize:'13px',color:'rgba(245,237,224,0.6)',marginBottom:'2rem',letterSpacing:'1px'}}>Women · Men · Kids · Bags · Jewellery & More</p>
            <div style={{display:'flex',gap:'12px'}}>
              <Link href="/women" style={{background:'#b8966a',color:'#1c1208',padding:'14px 28px',fontSize:'11px',fontWeight:'600',letterSpacing:'2px',textTransform:'uppercase',textDecoration:'none'}}>Shop women</Link>
              <Link href="/men" style={{background:'transparent',color:'#f5ede0',border:'1px solid rgba(245,237,224,0.4)',padding:'14px 28px',fontSize:'11px',letterSpacing:'2px',textTransform:'uppercase',textDecoration:'none'}}>Shop men</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section style={{padding:'3rem 2rem',background:'#faf8f5'}}>
        <p style={{fontSize:'11px',fontWeight:'600',letterSpacing:'3px',textTransform:'uppercase',color:'#2a1e10',marginBottom:'1.5rem',textAlign:'center'}}>Shop by department</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px',maxWidth:'1200px',margin:'0 auto'}}>
          {DEPARTMENTS.map((d) => (
            <Link key={d.name} href={d.href} style={{textDecoration:'none',position:'relative',borderRadius:'12px',overflow:'hidden',display:'block',height:'260px'}}>
              <img src={d.photo} alt={d.name} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top',transition:'transform 0.5s'}}
                onMouseEnter={e=>e.target.style.transform='scale(1.05)'}
                onMouseLeave={e=>e.target.style.transform='scale(1)'} />
              <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(28,18,8,0.85) 0%,rgba(28,18,8,0.1) 60%)'}} />
              <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'1rem'}}>
                <p style={{color:'#f5ede0',fontSize:'13px',fontWeight:'600',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'2px'}}>{d.name}</p>
                <p style={{color:'rgba(245,237,224,0.6)',fontSize:'10px'}}>{d.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Flash sale */}
      <section style={{background:'#1c1208',padding:'2.5rem 2rem'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'1.5rem'}}>
            <span style={{color:'#b8966a',fontSize:'18px'}}>⚡</span>
            <span style={{color:'#f5ede0',fontSize:'11px',letterSpacing:'4px',textTransform:'uppercase',fontWeight:'600'}}>Flash sale</span>
          </div>
          <div style={{display:'flex',gap:'12px',overflowX:'auto',paddingBottom:'8px'}}>
            {FLASH.map((item,i) => (
              <div key={i} style={{flexShrink:0,width:'140px',background:'rgba(245,237,224,0.05)',border:'1px solid rgba(245,237,224,0.1)',borderRadius:'10px',overflow:'hidden',cursor:'pointer'}}>
                <div style={{height:'140px',overflow:'hidden'}}>
                  <img src={item.photo} alt={item.n} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                </div>
                <div style={{padding:'10px'}}>
                  <p style={{fontSize:'11px',color:'rgba(245,237,224,0.75)',marginBottom:'4px'}}>{item.n}</p>
                  <p style={{fontSize:'13px',fontWeight:'600',color:'#b8966a'}}>{item.p}</p>
                  <p style={{fontSize:'10px',color:'rgba(245,237,224,0.35)',textDecoration:'line-through'}}>{item.o}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section style={{padding:'3rem 2rem',background:'#fff'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <p style={{fontSize:'11px',fontWeight:'600',letterSpacing:'3px',textTransform:'uppercase',color:'#2a1e10',marginBottom:'1.5rem',textAlign:'center'}}>New arrivals</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px'}}>
            {ARRIVALS.map((a) => (
              <Link key={a.label} href={a.href} style={{textDecoration:'none',position:'relative',borderRadius:'12px',overflow:'hidden',display:'block',height:'300px'}}>
                <img src={a.photo} alt={a.label} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:a.pos}} />
                <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(28,18,8,0.8) 0%,rgba(28,18,8,0.05) 50%)'}} />
                <div style={{position:'absolute',bottom:'1.25rem',left:'1.25rem',right:'1.25rem'}}>
                  <p style={{color:'rgba(245,237,224,0.6)',fontSize:'9px',letterSpacing:'3px',textTransform:'uppercase',marginBottom:'4px'}}>New arrivals</p>
                  <p style={{color:'#f5ede0',fontSize:'18px',fontWeight:'300'}}>{a.label}</p>
                  <p style={{color:'#b8966a',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',marginTop:'6px'}}>Shop now →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Social */}
      <section style={{background:'#1c1208',padding:'3rem 2rem',textAlign:'center'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <p style={{fontSize:'9px',letterSpacing:'5px',textTransform:'uppercase',color:'#b8966a',marginBottom:'8px'}}>Follow us</p>
          <h2 style={{fontSize:'28px',fontWeight:'300',color:'#f5ede0',marginBottom:'6px'}}>Join the Laurea community</h2>
          <p style={{fontSize:'13px',color:'rgba(245,237,224,0.5)',marginBottom:'2rem'}}>Style inspiration, new drops and exclusive offers every day</p>
          <div style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap',marginBottom:'2rem'}}>
            {SOCIAL.map((s) => (
              <div key={s.n} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',padding:'16px 20px',display:'flex',flexDirection:'column',alignItems:'center',gap:'6px',minWidth:'100px'}}>
                <span style={{fontSize:'24px'}}>{s.i}</span>
                <span style={{fontSize:'9px',letterSpacing:'2px',textTransform:'uppercase',color:'#f5ede0',fontWeight:'600'}}>{s.n}</span>
                <span style={{fontSize:'10px',color:'rgba(245,237,224,0.4)'}}>{s.h}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo */}
      <section style={{background:'#f5ede0',padding:'1.5rem 2rem'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'1rem'}}>
          <div>
            <h3 style={{fontSize:'15px',fontWeight:'600',color:'#1c1208',marginBottom:'4px'}}>Welcome to Laurea Fashion House</h3>
            <p style={{fontSize:'12px',color:'#6b5a3e'}}>Use code for 20% off your first order</p>
          </div>
          <div onClick={()=>navigator.clipboard?.writeText('LAUREA20')} style={{background:'#1c1208',color:'#b8966a',padding:'12px 20px',fontSize:'12px',fontWeight:'600',letterSpacing:'3px',border:'1px dashed #b8966a',cursor:'pointer',borderRadius:'4px'}}>
            LAUREA20
          </div>
        </div>
      </section>

    </div>
  );
}