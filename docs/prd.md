# PRD: Grid — Creative Freelance Marketplace (Hyderabad)

**Status:** Migrated from the retired `gigs-app` (Next.js/Supabase) prototype — that repo has been archived. Grid is now built native-first as this React Native app; the "web only for v1" and stack lines below are historical and superseded.

---

## Problem

Photographers, cinematographers, and other creative freelancers in Hyderabad don't have a dedicated place to find local work. Generic freelance platforms (Upwork, Fiverr) are global, saturated, and not built for local creative gigs — no sense of local rates, availability, or portfolio-first discovery. Clients (event organizers, small agencies, businesses, individuals) looking to hire local creative talent face the same gap in reverse: no focused way to browse and book vetted local freelancers.

## Why build this (dual goal)

1. **Learning goal (primary):** a personal experiment to build a full two-sided marketplace SaaS end-to-end with Claude Code — auth, two distinct user types, listings CRUD, a discovery/explore feed, deployment.
2. **Validation goal (secondary):** a real test of whether this specific gap (tier-2/3 city, creative-only, local) is real — existing access to the freelancer side of this market through abhkfilms/Agenz.

## Target users

- **Freelancers:** photographers, cinematographers, videographers, editors, and adjacent creative freelancers based in Hyderabad
- **Clients:** individuals, event organizers, small businesses, and agencies looking to hire for one-off jobs or recurring creative work

## Core mechanics (v1)

1. **Job postings** — clients post a brief (project type, budget range, timeline), freelancers apply
2. **Bookable gig listings** — freelancers list a service + rate (like a mini storefront), clients book directly
3. **Explore page** — browsable, portfolio-first feed of freelancers (Instagram-style discovery), filterable by category

## V1 scope — IN

- Freelancer profile + portfolio (image/video links, category tags, base location)
- Client profile (lighter — no portfolio needed)
- Post a job (client)
- Apply to a job (freelancer)
- List a gig/service with rate (freelancer)
- Explore/browse freelancers by category
- Basic search/filter (category, price range)
- Auth with role selection (freelancer vs client)

**Build status in this repo:** Auth (login/signup with role selection), Explore feed, listing detail, Bookings, Messages, and Profile screens exist. **Job postings and the apply flow are not yet built** — `JobDoc`/`JobApplicationDoc` types exist in `src/types/models.ts` but there is no Jobs screen or post/apply UI yet. That's the main gap versus this PRD.

## V1 scope — OUT (explicitly cut)

- **Payments/escrow** — no in-app money handling in v1; deals close off-platform once matched.
- **Reviews/ratings** — v2 (note: the current Explore/Profile/Listing-detail screens already show review/rating mockup data ahead of this — worth reconciling when reviews become real)
- **In-app messaging** — v2 in the original plan, but a Messages screen already exists in this app; treat it as already promoted from v2 to v1.
- **Multi-city** — Hyderabad only for v1
- **Mobile app** — originally deferred to v2 as "web only for v1"; this has flipped — mobile (this repo) is now the primary platform.

## Success criteria

- **Learning:** working, deployed marketplace touching auth, two-sided data modeling, listings CRUD, discovery feed, and live deploy
- **Validation:** a handful of real Hyderabad creative freelancers list on it, and at least one real job posting or gig booking actually happens

## Open questions (carried over, still unresolved)

- Should the Explore page be public (SEO/discovery value, but exposes freelancer info to anyone) or gated behind login?
- Monetization model (commission, subscription, job-posting fee) — deferred until there's real usage to monetize.

## Stack (current, native)

Expo / React Native, Firebase (auth + Firestore). This replaces the original proposed stack (Next.js + Postgres/Supabase + Auth.js + Vercel), which was fully built out in the now-archived `gigs-app` repo before the pivot to native. See `docs/supabase-schema-reference.md` for the data model that repo used — this app's `src/types/models.ts` already mirrors it (Firestore-shaped instead of relational).
