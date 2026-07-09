import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import blocklistRoutes from "./routes/blocklist.js";
import sessionRoutes from "./routes/sessions.js";
import monitoringRoutes from "./routes/monitoring.js";
import analyticsRoutes from "./routes/analytics.js";

const app = express();
app.use(cors()); // extension + frontend run on different origins, so allow all in dev
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/blocklist", blocklistRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/monitoring", monitoringRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Focus Lock backend running on http://localhost:${PORT}`));
