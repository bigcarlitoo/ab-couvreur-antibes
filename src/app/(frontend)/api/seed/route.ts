import configPromise from '@payload-config'
import { getPayload } from 'payload'

import {
  defaultFaqs,
  defaultRealisations,
  defaultServices,
  defaultSiteSettings,
  defaultTestimonials,
  defaultZones,
} from '@/data'

async function seedCollection(payload: any, collection: string, docs: any[], mapDoc = (doc: any) => doc) {
  const existing = await payload.find({ collection, limit: 500 })

  for (const doc of existing.docs) {
    await payload.delete({ collection, id: doc.id })
  }

  for (const doc of docs) {
    const { id, ...rest } = doc
    await payload.create({
      collection,
      data: {
        originalId: id,
        ...mapDoc(rest),
      },
    })
  }

  return { collection, deleted: existing.docs.length, created: docs.length }
}

export async function POST() {
  const payload = await getPayload({ config: configPromise })

  await payload.updateGlobal({
    slug: 'site-settings' as any,
    data: defaultSiteSettings,
  })

  const results = await Promise.all([
    seedCollection(payload, 'services', defaultServices),
    seedCollection(payload, 'zones', defaultZones, (zone) => ({
      ...zone,
      keyServices: zone.keyServices.map((serviceId: string) => ({ serviceId })),
    })),
    seedCollection(payload, 'realisations', defaultRealisations),
    seedCollection(payload, 'testimonials', defaultTestimonials),
    seedCollection(payload, 'faqs', defaultFaqs),
  ])

  return Response.json({ ok: true, results })
}

export async function GET() {
  return POST()
}
