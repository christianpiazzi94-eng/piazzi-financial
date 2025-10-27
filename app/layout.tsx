// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

// CORRECTED PATHS
import Header from '../components/Header';
import Footer from '../components/Footer'; // <--- THIS LINE IS NOW CORRECT
import CookieConsentBanner from '../components/CookieConsentBanner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Piazzi Financial Analysis',
  description: 'Data-driven financial insights and long-term market analysis.',
};

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider> 
      <html lang="en">
        <head>
          {/* GA4 Tracking Scripts (Blocked until consent is given) */}
          {GA_MEASUREMENT_ID && (
            <>
              <Script
                strategy="lazyOnload"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                id="gtag-init"
              />
              <Script
                id="gtag-data"
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_MEASUREMENT_ID}', {
                      'anonymize_ip': true, 
                      'cookie_flags': 'SameSite=None; Secure',
                      'send_page_view': false 
                    });
                  `,
                }}
              />
            </>
          )}
        </head>
        <body className={`${inter.className} bg-white text-slate-900`}>
          <Header />
          <main>{children}</main>
          <Footer />
          <CookieConsentBanner />
        </body>
      </html>
    </ClerkProvider>
  );
}