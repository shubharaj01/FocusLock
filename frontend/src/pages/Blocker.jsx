import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api.js";

export default function Blocker() {
  const { token } = useAuth();
  const [sites, setSites] = useState([]);
  const [domain, setDomain] = useState("");
  const [error, setError] = useState("");

  async function refresh() {
    const { sites } = await api.getBlocklist(token);
    setSites(sites);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function addSite(e) {
    e.preventDefault();
    setError("");
    if (!domain.trim()) return;
    try {
      await api.addSite(token, domain.trim());
      setDomain("");
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggle(site) {
    await api.toggleSite(token, site.id, !site.active);
    await refresh();
  }

  async function remove(site) {
    await api.removeSite(token, site.id);
    await refresh();
  }

  return (
    <div className="space-y-lg">
      <header>
        <h2 className="text-headline-md font-bold text-on-surface">Website Blocker</h2>
        <p className="text-body-md text-on-surface-variant">
          Keep distractions away while you study.
        </p>
      </header>

      <section className="glass-card rounded-xl p-lg">
        <form onSubmit={addSite} className="flex gap-3 mb-lg">
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="e.g. youtube.com"
            className="flex-1 px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button className="px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-container transition-colors">
            Block Site
          </button>
        </form>
        {error && <p className="text-sm text-red-500 mb-md">{error}</p>}

        <div className="space-y-2">
          {sites.length === 0 && (
            <p className="text-body-md text-on-surface-variant">No sites added yet.</p>
          )}
          {sites.map((s) => (
            <div key={s.id} className="flex justify-between items-center p-3 rounded-lg bg-surface-container-low">
              <span className={`font-semibold ${s.active ? "text-on-surface" : "text-on-surface-variant line-through"}`}>
                {s.domain}
              </span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <input type="checkbox" checked={!!s.active} onChange={() => toggle(s)} />
                  Active
                </label>
                <button onClick={() => remove(s)} className="text-red-500 text-sm font-semibold hover:underline">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
