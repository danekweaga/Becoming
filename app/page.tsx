import { MarketingNav } from '@/components/landing/marketing-nav'
import { Hero } from '@/components/landing/hero'
import { BecomingMarquee } from '@/components/landing/becoming-marquee'
import { FeatureFlow } from '@/components/landing/feature-flow'
import { SeasonRail } from '@/components/landing/season-rail'
import { ClosingCta } from '@/components/landing/closing-cta'
import GradualBlur from '@/components/becoming/gradual-blur'

export default function Page() {
  return (
    <main className="relative overflow-x-hidden">
      <MarketingNav />
      <Hero />
      <BecomingMarquee />
      <FeatureFlow />
      <SeasonRail />
      <ClosingCta />
      {/* Soft cinematic fade anchoring the bottom of the page */}
      <GradualBlur target="page" position="bottom" height="7rem" strength={2} divCount={6} curve="bezier" />
    </main>
  )
}
