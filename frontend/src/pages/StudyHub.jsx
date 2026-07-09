import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api.js";

export default function StudyHub() {
  const { token, user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [sites, setSites] = useState([]);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const [{ sessions }, { events, activeSession }, { sites }] = await Promise.all([
      api.getSessions(token),
      api.getTodayMonitoring(token),
      api.getBlocklist(token),
    ]);
    setSessions(sessions);
    setActiveSession(activeSession);
    setSites(sites.filter((s) => s.active).slice(0, 4));
  }

  useEffect(() => {
    refresh();
  }, []);

  async function toggleSession() {
    setBusy(true);
    try {
      if (activeSession) {
        await api.endSession(token, activeSession.id);
      } else {
        await api.startSession(token, "Focus Session");
      }
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  const weeklyGoalHours = user?.weekly_goal_hours || 20;
  const totalSecondsThisWeek = sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
  const hoursDone = Math.round((totalSecondsThisWeek / 3600) * 10) / 10;

  return (
    <div className="space-y-lg">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-headline-md font-bold text-on-surface">Welcome back, {user?.name}</h2>
          <p className="text-body-md text-on-surface-variant">Here's how your studying is going.</p>
        </div>
        <button
          onClick={toggleSession}
          disabled={busy}
          className={`px-5 py-2.5 rounded-xl font-semibold text-white transition-colors ${
            activeSession ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary-container"
          }`}
        >
          {activeSession ? "End Session" : "Start Session"}
        </button>
      </header>

      <div className="grid grid-cols-12 gap-lg">
        <div className="col-span-12 lg:col-span-8 space-y-lg">
          <section className="glass-card rounded-xl p-lg">
            <h3 className="text-title-lg text-on-surface mb-md">Recent Sessions</h3>
            {sessions.length === 0 && (
              <p className="text-body-md text-on-surface-variant">No sessions yet — hit Start Session to begin.</p>
            )}
            <div className="space-y-3">
              {sessions.slice(0, 6).map((s) => (
                <div key={s.id} className="flex justify-between items-center p-3 rounded-lg bg-surface-container-low">
                  <div>
                    <p className="font-semibold text-on-surface">{s.label}</p>
                    <p className="text-sm text-on-surface-variant">
                      {new Date(s.started_at + "Z").toLocaleString()}
                    </p>
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
            <h3 className="text-title-lg text-on-surface mb-md">Weekly Study Goal</h3>
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
            <h3 className="text-title-lg text-on-surface mb-md">Active Blocklist</h3>
            {sites.length === 0 ? (
              <p className="text-body-md text-on-surface-variant">No sites blocked yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {sites.map((s) => (
                  <span key={s.id} className="px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-label-md">
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
