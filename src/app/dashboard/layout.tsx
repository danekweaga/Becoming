import { AppNav } from '@/components/becoming/app-nav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen pb-16">
      <AppNav />
      {children}
    </div>
  )
}
