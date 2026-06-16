import { cn } from '@/lib/utils'
import type { HeatmapDay } from '@/lib/mock-data'

interface HeatmapProps {
  days: HeatmapDay[]
  className?: string
  baseHue?: number // oklch hue for the glow
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

function levelStyle(level: number, hue: number): React.CSSProperties {
  if (level <= 0) {
    return { background: 'oklch(0.95 0.02 90 / 0.05)' }
  }
  const lightness = 0.42 + level * 0.1
  const chroma = 0.05 + level * 0.022
  const alpha = 0.35 + level * 0.16
  return {
    background: `oklch(${lightness} ${chroma} ${hue} / ${alpha})`,
    boxShadow:
      level >= 4
        ? `0 0 10px -1px oklch(${lightness} ${chroma} ${hue} / 0.7)`
        : undefined,
  }
}

export function Heatmap({ days, className, baseHue = 78 }: HeatmapProps) {
  // Build week columns (each column = 7 days, Sun..Sat)
  const weeks: HeatmapDay[][] = []
  let current: HeatmapDay[] = []
  days.forEach((d, i) => {
    current.push(d)
    if (current.length === 7 || i === days.length - 1) {
      weeks.push(current)
      current = []
    }
  })

  // month labels aligned to week columns
  const monthLabels = weeks.map((week, i) => {
    const first = week[0]
    const date = new Date(first.date)
    const isMonthStart = date.getDate() <= 7
    const prev = i > 0 ? new Date(weeks[i - 1][0].date).getMonth() : -1
    if (isMonthStart && date.getMonth() !== prev) {
      return MONTHS[date.getMonth()]
    }
    return ''
  })

  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-center overflow-x-auto pb-1">
        <div className="inline-flex flex-col gap-2">
          <div className="flex gap-[7px] pl-0.5 text-[11px] text-muted-foreground">
            {monthLabels.map((m, i) => (
              <div key={i} className="w-[20px] shrink-0">
                {m}
              </div>
            ))}
          </div>
          <div className="flex gap-[7px]">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[7px]">
                {week.map((d) => (
                  <button
                    type="button"
                    key={d.date}
                    title={`${d.date} — ${d.count} honored`}
                    aria-label={`${d.date}: ${d.count} habits honored`}
                    className="size-[20px] cursor-pointer rounded-[5px] ring-1 ring-inset ring-[oklch(0.95_0.02_90_/_0.06)] transition-transform duration-200 ease-out hover:translate-y-1 hover:scale-110 focus-visible:ring-2 focus-visible:ring-primary active:-translate-y-2 active:scale-125"
                    style={levelStyle(d.level, baseHue)}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-end gap-2 text-[11px] text-muted-foreground">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((l) => (
              <div
                key={l}
                className="size-[14px] rounded-[4px]"
                style={levelStyle(l, baseHue)}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  )
}
