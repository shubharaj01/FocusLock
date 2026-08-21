import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api.js";

export default function StudyHub() {
  const { token, user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [sites, setSites] = useState([]);
  const [busy, setBusy] = useState(false);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const refresh = useCallback(async () => {
    if (!token) return;
    const [{ sessions }, { activeSession }, { sites }] = await Promise.all([
      api.getSessions(token),
      api.getTodayMonitoring(token),
      api.getBlocklist(token, true),
    ]);
    setSessions(sessions || []);
    setActiveSession(activeSession);
    setSites((sites || []).filter((s) => s.active).slice(0, 5));
  }, [token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Real-time ticking timer loop
  useEffect(() => {
    if (!activeSession) {
      setElapsedSeconds(0);
      return;
    }
    const startedAtMs = new Date(activeSession.started_at + "Z").getTime();
    const update = () => {
      const nowMs = Date.now();
      const diffSecs = Math.max(0, Math.floor((nowMs - startedAtMs) / 1000));
      setElapsedSeconds(diffSecs);
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [activeSession]);

  async function toggleSession() {
    setBusy(true);
    try {
      if (activeSession) {
        await api.endSession(token, activeSession.id);
      } else {
        await api.startSession(token, "Focus Session");
      }
      await refresh();
      window.postMessage({ type: "FOCUS_LOCK_SITE_UPDATED" }, "*");
    } finally {
      setBusy(false);
    }
  }

  const focusDurationMins = user?.focus_duration_minutes || 25;
  const breakDurationMins = user?.break_duration_minutes || 5;
  const targetTotalSeconds = focusDurationMins * 60;
  const remainingSeconds = Math.max(0, targetTotalSeconds - elapsedSeconds);
  const remMins = Math.floor(remainingSeconds / 60);
  const remSecs = remainingSeconds % 60;
  const countdownFormatted = `${remMins.toString().padStart(2, "0")}:${remSecs.toString().padStart(2, "0")}`;
  const timerPercent = Math.min(100, Math.round((elapsedSeconds / targetTotalSeconds) * 100));

  const weeklyGoalHours = user?.weekly_goal_hours || 20;
  const totalSecondsThisWeek = sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
  const hoursDone = Math.round((totalSecondsThisWeek / 3600) * 10) / 10;

  return (
    <div className="space-y-lg">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-headline-md font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[28px]">dashboard</span>
            Welcome back, {user?.name}
          </h2>
          <p className="text-body-md text-on-surface-variant">Here's how your studying is going.</p>
        </div>
        <button
          onClick={toggleSession}
          disabled={busy}
          className={`px-5 py-2.5 rounded-xl font-semibold text-white transition-all shadow-md flex items-center gap-2 ${
            activeSession ? "bg-red-500 hover:bg-red-600 shadow-red-500/20" : "bg-primary hover:bg-primary-container shadow-primary/20"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">{activeSession ? "stop_circle" : "play_circle"}</span>
          {activeSession ? "End Session" : "Start Session"}
        </button>
      </header>

      {/* Real-time Focus Timer Banner when session is active */}
      {activeSession && (
        <section className="glass-card rounded-2xl p-lg bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 border border-primary/30 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-lg">
            <div className="flex items-center gap-md">
              <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md animate-pulse">
                <span className="material-symbols-outlined text-[36px]">timer</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-label-md uppercase font-bold text-primary tracking-wider">
                    Focus Session Active ({focusDurationMins}m Goal)
                  </span>
                </div>
                <h3 className="text-display-sm font-extrabold text-on-surface font-mono tracking-tight mt-1">
                  {countdownFormatted}
                </h3>
                <p className="text-body-sm text-on-surface-variant">
                  {remainingSeconds > 0
                    ? `${remMins}m ${remSecs}s remaining · Next break: ${breakDurationMins}m`
                    : "🎉 Focus interval complete! Take a break."}
                </p>
              </div>
            </div>
            <div className="w-full md:w-64 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-on-surface-variant">
                <span>Progress</span>
                <span>{timerPercent}%</span>
              </div>
              <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-1000"
                  style={{ width: `${timerPercent}%` }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-12 gap-lg">
        <div className="col-span-12 lg:col-span-8 space-y-lg">
          <section className="glass-card rounded-xl p-lg">
            <div className="flex items-center gap-sm mb-lg">
              <span className="material-symbols-outlined text-primary text-[24px]">history</span>
              <h3 className="text-title-lg text-on-surface font-bold">Recent Sessions</h3>
            </div>
            {sessions.length === 0 && (
              <p className="text-body-md text-on-surface-variant">No sessions yet — hit Start Session to begin.</p>
            )}
            <div className="space-y-3">
              {sessions.slice(0, 6).map((s) => (
                <div key={s.id} className="flex justify-between items-center p-3 rounded-xl bg-surface-container-low border border-outline-variant/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-400 flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[20px]">timer</span>
                    </div>
                    <div>
                      <p className="font-semibold text-on-surface">{s.label}</p>
                      <p className="text-sm text-on-surface-variant">
                        {new Date(s.started_at + "Z").toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-primary">
                    {s.ended_at ? `${Math.round(s.duration_seconds / 60)}m` : "In progress…"}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-lg">
          <section className="glass-card rounded-xl p-lg bg-primary/5">
            <div className="flex items-center gap-sm mb-lg">
              <span className="material-symbols-outlined text-primary text-[24px]">workspace_premium</span>
              <h3 className="text-title-lg text-on-surface font-bold">Weekly Study Goal</h3>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-headline-lg font-bold text-on-surface">{hoursDone}</span>
              <span className="text-label-md text-on-surface-variant uppercase">of {weeklyGoalHours} hrs</span>
              <div className="w-full h-2 bg-surface-container-high rounded-full mt-md overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${Math.min(100, (hoursDone / weeklyGoalHours) * 100)}%` }}
                />
              </div>
            </div>
          </section>

          <section className="glass-card rounded-xl p-lg">
            <div className="flex items-center gap-sm mb-lg">
              <span className="material-symbols-outlined text-primary text-[24px]">block</span>
              <h3 className="text-title-lg text-on-surface font-bold">Active Blocklist</h3>
            </div>
            {sites.length === 0 ? (
              <p className="text-body-md text-on-surface-variant">No sites blocked yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {sites.map((s) => (
                  <span key={s.id} className="px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-label-md font-medium text-on-surface flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    {s.domain}
                  </span>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

