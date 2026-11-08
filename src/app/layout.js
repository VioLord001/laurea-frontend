import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: { default: 'Laurea Fashion House', template: '%s | Laurea Fashion House' },
  description: 'Premium fashion for women, men, kids & more. Dress with intention.',
  keywords: ['fashion', 'clothing', 'women', 'men', 'kids', 'bags', 'jewellery', 'shoes'],
  openGraph: {
    type: 'website', siteName: 'Laurea Fashion House',
    title: 'Laurea Fashion House', description: 'Premium fashion for everyone.'
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="bottom-center" toastOptions={{ duration: 3000,
          style: { background: '#1c1208', color: '#f5ede0', borderLeft: '3px solid #b8966a', borderRadius: '4px' }
        }} />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
