import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AntiCloneShield } from '@/components/ui/shield';
import { FAQAssistant } from '@/components/ai-chat/faq-assistant';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'NicheGenius AI — The World\'s First AGI-Powered Niche Discovery Platform',
    template: '%s | NicheGenius AI',
  },
  description:
    'Answer 155 questions. Our multi-model AGI engine analyzes your personality, skills, and market data across 2.4 million data points to reveal the perfect niche for your online empire.',
  keywords: [
    'niche discovery',
    'AI niche finder',
    'online business',
    'digital products',
    'content creator',
    'AGI',
    'personality assessment',
    'business blueprint',
  ],
  authors: [{ name: 'NicheGenius AI' }],
  openGraph: {
    title: 'NicheGenius AI — Discover Your Perfect Niche',
    description:
      'Our AGI engine analyzes 2.4M data points to find your perfect niche.',
    type: 'website',
    locale: 'en_US',
    siteName: 'NicheGenius AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NicheGenius AI',
    description:
      'The world\'s first AGI-powered niche discovery platform.',
  },
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    nocache: true,
  },
  other: {
    'googlebot': 'noindex, nofollow, noarchive, nosnippet, noimageindex',
    'google': 'nositelinkssearchbox, notranslate',
  },
};

export const viewport: Viewport = {
  themeColor: '#09090B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Mobile-first viewport & compatibility */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {/* Anti-Clone Meta Tags */}
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        <meta name="google" content="nositelinkssearchbox, notranslate" />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#09090B] text-white min-h-screen overflow-x-hidden`}
      >
        {/*
          ═══════════════════════════════════════════════════════════════
          DMCA NOTICE — NicheGenius AI
          © 2024-2026 NicheGenius AI. All rights reserved.
          ═══════════════════════════════════════════════════════════════
        */}

        {/* Background mesh gradient */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
          <div className="absolute -top-80 left-1/2 -translate-x-1/2 w-[600px] md:w-[1000px] h-[500px] md:h-[700px] rounded-full bg-violet-600/8 blur-[120px] md:blur-[160px]" />
          <div className="absolute top-[60%] -right-40 md:-right-60 w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full bg-purple-900/10 blur-[100px] md:blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-indigo-900/8 blur-[100px] md:blur-[140px]" />
        </div>

        {/* Anti-Clone Shield wraps the entire application */}
        <AntiCloneShield>
          <div className="relative z-10">{children}</div>
          <FAQAssistant />
        </AntiCloneShield>
      </body>
    </html>
  );
}
