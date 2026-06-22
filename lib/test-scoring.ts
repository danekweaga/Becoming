import {
  calculateSeasonScore,
  calculateGemLevel,
  generateWrappedCards,
  type Habit,
  type Season,
  type SeasonGoal,
  type DailyCheckin,
} from "./scoring";

const season: Season = {
  id: "season_1",
  name: "Summer Reset",
  startDate: "2026-06-01",
  endDate: "2026-08-31",
};

const goals: SeasonGoal[] = [
  {
    id: "goal_1",
    title: "Work out 36 times",
    category: "Health",
    targetValue: 36,
    currentValue: 20,
    unit: "workouts",
    weight: 1,
  },
  {
    id: "goal_2",
    title: "Study 120 focused hours",
    category: "Learning",
    targetValue: 120,
    currentValue: 55,
    unit: "hours",
    weight: 1,
  },
];

const habits: Habit[] = [
  {
    id: "habit_1",
    name: "Workout",
    category: "Health",
  },
  {
    id: "habit_2",
    name: "Study",
    category: "Learning",
  },
  {
    id: "habit_3",
    name: "Hydrate",
    category: "Health",
  },
];

const checkins: DailyCheckin[] = [
  {
    id: "checkin_1",
    checkinDate: "2026-06-01",
    moodScore: 7,
    energyScore: 6,
    focusMinutes: 90,
    waterCups: 6,
    reflection: "Good first day.",
    habitLogs: [
      { habitId: "habit_1", completed: true },
      { habitId: "habit_2", completed: true },
      { habitId: "habit_3", completed: false },
    ],
  },
  {
    id: "checkin_2",
    checkinDate: "2026-06-02",
    moodScore: 8,
    energyScore: 7,
    focusMinutes: 120,
    waterCups: 7,
    reflection: "Better focus today.",
    habitLogs: [
      { habitId: "habit_1", completed: true },
      { habitId: "habit_2", completed: true },
      { habitId: "habit_3", completed: true },
    ],
  },
];

const score = calculateSeasonScore({ goals, checkins });
const gem = calculateGemLevel(score);
const wrapped = generateWrappedCards({ season, goals, habits, checkins });

console.log("Season score:", score);
console.log("Gem level:", gem);
console.log("Wrapped cards:", wrapped);