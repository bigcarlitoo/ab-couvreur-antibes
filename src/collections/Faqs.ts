import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['question', 'category'],
    group: 'Contenu du site',
    useAsTitle: 'question',
  },
  fields: [
    { name: 'originalId', type: 'text', admin: { description: 'Identifiant historique utilisé par la maquette publique.' } },
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true },
    { name: 'category', type: 'text', required: true },
  ],
}
