import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'

export const Realisations: CollectionConfig = {
  slug: 'realisations',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'city', 'serviceId'],
    group: 'Contenu du site',
    useAsTitle: 'title',
  },
  fields: [
    { name: 'originalId', type: 'text', admin: { description: 'Identifiant historique utilisé par la maquette publique.' } },
    { name: 'title', type: 'text', required: true },
    { name: 'city', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
    { name: 'roofType', type: 'text', required: true },
    { name: 'beforeImage', type: 'text', required: true },
    { name: 'afterImage', type: 'text', required: true },
    { name: 'duration', type: 'text', required: true },
    { name: 'serviceId', type: 'text', required: true },
    {
      name: 'clientReview',
      type: 'group',
      fields: [
        { name: 'author', type: 'text' },
        { name: 'rating', type: 'number', min: 1, max: 5 },
        { name: 'comment', type: 'textarea' },
      ],
    },
  ],
}
