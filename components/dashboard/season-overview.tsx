import { Flame } from 'lucide-react'
import { ProgressRing } from '@/components/becoming/progress-ring'
import type { DashboardData } from '@/lib/dashboard-db'
import { accentHue } from '@/components/becoming/gem'

const HABIT_HUES: Record<string, number> = {
  gold: 78,
  teal: 198,
  sage: 150,
  rose: 20,
  iris: 280,
}

type SeasonOverviewProps = {
  data: DashboardData
}

export function SeasonOverview({ data }: SeasonOverviewProps) {
  const seasonHue = accentHue[data.season.accent]
  const { seasonScore, habitsHonored, longestStreak, habitCompletionRates } =
    data.stats
  return (
    <section className="grid gap-5 lg:grid-cols-[320px_1fr]">
      {/* season score ring */}
      <div className="glass flex flex-col items-center justify-center rounded-3xl p-8 text-center">
        <ProgressRing
          value={seasonScore / 100}
          size={168}
          strokeWidth={11}
          color={`oklch(0.83 0.11 ${seasonHue})`}
        >
          <span className="font-serif text-4xl font-medium">
            {Math.round(seasonScore)}%
          </span>
          <span className="text-xs tracking-wide text-muted-foreground">
            season score
          </span>
        </ProgressRing>
        <p className="mt-4 text-sm text-primary">{data.stats.gemLevel}</p>
        <div className="mt-6 grid w-full grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-card/30 p-3">
            <p className="font-serif text-2xl">{habitsHonored}</p>
            <p className="text-[11px] text-muted-foreground">habits honored</p>
          </div>
          <div className="rounded-2xl border border-border bg-card/30 p-3">
            <p className="flex items-center justify-center gap-1 font-serif text-2xl">
              <Flame className="size-4 text-primary" />
              {longestStreak}
            </p>
            <p className="text-[11px] text-muted-foreground">longest streak</p>
          </div>
        </div>
      </div>

      {/* habits */}
      <div className="glass rounded-3xl p-7">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-xl font-medium tracking-tight">
            Habits this season
          </h2>
          <span className="text-xs text-muted-foreground">
            {data.season.habits.length} rituals
          </span>
        </div>
        <ul className="divide-y divide-border">
          {data.season.habits.map((h) => {
            const hue = HABIT_HUES[h.accent] ?? 78
            const completionRate = habitCompletionRates[h.id] ?? 0
            return (
              <li key={h.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                <ProgressRing
                  value={completionRate}
                  size={52}
                  strokeWidth={5}
                  color={`oklch(0.82 0.1 ${hue})`}
                >
                  <span className="text-[11px] font-medium">
                    {Math.round(completionRate * 100)}
                  </span>
                </ProgressRing>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{h.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {h.cadence === 'daily'
                      ? `${h.target} ${h.unit} · daily`
                      : `${h.target} ${h.unit} · weekly`}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5 text-right">
                  <Flame
                    className="size-3.5"
                    style={{ color: `oklch(0.82 0.1 ${hue})` }}
                  />
                  <span className="font-serif text-base tabular-nums">
                    {h.streak}
                  </span>
                  <span className="text-xs text-muted-foreground">days</span>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
