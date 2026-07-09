import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api.js";

export default function Monitoring() {
  const { token } = useAuth();
  const [data, setData] = useState({ events: [], totalBlocked: 0, activeSession: null });

  useEffect(() => {
    let cancelled = false;
    async function poll() {
      try {
        const result = await api.getTodayMonitoring(token);
        if (!cancelled) setData(result);
      } catch (err) {
        // ignore transient errors between polls
      }
    }
    poll();
    const interval = setInterval(poll, 4000); // real-time-ish: refresh every 4s
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [token]);

  return (
    <div className="space-y-lg">
      <header>
        <h2 className="text-headline-md font-bold text-on-surface">Monitoring</h2>
        <p className="text-body-md text-on-surface-variant">
          See your focus patterns as you study.
        </p>
      </header>

      <div className="grid grid-cols-12 gap-lg">
        <section className="col-span-12 md:col-span-4 glass-card rounded-xl p-lg text-center">
          <p className="text-label-md text-on-surface-variant uppercase mb-sm">Blocked Today</p>
          <p className="text-headline-lg font-bold text-primary">{data.totalBlocked}</p>
        </section>
        <section className="col-span-12 md:col-span-4 glass-card rounded-xl p-lg text-center">
          <p className="text-label-md text-on-surface-variant uppercase mb-sm">Session Status</p>
          <p className="text-title-lg font-bold text-on-surface">
            {data.activeSession ? "Focusing 🔒" : "Idle"}
          </p>
        </section>
        <section className="col-span-12 md:col-span-4 glass-card rounded-xl p-lg text-center">
          <p className="text-label-md text-on-surface-variant uppercase mb-sm">Sites Attempted</p>
          <p className="text-headline-lg font-bold text-on-surface">{data.events.length}</p>
        </section>
      </div>

      <section className="glass-card rounded-xl p-lg">
        <h3 className="text-title-lg text-on-surface mb-md">Blocked Attempts Today</h3>
        {data.events.length === 0 ? (
          <p className="text-body-md text-on-surface-variant">
      
          </p>
        ) : (
          <div className="space-y-2">
            {data.events.map((e) => (
              <div key={e.domain} className="flex justify-between items-center p-3 rounded-lg bg-surface-container-low">
                <span className="font-semibold text-on-surface">{e.domain}</span>
                <span className="text-sm text-on-surface-variant">
                  {e.count} attempt{e.count > 1 ? "s" : ""} · last at{" "}
                  {new Date(e.last_attempt + "Z").toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
