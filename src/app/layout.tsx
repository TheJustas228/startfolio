import type { Metadata } from 'next';
import { AppProvider } from '@/context/AppContext';
import CursorGlow from '@/components/CursorGlow';
import AppBackground from '@/components/AppBackground';
import './globals.css';

export const metadata: Metadata = {
  title: 'StartFolio — Choose a diversified portfolio you can stick with',
  description:
    'StartFolio helps new investors choose a simple, diversified long-term portfolio without jargon, hype, or stock-picking recommendations.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppBackground />
        <CursorGlow />
        <div className="appContent">
          <AppProvider>{children}</AppProvider>
        </div>
      </body>
    </html>
  );
}
