import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Wordmark({
  className,
  href = '/',
}: {
  className?: string
  href?: string
}) {
  return (
    <Link
      href={href}
      className={cn('group inline-flex items-center gap-2.5', className)}
    >
      <span className="relative grid size-7 place-items-center">
        <svg viewBox="0 0 100 100" className="size-7" aria-hidden="true">
          <polygon
            points="50,6 80,32 50,94 20,32"
            fill="oklch(0.83 0.11 78)"
            opacity="0.9"
          />
          <polygon points="50,6 80,32 50,40 20,32" fill="oklch(0.92 0.07 88)" />
          <polygon points="20,32 50,40 50,94" fill="oklch(0.62 0.12 70)" />
        </svg>
      </span>
      <span className="font-serif text-lg font-medium tracking-tight text-foreground">
        Becoming
      </span>
    </Link>
  )
}
