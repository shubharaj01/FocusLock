import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const data =
        mode === "login"
          ? await api.login(email, password)
          : await api.register(email, password, name);
      login(data.token, data.user);
      navigate("/study-hub");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-margin-mobile bg-surface">
      <div className="w-full max-w-[440px] flex flex-col items-center">
        <div className="mb-xl text-center">
          <div className="w-16 h-16 mb-md bg-primary text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined !text-[32px]">lock_person</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mb-xs">
            Smart Focus Lock
          </h1>
          <p className="text-body-md text-on-surface-variant opacity-80">Stay Focused. Study Smarter.</p>
        </div>

        <div className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-xl shadow-sm">
          <form className="space-y-lg" onSubmit={handleSubmit}>
            {mode === "register" && (
              <div className="space-y-sm">
                <label className="block text-label-md text-on-surface-variant px-xs">Name</label>
                <input
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
            )}
            <div className="space-y-sm">
              <label className="block text-label-md text-on-surface-variant px-xs" htmlFor="email">
                Student Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-sm">
              <label className="block text-label-md text-on-surface-variant px-xs" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3.5 bg-primary hover:bg-primary-container text-white font-semibold rounded-xl transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {busy ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="mt-lg text-center text-body-md text-on-surface-variant">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              className="text-primary font-semibold hover:underline"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
            >
              {mode === "login" ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
