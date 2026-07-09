const API_BASE = "http://localhost:4000";

async function request(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const api = {
  register: (email, password, name) => request("/api/auth/register", { method: "POST", body: { email, password, name } }),
  login: (email, password) => request("/api/auth/login", { method: "POST", body: { email, password } }),
  me: (token) => request("/api/auth/me", { token }),
  updateMe: (token, patch) => request("/api/auth/me", { method: "PATCH", body: patch, token }),

  getBlocklist: (token) => request("/api/blocklist", { token }),
  addSite: (token, domain) => request("/api/blocklist", { method: "POST", body: { domain }, token }),
  toggleSite: (token, id, active) => request(`/api/blocklist/${id}`, { method: "PATCH", body: { active }, token }),
  removeSite: (token, id) => request(`/api/blocklist/${id}`, { method: "DELETE", token }),

  startSession: (token, label) => request("/api/sessions/start", { method: "POST", body: { label }, token }),
  endSession: (token, id) => request(`/api/sessions/${id}/end`, { method: "POST", token }),
  getSessions: (token) => request("/api/sessions", { token }),

  getTodayMonitoring: (token) => request("/api/monitoring/today", { token }),

  getWeeklyAnalytics: (token) => request("/api/analytics/weekly", { token }),
};

export default API_BASE;
