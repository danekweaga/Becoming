import { Moon, Zap } from 'lucide-react'
import { Heatmap } from '@/components/becoming/heatmap'
import {
  generateHeatmap,
  seasonStats,
  currentSeason,
  moodFor,
} from '@/lib/mock-data'
import { accentHue } from '@/components/becoming/gem'

function Metric({
  icon: Icon,
  emoji,
  label,
  value,
  max,
  suffix,
  hue,
}: {
  icon?: typeof Zap
  emoji?: string
  label: string
  value: number
  max: number
  suffix?: string
  hue: number
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/30 p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          {emoji ? (
            <span className="text-base leading-none" aria-hidden="true">
              {emoji}
            </span>
          ) : (
            Icon && (
              <Icon className="size-3.5" style={{ color: `oklch(0.82 0.1 ${hue})` }} />
            )
          )}
          {label}
        </span>
        <span className="font-serif text-lg">
          {value}
          {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full"
          style={{
            width: `${(value / max) * 100}%`,
            background: `oklch(0.82 0.1 ${hue})`,
          }}
        />
      </div>
    </div>
  )
}

export function WellnessHeatmap() {
  const days = generateHeatmap(26)
  const hue = accentHue[currentSeason.accent]
  const mood = moodFor(seasonStats.avgMood)
  return (
    <section className="space-y-5">
      <div className="glass rounded-3xl p-7">
        <div className="mb-6 text-center">
          <h2 className="font-serif text-xl font-medium tracking-tight">
            Your constellation of devotion
          </h2>
          <p className="text-sm text-muted-foreground">
            Every honored day, the last 26 weeks
          </p>
        </div>
        <Heatmap days={days} baseHue={hue} />
      </div>

      <div className="glass rounded-3xl p-7">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-serif text-xl font-medium tracking-tight">
            Wellness
          </h2>
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            mostly
            <span className="text-base leading-none" aria-hidden="true">
              {mood.emoji}
            </span>
            {mood.label.toLowerCase()}
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric
            emoji={mood.emoji}
            label="Avg. mood"
            value={seasonStats.avgMood}
            max={5}
            suffix=" / 5"
            hue={20}
          />
          <Metric
            icon={Zap}
            label="Avg. energy"
            value={seasonStats.avgEnergy}
            max={5}
            suffix=" / 5"
            hue={78}
          />
          <Metric
            icon={Moon}
            label="Avg. sleep"
            value={seasonStats.avgSleep}
            max={9}
            suffix=" hrs"
            hue={198}
          />
        </div>
      </div>
    </section>
  )
}
