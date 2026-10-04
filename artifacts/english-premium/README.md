# English Premium — Unified Core + API

This build preserves the original workspace/server structure and uses the unified English learning app as the frontend.

## Architecture
- `artifacts/english-premium/` — English learning frontend.
- `artifacts/api-server/` — Express API server, including `/api/healthz` and canonical `/api/state` sync.
- `lib/db/` — PostgreSQL/Drizzle workspace package preserved from the original project.
- `lib/api-spec/openapi.yaml` — API contract updated with state sync.

## Canonical state
The frontend uses `english_app_core_v1` as the canonical learning state and keeps legacy localStorage mirrors for compatibility.

When a database is configured, the frontend syncs this state through `/api/state` using a per-device guest ID. Existing Supabase account synchronization remains compatible with the frontend.

## Run
Use the workspace's original pnpm setup. The API server can start without a database for `/api/healthz`; state sync requires `DATABASE_URL`.
