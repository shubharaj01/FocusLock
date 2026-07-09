import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api.js";

export default function Settings() {
  const { token, user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [goal, setGoal] = useState(user?.weekly_goal_hours || 20);
  const [saved, setSaved] = useState(false);

  async function save(e) {
    e.preventDefault();
    const { user: updated } = await api.updateMe(token, { name, weekly_goal_hours: Number(goal) });
    setUser(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-lg max-w-xl">
      <header>
        <h2 className="text-headline-md font-bold text-on-surface">Settings</h2>
        <p className="text-body-md text-on-surface-variant">Update your profile and study goal.</p>
      </header>

      <section className="glass-card rounded-xl p-lg">
        <form onSubmit={save} className="space-y-lg">
          <div className="space-y-sm">
            <label className="block text-label-md text-on-surface-variant">Name</label>
            <input
              className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-body-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-sm">
            <label className="block text-label-md text-on-surface-variant">Weekly Study Goal (hours)</label>
            <input
              type="number"
              min="1"
              className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-body-md"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>
          <button className="px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-container transition-colors">
            Save Changes
          </button>
          {saved && <span className="ml-3 text-sm text-green-600">Saved ✓</span>}
        </form>
      </section>

    </div>
  );
}
