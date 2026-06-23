import { Quote } from 'lucide-react'
import { moodFor } from '@/lib/mock-data'
import type { DashboardData } from '@/lib/dashboard-db'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

type ReflectionsProps = {
  data: DashboardData
}

export function Reflections({ data }: ReflectionsProps) {
  return (
    <section className="glass rounded-3xl p-7">
      <h2 className="mb-5 font-serif text-xl font-medium tracking-tight">
        Recent reflections
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {data.recentLogs.map((log) => (
          <article
            key={log.id}
            className="flex flex-col rounded-2xl border border-border bg-card/30 p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {formatDate(log.date)}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/12 px-2.5 py-0.5 text-[11px] text-primary">
                <span className="text-sm leading-none" aria-hidden="true">
                  {moodFor(log.mood).emoji}
                </span>
                {moodFor(log.mood).label}
              </span>
            </div>
            <Quote className="mb-2 size-4 text-primary/60" />
            <p className="flex-1 text-sm leading-relaxed text-pretty text-foreground/90">
              {log.reflection}
            </p>
            <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
              <span className="text-foreground/70">Grateful for </span>
              {log.gratitude}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
