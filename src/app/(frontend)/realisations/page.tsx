import type { Metadata } from 'next'

import { getPublicSiteData } from '@/cms'
import { PublicSite } from '@/components/PublicSite'

export const metadata: Metadata = {
  description: 'Photos de chantiers AB Couvreur : toiture, Velux, zinguerie, façade et interventions dans les Alpes-Maritimes.',
  title: 'Réalisations toiture Antibes et Alpes-Maritimes | AB Couvreur',
}

export default async function RealisationsPage() {
  const data = await getPublicSiteData()

  return <PublicSite {...data} initialPath="/realisations" />
}
