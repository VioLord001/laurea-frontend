// ============================================
// STAGE 2: HOME PAGE
// ============================================
import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';
import PromoCode from '@/components/PromoCode';

// In production these would be fetched from the API
const DEPARTMENTS = [
  { name: 'Women', href: '/women', photo: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80', sub: '15 categories' },
  { name: 'Men', href: '/men', photo: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400&q=80', sub: '15 categories' },
  { name: 'Kids', href: '/kids', photo: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&q=80', sub: '14 categories' },
  { name: 'Bags', href: '/bags', photo: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80', sub: '8 types' },
  { name: 'Jewellery', href: '/jewelry', photo: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80', sub: '7 types' },
  { name: 'Shoes', href: '/shoes', photo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', sub: '8 types' },
  { name: 'Beauty', href: '/beauty', photo: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80', sub: '6 types' },
  { name: 'Home & Living', href: '/home', photo: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80', sub: '6 types' },
];


async function getFeaturedProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?featured=true&limit=6`, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div>
      {/* ── Hero ───────────────────────────────── */}
      <section style={{position:'relative',height:'90vh',minHeight:'500px',overflow:'hidden'}}>
        <video autoPlay muted loop playsInline style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top'}}>
          <source src="https://videos.pexels.com/video-files/3576378/3576378-uhd_2560_1440_25fps.mp4" type="video/mp4" />
        </video>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to right,rgba(13,27,42,0.75) 50%,rgba(13,27,42,0.3))'}} />
        <div style={{position:'absolute',bottom:'15%',left:0,right:0,padding:'0 2rem',zIndex:1}}>
          <p style={{fontSize:'9px',letterSpacing:'5px',color:'#b8966a',textTransform:'uppercase',marginBottom:'12px'}}>2026 Collection</p>
          <h1 style={{fontSize:'clamp(32px,5vw,56px)',fontWeight:'300',color:'#f5ede0',lineHeight:'1.15',marginBottom:'12px',fontFamily:'serif'}}>
            Dress with<br /><em style={{color:'#b8966a'}}>intention.</em>
          </h1>
          <p style={{fontSize:'12px',color:'rgba(245,237,224,0.6)',marginBottom:'1.5rem',letterSpacing:'2px'}}>Women · Men · Kids · Bags · Jewellery & More</p>
          <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
            <Link href="/women" className="btn-gold">Shop Women</Link>
            <Link href="/men" style={{background:'transparent',color:'#f5ede0',border:'1px solid rgba(245,237,224,0.4)',padding:'12px 28px',fontSize:'11px',fontWeight:'500',letterSpacing:'2px',textTransform:'uppercase',textDecoration:'none'}}>Shop Men</Link>
          </div>
        </div>
      </section>

      {/* ── Department grid ───────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-xs tracking-[0.25em] uppercase text-stone-500 mb-6">Shop by department</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DEPARTMENTS.map((dept) => (
            <Link key={dept.name} href={dept.href}
              className="relative rounded-xl h-36 overflow-hidden hover:-translate-y-1 transition-transform block">
              <img src={dept.photo} alt={dept.name} className="absolute inset-0 w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                <p className="text-xs font-medium tracking-widest uppercase text-white">{dept.name}</p>
                <p className="text-[9px] text-white/70 mt-0.5">{dept.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured products ─────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-xs tracking-[0.25em] uppercase text-stone-800 whitespace-nowrap">Featured pieces</h2>
          <div className="flex-1 h-px bg-stone-200"></div>
          <Link href="/products" className="text-[10px] tracking-widest uppercase text-gold whitespace-nowrap">View all</Link>
        </div>
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredProducts.map((product) => (<ProductCard key={product.id} product={product} />))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Placeholder cards before products are added */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-stone-100 aspect-[3/4] rounded mb-3" />
                <div className="h-3 bg-stone-100 rounded mb-1 w-3/4" />
                <div className="h-3 bg-stone-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Social media ──────────────────────── */}
      <section className="bg-dark py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[9px] tracking-[0.5em] uppercase text-gold mb-2">Follow us</p>
          <h2 className="text-2xl font-serif font-light text-cream mb-2">Join the Laurea community</h2>
          <p className="text-xs text-stone-400 mb-8">Style inspiration, new drops & exclusive offers — every day</p>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 max-w-2xl mx-auto mb-6">
            {[
              { n: 'Instagram', h: '@ifh.official', f: '', c: 'from-[#3a1a2e] to-[#4a1a38]', i: '📸' },
              { n: 'Facebook', h: 'Laurea Official', f: '', c: 'from-[#0a1428] to-[#0e1c3a]', i: '📘' },
            ].map((s) => (
              <div key={s.n} className={`bg-gradient-to-br ${s.c} rounded-xl p-4 flex flex-col items-center gap-2 border border-white/10 hover:-translate-y-1 transition-transform cursor-pointer`}>
                <span className="text-2xl">{s.i}</span>
                <span className="text-[9px] tracking-wider uppercase text-white/90 font-medium">{s.n}</span>
                <span className="text-[9px] text-white/50">{s.h}</span>
                <span className="text-xs font-medium text-white">{s.f}</span>
              </div>
            ))}
          </div>
          <a href="https://instagram.com/ifh.official" target="_blank" rel="noopener noreferrer"
            className="inline-block border border-white/20 text-white/80 px-8 py-3 text-[10px] tracking-widest uppercase hover:bg-gold hover:border-gold hover:text-dark transition-all">
            Follow us on Instagram
          </a>
        </div>
      </section>

      {/* ── Promo banner ──────────────────────── */}
      <section className="bg-cream border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-dark">Welcome to Laurea Fashion House</h3>
            <p className="text-xs text-stone-500 mt-1">Use code for 20% off your first order</p>
          </div>
          <PromoCode code="LAUREA20" />
        </div>
      </section>
    </div>
  );
}
