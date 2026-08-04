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

// BUG FIX (Issue 1 - blocking never stops after a focus session ends):
// Root cause: this function only ever checked the manual `blockingEnabled`
// toggle (extension popup switch) and the per-site `active` flag. It had NO
// awareness of the "focus session" concept that lives in the backend
// (sessions table, driven by Start Session / End Session in the dashboard).
// So ending a session in the dashboard never cleared the extension's rules -
// there was simply nothing wiring the two together, which is why blocking
// "stuck" until someone manually flipped the popup toggle off.
//
// Fix: treat the backend's `activeSession` (already exposed by the existing
// /api/monitoring/today endpoint) as the source of truth for whether a
// session is currently running, and require it - in addition to the
// existing blockingEnabled/per-site checks - before any block rule is
// applied. This runs on every sync (on install/startup, the 1-minute alarm,
// and manual "Sync now"), so as soon as a session ends - whether the user
// clicks "End Session" or just closes the tab and the backend session is
// stopped some other way - the very next sync clears all rules. It also
// self-heals stale state: if the extension (or its storage) was left in a
// weird state, the next sync reconciles it against the real backend state
// rather than trusting whatever was last cached locally.
async function fetchActiveSession(apiBase, token) {
  try {
    const res = await fetch(`${apiBase}/api/monitoring/today`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.activeSession || null;
  } catch (err) {
    console.warn("Focus Lock: could not check active session status", err);
    return null; // fail closed on the network error, not on blocking state
  }
}

// BUG FIX (Issue 1): single place that clears every dynamic rule we own.
// Used both by the "no active session" path below and available for any
// other cleanup trigger, so there's one reliable code path for "stop all
// blocking" instead of that logic being duplicated/drifting over time.
async function clearAllBlockRules() {
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  const ourRuleIds = existing.map((r) => r.id);
  if (ourRuleIds.length) {
    await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: ourRuleIds });
  }
}

async function syncBlocklist() {
  const { apiBase, token, blockingEnabled } = await getSettings();

  // BUG FIX (Issue 1 - related stale-state case): previously this returned
  // immediately on logout without touching declarativeNetRequest, so any
  // rules that were active at logout time stayed active forever (there's no
  // token afterwards, so no future sync could ever reach the "clear" logic
  // below either). Now logging out also clears blocking, same as ending a
  // session.
  if (!token) {
    await clearAllBlockRules();
    return; // not logged in yet
  }

  // If blocking is toggled off, clear all our rules and stop.
  if (!blockingEnabled) {
    await clearAllBlockRules();
    return;
  }

  // BUG FIX (Issue 1): no active focus session -> nothing should be blocked,
  // regardless of the blockingEnabled toggle or the saved site list. This is
  // the check that was missing before, and it's what actually makes
  // blocking stop the moment a session ends (or was ended manually).
  const activeSession = await fetchActiveSession(apiBase, token);
  if (!activeSession) {
    await clearAllBlockRules();
    return;
  }

  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  const ourRuleIds = existing.map((r) => r.id);

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
