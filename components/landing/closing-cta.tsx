import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Wordmark } from '@/components/becoming/wordmark'

export function ClosingCta() {
  return (
    <section id="wrapped" className="relative mx-auto max-w-6xl px-6 py-24">
      <div className="glass-strong gem-glow relative overflow-hidden rounded-[2rem] px-8 py-16 text-center sm:px-16 sm:py-20">
        <div
          className="pointer-events-none absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: 'oklch(0.83 0.11 78 / 0.25)' }}
          aria-hidden="true"
        />
        <p className="relative text-xs tracking-widest text-primary uppercase">
          Your Year of Becoming
        </p>
        <h2 className="relative mx-auto mt-4 max-w-2xl font-serif text-4xl leading-tight font-light tracking-tight text-balance sm:text-5xl">
          A year from now, who will you have{' '}
          <span className="text-gradient-gold italic">become?</span>
        </h2>
        <p className="relative mx-auto mt-5 max-w-lg text-pretty text-muted-foreground">
          Start with a single sentence today. Let the seasons do the rest.
        </p>
        <div className="relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            className="h-11 bg-primary px-6 text-base text-primary-foreground hover:bg-primary/90"
            render={
              <Link href="/onboarding">
                Begin your vision
                <ArrowRight className="size-4" />
              </Link>
            }
          />
          <Button
            variant="outline"
            size="lg"
            className="h-11 border-border bg-card/30 px-6 text-base"
            render={<Link href="/dashboard">Skip to dashboard</Link>}
          />
        </div>
      </div>

      <footer className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row">
        <Wordmark />
        <p className="font-serif italic">Become, slowly. — {new Date().getFullYear()}</p>
      </footer>
    </section>
  )
}
