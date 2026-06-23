'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, PenLine, Sparkles, Compass } from 'lucide-react'
import { Wordmark } from './wordmark'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/check-in', label: 'Check-in', icon: PenLine },
  { href: '/wrapped', label: 'Wrapped', icon: Sparkles },
  { href: '/demo', label: 'Demo', icon: Compass },
]

type AppNavProps = {
  userName?: string
}

export function AppNav({ userName = 'Daniel' }: AppNavProps) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="glass mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl px-4 py-2.5">
        <Wordmark href="/dashboard" />
        <nav className="hidden items-center gap-1 sm:flex">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm transition-colors',
                  active
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="size-3.5" />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground md:inline">
            {userName}
          </span>
          <Avatar className="size-8 ring-1 ring-primary/30">
            <AvatarFallback className="bg-primary/15 text-sm text-primary">
              {userName[0]}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      {/* mobile nav */}
      <nav className="glass mx-auto mt-2 flex max-w-6xl items-center justify-around rounded-2xl px-2 py-1.5 sm:hidden">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'inline-flex flex-col items-center gap-0.5 rounded-xl px-3 py-1 text-[11px] transition-colors',
                active ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
