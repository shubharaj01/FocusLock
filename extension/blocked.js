const params = new URLSearchParams(location.search);
const site = params.get("site") || "this site";
document.getElementById("site-name").textContent = `${site} is blocked`;

chrome.storage.local.get(["apiBase", "token"], async ({ apiBase, token }) => {
  const base = apiBase || "http://localhost:4000";
  document.getElementById("back-link").href = `${base.replace("4000", "5173")}/study-hub`;

  if (!token) return;
  try {
    // This is what powers the "real-time" Monitoring page — every blocked
    // attempt is logged the instant it happens.
    await fetch(`${base}/api/monitoring/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ domain: site }),
    });
  } catch (err) {
    console.warn("Focus Lock: could not report block event", err);
  }
});
