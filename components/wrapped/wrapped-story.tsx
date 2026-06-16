'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Pause, Play, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Gem } from '@/components/becoming/gem'
import { cn } from '@/lib/utils'
import { accentHue } from '@/components/becoming/gem'
import type { WrappedStat } from '@/lib/mock-data'

export interface Slide {
  kind: 'intro' | 'stat' | 'moment' | 'word' | 'finale'
  hue: number
  kicker?: string
  title?: string
  body?: string
  stat?: WrappedStat
  symbol?: string
}

const SLIDE_MS = 6000

export function WrappedStory({
  slides,
  title,
}: {
  slides: Slide[]
  title: string
}) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)

  const go = useCallback(
    (dir: number) => {
      setIndex((i) => Math.max(0, Math.min(slides.length - 1, i + dir)))
      setProgress(0)
    },
    [slides.length],
  )

  useEffect(() => {
    setProgress(0)
  }, [index])

  useEffect(() => {
    if (paused) return
    const start = Date.now()
    const id = setInterval(() => {
      const elapsed = Date.now() - start
      const pct = Math.min(1, elapsed / SLIDE_MS)
      setProgress(pct)
      if (pct >= 1) {
        if (index < slides.length - 1) {
          setIndex((i) => i + 1)
        } else {
          setPaused(true)
        }
      }
    }, 40)
    return () => clearInterval(id)
  }, [index, paused, slides.length])

  const slide = slides[index]

  return (
    <div className="relative mx-auto flex min-h-[calc(100vh-2rem)] max-w-md flex-col">
      {/* progress bars */}
      <div className="flex gap-1.5 px-1 pt-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 overflow-hidden rounded-full bg-muted/60"
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-100 ease-linear"
              style={{
                width:
                  i < index ? '100%' : i === index ? `${progress * 100}%` : '0%',
              }}
            />
          </div>
        ))}
      </div>

      {/* top bar */}
      <div className="flex items-center justify-between px-1 py-3 text-sm text-muted-foreground">
        <span className="tracking-widest uppercase">{title}</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'Play' : 'Pause'}
          >
            {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            render={<Link href="/dashboard" aria-label="Close" />}
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>

      {/* slide */}
      <div
        key={index}
        className="glass-strong animate-rise relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-[2rem] p-8 text-center"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 30%, oklch(0.8 0.1 ${slide.hue} / 0.22), transparent 70%)`,
          }}
          aria-hidden="true"
        />

        <div className="relative flex flex-col items-center">
          {slide.kind === 'intro' && (
            <>
              <Gem size={120} hue={slide.hue} />
              <p className="mt-8 text-xs tracking-widest text-primary uppercase">
                {slide.kicker}
              </p>
              <h2 className="mt-3 font-serif text-5xl leading-tight font-light tracking-tight text-balance">
                {slide.title}
              </h2>
              <p className="mt-4 text-pretty text-muted-foreground">
                {slide.body}
              </p>
            </>
          )}

          {slide.kind === 'stat' && slide.stat && (
            <>
              <p className="text-xs tracking-widest text-muted-foreground uppercase">
                {slide.stat.label}
              </p>
              <p
                className="mt-4 font-serif text-8xl leading-none font-light tracking-tight text-glow"
                style={{ color: `oklch(0.88 0.1 ${slide.hue})` }}
              >
                {slide.stat.value}
              </p>
              <p className="mt-5 max-w-xs text-pretty text-muted-foreground">
                {slide.stat.caption}
              </p>
            </>
          )}

          {slide.kind === 'moment' && (
            <>
              <Gem size={88} hue={slide.hue} />
              <p className="mt-7 text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
                {slide.symbol} · {slide.kicker}
              </p>
              <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight text-balance">
                {slide.title}
              </h2>
              <p className="mt-4 max-w-xs text-pretty text-muted-foreground">
                {slide.body}
              </p>
            </>
          )}

          {slide.kind === 'word' && (
            <>
              <p className="text-xs tracking-widest text-muted-foreground uppercase">
                {slide.kicker}
              </p>
              <h2
                className="mt-4 font-serif text-6xl font-light tracking-tight text-glow italic"
                style={{ color: `oklch(0.9 0.09 ${slide.hue})` }}
              >
                {slide.title}
              </h2>
              <p className="mt-5 max-w-xs text-pretty text-muted-foreground">
                {slide.body}
              </p>
            </>
          )}

          {slide.kind === 'finale' && (
            <>
              <Gem size={110} hue={slide.hue} />
              <h2 className="mt-8 font-serif text-4xl leading-tight font-light tracking-tight text-balance">
                {slide.title}
              </h2>
              <p className="mt-4 max-w-xs text-pretty text-muted-foreground">
                {slide.body}
              </p>
              <div className="mt-7 flex flex-col gap-2.5">
                <Button
                  className="gem-glow bg-primary text-primary-foreground hover:bg-primary/90"
                  render={<Link href="/dashboard">Return to your year</Link>}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  render={<Link href="/season/new">Begin a new season</Link>}
                />
              </div>
            </>
          )}
        </div>

        {/* tap zones */}
        <button
          type="button"
          onClick={() => go(-1)}
          className="absolute inset-y-0 left-0 w-1/3 cursor-default"
          aria-label="Previous"
        />
        <button
          type="button"
          onClick={() => go(1)}
          className="absolute inset-y-0 right-0 w-1/3 cursor-default"
          aria-label="Next"
        />
      </div>

      {/* explicit controls */}
      <div className="flex items-center justify-between px-1 py-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => go(-1)}
          disabled={index === 0}
          className="text-muted-foreground"
        >
          <ChevronLeft className="size-4" />
          Back
        </Button>
        <span className="text-xs text-muted-foreground">
          {index + 1} / {slides.length}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => go(1)}
          disabled={index === slides.length - 1}
          className="text-muted-foreground"
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}

export { accentHue }
