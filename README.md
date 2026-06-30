# Becoming

**Who are you becoming this year?**

[Live demo](https://becoming-nine.vercel.app) · [Guided demo flow](https://becoming-nine.vercel.app/demo)

Becoming is a personal growth dashboard that treats self-improvement as a story — not a checklist. Users set a yearly vision, live it through seasonal chapters, log daily check-ins, and unlock Wrapped-style recaps that show what actually changed.

Built for the H0 AWS/Vercel hackathon. The core loop is real: data lives in AWS Aurora PostgreSQL, flows through Prisma, and powers a live dashboard — not hardcoded mock numbers.

---

## 1. Overview

**What it is**  
A calm, cinematic web app for yearly vision, seasonal goals, daily habits, wellness check-ins, and end-of-season recaps.

**Who it is for**  
Students, young professionals, and self-improvement users who think in chapters — exam season, summer reset, career arc — not isolated streaks.

**What problem it solves**  
Most habit apps track tasks. Becoming tracks *identity change over time*: who you said you would become, what you did about it, and whether the season added up to something real.

---

## 2. Why This Exists

People do not experience growth as fifty unrelated checkboxes. They experience it as:

- “This is my reset year.”
- “This is exam season.”
- “This is the gym arc.”

Existing tools are either too shallow (streak counters), too scattered (Notion + five other apps), or too guilt-driven to keep using. You can log habits every day and still have no answer to: *Did I actually become who I intended?*

Becoming exists to close that gap — structure without shame, progress you can *see*, and a recap worth sitting with at the end of a season.

---

## 3. Core Idea

**Growth as chapters, not chores.**

The product is organized around three time horizons:

1. **Year** — one vision, one word, measurable yearly goals  
2. **Season** — a 90-day chapter with its own identity, habits, and gemstone metaphor  
3. **Day** — a short check-in ritual that seals the day and feeds the dashboard  

The emotional hook is not “complete your checklist.” It is:

> Look how far you’ve come. See who you’re becoming.

That is why Wrapped exists — the same data that powers the dashboard becomes a cinematic recap: strongest habit, best week, mood patterns, missed opportunities, final reflection.

---

## 4. Key Features

| Feature | What it does |
|--------|----------------|
| **Yearly vision** | Anchor the year with a theme, identity statement, and goal categories |
| **Seasonal chapters** | Break the year into seasons, each with focus, habits, and a gem identity |
| **Daily check-in** | Log mood, energy, focus, water, habits, and reflection — saved to the database |
| **Live dashboard** | Season score, gem level, goal pace, habit completion, contribution heatmap, recent reflections |
| **Wrapped recap** | Story cards generated from real check-in data — season score, strongest habit, focus hours, mood pattern, and more |
| **Demo mode** | One-click load or reset of preloaded demo data for judges and first-time visitors |
| **Custom scoring** | Weighted season score from habits (40%), goals (25%), focus (15%), mood/energy (10%), reflection (10%) |

---

## 5. Architecture & Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| **Framework** | Next.js 16 (App Router) | Server Components for reads, Server Actions for writes — one codebase, no separate API server. Native fit for Vercel. |
| **Language** | TypeScript | Shared types from Prisma models through scoring logic to UI props. Fewer shape mismatches in a data-heavy dashboard. |
| **UI** | React 19, Tailwind CSS 4, shadcn/ui | Fast iteration on a premium dark UI without fighting a component library. |
| **Database** | AWS Aurora PostgreSQL | Hackathon requirement + production-grade relational data for users, visions, seasons, check-ins, and logs. |
| **ORM** | Prisma 7 | Schema-as-code, migrations, type-safe queries. |
| **Driver** | `@prisma/adapter-pg` + `pg` | Prisma 7’s client engine requires a driver adapter for PostgreSQL. Explicit TLS config for Aurora. |
| **Hosting** | Vercel | Zero-config Next.js deploy; `DATABASE_URL` in environment for production Aurora access. |
| **Business logic** | `lib/scoring.ts` | Pure calculation layer — testable without the database or React. |

```text
Browser
  → Next.js (Server Components + Server Actions)
  → lib/dashboard-db.ts (queries)
  → lib/scoring.ts (calculations)
  → Prisma + pg adapter
  → AWS Aurora PostgreSQL
```

See [`docs/architecture-diagram.md`](docs/architecture-diagram.md) for the full diagram.

---

## 6. How It Works

### User journey

1. **Land** on the marketing page — understand the product in one sentence.  
2. **Load demo** at `/demo` — seed Daniel’s year into Aurora (or use existing data).  
3. **Dashboard** — see season score, gem level, habits, heatmap, and reflections pulled from the database.  
4. **Check-in** — submit mood, energy, focus, water, habits, reflection; redirect to dashboard with updated numbers.  
5. **Wrapped** — play “This Season’s Becoming” — recap cards generated from the same Aurora data.

### Data flow (check-in example)

```text
User submits /check-in form
  → submitCheckin() server action
  → upsert daily_checkins row
  → rebuild habit_logs for that day
  → revalidatePath('/dashboard', '/wrapped')
  → redirect to /dashboard
  → getDashboardData() reads season + check-ins from Aurora
  → calculateSeasonScore() + heatmap + gem level
  → render updated UI
```

Wrapped uses the same read path: `getWrappedData()` → `generateWrappedCards()` — no separate “recap API.”

---

## 7. Key Technical Decisions

**Scoring logic lives outside the database and outside React**  
`lib/scoring.ts` is a pure TypeScript module. The dashboard and Wrapped both call it. That means one source of truth for season score, gem tiers, streaks, and recap cards — and `npm run test:scoring` can verify behavior without spinning up Next.js.

**Server Components for reads, Server Actions for writes**  
No REST layer. Dashboard and Wrapped are async server components that query Aurora directly. Check-in and demo load/reset use server actions with `revalidatePath` so the UI refreshes after mutations.

**Single demo user for V1**  
The hackathon deadline favored a working end-to-end loop over multi-user auth. The app hardcodes `daniel@becoming.app` as the demo identity. The schema supports many users; the application layer does not yet.

**Dynamic routes for DB-backed pages**  
`/dashboard`, `/check-in`, and `/wrapped` export `dynamic = 'force-dynamic'` so Next.js does not try to prerender them at build time (which would fail or stale-cache without Aurora at build).

**Aurora TLS via explicit pg SSL**  
Connection string `sslmode=require` alone caused certificate errors with the pg adapter. The fix: strip `sslmode` from the URL and pass `ssl: { rejectUnauthorized: false }` to `PrismaPg` — required for reliable local and Vercel connections to RDS.

---

## 8. Challenges & Solutions

| Problem | Solution |
|---------|----------|
| Prisma 7 client required adapter or Accelerate | Wired `@prisma/adapter-pg` + `pg` in `lib/db.ts` |
| Build failed prerendering `/dashboard` | `export const dynamic = 'force-dynamic'` on DB-backed routes |
| Aurora unreachable after IP/network change | Security group inbound rule on PostgreSQL 5432 |
| `P1011` TLS certificate errors with pg adapter | Explicit SSL config; strip conflicting `sslmode` from connection string |
| Seed script could not load `.env.local` under tsx | `dotenv` in `prisma/seed.ts`; shared seed logic in `lib/seed-demo.ts` for CLI and server actions |
| Duplicate `src/` scaffold confused deploy | Removed duplicate tree; single `app/` structure at repo root |

---

## 9. Limitations

This is a deliberate V1 for demo and judging — not a shipped multi-user product.

- **No authentication** — everyone sees Daniel’s demo data; no signup or login.  
- **Onboarding and season creation are UI-only** — forms exist but do not persist to Aurora yet.  
- **Single-user application layer** — schema is multi-tenant-ready; code is not.  
- **Year Wrapped uses some static narrative moments** — season Wrapped is fully data-driven; year recap blends DB vision data with placeholder season stories.  
- **No payments, notifications, or health integrations** — intentionally out of scope.  
- **Aurora security** — demo may use open `0.0.0.0/0` on port 5432; tighten before any real launch.

---

## 10. Future Improvements

1. **Auth** (Clerk or NextAuth) — replace `DEMO_EMAIL` with session-scoped user ID.  
2. **Wire onboarding + `/season/new`** — server actions to create visions and seasons for the logged-in user.  
3. **Persist Wrapped cards** — optional `wrapped_cards` table writes for shareable recaps.  
4. **Goal pace on dashboard** — surface `calculateGoalPace()` per season goal in the UI.  
5. **Charts** — weekly mood and focus trends from existing check-in data.  
6. **Tighten Aurora access** — VPC-only or IP-restricted security groups for production.

---

## Local Development

**Prerequisites:** Node.js 20+, AWS Aurora PostgreSQL instance, `DATABASE_URL` in `.env.local`

```bash
npm install
npx prisma migrate deploy   # or migrate dev locally
npm run db:seed             # load Daniel demo data
npm run dev                 # http://localhost:3000
```

**Scripts**

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | `prisma generate` + production build |
| `npm run db:seed` | Seed Daniel demo user into Aurora |
| `npm run test:scoring` | Run scoring logic tests |

**Environment**

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/becoming?sslmode=require"
```

Do not commit `.env.local`.

---

## Project Structure

```text
app/              Routes (dashboard, check-in, wrapped, demo, …)
actions/          Server actions (check-in, demo load/reset)
components/       UI including becoming/ gem, dashboard/, wrapped/
lib/
  scoring.ts      Season score, gem, heatmap, Wrapped generation
  dashboard-db.ts Aurora queries → DashboardData / WrappedData
  seed-demo.ts    Shared demo seed (CLI + server actions)
  db.ts           Prisma client + pg adapter
prisma/           Schema, migrations, seed entrypoint
docs/             PRD, architecture, implementation plan
```

---

## Links

- **Live app:** https://becoming-nine.vercel.app  
- **Repo:** https://github.com/danekweaga/Becoming  

---

## License

Private — hackathon submission project.
