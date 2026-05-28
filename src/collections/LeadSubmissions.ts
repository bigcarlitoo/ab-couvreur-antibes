import type { CollectionConfig } from 'payload'

import { authenticated } from '../access'

export const LeadSubmissions: CollectionConfig = {
  slug: 'lead-submissions',
  access: {
    create: () => true,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'phone', 'city', 'service', 'createdAt'],
    group: 'Prospection',
    useAsTitle: 'name',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'email', type: 'email' },
    { name: 'city', type: 'text' },
    { name: 'service', type: 'text' },
    { name: 'urgency', type: 'text' },
    { name: 'roofType', type: 'text' },
    { name: 'description', type: 'textarea', required: true },
    {
      name: 'photoNames',
      type: 'array',
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    { name: 'gdpr', type: 'checkbox', defaultValue: false },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'nouveau',
      options: [
        { label: 'Nouveau', value: 'nouveau' },
        { label: 'Contacté', value: 'contacte' },
        { label: 'Devis envoyé', value: 'devis-envoye' },
        { label: 'Perdu', value: 'perdu' },
      ],
    },
  ],
  timestamps: true,
}
