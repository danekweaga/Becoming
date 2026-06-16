
---

# 05-database-schema.md

```md
# Becoming — Database Schema

## 1. Database Choice

Becoming uses **AWS Aurora PostgreSQL** as the primary backend database.

This fits the hackathon requirement to use an approved AWS database and deploy with Vercel/v0. :contentReference[oaicite:4]{index=4}

Aurora PostgreSQL is chosen because the app data is relational:

- A user has yearly visions.
- A yearly vision has goals.
- A user has seasons.
- A season has goals.
- A season has habits.
- A season has daily check-ins.
- Daily check-ins have habit logs.
- Seasons have Wrapped cards.

## 2. Main Tables

The database needs these tables:

```txt
users
yearly_visions
yearly_goals
seasons
season_goals
habits
daily_checkins
habit_logs
wrapped_cards