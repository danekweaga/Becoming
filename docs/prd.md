# Becoming — Product Requirements Document

## 1. Product Name

**Becoming**

## 2. Product Tagline

**Track your becoming.**

## 3. Product Positioning

Becoming is a premium personal growth dashboard that helps users answer one central question:

> Who are you becoming this year?

The app helps users set a yearly vision, break it into seasonal chapters, track daily habits and wellness, and generate cinematic Wrapped-style recaps that show how their life actually changed over time.

Becoming is not a generic habit tracker. It is a personal growth operating system organized around yearly vision, seasonal execution, and emotional reflection.

## 4. Hackathon Track

**Track: Monetizable B2C App**

Becoming fits the Monetizable B2C track because it is a consumer self-improvement product with a clear subscription path. The target market includes students, young professionals, creators, fitness-focused users, and people who already use habit trackers, journals, Notion dashboards, wellness apps, or goal planners.

## 5. Problem

Most personal growth apps track isolated behaviors: habits, tasks, water, mood, focus, or journaling. The problem is that users do not experience life as separate checklists. They think in chapters:

- “This is my reset year.”
- “This is my exam season.”
- “This is my gym arc.”
- “This is my career-building season.”
- “This is the year I become disciplined.”

Existing tools often fail because they are either too simple, too scattered, too guilt-based, or too boring to keep using. Users can track habits every day but still not understand whether they are actually becoming the person they wanted to become.

## 6. Solution

Becoming turns personal growth into a structured yearly and seasonal system.

Users begin with a yearly vision, define who they want to become, set measurable yearly goals, break them into seasonal goals, track daily progress, and unlock a recap called **This Season’s Becoming** or **Your Year of Becoming**.

The app combines:

- Yearly vision planning
- Seasonal goal setting
- Habit tracking
- Daily check-ins
- Mood and energy tracking
- Focus and hydration tracking
- Progress dashboards
- Gem-inspired progress states
- Wrapped-style seasonal recaps
- Reflection-based personal analytics

The product’s emotional hook is not “complete your checklist.”

The hook is:

> Look how far you’ve come. See who you’re becoming.

## 7. Target Users

### Primary Users

1. **Students**
   - Want to organize school, fitness, discipline, social life, and personal growth.
   - Often live in “seasons” such as exam season, summer break, fall semester, internship season.

2. **Young professionals**
   - Want to improve health, career, finances, relationships, and routines.
   - Need a clean dashboard that turns vague goals into measurable progress.

3. **Self-improvement users**
   - Already use Notion, habit trackers, journals, fitness apps, or productivity tools.
   - Want something more beautiful, emotional, and structured.

4. **Creators and builders**
   - Want to track creative output, focus time, learning, fitness, and personal discipline.

## 8. User Pain Points

- “I set yearly goals and forget them by February.”
- “I use too many apps to track my life.”
- “Habit trackers feel boring after a week.”
- “I want to know if I’m actually improving.”
- “I want my progress to feel visible and rewarding.”
- “I want something like Spotify Wrapped, but for my personal growth.”
- “I don’t want guilt-based productivity. I want calm motivation.”

## 9. Product Promise

Becoming helps users turn their year into intentional seasons, their goals into daily actions, and their progress into a story they can understand.

## 10. Core User Flow

1. User lands on the app.
2. User starts yearly onboarding.
3. App asks: “Who are you becoming this year?”
4. User creates yearly vision.
5. User adds yearly goals.
6. User creates first season.
7. User connects seasonal goals and habits.
8. User completes daily check-ins.
9. Dashboard updates with scores, heatmaps, and progress.
10. User generates **This Season’s Becoming** recap.

## 11. Core Features

### P0 — Required for Hackathon Submission

These must be built.

#### 1. Landing Page

Purpose:
- Explain what Becoming is.
- Communicate the emotional concept clearly.
- Drive users into onboarding or demo dashboard.

Must include:
- App name
- Tagline
- Hero section
- Product explanation
- CTA buttons
- Screenshots/mock dashboard preview

#### 2. Yearly Vision Onboarding

Purpose:
- Capture the user’s big-picture yearly identity and goals.

Fields:
- Year theme
- Identity statement
- Life categories
- Yearly goals
- Target metric
- Deadline
- Why it matters

Example:
- Theme: “Discipline Year”
- Identity: “I am becoming focused, healthy, and financially responsible.”
- Goal: “Work out 150 times”
- Category: Health
- Target: 150 workouts
- Deadline: Dec 31
- Why: “I want to feel confident and consistent.”

#### 3. Create Season

Purpose:
- Break the yearly vision into a focused seasonal chapter.

Fields:
- Season name
- Start date
- End date
- Season identity
- Priority goals
- Habits
- Gem type

Example:
- Season: “Summer Reset”
- Identity: “I am becoming disciplined and healthy.”
- Habits: Workout, study, hydrate, journal.

#### 4. Daily Check-In

Purpose:
- Let users log daily progress.

Fields:
- Habit completion
- Mood score
- Energy score
- Focus minutes
- Water intake
- Reflection

#### 5. Dashboard

Purpose:
- Show the user’s current state and progress.

Must include:
- Season completion score
- Yearly goal progress
- Gem level
- Today’s habits
- Mood and energy
- Focus minutes
- Water intake
- Contribution heatmap
- Goal pace badges
- Reflection panel

#### 6. Wrapped Recap

Purpose:
- Turn user progress into a story.

Must include:
- Season score
- Strongest habit
- Best week
- Total focus hours
- Mood pattern
- Biggest missed opportunity
- Most improved category
- Final season message

#### 7. Demo Data System

Purpose:
- Let judges instantly test the app.

Must include:
- Load demo data
- Reset demo data
- Demo user named Daniel
- Pre-filled yearly vision, season, habits, check-ins, and recap data

### P1 — Startup-Grade V1 Enhancements

Build these only after P0 works.

- Authentication
- Multi-season history
- Year Wrapped page
- Better charts
- Streak calculations
- Export/share recap
- Mobile polish
- Animated gem progression
- Improved onboarding copy

### P2 — Future Startup Features

Do not build during the hackathon.

- Payments
- Social accountability
- Public profiles
- Apple Health / Google Fit
- Calendar integrations
- AI coaching
- Advanced correlations
- Team/family dashboards
- Mobile app
- Drag-and-drop widgets

## 12. What We Are Not Building Yet

To avoid scope creep, Becoming will not include the following before hackathon submission:

- Full mobile native app
- Payment system
- Subscription billing
- Social feed
- Real-time collaboration
- Smartwatch integration
- Full calendar sync
- AI-generated coaching
- Complex notification system
- Public community features

## 13. Success Metrics

### Product Success

- User can create a yearly vision.
- User can create a season.
- User can create habits.
- User can submit daily check-ins.
- Dashboard updates from database data.
- User can generate a Wrapped-style recap.
- Demo data works reliably.

### Hackathon Success

- Deployed on Vercel.
- Uses AWS Aurora PostgreSQL as the primary backend.
- Includes architecture diagram.
- Includes proof of AWS database usage.
- Includes demo video under 3 minutes.
- Shows thoughtful database schema and full-stack architecture.
- Looks polished enough to compete for Design or B2C track.

## 14. Monetization Strategy

Becoming can become a subscription consumer app.

### Free Tier

- One active year vision
- One active season
- Limited habits
- Basic dashboard
- Basic season recap

### Premium Tier

- Unlimited seasons
- Year Wrapped
- Advanced analytics
- Multi-year history
- Premium themes
- Recap exports
- AI reflection insights
- Goal templates
- Health integrations

## 15. Competitive Positioning

Becoming sits between:

- Habit trackers
- Notion life dashboards
- Wellness journals
- Goal planners
- Spotify Wrapped-style personal analytics

Its key difference is the combination of:

1. Yearly identity
2. Seasonal execution
3. Daily tracking
4. Emotional recap

## 16. Demo Story

The demo user is Daniel.

Daniel starts the year with the theme:

> Discipline Year

He creates a season called:

> Summer Reset

He tracks habits like:

- Workout
- Study
- Hydrate
- Journal
- Sleep before midnight

After several check-ins, the dashboard shows his season score, progress, mood, focus time, and habit consistency.

Then he generates **This Season’s Becoming**, which shows what he improved, what slipped, and who he is becoming.

## 17. Product Risk

The biggest risk is trying to build too much.

The product must stay focused on:

- Yearly vision
- Seasonal goals
- Daily check-ins
- Dashboard
- Wrapped recap

Everything else is future roadmap.