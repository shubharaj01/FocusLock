import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";
import { requireAuth, JWT_SECRET } from "../middleware/auth.js";

const router = Router();

router.post("/register", (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) return res.status(409).json({ error: "Email already registered" });

  const hash = bcrypt.hashSync(password, 10);
  const info = db
    .prepare("INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)")
    .run(email, hash, name || "Student");

  const token = jwt.sign({ userId: info.lastInsertRowid }, JWT_SECRET, { expiresIn: "30d" });
  res.json({ token, user: { id: info.lastInsertRowid, email, name: name || "Student" } });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "30d" });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

router.get("/me", requireAuth, (req, res) => {
  const user = db
    .prepare("SELECT id, email, name, weekly_goal_hours FROM users WHERE id = ?")
    .get(req.userId);
  res.json({ user });
});

router.patch("/me", requireAuth, (req, res) => {
  const { name, weekly_goal_hours } = req.body;
  const current = db.prepare("SELECT * FROM users WHERE id = ?").get(req.userId);
  db.prepare("UPDATE users SET name = ?, weekly_goal_hours = ? WHERE id = ?").run(
    name ?? current.name,
    weekly_goal_hours ?? current.weekly_goal_hours,
    req.userId
  );
  const user = db
    .prepare("SELECT id, email, name, weekly_goal_hours FROM users WHERE id = ?")
    .get(req.userId);
  res.json({ user });
});

export default router;
