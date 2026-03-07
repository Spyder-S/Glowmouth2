# GlowMouth Demo App

This is a React + Vite SPA demonstrating the core workflows for the GlowMouth oral wellness product.

## Features

- Supabase-backed authentication with fallback to in-browser storage
- Camera-based multi-angle scan flow
- Fake "GlowScore" analysis service with tiered observations
- Scan history persistence (Supabase or localStorage)
- Polished responsive UI with premium feel
- Auth flows: sign up, sign in, forgot/reset password, protected routes

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment variables** (optional)
   Copy `.env.example` to `.env` and fill in your Supabase project values:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=public-anon-key
   ```
   If you do not provide these, the app will run in local/demo mode using browser storage.

3. **Run**
   ```bash
   npm run dev
   ```

## Supabase Setup (optional)

Create the following tables and RLS policies in your Supabase project:

```sql
-- profiles table
create table profiles (
  id uuid primary key,
  email text,
  name text,
  created_at timestamptz default now()
);

-- scans table
create table scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  score int,
  tier text,
  tier_label text,
  observations jsonb,
  indicators jsonb,
  confidence text,
  analysisTime int,
  generatedAt timestamptz,
  image_urls jsonb,
  created_at timestamptz default now()
);

-- RLS policies
alter table profiles enable row level security;
create policy "Profiles owner" on profiles
  for select using (auth.uid() = id);
create policy "Upsert own profile" on profiles
  for insert, update using (auth.uid() = id);

alter table scans enable row level security;
create policy "Scans owner" on scans
  for all using (auth.uid() = user_id);
```

Create a storage bucket named `scans` (public) if you want to upload captured images.

## Extensibility

- The fake analysis logic lives in `src/services/scoreService.js`. Swap in an AI call by implementing `analyzeScan` or modifying `scanService.js`.
- Database access is abstracted in `src/services/dataService.js`.
- Auth is routed through `src/services/authService.js` with a clean fallback.
- UI components are modular; you can reuse `Orb`, `Nav`, `AuthModal`, etc.

## Next Steps

- Integrate real AI or Edge Functions for scan analysis
- Add payment flows and subscription management
- Implement user settings and profile editing

Enjoy the demo!