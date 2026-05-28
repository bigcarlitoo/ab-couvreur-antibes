import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Faqs } from './collections/Faqs'
import { LeadSubmissions } from './collections/LeadSubmissions'
import { Realisations } from './collections/Realisations'
import { Services } from './collections/Services'
import { Testimonials } from './collections/Testimonials'
import { Users } from './collections/Users'
import { Zones } from './collections/Zones'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Services, Zones, Realisations, Testimonials, Faqs, LeadSubmissions, Users],
  db: sqliteAdapter({
    client: {
      // Local dev → persistent SQLite file.
      // Vercel/serverless → /tmp (writable but ephemeral). The public site never
      // touches Payload at runtime (see src/cms.ts), so the ephemeral DB is fine.
      url:
        process.env.DATABASE_URI ||
        (process.env.VERCEL ? 'file:/tmp/payload.db' : 'file:./payload.db'),
    },
  }),
  editor: lexicalEditor(),
  globals: [SiteSettings],
  secret: process.env.PAYLOAD_SECRET || 'ab-couvreur-antibes-v2-local-secret',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
