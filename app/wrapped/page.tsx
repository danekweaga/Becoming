import { WrappedClient } from '@/components/wrapped/wrapped-client'
import { getWrappedData } from '@/lib/dashboard-db'

export const dynamic = 'force-dynamic'

export default async function WrappedPage() {
  const data = await getWrappedData()

  return <WrappedClient data={data} />
}
