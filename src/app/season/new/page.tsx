'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Plus, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Gem } from '@/components/becoming/gem'
import { Wordmark } from '@/components/becoming/wordmark'
import { cn } from '@/lib/utils'

const ACCENTS = [
  { key: 'gold', label: 'Citrine', hue: 78 },
  { key: 'teal', label: 'Aquamarine', hue: 198 },
  { key: 'sage', label: 'Jade', hue: 150 },
  { key: 'rose', label: 'Amber', hue: 20 },
  { key: 'iris', label: 'Onyx', hue: 280 },
] as const

export default function NewSeasonPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [accent, setAccent] = useState<(typeof ACCENTS)[number]>(ACCENTS[0])
  const [focus, setFocus] = useState('')
  const [intention, setIntention] = useState('')
  const [habits, setHabits] = useState<string[]>([
    'Move my body',
    'Morning pages',
  ])
  const [draft, setDraft] = useState('')

  const addHabit = () => {
    const v = draft.trim()
    if (v && habits.length < 6) {
      setHabits((h) => [...h, v])
      setDraft('')
    }
  }
  const removeHabit = (i: number) =>
    setHabits((h) => h.filter((_, idx) => idx !== i))

  const ready = name.trim() && focus.trim() && intention.trim()

  return (
    <main className="relative min-h-screen px-4 py-6">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <Wordmark />
        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/dashboard">Skip</Link>}
        />
      </div>

      <div className="mx-auto mt-8 max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs tracking-widest text-primary uppercase">
            New chapter
          </p>
          <h1 className="mt-3 font-serif text-4xl font-light tracking-tight text-balance sm:text-5xl">
            Shape your season
          </h1>
          <p className="mt-3 text-pretty text-muted-foreground">
            A season is a chapter of your year — a focus, an intention, and a
            handful of habits to honor.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* form */}
          <div className="glass-strong space-y-7 rounded-3xl p-8">
            <div className="space-y-2">
              <Label htmlFor="sname">Season name</Label>
              <Input
                id="sname"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="The Ascent, First Light, The Quiet Forge…"
                className="h-11 bg-background/40 font-serif text-lg"
              />
            </div>

            <div className="space-y-3">
              <Label>Gemstone &amp; light</Label>
              <div className="flex flex-wrap gap-3">
                {ACCENTS.map((a) => (
                  <button
                    key={a.key}
                    type="button"
                    onClick={() => setAccent(a)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 rounded-2xl border px-4 py-3 transition-all',
                      accent.key === a.key
                        ? 'border-primary/40 bg-primary/10'
                        : 'border-border bg-card/30 hover:bg-card/60',
                    )}
                  >
                    <Gem size={40} hue={a.hue} float={false} />
                    <span className="text-[11px] tracking-wide text-muted-foreground">
                      {a.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="focus">Focus</Label>
                <Input
                  id="focus"
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                  placeholder="Expansion"
                  className="h-11 bg-background/40"
                />
              </div>
              <div className="space-y-2">
                <Label>Length</Label>
                <div className="flex h-11 items-center rounded-lg border border-border bg-background/40 px-3 text-sm text-muted-foreground">
                  ~ 13 weeks (one quarter)
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="intention">Intention</Label>
              <Textarea
                id="intention"
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                rows={3}
                placeholder="Go further while staying soft."
                className="resize-none bg-background/40 leading-relaxed"
              />
            </div>

            <div className="space-y-3">
              <Label>Habits to honor</Label>
              <div className="flex flex-wrap gap-2">
                {habits.map((h, i) => (
                  <span
                    key={`${h}-${i}`}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 py-1.5 pr-2 pl-3.5 text-sm"
                  >
                    {h}
                    <button
                      type="button"
                      onClick={() => removeHabit(i)}
                      className="grid size-5 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                      aria-label={`Remove ${h}`}
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHabit())}
                  placeholder="Add a habit and press enter"
                  className="h-10 bg-background/40"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={addHabit}
                  className="size-10 shrink-0 border-border bg-card/30"
                  aria-label="Add habit"
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* live preview */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <p className="mb-3 flex items-center gap-2 text-xs tracking-widest text-muted-foreground uppercase">
              <Sparkles className="size-3.5 text-primary" /> Live preview
            </p>
            <div
              className="glass-strong relative flex flex-col items-center overflow-hidden rounded-[2rem] p-10 text-center"
              style={{
                boxShadow: `0 0 0 1px oklch(0.8 0.1 ${accent.hue} / 0.25), 0 30px 80px -40px oklch(0.8 0.1 ${accent.hue} / 0.6)`,
              }}
            >
              <div
                className="pointer-events-none absolute -top-20 left-1/2 size-60 -translate-x-1/2 rounded-full blur-3xl"
                style={{ background: `oklch(0.8 0.1 ${accent.hue} / 0.25)` }}
                aria-hidden="true"
              />
              <Gem size={96} hue={accent.hue} />
              <span className="relative mt-6 text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
                {accent.label}
                {focus ? ` · ${focus}` : ''}
              </span>
              <h2 className="relative mt-2 font-serif text-3xl font-medium tracking-tight">
                {name || 'Your season'}
              </h2>
              <p className="relative mt-3 max-w-xs text-sm leading-relaxed text-pretty text-muted-foreground">
                {intention || 'Your intention will appear here as you write it.'}
              </p>
              <div className="relative mt-6 flex flex-wrap justify-center gap-2">
                {habits.map((h, i) => (
                  <span
                    key={`p-${h}-${i}`}
                    className="rounded-full px-3 py-1 text-[11px]"
                    style={{
                      background: `oklch(0.7 0.1 ${accent.hue} / 0.14)`,
                      color: `oklch(0.85 0.09 ${accent.hue})`,
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <Button
              onClick={() => router.push('/dashboard')}
              disabled={!ready}
              size="lg"
              className="gem-glow mt-5 h-12 w-full bg-primary text-base text-primary-foreground hover:bg-primary/90"
            >
              Begin this season
              <ArrowRight className="size-4" />
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              You can revise your season at any time.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
