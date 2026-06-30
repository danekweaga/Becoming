import { AppNav } from '@/components/becoming/app-nav'
import { getDashboardUserName } from '@/lib/dashboard-db'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userName = await getDashboardUserName()

  return (
    <div className="relative min-h-screen pb-16">
      <AppNav userName={userName} />
      {children}
    </div>
  )
}
