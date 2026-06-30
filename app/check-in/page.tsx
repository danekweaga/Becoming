import { CheckInForm } from '@/components/check-in/check-in-form'
import { getCheckinContext } from '@/lib/dashboard-db'

export const dynamic = 'force-dynamic'

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
})

export default async function CheckInPage() {
  const { seasonName, habits } = await getCheckinContext()

  return (
    <main className="mx-auto mt-6 max-w-2xl px-4">
      <div className="text-center">
        <p className="text-xs tracking-widest text-primary uppercase">{today}</p>
        <h1 className="mt-3 font-serif text-4xl font-light tracking-tight text-balance">
          How did today feel?
        </h1>
        <p className="mt-3 text-pretty text-muted-foreground">
          A small ritual for {seasonName}. Honest, unhurried, just for you.
        </p>
      </div>

      <CheckInForm habits={habits} />
    </main>
  )
}
