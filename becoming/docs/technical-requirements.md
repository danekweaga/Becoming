# Becoming — Technical Requirements Document

## 1. Technical Goal

Build a production-style full-stack web application using Vercel/v0 and an AWS database, following the H0 hackathon rules.

The app must:

- Run as a web application.
- Deploy on Vercel.
- Use one required AWS database as the primary backend.
- Store real application data.
- Include a thoughtful architecture.
- Include proof of AWS database usage.
- Be demoable in under 3 minutes.

The hackathon specifically requires use of one of these AWS databases: Aurora PostgreSQL, Aurora DSQL, or DynamoDB, with deployment on Vercel or v0.app. :contentReference[oaicite:2]{index=2}

## 2. Chosen Stack

### Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts
- Optional: Framer Motion

### Backend

- Next.js Server Actions
- Prisma ORM
- AWS Aurora PostgreSQL

### Deployment

- Vercel

### Development Tools

- v0 for initial UI generation
- VS Code or Cursor
- GitHub
- Prisma Studio
- AWS Console
- Vercel Dashboard

## 3. Why Next.js

Next.js is the best choice because:

- It is the native Vercel-first framework.
- It supports frontend and backend logic in one project.
- It supports server components.
- It supports server actions.
- It works well with Prisma.
- It is realistic for modern full-stack development.
- It is fast for hackathon shipping.

Use Next.js when building:

- Full-stack apps
- Dashboard apps
- SaaS products
- Apps that need pages, database logic, and deployment
- Projects intended for Vercel

## 4. Why TypeScript

TypeScript is required for this project because it reduces mistakes and helps you understand the shape of your data.

Use TypeScript for:

- Props
- Database result types
- Form data
- API/server action inputs
- Chart data
- Reusable components

The goal is not just to “make it compile.” The goal is to understand what data each function expects and returns.

## 5. Why Tailwind CSS

Tailwind is used because it helps build fast, responsive UI without constantly switching between files.

Use Tailwind for:

- Layout
- Spacing
- Typography
- Responsive design
- Colors
- Borders
- Shadows
- Hover states
- Grid systems

Important Tailwind concepts to learn:

- flex
- grid
- gap
- p/m spacing
- responsive prefixes
- dark mode classes
- custom arbitrary values
- group hover
- transitions

## 6. Why shadcn/ui

shadcn/ui gives clean, accessible component foundations.

Use it for:

- Buttons
- Cards
- Inputs
- Textareas
- Dialogs
- Tabs
- Badges
- Dropdowns
- Progress bars

Do not leave shadcn components untouched. Customize them so the app has its own identity.

## 7. Advanced CSS Goals

This project should help learn stronger CSS.

Must practice:

- CSS variables
- Custom gradients
- Glassmorphism
- Backdrop blur
- Custom shadows
- Responsive dashboard grids
- Contribution heatmap layout
- Progress ring visuals
- Gem glow effects
- Subtle motion
- Card hierarchy
- Modern spacing systems

Examples:

```css
:root {
  --background: 240 20% 6%;
  --foreground: 0 0% 98%;
  --gem-primary: 265 90% 70%;
  --season-glow: 280 100% 65%;
}