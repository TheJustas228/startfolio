import type { Metadata, Viewport } from 'next';
import { AppProvider } from '@/context/AppContext';
import CursorGlow from '@/components/CursorGlow';
import AppBackground from '@/components/AppBackground';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import './globals.css';

const SITE_URL = 'https://startfolio.co';
const TITLE = 'StartFolio — Simple model portfolios for beginner investors';
const DESCRIPTION =
  'StartFolio helps new investors choose a simple, diversified long-term portfolio without jargon, hype, or stock-picking recommendations.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: '%s — StartFolio',
  },
  description: DESCRIPTION,
  applicationName: 'StartFolio',
  keywords: [
    'model portfolio',
    'diversification',
    'index investing',
    'asset allocation',
    'beginner investing',
  ],
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'StartFolio',
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'StartFolio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/logo.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#0B0520',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <AppBackground />
        <CursorGlow />
        <div className="appContent">
          <AppProvider>
            <SiteNav />
            <div id="main-content">{children}</div>
            <SiteFooter />
          </AppProvider>
        </div>
      </body>
    </html>
  );
}
