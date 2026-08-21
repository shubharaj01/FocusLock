import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { api } from "../api.js";

export default function Settings() {
  const { user, token, setUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [weeklyGoalHours, setWeeklyGoalHours] = useState(20);
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "Student");
      setEmail(user.email || "");
      setWeeklyGoalHours(user.weekly_goal_hours || 20);
      setFocusDuration(user.focus_duration_minutes || 25);
      setBreakDuration(user.break_duration_minutes || 5);
    }
  }, [user]);

  const initial = name ? name.charAt(0).toUpperCase() : "S";

  async function handleSave(e) {
    if (e) e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const { user: updated } = await api.updateMe(token, {
        name: name.trim(),
        email: email.trim(),
        weekly_goal_hours: parseFloat(weeklyGoalHours) || 20,
        focus_duration_minutes: parseInt(focusDuration) || 25,
        break_duration_minutes: parseInt(breakDuration) || 5,
      });
      setUser(updated);
      setIsEditModalOpen(false);
      setSuccessMsg("Settings and profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setErrorMsg(err.message || "Failed to update profile settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-lg">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-headline-md font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[28px]">settings</span>
            Settings
          </h2>
          <p className="text-body-md text-on-surface-variant">Manage your account profile and study preferences.</p>
        </div>
      </header>

      {successMsg && (
        <div className="p-md rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold text-body-md flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="p-md rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-semibold text-body-md flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">error</span>
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-12 gap-lg">
        {/* Profile Card (Left Column, Span 4) */}
        <section className="col-span-12 lg:col-span-4 space-y-lg">
          <div className="glass-card rounded-xl p-lg text-center">
            <div className="flex flex-col items-center text-center space-y-md">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center border-4 border-surface-container shadow-md">
                  <span className="text-on-primary font-display text-headline-lg font-bold">{initial}</span>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-105 transition-transform"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
              </div>
              <div>
                <h3 className="font-headline-md text-on-surface font-bold">{name}</h3>
                <p className="text-on-surface-variant font-body-md">{email}</p>
                <p className="text-on-surface-variant text-label-md uppercase tracking-wider mt-xs font-semibold">
                  Focus Lock Student Account
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="w-full py-2.5 border border-primary text-primary rounded-xl font-bold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                Edit Profile
              </button>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="glass-card rounded-xl p-lg">
            <div className="flex items-center gap-sm mb-lg">
              <span className="material-symbols-outlined text-primary text-[24px]">palette</span>
              <h3 className="text-title-lg text-on-surface font-bold">Appearance</h3>
            </div>

            <div className="space-y-md">
              <div className="flex items-center justify-between p-md bg-surface-container-low rounded-xl border border-outline-variant/40">
                <div className="flex items-center gap-md">
                  <span className="material-symbols-outlined text-on-surface-variant">dark_mode</span>
                  <span className="font-body-md font-semibold">Dark Theme</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input checked={!!isDark} onChange={toggleTheme} className="sr-only peer" type="checkbox" />
                  <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>
          </div>

          <section className="glass-card rounded-xl p-lg">
            <div className="flex items-center gap-sm mb-lg">
              <span className="material-symbols-outlined text-primary text-[24px]">notifications_active</span>
              <h3 className="text-title-lg text-on-surface font-bold">Notifications</h3>
            </div>
            <div className="space-y-md">
              <div className="flex items-center justify-between p-md bg-surface-container-low border border-outline-variant rounded-xl">
                <div className="flex items-center gap-md">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-400 flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">task_alt</span>
                  </div>
                  <div>
                    <p className="font-body-md font-semibold">Session Complete</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input defaultChecked={true} className="sr-only peer" type="checkbox" />
                  <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
              <div className="flex items-center justify-between p-md bg-surface-container-low border border-outline-variant rounded-xl">
                <div className="flex items-center gap-md">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-400 flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">coffee</span>
                  </div>
                  <div>
                    <p className="font-body-md font-semibold">Break Reminder</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input defaultChecked={true} className="sr-only peer" type="checkbox" />
                  <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>
          </section>
        </section>

        {/* Settings Rows (Right Column, Span 8) */}
        <div className="col-span-12 lg:col-span-8 space-y-lg">
          {/* Study Preferences */}
          <section className="glass-card rounded-xl p-lg">
            <div className="flex items-center gap-sm mb-lg">
              <span className="material-symbols-outlined text-primary text-[24px]">timer</span>
              <h3 className="text-title-lg text-on-surface font-bold">Study Preferences</h3>
            </div>
            <div className="space-y-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md">
                <div>
                  <p className="font-body-md font-semibold">Focus Session Duration</p>
                  <p className="text-on-surface-variant text-label-md">Real-time focus target for study timer</p>
                </div>
                <div className="flex bg-surface-container p-1 rounded-xl gap-1">
                  {[25, 45, 60].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setFocusDuration(dur)}
                      className={`px-4 py-1.5 rounded-lg text-label-md font-bold transition-all ${
                        focusDuration === dur
                          ? "bg-primary text-white shadow-sm"
                          : "hover:bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      {dur}m
                    </button>
                  ))}
                </div>
              </div>
              <hr className="border-outline-variant" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md">
                <div>
                  <p className="font-body-md font-semibold">Break Duration</p>
                  <p className="text-on-surface-variant text-label-md">Rest intervals between study blocks</p>
                </div>
                <div className="flex bg-surface-container p-1 rounded-xl gap-1">
                  {[5, 10, 15].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setBreakDuration(dur)}
                      className={`px-4 py-1.5 rounded-lg text-label-md font-bold transition-all ${
                        breakDuration === dur
                          ? "bg-primary text-white shadow-sm"
                          : "hover:bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      {dur}m
                    </button>
                  ))}
                </div>
              </div>
              <hr className="border-outline-variant" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body-md font-semibold">Weekly Study Goal (Hours)</p>
                  <p className="text-on-surface-variant text-label-md">Target hours per week</p>
                </div>
                <input
                  type="number"
                  min="1"
                  max="168"
                  value={weeklyGoalHours}
                  onChange={(e) => setWeeklyGoalHours(e.target.value)}
                  className="w-24 px-3 py-1.5 bg-surface-container-low border border-outline-variant rounded-xl text-body-md text-center font-bold"
                />
              </div>
            </div>
          </section>

          {/* AI Monitoring Settings */}
          <section className="glass-card rounded-xl p-lg">
            <div className="flex items-center gap-sm mb-lg">
              <span className="material-symbols-outlined text-primary text-[24px]">psychology</span>
              <h3 className="text-title-lg text-on-surface font-bold">AI Monitoring Settings</h3>
            </div>
            <div className="space-y-md">
              <div className="flex items-center justify-between p-md bg-surface-container-low border border-outline-variant rounded-xl">
                <div className="flex items-center gap-md">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-400 flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">videocam</span>
                  </div>
                  <div>
                    <p className="font-body-md font-semibold">Enable Camera Presence Monitoring</p>
                    <p className="text-on-surface-variant text-label-md">Active session-wide video presence tracking</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input defaultChecked={true} className="sr-only peer" type="checkbox" />
                  <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>
          </section>

          {/* Account Actions */}
          <section className="flex flex-col sm:flex-row items-center gap-md pt-lg">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full sm:w-auto px-8 py-3.5 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">save</span>
              {saving ? "Saving Changes…" : "Save Changes"}
            </button>
          </section>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card bg-surface rounded-2xl max-w-md w-full p-lg shadow-2xl space-y-lg border border-outline-variant">
            <div className="flex justify-between items-center border-b border-outline-variant pb-md">
              <h3 className="text-headline-md font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">manage_accounts</span>
                Edit Profile
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-md">
              <div>
                <label className="block text-label-md font-semibold text-on-surface mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
              <div>
                <label className="block text-label-md font-semibold text-on-surface mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-md border-t border-outline-variant">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant font-semibold hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-container shadow-md"
                >
                  {saving ? "Saving…" : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

