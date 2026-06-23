import { VisionHeader } from '@/components/dashboard/vision-header'
import { SeasonOverview } from '@/components/dashboard/season-overview'
import { WellnessHeatmap } from '@/components/dashboard/wellness-heatmap'
import { Reflections } from '@/components/dashboard/reflections'
import { getDashboardData } from '@/lib/dashboard-db'

export default async function DashboardPage() {
  const dashboardData = await getDashboardData()

  return (
    <main className="mx-auto mt-6 flex max-w-6xl flex-col gap-5 px-4">
      <VisionHeader data={dashboardData} />
      <SeasonOverview data={dashboardData} />
      <WellnessHeatmap data={dashboardData} />
      <Reflections data={dashboardData} />
    </main>
  )
}
