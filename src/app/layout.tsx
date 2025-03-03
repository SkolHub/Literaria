import { isLogged } from '@/api/admin/auth';
import { getArticleNames, getCategories } from '@/api/article';
import NavbarWrapper from '@/components/layout/navbar/navbar-wrapper';
import '@/lib/fontawesome/css/fa.css';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { ReactNode } from 'react';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Literaria',
  description: 'Un site despre literatură',
  keywords: ['literature', 'painting', 'film', 'literatură', 'desen'],
  other: {
    'google-adsense-account': 'ca-pub-1931536699775420'
  }
};

export default async function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const categories = await getCategories();
  const articles = await getArticleNames();

  const isAdmin = await isLogged();

  return (
    <html lang='en'>
      <body className={`${plusJakartaSans.className} antialiased`}>
        {/*<NavbarWrapper*/}
        {/*  isAdmin={isAdmin}*/}
        {/*  categories={categories}*/}
        {/*  articleNames={articles}*/}
        {/*/>*/}
        <main
          id='main'
          className='h-[100svh] overflow-y-auto overflow-x-hidden'
        >
          {children}
        </main>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
