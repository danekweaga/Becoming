# Becoming

**Who are you becoming this year?**

[Live demo](https://becoming-nine.vercel.app) · [Demo walkthrough](https://becoming-nine.vercel.app/demo)

---

## 1. Overview

**What it is**  
Becoming is a personal growth dashboard built around one question: who are you becoming this year? Users define a yearly vision, break it into seasonal chapters, log a daily check-in ritual, and review progress on a live dashboard. At the end of a season, Wrapped turns the same data into a recap — strongest habit, focus hours, mood patterns, what slipped.

**Who it is for**  
People who already track habits or journal but feel like they're collecting data without a story. Students in exam season. Young professionals in a "reset year." Anyone who thinks in arcs, not endless streaks.

**What problem it solves**  
Habit trackers answer *did you do the thing?* Becoming tries to answer *did the season add up to the person you said you'd become?* That requires tying vision → season goals → daily logs → aggregated score → reflection. Most apps stop at the daily log.

---

## 2. Why This Exists

Personal growth tools split the problem wrong.

A streak app gives you a number. Notion gives you a blank page. A wellness app gives you mood charts with no connection to your goals. None of them model how people actually talk about their lives: *"This is my summer reset." "This is the year I get disciplined."*

The gap is not missing features. It is missing **structure across time** — year, season, day — and a way to **look back** and see whether the arc went anywhere.

Becoming is an attempt to build that structure without turning self-improvement into guilt-driven homework.

---

## 3. Core Idea

**Three horizons, one thread of data.**

| Horizon | User question | In the app |
|---------|---------------|------------|
| Year | Who am I becoming? | Vision, word, yearly goals |
| Season | What chapter am I in right now? | Season identity, habits, season goals, gem metaphor |
| Day | Did I show up today? | Check-in: habits, mood, energy, focus, reflection |

Everything downstream — season score, gem level (Rough Stone → Radiant Gem), heatmap, Wrapped cards — is computed from the same check-in and goal data. There is no separate "analytics pipeline." The recap is not hand-authored copy; it is derived.

The product bet: people will keep showing up if progress feels like a story worth finishing, not a streak they are afraid to break.

---

## 4. Key Features

**Yearly vision**  
A theme, identity statement, and categorized yearly goals. This is the anchor — every season and check-in is supposed to connect back to it.

**Seasonal chapters**  
Each season has a name, date range, focus area, habits, and weighted season goals. The UI uses a gemstone metaphor (Citrine, Aquamarine, etc.) as a visual identity for the chapter, not just a progress bar.

**Daily check-in**  
A short ritual: mood, energy, focus minutes, water, which habits were honored, a reflection. Submitting writes to `daily_checkins` and `habit_logs` in Aurora and redirects to the dashboard so the user immediately sees the impact.

**Live dashboard**  
Season score, gem level, days in season, habit completion rates, contribution heatmap, recent reflections. All numbers come from `getDashboardData()` querying Aurora — not from `lib/mock-data.ts`.

**Wrapped recap**  
`generateWrappedCards()` in `lib/scoring.ts` produces story cards: season score, strongest habit, best week, total focus hours, mood pattern, biggest miss, most improved category, closing message. Season Wrapped is fully data-driven.

**Demo controls**  
`/demo` can load or reset Daniel's prebuilt dataset via server actions. Judges get a clean path: load data → dashboard → check-in → wrapped in under two minutes.

**Scoring engine**  
Season score is a weighted blend: 40% habit completion, 25% goal progress, 15% focus consistency, 10% mood/energy, 10% reflection consistency. The weights live in one module so they can be tuned without touching SQL or React.

---

## 5. Architecture & Tech Stack

I chose the stack for shipping speed and for how the hackathon would be judged: real database, real deployment, real user loop.

**Next.js 16 (App Router)** — Frontend and backend in one repo. Server Components fetch dashboard data on the server (no client-side loading spinners for the main view). Server Actions handle check-in submission and demo seeding without building a REST API nobody asked for.

**TypeScript** — The app moves a lot of shaped data: Prisma rows → scoring types → dashboard props → Wrapped slides. Typing that pipeline caught several mismatches early (e.g. mood on a 1–5 UI scale vs 1–10 in the database).

**Tailwind CSS 4 + shadcn/ui** — Utility-first styling for a dark, glass-panel UI. shadcn gives accessible primitives; custom components (`Gem`, `Strands`, heatmap) carry the brand.

**AWS Aurora PostgreSQL** — Required for the hackathon and the right fit for relational data: users own visions, visions have seasons, seasons have habits and check-ins, check-ins have habit logs. That is a graph, not a document.

**Prisma 7 + `@prisma/adapter-pg`** — Schema migrations, generated client, type-safe queries. Prisma 7's client engine requires a driver adapter for PostgreSQL; the migration CLI and the runtime client are configured separately (`prisma.config.ts` vs `lib/db.ts`).

**Vercel** — Deploy target matches Next.js. `DATABASE_URL` in Vercel env points at Aurora in production.

**`lib/scoring.ts` (pure logic)** — Deliberately not inside React components or Prisma models. Dashboard reads and Wrapped generation both import the same functions. Tests run with `npm run test:scoring` without a database.

```text
┌─────────────┐     ┌──────────────────────────────────┐     ┌─────────────┐
│   Browser   │────▶│  Vercel / Next.js                │────▶│   Aurora    │
│             │     │  Server Components (read)        │     │ PostgreSQL  │
│             │     │  Server Actions (write)          │     │             │
│             │     │  lib/dashboard-db.ts → queries   │     │ 9 tables    │
│             │     │  lib/scoring.ts → calculations   │     │             │
│             │     │  Prisma + pg adapter (TLS)       │     │             │
└─────────────┘     └──────────────────────────────────┘     └─────────────┘
```

Full diagram: [`docs/architecture-diagram.md`](docs/architecture-diagram.md)

---

## 6. How It Works

### What a user does

1. Open [becoming-nine.vercel.app/demo](https://becoming-nine.vercel.app/demo) and click **Load demo data** (seeds Daniel's year into Aurora).
2. Open **Dashboard** — season score, gem, heatmap, habits reflect stored check-ins.
3. Open **Check-in** — log today, seal the day, land back on dashboard with updated stats.
4. Open **Wrapped** — play the season recap generated from the same records.

Onboarding and season-creation pages exist in the UI but do not write to the database yet (see Limitations).

### What the system does on check-in

```text
1. User submits form on /check-in
2. submitCheckin() (actions/check-in.ts)
     - Resolve active season for demo user
     - Upsert daily_checkins for today (mood ×2, energy ×2 for 1–10 scale)
     - Delete + recreate habit_logs for selected habits
3. revalidatePath('/dashboard', '/wrapped')
4. redirect('/dashboard')
5. Dashboard page calls getDashboardData()
     - Prisma: user → vision → season → check-ins + habit_logs
     - Map rows to scoring types
     - calculateSeasonScore(), createContributionHeatmapData(), etc.
6. Server-rendered HTML with fresh numbers
```

Wrapped follows the same read path: `getWrappedData()` → `generateWrappedCards()`. No second query layer, no cached recap JSON.

---

## 7. Key Technical Decisions

**Separate query layer from calculation layer**  
`lib/dashboard-db.ts` knows about Prisma and maps database rows to UI-friendly shapes. `lib/scoring.ts` knows nothing about Prisma — only typed inputs and outputs. If the scoring formula changes, I edit one file and run tests. If the schema changes, I edit the mapper. Mixing those concerns would have made the hackathon refactor painful.

**Server Actions instead of API routes**  
Check-in and demo load/reset are form posts with `revalidatePath`. No fetch wrappers, no client state sync, no API versioning. Tradeoff: less portable to a mobile app later; win: less code and fewer failure modes for a web-only V1.

**Single demo user (`daniel@becoming.app`)**  
Auth would have eaten the deadline. The schema has `users` with relations; the app layer always resolves that one email (with a fallback to `findFirst`). Shipping a complete loop for one user beat shipping signup for zero users.

**`force-dynamic` on DB routes**  
`/dashboard`, `/check-in`, `/wrapped` export `dynamic = 'force-dynamic'`. Without it, `next build` tries to prerender pages that call Aurora at build time — which fails or lies when the database is not reachable from the build environment.

**Shared seed logic (`lib/seed-demo.ts`)**  
The CLI seed (`npm run db:seed`) and the demo page's "Load demo data" button call the same function. One source of truth for what "Daniel's demo year" contains.

**TLS handling for Aurora**  
`sslmode=require` in the connection string alone produced `P1011` certificate errors with the pg adapter. Fix: strip `sslmode` from the URL passed to `PrismaPg` and set `ssl: { rejectUnauthorized: false }` explicitly in `lib/db.ts` and `prisma/seed.ts`.

---

## 8. Challenges & Solutions

**Prisma 7 broke the old client setup**  
Runtime error: engine type `client` requires `adapter` or `accelerateUrl`. Removed `engineType = "binary"` from the schema, installed `@prisma/adapter-pg`, wired it in `lib/db.ts`.

**Build passed compile but failed on `/dashboard`**  
Static generation attempted a live DB connection. Marked data-dependent routes as dynamic.

**Aurora reachable from Prisma CLI but not from the app**  
Migration engine and pg adapter handle SSL differently. Required explicit adapter SSL config, not just the connection string flag.

**Security group blocked after network change**  
Laptop restart → new IP → `P1001`. Opened PostgreSQL 5432 on the RDS security group (demo used `0.0.0.0/0` so Vercel could connect too).

**Duplicate `src/` folder at repo root**  
Early scaffold left two app trees; Vercel deployed the wrong one. Deleted the duplicate, kept root `app/`.

**Seed script did not load `.env.local`**  
`tsx` does not auto-load Next.js env files. Added `dotenv` at the top of `prisma/seed.ts`.

---

## 9. Limitations

I am explicit about these because they define what V1 actually is.

- **No auth.** There is no login. Every DB path resolves to the demo user. Multi-user support is in the schema, not in the application.
- **Onboarding and `/season/new` are presentation-only.** They look complete; they do not create records in Aurora.
- **Year Wrapped mixes real and static content.** Season Wrapped is fully computed from check-ins. The year recap still uses some placeholder season narratives from mock data.
- **No automated tests for UI or server actions.** Scoring logic has a test script; the rest was verified manually and in production.
- **Aurora exposed on 5432 for demo.** Acceptable for a hackathon deadline; not acceptable for production without tightening network access.
- **No payments, push notifications, or health API integrations.** Out of scope by design.

---

## 10. Future Improvements

Ordered by what would most increase "real product" feel:

1. **Auth + session-scoped queries** — replace `DEMO_EMAIL` with `session.user.id` everywhere in `dashboard-db.ts` and actions.
2. **Persist onboarding and season creation** — server actions for `YearlyVision`, `Season`, `Habit` creation from existing forms.
3. **Goal pace on dashboard** — `calculateGoalPace()` already exists in scoring; wire it to season goal cards.
4. **Persist Wrapped cards** — write `generateWrappedCards()` output to `wrapped_cards` for sharing and history.
5. **Charts from existing data** — weekly mood and focus trends; no new tables required.
6. **Lock down Aurora** — restrict security group; consider connection pooling (PgBouncer or Prisma Accelerate) if traffic grows.

---

## Development

**Requirements:** Node.js 20+, Aurora PostgreSQL, `DATABASE_URL` in `.env.local`

```bash
npm install
npx prisma migrate deploy
npm run db:seed
npm run dev
```

| Script | Purpose |
|--------|---------|
| `npm run dev` | Local dev server |
| `npm run build` | `prisma generate && next build` |
| `npm run db:seed` | Load Daniel demo dataset |
| `npm run test:scoring` | Test `lib/scoring.ts` without DB |

```env
# .env.local (do not commit)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/becoming?sslmode=require"
```

**Layout**

```text
app/                 Routes
actions/             check-in.ts, demo.ts
lib/scoring.ts       Pure calculation (season score, wrapped, heatmap)
lib/dashboard-db.ts  Prisma queries → dashboard/wrapped DTOs
lib/seed-demo.ts     Shared demo seed
lib/db.ts            Prisma client + pg adapter
prisma/              Schema, migrations, seed entry
docs/                PRD, architecture diagram, implementation plan
```

---

## Links

- **Production:** https://becoming-nine.vercel.app
- **Repository:** https://github.com/danekweaga/Becoming

Built for the H0 AWS/Vercel hackathon — Aurora PostgreSQL, Vercel deployment, full core product loop.
