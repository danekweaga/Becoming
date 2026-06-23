import Link from 'next/link'
import { PenLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Gem, accentHue } from '@/components/becoming/gem'
import type { DashboardData } from '@/lib/dashboard-db'
import Strands from '@/components/becoming/strands'

type VisionHeaderProps = {
  data: DashboardData
}

export function VisionHeader({ data }: VisionHeaderProps) {
  const hue = accentHue[data.season.accent]
  return (
    <section className="glass-strong relative overflow-hidden rounded-[2rem] p-7 sm:p-10">
      {/* Refractive glass orb of woven light, drifting in the top-right */}
      <div
        className="pointer-events-none absolute -top-16 -right-10 size-[22rem] opacity-80"
        aria-hidden="true"
      >
        <Strands
          colors={['#EAB308', '#5FC9C2', '#E0809A']}
          count={5}
          speed={0.4}
          amplitude={1}
          glow={2.4}
          intensity={0.6}
          saturation={1.4}
          opacity={0.95}
          scale={1.6}
          glass
          refraction={1.1}
          dispersion={1.2}
          glassSize={1}
        />
      </div>
      <div
        className="pointer-events-none absolute -top-28 -right-16 size-72 rounded-full blur-3xl"
        style={{ background: `oklch(0.8 0.1 ${hue} / 0.18)` }}
        aria-hidden="true"
      />
      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs tracking-widest text-muted-foreground uppercase">
            {data.user.name}&apos;s year of {data.vision.word} · {data.vision.year}
          </p>
          <h1 className="mt-4 font-serif text-3xl leading-[1.15] font-light tracking-tight text-balance sm:text-4xl">
            &ldquo;{data.vision.statement}&rdquo;
          </h1>
          <div className="mt-5 flex flex-wrap gap-2">
            {data.vision.themes.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-card/40 px-3 py-1 text-xs text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-5 rounded-3xl border border-border bg-card/30 p-5">
          <Gem size={72} hue={hue} />
          <div>
            <p className="text-[11px] tracking-[0.2em] text-white uppercase">
              Current chapter · {data.season.symbol}
            </p>
            <p className="font-serif text-2xl font-medium tracking-tight">
              {data.season.name}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Day {data.stats.daysIn} of {data.stats.totalDays} ·{' '}
              {data.stats.gemLevel}
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-8 flex flex-wrap items-center gap-3">
        <Button
          className="gem-glow bg-primary text-primary-foreground hover:bg-primary/90"
          render={
            <Link href="/check-in">
              <PenLine className="size-4" />
              Today&apos;s check-in
            </Link>
          }
        />
        <Button
          variant="outline"
          className="border-border bg-card/30"
          render={<Link href="/wrapped">Preview this season&apos;s Becoming</Link>}
        />
      </div>
    </section>
  )
}
