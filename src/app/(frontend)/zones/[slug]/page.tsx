import type { Metadata } from 'next'

import { getPublicSiteData } from '@/cms'
import { PublicSite } from '@/components/PublicSite'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { zones } = await getPublicSiteData()
  const zone = zones.find((item) => item.slug === slug)

  return {
    description: zone?.seoDescription || 'AB Couvreur intervient dans les Alpes-Maritimes pour réparation, rénovation et entretien de toiture.',
    title: zone?.seoTitle || 'Couvreur Alpes-Maritimes | AB Couvreur',
  }
}

export default async function ZonePage({ params }: Props) {
  const { slug } = await params
  const data = await getPublicSiteData()

  return <PublicSite {...data} initialPath={`/zones/${slug}`} />
}
