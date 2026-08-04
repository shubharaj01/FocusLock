# Smart Focus Lock

A real study-focus app: a Chrome extension that actually blocks distracting
sites, a backend with a real database, and a dashboard that shows live data.

## How it fits together

- **`backend/`** — Express + SQLite (file-based, zero setup). Handles login,
  your blocklist, study sessions, and every blocked-attempt event. This is the
  single source of truth both the extension and the dashboard talk to.
- **`extension/`** — Manifest V3 Chrome extension. Polls your blocklist from
  the backend every minute and uses `declarativeNetRequest` to actually block
  those domains at the network level (Chrome blocks them before the page even
  loads — no fake overlay). Every blocked attempt is reported back to the
  backend instantly, which is what makes the Monitoring page feel real-time.
- **`frontend/`** — React (Vite) dashboard: Login, Study Hub, Monitoring,
  Analytics, Website Blocker, Settings — one app, shared sidebar, real routing.

## Run it (in this order)

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
npm start
```
Runs on `http://localhost:4000`. `focuslock.db` (SQLite file) is created
automatically on first run — nothing else to configure.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173`. Register an account, then explore the pages —
Study Hub, Blocker, Analytics, etc. are all live against the backend.

### 3. Extension (this is what does the real blocking)
1. Open `chrome://extensions` in Chrome/Edge.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked** and select the `extension/` folder.
4. Click the extension's icon in your toolbar, sign in with the **same
   account** you registered on the dashboard.
5. Go to the dashboard's **Website Blocker** page and add a site (e.g.
   `youtube.com`).
6. Within a minute (or click "Sync blocklist now" in the popup for instantly),
   visiting that site will redirect to a blocked page — and it'll show up on
   the **Monitoring** page within a few seconds.

## Notes for tomorrow

- Everything defaults to `localhost` — fine for a single-machine demo. If you
  need it to work across devices, the only change needed is swapping
  `http://localhost:4000` for a real deployed URL in `frontend/src/api.js`,
  `extension/popup.js`, and `extension/background.js`.
- The database uses Node's **built-in** `node:sqlite` module (no native
  compilation, no Visual Studio / Xcode tools needed — just works as long as
  you're on Node 22.13+ / 23.4+ or newer). It's a single file
  (`backend/focuslock.db`) — easy to inspect, back up, or reset (delete it and
  restart the backend to get a fresh empty database).
