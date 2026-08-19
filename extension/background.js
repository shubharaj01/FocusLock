// Smart Focus Lock Background Service Worker v3.0 (Zero-Login Realtime Direct Blocker)

const BACKEND_URL = "http://localhost:4000";
const RULE_ID_START = 1000;

let activeBlockedDomains = [];

// Normalize domain from any string or URL
function cleanDomain(str) {
  if (!str) return "";
  try {
    if (str.includes("://")) {
      return new URL(str).hostname.toLowerCase();
    }
    return str.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0].split("?")[0].split(":")[0];
  } catch (e) {
    return str.trim().toLowerCase();
  }
}

// Check if a tab URL matches any blocked domain
function isBlocked(urlStr) {
  if (!urlStr || urlStr.startsWith("chrome://") || urlStr.includes("blocked.html")) {
    return null;
  }
  const hostname = cleanDomain(urlStr);
  if (!hostname) return null;

  for (const domain of activeBlockedDomains) {
    if (hostname === domain || hostname.endsWith("." + domain)) {
      return domain;
    }
  }
  return null;
}

// Update Extension Action Badge Text
function updateBadge(count) {
  if (count > 0) {
    chrome.action.setBadgeText({ text: `${count}` });
    chrome.action.setBadgeBackgroundColor({ color: "#4f7cff" });
  } else {
    chrome.action.setBadgeText({ text: "0" });
    chrome.action.setBadgeBackgroundColor({ color: "#5b6270" });
  }
}

// Update Dynamic DeclarativeNetRequest Rules
async function updateDnrRules(domains) {
  try {
    const existing = await chrome.declarativeNetRequest.getDynamicRules();
    const existingIds = existing.map((r) => r.id);

    const newRules = [];
    let ruleId = RULE_ID_START;

    const blockedPageUrl = chrome.runtime.getURL("blocked.html");

    for (const domain of domains) {
      newRules.push({
        id: ruleId++,
        priority: 1,
        action: {
          type: "redirect",
          redirect: { url: `${blockedPageUrl}?site=${encodeURIComponent(domain)}` },
        },
        condition: {
          requestDomains: [domain],
          resourceTypes: ["main_frame"],
        },
      });

      newRules.push({
        id: ruleId++,
        priority: 1,
        action: {
          type: "redirect",
          redirect: { url: `${blockedPageUrl}?site=${encodeURIComponent(domain)}` },
        },
        condition: {
          urlFilter: `*://${domain}/*`,
          resourceTypes: ["main_frame"],
        },
      });

      newRules.push({
        id: ruleId++,
        priority: 1,
        action: {
          type: "redirect",
          redirect: { url: `${blockedPageUrl}?site=${encodeURIComponent(domain)}` },
        },
        condition: {
          urlFilter: `*://*.${domain}/*`,
          resourceTypes: ["main_frame"],
        },
      });
    }

    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: existingIds,
      addRules: newRules,
    });
  } catch (err) {
    console.warn("Focus Lock: Error setting DNR rules", err);
  }
}

// Fetch blocklist directly from backend API
async function syncBlocklist() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/blocklist`);
    if (!res.ok) return;
    const data = await res.json();
    const sites = data.sites || [];

    const activeSites = sites.filter((s) => s.active);
    const domains = activeSites.map((s) => cleanDomain(s.domain)).filter(Boolean);

    // Save to memory and chrome storage
    activeBlockedDomains = domains;
    await chrome.storage.local.set({ activeBlockedDomains: domains, sites });

    updateBadge(domains.length);
    await updateDnrRules(domains);

    // Check currently open tabs and redirect any matching tab immediately
    chrome.tabs.query({}, (tabs) => {
      if (!tabs) return;
      tabs.forEach((tab) => {
        if (tab.url) {
          const matchedDomain = isBlocked(tab.url);
          if (matchedDomain) {
            const redirectUrl = `${chrome.runtime.getURL("blocked.html")}?site=${encodeURIComponent(matchedDomain)}`;
            chrome.tabs.update(tab.id, { url: redirectUrl });
          }
        }
      });
    });
  } catch (err) {
    // Backend temporary unreachable - fallback to cached storage
    const stored = await chrome.storage.local.get(["activeBlockedDomains"]);
    if (stored.activeBlockedDomains) {
      activeBlockedDomains = stored.activeBlockedDomains;
      updateBadge(activeBlockedDomains.length);
    }
  }
}

// Real-Time Tab Navigation Interceptor
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const targetUrl = changeInfo.url || tab.url;
  if (!targetUrl) return;

  const matchedDomain = isBlocked(targetUrl);
  if (matchedDomain) {
    const blockedPageUrl = chrome.runtime.getURL("blocked.html");
    const redirectTarget = `${blockedPageUrl}?site=${encodeURIComponent(matchedDomain)}`;

    // Instantly update tab
    chrome.tabs.update(tabId, { url: redirectTarget });

    // Report block attempt event to backend monitoring
    fetch(`${BACKEND_URL}/api/monitoring/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain: matchedDomain }),
    }).catch(() => {});
  }
});

// Initialization & Fast 400ms Sub-Second Polling Loop
syncBlocklist();
setInterval(syncBlocklist, 400); // 400ms sub-second real-time backend sync loop

chrome.runtime.onInstalled.addListener(syncBlocklist);
chrome.runtime.onStartup.addListener(syncBlocklist);
