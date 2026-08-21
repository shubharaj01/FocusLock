import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCamera } from "../context/CameraContext.jsx";
import { api } from "../api.js";

export default function Monitoring() {
  const { token } = useAuth();
  const { sessionActive, cameraStatus, cameraErrorMessage, presence, attachVideoElement } = useCamera();
  const [data, setData] = useState({ events: [], totalBlocked: 0, activeSession: null });

  useEffect(() => {
    let cancelled = false;
    async function poll() {
      try {
        const result = await api.getTodayMonitoring(token);
        if (!cancelled) setData(result);
      } catch (err) {}
    }
    poll();
    const interval = setInterval(poll, 3000); // refresh stats every 3s
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [token]);

  return (
    <div className="space-y-lg">
      <header>
        <h2 className="text-headline-md font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[28px]">visibility</span>
          Live Monitoring
        </h2>
        <p className="text-body-md text-on-surface-variant">
          Updates automatically as the browser extension blocks attempts.
        </p>
      </header>

      <div className="grid grid-cols-12 gap-lg">
        <section className="col-span-12 md:col-span-4 glass-card rounded-xl p-lg text-center">
          <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-400 flex items-center justify-center shadow-sm mx-auto mb-sm font-bold">
            <span className="material-symbols-outlined text-[20px]">block</span>
          </div>
          <p className="text-label-md text-on-surface-variant uppercase mb-xs font-semibold">Blocked Today</p>
          <p className="text-headline-lg font-bold text-primary">{data.totalBlocked}</p>
        </section>
        <section className="col-span-12 md:col-span-4 glass-card rounded-xl p-lg text-center">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm mx-auto mb-sm font-bold">
            <span className="material-symbols-outlined text-[20px]">lock</span>
          </div>
          <p className="text-label-md text-on-surface-variant uppercase mb-xs font-semibold">Session Status</p>
          <p className="text-title-lg font-bold text-on-surface">
            {sessionActive ? "Focusing 🔒" : "Idle"}
          </p>
        </section>
        <section className="col-span-12 md:col-span-4 glass-card rounded-xl p-lg text-center">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 dark:bg-secondary/20 text-secondary dark:text-purple-400 flex items-center justify-center shadow-sm mx-auto mb-sm font-bold">
            <span className="material-symbols-outlined text-[20px]">history</span>
          </div>
          <p className="text-label-md text-on-surface-variant uppercase mb-xs font-semibold">Sites Attempted</p>
          <p className="text-headline-lg font-bold text-on-surface">{data.events.length}</p>
        </section>
      </div>

      <section className="glass-card rounded-xl p-lg">
        <div className="flex items-center gap-sm mb-lg">
          <span className="material-symbols-outlined text-primary text-[24px]">videocam</span>
          <h3 className="text-title-lg text-on-surface font-bold">Presence Monitoring</h3>
        </div>
        {!sessionActive ? (
          <p className="text-body-md text-on-surface-variant">
            Camera monitoring runs automatically throughout active focus sessions. Start a session from Study Hub to enable it.
          </p>
        ) : cameraStatus === "denied" || cameraStatus === "error" ? (
          <p className="text-body-md text-red-500">{cameraErrorMessage}</p>
        ) : (
          <div className="flex items-center gap-lg">
            <video
              ref={attachVideoElement}
              autoPlay
              muted
              playsInline
              className="w-40 h-28 rounded-xl bg-black object-cover border border-outline-variant shadow-md"
            />
            <div>
              <p className="text-body-md text-on-surface font-semibold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                Camera: {cameraStatus === "requesting" ? "Requesting access…" : "Active (Running Session-Wide)"}
              </p>
              <p className="text-sm text-on-surface-variant mt-1 font-medium">
                {presence === "present" && "🟢 Movement & Presence Detected"}
                {presence === "still" && "🟡 Still / No Movement Detected"}
                {presence === "unknown" && "⚪ Calibrating stream…"}
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="glass-card rounded-xl p-lg">
        <div className="flex items-center gap-sm mb-lg">
          <span className="material-symbols-outlined text-primary text-[24px]">list_alt</span>
          <h3 className="text-title-lg text-on-surface font-bold">Blocked Attempts Today</h3>
        </div>
        {data.events.length === 0 ? (
          <p className="text-body-md text-on-surface-variant">
            Nothing blocked yet today. Start a session and visit a blocked site to see attempts log here live.
          </p>
        ) : (
          <div className="space-y-2">
            {data.events.map((e) => (
              <div key={e.domain} className="flex justify-between items-center p-3 rounded-xl bg-surface-container-low border border-outline-variant/40">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[18px]">block</span>
                  </div>
                  <span className="font-semibold text-on-surface">{e.domain}</span>
                </div>
                <span className="text-sm text-on-surface-variant font-medium">
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

