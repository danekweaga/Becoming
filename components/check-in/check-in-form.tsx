'use client'

import { useState } from 'react'
import { Check, Moon, Heart, Zap, Sparkles, Droplet, Timer, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { MOOD_SCALE } from '@/lib/mock-data'
import { submitCheckin } from '@/actions/check-in'
import type { CheckinHabit } from '@/lib/dashboard-db'

export function CheckInForm({ habits }: { habits: CheckinHabit[] }) {
  const [mood, setMood] = useState(4)
  const [energy, setEnergy] = useState([4])
  const [focus, setFocus] = useState([60])
  const [water, setWater] = useState([6])
  const [done, setDone] = useState<string[]>(
    habits.slice(0, 2).map((h) => h.id),
  )
  const [reflection, setReflection] = useState('')
  const [gratitude, setGratitude] = useState('')

  const toggle = (id: string) =>
    setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]))

  return (
    <form action={submitCheckin} className="mt-10 space-y-5">
      {/* Hidden inputs mirror the interactive state for the server action. */}
      <input type="hidden" name="mood" value={mood} />
      <input type="hidden" name="energy" value={energy[0]} />
      <input type="hidden" name="focusMinutes" value={focus[0]} />
      <input type="hidden" name="waterCups" value={water[0]} />
      <input
        type="hidden"
        name="reflection"
        value={gratitude ? `${reflection}\n\nGrateful for: ${gratitude}` : reflection}
      />
      {done.map((id) => (
        <input key={id} type="hidden" name="habits" value={id} />
      ))}

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

      {/* energy + focus */}
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
              <Timer className="mr-1.5 inline size-3.5 text-primary" />
              Focus
            </Label>
            <span className="font-serif text-2xl">
              {focus[0]}
              <span className="text-sm text-muted-foreground">m</span>
            </span>
          </div>
          <Slider
            value={focus}
            onValueChange={setFocus}
            min={0}
            max={240}
            step={15}
            className="mt-5"
          />
        </div>
      </div>

      {/* water */}
      <div className="glass rounded-3xl p-6">
        <div className="flex items-center justify-between">
          <Label className="text-sm">
            <Droplet className="mr-1.5 inline size-3.5 text-primary" />
            Water
          </Label>
          <span className="font-serif text-2xl">
            {water[0]}
            <span className="text-sm text-muted-foreground"> cups</span>
          </span>
        </div>
        <Slider
          value={water}
          onValueChange={setWater}
          min={0}
          max={12}
          step={1}
          className="mt-5"
        />
      </div>

      {/* habits */}
      <div className="glass rounded-3xl p-6">
        <Label className="text-sm">
          <Sparkles className="mr-1.5 inline size-3.5 text-primary" />
          Habits honored today
        </Label>
        <div className="mt-4 space-y-2.5">
          {habits.map((h) => {
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
                <span className="text-xs text-muted-foreground">{h.cadence}</span>
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
        type="submit"
        size="lg"
        className="gem-glow h-12 w-full bg-primary text-base text-primary-foreground hover:bg-primary/90"
      >
        Seal today
        <ArrowRight className="size-4" />
      </Button>
    </form>
  )
}
