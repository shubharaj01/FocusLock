import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const NAV_ITEMS = [
  { to: "/study-hub", label: "Study Hub", icon: "dashboard" },
  { to: "/monitoring", label: "Monitoring", icon: "visibility" },
  { to: "/analytics", label: "Analytics", icon: "analytics" },
  { to: "/blocker", label: "Website Blocker", icon: "block" },
  { to: "/settings", label: "Settings", icon: "settings" },
];

export default function Layout() {
  const { token, user, loading, logout } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-on-surface-variant">Loading…</div>;
  }
  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-surface">
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-outline-variant bg-surface-container-lowest flex flex-col py-lg z-50">
        <div className="px-lg mb-xl">
          <h1 className="font-headline-md text-headline-md font-bold text-primary">Focus Lock</h1>
          <p className="text-label-md text-on-surface-variant">{user?.name || "Student"}</p>
        </div>
        <nav className="flex-1 space-y-1 px-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span className="text-label-md">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="px-lg pt-lg border-t border-outline-variant/40">
          <button
            onClick={logout}
            className="w-full py-2.5 border border-outline-variant rounded-xl text-label-md text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="ml-64 min-h-screen px-margin-desktop py-xl max-w-6xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
