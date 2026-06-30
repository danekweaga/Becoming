'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, Gem as GemIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Wordmark } from '@/components/becoming/wordmark'
import { Gem, accentHue } from '@/components/becoming/gem'
import { user, vision, currentSeason } from '@/lib/mock-data'
import { loadDemoDataAction, resetDemoDataAction } from '@/actions/demo'

const stops = [
  {
    href: '/onboarding',
    label: 'Onboarding',
    title: 'Set your vision',
    body: 'Answer “Who are you becoming?” and choose a word for the year.',
    hue: 78,
  },
  {
    href: '/season/new',
    label: 'Seasons',
    title: 'Open a chapter',
    body: 'Break the year into seasonal chapters with their own intentions and habits.',
    hue: 198,
  },
  {
    href: '/dashboard',
    label: 'Dashboard',
    title: 'Live the everyday',
    body: 'Progress rings, wellness, and a contribution heatmap of your devotion.',
    hue: 168,
  },
  {
    href: '/check-in',
    label: 'Check-in',
    title: 'The daily ritual',
    body: 'Honor habits, log how you felt, and seal the day with a reflection.',
    hue: 20,
  },
  {
    href: '/wrapped',
    label: 'Wrapped',
    title: 'Press play',
    body: 'Cinematic recaps: “This Season’s Becoming” and “Your Year of Becoming.”',
    hue: 286,
  },
]

export default function DemoPage() {
  return (
    <main className="relative min-h-screen px-4 py-6">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <Wordmark />
        <Button
          variant="ghost"
          size="sm"
          render={
            <Link href="/">
              <ArrowLeft className="size-4" />
              Home
            </Link>
          }
        />
      </div>

      <section className="mx-auto mt-10 max-w-3xl text-center">
        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-border/60 bg-card/40 px-4 py-1.5 text-xs tracking-widest text-muted-foreground uppercase backdrop-blur">
          <GemIcon className="size-3.5 text-primary" />
          Guided demo
        </div>
        <h1 className="mt-5 font-serif text-4xl font-light tracking-tight text-balance sm:text-5xl">
          Walk through {user.name}&apos;s year of becoming
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          Every screen is filled with realistic sample data. Follow the stops in
          order, or jump straight to the part you want to feel.
        </p>
      </section>

      <div className="glass-strong gem-glow mx-auto mt-10 flex max-w-3xl flex-col items-center gap-5 rounded-[2rem] p-8 text-center sm:flex-row sm:text-left">
        <Gem size={88} hue={accentHue[currentSeason.accent]} />
        <div className="flex-1">
          <p className="text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
            Now playing · {vision.year}
          </p>
          <p className="mt-2 font-serif text-2xl font-medium tracking-tight">
            “{vision.word}”
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {currentSeason.name} · a full season of real, database-backed
            devotion
          </p>
        </div>
        <Button
          size="lg"
          className="rounded-full"
          render={
            <Link href="/dashboard">
              Enter dashboard
              <ArrowRight className="size-4" />
            </Link>
          }
        />
      </div>

      {/* Demo controls — judges can load or reset Aurora data in one click. */}
      <div className="glass mx-auto mt-6 flex max-w-3xl flex-col items-center gap-4 rounded-3xl p-6 text-center sm:flex-row sm:text-left">
        <div className="flex-1">
          <p className="text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
            Demo data
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Load Daniel&apos;s preloaded year into AWS Aurora, or reset it to a
            clean slate. Everything you see is read live from the database.
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <form action={loadDemoDataAction}>
            <Button type="submit" className="rounded-full">
              Load demo data
            </Button>
          </form>
          <form action={resetDemoDataAction}>
            <Button type="submit" variant="outline" className="rounded-full">
              Reset
            </Button>
          </form>
        </div>
      </div>

      <ol className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stops.map((stop, i) => (
          <li key={stop.href}>
            <Link
              href={stop.href}
              className="glass group flex h-full flex-col rounded-3xl p-6 transition-transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <Gem size={52} hue={stop.hue} float={false} />
                <span className="font-serif text-3xl font-light text-muted-foreground/40">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <p className="mt-5 text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
                {stop.label}
              </p>
              <h2 className="mt-1.5 font-serif text-xl font-medium tracking-tight">
                {stop.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {stop.body}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm text-primary">
                Visit
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  )
}
