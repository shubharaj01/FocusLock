import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// List active blocked sites for the logged-in user (extension polls this)
router.get("/", requireAuth, (req, res) => {
  const sites = db
    .prepare("SELECT id, domain, active FROM blocked_sites WHERE user_id = ? ORDER BY created_at DESC")
    .all(req.userId);
  res.json({ sites });
});

router.post("/", requireAuth, (req, res) => {
  const { domain } = req.body;
  if (!domain) return res.status(400).json({ error: "Domain is required" });
  const clean = domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  try {
    const info = db
      .prepare("INSERT INTO blocked_sites (user_id, domain) VALUES (?, ?)")
      .run(req.userId, clean);
    res.json({ id: info.lastInsertRowid, domain: clean, active: 1 });
  } catch (err) {
    res.status(409).json({ error: "That site is already on your blocklist" });
  }
});

router.patch("/:id", requireAuth, (req, res) => {
  const { active } = req.body;
  db.prepare("UPDATE blocked_sites SET active = ? WHERE id = ? AND user_id = ?").run(
    active ? 1 : 0,
    req.params.id,
    req.userId
  );
  res.json({ ok: true });
});

router.delete("/:id", requireAuth, (req, res) => {
  db.prepare("DELETE FROM blocked_sites WHERE id = ? AND user_id = ?").run(req.params.id, req.userId);
  res.json({ ok: true });
});

export default router;
