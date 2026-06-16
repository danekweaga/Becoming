
---

# 06-implementation-plan.md

```md
# Becoming — Implementation Plan

## 1. Timeline Goal

The hackathon deadline is in 15 days.

The goal is to finish the working project in 10 days, leaving 5 days for fixes, polish, submission, video, and emergencies.

## 2. Build Philosophy

Build startup-grade V1, not a tiny MVP and not a fantasy full startup.

Startup-grade V1 means:

- Real branding
- Real UI
- Real database
- Real user flow
- Real dashboard
- Real check-ins
- Real recap
- Real deployment
- Real architecture diagram

It does not mean:

- Payments
- Social features
- Mobile app
- Health integrations
- AI coach
- Every possible feature

## 3. Daily Plan

## Day 1 — Documentation + Project Setup

### Goals

- Create project docs.
- Create repo.
- Create Next.js app.
- Install core dependencies.
- Generate first UI with v0.

### Tasks

1. Create GitHub repo.
2. Create `/docs` folder.
3. Add:
   - 01-prd.md
   - 02-technical-requirements.md
   - 03-user-journey-flow.md
   - 04-ui-ux-brief.md
   - 05-database-schema.md
   - 06-implementation-plan.md
4. Create app:

```bash
npx create-next-app@latest becoming

Recommended answers:

TypeScript: Yes
ESLint: Yes
Tailwind: Yes
App Router: Yes
src directory: Yes
import alias: Yes
Install shadcn:
npx shadcn@latest init
Install components:
npx shadcn@latest add button card input textarea select badge progress tabs dialog sheet dropdown-menu
Install charts:
npm install recharts
Generate first UI with v0.
Run locally:
npm run dev
Push first commit:
git add .
git commit -m "Initial Becoming dashboard scaffold"
git push
Learning Goals
Understand what a Next.js route is.
Understand what a React component is.
Understand how Tailwind classes style elements.
Understand what v0 generated.
Deliverable
App runs locally.
Basic pages exist.
Docs exist in repo.
Day 2 — UI Cleanup and Component Structure
Goals
Make UI look less generic.
Split repeated UI into reusable components.
Create mock data structure.
Tasks

Create components:

components/dashboard-shell.tsx
components/stat-card.tsx
components/gem-progress.tsx
components/contribution-heatmap.tsx
components/goal-pace-badge.tsx
components/wrapped-story-card.tsx
components/habit-checklist.tsx
components/reflection-card.tsx

Create files:

lib/mock-data.ts
lib/types.ts

Improve:

spacing
typography
card hierarchy
gradients
mobile layout
empty states
Learning Goals
Props
Component reuse
File organization
Responsive Tailwind
CSS variables
Deliverable
Clean UI with mock data.
App does not look like a raw template.
Day 3 — Scoring and Wrapped Logic
Goals
Build business logic before database.
Make dashboard stats calculated, not hardcoded.
Tasks

Create:

lib/scoring.ts

Functions:

calculateHabitCompletionRate()
calculateGoalProgress()
calculateSeasonScore()
calculateGemLevel()
calculateGoalPace()
calculateBestStreak()
calculateTotalFocusHours()
generateWrappedCards()

Use mock data first.

Learning Goals
Arrays
map
filter
reduce
function inputs/outputs
business logic
Deliverable
Dashboard uses scoring functions.
Wrapped page uses generated cards from mock data.
Day 4 — AWS Safety + Aurora PostgreSQL Setup
Goals
Set up AWS safely.
Redeem credits.
Create budget alerts.
Set up Aurora PostgreSQL.
Tasks
Redeem AWS credits.
Confirm credits in AWS Billing.
Create AWS budget alerts:
$10
$25
$50
$90
Create Aurora PostgreSQL database.
Save connection string.
Create .env.local.
Create .env.example.
Add DATABASE_URL.
Add .env.local to .gitignore.
Learning Goals
AWS billing
Budget alerts
Database connection strings
Environment variables
Why secrets cannot be committed
Deliverable
Aurora PostgreSQL exists.
App has local DATABASE_URL configured.
No secrets committed.
Day 5 — Prisma Setup and Database Migration
Goals
Connect Next.js to Aurora PostgreSQL through Prisma.
Create real schema.
Tasks

Install Prisma:

npm install prisma @prisma/client
npx prisma init

Add Prisma schema from 05-database-schema.md.

Run migration:

npx prisma migrate dev --name init

Generate Prisma client:

npx prisma generate

Create:

lib/db.ts

Add Prisma client.

Open Prisma Studio:

npx prisma studio
Learning Goals
ORM
Schema
Migration
Model
Relation
Prisma Client
Deliverable
Database tables created.
Prisma connects successfully.
Day 6 — Demo Data and Database Actions
Goals
Create real database-backed demo data.
Stop relying on mock-only UI.
Tasks

Create server actions:

actions/load-demo-data.ts
actions/reset-demo-data.ts
actions/get-dashboard-data.ts

Demo data should create:

Daniel user
2026 yearly vision
yearly goals
Summer Reset season
season goals
habits
21 daily check-ins
habit logs
Learning Goals
Server actions
Database writes
Database reads
Seed data
Request flow
Deliverable
Demo page can load/reset real database data.
Day 7 — Onboarding, Season Creation, Daily Check-In
Goals
Make the main user flow work with the database.
Tasks

Build actions:

createYearlyVision()
createSeason()
submitDailyCheckin()

Connect forms:

onboarding form
create season form
check-in form

After check-in:

save daily_checkin
save habit_logs
recalculate season score
update gem level
redirect to dashboard
Learning Goals
Forms
FormData
Validation
Server actions
Database mutation
Redirect/refresh
Deliverable
User can create and update real progress.
Day 8 — Dashboard Analytics and Charts
Goals
Make dashboard feel real and useful.
Tasks

Use database data to calculate:

season score
habit completion
best streak
total focus hours
mood average
energy average
water consistency
goal pace
heatmap values

Add charts:

weekly progress
mood trend
category progress
focus minutes
Learning Goals
Data transformation
Chart data shape
Aggregations
Dashboard thinking
Deliverable
Dashboard is powered by Aurora PostgreSQL data.
Day 9 — Wrapped Recap and Polish
Goals
Build the most memorable feature.
Make the project feel polished.
Tasks

Create action:

generateWrappedCards()

Generate cards:

season score
strongest habit
best week
focus hours
mood pattern
missed opportunity
most improved category
final message

Save to database.

Polish:

animations
loading states
empty states
mobile layout
better copy
error states
Learning Goals
Derived data
Storytelling with data
UI polish
Conditional rendering
Deliverable
Wrapped page feels demo-worthy.
Day 10 — Deployment, Diagram, Submission Draft
Goals
Deploy.
Prepare submission materials.
Leave 5 days for buffer.
Tasks
Deploy to Vercel.
Add DATABASE_URL to Vercel environment variables.
Test production app.
Take screenshot proving AWS database usage.
Create architecture diagram.
Get Vercel Team ID.
Record rough demo video.
Write submission draft.
Publish optional build post for bonus points.

The hackathon gives optional bonus points for public content explaining how the project was built with AWS Databases and Vercel.

Deliverable
App is deployed.
Submission is mostly ready.
4. Buffer Days
Day 11 — Bug Fixes

Fix:

broken forms
deployment bugs
database connection bugs
mobile issues
styling problems
Day 12 — Improve Design

Improve:

landing page
dashboard
wrapped page
loading states
empty states
screenshot quality
Day 13 — Demo Video

Record final demo video under 3 minutes.

Video structure:

0:00–0:20 Problem
0:20–0:40 Solution
0:40–1:40 App demo
1:40–2:20 Database/architecture
2:20–2:50 Wrapped recap
2:50–3:00 Closing
Day 14 — Submission

Submit:

Vercel project link
Vercel Team ID
Architecture diagram
Demo video
Text description
AWS database used
Storage configuration screenshot
Bonus content link if available
Day 15 — Emergency Buffer

Only use this for:

fixing broken deployment
replacing video
fixing screenshots
final submission issues
5. Final Submission Positioning
Project Description

Becoming is a premium personal growth dashboard that helps users answer “Who are you becoming this year?”, break yearly goals into seasonal chapters, track daily habits and wellness, and unlock Wrapped-style recaps that show how their life actually changed.

The app is built with Next.js and deployed on Vercel. It uses AWS Aurora PostgreSQL as the primary backend for users, yearly visions, goals, seasons, habits, daily check-ins, habit logs, and recap cards.

Why It Matters

Most habit trackers focus on daily checklists. Becoming focuses on life chapters, identity, and reflection. It helps users connect daily actions to the person they are trying to become.

6. Final Warning

Do not keep adding features.

A complete, polished, database-backed V1 beats an unfinished giant app.

The winning build is:

Yearly Vision
→ Season
→ Check-In
→ Dashboard
→ Wrapped
→ AWS Database
→ Vercel Deployment

---

# Updated steps now that the docs exist

Here is the actual order you should follow from here.

## Step 1 — Create the docs folder

Create:

```bash
mkdir docs