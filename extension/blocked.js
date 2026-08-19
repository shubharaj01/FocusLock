const params = new URLSearchParams(location.search);
const site = params.get("site") || "this site";
document.getElementById("site-name").textContent = `${site} is blocked`;

const BACKEND_URL = "http://localhost:4000";

try {
  document.getElementById("back-link").href = "http://localhost:5173/study-hub";
} catch (e) {}

// Report block attempt telemetry to backend
fetch(`${BACKEND_URL}/api/monitoring/event`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ domain: site }),
}).catch(() => {});

// Real-time Auto-Unblock Watcher:
// If the site is removed from the dashboard blocklist while this tab is showing blocked.html,
// automatically redirect back to the site URL!
async function checkIfStillBlocked() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/blocklist`);
    if (!res.ok) return;
    const data = await res.json();
    const sites = (data.sites || []).filter((s) => s.active);
    const activeDomains = sites.map((s) => s.domain.toLowerCase().trim());

    const cleanSite = site
      .toLowerCase()
      .trim()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0]
      .split(":")[0];

    const isStillBlocked = activeDomains.some((d) => {
      const cleanD = d.replace(/^www\./, "");
      return cleanSite === cleanD || cleanSite.endsWith("." + cleanD) || cleanD.endsWith("." + cleanSite);
    });

    if (!isStillBlocked) {
      // Auto-redirect back to the website instantly!
      const targetUrl = site.startsWith("http") ? site : `https://${site}`;
      location.href = targetUrl;
    }
  } catch (e) {}
}

setInterval(checkIfStillBlocked, 400); // 400ms fast check
