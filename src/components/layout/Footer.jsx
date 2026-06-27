import Link from 'next/link';

const footerLinks = {
  Shop: [
    { name: 'Women', href: '/women' }, { name: 'Men', href: '/men' },
    { name: 'Kids', href: '/kids' }, { name: 'Bags', href: '/bags' },
    { name: 'Jewellery', href: '/jewelry' }, { name: 'Shoes', href: '/shoes' },
  ],
  Help: [
    { name: 'Sizing guide', href: '/sizing' }, { name: 'Returns', href: '/returns' },
    { name: 'Track order', href: '/track' }, { name: 'Contact us', href: '/contact' },
    { name: 'FAQs', href: '/faq' },
  ],
  Company: [
    { name: 'About us', href: '/about' }, { name: 'Careers', href: '/careers' },
    { name: 'Sustainability', href: '/sustainability' }, { name: 'Press', href: '/press' },
    { name: 'Privacy policy', href: '/privacy' },
  ],
};

const socialLinks = [
  { name: 'Instagram', href: 'https://instagram.com/laureafashion', icon: '📸' },
  { name: 'TikTok', href: 'https://tiktok.com/@laureafashion', icon: '🎵' },
  { name: 'Facebook', href: 'https://facebook.com/laureafashionhouse', icon: '📘' },
  { name: 'Twitter', href: 'https://twitter.com/laureafashion', icon: '🐦' },
  { name: 'YouTube', href: 'https://youtube.com/laureafashionhouse', icon: '▶️' },
];

export default function Footer() {
  return (
    <footer className="bg-dark text-cream mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-stone-700">
          {/* Brand */}
          <div>
            <div className="text-lg font-semibold tracking-[0.3em] uppercase">Laurea</div>
            <div className="text-[8px] tracking-[0.5em] text-gold uppercase mb-4">Fashion House</div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Dress with intention. Premium fashion for every body, every age, every occasion.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-[9px] tracking-[0.2em] uppercase text-gold font-medium mb-4">{heading}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-[10px] tracking-wide uppercase text-stone-400 hover:text-gold transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-stone-500">© 2026 Laurea Fashion House. All rights reserved.</p>
          <div className="flex gap-3">
            {socialLinks.map((s) => (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                aria-label={s.name}
                className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-sm hover:bg-gold hover:border-gold transition-all">
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
