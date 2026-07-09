// Background service worker: this is what actually blocks sites in real time.
// It pulls the user's blocklist from the backend and turns it into
// declarativeNetRequest rules, which Chrome enforces at the network level
// (no page even starts loading for a blocked domain).

const RULE_ID_START = 1000; // dynamic rule ids we own

async function getSettings() {
  const { apiBase, token, blockingEnabled } = await chrome.storage.local.get([
    "apiBase",
    "token",
    "blockingEnabled",
  ]);
  return {
    apiBase: apiBase || "http://localhost:4000",
    token,
    blockingEnabled: blockingEnabled !== false, // default ON
  };
}

async function syncBlocklist() {
  const { apiBase, token, blockingEnabled } = await getSettings();
  if (!token) return; // not logged in yet

  // If blocking is toggled off, clear all our rules and stop.
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  const ourRuleIds = existing.map((r) => r.id);

  if (!blockingEnabled) {
    if (ourRuleIds.length) {
      await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: ourRuleIds });
    }
    return;
  }

  let sites = [];
  try {
    const res = await fetch(`${apiBase}/api/blocklist`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const data = await res.json();
    sites = (data.sites || []).filter((s) => s.active);
  } catch (err) {
    console.warn("Focus Lock: could not reach backend to sync blocklist", err);
    return;
  }

  const blockedPageUrl = chrome.runtime.getURL("blocked.html");

  const newRules = sites.map((site, i) => ({
    id: RULE_ID_START + i,
    priority: 1,
    action: {
      type: "redirect",
      redirect: { url: `${blockedPageUrl}?site=${encodeURIComponent(site.domain)}` },
    },
    condition: {
      urlFilter: `||${site.domain}^`,
      resourceTypes: ["main_frame"],
    },
  }));

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: ourRuleIds,
    addRules: newRules,
  });
}

// Sync on install/startup, and every minute afterwards for "real-time" updates
chrome.runtime.onInstalled.addListener(syncBlocklist);
chrome.runtime.onStartup.addListener(syncBlocklist);
chrome.alarms.create("focus-lock-sync", { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "focus-lock-sync") syncBlocklist();
});

// Let the popup trigger an immediate re-sync (e.g. right after login or adding a site)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "SYNC_NOW") {
    syncBlocklist().then(() => sendResponse({ ok: true }));
    return true; // keep the message channel open for the async response
  }
});
