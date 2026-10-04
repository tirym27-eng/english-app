# English App v56 — GitHub → Railway / Render

## Architecture

One Node web service serves the Vite-built English app and the Express API from the same origin:

- `/` — English app
- `/api/healthz` — health check
- `/api/state` — learning state sync
- PostgreSQL — persistent learning state

## GitHub

1. Create a new GitHub repository.
2. Upload the **contents of `Campus-Meal-Planner/`**, not the outer ZIP folder.
3. Keep `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `artifacts/`, and `lib/` at repository root.
4. Do not commit `.env` or real secrets. Use `.env.example` as the template.

## Render

The repository contains `render.yaml`. In Render choose **New → Blueprint**, select the GitHub repository, and deploy the blueprint. It creates a Node web service and a PostgreSQL database. Render supplies `PORT`; the blueprint sets the service health check to `/api/healthz`.

Free Render web services and free Postgres are suitable for testing only; free Postgres expires after 30 days and has no backups. Upgrade the database for real persistent production data.

## Railway

Connect the GitHub repository to a Railway service. Add a PostgreSQL service in the same Railway project and expose/reference its `DATABASE_URL` to the app service. `railway.json` supplies the build and start commands. Railway supplies the runtime `PORT`.

## Build

Production build:

`pnpm run build:production`

Production start:

`pnpm run start:production`

## Important security note

The v56 state endpoint still identifies a user using the `x-user-id` header. This is suitable for a preview/prototype but is **not account authentication**. Do not treat it as secure multi-user production authentication until the account/session layer is implemented.
