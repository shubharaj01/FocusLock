export default function Settings() {
  return (
  <>
  <meta charSet="utf-8" />
  <meta content="width=device-width, initial-scale=1.0" name="viewport" />
  <title>Settings | Focus Lock</title>
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
    rel="stylesheet"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
    rel="stylesheet"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
    rel="stylesheet"
  />
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\n        .glass-effect {\n            backdrop-filter: blur(20px);\n            -webkit-backdrop-filter: blur(20px);\n        }\n        .material-symbols-outlined {\n            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;\n        }\n        .active-nav-indicator::after {\n            content: '';\n            position: absolute;\n            right: 0;\n            top: 0;\n            bottom: 0;\n            width: 4px;\n            background-color: currentColor;\n        }\n    "
    }}
  />
  {/* SideNavBar Component */}
  <aside className="h-screen w-64 fixed left-0 top-0 bg-surface dark:bg-inverse-surface border-r border-outline-variant dark:border-outline shadow-sm z-50 flex flex-col py-xl px-md">
    <div className="mb-2xl px-sm flex items-center gap-md">
      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
        <span className="material-symbols-outlined text-on-primary text-headline-md">
          lock
        </span>
      </div>
      <div>
        <h1 className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim">
          Focus Lock
        </h1>
      </div>
    </div>
    <nav className="flex-1 space-y-sm">
      <a
        className="flex items-center gap-md p-md rounded-xl text-on-surface-variant dark:text-on-secondary-fixed-variant hover:bg-surface-container dark:hover:bg-on-secondary-fixed-variant transition-colors duration-200"
        href="#"
      >
        <span className="material-symbols-outlined">menu_book</span>
        <span className="font-body-md">Study Hub</span>
      </a>
      <a
        className="flex items-center gap-md p-md rounded-xl text-on-surface-variant dark:text-on-secondary-fixed-variant hover:bg-surface-container dark:hover:bg-on-secondary-fixed-variant transition-colors duration-200"
        href="#"
      >
        <span className="material-symbols-outlined">visibility</span>
        <span className="font-body-md">Monitoring</span>
      </a>
      <a
        className="flex items-center gap-md p-md rounded-xl text-on-surface-variant dark:text-on-secondary-fixed-variant hover:bg-surface-container dark:hover:bg-on-secondary-fixed-variant transition-colors duration-200"
        href="#"
      >
        <span className="material-symbols-outlined">analytics</span>
        <span className="font-body-md">Analytics</span>
      </a>
      <a
        className="flex items-center gap-md p-md rounded-xl text-on-surface-variant dark:text-on-secondary-fixed-variant hover:bg-surface-container dark:hover:bg-on-secondary-fixed-variant transition-colors duration-200"
        href="#"
      >
        <span className="material-symbols-outlined">description</span>
        <span className="font-body-md">Reports</span>
      </a>
      <a
        className="flex items-center gap-md p-md rounded-xl text-on-surface-variant dark:text-on-secondary-fixed-variant hover:bg-surface-container dark:hover:bg-on-secondary-fixed-variant transition-colors duration-200"
        href="#"
      >
        <span className="material-symbols-outlined">block</span>
        <span className="font-body-md">Website Blocker</span>
      </a>
      {/* Active Tab: Settings */}
      <a
        className="flex items-center gap-md p-md rounded-xl text-primary dark:text-primary-fixed-dim font-bold border-r-4 border-primary dark:border-primary-fixed-dim bg-secondary-container/20 relative active-nav-indicator"
        href="#"
      >
        <span className="material-symbols-outlined">settings</span>
        <span className="font-body-md">Settings</span>
      </a>
    </nav>
  </aside>
  {/* TopNavBar Component */}
  <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-40 h-16 flex justify-between items-center px-xl ml-64 bg-surface/80 dark:bg-inverse-surface/80 backdrop-blur-xl shadow-sm">
    <div className="flex-1 max-w-md">
      <div className="relative group">
        <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
          search
        </span>
        <input
          className="w-full pl-xl pr-md py-sm bg-surface-container border-none rounded-full text-body-md focus:ring-2 focus:ring-primary/20 transition-all outline-none"
          placeholder="Search settings..."
          type="text"
        />
      </div>
    </div>
    <div className="flex items-center gap-lg ml-xl">
      <button className="text-on-surface-variant hover:text-primary transition-all relative">
        <span className="material-symbols-outlined">notifications</span>
        <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border-2 border-surface" />
      </button>
      <button className="flex items-center gap-sm p-xs pr-md rounded-full border border-outline-variant hover:bg-surface-container transition-all"></button>
    </div>
  </header>
  {/* Main Content */}
  <main className="ml-64 pt-16 min-h-screen">
    <div className="max-w-[1200px] mx-auto p-xl space-y-lg">
      {/* Page Title */}
      <div className="mb-lg">
        <h2 className="font-display text-headline-lg text-on-surface flex items-center">
          <span
            className="material-symbols-outlined text-primary align-middle mr-sm"
            style={{ fontSize: 32 }}
          >
            settings
          </span>
          <span style={{ letterSpacing: "-0.02em" }} className="">
            &nbsp;Settings
          </span>
        </h2>
      </div>
      {/* Bento Grid Layout for Settings */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* Profile Card (Left Column, Span 4) */}
        <section className="col-span-12 lg:col-span-4 space-y-gutter">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl shadow-sm">
            <div className="flex flex-col items-center text-center space-y-md">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center border-4 border-surface-container">
                  <span className="text-on-primary font-display text-headline-lg">
                    S
                  </span>
                </div>
                <button className="absolute bottom-0 right-0 bg-primary text-on-primary p-xs rounded-full shadow-lg">
                  <span className="material-symbols-outlined text-[18px]">
                    edit
                  </span>
                </button>
              </div>
              <div>
                <h3 className="font-headline-md text-on-surface">Shubha</h3>
                <p className="text-on-surface-variant font-body-md">
                  Student ID: #2024-FL08
                </p>
                <p className="text-on-surface-variant font-label-md uppercase tracking-wider mt-xs">
                  Computer Science Department
                </p>
              </div>
              <button className="w-full py-sm px-md border border-primary text-primary rounded-xl font-bold hover:bg-primary/5 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>
          {/* Appearance Section */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl shadow-sm">
            <h3 className="font-title-lg text-on-surface mb-md">Appearance</h3>
            <div className="space-y-md">
              <div className="flex items-center justify-between p-md bg-surface-container rounded-lg">
                <div className="flex items-center gap-md">
                  <span className="material-symbols-outlined text-on-surface-variant">
                    dark_mode
                  </span>
                  <span className="font-body-md">Dark Theme</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    defaultChecked=""
                    className="sr-only peer"
                    type="checkbox"
                  />
                  <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
              <div className="flex items-center justify-between p-md bg-surface-container rounded-lg">
                <div className="flex items-center gap-md">
                  <span className="material-symbols-outlined text-on-surface-variant">
                    palette
                  </span>
                  <span className="font-body-md">Accent Color</span>
                </div>
                <div className="flex items-center gap-sm">
                  <span className="font-label-md text-primary">Blue</span>
                  <div className="w-4 h-4 rounded-full bg-primary" />
                </div>
              </div>
            </div>
          </div>
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl shadow-sm">
            <div className="flex items-center gap-sm mb-lg">
              <span className="material-symbols-outlined text-primary">
                notifications_active
              </span>
              <h3 className="font-title-lg text-on-surface">Notifications</h3>
            </div>
            <div className="space-y-md">
              <div className="flex items-center justify-between p-md bg-surface border border-outline-variant rounded-xl">
                <div className="flex items-center gap-md">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                    <span className="material-symbols-outlined">task_alt</span>
                  </div>
                  <div>
                    <p className="font-body-md font-semibold">
                      Session Complete
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    defaultChecked=""
                    className="sr-only peer"
                    type="checkbox"
                  />
                  <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
              <div className="flex items-center justify-between p-md bg-surface border border-outline-variant rounded-xl">
                <div className="flex items-center gap-md">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                    <span className="material-symbols-outlined">coffee</span>
                  </div>
                  <div>
                    <p className="font-body-md font-semibold">Break Reminder</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    defaultChecked=""
                    className="sr-only peer"
                    type="checkbox"
                  />
                  <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
              <div className="flex items-center justify-between p-md bg-surface border border-outline-variant rounded-xl">
                <div className="flex items-center gap-md">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                    <span className="material-symbols-outlined">
                      event_repeat
                    </span>
                  </div>
                  <div>
                    <p className="font-body-md font-semibold">Daily Reminder</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input className="sr-only peer" type="checkbox" />
                  <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>
          </section>
        </section>
        {/* Settings Rows (Right Column, Span 8) */}
        <div className="col-span-12 lg:col-span-8 space-y-gutter">
          {/* Study Preferences */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl shadow-sm">
            <div className="flex items-center gap-sm mb-lg">
              <span className="material-symbols-outlined text-primary">
                timer
              </span>
              <h3 className="font-title-lg text-on-surface">
                Study Preferences
              </h3>
            </div>
            <div className="space-y-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md">
                <div>
                  <p className="font-body-md font-semibold">
                    Focus Session Duration
                  </p>
                  <p className="text-on-surface-variant text-label-md">
                    Set your primary work intervals
                  </p>
                </div>
                <div className="flex bg-surface-container p-1 rounded-xl">
                  <button className="px-md py-xs rounded-lg text-label-md hover:bg-white transition-all">
                    25m
                  </button>
                  <button className="px-md py-xs rounded-lg text-label-md bg-white shadow-sm font-bold text-primary transition-all">
                    45m
                  </button>
                  <button className="px-md py-xs rounded-lg text-label-md hover:bg-white transition-all">
                    60m
                  </button>
                </div>
              </div>
              <hr className="border-outline-variant" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md">
                <div>
                  <p className="font-body-md font-semibold">Break Duration</p>
                  <p className="text-on-surface-variant text-label-md">
                    Intermittent rest periods
                  </p>
                </div>
                <div className="flex bg-surface-container p-1 rounded-xl">
                  <button className="px-md py-xs rounded-lg text-label-md bg-white shadow-sm font-bold text-primary transition-all">
                    5m
                  </button>
                  <button className="px-md py-xs rounded-lg text-label-md hover:bg-white transition-all">
                    10m
                  </button>
                  <button className="px-md py-xs rounded-lg text-label-md hover:bg-white transition-all">
                    15m
                  </button>
                </div>
              </div>
              <hr className="border-outline-variant" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body-md font-semibold">Auto Start Timer</p>
                  <p className="text-on-surface-variant text-label-md">
                    Automatically start next block
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input className="sr-only peer" type="checkbox" />
                  <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>
          </section>
          {/* AI Monitoring Settings */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl shadow-sm">
            <div className="flex items-center gap-sm mb-lg">
              <span className="material-symbols-outlined text-primary">
                psychology
              </span>
              <h3 className="font-title-lg text-on-surface">
                AI Monitoring Settings
              </h3>
            </div>
            <div className="space-y-md">
              <div className="flex items-center justify-between p-md bg-surface border border-outline-variant rounded-xl">
                <div className="flex items-center gap-md">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                    <span className="material-symbols-outlined">videocam</span>
                  </div>
                  <div>
                    <p className="font-body-md font-semibold">
                      Enable Camera Monitoring
                    </p>
                    <p className="text-on-surface-variant text-label-md">
                      Tracks focus via visual presence
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    defaultChecked=""
                    className="sr-only peer"
                    type="checkbox"
                  />
                  <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
              <div className="flex items-center justify-between p-md bg-surface border border-outline-variant rounded-xl">
                <div className="flex items-center gap-md">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                    <span className="material-symbols-outlined">face</span>
                  </div>
                  <div>
                    <p className="font-body-md font-semibold">
                      Enable Face Detection
                    </p>
                    <p className="text-on-surface-variant text-label-md">
                      Ensures only you are present
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input className="sr-only peer" type="checkbox" />
                  <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
              <div className="flex items-center justify-between p-md bg-surface border border-outline-variant rounded-xl">
                <div className="flex items-center gap-md">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                    <span className="material-symbols-outlined">
                      notification_important
                    </span>
                  </div>
                  <div>
                    <p className="font-body-md font-semibold">
                      Show Real-Time Alerts
                    </p>
                    <p className="text-on-surface-variant text-label-md">
                      Nudge when distraction is detected
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    defaultChecked=""
                    className="sr-only peer"
                    type="checkbox"
                  />
                  <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>
          </section>
          {/* Website Blocker Settings */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl shadow-sm">
            <div className="flex items-center gap-sm mb-lg">
              <span className="material-symbols-outlined text-primary">
                block
              </span>
              <h3 className="font-title-lg text-on-surface">
                Website Blocker Settings
              </h3>
            </div>
            <div className="space-y-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body-md font-semibold">
                    Enable Blocker During Study Sessions
                  </p>
                  <p className="text-on-surface-variant text-label-md">
                    Active only during focus periods
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    defaultChecked=""
                    className="sr-only peer"
                    type="checkbox"
                  />
                  <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
              <hr className="border-outline-variant" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body-md font-semibold">
                    Automatically Restore Websites
                  </p>
                  <p className="text-on-surface-variant text-label-md">
                    Unblock sites after session completion
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    defaultChecked=""
                    className="sr-only peer"
                    type="checkbox"
                  />
                  <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
              <hr className="border-outline-variant" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md">
                <div>
                  <p className="font-body-md font-semibold">Focus Mode</p>
                  <p className="text-on-surface-variant text-label-md">
                    Preset blocking profiles
                  </p>
                </div>
                <select className="bg-surface-container border-none rounded-xl text-body-md focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer min-w-[160px]">
                  <option>Deep Study</option>
                  <option>Coding</option>
                  <option>Reading</option>
                  <option>Custom</option>
                </select>
              </div>
            </div>
          </section>
          {/* Notifications */}
          {/* Account Actions */}
          <section className="flex flex-col sm:flex-row items-center gap-md pt-lg">
            <button className="w-full sm:w-auto px-2xl py-md bg-primary text-on-primary rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all">
              Save Changes
            </button>
            <button className="w-full sm:w-auto px-2xl py-md bg-surface-container-highest text-on-surface-variant rounded-xl font-bold hover:bg-surface-dim active:scale-95 transition-all">
              Reset Settings
            </button>
            <div className="flex-1" />
          </section>
        </div>
      </div>
    </div>
  </main>
</>
);
}