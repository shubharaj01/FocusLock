import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/weekly", requireAuth, (req, res) => {
  const dailyStudy = db
    .prepare(
      `SELECT date(started_at) as day, SUM(duration_seconds) as seconds
       FROM sessions
       WHERE user_id = ? AND started_at >= date('now', '-6 days')
       GROUP BY date(started_at)
       ORDER BY day ASC`
    )
    .all(req.userId);

  const dailyBlocks = db
    .prepare(
      `SELECT date(created_at) as day, COUNT(*) as count
       FROM block_events
       WHERE user_id = ? AND created_at >= date('now', '-6 days')
       GROUP BY date(created_at)
       ORDER BY day ASC`
    )
    .all(req.userId);

  const topDistractions = db
    .prepare(
      `SELECT domain, COUNT(*) as count
       FROM block_events
       WHERE user_id = ? AND created_at >= date('now', '-6 days')
       GROUP BY domain
       ORDER BY count DESC
       LIMIT 5`
    )
    .all(req.userId);

  const totalSecondsRow = db
    .prepare(
      `SELECT COALESCE(SUM(duration_seconds), 0) as total
       FROM sessions WHERE user_id = ? AND started_at >= date('now', '-6 days')`
    )
    .get(req.userId);

  res.json({
    dailyStudy,
    dailyBlocks,
    topDistractions,
    totalStudyHours: Math.round((totalSecondsRow.total / 3600) * 10) / 10,
  });
});

export default router;
