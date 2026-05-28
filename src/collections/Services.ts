import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'

export const Services: CollectionConfig = {
  slug: 'services',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'priceEstimate'],
    group: 'Contenu du site',
    useAsTitle: 'title',
  },
  fields: [
    { name: 'originalId', type: 'text', admin: { description: 'Identifiant historique utilisé par la maquette publique.' } },
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'shortDescription', type: 'textarea', required: true },
    { name: 'longDescription', type: 'textarea', required: true },
    { name: 'icon', type: 'text', defaultValue: 'Hammer' },
    { name: 'image', type: 'text', required: true },
    { name: 'priceEstimate', type: 'text' },
    { name: 'durationEstimate', type: 'text' },
    { name: 'seoTitle', type: 'text', required: true },
    { name: 'seoDescription', type: 'textarea', required: true },
    {
      name: 'faqs',
      type: 'array',
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
  ],
}
