import type { Metadata } from 'next';
import './globals.css';
import { HeaderNav } from '@/components/navigation/HeaderNav';
import { SmoothScrollProvider } from '@/components/providers/SmoothScroll';

export const metadata: Metadata = {
  title: 'Riverè | Artisan Bakery & Café',
  description:
    'An immersive artisan bakery & café experience naturally fermented with wild yeast sourdough, hand-laminated viennoiserie, and specialty roasts.',
  keywords: ['Artisan Bakery', 'Sourdough', 'Viennoiserie', 'French Pastry', 'Specialty Coffee', 'Riverè Cafe'],
  openGraph: {
    title: 'Riverè | Artisan Bakery & Café',
    description: 'Immersive artisan bakery and café experience.',
    images: ['/assets/cafe-storefront.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="bg-stone-950 text-stone-100 antialiased selection:bg-amber-500 selection:text-stone-950">
        <SmoothScrollProvider>
          <HeaderNav />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

