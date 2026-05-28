import type { Metadata } from 'next'

import { getPublicSiteData } from '@/cms'
import { PublicSite } from '@/components/PublicSite'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { services } = await getPublicSiteData()
  const service = services.find((item) => item.slug === slug)

  return {
    description: service?.seoDescription || 'AB Couvreur intervient à Antibes, Cannes, Nice et dans les Alpes-Maritimes pour vos travaux de toiture.',
    title: service?.seoTitle || 'Service toiture Antibes | AB Couvreur',
  }
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const data = await getPublicSiteData()

  return <PublicSite {...data} initialPath={`/services/${slug}`} />
}
