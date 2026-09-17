# StudyNet

![StudyNet Banner](public/banner.svg)

Operator-style study dashboard built with React 19, Vite, TypeScript, Tailwind CSS v4, Supabase, and Express.

## Screens

- Home
- Schedule
- AI-Net
- Decks
- Stats
- Drill

## Tech Stack

- Frontend: React 19, Vite, TypeScript, Tailwind CSS v4
- Backend: Express (AI/API routes)
- Database: Supabase (PostgreSQL + Row Level Security)
- AI: Google Gemini API

## Prerequisites

- Node.js
- Supabase project
- Gemini API key (optional, for AI features)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in values:
   ```bash
   cp .env.example .env
   ```

   Required variables:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase publishable key
   - `GEMINI_API_KEY` - Your Google Gemini API key (required for AI-Net)

3. Set up the Supabase database:
   - Open Supabase SQL Editor
   - Run `supabase/schema.sql`
   - Run `supabase/seed.sql`

4. Start the dev server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:3000`.

## Database Schema

All data lives in Supabase. The schema is defined in `supabase/schema.sql` and includes tables for operator profiles, subjects, alerts, schedule days/items, flashcards, drill questions, CGPA history, radar attributes, chat messages, and exam countdowns. Row Level Security is enabled with public access policies for local development.

## Scripts

- `npm run dev` - Start development server (Express + Vite)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run preview` - Preview production build
- `npm run lint` - Run TypeScript type checking

## Deploy to Netlify

This project is configured for a full Netlify deployment. The Vite frontend is published from `dist`, and the Express API is exposed through the Netlify Function in `netlify/functions/api.ts`.

1. Push the project to GitHub, GitLab, or Bitbucket.
2. In Netlify, choose **Add new site** > **Import an existing project** and select the repository.
3. Use these build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add these environment variables under **Project configuration** > **Environment variables**:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase publishable key
   - `GEMINI_API_KEY` - Your Gemini API key for AI-Net features
5. Deploy the site.

The Supabase schema must be applied from `supabase/schema.sql` before using persistent data. `GEMINI_API_KEY` is used only by the Netlify Function and must not be renamed with a `VITE_` prefix, because Vite exposes `VITE_` variables to the browser.

After deployment, verify that the site loads directly on a nested route and that `/api/health` returns a JSON response. AI-Net features use the API routes `/api/chat`, `/api/analyze-expertise`, and `/api/analyze-vault-subject`.
