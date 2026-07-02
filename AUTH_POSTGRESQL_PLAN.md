# Nexus AI Auth + PostgreSQL Upgrade Plan

## Goal

Turn Nexus AI from a portfolio-grade full-stack demo into a multi-user student career platform where each student has a private workspace.

## Recommended Stack

- Authentication: Clerk
- Database: PostgreSQL
- Backend: FastAPI
- Frontend: GitHub Pages now, Vercel later if the frontend moves to React
- Hosting: Render web service plus Render PostgreSQL or Neon PostgreSQL

## Implementation Steps

1. Add Clerk authentication to the frontend.
2. Send the Clerk JWT with every API request.
3. Verify the JWT in FastAPI using Clerk's JWKS URL.
4. Create or fetch a `users` row from the verified auth subject.
5. Add `user_id` to every workspace query.
6. Migrate the SQLite schema to `backend/postgres_schema.sql`.
7. Replace shared demo storage with per-user PostgreSQL storage.
8. Keep the current sample workspace as a recruiter demo mode.

## Privacy Rules

- A user can only read and write rows where `user_id` matches their verified account.
- Resume notes are private user data.
- Export/import should remain user-controlled.
- Analytics should be computed from a student's own workspace unless explicit consent is added for aggregate research.

## Why This Matters

Authentication and PostgreSQL are the two upgrades that make Nexus AI feel like a real startup product instead of a single-user dashboard. They create the foundation for accounts, persistence, student privacy, cohort analytics, and future AI coaching.
