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
/* Daily logs (recent stretch of the current season)                  */
/* ------------------------------------------------------------------ */

export const recentLogs: DailyLog[] = [
  {
    id: 'log_0615',
    userId: 'usr_daniel',
    date: '2026-06-14',
    mood: 4,
    energy: 4,
    sleepHours: 7.5,
    gratitude: 'A long quiet morning and coffee on the balcony.',
    reflection:
      'Felt the pull to do everything at once. Chose one thing and finished it. That felt like devotion.',
    completedHabitIds: ['sea_summer_h1', 'sea_summer_h3', 'sea_summer_h2'],
  },
  {
    id: 'log_0613',
    userId: 'usr_daniel',
    date: '2026-06-13',
    mood: 5,
    energy: 4,
    sleepHours: 8,
    gratitude: 'A long walk with an old friend.',
    reflection: 'Connection over productivity. No regrets.',
    completedHabitIds: ['sea_summer_h1', 'sea_summer_h4', 'sea_summer_h3'],
  },
  {
    id: 'log_0612',
    userId: 'usr_daniel',
    date: '2026-06-12',
    mood: 3,
    energy: 3,
    sleepHours: 6,
    gratitude: 'Pushed through a hard afternoon.',
    reflection: 'Low energy but showed up anyway. The streak matters more today.',
    completedHabitIds: ['sea_summer_h3'],
  },
]

/* ------------------------------------------------------------------ */
/* Derived season stats                                                */
/* ------------------------------------------------------------------ */

export interface SeasonStats {
  daysIn: number
  totalDays: number
  habitsHonored: number
  longestStreak: number
  consistency: number // 0..1
  avgMood: number
  avgEnergy: number
  avgSleep: number
}

export const seasonStats: SeasonStats = {
  daysIn: 56,
  totalDays: 92,
  habitsHonored: 187,
  longestStreak: 31,
  consistency: 0.78,
  avgMood: 4.1,
  avgEnergy: 3.8,
  avgSleep: 7.3,
}

/* ------------------------------------------------------------------ */
/* Heatmap — deterministic ~26 weeks of activity                       */
/* ------------------------------------------------------------------ */

export function generateHeatmap(weeks = 26): HeatmapDay[] {
  const days: HeatmapDay[] = []
  const today = new Date('2026-06-14')
  const total = weeks * 7
  // simple seeded pseudo-random for stable SSR/CSR output
  let seed = 1337
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
  for (let i = total - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const dow = d.getDay()
    // gentle upward trend toward the present + weekend dips
    const progress = (total - i) / total
    let base = 1 + progress * 2.4
    if (dow === 0 || dow === 6) base -= 0.8
    const noise = rand() * 2.2 - 0.8
    let count = Math.round(Math.max(0, Math.min(4, base + noise)))
    // a few rest days for realism
    if (rand() > 0.92) count = 0
    days.push({
      date: d.toISOString().slice(0, 10),
      level: count,
      count,
    })
  }
  return days
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
