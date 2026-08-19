import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api.js";

export default function Blocker() {
  const { token } = useAuth();
  const [sites, setSites] = useState([]);
  const [domain, setDomain] = useState("");
  const [error, setError] = useState("");

  const notifyExtension = (updatedSites) => {
    window.postMessage({ type: "FOCUS_LOCK_SITE_UPDATED", sites: updatedSites }, "*");
  };

  const refresh = useCallback(async () => {
    if (!token) return;
    const { sites } = await api.getBlocklist(token, true);
    const siteList = sites || [];
    setSites(siteList);
    notifyExtension(siteList);
  }, [token]);


  useEffect(() => {
    refresh();
  }, [refresh]);

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
        <h2 className="text-headline-md font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[28px]">block</span>
          Website Blocker
        </h2>
        <p className="text-body-md text-on-surface-variant">
          Sites here are actually blocked by the Smart Focus Lock browser extension — it syncs
          this list automatically every minute (or instantly via "Sync now" in the extension popup).
        </p>
      </header>

      <section className="glass-card rounded-xl p-lg">
        <div className="flex items-center gap-sm mb-lg">
          <span className="material-symbols-outlined text-primary text-[24px]">add_link</span>
          <h3 className="text-title-lg text-on-surface font-bold">Add Blocked Site</h3>
        </div>
        <form onSubmit={addSite} className="flex gap-3 mb-lg">
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="e.g. youtube.com"
            className="flex-1 px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button className="px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-container transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Block Site
          </button>
        </form>
        {error && <p className="text-sm text-red-500 mb-md">{error}</p>}

        <div className="space-y-2">
          {sites.length === 0 && (
            <p className="text-body-md text-on-surface-variant">No sites added yet.</p>
          )}
          {sites.map((s) => (
            <div key={s.id} className="flex justify-between items-center p-3 rounded-xl bg-surface-container-low border border-outline-variant/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-400 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[18px]">language</span>
                </div>
                <span className={`font-semibold ${s.active ? "text-on-surface" : "text-on-surface-variant line-through"}`}>
                  {s.domain}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-on-surface-variant font-medium cursor-pointer">
                  <input type="checkbox" checked={!!s.active} onChange={() => toggle(s)} className="accent-primary" />
                  Active
                </label>
                <button onClick={() => remove(s)} className="text-red-500 text-sm font-semibold hover:underline flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">delete</span>
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
