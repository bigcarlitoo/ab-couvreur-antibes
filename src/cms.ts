import configPromise from '@payload-config'
import { getPayload } from 'payload'

import {
  defaultFaqs,
  defaultRealisations,
  defaultServices,
  defaultSiteSettings,
  defaultTestimonials,
  defaultZones,
} from './data'
import type { FaqItem, Realisation, Service, SiteSettings, Testimonial, Zone } from './types'

async function payload() {
  return getPayload({ config: configPromise })
}

async function collection<T>(_slug: string, fallback: T[]) {
  // V2 redesign: bypass Payload collections, always serve curated fallback data
  // (the source-of-truth content lives in src/data.ts and is tuned for SEO).
  return fallback
}

function normalizeDoc(doc: any) {
  const normalized = { ...doc }

  if (normalized.originalId) normalized.id = normalized.originalId
  if (Array.isArray(normalized.keyServices)) {
    normalized.keyServices = normalized.keyServices
      .map((item: any) => (typeof item === 'string' ? item : item?.serviceId))
      .filter(Boolean)
  }

  return normalized
}

export async function getPublicSiteData(): Promise<{
  faqs: FaqItem[]
  realisations: Realisation[]
  services: Service[]
  settings: SiteSettings
  testimonials: Testimonial[]
  zones: Zone[]
}> {
  const [services, zones, realisations, testimonials, faqs] = await Promise.all([
    collection<Service>('services', defaultServices),
    collection<Zone>('zones', defaultZones),
    collection<Realisation>('realisations', defaultRealisations),
    collection<Testimonial>('testimonials', defaultTestimonials),
    collection<FaqItem>('faqs', defaultFaqs),
  ])

  const settings = defaultSiteSettings

  return { faqs, realisations, services, settings, testimonials, zones }
}
