import { VisionHeader } from '@/components/dashboard/vision-header'
import { SeasonOverview } from '@/components/dashboard/season-overview'
import { WellnessHeatmap } from '@/components/dashboard/wellness-heatmap'
import { Reflections } from '@/components/dashboard/reflections'

export default function DashboardPage() {
  return (
    <main className="mx-auto mt-6 flex max-w-6xl flex-col gap-5 px-4">
      <VisionHeader />
      <SeasonOverview />
      <WellnessHeatmap />
      <Reflections />
    </main>
  )
}
