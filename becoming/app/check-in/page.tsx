'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Moon, Heart, Zap, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Gem } from '@/components/becoming/gem'
import Ferrofluid from '@/components/becoming/ferrofluid'
import { cn } from '@/lib/utils'
import { currentSeason, MOOD_SCALE } from '@/lib/mock-data'

const today = new Date('2026-06-15').toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
})

export default function CheckInPage() {
  const [mood, setMood] = useState(4)
  const [energy, setEnergy] = useState([4])
  const [sleep, setSleep] = useState([7.5])
  const [done, setDone] = useState<string[]>([
    currentSeason.habits[0].id,
    currentSeason.habits[2].id,
  ])
  const [gratitude, setGratitude] = useState('')
  const [reflection, setReflection] = useState('')
  const [sealed, setSealed] = useState(false)

  const toggle = (id: string) =>
    setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]))

  if (sealed) {
    return (
      <main className="relative mx-auto flex min-h-[80vh] max-w-xl flex-col items-center justify-center overflow-hidden px-4 text-center">
        {/* Magnetic gem-fluid swell behind the sealed day */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-70 [mask-image:radial-gradient(ellipse_60%_55%_at_50%_45%,black,transparent_75%)]"
          aria-hidden="true"
        >
          <Ferrofluid
            colors={['#EAB308', '#F0C674', '#5FC9C2']}
            speed={0.4}
            scale={1.5}
            glow={2.2}
            rimWidth={0.22}
            flowDirection="up"
            opacity={0.9}
            mouseStrength={1.2}
          />
        </div>
        <div className="animate-rise">
          <Gem size={120} hue={78} />
        </div>
        <h1 className="animate-rise mt-8 font-serif text-4xl font-light tracking-tight text-balance">
          Today is sealed.
        </h1>
        <p className="animate-rise mt-4 max-w-md text-pretty text-muted-foreground">
          {done.length} habit{done.length === 1 ? '' : 's'} honored. One more
          quiet day toward who you&apos;re becoming.
        </p>
        <div className="animate-rise mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            className="gem-glow bg-primary text-primary-foreground hover:bg-primary/90"
            render={<Link href="/dashboard">Back to dashboard</Link>}
          />
          <Button
            variant="outline"
            className="border-border bg-card/30"
            render={<Link href="/wrapped">See this season&apos;s arc</Link>}
          />
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto mt-6 max-w-2xl px-4">
      <div className="text-center">
        <p className="text-xs tracking-widest text-primary uppercase">{today}</p>
        <h1 className="mt-3 font-serif text-4xl font-light tracking-tight text-balance">
          How did today feel?
        </h1>
        <p className="mt-3 text-pretty text-muted-foreground">
          A small ritual. Honest, unhurried, just for you.
        </p>
      </div>

      <div className="mt-10 space-y-5">
        {/* mood */}
        <div className="glass rounded-3xl p-6">
          <Label className="text-sm">
            <Heart className="mr-1.5 inline size-3.5 text-primary" />
            Mood
          </Label>
          <div className="mt-4 flex justify-between gap-2">
            {MOOD_SCALE.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(m.value)}
                aria-pressed={mood === m.value}
                className={cn(
                  'flex flex-1 flex-col items-center gap-2 rounded-2xl border py-4 transition-all',
                  mood === m.value
                    ? 'border-primary/40 bg-primary/12'
                    : 'border-border bg-card/30 hover:bg-card/60',
                )}
              >
                <span
                  className={cn(
                    'text-3xl transition-all duration-300',
                    mood === m.value
                      ? 'scale-110 drop-shadow-[0_0_12px_oklch(0.82_0.12_78_/_0.5)]'
                      : 'opacity-60 grayscale',
                  )}
                  aria-hidden="true"
                >
                  {m.emoji}
                </span>
                <span
                  className={cn(
                    'text-xs',
                    mood === m.value ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {m.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* energy + sleep */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="glass rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <Label className="text-sm">
                <Zap className="mr-1.5 inline size-3.5 text-primary" />
                Energy
              </Label>
              <span className="font-serif text-2xl">{energy[0]}</span>
            </div>
            <Slider
              value={energy}
              onValueChange={setEnergy}
              min={1}
              max={5}
              step={1}
              className="mt-5"
            />
          </div>
          <div className="glass rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <Label className="text-sm">
                <Moon className="mr-1.5 inline size-3.5 text-primary" />
                Sleep
              </Label>
              <span className="font-serif text-2xl">
                {sleep[0]}
                <span className="text-sm text-muted-foreground">h</span>
              </span>
            </div>
            <Slider
              value={sleep}
              onValueChange={setSleep}
              min={0}
              max={12}
              step={0.5}
              className="mt-5"
            />
          </div>
        </div>

        {/* habits */}
        <div className="glass rounded-3xl p-6">
          <Label className="text-sm">
            <Sparkles className="mr-1.5 inline size-3.5 text-primary" />
            Habits honored today
          </Label>
          <div className="mt-4 space-y-2.5">
            {currentSeason.habits.map((h) => {
              const active = done.includes(h.id)
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => toggle(h.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all',
                    active
                      ? 'border-primary/40 bg-primary/10'
                      : 'border-border bg-card/30 hover:bg-card/60',
                  )}
                >
                  <span
                    className={cn(
                      'grid size-6 shrink-0 place-items-center rounded-full border transition-all',
                      active
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border',
                    )}
                  >
                    {active && <Check className="size-3.5" />}
                  </span>
                  <span className={cn('flex-1 text-sm', active ? 'text-foreground' : 'text-muted-foreground')}>
                    {h.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {h.cadence}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* words */}
        <div className="glass space-y-5 rounded-3xl p-6">
          <div className="space-y-2">
            <Label htmlFor="gratitude" className="text-sm">
              One thing you&apos;re grateful for
            </Label>
            <Textarea
              id="gratitude"
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              rows={2}
              placeholder="A quiet morning, a kind word, the light at 6pm…"
              className="resize-none bg-background/40"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reflection" className="text-sm">
              A reflection on today
            </Label>
            <Textarea
              id="reflection"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={4}
              placeholder="What did today teach you about who you're becoming?"
              className="resize-none bg-background/40 leading-relaxed"
            />
          </div>
        </div>

        <Button
          onClick={() => setSealed(true)}
          size="lg"
          className="gem-glow h-12 w-full bg-primary text-base text-primary-foreground hover:bg-primary/90"
        >
          Seal today
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </main>
  )
}
