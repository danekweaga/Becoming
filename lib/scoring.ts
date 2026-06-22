// lib/scoring.ts

export type PaceStatus = "ahead" | "on_pace" | "behind" | "completed" | "not_started";

export type GemLevel =
  | "Rough Stone"
  | "Clouded Gem"
  | "Cut Gem"
  | "Polished Gem"
  | "Radiant Gem";

export type WrappedCardDraft = {
  cardType: string;
  title: string;
  value: string;
  description: string;
  sortOrder: number;
};

export type Habit = {
  id: string;
  name: string;
  category: string;
  targetFrequency?: number;
  color?: string;
};

export type HabitLog = {
  habitId: string;
  completed: boolean;
};

export type DailyCheckin = {
  id: string;
  checkinDate: string | Date;
  moodScore: number; // 1-10
  energyScore: number; // 1-10
  focusMinutes: number;
  waterCups: number;
  reflection?: string | null;
  habitLogs: HabitLog[];
};

export type SeasonGoal = {
  id: string;
  title: string;
  category: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  weight?: number;
};

export type Season = {
  id: string;
  name: string;
  startDate: string | Date;
  endDate: string | Date;
  completionScore?: number;
  gemLevel?: GemLevel | string;
};

export type GoalPaceResult = {
  goalId: string;
  status: PaceStatus;
  actualProgress: number;
  expectedProgress: number;
  difference: number;
};

/**
 * Converts a string or Date into a Date object.
 */
function toDate(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value);
}

/**
 * Keeps a number inside a safe min/max range.
 */
function clamp(value: number, min = 0, max = 100): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Rounds a number to a fixed number of decimals.
 */
function round(value: number, decimals = 1): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/**
 * Returns the number of days between two dates.
 */
function daysBetween(start: string | Date, end: string | Date): number {
  const startDate = toDate(start);
  const endDate = toDate(end);

  const diffMs = endDate.getTime() - startDate.getTime();
  return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

/**
 * Returns how many days have passed in the season.
 */
function daysElapsed(start: string | Date, today: string | Date = new Date()): number {
  const startDate = toDate(start);
  const todayDate = toDate(today);

  const diffMs = todayDate.getTime() - startDate.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

/**
 * Calculates habit completion rate from all habit logs.
 * Example: 80 completed logs out of 100 total logs = 80%.
 */
export function calculateHabitCompletionRate(checkins: DailyCheckin[]): number {
  const allLogs = checkins.flatMap((checkin) => checkin.habitLogs);

  if (allLogs.length === 0) return 0;

  const completedLogs = allLogs.filter((log) => log.completed).length;

  return round((completedLogs / allLogs.length) * 100);
}

/**
 * Calculates weighted goal progress.
 * Each goal can have a weight, but defaults to 1.
 */
export function calculateGoalProgress(goals: SeasonGoal[]): number {
  if (goals.length === 0) return 0;

  const totalWeight = goals.reduce((sum, goal) => sum + (goal.weight ?? 1), 0);

  if (totalWeight === 0) return 0;

  const weightedProgress = goals.reduce((sum, goal) => {
    if (goal.targetValue <= 0) return sum;

    const rawProgress = goal.currentValue / goal.targetValue;
    const clampedProgress = clamp(rawProgress, 0, 1);
    const weight = goal.weight ?? 1;

    return sum + clampedProgress * weight;
  }, 0);

  return round((weightedProgress / totalWeight) * 100);
}

/**
 * Calculates how consistent the user is with focus time.
 * Example: If target is 60 minutes/day and user averages 45 minutes/day,
 * focus consistency is 75%.
 */
export function calculateFocusConsistency(
  checkins: DailyCheckin[],
  targetFocusMinutesPerDay = 60
): number {
  if (checkins.length === 0 || targetFocusMinutesPerDay <= 0) return 0;

  const totalFocus = checkins.reduce((sum, checkin) => sum + checkin.focusMinutes, 0);
  const targetFocus = checkins.length * targetFocusMinutesPerDay;

  return round(clamp((totalFocus / targetFocus) * 100));
}

/**
 * Converts mood and energy scores into a 0-100 wellness score.
 */
export function calculateMoodEnergyAverage(checkins: DailyCheckin[]): number {
  if (checkins.length === 0) return 0;

  const totalMood = checkins.reduce((sum, checkin) => sum + checkin.moodScore, 0);
  const totalEnergy = checkins.reduce((sum, checkin) => sum + checkin.energyScore, 0);

  const averageMood = totalMood / checkins.length;
  const averageEnergy = totalEnergy / checkins.length;

  // Mood and energy are both out of 10, so combined max is 20.
  return round(((averageMood + averageEnergy) / 20) * 100);
}

/**
 * Calculates how often the user writes reflections.
 */
export function calculateReflectionConsistency(checkins: DailyCheckin[]): number {
  if (checkins.length === 0) return 0;

  const reflections = checkins.filter((checkin) => {
    return checkin.reflection && checkin.reflection.trim().length > 0;
  });

  return round((reflections.length / checkins.length) * 100);
}

/**
 * Main Becoming season score.
 *
 * Season Score =
 * 40% habit completion
 * 25% goal progress
 * 15% focus consistency
 * 10% mood/energy average
 * 10% reflection consistency
 */
export function calculateSeasonScore(params: {
  goals: SeasonGoal[];
  checkins: DailyCheckin[];
  targetFocusMinutesPerDay?: number;
}): number {
  const { goals, checkins, targetFocusMinutesPerDay = 60 } = params;

  const habitCompletion = calculateHabitCompletionRate(checkins);
  const goalProgress = calculateGoalProgress(goals);
  const focusConsistency = calculateFocusConsistency(checkins, targetFocusMinutesPerDay);
  const moodEnergyAverage = calculateMoodEnergyAverage(checkins);
  const reflectionConsistency = calculateReflectionConsistency(checkins);

  const score =
    habitCompletion * 0.4 +
    goalProgress * 0.25 +
    focusConsistency * 0.15 +
    moodEnergyAverage * 0.1 +
    reflectionConsistency * 0.1;

  return round(clamp(score));
}

/**
 * Converts season score into gem level.
 */
export function calculateGemLevel(score: number): GemLevel {
  if (score <= 20) return "Rough Stone";
  if (score <= 40) return "Clouded Gem";
  if (score <= 60) return "Cut Gem";
  if (score <= 80) return "Polished Gem";
  return "Radiant Gem";
}

/**
 * Calculates if a goal is ahead, on pace, or behind.
 */
export function calculateGoalPace(
  goal: SeasonGoal,
  season: Pick<Season, "startDate" | "endDate">,
  today: string | Date = new Date()
): GoalPaceResult {
  if (goal.targetValue <= 0) {
    return {
      goalId: goal.id,
      status: "not_started",
      actualProgress: 0,
      expectedProgress: 0,
      difference: 0,
    };
  }

  const totalSeasonDays = daysBetween(season.startDate, season.endDate);
  const elapsed = daysElapsed(season.startDate, today);

  const expectedProgress = clamp(elapsed / totalSeasonDays, 0, 1);
  const actualProgress = clamp(goal.currentValue / goal.targetValue, 0, 1);
  const difference = actualProgress - expectedProgress;

  let status: PaceStatus = "on_pace";

  if (actualProgress >= 1) {
    status = "completed";
  } else if (elapsed === 0) {
    status = "not_started";
  } else if (difference >= 0.1) {
    status = "ahead";
  } else if (difference <= -0.1) {
    status = "behind";
  }

  return {
    goalId: goal.id,
    status,
    actualProgress: round(actualProgress * 100),
    expectedProgress: round(expectedProgress * 100),
    difference: round(difference * 100),
  };
}

/**
 * Calculates the completion rate for a single check-in day.
 */
export function calculateCheckinCompletionRate(checkin: DailyCheckin): number {
  if (checkin.habitLogs.length === 0) return 0;

  const completed = checkin.habitLogs.filter((log) => log.completed).length;

  return round((completed / checkin.habitLogs.length) * 100);
}

/**
 * Calculates best streak based on check-ins where completion rate
 * is above a threshold.
 */
export function calculateBestStreak(
  checkins: DailyCheckin[],
  successThreshold = 80
): number {
  if (checkins.length === 0) return 0;

  const sorted = [...checkins].sort((a, b) => {
    return toDate(a.checkinDate).getTime() - toDate(b.checkinDate).getTime();
  });

  let bestStreak = 0;
  let currentStreak = 0;
  let previousDate: Date | null = null;

  for (const checkin of sorted) {
    const currentDate = toDate(checkin.checkinDate);
    const completionRate = calculateCheckinCompletionRate(checkin);
    const successfulDay = completionRate >= successThreshold;

    if (!successfulDay) {
      currentStreak = 0;
      previousDate = currentDate;
      continue;
    }

    if (!previousDate) {
      currentStreak = 1;
    } else {
      const gap = daysBetween(previousDate, currentDate);

      if (gap <= 1) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }
    }

    bestStreak = Math.max(bestStreak, currentStreak);
    previousDate = currentDate;
  }

  return bestStreak;
}

/**
 * Finds the habit with the highest completion rate.
 */
export function findStrongestHabit(
  habits: Habit[],
  checkins: DailyCheckin[]
): {
  habit: Habit | null;
  completionRate: number;
  completedCount: number;
} {
  if (habits.length === 0 || checkins.length === 0) {
    return {
      habit: null,
      completionRate: 0,
      completedCount: 0,
    };
  }

  let bestHabit: Habit | null = null;
  let bestRate = 0;
  let bestCompletedCount = 0;

  for (const habit of habits) {
    const logs = checkins.flatMap((checkin) =>
      checkin.habitLogs.filter((log) => log.habitId === habit.id)
    );

    if (logs.length === 0) continue;

    const completed = logs.filter((log) => log.completed).length;
    const rate = (completed / logs.length) * 100;

    if (rate > bestRate) {
      bestHabit = habit;
      bestRate = rate;
      bestCompletedCount = completed;
    }
  }

  return {
    habit: bestHabit,
    completionRate: round(bestRate),
    completedCount: bestCompletedCount,
  };
}

/**
 * Finds the habit with the lowest completion rate.
 */
export function findMostMissedHabit(
  habits: Habit[],
  checkins: DailyCheckin[]
): {
  habit: Habit | null;
  completionRate: number;
  missedCount: number;
} {
  if (habits.length === 0 || checkins.length === 0) {
    return {
      habit: null,
      completionRate: 0,
      missedCount: 0,
    };
  }

  let weakestHabit: Habit | null = null;
  let weakestRate = 101;
  let missedCount = 0;

  for (const habit of habits) {
    const logs = checkins.flatMap((checkin) =>
      checkin.habitLogs.filter((log) => log.habitId === habit.id)
    );

    if (logs.length === 0) continue;

    const completed = logs.filter((log) => log.completed).length;
    const missed = logs.length - completed;
    const rate = (completed / logs.length) * 100;

    if (rate < weakestRate) {
      weakestHabit = habit;
      weakestRate = rate;
      missedCount = missed;
    }
  }

  return {
    habit: weakestHabit,
    completionRate: weakestRate === 101 ? 0 : round(weakestRate),
    missedCount,
  };
}

/**
 * Calculates total focus hours from check-ins.
 */
export function calculateTotalFocusHours(checkins: DailyCheckin[]): number {
  const totalMinutes = checkins.reduce((sum, checkin) => sum + checkin.focusMinutes, 0);

  return round(totalMinutes / 60, 1);
}

/**
 * Groups check-ins into rough week numbers and finds the best week
 * based on average habit completion.
 */
export function findBestWeek(checkins: DailyCheckin[]): {
  label: string;
  averageCompletion: number;
} {
  if (checkins.length === 0) {
    return {
      label: "No week yet",
      averageCompletion: 0,
    };
  }

  const sorted = [...checkins].sort((a, b) => {
    return toDate(a.checkinDate).getTime() - toDate(b.checkinDate).getTime();
  });

  const firstDate = toDate(sorted[0].checkinDate);

  const weeks = new Map<number, number[]>();

  for (const checkin of sorted) {
    const currentDate = toDate(checkin.checkinDate);
    const dayOffset = daysBetween(firstDate, currentDate);
    const weekNumber = Math.ceil(dayOffset / 7);

    const completion = calculateCheckinCompletionRate(checkin);

    if (!weeks.has(weekNumber)) {
      weeks.set(weekNumber, []);
    }

    weeks.get(weekNumber)?.push(completion);
  }

  let bestWeek = 1;
  let bestAverage = 0;

  for (const [weekNumber, completionRates] of weeks.entries()) {
    const average =
      completionRates.reduce((sum, rate) => sum + rate, 0) / completionRates.length;

    if (average > bestAverage) {
      bestAverage = average;
      bestWeek = weekNumber;
    }
  }

  return {
    label: `Week ${bestWeek}`,
    averageCompletion: round(bestAverage),
  };
}

/**
 * Creates a simple mood insight.
 */
export function getMoodPattern(checkins: DailyCheckin[]): string {
  if (checkins.length === 0) {
    return "No mood data yet.";
  }

  const highCompletionDays = checkins.filter(
    (checkin) => calculateCheckinCompletionRate(checkin) >= 80
  );

  const lowCompletionDays = checkins.filter(
    (checkin) => calculateCheckinCompletionRate(checkin) < 80
  );

  const averageMood = (items: DailyCheckin[]) => {
    if (items.length === 0) return 0;
    return items.reduce((sum, item) => sum + item.moodScore, 0) / items.length;
  };

  const highMood = averageMood(highCompletionDays);
  const lowMood = averageMood(lowCompletionDays);

  if (highMood > lowMood + 1) {
    return "Your mood was noticeably better on high-consistency days.";
  }

  if (lowMood > highMood + 1) {
    return "Your mood did not always depend on habit completion, which may mean rest and context mattered this season.";
  }

  return "Your mood stayed fairly steady across both strong and weaker habit days.";
}

/**
 * Finds the category with the highest progress.
 */
export function findMostImprovedCategory(goals: SeasonGoal[]): {
  category: string;
  progress: number;
} {
  if (goals.length === 0) {
    return {
      category: "No category yet",
      progress: 0,
    };
  }

  const categoryMap = new Map<string, number[]>();

  for (const goal of goals) {
    const progress =
      goal.targetValue <= 0 ? 0 : clamp(goal.currentValue / goal.targetValue, 0, 1) * 100;

    if (!categoryMap.has(goal.category)) {
      categoryMap.set(goal.category, []);
    }

    categoryMap.get(goal.category)?.push(progress);
  }

  let bestCategory = "No category yet";
  let bestProgress = 0;

  for (const [category, progressValues] of categoryMap.entries()) {
    const average =
      progressValues.reduce((sum, value) => sum + value, 0) / progressValues.length;

    if (average > bestProgress) {
      bestCategory = category;
      bestProgress = average;
    }
  }

  return {
    category: bestCategory,
    progress: round(bestProgress),
  };
}

/**
 * Creates heatmap data for the dashboard.
 */
export function createContributionHeatmapData(checkins: DailyCheckin[]) {
  return checkins.map((checkin) => {
    const completionRate = calculateCheckinCompletionRate(checkin);

    let level = 0;

    if (completionRate > 0) level = 1;
    if (completionRate >= 40) level = 2;
    if (completionRate >= 70) level = 3;
    if (completionRate >= 90) level = 4;

    return {
      date: toDate(checkin.checkinDate).toISOString().slice(0, 10),
      completionRate,
      level,
    };
  });
}

/**
 * Generates the Wrapped-style recap cards for a season.
 * These can later be saved into the wrapped_cards table.
 */
export function generateWrappedCards(params: {
  season: Season;
  goals: SeasonGoal[];
  habits: Habit[];
  checkins: DailyCheckin[];
}): WrappedCardDraft[] {
  const { season, goals, habits, checkins } = params;

  const seasonScore = calculateSeasonScore({ goals, checkins });
  const gemLevel = calculateGemLevel(seasonScore);
  const strongestHabit = findStrongestHabit(habits, checkins);
  const mostMissedHabit = findMostMissedHabit(habits, checkins);
  const bestWeek = findBestWeek(checkins);
  const focusHours = calculateTotalFocusHours(checkins);
  const moodPattern = getMoodPattern(checkins);
  const improvedCategory = findMostImprovedCategory(goals);
  const bestStreak = calculateBestStreak(checkins);

  return [
    {
      cardType: "season_score",
      title: "Your season score",
      value: `${seasonScore}%`,
      description: `${season.name} reached ${gemLevel}. This score combines habits, goals, focus, mood, energy, and reflection.`,
      sortOrder: 1,
    },
    {
      cardType: "strongest_habit",
      title: "Your strongest habit",
      value: strongestHabit.habit?.name ?? "No habit yet",
      description: strongestHabit.habit
        ? `You completed ${strongestHabit.habit.name} ${strongestHabit.completedCount} times with a ${strongestHabit.completionRate}% completion rate.`
        : "Add more habit logs to reveal your strongest habit.",
      sortOrder: 2,
    },
    {
      cardType: "best_week",
      title: "Your best week",
      value: bestWeek.label,
      description: `Your best week averaged ${bestWeek.averageCompletion}% habit completion.`,
      sortOrder: 3,
    },
    {
      cardType: "focus_hours",
      title: "Total focus time",
      value: `${focusHours} hours`,
      description: `You logged ${focusHours} focused hours during this season.`,
      sortOrder: 4,
    },
    {
      cardType: "best_streak",
      title: "Best consistency streak",
      value: `${bestStreak} days`,
      description: `Your longest high-consistency streak was ${bestStreak} days.`,
      sortOrder: 5,
    },
    {
      cardType: "mood_pattern",
      title: "Mood pattern",
      value: "Pattern found",
      description: moodPattern,
      sortOrder: 6,
    },
    {
      cardType: "missed_opportunity",
      title: "Biggest missed opportunity",
      value: mostMissedHabit.habit?.name ?? "No habit yet",
      description: mostMissedHabit.habit
        ? `${mostMissedHabit.habit.name} was the habit that slipped most often, with ${mostMissedHabit.missedCount} missed logs.`
        : "Add more habit logs to reveal missed opportunities.",
      sortOrder: 7,
    },
    {
      cardType: "most_improved_category",
      title: "Most improved life area",
      value: improvedCategory.category,
      description: `${improvedCategory.category} had the strongest goal progress at ${improvedCategory.progress}%.`,
      sortOrder: 8,
    },
    {
      cardType: "final_message",
      title: "This season was proof",
      value: "Look how far you’ve come.",
      description:
        seasonScore >= 80
          ? "You did not just track progress. You built evidence of who you are becoming."
          : seasonScore >= 60
            ? "This season was not perfect, but it showed real movement. Keep building."
            : "This season showed where the gaps are. That is still useful data for your next chapter.",
      sortOrder: 9,
    },
  ];
}