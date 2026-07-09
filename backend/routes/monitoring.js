import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Called by the Chrome extension every time it blocks a site visit attempt
router.post("/event", requireAuth, (req, res) => {
  const { domain } = req.body;
  if (!domain) return res.status(400).json({ error: "Domain is required" });
  db.prepare("INSERT INTO block_events (user_id, domain) VALUES (?, ?)").run(req.userId, domain);
  res.json({ ok: true });
});

// Today's live stats — the Monitoring page polls this for a "real-time" feel
router.get("/today", requireAuth, (req, res) => {
  const events = db
    .prepare(
      `SELECT domain, COUNT(*) as count, MAX(created_at) as last_attempt
       FROM block_events
       WHERE user_id = ? AND date(created_at) = date('now')
       GROUP BY domain
       ORDER BY count DESC`
    )
    .all(req.userId);

  const totalBlocked = events.reduce((sum, e) => sum + e.count, 0);

  const activeSession = db
    .prepare("SELECT * FROM sessions WHERE user_id = ? AND ended_at IS NULL ORDER BY started_at DESC LIMIT 1")
    .get(req.userId);

  res.json({ events, totalBlocked, activeSession: activeSession || null });
});

export default router;
