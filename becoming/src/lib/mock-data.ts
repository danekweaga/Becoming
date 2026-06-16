export type Accent = 'gold' | 'teal' | 'sage' | 'rose' | 'iris'

export interface Habit {
  id: string
  name: string
  cadence: 'daily' | 'weekly'
  target: number
  unit: string
  accent: Accent
  completionRate: number
  streak: number
}

export interface HeatmapDay {
  date: string
  count: number
  level: number
}

export interface WrappedStat {
  label: string
  value: string
  caption: string
}

export const user = {
  name: 'Daniel',
  initials: 'DW',
}

export const vision = {
  year: 2026,
  word: 'Discipline',
  statement: 'I am becoming focused, healthy, consistent, and financially responsible.',
  themes: ['Health', 'Study', 'Focus', 'Money', 'Reflection'],
}

export const seasons = [
  {
    id: 'summer-reset',
    name: 'Summer Reset',
    symbol: 'Amethyst',
    focus: 'Discipline and health',
    intention: 'I am becoming disciplined with my body, time, and focus.',
    narrative:
      'You rebuilt your days around small promises: training, studying, hydrating, and reflecting before the day disappeared.',
    accent: 'teal' as Accent,
  },
  {
    id: 'fall-build',
    name: 'Fall Build',
    symbol: 'Sapphire',
    focus: 'Craft and momentum',
    intention: 'I am becoming a steady builder who finishes what matters.',
    narrative: 'You turned focus into visible progress and protected your creative energy.',
    accent: 'iris' as Accent,
  },
  {
    id: 'winter-grounding',
    name: 'Winter Grounding',
    symbol: 'Emerald',
    focus: 'Rest and foundation',
    intention: 'I am becoming grounded, patient, and resilient.',
    narrative: 'You slowed down enough to recover, reset, and prepare for the next chapter.',
    accent: 'sage' as Accent,
  },
  {
    id: 'spring-renewal',
    name: 'Spring Renewal',
    symbol: 'Citrine',
    focus: 'Energy and confidence',
    intention: 'I am becoming bold enough to be seen.',
    narrative: 'You brought your work, health, and confidence into the light.',
    accent: 'gold' as Accent,
  },
]

export const currentSeason = {
  ...seasons[0],
  habits: [
    {
      id: 'workout',
      name: 'Workout',
      cadence: 'daily',
      target: 1,
      unit: 'session',
      accent: 'gold',
      completionRate: 0.82,
      streak: 8,
    },
    {
      id: 'study',
      name: 'Deep study',
      cadence: 'daily',
      target: 90,
      unit: 'minutes',
      accent: 'teal',
      completionRate: 0.74,
      streak: 5,
    },
    {
      id: 'hydrate',
      name: 'Hydrate',
      cadence: 'daily',
      target: 8,
      unit: 'cups',
      accent: 'sage',
      completionRate: 0.9,
      streak: 12,
    },
    {
      id: 'journal',
      name: 'Journal',
      cadence: 'daily',
      target: 1,
      unit: 'entry',
      accent: 'rose',
      completionRate: 0.68,
      streak: 4,
    },
  ] satisfies Habit[],
}

export const seasonStats = {
  daysIn: 21,
  totalDays: 90,
  consistency: 0.79,
  habitsHonored: 67,
  longestStreak: 12,
  avgMood: 4,
  avgEnergy: 4,
  avgSleep: 7.5,
}

export const MOOD_SCALE = [
  { value: 1, label: 'Heavy', emoji: '🌧️' },
  { value: 2, label: 'Low', emoji: '🌙' },
  { value: 3, label: 'Steady', emoji: '🌿' },
  { value: 4, label: 'Bright', emoji: '✨' },
  { value: 5, label: 'Alive', emoji: '☀️' },
]

export const recentLogs = [
  {
    id: 'log-1',
    date: '2026-06-13',
    mood: 4,
    reflection: 'I had a slow start but protected the evening and still showed up.',
    gratitude: 'a quiet walk after dinner',
  },
  {
    id: 'log-2',
    date: '2026-06-14',
    mood: 3,
    reflection: 'Consistency felt boring today, which probably means it is working.',
    gratitude: 'having enough energy to study',
  },
  {
    id: 'log-3',
    date: '2026-06-15',
    mood: 5,
    reflection: 'The routine is starting to feel like identity instead of effort.',
    gratitude: 'the feeling after finishing a hard workout',
  },
]

export const wrappedStats: WrappedStat[] = [
  {
    label: 'Focus hours',
    value: '31.5',
    caption: 'hours spent training your attention',
  },
  {
    label: 'Strongest habit',
    value: 'Hydrate',
    caption: 'the small ritual you honored most often',
  },
  {
    label: 'Best week',
    value: 'Week 3',
    caption: 'your clearest stretch of consistency',
  },
]

export const wrappedMoments = [
  {
    season: 'Summer Reset',
    symbol: 'Amethyst',
    headline: 'You became steadier than your mood.',
    body: 'Even on lower-energy days, you kept enough of the ritual alive to stay connected to the season.',
    accent: 'teal' as Accent,
  },
  {
    season: 'Summer Reset',
    symbol: 'Amethyst',
    headline: 'Your missed opportunity was sleep.',
    body: 'The next level is not more effort. It is protecting recovery so the effort compounds.',
    accent: 'rose' as Accent,
  },
]

export function moodFor(value: number) {
  return (
    MOOD_SCALE.find((mood) => mood.value === Math.round(value)) ??
    MOOD_SCALE[2]
  )
}

export function generateHeatmap(weeks: number): HeatmapDay[] {
  const totalDays = weeks * 7
  const start = new Date('2026-01-01T00:00:00')

  return Array.from({ length: totalDays }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)

    const count = (index * 3 + (index % 5)) % 5
    return {
      date: date.toISOString().slice(0, 10),
      count,
      level: count,
    }
  })
}
