import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Bell,
  Sparkles,
  Users,
  Settings,
  Search,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { notificationService } from "../../services";
import { Avatar } from "../common";
import { useAuth } from "../../context/AuthContext";

const links = [
  ["/dashboard", "Dashboard", LayoutDashboard],
  ["/projects", "Projects", FolderKanban],
  ["/my-tasks", "My Tasks", CheckSquare],
  ["/notifications", "Notifications", Bell],
  ["/ai", "AI Assistant", Sparkles],
  ["/teams", "Teams", Users],
  ["/settings", "Settings", Settings],
];

export function AppLayout({ children, user, onLogout }) {
  const [mobile, setMobile] = useState(false);
  const [query, setQuery] = useState("");
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    let active = true;

    async function fetchNotifications() {
      const nextNotes = await notificationService.getNotifications();
      if (active) setNotes(nextNotes);
    }

    fetchNotifications();
    window.addEventListener("notifications-updated", fetchNotifications);

    return () => {
      active = false;
      window.removeEventListener("notifications-updated", fetchNotifications);
    };
  }, [loc.pathname]);

  const submit = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const sidebar = (
    <aside className="sidebar">
      <Link className="brand" to="/dashboard">
        <span className="brand-mark">D</span>
        <span>
          Dev<span>Sync</span>
        </span>
      </Link>
      <button
        className="mobile-close"
        type="button"
        aria-label="Close navigation"
        onClick={() => setMobile(false)}
      >
        <X size={20} />
      </button>
      <nav>
        {links.map(([path, label, Icon]) => (
          <NavLink onClick={() => setMobile(false)} key={path} to={path}>
            <Icon size={18} />
            <span>{label}</span>
            {label === "Notifications" &&
              notes.filter((x) => !x.read).length > 0 && <b />}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-user">
        <Avatar id={user?.id} />
        <div>
          <strong>{user?.name}</strong>
          <small>{user?.email}</small>
        </div>
        <button aria-label="Logout" onClick={onLogout}>
          <LogOut size={17} />
        </button>
      </div>
    </aside>
  );

  return (
    <div className="app-shell">
      {sidebar}
      {mobile && <div className="scrim" onClick={() => setMobile(false)} />}
      <header className="topbar">
        <button className="menu-button" onClick={() => setMobile(true)}>
          <Menu />
        </button>
        <form className="global-search" onSubmit={submit}>
          <Search size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anything..."
          />
        </form>
        <Link className="bell" to="/notifications">
          <Bell size={19} />
          {notes.some((x) => !x.read) && <i />}
        </Link>
        <div className="top-profile">
          <Avatar id={user?.id} />
          <span>{user?.name ? user.name.split(" ")[0] : "User"}</span>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

export function Shell({ children }) {
  const { user, logout } = useAuth();
  return (
    <AppLayout user={user} onLogout={logout}>
      {children}
    </AppLayout>
  );
}

export default AppLayout;
