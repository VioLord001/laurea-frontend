'use client';
export default function PromoCode({ code }) {
  const copy = () => { navigator.clipboard?.writeText(code); };
  return (
    <div
      className="bg-dark text-gold px-5 py-2 text-sm font-medium tracking-[0.2em] border border-dashed border-gold cursor-pointer hover:bg-gold hover:text-dark hover:border-dark transition-all"
      onClick={copy}
    >
      {code}
    </div>
  );
}
