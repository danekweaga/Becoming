import type { PrismaClient } from "@prisma/client";

export const DEMO_EMAIL = "daniel@becoming.app";

function mulberry32(seed: number) {
  return function random() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Removes only the Daniel demo user graph. Cascades clear visions, seasons,
 * goals, habits, check-ins, and logs through the schema relations.
 */
export async function resetDemoData(prisma: PrismaClient) {
  await prisma.user.deleteMany({
    where: { email: DEMO_EMAIL },
  });
}

/**
 * Creates the full Daniel demo dataset: user, 2026 vision, yearly goals,
 * Summer Reset season, season goals, 4 habits, and 21 daily check-ins with
 * habit logs. Idempotent — clears the existing demo user first.
 */
export async function seedDemoData(prisma: PrismaClient) {
  await resetDemoData(prisma);

  const user = await prisma.user.create({
    data: {
      name: "Daniel",
      email: DEMO_EMAIL,
    },
  });

  const yearlyVision = await prisma.yearlyVision.create({
    data: {
      userId: user.id,
      year: 2026,
      yearTheme: "Discipline",
      identityStatement:
        "I am becoming focused, healthy, and consistent through small daily commitments.",
    },
  });

  await prisma.yearlyGoal.createMany({
    data: [
      {
        visionId: yearlyVision.id,
        title: "Work out 150 times",
        category: "Health",
        targetValue: 150,
        currentValue: 42,
        unit: "sessions",
        why: "Build strength and consistency",
      },
      {
        visionId: yearlyVision.id,
        title: "120 deep work hours",
        category: "Focus",
        targetValue: 120,
        currentValue: 51,
        unit: "hours",
        why: "Ship meaningful work",
      },
      {
        visionId: yearlyVision.id,
        title: "Reach out to 60 people",
        category: "Connection",
        targetValue: 60,
        currentValue: 20,
        unit: "people",
        why: "Be more intentional in relationships",
      },
    ],
  });

  const season = await prisma.season.create({
    data: {
      userId: user.id,
      visionId: yearlyVision.id,
      name: "Summer Reset",
      startDate: new Date("2026-06-22T00:00:00.000Z"),
      endDate: new Date("2026-09-21T23:59:59.000Z"),
      seasonIdentity:
        "I am becoming disciplined with my body, time, and focus.",
      gemType: "gold",
      completionScore: 0,
      gemLevel: "Clouded Gem",
    },
  });

  await prisma.seasonGoal.createMany({
    data: [
      {
        seasonId: season.id,
        title: "Move my body 36 times",
        category: "Health",
        targetValue: 36,
        currentValue: 15,
        unit: "sessions",
        weight: 1,
      },
      {
        seasonId: season.id,
        title: "75 focused hours",
        category: "Focus",
        targetValue: 75,
        currentValue: 28,
        unit: "hours",
        weight: 1,
      },
      {
        seasonId: season.id,
        title: "Drink 8 cups of water on 30 days",
        category: "Wellness",
        targetValue: 30,
        currentValue: 11,
        unit: "days",
        weight: 1,
      },
    ],
  });

  const habits = await Promise.all([
    prisma.habit.create({
      data: {
        seasonId: season.id,
        name: "Workout",
        category: "Health",
        cadence: "daily",
        targetFrequency: 1,
        color: "gold",
      },
    }),
    prisma.habit.create({
      data: {
        seasonId: season.id,
        name: "Deep work block",
        category: "Focus",
        cadence: "daily",
        targetFrequency: 90,
        color: "teal",
      },
    }),
    prisma.habit.create({
      data: {
        seasonId: season.id,
        name: "Hydrate",
        category: "Wellness",
        cadence: "daily",
        targetFrequency: 8,
        color: "sage",
      },
    }),
    prisma.habit.create({
      data: {
        seasonId: season.id,
        name: "Journal",
        category: "Mindset",
        cadence: "daily",
        targetFrequency: 1,
        color: "rose",
      },
    }),
  ]);

  const reflections = [
    "Felt the pull to do everything at once. Chose one thing and finished it.",
    "Connection over productivity. No regrets.",
    "Low energy but I still showed up for the essentials.",
    "A calmer day. Better focus in the afternoon than expected.",
    "Protected the morning and the rest of the day followed.",
    "I was tired, but small wins still counted.",
    "The routine feels less like effort and more like identity.",
  ];

  const random = mulberry32(20260623);
  const checkinCount = 21;
  const endDate = new Date("2026-07-12T12:00:00.000Z");

  for (let i = 0; i < checkinCount; i += 1) {
    const date = new Date(endDate);
    date.setDate(endDate.getDate() - (checkinCount - 1 - i));

    const moodScore = 5 + Math.floor(random() * 5); // 5..9 (1-10 scale)
    const energyScore = 4 + Math.floor(random() * 6); // 4..9
    const focusMinutes = 35 + Math.floor(random() * 90); // 35..124
    const waterCups = 4 + Math.floor(random() * 5); // 4..8
    const reflection = reflections[i % reflections.length];

    const checkin = await prisma.dailyCheckin.create({
      data: {
        userId: user.id,
        seasonId: season.id,
        checkinDate: date,
        moodScore,
        energyScore,
        focusMinutes,
        waterCups,
        reflection,
      },
    });

    const completionBias = i > 13 ? 0.25 : 0.35;
    await prisma.habitLog.createMany({
      data: habits.map((habit) => ({
        dailyCheckinId: checkin.id,
        habitId: habit.id,
        completed: random() > completionBias,
      })),
    });
  }

  return {
    userName: user.name,
    userEmail: user.email,
    visionYear: yearlyVision.year,
    visionTheme: yearlyVision.yearTheme,
    seasonName: season.name,
    habitCount: habits.length,
    checkinCount,
  };
}
