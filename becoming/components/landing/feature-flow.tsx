import { Compass, CalendarRange, Flame, Sparkles } from 'lucide-react'

const steps = [
  {
    icon: Compass,
    kicker: 'Vision',
    title: 'Name who you are becoming',
    body: 'Begin with a single sentence and a word for the year. Everything else grows from it.',
    hue: 78,
  },
  {
    icon: CalendarRange,
    kicker: 'Seasons',
    title: 'Break the year into chapters',
    body: 'Four seasonal chapters, each with its own gemstone, focus, and intention.',
    hue: 198,
  },
  {
    icon: Flame,
    kicker: 'Devotion',
    title: 'Honor small daily acts',
    body: 'Track habits and wellness with rings, streaks, and a glowing contribution heatmap.',
    hue: 150,
  },
  {
    icon: Sparkles,
    kicker: 'Wrapped',
    title: 'Unlock cinematic recaps',
    body: 'Reach the end of a chapter and reveal “This Season’s Becoming” and your “Year of Becoming.”',
    hue: 20,
  },
]

export function FeatureFlow() {
  return (
    <section id="vision" className="relative mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs tracking-widest text-primary uppercase">
          The practice
        </p>
        <h2 className="mt-3 font-serif text-4xl font-light tracking-tight text-balance sm:text-5xl">
          A quieter way to grow
        </h2>
        <p className="mt-4 text-pretty text-muted-foreground">
          Four movements, one continuous arc — from intention to reflection.
        </p>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <div
            key={s.title}
            className="glass group relative flex flex-col rounded-3xl p-6 transition-transform duration-500 hover:-translate-y-1"
          >
            <span
              className="mb-5 grid size-11 place-items-center rounded-2xl"
              style={{
                background: `oklch(0.7 0.1 ${s.hue} / 0.16)`,
                boxShadow: `0 0 24px -6px oklch(0.7 0.1 ${s.hue} / 0.6)`,
              }}
            >
              <s.icon
                className="size-5"
                style={{ color: `oklch(0.82 0.1 ${s.hue})` }}
              />
            </span>
            <span className="text-xs tracking-widest text-muted-foreground uppercase">
              {`0${i + 1} · ${s.kicker}`}
            </span>
            <h3 className="mt-2 font-serif text-xl font-medium tracking-tight">
              {s.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
