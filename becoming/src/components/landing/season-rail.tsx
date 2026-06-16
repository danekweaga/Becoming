import { Gem, accentHue } from '@/components/becoming/gem'
import { seasons } from '@/lib/mock-data'

export function SeasonRail() {
  return (
    <section id="seasons" className="relative mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs tracking-widest text-primary uppercase">
          Seasonal chapters
        </p>
        <h2 className="mt-3 font-serif text-4xl font-light tracking-tight text-balance sm:text-5xl">
          Each season is a gemstone
        </h2>
        <p className="mt-4 text-pretty text-muted-foreground">
          A full turn of the wheel — four chapters, each with its own light.
        </p>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {seasons.map((s) => (
          <article
            key={s.id}
            className="glass relative flex flex-col items-center overflow-hidden rounded-3xl p-7 text-center"
          >
            <Gem size={72} hue={accentHue[s.accent]} float={false} />
            <span className="mt-5 text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
              {s.symbol}
            </span>
            <h3 className="mt-1 font-serif text-2xl font-medium tracking-tight">
              {s.name}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {s.intention}
            </p>
            <span
              className="mt-5 rounded-full px-3 py-1 text-[11px] tracking-wide uppercase"
              style={{
                background: `oklch(0.7 0.1 ${accentHue[s.accent]} / 0.14)`,
                color: `oklch(0.82 0.1 ${accentHue[s.accent]})`,
              }}
            >
              {s.focus}
            </span>
          </article>
        ))}
      </div>
    </section>
  )
}
