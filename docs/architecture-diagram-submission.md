# Becoming — Architecture Diagram (Submission)

**Live app:** https://becoming-nine.vercel.app

Use the diagram below for hackathon submission. Export as PNG via [mermaid.live](https://mermaid.live) (paste code → Actions → Export PNG).

---

## Simple flow (required for submission)

```mermaid
flowchart LR
  Browser[User Browser]
  Vercel[Vercel / Next.js App Router]
  Prisma[Prisma Client + pg adapter]
  Aurora[(AWS Aurora PostgreSQL)]

  Browser -->|HTTPS| Vercel
  Vercel -->|SQL via DATABASE_URL| Prisma
  Prisma -->|TLS port 5432| Aurora
```

---

## Detailed architecture

```mermaid
flowchart TB
  subgraph client [User Browser]
    Pages[Landing · Dashboard · Check-in · Wrapped · Demo]
  end

  subgraph vercel [Vercel]
    subgraph next [Next.js 16]
      SC[Server Components - reads]
      SA[Server Actions - writes]
      Score[lib/scoring.ts]
    end
  end

  subgraph orm [Data access]
    Prisma[Prisma ORM]
    PG["@prisma/adapter-pg + pg"]
  end

  subgraph aws [AWS]
    Aurora[(Aurora PostgreSQL)]
    Tables["users · yearly_visions · yearly_goals · seasons · season_goals · habits · daily_checkins · habit_logs · wrapped_cards"]
  end

  Pages --> SC
  Pages --> SA
  SC --> Prisma
  SA --> Prisma
  SC --> Score
  Score --> SC
  Prisma --> PG
  PG --> Aurora
  Aurora --- Tables
```

---

## Data flow (check-in example)

```mermaid
sequenceDiagram
  participant U as User
  participant N as Next.js on Vercel
  participant P as Prisma
  participant A as Aurora PostgreSQL

  U->>N: Submit daily check-in
  N->>P: upsert daily_checkins + habit_logs
  P->>A: WRITE
  N->>P: getDashboardData()
  P->>A: READ
  N->>N: calculateSeasonScore()
  N->>U: Updated dashboard
```

---

## How to export PNG for submission

1. Go to **https://mermaid.live**
2. Copy one of the `mermaid` code blocks above (start at `flowchart` / `sequenceDiagram`, no backticks)
3. Paste into the editor
4. **Actions → Export PNG** (or SVG)
5. Upload to hackathon form

**Alternative:** Open this file on GitHub — Mermaid renders in the README preview. Screenshot the rendered diagram.

Full version with extra detail: [`architecture-diagram.md`](./architecture-diagram.md)

---

## Text summary (if the form has a description field)

Becoming runs as a Next.js 16 app on Vercel. The browser talks to Server Components (dashboard, wrapped) and Server Actions (check-in, demo seed). Prisma ORM with the PostgreSQL driver adapter connects over TLS to AWS Aurora PostgreSQL, which stores users, visions, seasons, habits, daily check-ins, habit logs, and wrapped cards. Custom scoring logic in `lib/scoring.ts` computes season scores and recap cards from live database reads.
