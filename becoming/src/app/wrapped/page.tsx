'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Wordmark } from '@/components/becoming/wordmark'
import { Gem } from '@/components/becoming/gem'
import { WrappedStory, type Slide } from '@/components/wrapped/wrapped-story'
import {
  vision,
  currentSeason,
  seasonStats,
  wrappedStats,
  wrappedMoments,
} from '@/lib/mock-data'
import { accentHue } from '@/components/becoming/gem'

const seasonSlides: Slide[] = [
  {
    kind: 'intro',
    hue: accentHue[currentSeason.accent],
    kicker: `${currentSeason.symbol} · Season recap`,
    title: 'This Season’s Becoming',
    body: `${currentSeason.name} — ${seasonStats.daysIn} days of showing up.`,
  },
  {
    kind: 'stat',
    hue: 78,
    stat: { label: 'Habits honored', value: `${seasonStats.habitsHonored}`, caption: 'small acts, quietly compounding' },
  },
  {
    kind: 'stat',
    hue: 20,
    stat: { label: 'Longest streak', value: `${seasonStats.longestStreak}`, caption: 'days of devotion, unbroken' },
  },
  {
    kind: 'stat',
    hue: 198,
    stat: { label: 'Consistency', value: `${Math.round(seasonStats.consistency * 100)}%`, caption: 'of days you kept your word' },
  },
  {
    kind: 'moment',
    hue: accentHue[currentSeason.accent],
    symbol: currentSeason.symbol,
    kicker: currentSeason.focus,
    title: currentSeason.intention,
    body: currentSeason.narrative,
  },
  {
    kind: 'finale',
    hue: 78,
    title: 'You stayed devoted.',
    body: 'The season isn’t over — but you’re already becoming who you set out to be.',
  },
]

const yearSlides: Slide[] = [
  {
    kind: 'intro',
    hue: 78,
    kicker: `${vision.year} · Year recap`,
    title: 'Your Year of Becoming',
    body: 'A full turn of the wheel. Here’s who you became.',
  },
  ...wrappedStats.slice(0, 3).map(
    (stat, i): Slide => ({
      kind: 'stat',
      hue: [78, 198, 20][i],
      stat,
    }),
  ),
  ...wrappedMoments.map(
    (m): Slide => ({
      kind: 'moment',
      hue: accentHue[m.accent],
      symbol: m.symbol,
      kicker: m.season,
      title: m.headline,
      body: m.body,
    }),
  ),
  {
    kind: 'word',
    hue: 78,
    kicker: 'Your word for the year was',
    title: vision.word,
    body: 'And you lived it — one quiet day at a time.',
  },
  {
    kind: 'finale',
    hue: 78,
    title: 'This is who you became.',
    body: vision.statement,
  },
]

export default function WrappedPage() {
  const [mode, setMode] = useState<'choose' | 'season' | 'year'>('choose')

  if (mode === 'season') {
    return (
      <main className="min-h-screen px-4 py-4">
        <WrappedStory slides={seasonSlides} title="This Season's Becoming" />
      </main>
    )
  }
  if (mode === 'year') {
    return (
      <main className="min-h-screen px-4 py-4">
        <WrappedStory slides={yearSlides} title="Your Year of Becoming" />
      </main>
    )
  }

  return (
    <main className="relative min-h-screen px-4 py-6">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <Wordmark />
        <Button
          variant="ghost"
          size="sm"
          render={
            <Link href="/dashboard">
              <ArrowLeft className="size-4" />
              Dashboard
            </Link>
          }
        />
      </div>

      <div className="mx-auto mt-10 max-w-4xl text-center">
        <p className="text-xs tracking-widest text-primary uppercase">Recaps</p>
        <h1 className="mt-3 font-serif text-4xl font-light tracking-tight text-balance sm:text-5xl">
          Press play on your becoming
        </h1>
        <p className="mx-auto mt-3 max-w-md text-pretty text-muted-foreground">
          Cinematic recaps that turn your quiet, daily devotion into a story
          worth sitting with.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setMode('season')}
          className="glass-strong gem-glow-teal group flex flex-col items-center rounded-[2rem] p-10 text-center transition-transform hover:-translate-y-1"
        >
          <Gem size={96} hue={accentHue[currentSeason.accent]} />
          <p className="mt-6 text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
            {currentSeason.symbol}
          </p>
          <h2 className="mt-2 font-serif text-2xl font-medium tracking-tight">
            This Season&apos;s Becoming
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {currentSeason.name} · {seasonStats.daysIn} days in
          </p>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-2 text-sm text-primary">
            <Play className="size-3.5" /> Play recap
          </span>
        </button>

        <button
          type="button"
          onClick={() => setMode('year')}
          className="glass-strong gem-glow group flex flex-col items-center rounded-[2rem] p-10 text-center transition-transform hover:-translate-y-1"
        >
          <Gem size={96} hue={78} />
          <p className="mt-6 text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
            {vision.year}
          </p>
          <h2 className="mt-2 font-serif text-2xl font-medium tracking-tight">
            Your Year of Becoming
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Four seasons · a full year of devotion
          </p>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-2 text-sm text-primary">
            <Play className="size-3.5" /> Play recap
          </span>
        </button>
      </div>
    </main>
  )
}
