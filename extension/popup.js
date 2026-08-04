const API_BASE = "http://localhost:4000";

const loginView = document.getElementById("login-view");
const appView = document.getElementById("app-view");

async function init() {
  const { token, blockingEnabled } = await chrome.storage.local.get(["token", "blockingEnabled"]);
  if (token) {
    loginView.classList.add("hidden");
    appView.classList.remove("hidden");
    document.getElementById("toggle").checked = blockingEnabled !== false;
  } else {
    loginView.classList.remove("hidden");
    appView.classList.add("hidden");
  }
}

document.getElementById("login-btn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const statusEl = document.getElementById("login-status");
  statusEl.textContent = "Signing in...";

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      statusEl.textContent = data.error || "Login failed";
      return;
    }
    await chrome.storage.local.set({ token: data.token, apiBase: API_BASE, blockingEnabled: true });
    chrome.runtime.sendMessage({ type: "SYNC_NOW" });
    init();
  } catch (err) {
    statusEl.textContent = "Could not reach the backend. Is it running?";
  }
});

document.getElementById("toggle").addEventListener("change", async (e) => {
  await chrome.storage.local.set({ blockingEnabled: e.target.checked });
  chrome.runtime.sendMessage({ type: "SYNC_NOW" });
});

document.getElementById("sync-btn").addEventListener("click", () => {
  const statusEl = document.getElementById("sync-status");
  statusEl.textContent = "Syncing...";
  chrome.runtime.sendMessage({ type: "SYNC_NOW" }, () => {
    statusEl.textContent = "Blocklist synced ✓";
    setTimeout(() => (statusEl.textContent = ""), 2000);
  });
});

document.getElementById("logout-btn").addEventListener("click", async () => {
  await chrome.storage.local.remove(["token"]);
  chrome.runtime.sendMessage({ type: "SYNC_NOW" });
  init();
});

init();
