# Becoming — Architecture Diagram

Use this for hackathon submission. Export the Mermaid diagram as PNG from [mermaid.live](https://mermaid.live) or screenshot from GitHub preview.

## System overview

```mermaid
flowchart TB
  subgraph client [User Browser]
    Landing[Landing page]
    Onboarding[Onboarding / Season]
    CheckIn[Daily check-in]
    Dashboard[Dashboard]
    Wrapped[Wrapped recap]
    Demo[Demo controls]
  end

  subgraph vercel [Vercel]
    subgraph nextjs [Next.js App Router]
      SC[Server Components]
      SA[Server Actions]
      Scoring[lib/scoring.ts]
    end
  end

  subgraph data [Data layer]
    Prisma[Prisma Client]
    Adapter["@prisma/adapter-pg + pg"]
  end

  subgraph aws [AWS]
    Aurora[(Aurora PostgreSQL)]
  end

  Landing --> SC
  Onboarding --> SA
  CheckIn --> SA
  Demo --> SA
  Dashboard --> SC
  Wrapped --> SC

  SC --> Prisma
  SA --> Prisma
  Prisma --> Adapter
  Adapter --> Aurora

  SC --> Scoring
  Scoring --> SC

  Aurora --> Tables["users · yearly_visions · yearly_goals · seasons · season_goals · habits · daily_checkins · habit_logs · wrapped_cards"]
```

## Core product loop

```mermaid
sequenceDiagram
  participant User
  participant Next as Next.js on Vercel
  participant Prisma
  participant Aurora as Aurora PostgreSQL

  User->>Next: Set yearly vision / season
  Next->>Prisma: create / update records
  Prisma->>Aurora: INSERT / UPDATE

  User->>Next: Submit daily check-in
  Next->>Prisma: upsert daily_checkin + habit_logs
  Prisma->>Aurora: WRITE

  User->>Next: Open dashboard
  Next->>Prisma: getDashboardData()
  Prisma->>Aurora: READ
  Next->>Next: calculateSeasonScore, heatmap, gem level
  Next->>User: Live stats from Aurora

  User->>Next: Play Wrapped recap
  Next->>Prisma: getWrappedData()
  Prisma->>Aurora: READ
  Next->>Next: generateWrappedCards()
  Next->>User: Story cards from real data
```

## Stack summary

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind, shadcn/ui |
| Hosting | Vercel |
| API / mutations | Server Components + Server Actions |
| ORM | Prisma 7 |
| Database driver | `@prisma/adapter-pg` + `pg` (TLS to Aurora) |
| Database | AWS Aurora PostgreSQL |
| Business logic | `lib/scoring.ts` (season score, gem, heatmap, wrapped) |

## Environment

- `DATABASE_URL` — Aurora connection string (`.env.local` locally, Vercel env in production)
- Security group must allow PostgreSQL `5432` from Vercel (demo: `0.0.0.0/0` temporarily)
