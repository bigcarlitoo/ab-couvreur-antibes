import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['author', 'city', 'rating'],
    group: 'Contenu du site',
    useAsTitle: 'author',
  },
  fields: [
    { name: 'originalId', type: 'text', admin: { description: 'Identifiant historique utilisé par la maquette publique.' } },
    { name: 'author', type: 'text', required: true },
    { name: 'rating', type: 'number', defaultValue: 5, min: 1, max: 5 },
    { name: 'comment', type: 'textarea', required: true },
    { name: 'city', type: 'text', required: true },
    { name: 'service', type: 'text', required: true },
    { name: 'date', type: 'text', required: true },
  ],
}
