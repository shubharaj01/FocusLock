// Focus Lock Content Script: Instant Real-time Bridge
// Listens to postMessage events from http://localhost:5173 and forwards them to background.js

window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  if (event.data?.type === "FOCUS_LOCK_SITE_UPDATED") {
    chrome.runtime.sendMessage({
      type: "REALTIME_SITE_UPDATE",
      sites: event.data.sites,
      sessionActive: event.data.sessionActive,
    });
  }
});
