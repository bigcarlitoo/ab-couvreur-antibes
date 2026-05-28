import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'

export const Zones: CollectionConfig = {
  slug: 'zones',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['city', 'postalCode', 'slug'],
    group: 'Contenu du site',
    useAsTitle: 'city',
  },
  fields: [
    { name: 'originalId', type: 'text', admin: { description: 'Identifiant historique utilisé par la maquette publique.' } },
    { name: 'city', type: 'text', required: true },
    { name: 'postalCode', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'localIntro', type: 'textarea', required: true },
    { name: 'distance', type: 'text', required: true },
    { name: 'h1', type: 'text', required: true },
    { name: 'seoTitle', type: 'text', required: true },
    { name: 'seoDescription', type: 'textarea', required: true },
    {
      name: 'keyServices',
      type: 'array',
      fields: [{ name: 'serviceId', type: 'text', required: true }],
    },
  ],
}
