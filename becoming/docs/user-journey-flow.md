# 03-user-journey-flow.md

```md
# Becoming — User Journey Flow

## 1. Primary User Journey

The core user journey is:

```txt
Landing Page
→ Yearly Vision Onboarding
→ Create First Season
→ Add Goals and Habits
→ Daily Check-In
→ Dashboard
→ Generate This Season’s Becoming
2. User Persona
Name

Daniel

Background

Daniel is a student and builder who wants to become more disciplined, consistent, healthy, and focused. He has used habit trackers and productivity apps before, but they usually feel boring or too disconnected.

Goal

Daniel wants a system that helps him track his year, understand his seasons, and see whether he is actually becoming the person he said he wanted to be.

3. Journey Stage 1 — Landing Page
User Goal

Understand what Becoming is.

Page Goal

Communicate the app’s emotional promise quickly.

Key Message

Become the person you said you would.

User Actions
Reads hero section.
Clicks “Start your year.”
Or clicks “View demo dashboard.”
UI Requirements
Premium hero section
Clear tagline
Dashboard preview
Year/Season/Wrapped explanation
Strong CTA buttons
Success Criteria

User understands that Becoming is not just a habit tracker.

4. Journey Stage 2 — Yearly Vision Onboarding
User Goal

Define who they are becoming this year.

Page Question

Who are you becoming this year?

User Inputs
Year theme
Identity statement
Life categories
Yearly goals
Target metric
Deadline
Why each goal matters
Example
Year Theme: Discipline Year
Identity Statement: I am becoming focused, healthy, and consistent.
Goal 1: Work out 150 times
Goal 2: Study 400 focused hours
Goal 3: Save $2,000
System Actions
Create user if needed.
Create yearly vision.
Create yearly goals.
Save records to database.
Database Writes
users
yearly_visions
yearly_goals
Success Criteria

User has a saved yearly vision and goals.

5. Journey Stage 3 — Create First Season
User Goal

Turn yearly vision into a short-term seasonal chapter.

Page Question

What chapter are you entering now?

User Inputs
Season name
Season dates
Season identity
Priority seasonal goals
Habits connected to goals
Gem type
Example
Season Name: Summer Reset
Season Identity: I am becoming disciplined with my body, time, and focus.
Habit 1: Workout
Habit 2: Study
Habit 3: Hydrate
Habit 4: Journal
System Actions
Create season.
Create season goals.
Create habits.
Initialize gem level.
Set completion score to 0.
Database Writes
seasons
season_goals
habits
Success Criteria

User has an active season.

6. Journey Stage 4 — Daily Check-In
User Goal

Log today’s progress quickly.

User Inputs
Completed habits
Mood score
Energy score
Focus minutes
Water cups
Reflection
Example
Workout: complete
Study: complete
Hydrate: incomplete
Journal: complete
Mood: 7
Energy: 6
Focus: 95 minutes
Reflection: I had a slow start but recovered well.
System Actions
Save daily check-in.
Save habit logs.
Recalculate season score.
Recalculate gem level.
Update goal progress if needed.
Database Writes
daily_checkins
habit_logs
seasons
season_goals
Success Criteria

Dashboard changes after submission.

7. Journey Stage 5 — Dashboard
User Goal

See current progress and know what needs attention.

Dashboard Sections
Today’s Becoming
Season score
Yearly goal progress
Current gem level
Habit heatmap
Mood and energy trend
Focus minutes
Water intake
Goal pace badges
Reflection panel
System Reads
active season
yearly vision
yearly goals
season goals
habits
daily check-ins
habit logs
Database Reads
users
yearly_visions
yearly_goals
seasons
season_goals
habits
daily_checkins
habit_logs
Success Criteria

User can understand:

What is going well
What is slipping
Whether they are on pace
What to focus on today
8. Journey Stage 6 — Generate Wrapped Recap
User Goal

See the story of their season.

User Action

Clicks:

Generate This Season’s Becoming

System Actions
Analyze habit completion.
Find strongest habit.
Find best week.
Calculate total focus hours.
Analyze mood pattern.
Identify missed opportunity.
Identify most improved category.
Generate recap cards.
Save recap cards.
Database Writes
wrapped_cards
Wrapped Cards
Season score
Strongest habit
Best week
Focus hours
Mood pattern
Missed opportunity
Most improved category
Final message
Success Criteria

User gets an emotional, shareable recap.

9. Demo User Flow for Judges

The fastest demo path:

Open app
→ Click View Demo Dashboard
→ Load demo data
→ View Daniel’s dashboard
→ Submit one check-in
→ Watch score/gem update
→ Generate This Season’s Becoming
→ Show database/architecture explanation
10. Empty States
No Yearly Vision

Message:

Your becoming starts with a vision. Define who you want to become this year.

CTA:

Start your year

No Season

Message:

Your year needs a chapter. Create your first season.

CTA:

Create season

No Check-Ins

Message:

No check-ins yet. Log today to start building your story.

CTA:

Log today

No Wrapped

Message:

Your season recap will appear once you have enough progress to reflect on.

CTA:

Generate demo recap

11. Error States
Failed Database Save

Message:

Something went wrong while saving your progress. Try again.

Missing Required Fields

Message:

Add the required details before continuing.

No Active Season

Message:

Create or load a season before checking in.

12. Mobile Flow

Mobile navigation should prioritize:

Dashboard
Check-In
Wrapped
Season
Demo

The daily check-in must be easy to complete on a phone.