import Link from 'next/link';
const CATS = [
  { name:'Tops',emoji:'👚',styles:['T-shirts','Crop tops','Blouses','Bodysuits','Tank tops'] },
  { name:'Bottoms',emoji:'👖',styles:['Trousers','Wide-leg','Mini skirts','Midi skirts','Leggings'] },
  { name:'Denim',emoji:'🩲',styles:['Skinny jeans','Wide-leg jeans','Mom jeans','Denim jackets'] },
  { name:'Dresses',emoji:'👗',styles:['Mini dresses','Midi dresses','Maxi dresses','Wrap dresses','Party dresses'] },
  { name:'Outerwear',emoji:'🧥',styles:['Coats','Puffer jackets','Trench coats','Blazers','Parkas'] },
  { name:'Sleepwear',emoji:'😴',styles:['Pyjama sets','Robes','Loungewear sets','Onesies'] },
  { name:'Activewear',emoji:'🏋',styles:['Sports bras','Leggings','Gym sets','Running tops'] },
  { name:'Swimwear',emoji:'👙',styles:['Bikinis','One-pieces','Coverups','Sarongs'] },
  { name:'Lingerie',emoji:'🌸',styles:['Bra sets','Shapewear','Bodysuits','Corsets'] },
  { name:'Co-ords',emoji:'✨',styles:['Trouser sets','Skirt sets','Linen sets'] },
  { name:'Knitwear',emoji:'🧶',styles:['Jumpers','Cardigans','Knit dresses','Vests'] },
  { name:'Shirts',emoji:'👔',styles:['Oversized shirts','Linen shirts','Satin shirts'] },
  { name:'Jumpsuits',emoji:'🤸',styles:['Playsuits','Casual jumpsuits','Party jumpsuits'] },
  { name:'Blazers',emoji:'🧥',styles:['Power blazers','Oversized blazers','Checked blazers'] },
  { name:'Cardigans',emoji:'🧣',styles:['Long cardigans','Cropped cardigans','Open-front'] },
];
export const metadata = { title: "Women's Fashion | Laurea Fashion House" };
export default function WomenPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <nav className="text-[10px] tracking-wider uppercase text-stone-400 mb-6">
        <Link href="/" className="hover:text-gold">Home</Link><span className="mx-2">›</span><span className="text-stone-800">Women</span>
      </nav>
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-stone-100">
        <span className="text-4xl">👗</span>
        <div><h1 className="text-3xl font-serif font-light">Women's Fashion</h1><p className="text-xs text-stone-400 mt-1">Clothing, dresses, activewear & more</p></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {CATS.map((cat) => (
          <Link key={cat.name} href={`/women/${cat.name.toLowerCase().replace(/ /g, '-')}`}
            className="bg-white border border-stone-200 rounded-xl p-4 hover:border-gold hover:-translate-y-1 transition-all cursor-pointer">
            <div className="text-2xl mb-2">{cat.emoji}</div>
            <h2 className="text-xs font-medium tracking-wider uppercase text-stone-800 mb-1">{cat.name}</h2>
            <p className="text-[9px] text-stone-400 mb-2">{cat.styles.length} styles</p>
            <div className="flex flex-wrap gap-1">{cat.styles.slice(0,2).map((s) => (<span key={s} className="text-[8px] bg-stone-50 text-stone-500 px-1.5 py-0.5 rounded">{s}</span>))}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
