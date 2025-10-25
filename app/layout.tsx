// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs'; // <-- 1. Import ClerkProvider

// Use the correct relative path
import Header from '../components/Header';
import Footer from '../components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Piazzi Financial Analysis',
  description: 'Data-driven financial insights and long-term market analysis.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <-- 2. Wrap the entire app in ClerkProvider
    <ClerkProvider> 
      <html lang="en">
        <body className={`${inter.className} bg-white text-slate-900`}>
          <Header />
          <main>{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
    // ----------------------------------------
  );
}