import { MarketingNav } from '@/components/landing/marketing-nav'
import { Hero } from '@/components/landing/hero'
import { FeatureFlow } from '@/components/landing/feature-flow'
import { SeasonRail } from '@/components/landing/season-rail'
import { ClosingCta } from '@/components/landing/closing-cta'

export default function Page() {
  return (
    <main className="relative overflow-x-hidden">
      <MarketingNav />
      <Hero />
      <FeatureFlow />
      <SeasonRail />
      <ClosingCta />
    </main>
  )
}
