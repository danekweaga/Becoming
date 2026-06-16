import Link from 'next/link'
import { Wordmark } from '@/components/becoming/wordmark'
import { Button } from '@/components/ui/button'

export function MarketingNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <div className="glass mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-2xl px-4 py-2.5 sm:px-5">
        <Wordmark />
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#vision" className="transition-colors hover:text-foreground">
            Vision
          </a>
          <a href="#seasons" className="transition-colors hover:text-foreground">
            Seasons
          </a>
          <a href="#wrapped" className="transition-colors hover:text-foreground">
            Wrapped
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/demo">See the demo</Link>}
          />
          <Button
            size="sm"
            className="gem-glow bg-primary text-primary-foreground hover:bg-primary/90"
            render={<Link href="/onboarding">Begin</Link>}
          />
        </div>
      </div>
    </header>
  )
}
