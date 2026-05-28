import { PublicSite } from '@/components/PublicSite'
import { getPublicSiteData } from '@/cms'

export default async function Page() {
  const data = await getPublicSiteData()

  return <PublicSite {...data} initialPath="/" />
}
