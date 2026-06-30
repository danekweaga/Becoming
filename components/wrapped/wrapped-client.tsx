'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Wordmark } from '@/components/becoming/wordmark'
import { Gem, accentHue } from '@/components/becoming/gem'
import { WrappedStory, type Slide } from '@/components/wrapped/wrapped-story'
import Strands from '@/components/becoming/strands'
import { wrappedStats, wrappedMoments } from '@/lib/mock-data'
import type { WrappedData } from '@/lib/dashboard-db'

const YEAR_HUE = accentHue.rose

export function WrappedClient({ data }: { data: WrappedData }) {
  const [mode, setMode] = useState<'choose' | 'season' | 'year'>('choose')

  const card = (type: string) =>
    data.cards.find((entry) => entry.cardType === type)

  const seasonHue = accentHue[data.season.accent] ?? 78

  const seasonSlides: Slide[] = [
    {
      kind: 'intro',
      hue: seasonHue,
      kicker: `${data.season.symbol} · Season recap`,
      title: 'This Season’s Becoming',
      body: `${data.season.name} — ${data.season.daysIn} days of showing up.`,
    },
    {
      kind: 'stat',
      hue: 198,
      stat: {
        label: 'Season score',
        value: card('season_score')?.value ?? `${data.season.seasonScore}%`,
        caption: data.season.gemLevel,
      },
    },
    {
      kind: 'stat',
      hue: 78,
      stat: {
        label: 'Best streak',
        value: card('best_streak')?.value ?? '—',
        caption: 'days of devotion, unbroken',
      },
    },
    {
      kind: 'stat',
      hue: 20,
      stat: {
        label: 'Total focus time',
        value: card('focus_hours')?.value ?? '—',
        caption: 'hours of quiet, deep work',
      },
    },
    {
      kind: 'moment',
      hue: seasonHue,
      symbol: data.season.symbol,
      kicker: 'Strongest habit',
      title: card('strongest_habit')?.value ?? 'Your strongest habit',
      body: card('strongest_habit')?.description ?? '',
    },
    {
      kind: 'moment',
      hue: 168,
      symbol: data.season.symbol,
      kicker: 'Most improved',
      title: card('most_improved_category')?.value ?? 'Most improved area',
      body: card('most_improved_category')?.description ?? '',
    },
    {
      kind: 'moment',
      hue: 286,
      symbol: data.season.symbol,
      kicker: 'Mood pattern',
      title: 'How it felt',
      body: card('mood_pattern')?.description ?? '',
    },
    {
      kind: 'finale',
      hue: 78,
      title: card('final_message')?.value ?? 'You stayed devoted.',
      body:
        card('final_message')?.description ??
        'The season isn’t over — but you’re already becoming who you set out to be.',
    },
  ]

  const yearSlides: Slide[] = [
    {
      kind: 'intro',
      hue: YEAR_HUE,
      kicker: `${data.vision.year} · Year recap`,
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
      hue: YEAR_HUE,
      kicker: 'Your word for the year was',
      title: data.vision.word,
      body: 'And you lived it — one quiet day at a time.',
    },
    {
      kind: 'finale',
      hue: YEAR_HUE,
      title: 'This is who you became.',
      body: data.vision.statement,
    },
  ]

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
    <main className="relative min-h-screen overflow-hidden px-4 py-6">
      {/* Cinematic woven-light backdrop (WebGL strands) */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] opacity-50 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent_75%)]"
        aria-hidden="true"
      >
        <Strands
          colors={['#E8C36B', '#5FC9C2', '#E0809A']}
          count={5}
          speed={0.4}
          amplitude={1.1}
          waviness={1.2}
          thickness={0.6}
          glow={2.4}
          intensity={0.5}
          saturation={1.2}
          opacity={0.9}
          scale={1.6}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-5xl items-center justify-between">
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

      <div className="relative mx-auto mt-10 max-w-4xl text-center">
        <p className="text-xs tracking-widest text-primary uppercase">Recaps</p>
        <h1 className="mt-3 font-serif text-4xl font-light tracking-tight text-balance sm:text-5xl">
          Press play on your becoming
        </h1>
        <p className="mx-auto mt-3 max-w-md text-pretty text-muted-foreground">
          Cinematic recaps that turn your quiet, daily devotion into a story
          worth sitting with.
        </p>
      </div>

      <div className="relative mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setMode('season')}
          className="glass-strong gem-glow-teal group flex flex-col items-center rounded-[2rem] p-10 text-center transition-transform hover:-translate-y-1"
        >
          <Gem size={96} hue={seasonHue} />
          <p className="mt-6 text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
            {data.season.symbol}
          </p>
          <h2 className="mt-2 font-serif text-2xl font-medium tracking-tight">
            This Season&apos;s Becoming
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {data.season.name} · {data.season.daysIn} days in
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
          <Gem size={96} hue={YEAR_HUE} />
          <p className="mt-6 text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
            {data.vision.year}
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
