'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { DEMO_EMAIL } from '@/lib/seed-demo'

function startOfUtcDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  )
}

async function resolveActiveSeason(userId: string) {
  const today = new Date()
  const seasons = await db.season.findMany({
    where: { userId },
    include: { habits: true },
    orderBy: { startDate: 'asc' },
  })

  return (
    seasons.find((s) => s.startDate <= today && s.endDate >= today) ??
    seasons.find((s) => s.name === 'Summer Reset') ??
    seasons[seasons.length - 1] ??
    null
  )
}

/**
 * Saves one daily check-in (and its habit logs) for the demo user's active
 * season, then redirects to the dashboard so the recalculated score shows.
 */
export async function submitCheckin(formData: FormData) {
  const user =
    (await db.user.findUnique({ where: { email: DEMO_EMAIL } })) ??
    (await db.user.findFirst({ orderBy: { createdAt: 'asc' } }))

  if (!user) {
    throw new Error('No demo user found. Run the demo seed first.')
  }

  const season = await resolveActiveSeason(user.id)
  if (!season) {
    throw new Error('No active season found. Run the demo seed first.')
  }

  // Form sends mood/energy on a 1-5 scale; the DB scoring layer uses 1-10.
  const mood = Number(formData.get('mood') ?? 4)
  const energy = Number(formData.get('energy') ?? 4)
  const focusMinutes = Math.max(0, Math.round(Number(formData.get('focusMinutes') ?? 0)))
  const waterCups = Math.max(0, Math.round(Number(formData.get('waterCups') ?? 0)))
  const reflection = (formData.get('reflection') as string | null)?.trim() || null

  const completedHabitIds = new Set(
    formData
      .getAll('habits')
      .map((value) => String(value))
      .filter(Boolean),
  )

  const checkinDate = startOfUtcDay(new Date())

  const checkin = await db.dailyCheckin.upsert({
    where: {
      seasonId_checkinDate: {
        seasonId: season.id,
        checkinDate,
      },
    },
    create: {
      userId: user.id,
      seasonId: season.id,
      checkinDate,
      moodScore: mood * 2,
      energyScore: energy * 2,
      focusMinutes,
      waterCups,
      reflection,
    },
    update: {
      moodScore: mood * 2,
      energyScore: energy * 2,
      focusMinutes,
      waterCups,
      reflection,
    },
  })

  // Rebuild the habit logs for this day from the submitted selections.
  await db.habitLog.deleteMany({ where: { dailyCheckinId: checkin.id } })
  await db.habitLog.createMany({
    data: season.habits.map((habit) => ({
      dailyCheckinId: checkin.id,
      habitId: habit.id,
      completed: completedHabitIds.has(habit.id),
    })),
  })

  revalidatePath('/dashboard')
  revalidatePath('/wrapped')
  redirect('/dashboard')
}
