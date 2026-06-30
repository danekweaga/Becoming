import { db } from "@/lib/db";
import {
  calculateBestStreak,
  calculateGemLevel,
  calculateHabitCompletionRate,
  calculateSeasonScore,
  createContributionHeatmapData,
  generateWrappedCards,
  type DailyCheckin,
  type Habit,
  type SeasonGoal,
  type WrappedCardDraft,
} from "@/lib/scoring";

type Accent = "gold" | "teal" | "sage" | "rose" | "iris";

export type DashboardHabit = {
  id: string;
  name: string;
  cadence: "daily" | "weekly";
  target: number;
  unit: string;
  accent: Accent;
  streak: number;
  completionRate: number;
};

export type DashboardSeason = {
  id: string;
  name: string;
  symbol: string;
  accent: Accent;
  focus: string;
  startDate: string;
  endDate: string;
  habits: DashboardHabit[];
};

export type DashboardStats = {
  daysIn: number;
  totalDays: number;
  habitsHonored: number;
  longestStreak: number;
  consistency: number;
  avgMood: number;
  avgEnergy: number;
  avgSleep: number;
  seasonScore: number;
  gemLevel: string;
  habitCompletionRates: Record<string, number>;
};

export type DashboardHeatmapDay = {
  date: string;
  level: number;
  count: number;
};

export type DashboardLog = {
  id: string;
  date: string;
  mood: number;
  reflection: string;
  gratitude: string;
};

export type DashboardData = {
  user: {
    id: string;
    name: string;
  };
  vision: {
    id: string;
    year: number;
    word: string;
    statement: string;
    themes: string[];
  };
  season: DashboardSeason;
  stats: DashboardStats;
  heatmapDays: DashboardHeatmapDay[];
  recentLogs: DashboardLog[];
};

const DEMO_EMAIL = "daniel@becoming.app";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function roundToOne(value: number) {
  return Math.round(value * 10) / 10;
}

function daysBetween(start: Date, end: Date): number {
  const diffMs = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

function daysElapsed(start: Date, today: Date): number {
  const diffMs = today.getTime() - start.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

function toAccent(value: string | null | undefined): Accent {
  const token = value?.toLowerCase();
  if (
    token === "gold" ||
    token === "teal" ||
    token === "sage" ||
    token === "rose" ||
    token === "iris"
  ) {
    return token;
  }
  return "gold";
}

function accentToSymbol(accent: Accent): string {
  const map: Record<Accent, string> = {
    gold: "Citrine",
    teal: "Aquamarine",
    sage: "Jade",
    rose: "Amber",
    iris: "Onyx",
  };
  return map[accent];
}

function inferHabitUnit(habitName: string, cadence: "daily" | "weekly") {
  const lower = habitName.toLowerCase();
  if (lower.includes("hydrate")) return "cups";
  if (lower.includes("work")) return "min";
  if (lower.includes("journal") || lower.includes("pages")) return "entry";
  if (lower.includes("workout") || lower.includes("move")) return "session";
  return cadence === "weekly" ? "times" : "sessions";
}

function computeHabitStreak(
  habitId: string,
  checkinsAsc: {
    checkinDate: Date;
    habitLogs: { habitId: string; completed: boolean }[];
  }[],
) {
  const sortedDesc = [...checkinsAsc].sort(
    (a, b) => b.checkinDate.getTime() - a.checkinDate.getTime(),
  );
  let streak = 0;

  for (const checkin of sortedDesc) {
    const log = checkin.habitLogs.find((entry) => entry.habitId === habitId);
    if (log?.completed) {
      streak += 1;
      continue;
    }
    break;
  }

  return streak;
}

function buildHabitCompletionRates(
  checkins: DailyCheckin[],
  habitIds: string[],
): Record<string, number> {
  const rates: Record<string, number> = {};

  for (const habitId of habitIds) {
    const logs = checkins.flatMap((checkin) =>
      checkin.habitLogs.filter((log) => log.habitId === habitId),
    );
    if (logs.length === 0) {
      rates[habitId] = 0;
      continue;
    }

    const completed = logs.filter((log) => log.completed).length;
    rates[habitId] = completed / logs.length;
  }

  return rates;
}

export async function getDashboardData(): Promise<DashboardData> {
  const user =
    (await db.user.findUnique({
      where: { email: DEMO_EMAIL },
    })) ??
    (await db.user.findFirst({
      orderBy: { createdAt: "asc" },
    }));

  if (!user) {
    throw new Error("No users found. Run `npm run db:seed` first.");
  }

  const yearlyVision =
    (await db.yearlyVision.findFirst({
      where: { userId: user.id, year: 2026 },
      include: { yearlyGoals: true },
    })) ??
    (await db.yearlyVision.findFirst({
      where: { userId: user.id },
      include: { yearlyGoals: true },
      orderBy: { year: "desc" },
    }));

  if (!yearlyVision) {
    throw new Error("No yearly vision found for user. Run `npm run db:seed`.");
  }

  const today = new Date();
  const seasonCandidates = await db.season.findMany({
    where: { userId: user.id },
    include: {
      seasonGoals: true,
      habits: true,
      dailyCheckins: {
        include: {
          habitLogs: true,
        },
        orderBy: { checkinDate: "asc" },
      },
    },
    orderBy: { startDate: "asc" },
  });

  const season =
    seasonCandidates.find(
      (entry) => entry.startDate <= today && entry.endDate >= today,
    ) ??
    seasonCandidates.find((entry) => entry.name === "Summer Reset") ??
    seasonCandidates[seasonCandidates.length - 1];

  if (!season) {
    throw new Error("No season found for user. Run `npm run db:seed`.");
  }

  const checkinsForScoring: DailyCheckin[] = season.dailyCheckins.map((checkin) => ({
    id: checkin.id,
    checkinDate: checkin.checkinDate,
    moodScore: clamp(checkin.moodScore ?? 6, 1, 10),
    energyScore: clamp(checkin.energyScore ?? 6, 1, 10),
    focusMinutes: checkin.focusMinutes,
    waterCups: checkin.waterCups,
    reflection: checkin.reflection,
    habitLogs: checkin.habitLogs.map((log) => ({
      habitId: log.habitId,
      completed: log.completed,
    })),
  }));

  const goalsForScoring: SeasonGoal[] = season.seasonGoals.map((goal) => ({
    id: goal.id,
    title: goal.title,
    category: goal.category,
    targetValue: goal.targetValue,
    currentValue: goal.currentValue,
    unit: goal.unit,
    weight: goal.weight,
  }));

  const seasonScore = calculateSeasonScore({
    goals: goalsForScoring,
    checkins: checkinsForScoring,
  });

  const habitCompletionRates = buildHabitCompletionRates(
    checkinsForScoring,
    season.habits.map((habit) => habit.id),
  );

  const habitsHonored = checkinsForScoring.reduce((sum, checkin) => {
    return sum + checkin.habitLogs.filter((log) => log.completed).length;
  }, 0);

  const avgMood10 =
    checkinsForScoring.length === 0
      ? 0
      : checkinsForScoring.reduce((sum, checkin) => sum + checkin.moodScore, 0) /
        checkinsForScoring.length;
  const avgEnergy10 =
    checkinsForScoring.length === 0
      ? 0
      : checkinsForScoring.reduce(
          (sum, checkin) => sum + checkin.energyScore,
          0,
        ) / checkinsForScoring.length;

  const accent = toAccent(season.gemType);
  const currentSeason: DashboardSeason = {
    id: season.id,
    name: season.name,
    symbol: accentToSymbol(accent),
    accent,
    focus:
      season.seasonGoals[0]?.category ??
      yearlyVision.yearlyGoals[0]?.category ??
      "Growth",
    startDate: season.startDate.toISOString().slice(0, 10),
    endDate: season.endDate.toISOString().slice(0, 10),
    habits: season.habits.map((habit) => {
      const cadence = habit.cadence === "weekly" ? "weekly" : "daily";
      const habitAccent = toAccent(habit.color);
      return {
        id: habit.id,
        name: habit.name,
        cadence,
        target: habit.targetFrequency ?? 1,
        unit: inferHabitUnit(habit.name, cadence),
        accent: habitAccent,
        streak: computeHabitStreak(habit.id, season.dailyCheckins),
        completionRate: habitCompletionRates[habit.id] ?? 0,
      };
    }),
  };

  const heatmapDays: DashboardHeatmapDay[] =
    createContributionHeatmapData(checkinsForScoring).map((entry) => ({
      date: entry.date,
      level: entry.level,
      count: Math.round(
        (entry.completionRate / 100) * Math.max(1, currentSeason.habits.length),
      ),
    }));

  const recentLogs: DashboardLog[] = [...season.dailyCheckins]
    .sort((a, b) => b.checkinDate.getTime() - a.checkinDate.getTime())
    .slice(0, 3)
    .map((checkin) => ({
      id: checkin.id,
      date: checkin.checkinDate.toISOString().slice(0, 10),
      mood: clamp(Math.round((checkin.moodScore ?? 6) / 2), 1, 5),
      reflection:
        checkin.reflection?.trim() ||
        "Showed up and kept the season moving forward.",
      gratitude:
        checkin.waterCups >= 7
          ? "staying hydrated and grounded today."
          : "showing up even on low-energy days.",
    }));

  const stats: DashboardStats = {
    daysIn: daysElapsed(season.startDate, today),
    totalDays: daysBetween(season.startDate, season.endDate),
    habitsHonored,
    longestStreak: calculateBestStreak(checkinsForScoring),
    consistency: calculateHabitCompletionRate(checkinsForScoring) / 100,
    avgMood: roundToOne(avgMood10 / 2),
    avgEnergy: roundToOne(avgEnergy10 / 2),
    avgSleep: roundToOne(6 + avgEnergy10 / 5),
    seasonScore,
    gemLevel: calculateGemLevel(seasonScore),
    habitCompletionRates,
  };

  return {
    user: {
      id: user.id,
      name: user.name,
    },
    vision: {
      id: yearlyVision.id,
      year: yearlyVision.year,
      word: yearlyVision.yearTheme || "Becoming",
      statement:
        yearlyVision.identityStatement ||
        "Who are you becoming this year?",
      themes: [...new Set(yearlyVision.yearlyGoals.map((goal) => goal.category))],
    },
    season: currentSeason,
    stats,
    heatmapDays,
    recentLogs,
  };
}

export type WrappedData = {
  user: { id: string; name: string };
  vision: { year: number; word: string; statement: string };
  season: {
    id: string;
    name: string;
    accent: Accent;
    symbol: string;
    focus: string;
    daysIn: number;
    seasonScore: number;
    gemLevel: string;
  };
  cards: WrappedCardDraft[];
};

/**
 * Loads the active season for the demo user and generates Wrapped recap cards
 * directly from Aurora data via lib/scoring. No saved cards required.
 */
export async function getWrappedData(): Promise<WrappedData> {
  const user =
    (await db.user.findUnique({ where: { email: DEMO_EMAIL } })) ??
    (await db.user.findFirst({ orderBy: { createdAt: "asc" } }));

  if (!user) {
    throw new Error("No users found. Run `npm run db:seed` first.");
  }

  const yearlyVision =
    (await db.yearlyVision.findFirst({
      where: { userId: user.id, year: 2026 },
      include: { yearlyGoals: true },
    })) ??
    (await db.yearlyVision.findFirst({
      where: { userId: user.id },
      include: { yearlyGoals: true },
      orderBy: { year: "desc" },
    }));

  const today = new Date();
  const seasonCandidates = await db.season.findMany({
    where: { userId: user.id },
    include: {
      seasonGoals: true,
      habits: true,
      dailyCheckins: { include: { habitLogs: true }, orderBy: { checkinDate: "asc" } },
    },
    orderBy: { startDate: "asc" },
  });

  const season =
    seasonCandidates.find(
      (entry) => entry.startDate <= today && entry.endDate >= today,
    ) ??
    seasonCandidates.find((entry) => entry.name === "Summer Reset") ??
    seasonCandidates[seasonCandidates.length - 1];

  if (!season) {
    throw new Error("No season found for user. Run `npm run db:seed`.");
  }

  const checkins: DailyCheckin[] = season.dailyCheckins.map((checkin) => ({
    id: checkin.id,
    checkinDate: checkin.checkinDate,
    moodScore: clamp(checkin.moodScore ?? 6, 1, 10),
    energyScore: clamp(checkin.energyScore ?? 6, 1, 10),
    focusMinutes: checkin.focusMinutes,
    waterCups: checkin.waterCups,
    reflection: checkin.reflection,
    habitLogs: checkin.habitLogs.map((log) => ({
      habitId: log.habitId,
      completed: log.completed,
    })),
  }));

  const goals: SeasonGoal[] = season.seasonGoals.map((goal) => ({
    id: goal.id,
    title: goal.title,
    category: goal.category,
    targetValue: goal.targetValue,
    currentValue: goal.currentValue,
    unit: goal.unit,
    weight: goal.weight,
  }));

  const habits: Habit[] = season.habits.map((habit) => ({
    id: habit.id,
    name: habit.name,
    category: habit.category ?? "Growth",
    targetFrequency: habit.targetFrequency ?? 1,
    color: habit.color ?? undefined,
  }));

  const cards = generateWrappedCards({
    season: {
      id: season.id,
      name: season.name,
      startDate: season.startDate,
      endDate: season.endDate,
    },
    goals,
    habits,
    checkins,
  });

  const seasonScore = calculateSeasonScore({ goals, checkins });
  const accent = toAccent(season.gemType);

  return {
    user: { id: user.id, name: user.name },
    vision: {
      year: yearlyVision?.year ?? today.getFullYear(),
      word: yearlyVision?.yearTheme || "Becoming",
      statement:
        yearlyVision?.identityStatement ||
        "Who are you becoming this year?",
    },
    season: {
      id: season.id,
      name: season.name,
      accent,
      symbol: accentToSymbol(accent),
      focus: season.seasonGoals[0]?.category ?? "Growth",
      daysIn: daysElapsed(season.startDate, today),
      seasonScore,
      gemLevel: calculateGemLevel(seasonScore),
    },
    cards,
  };
}

export type CheckinHabit = {
  id: string
  name: string
  cadence: 'daily' | 'weekly'
}

export type CheckinContext = {
  seasonName: string
  habits: CheckinHabit[]
}

/**
 * Loads the active season name and its habits so the check-in form can render
 * real habits to toggle.
 */
export async function getCheckinContext(): Promise<CheckinContext> {
  const user =
    (await db.user.findUnique({ where: { email: DEMO_EMAIL } })) ??
    (await db.user.findFirst({ orderBy: { createdAt: "asc" } }));

  if (!user) {
    throw new Error("No users found. Run `npm run db:seed` first.");
  }

  const today = new Date();
  const seasons = await db.season.findMany({
    where: { userId: user.id },
    include: { habits: true },
    orderBy: { startDate: "asc" },
  });

  const season =
    seasons.find((s) => s.startDate <= today && s.endDate >= today) ??
    seasons.find((s) => s.name === "Summer Reset") ??
    seasons[seasons.length - 1];

  if (!season) {
    throw new Error("No season found for user. Run `npm run db:seed`.");
  }

  return {
    seasonName: season.name,
    habits: season.habits.map((habit) => ({
      id: habit.id,
      name: habit.name,
      cadence: habit.cadence === "weekly" ? "weekly" : "daily",
    })),
  };
}

export async function getDashboardUserName() {
  const user =
    (await db.user.findUnique({
      where: { email: DEMO_EMAIL },
      select: { name: true },
    })) ??
    (await db.user.findFirst({
      select: { name: true },
      orderBy: { createdAt: "asc" },
    }));

  return user?.name ?? "Daniel";
}
