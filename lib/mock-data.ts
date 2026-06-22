import type { DailyCheckin, SeasonGoal } from '@/lib/scoring'

/**
 * Mock data layer for Becoming.
 *
 * These types & shapes mirror an eventual PostgreSQL schema. Every entity has
 * an `id` and foreign-key references (`userId`, `visionId`, `seasonId`) so the
 * UI can be swapped to live queries without restructuring components.
 *
 *   users            (id, name, email, avatar_url, joined_at)
 *   visions          (id, user_id, year, word, statement, themes[], created_at)
 *   seasons          (id, vision_id, name, symbol, accent, focus, intention,
 *                     narrative, start_date, end_date, status)
 *   habits           (id, season_id, name, cadence, target, unit, streak,
 *                     best_streak, accent)
 *   daily_logs       (id, user_id, date, mood, energy, sleep_hours,
 *                     gratitude, reflection, completed_habit_ids[])
 */

export type SeasonStatus = 'completed' | 'current' | 'upcoming'

export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
  joinedAt: string
}

export interface Vision {
  id: string
  userId: string
  year: number
  word: string
  statement: string
  themes: string[]
  createdAt: string
}

export interface Habit {
  id: string
  seasonId: string
  name: string
  cadence: 'daily' | 'weekly'
  target: number
  unit: string
  streak: number
  bestStreak: number
  completionRate: number // 0..1 for the season
  accent: 'gold' | 'teal' | 'sage' | 'rose' | 'iris'
}

export interface Season {
  id: string
  visionId: string
  name: string
  symbol: string // gemstone motif
  accent: 'gold' | 'teal' | 'sage' | 'rose' | 'iris'
  focus: string
  intention: string
  narrative: string
  startDate: string
  endDate: string
  status: SeasonStatus
  habits: Habit[]
}

export interface DailyLog {
  id: string
  userId: string
  date: string
  mood: number // 1..5
  energy: number // 1..5
  sleepHours: number
  gratitude: string
  reflection: string
  completedHabitIds: string[]
}

export interface HeatmapDay {
  date: string
  /** 0 (none) .. 4 (radiant) — number of habits honored that day */
  level: number
  count: number
}

/**
 * Shared emotional scale for moods (1..5). Used by the check-in ritual,
 * reflections, and wellness so the language of feeling stays consistent.
 */
export interface MoodStep {
  value: number
  label: string
  emoji: string
}

export const MOOD_SCALE: MoodStep[] = [
  { value: 1, label: 'Heavy', emoji: '😔' },
  { value: 2, label: 'Low', emoji: '😕' },
  { value: 3, label: 'Steady', emoji: '😌' },
  { value: 4, label: 'Bright', emoji: '😊' },
  { value: 5, label: 'Radiant', emoji: '🤩' },
]

/** Look up a mood step by its 1..5 value. */
export function moodFor(value: number): MoodStep {
  return MOOD_SCALE[Math.min(Math.max(Math.round(value), 1), 5) - 1]
}

/* ------------------------------------------------------------------ */
/* Daniel — the sample user                                            */
/* ------------------------------------------------------------------ */

export const user: User = {
  id: 'usr_daniel',
  name: 'Daniel',
  email: 'daniel@becoming.app',
  joinedAt: '2026-01-01',
}

export const vision: Vision = {
  id: 'vis_2026',
  userId: 'usr_daniel',
  year: 2026,
  word: 'Devotion',
  statement:
    'I am becoming someone who shows up quietly and consistently — grounded in his body, generous with his attention, and unafraid of slow, compounding work.',
  themes: ['Health', 'Craft', 'Presence', 'Connection'],
  createdAt: '2026-01-01',
}

const goldHabits = (seasonId: string): Habit[] => [
  {
    id: `${seasonId}_h1`,
    seasonId,
    name: 'Move my body',
    cadence: 'daily',
    target: 1,
    unit: 'session',
    streak: 12,
    bestStreak: 28,
    completionRate: 0.84,
    accent: 'gold',
  },
  {
    id: `${seasonId}_h2`,
    seasonId,
    name: 'Morning pages',
    cadence: 'daily',
    target: 3,
    unit: 'pages',
    streak: 7,
    bestStreak: 19,
    completionRate: 0.71,
    accent: 'teal',
  },
  {
    id: `${seasonId}_h3`,
    seasonId,
    name: 'Deep work block',
    cadence: 'daily',
    target: 90,
    unit: 'min',
    streak: 19,
    bestStreak: 31,
    completionRate: 0.79,
    accent: 'sage',
  },
  {
    id: `${seasonId}_h4`,
    seasonId,
    name: 'Reach out to someone',
    cadence: 'weekly',
    target: 3,
    unit: 'people',
    streak: 4,
    bestStreak: 9,
    completionRate: 0.66,
    accent: 'rose',
  },
]

export const seasons: Season[] = [
  {
    id: 'sea_winter',
    visionId: 'vis_2026',
    name: 'The Quiet Forge',
    symbol: 'Onyx',
    accent: 'iris',
    focus: 'Foundations',
    intention: 'Build the rituals before I need them.',
    narrative:
      'A season of stripping back. Daniel rebuilt his mornings, learned to sleep, and laid the first stones of a daily practice.',
    startDate: '2026-01-01',
    endDate: '2026-03-19',
    status: 'completed',
    habits: goldHabits('sea_winter'),
  },
  {
    id: 'sea_spring',
    visionId: 'vis_2026',
    name: 'First Light',
    symbol: 'Aquamarine',
    accent: 'teal',
    focus: 'Momentum',
    intention: 'Let consistency turn into identity.',
    narrative:
      'Habits that felt heavy in winter started to carry themselves. Daniel ran his first 10k and shipped a long-shelved project.',
    startDate: '2026-03-20',
    endDate: '2026-06-20',
    status: 'completed',
    habits: goldHabits('sea_spring'),
  },
  {
    id: 'sea_summer',
    visionId: 'vis_2026',
    name: 'The Ascent',
    symbol: 'Citrine',
    accent: 'gold',
    focus: 'Expansion',
    intention: 'Go further while staying soft.',
    narrative:
      'The current chapter. Long days, high energy, and the temptation to overreach. The work is staying devoted without burning bright and fast.',
    startDate: '2026-06-21',
    endDate: '2026-09-21',
    status: 'current',
    habits: goldHabits('sea_summer'),
  },
  {
    id: 'sea_autumn',
    visionId: 'vis_2026',
    name: 'The Harvest',
    symbol: 'Amber',
    accent: 'rose',
    focus: 'Integration',
    intention: 'Gather what the year has grown.',
    narrative:
      'A future chapter. A time to reap, reflect, and decide what carries into next year.',
    startDate: '2026-09-22',
    endDate: '2026-12-31',
    status: 'upcoming',
    habits: goldHabits('sea_autumn'),
  },
]

export const currentSeason = seasons.find((s) => s.status === 'current')!

/* ------------------------------------------------------------------ */
/* Season goals + 21 demo check-ins (feeds scoring.ts)                 */
/* ------------------------------------------------------------------ */

export const seasonGoals: SeasonGoal[] = [
  {
    id: 'goal_body',
    title: 'Move my body 36 times',
    category: 'Health',
    targetValue: 36,
    currentValue: 22,
    unit: 'sessions',
    weight: 1,
  },
  {
    id: 'goal_craft',
    title: '120 deep work hours',
    category: 'Craft',
    targetValue: 120,
    currentValue: 58,
    unit: 'hours',
    weight: 1,
  },
  {
    id: 'goal_connect',
    title: 'Reach out 36 times',
    category: 'Connection',
    targetValue: 36,
    currentValue: 18,
    unit: 'people',
    weight: 1,
  },
]

const DEMO_CHECKIN_COUNT = 21
const DEMO_TODAY = '2026-07-12'

const REFLECTIONS = [
  'Felt the pull to do everything at once. Chose one thing and finished it.',
  'Connection over productivity. No regrets.',
  'Low energy but showed up anyway. The streak matters more today.',
  'Protected the morning and let the rest of the day follow.',
  'A scattered start, but I closed the loop before bed.',
  'The routine is starting to feel like identity instead of effort.',
  'Rest day energy, still honored the smallest promise.',
  'Deep work felt easier once I stopped negotiating with myself.',
  'Moved my body even when motivation was quiet.',
  'Grateful for slow progress that still counts.',
]

const GRATITUDE = [
  'a quiet morning and coffee on the balcony',
  'a long walk with an old friend',
  'having enough energy to study',
  'the feeling after finishing a hard workout',
  'a kind text from someone I miss',
  'sunlight through the window at 6pm',
  'choosing one thing and finishing it',
]

function createDemoDailyLogs(): DailyLog[] {
  const habits = currentSeason.habits
  let seed = 4242
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }

  return Array.from({ length: DEMO_CHECKIN_COUNT }, (_, index) => {
    const dayOffset = DEMO_CHECKIN_COUNT - 1 - index
    const date = new Date(`${DEMO_TODAY}T12:00:00`)
    date.setDate(date.getDate() - dayOffset)
    const isoDate = date.toISOString().slice(0, 10)
    const dow = date.getDay()
    const weekend = dow === 0 || dow === 6

    const completedHabitIds = habits
      .filter(() => rand() > (weekend ? 0.55 : 0.3))
      .map((habit) => habit.id)

    const mood = Math.min(5, Math.max(1, Math.round(2.8 + rand() * 2.2)))
    const energy = Math.min(5, Math.max(1, Math.round(2.5 + rand() * 2.5)))
    const sleepHours = Math.round((6.2 + rand() * 2.3) * 2) / 2
    const deepWorkDone = completedHabitIds.includes(`${currentSeason.id}_h3`)

    return {
      id: `log_${isoDate.replace(/-/g, '')}`,
      userId: user.id,
      date: isoDate,
      mood,
      energy,
      sleepHours,
      gratitude: GRATITUDE[index % GRATITUDE.length],
      reflection: REFLECTIONS[index % REFLECTIONS.length],
      completedHabitIds,
      focusMinutes: deepWorkDone ? 75 + Math.round(rand() * 45) : Math.round(rand() * 40),
      waterCups: 4 + Math.round(rand() * 4),
    }
  })
}

export type DemoDailyLog = DailyLog & {
  focusMinutes: number
  waterCups: number
}

export const demoDailyLogs = createDemoDailyLogs() as DemoDailyLog[]

export function toScoringCheckins(logs: DemoDailyLog[]): DailyCheckin[] {
  return logs.map((log) => ({
    id: log.id,
    checkinDate: log.date,
    moodScore: log.mood * 2,
    energyScore: log.energy * 2,
    focusMinutes: log.focusMinutes,
    waterCups: log.waterCups,
    reflection: log.reflection,
    habitLogs: currentSeason.habits.map((habit) => ({
      habitId: habit.id,
      completed: log.completedHabitIds.includes(habit.id),
    })),
  }))
}

export const demoCheckins = toScoringCheckins(demoDailyLogs)

/** @deprecated Use dashboardStats from @/lib/dashboard-stats */
export interface SeasonStats {
  daysIn: number
  totalDays: number
  habitsHonored: number
  longestStreak: number
  consistency: number
  avgMood: number
  avgEnergy: number
  avgSleep: number
}

/* ------------------------------------------------------------------ */
/* Year of Becoming — wrapped highlights                               */
/* ------------------------------------------------------------------ */

export interface WrappedStat {
  label: string
  value: string
  caption: string
}

export const wrappedStats: WrappedStat[] = [
  { label: 'Days devoted', value: '287', caption: 'out of 365 — you showed up' },
  { label: 'Habits honored', value: '1,142', caption: 'small acts, compounded' },
  { label: 'Longest streak', value: '31', caption: 'days of moving your body' },
  { label: 'Avg. mood', value: '4.1', caption: 'steadier than last year' },
  { label: 'Seasons completed', value: '4', caption: 'a full turn of the wheel' },
  { label: 'Words written', value: '61k', caption: 'across your morning pages' },
]

export const wrappedMoments = [
  {
    season: 'The Quiet Forge',
    symbol: 'Onyx',
    accent: 'iris' as const,
    headline: 'You learned to begin.',
    body: 'The hardest season. You built rituals in the dark and trusted they would matter.',
  },
  {
    season: 'First Light',
    symbol: 'Aquamarine',
    accent: 'teal' as const,
    headline: 'Consistency became identity.',
    body: 'You stopped negotiating with yourself each morning. The work simply happened.',
  },
  {
    season: 'The Ascent',
    symbol: 'Citrine',
    accent: 'gold' as const,
    headline: 'You went further — softly.',
    body: 'High energy, high stakes, and you stayed devoted without burning out.',
  },
  {
    season: 'The Harvest',
    symbol: 'Amber',
    accent: 'rose' as const,
    headline: 'You gathered it all in.',
    body: 'A year of becoming, reaped and ready to carry into who you are next.',
  },
]

/* Accent → color token map for season-aware styling */
export const accentColors: Record<
  Habit['accent'],
  { ring: string; text: string; glow: string; soft: string }
> = {
  gold: {
    ring: 'oklch(0.83 0.11 78)',
    text: 'text-[oklch(0.86_0.11_78)]',
    glow: 'gem-glow',
    soft: 'oklch(0.83 0.11 78 / 0.16)',
  },
  teal: {
    ring: 'oklch(0.74 0.1 198)',
    text: 'text-[oklch(0.8_0.1_198)]',
    glow: 'gem-glow-teal',
    soft: 'oklch(0.74 0.1 198 / 0.16)',
  },
  sage: {
    ring: 'oklch(0.74 0.09 150)',
    text: 'text-[oklch(0.8_0.09_150)]',
    glow: 'gem-glow',
    soft: 'oklch(0.74 0.09 150 / 0.16)',
  },
  rose: {
    ring: 'oklch(0.74 0.11 20)',
    text: 'text-[oklch(0.8_0.11_20)]',
    glow: 'gem-glow',
    soft: 'oklch(0.74 0.11 20 / 0.16)',
  },
  iris: {
    ring: 'oklch(0.7 0.09 280)',
    text: 'text-[oklch(0.78_0.09_280)]',
    glow: 'gem-glow',
    soft: 'oklch(0.7 0.09 280 / 0.16)',
  },
}
