import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Configuration',
  },
  fields: [
    { name: 'businessName', type: 'text', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'address', type: 'textarea', required: true },
    { name: 'chaletAddress', type: 'text', required: true },
    { name: 'siret', type: 'text', required: true },
    { name: 'decennale', type: 'text', required: true },
    { name: 'yearsExperience', type: 'number', defaultValue: 15 },
  ],
}

