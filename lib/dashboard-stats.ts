import {
  calculateBestStreak,
  calculateGemLevel,
  calculateHabitCompletionRate,
  calculateSeasonScore,
  createContributionHeatmapData,
  generateWrappedCards,
  type DailyCheckin,
  type GemLevel,
  type WrappedCardDraft,
} from '@/lib/scoring'
import {
  currentSeason,
  demoCheckins,
  demoDailyLogs,
  seasonGoals,
  type DailyLog,
  type HeatmapDay,
  type SeasonStats,
} from '@/lib/mock-data'

export type DashboardStats = SeasonStats & {
  seasonScore: number
  gemLevel: GemLevel
  habitCompletionRates: Record<string, number>
}

function daysBetween(start: string, end: string): number {
  const diffMs = new Date(end).getTime() - new Date(start).getTime()
  return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
}

function daysElapsed(start: string, today: string): number {
  const diffMs = new Date(today).getTime() - new Date(start).getTime()
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
}

function average(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function habitCompletionRates(
  checkins: DailyCheckin[],
  habitIds: string[],
): Record<string, number> {
  const rates: Record<string, number> = {}

  for (const habitId of habitIds) {
    const logs = checkins.flatMap((checkin) =>
      checkin.habitLogs.filter((log) => log.habitId === habitId),
    )

    if (logs.length === 0) {
      rates[habitId] = 0
      continue
    }

    const completed = logs.filter((log) => log.completed).length
    rates[habitId] = completed / logs.length
  }

  return rates
}

/** Compute dashboard stats from mock check-ins via scoring.ts */
export function getDashboardStats(
  today = demoDailyLogs[demoDailyLogs.length - 1]?.date ?? '2026-06-14',
): DashboardStats {
  const checkins = demoCheckins
  const seasonScore = calculateSeasonScore({ goals: seasonGoals, checkins })
  const habitRates = habitCompletionRates(
    checkins,
    currentSeason.habits.map((habit) => habit.id),
  )

  const habitsHonored = checkins.reduce((sum, checkin) => {
    return sum + checkin.habitLogs.filter((log) => log.completed).length
  }, 0)

  return {
    daysIn: daysElapsed(currentSeason.startDate, today),
    totalDays: daysBetween(currentSeason.startDate, currentSeason.endDate),
    habitsHonored,
    longestStreak: calculateBestStreak(checkins),
    consistency: calculateHabitCompletionRate(checkins) / 100,
    avgMood: Math.round(average(demoDailyLogs.map((log) => log.mood)) * 10) / 10,
    avgEnergy: Math.round(average(demoDailyLogs.map((log) => log.energy)) * 10) / 10,
    avgSleep: Math.round(average(demoDailyLogs.map((log) => log.sleepHours)) * 10) / 10,
    seasonScore,
    gemLevel: calculateGemLevel(seasonScore),
    habitCompletionRates: habitRates,
  }
}

/** Heatmap cells derived from real check-in completion rates */
export function getHeatmapDays(): HeatmapDay[] {
  return createContributionHeatmapData(demoCheckins).map((day) => ({
    date: day.date,
    level: day.level,
    count: Math.round(
      (day.completionRate / 100) * currentSeason.habits.length,
    ),
  }))
}

/** Most recent reflections for the dashboard card grid */
export function getRecentLogs(count = 3): DailyLog[] {
  return [...demoDailyLogs]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, count)
}

/** Wrapped recap cards generated from the same mock season data */
export function getWrappedCards(): WrappedCardDraft[] {
  return generateWrappedCards({
    season: {
      id: currentSeason.id,
      name: currentSeason.name,
      startDate: currentSeason.startDate,
      endDate: currentSeason.endDate,
    },
    goals: seasonGoals,
    habits: currentSeason.habits.map((habit) => ({
      id: habit.id,
      name: habit.name,
      category: habit.accent,
    })),
    checkins: demoCheckins,
  })
}

/** Cached stats for components that expect a simple import */
export const dashboardStats = getDashboardStats()
