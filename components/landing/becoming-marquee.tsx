'use client'

import LogoLoop, { type LogoItem } from '@/components/becoming/logo-loop'

const WORDS = [
  'Discipline',
  'Stillness',
  'Devotion',
  'Courage',
  'Patience',
  'Clarity',
  'Presence',
  'Strength',
  'Wonder',
  'Resolve',
  'Grace',
  'Becoming',
]

const items: LogoItem[] = WORDS.map((word) => ({
  node: (
    <span className="flex items-center gap-5 font-serif text-2xl font-light tracking-tight text-muted-foreground/70 italic sm:text-3xl">
      {word}
      <span
        className="size-1.5 rotate-45 rounded-[2px] bg-primary/60"
        aria-hidden="true"
      />
    </span>
  ),
  title: word,
}))

export function BecomingMarquee() {
  return (
    <section
      aria-label="Qualities of becoming"
      className="relative border-y border-border/60 py-10"
    >
      <div className="relative h-12 overflow-hidden">
        <LogoLoop
          logos={items}
          speed={36}
          direction="left"
          logoHeight={36}
          gap={56}
          fadeOut
          ariaLabel="A drifting band of qualities to grow into"
        />
      </div>
    </section>
  )
}
