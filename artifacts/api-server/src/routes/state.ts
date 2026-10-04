import { Router, type IRouter, type Request } from "express";
import { pool } from "@workspace/db";

const router: IRouter = Router();
let schemaReady: Promise<void> | null = null;

function getUserId(req: Request): string {
  const id = String(req.header("x-user-id") || "").trim();
  if (!id || id.length > 128 || !/^[A-Za-z0-9._:-]+$/.test(id)) {
    const err = new Error("A valid x-user-id header is required");
    (err as any).status = 400;
    throw err;
  }
  return id;
}

function db() {
  if (!process.env.DATABASE_URL) {
    const err = new Error("DATABASE_URL is required for state sync");
    (err as any).status = 503;
    throw err;
  }
  if (!schemaReady) {
    schemaReady = pool.query(`
      CREATE TABLE IF NOT EXISTS learning_state (
        user_id TEXT PRIMARY KEY,
        state JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `).then(() => undefined).catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  return pool;
}

router.get("/state", async (req, res) => {
  try {
    const userId = getUserId(req);
    const p = db();
    await schemaReady;
    const result = await p.query(
      "SELECT state, updated_at FROM learning_state WHERE user_id = $1",
      [userId],
    );
    if (!result.rows[0]) return res.status(404).json({ state: null, updatedAt: null });
    return res.json({ state: result.rows[0].state, updatedAt: result.rows[0].updated_at });
  } catch (error) {
    const status = Number((error as any)?.status) || 500;
    req.log?.error?.({ err: error }, "state GET failed");
    return res.status(status).json({ error: status === 503 ? "State sync is not configured" : "Unable to load state" });
  }
});

router.put("/state", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({ error: "State must be a JSON object" });
    }
    const state = req.body;
    const p = db();
    await schemaReady;
    const result = await p.query(
      `INSERT INTO learning_state (user_id, state, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (user_id) DO UPDATE
       SET state = EXCLUDED.state, updated_at = NOW()
       RETURNING updated_at`,
      [userId, JSON.stringify(state)],
    );
    return res.json({ ok: true, updatedAt: result.rows[0].updated_at });
  } catch (error) {
    const status = Number((error as any)?.status) || 500;
    req.log?.error?.({ err: error }, "state PUT failed");
    return res.status(status).json({ error: status === 503 ? "State sync is not configured" : "Unable to save state" });
  }
});

export default router;
