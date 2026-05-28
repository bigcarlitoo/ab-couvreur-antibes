import type { Metadata } from 'next'

import { getPublicSiteData } from '@/cms'
import { PublicSite } from '@/components/PublicSite'

export const metadata: Metadata = {
  description: 'Demandez un devis gratuit à AB Couvreur pour toiture, fuite, Velux, zinguerie, nettoyage ou rénovation autour d’Antibes.',
  title: 'Devis couvreur gratuit Antibes | AB Couvreur',
}

export default async function ContactPage() {
  const data = await getPublicSiteData()

  return <PublicSite {...data} initialPath="/contact" />
}
