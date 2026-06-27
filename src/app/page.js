'use client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{minHeight:'100vh'}}>

      <section style={{background:'#1c1208',padding:'3rem 2rem',textAlign:'center'}}>
        <p style={{fontSize:'9px',letterSpacing:'5px',color:'#b8966a',textTransform:'uppercase',marginBottom:'10px'}}>2026 Collection</p>
        <h1 style={{fontSize:'32px',fontWeight:'300',color:'#f5ede0',marginBottom:'8px'}}>
          Dress with <em style={{color:'#b8966a'}}>intention.</em>
        </h1>
        <p style={{fontSize:'12px',color:'rgba(245,237,224,0.5)',marginBottom:'1.5rem'}}>Women · Men · Kids · Bags · Jewellery & More</p>
        <div style={{display:'flex',gap:'10px',justifyContent:'center'}}>
          <Link href="/women" style={{background:'#b8966a',color:'#1c1208',padding:'11px 24px',fontSize:'10px',fontWeight:'600',letterSpacing:'2px',textTransform:'uppercase',textDecoration:'none'}}>Shop women</Link>
          <Link href="/men" style={{background:'transparent',color:'#f5ede0',border:'1px solid rgba(245,237,224,0.3)',padding:'11px 24px',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',textDecoration:'none'}}>Shop men</Link>
        </div>
      </section>

      <section style={{padding:'2rem'}}>
        <p style={{fontSize:'11px',fontWeight:'600',letterSpacing:'3px',textTransform:'uppercase',color:'#2a1e10',marginBottom:'1rem'}}>Shop by department</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px'}}>
          {[
            {name:'Women',href:'/women',emoji:'👗',bg:'#f0e8e0',color:'#5a3a28'},
            {name:'Men',href:'/men',emoji:'👔',bg:'#dce4ec',color:'#1a3050'},
            {name:'Kids',href:'/kids',emoji:'🧒',bg:'#f0e0e8',color:'#5a2040'},
            {name:'Bags',href:'/bags',emoji:'👜',bg:'#e8e0d0',color:'#3a2e20'},
            {name:'Jewellery',href:'/jewelry',emoji:'💍',bg:'#f0e8c8',color:'#3a2a08'},
            {name:'Shoes',href:'/shoes',emoji:'👟',bg:'#e0dcd8',color:'#2a2520'},
            {name:'Beauty',href:'/beauty',emoji:'💄',bg:'#f0d8e0',color:'#4a1830'},
            {name:'Home',href:'/home',emoji:'🏡',bg:'#d8e8d8',color:'#1a3020'},
          ].map((d) => (
            <Link key={d.name} href={d.href} style={{textDecoration:'none',background:d.bg,borderRadius:'10px',height:'110px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'6px',color:d.color}}>
              <span style={{fontSize:'28px'}}>{d.emoji}</span>
              <span style={{fontSize:'9px',letterSpacing:'2px',textTransform:'uppercase',fontWeight:'600'}}>{d.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section style={{background:'#1c1208',padding:'1.5rem 2rem'}}>
        <p style={{color:'#f5ede0',fontSize:'11px',letterSpacing:'4px',textTransform:'uppercase',marginBottom:'1rem'}}>⚡ Flash sale</p>
        <div style={{display:'flex',gap:'10px',overflowX:'auto'}}>
          {[
            {e:'👗',n:'Wrap dress',p:'$8.99',o:'$24.99'},
            {e:'💍',n:'Ring set',p:'$6.99',o:'$19.99'},
            {e:'👜',n:'Crossbody bag',p:'$14.99',o:'$44.99'},
            {e:'👟',n:'White sneakers',p:'$12.99',o:'$39.99'},
            {e:'💄',n:'Lip set',p:'$8.99',o:'$22.99'},
            {e:'🕯',n:'Oud candle',p:'$7.99',o:'$22.99'},
          ].map((item,i) => (
            <div key={i} style={{flexShrink:0,width:'96px',background:'rgba(245,237,224,0.05)',border:'1px solid rgba(245,237,224,0.1)',padding:'10px',textAlign:'center',borderRadius:'8px'}}>
              <div style={{fontSize:'24px',marginBottom:'6px'}}>{item.e}</div>
              <p style={{fontSize:'9px',color:'rgba(245,237,224,0.75)',marginBottom:'4px'}}>{item.n}</p>
              <p style={{fontSize:'12px',fontWeight:'600',color:'#b8966a'}}>{item.p}</p>
              <p style={{fontSize:'9px',color:'rgba(245,237,224,0.35)',textDecoration:'line-through'}}>{item.o}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{background:'#1c1208',padding:'2rem',textAlign:'center',marginTop:'1px'}}>
        <p style={{fontSize:'9px',letterSpacing:'5px',textTransform:'uppercase',color:'#b8966a',marginBottom:'6px'}}>Follow us</p>
        <h2 style={{fontSize:'22px',fontWeight:'300',color:'#f5ede0',marginBottom:'1.5rem'}}>Join the Laurea community</h2>
        <div style={{display:'flex',gap:'10px',justifyContent:'center',flexWrap:'wrap'}}>
          {[
            {n:'Instagram',i:'📸',f:'142K'},
            {n:'TikTok',i:'🎵',f:'89K'},
            {n:'Facebook',i:'📘',f:'56K'},
            {n:'Twitter',i:'🐦',f:'31K'},
            {n:'YouTube',i:'▶️',f:'24K'},
          ].map((s) => (
            <div key={s.n} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',padding:'16px',textAlign:'center',minWidth:'90px'}}>
              <div style={{fontSize:'24px',marginBottom:'6px'}}>{s.i}</div>
              <div style={{fontSize:'9px',color:'#f5ede0',letterSpacing:'1px',textTransform:'uppercase'}}>{s.n}</div>
              <div style={{fontSize:'11px',color:'#b8966a',fontWeight:'600',marginTop:'4px'}}>{s.f}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{background:'#f5ede0',padding:'1.5rem 2rem',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <h3 style={{fontSize:'14px',fontWeight:'600',color:'#1c1208',marginBottom:'4px'}}>Welcome to Laurea Fashion House</h3>
          <p style={{fontSize:'12px',color:'#6b5a3e'}}>Use code for 20% off your first order</p>
        </div>
        <div style={{background:'#1c1208',color:'#b8966a',padding:'10px 18px',fontSize:'11px',fontWeight:'600',letterSpacing:'3px',border:'1px dashed #b8966a'}}>
          LAUREA20
        </div>
      </section>

    </div>
  );
}