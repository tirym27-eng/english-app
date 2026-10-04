# English App v56 — Production deployment

This workspace is prepared as a single Node web service: the API serves `/api/*` and the built Vite app from the same origin.

## Required production variables
- `DATABASE_URL` — PostgreSQL connection string.
- `NODE_ENV=production`
- `PORT` — supplied by the platform (`10000` on Render; Railway supplies its own runtime port).
- `BASE_PATH=/`

## Render
The included `render.yaml` provisions a web service and PostgreSQL database. Connect the GitHub repository and use the Blueprint.

## Railway
Connect the GitHub repository as a service. Add a PostgreSQL service and reference its `DATABASE_URL` in the app service. The included `railway.json` supplies the production build/start commands.

## Important
Do not commit real API keys or database credentials.
