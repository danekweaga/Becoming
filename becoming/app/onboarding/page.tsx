'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Gem } from '@/components/becoming/gem'
import { Wordmark } from '@/components/becoming/wordmark'
import Strands from '@/components/becoming/strands'
import { cn } from '@/lib/utils'
import { vision as seedVision } from '@/lib/mock-data'

const THEME_OPTIONS = [
  'Health',
  'Craft',
  'Presence',
  'Connection',
  'Adventure',
  'Stillness',
  'Creativity',
  'Discipline',
  'Joy',
  'Courage',
]

const steps = ['Your name', 'A word', 'Your vision', 'Themes'] as const

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('Daniel')
  const [word, setWord] = useState('')
  const [statement, setStatement] = useState('')
  const [themes, setThemes] = useState<string[]>([])

  const toggleTheme = (t: string) =>
    setThemes((prev) =>
      prev.includes(t)
        ? prev.filter((x) => x !== t)
        : prev.length < 4
          ? [...prev, t]
          : prev,
    )

  const canAdvance =
    (step === 0 && name.trim().length > 0) ||
    (step === 1 && word.trim().length > 0) ||
    (step === 2 && statement.trim().length > 8) ||
    (step === 3 && themes.length > 0)

  const next = () => {
    if (step < steps.length - 1) setStep((s) => s + 1)
    else router.push('/season/new')
  }
  const back = () => setStep((s) => Math.max(0, s - 1))

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden px-4 py-6">
      {/* Calm woven-light backdrop for the vision ritual */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_25%,black,transparent_75%)]"
        aria-hidden="true"
      >
        <Strands
          colors={['#EAB308', '#5FC9C2', '#9C82E8']}
          count={4}
          speed={0.32}
          amplitude={1}
          glow={2.3}
          intensity={0.45}
          opacity={0.85}
          scale={1.6}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-5xl items-center justify-between">
        <Wordmark />
        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/demo">Skip for now</Link>}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-xl flex-1 flex-col justify-center py-10">
        {/* progress */}
        <div className="mb-10 flex items-center gap-2">
          {steps.map((label, i) => (
            <div key={label} className="flex flex-1 flex-col gap-2">
              <div className="h-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: i <= step ? '100%' : '0%' }}
                />
              </div>
              <span
                className={cn(
                  'text-[11px] tracking-wide transition-colors',
                  i <= step ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="glass-strong relative rounded-3xl p-8 sm:p-10">
          <div className="mb-7 flex justify-center">
            <Gem size={72} hue={78} />
          </div>

          {step === 0 && (
            <div className="animate-rise space-y-5 text-center">
              <h1 className="font-serif text-3xl font-light tracking-tight text-balance">
                First — what should we call you?
              </h1>
              <p className="text-sm text-muted-foreground">
                This is your private space. No performance, no audience.
              </p>
              <div className="mx-auto max-w-sm space-y-2 pt-2 text-left">
                <Label htmlFor="name">Your name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Daniel"
                  className="h-11 bg-background/40 text-base"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="animate-rise space-y-5 text-center">
              <h1 className="font-serif text-3xl font-light tracking-tight text-balance">
                Choose a word for your year
              </h1>
              <p className="text-sm text-muted-foreground">
                One word to orient everything else. Daniel chose{' '}
                <span className="text-primary italic">{seedVision.word}</span>.
              </p>
              <div className="mx-auto max-w-sm space-y-2 pt-2 text-left">
                <Label htmlFor="word">Word of the year</Label>
                <Input
                  id="word"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  placeholder="Devotion, Courage, Bloom…"
                  className="h-11 bg-background/40 text-center font-serif text-xl tracking-wide"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-rise space-y-5 text-center">
              <h1 className="font-serif text-3xl font-light tracking-tight text-balance">
                Who are you becoming this year?
              </h1>
              <p className="text-sm text-muted-foreground">
                Write it in the present tense — &ldquo;I am becoming someone
                who…&rdquo;
              </p>
              <div className="space-y-2 pt-2 text-left">
                <Label htmlFor="statement">Your vision</Label>
                <Textarea
                  id="statement"
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  rows={5}
                  placeholder="I am becoming someone who shows up quietly and consistently…"
                  className="resize-none bg-background/40 text-base leading-relaxed"
                />
                <button
                  type="button"
                  onClick={() => setStatement(seedVision.statement)}
                  className="text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                >
                  Need a spark? Use Daniel&apos;s example
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-rise space-y-5 text-center">
              <h1 className="font-serif text-3xl font-light tracking-tight text-balance">
                What are this year&apos;s themes?
              </h1>
              <p className="text-sm text-muted-foreground">
                Pick up to four. These become the threads your seasons weave.
              </p>
              <div className="flex flex-wrap justify-center gap-2.5 pt-2">
                {THEME_OPTIONS.map((t) => {
                  const active = themes.includes(t)
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTheme(t)}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-all',
                        active
                          ? 'border-primary/40 bg-primary/15 text-primary'
                          : 'border-border bg-card/40 text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {active && <Check className="size-3.5" />}
                      {t}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="mt-9 flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              onClick={back}
              disabled={step === 0}
              className="text-muted-foreground"
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>
            <Button
              onClick={next}
              disabled={!canAdvance}
              className="gem-glow bg-primary px-6 text-primary-foreground hover:bg-primary/90"
            >
              {step === steps.length - 1 ? 'Shape your first season' : 'Continue'}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
