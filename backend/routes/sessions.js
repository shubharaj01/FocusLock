import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Start a new session
router.post("/start", requireAuth, (req, res) => {
  const { label } = req.body;
  const info = db
    .prepare("INSERT INTO sessions (user_id, label) VALUES (?, ?)")
    .run(req.userId, label || "Study Session");
  res.json({ id: info.lastInsertRowid });
});

// End a session
router.post("/:id/end", requireAuth, (req, res) => {
  const session = db
    .prepare("SELECT * FROM sessions WHERE id = ? AND user_id = ?")
    .get(req.params.id, req.userId);
  if (!session) return res.status(404).json({ error: "Session not found" });

  const startedAt = new Date(session.started_at + "Z").getTime();
  const duration = Math.max(0, Math.round((Date.now() - startedAt) / 1000));

  db.prepare(
    "UPDATE sessions SET ended_at = CURRENT_TIMESTAMP, duration_seconds = ? WHERE id = ?"
  ).run(duration, session.id);

  res.json({ id: session.id, duration_seconds: duration });
});

// Recent sessions (for the Study Hub activity feed)
router.get("/", requireAuth, (req, res) => {
  const sessions = db
    .prepare(
      "SELECT id, label, started_at, ended_at, duration_seconds FROM sessions WHERE user_id = ? ORDER BY started_at DESC LIMIT 20"
    )
    .all(req.userId);
  res.json({ sessions });
});

export default router;
