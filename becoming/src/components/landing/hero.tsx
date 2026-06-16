import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Gem } from '@/components/becoming/gem'

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-28 pb-16 text-center">
      <div className="animate-rise" style={{ animationDelay: '0ms' }}>
        <Gem size={120} hue={78} />
      </div>

      <span
        className="animate-rise mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-4 py-1.5 text-xs tracking-widest text-muted-foreground uppercase"
        style={{ animationDelay: '80ms' }}
      >
        A year, in chapters
      </span>

      <h1
        className="animate-rise mt-6 max-w-4xl font-serif text-5xl leading-[1.05] font-light tracking-tight text-balance sm:text-6xl md:text-7xl"
        style={{ animationDelay: '160ms' }}
      >
        Who are you{' '}
        <span className="text-gradient-gold text-glow italic">becoming</span>{' '}
        this year?
      </h1>

      <p
        className="animate-rise mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground"
        style={{ animationDelay: '240ms' }}
      >
        Becoming is a calm, cinematic space to set a yearly vision, break it into
        seasonal chapters, and honor the small daily acts that quietly change who
        you are.
      </p>

      <div
        className="animate-rise mt-9 flex flex-col items-center gap-3 sm:flex-row"
        style={{ animationDelay: '320ms' }}
      >
        <Button
          size="lg"
          className="gem-glow h-11 bg-primary px-6 text-base text-primary-foreground hover:bg-primary/90"
          render={
            <Link href="/onboarding">
              Set your vision
              <ArrowRight className="size-4" />
            </Link>
          }
        />
        <Button
          variant="outline"
          size="lg"
          className="h-11 border-border bg-card/30 px-6 text-base backdrop-blur"
          render={<Link href="/demo">Explore Daniel&apos;s year</Link>}
        />
      </div>

      <p
        className="animate-rise mt-12 max-w-md font-serif text-base text-pretty text-muted-foreground/80 italic"
        style={{ animationDelay: '420ms' }}
      >
        &ldquo;Not a habit tracker. A mirror for the person you&apos;re slowly
        turning into.&rdquo;
      </p>
    </section>
  )
}
