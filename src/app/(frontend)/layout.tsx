import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

import { CookieConsent } from '@/components/CookieConsent'

import '../../index.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ab-couvreur-sud.fr'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AB Couvreur Antibes — Artisan couvreur Côte d'Azur (06)",
    template: "%s | AB Couvreur Antibes",
  },
  description:
    "Artisan couvreur à Antibes, Cannes & Nice : rénovation de toiture, recherche de fuite, Velux, zinguerie, nettoyage, hydrofuge et isolation. Diagnostic et devis gratuits, garantie décennale incluse.",
  keywords: [
    "couvreur Antibes",
    "couvreur Cannes",
    "couvreur Nice",
    "réparation toiture Antibes",
    "fuite toiture Antibes",
    "Velux Antibes",
    "nettoyage toiture Côte d'Azur",
    "zinguerie Alpes-Maritimes",
    "artisan couvreur 06",
  ],
  authors: [{ name: "AB Couvreur" }],
  creator: "AB Couvreur",
  publisher: "AB Couvreur",
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "AB Couvreur Antibes",
    title: "AB Couvreur Antibes — Artisan couvreur Côte d'Azur",
    description:
      "Couvreur à Antibes, Cannes & Nice. Rénovation, fuite, Velux, zinguerie, nettoyage, hydrofuge. Devis gratuit, garantie décennale.",
    images: [
      {
        url: "/assets/ab-source/ab-13.webp",
        width: 1400,
        height: 1400,
        alt: "AB Couvreur — chantier toiture à Antibes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AB Couvreur Antibes — Artisan couvreur Côte d'Azur",
    description:
      "Couvreur à Antibes, Cannes & Nice. Devis gratuit, garantie décennale.",
    images: ["/assets/ab-source/ab-13.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Bâtiment & Couverture",
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#15192a" />
        <meta name="geo.region" content="FR-06" />
        <meta name="geo.placename" content="Antibes" />
        <meta name="geo.position" content="43.5804;7.1251" />
        <meta name="ICBM" content="43.5804, 7.1251" />
      </head>
      <body className="bg-[var(--color-cream)] text-[var(--color-ink)] antialiased">
        {children}
        <CookieConsent />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
