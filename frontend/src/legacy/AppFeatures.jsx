import { useState, useEffect } from "react";
import {
  Navigate,
  Link,
  useParams,
  useNavigate,
  useSearchParams,
  NavLink,
} from "react-router-dom";
import {
  Plus,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Folder,
  Users,
  ClipboardList,
  Sparkles,
  Bell,
  MessageSquare,
  ChevronRight,
  BarChart3,
  ArrowUpDown,
  GitCommitHorizontal,
  Grid2X2,
  List,
  Search,
  Terminal,
  UsersRound,
  FolderPlus,
  X,
  ArrowRight,
  LockKeyhole,
  Globe2,
  Code2,
  Pencil,
  MoreHorizontal,
  LayoutGrid,
  KanbanSquare,
  ListChecks,
  GanttChartSquare,
  History,
  GitBranch,
  ExternalLink,
  GitMerge,
  Gauge,
  Cloud,
  MoreVertical,
  Settings,
  UserPlus,
  Filter,
  ChevronDown,
  Info,
  Eye,
  Mail,
  CalendarDays,
  Send,
  Check,
  Circle,
  Copy,
  Reply,
  Bold,
  Italic,
  List as ListIcon,
  Paperclip,
  Trash2,
  RotateCw,
  CopyCheck,
} from "lucide-react";
import {
  authService,
  projectService,
  taskService,
  commentService,
  notificationService,
  aiService,
  searchService,
} from "../services";
import { users, projects, tasks } from "../mock";
import { AppLayout } from "../components/layout/AppLayout";
import {
  Avatar,
  StatusBadge,
  PriorityBadge,
  TaskCard,
  ProjectCard,
  PageHeader,
  StatCard,
  Loading,
  EmptyState,
  statusOptions,
} from "../components/common";
import { statusLabel } from "../lib/constants";
import StitchLanding from "../pages/public/Landing";
import { useAuth } from "../context/AuthContext";
function Protected({ children }) {
  const { user, loading } = useAuth();
  return loading ? (
    <Loading />
  ) : user ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
}
function Shell({ children }) {
  const { user, logout } = useAuth();
  return (
    <AppLayout user={user} onLogout={logout}>
      {children}
    </AppLayout>
  );
}
function Landing() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <Link className="brand" to="/">
          <span className="brand-mark">D</span>Dev<span>Sync</span>
        </Link>
        <div>
          <Link className="btn secondary" to="/login">
            Sign in
          </Link>{" "}
          <Link className="btn primary" to="/register">
            Get started
          </Link>
        </div>
      </nav>
      <section className="landing-main">
        <span className="eyebrow">Built for teams who ship</span>
        <h1>
          Plan. Build. Ship.
          <br />
          <span>Together.</span>
        </h1>
        <p>
          DevSync brings project planning, focused execution and thoughtful
          collaboration into one calm workspace for developers.
        </p>
        <div className="landing-actions">
          <Link className="btn primary" to="/login">
            Try the demo <ChevronRight size={16} />
          </Link>
          <Link className="btn secondary" to="/register">
            Create workspace
          </Link>
        </div>
        <div className="landing-preview">
          <div className="preview-top">
            <i />
            <i />
            <i />
          </div>
          <div className="preview-content">
            <div className="preview-side" />
            <div className="preview-work">
              <span className="eyebrow">Interview Platform</span>
              <h3>Keep your team in flow</h3>
              <div className="preview-bars">
                <div />
                <div />
                <div />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
function AuthPage({ register = false }) {
  const nav = useNavigate(),
    { login, register: signUp } = useAuth();
  const [form, setForm] = useState({
      name: "",
      email: "himanshu@example.com",
      password: "password123",
    }),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      register ? await signUp(form) : await login(form.email, form.password);
      nav("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  if (register)
    return (
      <div className="signup-stitch">
        <header>
          <Link className="login-logo" to="/">
            <i>↔</i>DevSync
          </Link>
          <Link className="login-back" to="/">
            Back to website ↗
          </Link>
        </header>
        <main>
          <form className="signup-card" onSubmit={submit}>
            <div className="login-card-head">
              <i>‹›</i>
              <h1>Create an account</h1>
              <p>Start collaborating and managing projects with DevSync</p>
            </div>
            <label>
              Full Name
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Alex Mercer"
              />
            </label>
            <label>
              Email Address
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
              />
            </label>
            <label>
              Password
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••••••"
              />
            </label>
            <label>
              Confirm Password
              <input type="password" required placeholder="••••••••••••" />
            </label>
            <div className="password-hints">
              <b>Password requirements</b>
              <span>✓ At least 8 characters</span>
              <span>✓ One number</span>
              <span>✓ One special character</span>
            </div>
            <label className="terms">
              <input type="checkbox" required defaultChecked /> I agree to the{" "}
              <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>.
            </label>
            {error && <small className="login-error">{error}</small>}
            <button className="login-submit" disabled={busy}>
              {busy ? "Please wait..." : "Sign Up →"}
            </button>
            <div className="login-divider">
              <span>or continue with</span>
            </div>
            <div className="login-social">
              <button type="button">G&nbsp;&nbsp; Google</button>
              <button type="button">◉&nbsp;&nbsp; GitHub</button>
            </div>
            <p className="login-signup">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
          <p className="login-trust">
            ● Git Sync Active &nbsp; • &nbsp; ▢ 256-bit SSL Encrypted
          </p>
        </main>
        <footer>
          © 2026 DevSync Technologies Inc. &nbsp; • &nbsp; Privacy Policy &nbsp;
          • &nbsp; Terms of Service &nbsp; • &nbsp; System Status
        </footer>
      </div>
    );
  if (!register)
    return (
      <div className="login-stitch">
        <header>
          <Link className="login-logo" to="/">
            <i>↔</i>DevSync
          </Link>
          <Link className="login-back" to="/">
            Back to website ↗
          </Link>
        </header>
        <main>
          <form className="login-card" onSubmit={submit}>
            <div className="login-card-head">
              <i>‹›</i>
              <h1>Welcome Back!</h1>
              <p>Login to your DevSync workspace</p>
            </div>
            <label>
              Email Address
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
              />
            </label>
            <label>
              <span>
                Password <button type="button">Forgot password?</button>
              </span>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••••••"
              />
            </label>
            <label className="remember">
              <input type="checkbox" /> Remember this device for 30 days
            </label>
            {error && <small className="login-error">{error}</small>}
            <button className="login-submit" disabled={busy}>
              {busy ? "Please wait..." : "Login →"}
            </button>
            <div className="login-divider">
              <span>or continue with</span>
            </div>
            <div className="login-social">
              <button type="button">G&nbsp;&nbsp; Google</button>
              <button type="button">◉&nbsp;&nbsp; GitHub</button>
            </div>
            <p className="login-signup">
              Don't have an account?{" "}
              <Link to="/register">Sign up for free</Link>
            </p>
          </form>
          <p className="login-trust">
            ● Git Sync Active &nbsp; • &nbsp; ▢ 256-bit SSL Encrypted
          </p>
        </main>
        <footer>
          © 2026 DevSync Technologies Inc. &nbsp; • &nbsp; Privacy Policy &nbsp;
          • &nbsp; Terms of Service &nbsp; • &nbsp; System Status
        </footer>
      </div>
    );
  return (
    <div className="auth">
      <aside className="auth-side">
        <Link className="brand" to="/">
          <span className="brand-mark">D</span>Dev<span>Sync</span>
        </Link>
        <h1>{register ? "Start building better." : "Your work, in sync."}</h1>
        <p>
          Bring your projects, tasks and people together in a workspace designed
          for developer teams.
        </p>
      </aside>
      <main className="auth-form-wrap">
        <form className="auth-form form-grid" onSubmit={submit}>
          <div>
            <h1>{register ? "Create your account" : "Welcome back"}</h1>
            <p>
              {register
                ? "Set up your DevSync workspace in a moment."
                : "Sign in to continue to your workspace."}
            </p>
          </div>
          {register && (
            <label>
              Full name
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>
          {error && <small style={{ color: "#b42318" }}>{error}</small>}
          <button className="btn primary" disabled={busy}>
            {busy ? "Please wait…" : register ? "Create account" : "Sign in"}
          </button>
          {!register && (
            <button
              type="button"
              className="btn secondary"
              onClick={() => {
                setForm({
                  email: "himanshu@example.com",
                  password: "password123",
                });
              }}
            >
              Use demo credentials
            </button>
          )}
          <div className="demo-note">
            Demo: himanshu@example.com / password123
          </div>
          <p>
            {register ? "Already have an account? " : "New to DevSync? "}
            <Link
              to={register ? "/login" : "/register"}
              style={{ color: "#6656e5", fontWeight: 700 }}
            >
              {register ? "Sign in" : "Create account"}
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
function Dashboard() {
  const [ps, setPs] = useState(null);
  useEffect(() => {
    projectService.getProjects().then(setPs);
  }, []);
  if (!ps) return <Loading label="Loading your workspace…" />;
  const mine = tasks.filter((t) => t.assigneeId === "user-1");
  return (
    <div className="dashboard-stitch">
      <PageHeader
        eyebrow="Workspace · Sprint 24"
        title="Welcome back, Himanshu! 👋"
      >
        <button className="btn secondary">Customize View</button>
        <button className="btn secondary">
          Filter <small>3</small>
        </button>
        <Link className="btn primary" to="/projects">
          <Plus size={16} /> New project
        </Link>
      </PageHeader>
      <div className="grid stats">
        <StatCard
          label="Active projects"
          value={ps.length}
          sub="2 on track"
          icon={<Folder size={19} />}
        />
        <StatCard
          label="My open tasks"
          value={mine.filter((t) => t.status !== "DONE").length}
          sub="Ready to focus"
          icon={<ClipboardList size={19} />}
        />
        <StatCard
          label="Due this week"
          value="4"
          sub="Plan your next move"
          icon={<Clock size={19} />}
        />
        <StatCard
          label="Completed"
          value="12"
          sub="+18% this month"
          icon={<CheckCircle2 size={19} />}
        />
      </div>
      <div className="grid dashboard-grid">
        <section className="panel">
          <div className="panel-head">
            <h3>Recent projects</h3>
            <Link to="/projects">View all</Link>
          </div>
          <div className="project-list">
            {ps.slice(0, 4).map((p) => (
              <Link className="project-row" key={p.id} to={`/projects/${p.id}`}>
                <div className="project-icon" style={{ background: p.color }}>
                  {p.key}
                </div>
                <div>
                  <h4>{p.name}</h4>
                  <p>{p.description}</p>
                </div>
                <div className="progress">
                  <div className="progress-line">
                    <i
                      style={{ width: p.progress + "%", background: p.color }}
                    />
                  </div>
                  <small>{p.progress}%</small>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section className="panel">
          <div className="panel-head">
            <h3>Upcoming deadlines</h3>
            <Link to="/my-tasks">My tasks</Link>
          </div>
          {tasks.slice(0, 4).map((t) => (
            <div className="deadline" key={t.id}>
              <div className="deadline-date">
                {t.dueDate.slice(-2)}
                <small>SEP</small>
              </div>
              <div>
                <h4>{t.title}</h4>
                <p>
                  {t.taskKey} · <StatusBadge status={t.status} />
                </p>
              </div>
            </div>
          ))}
        </section>
        <section className="panel">
          <div className="panel-head">
            <h3>Recent activity</h3>
          </div>
          {[
            "Rahul moved DEV-42 to In progress",
            "Priya commented on DEV-45",
            "Amit completed authentication tests",
          ].map((a, i) => (
            <div className="activity" key={a}>
              <Avatar id={["user-2", "user-3", "user-4"][i]} />
              <div>
                <h4>{a}</h4>
                <p>
                  {i + 1} hour{i ? "s" : ""} ago
                </p>
              </div>
            </div>
          ))}
        </section>
        <section className="panel">
          <div className="panel-head">
            <h3>Focus for today</h3>
          </div>
          {mine.length ? (
            mine.map((t) => <TaskCard key={t.id} task={t} compact />)
          ) : (
            <EmptyState title="All caught up" />
          )}
        </section>
      </div>
    </div>
  );
}
function ProjectDialog({ onClose, onCreate }) {
  const [data, setData] = useState({
    name: "",
    key: "",
    description: "",
    visibility: "private",
  });
  const generatedKey = (data.name || "NEW")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 3)
    .toUpperCase();
  return (
    <div className="dialog-backdrop" role="presentation">
      <form
        className="dialog project-dialog form-grid"
        onSubmit={async (e) => {
          e.preventDefault();
          await onCreate(data);
          onClose();
        }}
      >
        <div className="project-dialog-header">
          <div className="project-dialog-title">
            <span className="project-dialog-icon">
              <FolderPlus size={17} />
            </span>
            <div>
              <h2>Create New Project</h2>
              <p>Start collaborating and managing repositories with DevSync</p>
            </div>
          </div>
          <button
            type="button"
            className="dialog-close"
            aria-label="Close modal"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        <label className="dialog-field">
          Project name <span className="required">*</span>
          <input
            required
            autoFocus
            placeholder="e.g. Interview Platform"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
        </label>
        <label className="dialog-field">
          <span className="field-label-row">
            Description <small>Optional</small>
          </span>
          <textarea
            rows="3"
            placeholder="Describe your project goals, repositories, or target sprint milestones..."
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />
        </label>
        <label className="dialog-field">
          <span className="field-label-row">
            Project key <small>Auto-generated or custom</small>
          </span>
          <input
            required
            maxLength="10"
            className="project-key-input"
            placeholder="e.g. INT"
            value={data.key}
            onChange={(e) =>
              setData({ ...data, key: e.target.value.toUpperCase() })
            }
          />
          <span className="project-key-preview">
            {data.key || generatedKey}-101
          </span>
          <small className="field-help">
            Used as the prefix for task IDs, commits, and branch tags.
          </small>
        </label>
        <fieldset className="visibility-field">
          <legend>Visibility</legend>
          <label className={data.visibility === "private" ? "selected" : ""}>
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={data.visibility === "private"}
              onChange={(e) => setData({ ...data, visibility: e.target.value })}
            />
            <LockKeyhole size={15} />
            <span>
              <strong>Private</strong>
              <small>Only invited team members can view or contribute.</small>
            </span>
            <em>Recommended</em>
          </label>
          <label className={data.visibility === "public" ? "selected" : ""}>
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={data.visibility === "public"}
              onChange={(e) => setData({ ...data, visibility: e.target.value })}
            />
            <Globe2 size={15} />
            <span>
              <strong>Public</strong>
              <small>
                Anyone with the organization link can view the project.
              </small>
            </span>
          </label>
        </fieldset>
        <div className="dialog-actions">
          <button type="button" className="btn secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary">
            Create Project <ArrowRight size={15} />
          </button>
        </div>
      </form>
    </div>
  );
}
function Projects() {
  const [ps, setPs] = useState(null),
    [open, setOpen] = useState(false),
    [query, setQuery] = useState(""),
    [filter, setFilter] = useState("ALL"),
    [view, setView] = useState("grid"),
    [sort, setSort] = useState("recent"),
    [syncNotice, setSyncNotice] = useState("");
  const { user } = useAuth();
  const load = () => projectService.getProjects().then(setPs);
  useEffect(() => {
    load();
  }, []);
  const visibleProjects = (ps || [])
    .filter((p) => {
      if (filter === "OWNED") return p.ownerId === user.id;
      if (filter === "MEMBER") return p.memberIds.includes(user.id);
      return true;
    })
    .filter((p) =>
      `${p.name} ${p.description} ${p.key}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    )
    .sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "progress") return b.progress - a.progress;
      return 0;
    });
  return (
    <div className="projects-stitch">
      <PageHeader
        eyebrow={`DevSync / Projects · ${ps?.length || 0} active`}
        title="Projects"
      >
        <div className="view-toggle" role="group" aria-label="Project view">
          <button
            className={`btn secondary ${view === "grid" ? "selected" : ""}`}
            type="button"
            aria-label="Grid view"
            title="Grid view"
            onClick={() => setView("grid")}
          >
            <Grid2X2 size={16} />
          </button>
          <button
            className={`btn secondary ${view === "list" ? "selected" : ""}`}
            type="button"
            aria-label="List view"
            title="List view"
            onClick={() => setView("list")}
          >
            <List size={17} />
          </button>
        </div>
        <button
          className="btn secondary"
          type="button"
          onClick={() => setSyncNotice("CLI sync is available in mock mode.")}
        >
          <Terminal size={15} /> CLI Sync
        </button>
        <button className="btn primary" onClick={() => setOpen(true)}>
          <Plus size={16} /> New project
        </button>
      </PageHeader>
      {syncNotice && (
        <div className="projects-notice" role="status">
          {syncNotice}
        </div>
      )}
      <div className="projects-toolbar">
        <div
          className="project-filters"
          role="tablist"
          aria-label="Project filters"
        >
          {[
            ["ALL", "All"],
            ["OWNED", "Owned"],
            ["MEMBER", "Member"],
          ].map(([value, label]) => (
            <button
              className={filter === value ? "active" : ""}
              key={value}
              type="button"
              role="tab"
              aria-selected={filter === value}
              onClick={() => setFilter(value)}
            >
              {label}{" "}
              <b>
                {
                  (ps || []).filter((p) =>
                    value === "ALL"
                      ? true
                      : value === "OWNED"
                        ? p.ownerId === user.id
                        : p.memberIds.includes(user.id),
                  ).length
                }
              </b>
            </button>
          ))}
        </div>
        <label className="project-search">
          <Search size={16} />
          <span className="sr-only">Search projects</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, tags..."
          />
        </label>
        <label className="project-sort">
          <ArrowUpDown size={15} />
          <span className="sr-only">Sort projects</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="recent">Recently Updated</option>
            <option value="progress">Progress</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>
      {!ps ? (
        <Loading label="Loading projects…" />
      ) : (
        <>
          <div
            className={`grid projects-grid ${view === "list" ? "list-view" : ""}`}
          >
            {visibleProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
          {!visibleProjects.length && (
            <EmptyState title="No projects match your search" />
          )}
          <div className="projects-summary">
            <div>
              <BarChart3 size={20} />
              <span>
                <small>Average project progress</small>
                <strong>
                  {Math.round(
                    ps.reduce((total, project) => total + project.progress, 0) /
                      ps.length,
                  )}
                  %
                </strong>
              </span>
            </div>
            <div>
              <GitCommitHorizontal size={20} />
              <span>
                <small>Tasks tracked</small>
                <strong>{tasks.length} tasks</strong>
              </span>
            </div>
            <div>
              <UsersRound size={20} />
              <span>
                <small>Contributors</small>
                <strong>{users.length} engineers</strong>
              </span>
            </div>
          </div>
        </>
      )}
      {open && (
        <ProjectDialog
          onClose={() => setOpen(false)}
          onCreate={async (d) => {
            await projectService.createProject(d);
            load();
          }}
        />
      )}
    </div>
  );
}
function ProjectTabs({ id }) {
  return (
    <div className="project-overview-tabs">
      <NavLink end to={`/projects/${id}`}>
        <LayoutGrid size={17} />
        Overview
      </NavLink>
      <NavLink to={`/projects/${id}/board`}>
        <KanbanSquare size={17} /> Board
      </NavLink>
      <NavLink to={`/projects/${id}/list`}>
        <ListChecks size={17} /> List
      </NavLink>
      <NavLink to={`/projects/${id}/members`}>
        <UsersRound size={17} /> Members
      </NavLink>
      <NavLink to={`/projects/${id}/settings`}>
        <Settings size={17} /> Settings
      </NavLink>
    </div>
  );
}
function ProjectLayout({ mode = "overview" }) {
  const { projectId } = useParams();
  const p = projects.find((x) => x.id === projectId);
  if (!p) return <EmptyState title="Project not found" />;
  return (
    <div className="project-overview-page">
      <div className="project-overview-header">
        <div>
          <Link className="project-breadcrumb" to="/projects">
            <ArrowLeft size={15} /> Projects <span>/</span> {p.name}
          </Link>
          <div className="project-title-row">
            <div className="project-title-icon" style={{ background: p.color }}>
              <Code2 size={23} />
            </div>
            <div>
              <div className="project-name-line">
                <h1>{p.name}</h1>
                <span className="project-key-chip">{p.key}</span>
                <span className="project-sprint-chip">
                  <i /> Active Sprint 4
                </span>
              </div>
              <p>{p.description}</p>
            </div>
          </div>
        </div>
        <div className="project-header-actions">
          <Link className="btn secondary" to={`/projects/${p.id}/settings`}>
            <Pencil size={16} /> Edit Project
          </Link>
          <button
            className="btn secondary"
            type="button"
            aria-label="More project actions"
          >
            <MoreHorizontal size={19} />
          </button>
          <Link className="btn primary" to={`/projects/${p.id}/board`}>
            <Plus size={17} /> New Task
          </Link>
        </div>
      </div>
      <ProjectTabs id={p.id} />
      {mode === "overview" ? (
        <ProjectOverview p={p} />
      ) : mode === "board" ? (
        <Board p={p} />
      ) : mode === "list" ? (
        <TaskList p={p} />
      ) : mode === "members" ? (
        <Members p={p} />
      ) : (
        <ProjectSettings p={p} />
      )}
    </div>
  );
}
function ProjectOverview({ p }) {
  const ts = tasks.filter((t) => t.projectId === p.id);
  const completed = ts.filter((t) => t.status === "DONE").length;
  const members = p.memberIds
    .map((id) => users.find((user) => user.id === id))
    .filter(Boolean);
  return (
    <div className="project-overview-content">
      <div className="project-overview-main">
        <div className="project-kpis">
          <ProjectKpi
            icon={<UsersRound />}
            label="Members"
            value={members.length}
            suffix="active"
          />
          <ProjectKpi
            icon={<ListChecks />}
            label="Total Tasks"
            value={ts.length}
            suffix="issues"
          />
          <ProjectKpi
            icon={<CheckCircle2 />}
            label="Completed"
            value={completed}
            suffix="done"
            tone="success"
          />
          <ProjectKpi
            icon={<Gauge />}
            label="Progress"
            value={`${p.progress}%`}
            suffix={`${ts.length - completed} left`}
            progress={p.progress}
          />
        </div>
        <section className="project-overview-card">
          <div className="project-card-heading">
            <h2>Project Overview</h2>
            <span>
              <History size={14} /> Updated 2 hours ago
            </span>
          </div>
          <span className="project-section-label">Description</span>
          <p className="project-description">
            {p.description}. A modern workspace for real-time collaboration,
            code review, and focused delivery across the engineering team.
          </p>
          <span className="project-section-label">Tags &amp; Environment</span>
          <div className="project-tags">
            {["React", "Node.js", "WebRTC", "AI Sandbox"].map((tag) => (
              <span key={tag}>
                <Code2 size={13} /> {tag}
              </span>
            ))}
            <button type="button">
              <Plus size={13} /> Add tag
            </button>
          </div>
        </section>
        <div className="project-overview-split">
          <section className="project-overview-card repository-card">
            <div className="project-card-heading">
              <h2>
                <Code2 size={18} /> Linked Repository
              </h2>
              <span className="connected-label">Connected</span>
            </div>
            <div className="repository-name">
              <span>github.com/devsync/{p.key.toLowerCase()}-platform</span>
              <ExternalLink size={14} />
            </div>
            <div className="repository-meta">
              <span>
                <GitBranch size={13} /> main
              </span>
              <span>
                <GitCommitHorizontal size={13} /> #f8a29e4
              </span>
              <span>12m ago</span>
            </div>
            <div className="repository-footer">
              <span>
                <GitMerge size={14} /> 4 open Pull Requests
              </span>
              <button type="button">View Git Tree →</button>
            </div>
          </section>
          <section className="project-overview-card velocity-card">
            <div className="project-card-heading">
              <h2>
                <Gauge size={18} /> Sprint Velocity
              </h2>
              <span>Sprint 4 of 6</span>
            </div>
            <div className="velocity-bars">
              {[38, 52, 64, 72, 56].map((height, index) => (
                <div key={index}>
                  <i
                    className={index === 3 ? "current" : ""}
                    style={{ height }}
                  />
                  <small>Sp {index + 1}</small>
                </div>
              ))}
            </div>
            <div className="velocity-footer">
              <span>
                Average: <b>32 pts/wk</b>
              </span>
              <strong>On Track (+8%)</strong>
            </div>
          </section>
        </div>
        <section className="project-overview-card milestone-card">
          <div className="project-card-heading">
            <h2>Recent Sprints &amp; Milestones</h2>
            <Link to={`/projects/${p.id}/board`}>View All Tasks</Link>
          </div>
          {ts.slice(0, 3).map((task) => (
            <Link
              className="milestone-row"
              key={task.id}
              to={`/tasks/${task.id}`}
            >
              <i className={`milestone-dot ${task.status.toLowerCase()}`} />
              <span>
                <b>{task.taskKey}</b> {task.title}
                <small>
                  {statusLabel(task.status)} · Assigned to{" "}
                  {users.find((user) => user.id === task.assigneeId)?.name ||
                    "team member"}
                </small>
              </span>
              <em>{statusLabel(task.status)}</em>
            </Link>
          ))}
        </section>
      </div>
      <aside className="project-overview-sidebar">
        <section className="project-overview-card members-card">
          <div className="project-card-heading">
            <h2>
              Project Members <small>{members.length}</small>
            </h2>
            <Link to={`/projects/${p.id}/members`}>
              <Plus size={14} /> Add
            </Link>
          </div>
          {members.map((member) => (
            <div className="project-member-row" key={member.id}>
              <Avatar id={member.id} size="large" />
              <span>
                <b>{member.name}</b>
                <small>{member.role}</small>
              </span>
              <button
                type="button"
                aria-label={`More actions for ${member.name}`}
              >
                <MoreVertical size={16} />
              </button>
            </div>
          ))}
          <div className="members-footer">
            <span>
              {members.filter((member) => member.role === "DEVELOPER").length}{" "}
              Developers ·{" "}
              {members.filter((member) => member.role === "VIEWER").length}{" "}
              Viewers
            </span>
            <Link to={`/projects/${p.id}/members`}>Manage Access</Link>
          </div>
        </section>
        <section className="project-overview-card project-details-card">
          <h2>Project Details</h2>
          <ProjectDetail
            label="Visibility"
            value={
              <>
                <LockKeyhole size={14} /> Private (Workspace)
              </>
            }
          />
          <ProjectDetail label="Created By" value="Himanshu K." />
          <ProjectDetail label="Created Date" value="Jan 14, 2025" />
          <ProjectDetail
            label="Project Key"
            value={<b className="project-key-chip">{p.key}</b>}
          />
          <ProjectDetail
            label="Current Sprint"
            value={
              <strong className="project-detail-primary">
                Sprint 4 (Due Mar 18)
              </strong>
            }
          />
          <div className="runner-ready">
            <Cloud size={20} />
            <span>
              <b>Cloud Runners Ready</b>
              <small>Node 20 · Py 3.11 · Go 1.22</small>
            </span>
          </div>
        </section>
        <section className="project-ai-card">
          <h2>
            <Sparkles size={17} /> AI Sprint Copilot
          </h2>
          <p>
            Sprint 4 has 3 backend tasks ready for deployment. Estimated
            completion is ahead by 1.2 days.
          </p>
          <Link to="/ai">Ask AI to generate test cases →</Link>
        </section>
      </aside>
    </div>
  );
}
function ProjectKpi({ icon, label, value, suffix, progress, tone }) {
  return (
    <div className={`project-kpi ${tone || ""}`}>
      <div>
        <span>{label}</span>
        {icon}
      </div>
      <strong>{value}</strong>
      <small>{suffix}</small>
      {progress !== undefined && (
        <i>
          <b style={{ width: `${progress}%` }} />
        </i>
      )}
    </div>
  );
}
function ProjectDetail({ label, value }) {
  return (
    <div className="project-detail">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}
function TaskDialog({ project, onClose, onCreate }) {
  const [data, setData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    assigneeId: "user-1",
    dueDate: "2026-09-30",
    labels: "",
    parentTaskId: "",
  });
  const generateDescription = async () => {
    const result = await aiService.generateTaskDetails({ title: data.title });
    setData((current) => ({
      ...current,
      description: result.description,
    }));
  };
  return (
    <div className="dialog-backdrop">
      <form
        className="dialog task-dialog form-grid"
        onSubmit={async (e) => {
          e.preventDefault();
          await onCreate({
            ...data,
            labels: data.labels
              .split(",")
              .map((label) => label.trim())
              .filter(Boolean),
            projectId: project.id,
          });
          onClose();
        }}
      >
        <div className="task-dialog-heading">
          <div>
            <h2>Create Task</h2>
            <p>Add a new work item to the sprint backlog or project roadmap.</p>
          </div>
          <button
            type="button"
            className="dialog-close"
            aria-label="Close modal"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        <label>
          Title <span className="required">*</span>
          <input
            required
            autoFocus
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
          />
        </label>
        <label>
          <span className="field-label-row">
            Description{" "}
            <button
              type="button"
              className="field-ai-button"
              onClick={generateDescription}
            >
              <Sparkles size={13} /> Generate with AI
            </button>
          </span>
          <textarea
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />
        </label>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <label>
            Project
            <input value={project.name} disabled />
          </label>
          <label>
            Assignee
            <select
              value={data.assigneeId}
              onChange={(e) => setData({ ...data, assigneeId: e.target.value })}
            >
              {project.memberIds.map((id) => (
                <option value={id} key={id}>
                  {users.find((u) => u.id === id)?.name || "Unknown member"}
                </option>
              ))}
            </select>
          </label>
          <label>
            Priority
            <select
              value={data.priority}
              onChange={(e) => setData({ ...data, priority: e.target.value })}
            >
              {["LOW", "MEDIUM", "HIGH", "URGENT"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            Due date
            <input
              type="date"
              value={data.dueDate}
              onChange={(e) => setData({ ...data, dueDate: e.target.value })}
            />
          </label>
        </div>
        <label>
          Parent task <small>Optional</small>
          <select
            value={data.parentTaskId}
            onChange={(e) => setData({ ...data, parentTaskId: e.target.value })}
          >
            <option value="">None</option>
            {tasks
              .filter((task) => task.projectId === project.id)
              .map((task) => (
                <option key={task.id} value={task.id}>
                  {task.taskKey} · {task.title}
                </option>
              ))}
          </select>
        </label>
        <label>
          Labels <small>Comma-separated</small>
          <input
            value={data.labels}
            placeholder="e.g. backend, auth"
            onChange={(e) => setData({ ...data, labels: e.target.value })}
          />
        </label>
        <div className="dialog-actions">
          <button type="button" className="btn secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary">
            Create Task <ArrowRight size={15} />
          </button>
        </div>
      </form>
    </div>
  );
}
function Board({ p }) {
  const [ts, setTs] = useState([]),
    [create, setCreate] = useState(false),
    [ai, setAi] = useState(false),
    [query, setQuery] = useState(""),
    [mineOnly, setMineOnly] = useState(false),
    [highPriority, setHighPriority] = useState(false),
    [sort, setSort] = useState("priority");
  const { user } = useAuth();
  const load = () => taskService.getProjectTasks(p.id).then(setTs);
  useEffect(() => {
    load();
  }, [p.id]);
  const move = async (t, status) => {
    await taskService.updateTask(t.id, { status });
    load();
  };
  const visibleTasks = ts
    .filter((task) =>
      `${task.title} ${task.taskKey} ${task.labels.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    )
    .filter((task) => !mineOnly || task.assigneeId === user.id)
    .filter(
      (task) => !highPriority || ["HIGH", "URGENT"].includes(task.priority),
    )
    .sort((a, b) => {
      if (sort === "due") return a.dueDate.localeCompare(b.dueDate);
      if (sort === "title") return a.title.localeCompare(b.title);
      return (
        ["URGENT", "HIGH", "MEDIUM", "LOW"].indexOf(a.priority) -
        ["URGENT", "HIGH", "MEDIUM", "LOW"].indexOf(b.priority)
      );
    });
  return (
    <>
      <div className="board-command-bar">
        <label className="board-search">
          <Search size={16} />
          <span className="sr-only">Search tasks</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks, keys, labels..."
          />
        </label>
        <button
          className={`btn secondary ${mineOnly ? "selected" : ""}`}
          onClick={() => setMineOnly(!mineOnly)}
        >
          <UsersRound size={14} /> Only My Tasks
        </button>
        <button
          className={`btn secondary ${highPriority ? "selected" : ""}`}
          onClick={() => setHighPriority(!highPriority)}
        >
          High Priority
        </button>
        <label className="board-sort">
          Sort
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="priority">Priority</option>
            <option value="due">Due date</option>
            <option value="title">Task name</option>
          </select>
        </label>
        <span className="board-tally">
          {visibleTasks.length} of {ts.length} tasks
        </span>
        <button className="btn secondary" onClick={() => setAi(true)}>
          <Sparkles size={15} /> AI breakdown
        </button>
        <button className="btn primary" onClick={() => setCreate(true)}>
          <Plus size={15} /> Create task
        </button>
      </div>
      <div className="board">
        {statusOptions.map((s) => (
          <section className={`board-col col-${s}`} key={s}>
            <div className="board-col-head">
              <h3>{statusLabel(s)}</h3>
              <span>{ts.filter((t) => t.status === s).length}</span>
            </div>
            <div className="task-stack">
              {visibleTasks
                .filter((t) => t.status === s)
                .map((t) => (
                  <div key={t.id}>
                    <TaskCard task={t} />
                    <select
                      aria-label="Change status"
                      className="form-control"
                      style={{ width: "100%", marginTop: 5, fontSize: 10 }}
                      value={t.status}
                      onChange={(e) => move(t, e.target.value)}
                    >
                      {statusOptions.map((x) => (
                        <option value={x} key={x}>
                          {statusLabel(x)}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
            </div>
          </section>
        ))}
      </div>
      {create && (
        <TaskDialog
          project={p}
          onClose={() => setCreate(false)}
          onCreate={async (d) => {
            await taskService.createTask(d);
            load();
          }}
        />
      )}
      {ai && (
        <AIBreakdown
          project={p}
          onClose={() => setAi(false)}
          onCreated={load}
        />
      )}
    </>
  );
}
function TaskList({ p }) {
  const [ts, setTs] = useState([]);
  useEffect(() => {
    taskService.getProjectTasks(p.id).then(setTs);
  }, [p.id]);
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Assignee</th>
            <th>Due date</th>
          </tr>
        </thead>
        <tbody>
          {ts.map((t) => (
            <tr key={t.id}>
              <td>
                <Link className="task-title" to={`/tasks/${t.id}`}>
                  {t.taskKey} · {t.title}
                </Link>
              </td>
              <td>
                <StatusBadge status={t.status} />
              </td>
              <td>
                <PriorityBadge priority={t.priority} />
              </td>
              <td>
                <div className="assignee">
                  <Avatar id={t.assigneeId} />
                  {users.find((u) => u.id === t.assigneeId)?.name ||
                    "Unknown member"}
                </div>
              </td>
              <td>{t.dueDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function Members({ p }) {
  const [open, setOpen] = useState(false),
    [ids, setIds] = useState(p.memberIds),
    [query, setQuery] = useState(""),
    [role, setRole] = useState("ALL"),
    [memberRole, setMemberRole] = useState("DEVELOPER");
  const add = async (id) => {
    await projectService.addMember(p.id, id);
    setIds([...projects.find((x) => x.id === p.id).memberIds]);
    setOpen(false);
  };
  const members = ids
    .map((id) => users.find((user) => user.id === id))
    .filter(Boolean)
    .filter((user) => role === "ALL" || user.role === role)
    .filter((user) =>
      `${user.name} ${user.email} ${user.role}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  const developers = ids.filter(
    (id) => users.find((user) => user.id === id)?.role === "DEVELOPER",
  ).length;
  const viewers = ids.filter(
    (id) => users.find((user) => user.id === id)?.role === "VIEWER",
  ).length;
  return (
    <div className="team-management-page">
      <div className="team-management-header">
        <div>
          <span className="eyebrow">Project access</span>
          <h2>Team Members</h2>
          <p>Manage members, roles, and access for this project repository.</p>
        </div>
      </div>
      <div className="team-summary-grid">
        <MemberSummary
          label="Total Members"
          value={ids.length}
          icon={<UsersRound />}
        />
        <MemberSummary
          label="Developers"
          value={developers}
          icon={<Terminal />}
          tone="primary"
        />
        <MemberSummary
          label="Viewers"
          value={viewers}
          icon={<Eye />}
          tone="secondary"
        />
        <MemberSummary
          label="Pending Invites"
          value="0"
          icon={<Mail />}
          tone="muted"
        />
      </div>
      <div className="team-actions">
        <label className="team-search">
          <Search size={17} />
          <span className="sr-only">Search team members</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or role..."
          />
        </label>
        <label className="team-role-filter">
          <Filter size={16} />
          <span className="sr-only">Filter by role</span>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="ALL">All Roles</option>
            <option value="OWNER">Owner</option>
            <option value="DEVELOPER">Developer</option>
            <option value="VIEWER">Viewer</option>
          </select>
          <ChevronDown size={14} />
        </label>
        <button className="btn primary" onClick={() => setOpen(true)}>
          <UserPlus size={16} /> Add Member
        </button>
      </div>
      <div className="team-table-wrap">
        <table className="team-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Email Address</th>
              <th>Role</th>
              <th>Team / Scope</th>
              <th>Status</th>
              <th className="team-actions-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((u) => {
              return (
                <tr key={u.id}>
                  <td>
                    <div className="team-member-cell">
                      <Avatar id={u.id} size="large" />
                      <span>
                        <b>{u.name}</b>
                        <small>@{u.name.split(" ")[0].toLowerCase()}</small>
                      </span>
                    </div>
                  </td>
                  <td className="team-email">{u.email}</td>
                  <td>
                    <span className={`team-role-badge ${u.role.toLowerCase()}`}>
                      <i />
                      {u.role === "OWNER"
                        ? "Project Owner"
                        : u.role === "DEVELOPER"
                          ? "Developer"
                          : "Viewer"}
                    </span>
                  </td>
                  <td className="team-scope">
                    {u.role === "OWNER"
                      ? "Engineering Lead"
                      : u.role === "DEVELOPER"
                        ? "Product Engineering"
                        : "Project Workspace"}
                  </td>
                  <td>
                    <span
                      className={`team-status ${u.id === "user-1" ? "online" : ""}`}
                    >
                      <i />
                      {u.id === "user-1" ? "Active now" : "Active recently"}
                    </span>
                  </td>
                  <td className="team-actions-cell">
                    {u.id === "user-1" ? (
                      <button className="btn secondary">Manage</button>
                    ) : (
                      <button
                        className="team-more"
                        aria-label={`More actions for ${u.name}`}
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!members.length && (
        <EmptyState title="No team members match your filters" />
      )}
      {open && (
        <div className="dialog-backdrop">
          <div className="dialog add-member-dialog">
            <div className="add-member-header">
              <div className="add-member-title">
                <span>
                  <UserPlus size={18} />
                </span>
                <div>
                  <h2>Add Team Member</h2>
                  <p>Invite or assign colleagues to this project repository.</p>
                </div>
              </div>
              <button
                className="dialog-close"
                type="button"
                aria-label="Close modal"
                onClick={() => setOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <label className="add-member-label">
              Search User <small>Registered organization accounts</small>
            </label>
            <div className="add-member-search">
              <Search size={17} />
              <input placeholder="Search by name or email..." />
              <span>DevSync Org</span>
            </div>
            <label className="add-member-label">Project Scope &amp; Role</label>
            <div className="member-role-options">
              <label className={memberRole === "DEVELOPER" ? "selected" : ""}>
                <input
                  type="radio"
                  name="member-role"
                  checked={memberRole === "DEVELOPER"}
                  onChange={() => setMemberRole("DEVELOPER")}
                />
                <Terminal size={18} />
                <span>
                  <b>Developer</b>
                  <small>
                    Create and manage tasks, push code branches, and review
                    pulls.
                  </small>
                </span>
              </label>
              <label className={memberRole === "VIEWER" ? "selected" : ""}>
                <input
                  type="radio"
                  name="member-role"
                  checked={memberRole === "VIEWER"}
                  onChange={() => setMemberRole("VIEWER")}
                />
                <Eye size={18} />
                <span>
                  <b>Viewer</b>
                  <small>
                    Read-only visibility across sprints, boards, and issues.
                  </small>
                </span>
              </label>
            </div>
            <p className="member-role-help">
              <Info size={14} /> Developers can trigger CI runs and submit
              reviews. Viewers have read-only access.
            </p>
            <div className="dialog-actions">
              <button
                type="button"
                className="btn secondary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn primary"
                onClick={() => {
                  const candidate = users.find(
                    (user) => !ids.includes(user.id),
                  );
                  if (candidate) add(candidate.id);
                }}
              >
                <UserPlus size={15} /> Add Member
              </button>
            </div>
            <div className="project-list add-member-list">
              {users
                .filter((u) => !ids.includes(u.id))
                .map((u) => (
                  <button
                    className="project-row"
                    style={{ border: 0, background: "#fff", textAlign: "left" }}
                    key={u.id}
                    onClick={() => add(u.id)}
                  >
                    <Avatar id={u.id} />
                    <div>
                      <h4>{u.name}</h4>
                      <p>{u.email}</p>
                    </div>
                    <Plus size={16} style={{ marginLeft: "auto" }} />
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function MemberSummary({ label, value, icon, tone = "" }) {
  return (
    <div className="member-summary">
      <span>
        <small>{label}</small>
        <strong>{value}</strong>
      </span>
      <i className={tone}>{icon}</i>
    </div>
  );
}
function ProjectSettings({ p }) {
  const [data, setData] = useState({ ...p }),
    [saved, setSaved] = useState(false);
  return (
    <div className="panel" style={{ maxWidth: 660 }}>
      <h3>Project settings</h3>
      <p style={{ fontSize: 12, color: "#798397" }}>
        Changes are stored in this mock workspace.
      </p>
      <form
        className="form-grid"
        onSubmit={async (e) => {
          e.preventDefault();
          await projectService.updateProject(p.id, data);
          setSaved(true);
        }}
      >
        <label>
          Project name
          <input
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
        </label>
        <label>
          Description
          <textarea
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />
        </label>
        <label>
          Project key
          <input
            value={data.key}
            onChange={(e) => setData({ ...data, key: e.target.value })}
          />
        </label>
        {saved && (
          <small style={{ color: "#168257" }}>Saved successfully.</small>
        )}
        <div>
          <button className="btn primary">Save changes</button>
        </div>
      </form>
      <hr
        style={{ border: 0, borderTop: "1px solid #eee", margin: "28px 0" }}
      />
      <h3 style={{ color: "#b42318" }}>Danger zone</h3>
      <p style={{ fontSize: 12, color: "#798397" }}>
        Deleting a project is not enabled in the mock workspace.
      </p>
    </div>
  );
}
function AIBreakdown({ project, onClose, onCreated }) {
  const [ideas, setIdeas] = useState(null),
    [selected, setSelected] = useState([]),
    [req, setReq] = useState("Create a complete authentication workflow"),
    [editing, setEditing] = useState(null),
    [busy, setBusy] = useState(false);
  const generate = async () => {
    const x = await aiService.divideTask(req);
    setIdeas(x);
    setSelected(x.map((_, i) => i));
  };
  const create = async () => {
    setBusy(true);
    for (const i of selected)
      await taskService.createTask({ ...ideas[i], projectId: project.id });
    setBusy(false);
    onCreated();
    onClose();
  };
  return (
    <div className="dialog-backdrop">
      <div className="dialog ai-breakdown-dialog">
        <div className="ai-dialog-header">
          <div>
            <h2>
              <Sparkles size={18} /> AI Task Breakdown <span>Beta</span>
            </h2>
            <p>
              Automatically decompose requirements into actionable subtasks.
            </p>
          </div>
          <button
            className="dialog-close"
            type="button"
            aria-label="Close modal"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        {!ideas ? (
          <>
            <label className="ai-requirement">
              Requirement <span className="required">*</span>
              <textarea value={req} onChange={(e) => setReq(e.target.value)} />
            </label>
            <div className="dialog-actions">
              <button className="btn secondary" type="button" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn primary"
                type="button"
                onClick={generate}
                disabled={!req.trim()}
              >
                <Sparkles size={15} /> Generate suggestions
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="ai-breakdown-context">
              <b>Requirement</b>
              <p>{req}</p>
              <button type="button" onClick={generate}>
                <RotateCw size={14} /> Regenerate
              </button>
            </div>
            <div className="ai-list-heading">
              <b>AI Suggested Tasks</b>
              <span>
                {ideas.length} generated · {selected.length} selected
              </span>
              <button
                type="button"
                onClick={() =>
                  setSelected(
                    selected.length === ideas.length
                      ? []
                      : ideas.map((_, i) => i),
                  )
                }
              >
                {selected.length === ideas.length
                  ? "Deselect all"
                  : "Select all"}
              </button>
            </div>
            <div className="ai-result">
              {ideas.map((x, i) => (
                <label className="ai-suggestion" key={i}>
                  <input
                    type="checkbox"
                    checked={selected.includes(i)}
                    onChange={(e) =>
                      setSelected(
                        e.target.checked
                          ? [...selected, i]
                          : selected.filter((n) => n !== i),
                      )
                    }
                  />
                  <div className="ai-suggestion-content">
                    {editing === i ? (
                      <input
                        value={x.title}
                        onChange={(e) =>
                          setIdeas(
                            ideas.map((idea, index) =>
                              index === i
                                ? { ...idea, title: e.target.value }
                                : idea,
                            ),
                          )
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <h4>
                        {x.title} <PriorityBadge priority={x.priority} />
                      </h4>
                    )}
                    <p>{x.description}</p>
                  </div>
                  <div className="ai-suggestion-actions">
                    <button
                      type="button"
                      aria-label="Edit suggestion"
                      onClick={(e) => {
                        e.preventDefault();
                        setEditing(editing === i ? null : i);
                      }}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      aria-label="Delete suggestion"
                      onClick={(e) => {
                        e.preventDefault();
                        setIdeas(ideas.filter((_, index) => index !== i));
                        setSelected(selected.filter((index) => index !== i));
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </label>
              ))}
            </div>
            <div className="dialog-actions">
              <button className="btn secondary" type="button" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn primary"
                type="button"
                onClick={create}
                disabled={!selected.length || busy}
              >
                <Check size={15} />{" "}
                {busy ? "Creating..." : `Create selected (${selected.length})`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
function MyTasks() {
  const { user } = useAuth();
  const [ts, setTs] = useState(null),
    [filter, setFilter] = useState("ALL"),
    [query, setQuery] = useState(""),
    [view, setView] = useState("list");
  useEffect(() => {
    taskService.getMyTasks(user.id).then(setTs);
  }, [user]);
  if (!ts) return <Loading label="Loading your tasks…" />;
  const list = ts
    .filter((task) => filter === "ALL" || task.status === filter)
    .filter((task) =>
      `${task.title} ${task.taskKey}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  return (
    <div className="my-tasks-page">
      <PageHeader eyebrow="Personal workspace" title="My Tasks">
        <div className="view-toggle">
          <button
            className={`btn secondary ${view === "list" ? "selected" : ""}`}
            onClick={() => setView("list")}
            title="List view"
          >
            <List size={16} />
          </button>
          <button
            className={`btn secondary ${view === "board" ? "selected" : ""}`}
            onClick={() => setView("board")}
            title="Board view"
          >
            <KanbanSquare size={16} />
          </button>
        </div>
        <Link className="btn primary" to={`/projects/project-1/board`}>
          <Plus size={15} /> New Task
        </Link>
      </PageHeader>
      <div className="my-task-summary">
        <span>Assigned to you</span>
        <strong>{ts.length} tasks</strong>
        <small>
          {ts.filter((task) => task.status !== "DONE").length} active
        </small>
      </div>
      <div className="my-task-toolbar">
        <label className="board-search">
          <Search size={16} />
          <span className="sr-only">Search my tasks</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks, branches, PRs..."
          />
        </label>
        <div className="tabs my-task-tabs">
          {["ALL", ...statusOptions].map((x) => (
            <button
              type="button"
              key={x}
              onClick={() => setFilter(x)}
              className={filter === x ? "active" : ""}
            >
              {x === "ALL" ? "All" : statusLabel(x)}
            </button>
          ))}
        </div>
      </div>
      {list.length && view === "list" ? (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Status</th>
                <th>Due</th>
              </tr>
            </thead>
            <tbody>
              {list.map((t) => (
                <tr key={t.id}>
                  <td>
                    <Link className="task-title" to={`/tasks/${t.id}`}>
                      {t.taskKey} · {t.title}
                    </Link>
                  </td>
                  <td>{projects.find((p) => p.id === t.projectId)?.name}</td>
                  <td>
                    <StatusBadge status={t.status} />
                  </td>
                  <td>{t.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : list.length && view === "board" ? (
        <div className="board my-task-board">
          {statusOptions.map((status) => (
            <section className={`board-col col-${status}`} key={status}>
              <div className="board-col-head">
                <h3>{statusLabel(status)}</h3>
                <span>
                  {list.filter((task) => task.status === status).length}
                </span>
              </div>
              <div className="task-stack">
                {list
                  .filter((task) => task.status === status)
                  .map((task) => (
                    <TaskCard task={task} key={task.id} />
                  ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <EmptyState title="No tasks match this filter" />
      )}
    </div>
  );
}
function TaskDetails() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null),
    [cs, setCs] = useState([]),
    [comment, setComment] = useState(""),
    [ai, setAi] = useState(null),
    [loading, setLoading] = useState(true),
    [subtasks, setSubtasks] = useState([]),
    [activeTab, setActiveTab] = useState("overview"),
    [accepted, setAccepted] = useState([]),
    [aiPanel, setAiPanel] = useState(false);
  const nav = useNavigate();
  const load = async () => {
    const [nextTask, nextComments] = await Promise.all([
      taskService.getTask(taskId),
      commentService.getComments(taskId),
    ]);
    setTask(nextTask || null);
    setCs(nextComments);
    setLoading(false);
  };
  useEffect(() => {
    let active = true;

    async function fetchData() {
      const [nextTask, nextComments] = await Promise.all([
        taskService.getTask(taskId),
        commentService.getComments(taskId),
      ]);
      if (!active) return;
      setTask(nextTask || null);
      setCs(nextComments);
      setSubtasks(await taskService.getSubtasks(taskId));
      setLoading(false);
    }

    setTask(null);
    setLoading(true);
    fetchData();

    return () => {
      active = false;
    };
  }, [taskId]);
  if (loading) return <Loading label="Loading task…" />;
  if (!task) return <EmptyState title="Task not found" />;
  const owner = users.find((u) => u.id === task.assigneeId) || users[0],
    project = projects.find((p) => p.id === task.projectId);
  const update = async (patch) => {
    await taskService.updateTask(task.id, patch);
    load();
  };
  const post = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    await commentService.createComment({
      taskId,
      userId: "user-1",
      content: comment,
    });
    setComment("");
    load();
  };
  return (
    <div className="task-detail-page">
      <div className="task-detail-command">
        <div className="task-detail-breadcrumb">
          <button
            type="button"
            onClick={() => nav(`/projects/${task.projectId}/board`)}
          >
            <ArrowLeft size={15} /> Projects
          </button>
          <span>/</span>
          <span>{project?.name}</span>
          <span>/</span>
          <b>{task.taskKey}</b>
        </div>
        <div className="task-detail-actions">
          <button className="btn secondary">Edit Task</button>
          <button
            className="btn primary"
            onClick={async () => {
              setAi(await aiService.generateTaskDetails(task));
              setAiPanel(true);
            }}
          >
            <Sparkles size={15} /> AI Copilot
          </button>
          <button className="btn secondary" aria-label="Copy task link">
            <Copy size={16} />
          </button>
          <button className="btn secondary" aria-label="Task information">
            <MoreHorizontal size={17} />
          </button>
        </div>
      </div>
      <div className="task-detail-heading">
        <div>
          <div className="task-detail-meta">
            <span className="task-key">{task.taskKey}</span>
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
          </div>
          <h1>{task.title}</h1>
          <p>{task.description}</p>
        </div>
      </div>
      <div className="task-detail-tabs">
        {[
          ["overview", "Overview & Specs"],
          [
            "subtasks",
            `Subtasks${subtasks.length ? ` (${subtasks.length})` : ""}`,
          ],
          ["comments", `Comments${cs.length ? ` (${cs.length})` : ""}`],
          ["activity", "Audit Log"],
        ].map(([value, label]) => (
          <button
            type="button"
            key={value}
            className={activeTab === value ? "active" : ""}
            onClick={() => setActiveTab(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid detail-layout" style={{ marginTop: 20 }}>
        <article className="panel">
          {activeTab === "overview" && (
            <>
              <div className="task-detail-section-heading">
                <h2>
                  <Info size={19} /> Description
                </h2>
              </div>
              <p className="task-detail-description">
                {task.description || "No description provided yet."}
              </p>
              <div className="endpoint-preview">
                <div>
                  <span>Endpoint Contract</span>
                  <b>JSON Payload v1</b>
                </div>
                <code>
                  POST /api/v1/auth/login{"\n"}
                  {"{"}
                  {"\n"} "email": "developer@devsync.io",{"\n"} "password":
                  "••••••••••••"{"\n"}
                  {"}"}
                </code>
              </div>
              <section className="detail-section">
                <div className="task-detail-section-heading">
                  <h2>
                    <CheckCircle2 size={19} /> Acceptance Criteria
                  </h2>
                  <span>{accepted.length} of 4 completed</span>
                </div>
                <div className="criteria-progress">
                  <i style={{ width: `${accepted.length * 25}%` }} />
                </div>
                {[
                  "Validate user credentials",
                  "Generate JWT access and refresh tokens",
                  "Return structured error responses",
                  "Add authentication tests",
                ].map((criterion, index) => (
                  <label className="criteria-row" key={criterion}>
                    <input
                      type="checkbox"
                      checked={accepted.includes(index)}
                      onChange={(e) =>
                        setAccepted(
                          e.target.checked
                            ? [...accepted, index]
                            : accepted.filter((item) => item !== index),
                        )
                      }
                    />
                    <span className={accepted.includes(index) ? "done" : ""}>
                      {criterion}
                    </span>
                  </label>
                ))}
              </section>
            </>
          )}
          {(activeTab === "subtasks" || activeTab === "overview") && (
            <section className="detail-section task-subtasks-section">
              <div className="task-detail-section-heading">
                <h2>
                  <ListChecks size={19} /> Linked Subtasks
                </h2>
                <button
                  className="text-action"
                  type="button"
                  onClick={() => setActiveTab("subtasks")}
                >
                  Create Subtask <Plus size={14} />
                </button>
              </div>
              {subtasks.length ? (
                subtasks.map((subtask) => (
                  <Link
                    className="subtask-row"
                    key={subtask.id}
                    to={`/tasks/${subtask.id}`}
                  >
                    <Circle size={16} />
                    <span>
                      {subtask.taskKey} · {subtask.title}
                    </span>
                    <StatusBadge status={subtask.status} />
                  </Link>
                ))
              ) : (
                <EmptyState title="No linked subtasks yet" />
              )}
            </section>
          )}
          {(activeTab === "comments" || activeTab === "overview") && (
            <>
              <section className="detail-section">
                <div className="panel-head">
                  <h3>
                    <MessageSquare size={17} /> Comments &amp; Discussion
                  </h3>
                  <span>{cs.length}</span>
                </div>
                <div className="comments">
                  {cs.map((c) => {
                    const u = users.find((x) => x.id === c.userId);
                    return (
                      <div className="comment" key={c.id}>
                        <Avatar id={u.id} />
                        <div className="comment-body">
                          <strong>{u.name}</strong>
                          <span>
                            {new Date(c.createdAt).toLocaleDateString()}
                          </span>
                          <p>{c.content}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <form className="comment-form" onSubmit={post}>
                  <input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment…"
                  />
                  <button className="btn primary">
                    <Send size={15} /> Send
                  </button>
                </form>
              </section>
            </>
          )}
          <section className="detail-section">
            <div className="panel-head">
              <h3>AI task details</h3>
              <button
                className="btn secondary"
                onClick={async () =>
                  setAi(await aiService.generateTaskDetails(task))
                }
              >
                <Sparkles size={14} /> Generate
              </button>
            </div>
            {ai && (
              <div className="ai-suggestion">
                <div>
                  <h4>
                    Suggested priority: <PriorityBadge priority={ai.priority} />
                  </h4>
                  <p>{ai.description}</p>
                  <p>
                    <b>Criteria:</b> {ai.criteria}
                  </p>
                  <button
                    className="btn primary"
                    style={{ marginTop: 8 }}
                    onClick={() =>
                      update({
                        description: ai.description,
                        acceptanceCriteria: ai.criteria,
                        priority: ai.priority,
                      })
                    }
                  >
                    Apply suggestions
                  </button>
                </div>
              </div>
            )}
          </section>
        </article>
        <aside className="panel side-meta task-metadata-card">
          <div className="task-detail-section-heading">
            <h2>Task Details</h2>
            <Info size={17} />
          </div>
          <div>
            <label>Status</label>
            <select
              className="form-control"
              value={task.status}
              onChange={(e) => update({ status: e.target.value })}
            >
              {statusOptions.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Priority</label>
            <select
              className="form-control"
              value={task.priority}
              onChange={(e) => update({ priority: e.target.value })}
            >
              {["LOW", "MEDIUM", "HIGH", "URGENT"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Assignee</label>
            <div>
              <Avatar id={owner.id} />
              {owner.name}
            </div>
          </div>
          <div>
            <label>Due date</label>
            <div>
              <CalendarDays size={14} /> {task.dueDate}
            </div>
          </div>
          <div>
            <label>Labels</label>
            <div>
              {task.labels.map((l) => (
                <span className="badge priority-LOW" key={l}>
                  {l}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
      {aiPanel && ai && (
        <aside className="task-ai-panel">
          <div className="task-ai-panel-header">
            <h2>
              <Sparkles size={17} /> AI Assistant <span>Beta</span>
            </h2>
            <button
              type="button"
              aria-label="Close AI panel"
              onClick={() => setAiPanel(false)}
            >
              <X size={17} />
            </button>
          </div>
          <p className="task-ai-powered">Mock AI context: {task.taskKey}</p>
          <section>
            <h3>Suggested Description</h3>
            <p>{ai.description}</p>
          </section>
          <section>
            <h3>Acceptance Criteria</h3>
            {[
              "Validate credentials",
              "Generate JWT tokens",
              "Handle invalid requests",
              "Add integration tests",
            ].map((item) => (
              <div className="task-ai-item" key={item}>
                <CheckCircle2 size={15} /> {item}
              </div>
            ))}
          </section>
          <section className="task-ai-grid">
            <div>
              <small>Suggested Priority</small>
              <PriorityBadge priority={ai.priority} />
            </div>
            <div>
              <small>Suggested Estimate</small>
              <b>5 Story Points</b>
            </div>
          </section>
          <button
            className="btn primary"
            onClick={() => {
              update({
                description: ai.description,
                acceptanceCriteria: ai.criteria,
                priority: ai.priority,
              });
              setAiPanel(false);
            }}
          >
            <Check size={15} /> Apply Suggestions
          </button>
        </aside>
      )}
    </div>
  );
}
function Notifications() {
  const [notes, setNotes] = useState(null),
    [query, setQuery] = useState(""),
    [filter, setFilter] = useState("ALL"),
    [unreadOnly, setUnreadOnly] = useState(false);
  useEffect(() => {
    notificationService.getNotifications().then(setNotes);
  }, []);
  if (!notes) return <Loading />;
  const visibleNotes = notes
    .filter((note) => filter === "ALL" || note.type === filter)
    .filter((note) => !unreadOnly || !note.read)
    .filter((note) => note.message.toLowerCase().includes(query.toLowerCase()));
  const unread = notes.filter((note) => !note.read).length;
  return (
    <div className="notifications-page">
      <PageHeader eyebrow="Inbox" title="Notifications">
        <label className="notification-search">
          <Search size={16} />
          <span className="sr-only">Filter alerts</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter alerts..."
          />
        </label>
        <button
          className="btn secondary"
          onClick={async () => {
            await notificationService.markAllAsRead();
            setNotes([...notes]);
          }}
        >
          Mark all as read
        </button>
      </PageHeader>
      <p className="notifications-intro">
        You have {unread} unread updates across your projects and connected
        repositories.
      </p>
      <div className="notification-filter-bar">
        <div className="tabs">
          {[
            ["ALL", "All"],
            ["TASK", "Tasks"],
            ["COMMENT", "Comments"],
          ].map(([value, label]) => (
            <button
              type="button"
              key={value}
              className={filter === value ? "active" : ""}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <label>
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(e) => setUnreadOnly(e.target.checked)}
          />{" "}
          Unread only
        </label>
      </div>
      <section className="panel notifications-list">
        {visibleNotes.map((n) => (
          <Link
            className={`notification ${!n.read ? "unread" : ""}`}
            to={`/tasks/${n.taskId}`}
            onClick={() => notificationService.markAsRead(n.id)}
            key={n.id}
          >
            <div className="notification-icon">
              <Bell size={15} />
            </div>
            <div>
              <p>{n.message}</p>
              <small>{n.createdAt}</small>
            </div>
          </Link>
        ))}
      </section>
      {!visibleNotes.length && (
        <EmptyState title="No notifications match your filters" />
      )}
    </div>
  );
}
function AI() {
  const [result, setResult] = useState(null),
    [projectId, setProjectId] = useState(projects[0].id),
    [period, setPeriod] = useState("Last 24 hours"),
    [busy, setBusy] = useState(false),
    [copied, setCopied] = useState(false);
  const generate = async () => {
    setBusy(true);
    setResult(await aiService.generateStandup({ projectId, period }));
    setBusy(false);
  };
  const copy = async () => {
    if (!result) return;
    await navigator.clipboard?.writeText(
      Object.entries(result)
        .map(
          ([title, items]) =>
            `## ${title}\n${items.map((item) => `- ${item}`).join("\n")}`,
        )
        .join("\n\n"),
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="ai-standup-page">
      <PageHeader eyebrow="DevSync AI · AI Beta" title="AI Daily Standup">
        <button className="btn secondary" onClick={copy} disabled={!result}>
          <CopyCheck size={15} /> {copied ? "Copied" : "Copy Markdown"}
        </button>
      </PageHeader>
      <div className="panel ai-controls" style={{ maxWidth: 1100 }}>
        <p style={{ fontSize: 13, color: "#6d778b" }}>
          Generate a concise snapshot of the work your team has completed,
          planned and blocked.
        </p>
        <div className="toolbar">
          <label>
            Project
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Time period
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option>Last 24 hours</option>
              <option>Last 48 hours</option>
              <option>Current sprint</option>
            </select>
          </label>
          <button className="btn primary" onClick={generate} disabled={busy}>
            {busy ? <RotateCw size={15} /> : <Sparkles size={15} />}{" "}
            {busy ? "Generating..." : "Generate report"}
          </button>
        </div>
        {result && (
          <div className="grid standup-grid">
            {[
              ["Yesterday", result.yesterday],
              ["Today", result.today],
              ["Blocked", result.blocked],
            ].map(([title, list]) => (
              <div key={title}>
                <h3>{title}</h3>
                <ul>
                  {list.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
function Teams() {
  return (
    <>
      <PageHeader eyebrow="People" title="Your team" />
      <div className="grid projects-grid">
        {users.map((u) => (
          <div className="panel" key={u.id} style={{ textAlign: "center" }}>
            <Avatar id={u.id} size="large" />
            <h3>{u.name}</h3>
            <p style={{ fontSize: 12, color: "#788296" }}>{u.email}</p>
            <span className="badge priority-LOW">{u.role}</span>
          </div>
        ))}
      </div>
    </>
  );
}
function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user.name),
    [section, setSection] = useState("profile"),
    [saved, setSaved] = useState(false),
    [alerts, setAlerts] = useState({
      assignments: true,
      mentions: true,
      digest: true,
      weekly: false,
    });
  return (
    <div className="settings-page">
      <PageHeader eyebrow="DevSync · Preferences" title="Settings">
        <span className="settings-sync-status">
          <i /> Cloud sync active
        </span>
      </PageHeader>
      <div className="settings-layout">
        <aside className="settings-sidebar">
          <nav>
            <b>Personal</b>
            {[
              ["profile", "Profile"],
              ["account", "Account & Security"],
              ["notifications", "Notifications"],
              ["integrations", "Integrations"],
            ].map(([value, label]) => (
              <button
                type="button"
                className={section === value ? "active" : ""}
                key={value}
                onClick={() => setSection(value)}
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="settings-node">
            <small>DevSync Node</small>
            <b>us-east-1</b>
            <span>
              <i /> All pipelines operational
            </span>
          </div>
        </aside>
        <section className="settings-content">
          {section === "profile" && (
            <div className="panel settings-card">
              <div className="settings-card-heading">
                <div>
                  <h2>Personal Profile</h2>
                  <p>
                    Configure your public engineering profile and localized
                    display attributes.
                  </p>
                </div>
                <span>Public in DevSync</span>
              </div>
              <div className="settings-avatar">
                <Avatar id={user.id} size="large" />
                <div>
                  <button type="button" className="btn primary">
                    Change Avatar
                  </button>
                  <p>Recommended: JPG, PNG, or GIF up to 5MB.</p>
                </div>
              </div>
              <form
                className="settings-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  updateUser({ ...user, name });
                  setSaved(true);
                }}
              >
                <label>
                  Full Name
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
                <label>
                  Username / Handle
                  <input
                    value={`@${name.split(" ")[0].toLowerCase()}`}
                    readOnly
                  />
                </label>
                <label>
                  Work Email
                  <input value={user.email} disabled />
                </label>
                <label>
                  Role / Designation
                  <input value="Engineering Lead" readOnly />
                </label>
                <label className="wide">
                  Bio &amp; Technical Scope
                  <textarea
                    rows="3"
                    defaultValue="Engineering Lead on DevSync Core and Platform Architecture."
                  />
                </label>
                <div className="settings-form-actions">
                  <span>
                    {saved ? "Saved successfully." : "Last updated today"}
                  </span>
                  <button className="btn primary">Save Changes</button>
                </div>
              </form>
            </div>
          )}
          {section === "account" && (
            <div className="panel settings-card">
              <div className="settings-card-heading">
                <div>
                  <h2>Account &amp; Security</h2>
                  <p>
                    Manage authentication and account access for this mock
                    workspace.
                  </p>
                </div>
              </div>
              {[
                ["Work email", user.email, "Verified"],
                ["Password", "••••••••••••", "Change password"],
                [
                  "Two-factor authentication",
                  "Not configured",
                  "Configure 2FA",
                ],
              ].map(([label, value, action]) => (
                <div className="settings-info-row" key={label}>
                  <span>{label}</span>
                  <b>{value}</b>
                  <button type="button" className="btn secondary">
                    {action}
                  </button>
                </div>
              ))}
            </div>
          )}
          {section === "notifications" && (
            <div className="panel settings-card">
              <div className="settings-card-heading">
                <div>
                  <h2>Notification Rules</h2>
                  <p>
                    Fine-tune how DevSync dispatches reviews, mentions, and
                    sprint reports.
                  </p>
                </div>
                <span>Auto-synced</span>
              </div>
              {[
                [
                  "assignments",
                  "Task & Pull Request Assignments",
                  "Receive alerts when tasks or PRs need your review.",
                ],
                [
                  "mentions",
                  "Mentions & Thread Comments",
                  "Get notified when teammates mention you.",
                ],
                [
                  "digest",
                  "Daily Standup Summary",
                  "Receive an AI-generated daily digest.",
                ],
                [
                  "weekly",
                  "Weekly Velocity Report",
                  "A weekly summary of sprint metrics and blockers.",
                ],
              ].map(([key, label, description]) => (
                <div className="settings-toggle-row" key={key}>
                  <span>
                    <b>{label}</b>
                    <small>{description}</small>
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={alerts[key]}
                    className={alerts[key] ? "on" : ""}
                    onClick={() =>
                      setAlerts({ ...alerts, [key]: !alerts[key] })
                    }
                  >
                    <i />
                  </button>
                </div>
              ))}
            </div>
          )}
          {section === "integrations" && (
            <div className="panel settings-card">
              <div className="settings-card-heading">
                <div>
                  <h2>Connected Integrations</h2>
                  <p>
                    Synchronize repositories, ticket lifecycles, and team
                    communication pipelines.
                  </p>
                </div>
              </div>
              {[
                ["GitHub Enterprise", "org: devsync · 14 repositories"],
                ["Slack Workspace", "#engineering-daily"],
              ].map(([name, detail]) => (
                <div className="integration-row" key={name}>
                  <b>{name}</b>
                  <span>{detail}</span>
                  <em>Connected</em>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
function SearchPage() {
  const [params] = useSearchParams(),
    q = params.get("q") || "",
    [res, setRes] = useState(null);
  useEffect(() => {
    let active = true;

    async function fetchData() {
      if (!q) return;
      const nextResults = await searchService.search(q);
      if (active) setRes(nextResults);
    }

    setRes(null);
    fetchData();

    return () => {
      active = false;
    };
  }, [q]);
  return (
    <>
      <PageHeader
        eyebrow="Search"
        title={q ? `Results for "${q}"` : "Search DevSync"}
      />
      {!q ? (
        <EmptyState title="Start by typing in the global search" />
      ) : !res ? (
        <Loading />
      ) : (
        <div className="grid dashboard-grid">
          <section className="panel">
            <h3>Tasks</h3>
            <div className="task-stack" style={{ marginTop: 15 }}>
              {res.tasks.map((t) => (
                <TaskCard task={t} key={t.id} compact />
              ))}
            </div>
          </section>
          <section className="panel">
            <h3>Projects</h3>
            {res.projects.map((p) => (
              <Link key={p.id} className="project-row" to={`/projects/${p.id}`}>
                {p.name}
              </Link>
            ))}
            <h3 style={{ marginTop: 25 }}>People</h3>
            {res.users.map((u) => (
              <div className="activity" key={u.id}>
                <Avatar id={u.id} />
                <div>
                  <h4>{u.name}</h4>
                  <p>{u.email}</p>
                </div>
              </div>
            ))}
          </section>
        </div>
      )}
    </>
  );
}
function NotFound() {
  return (
    <div className="empty">
      <div className="empty-icon">404</div>
      <h3>This page has wandered off</h3>
      <Link className="btn primary" to="/dashboard">
        Back to dashboard
      </Link>
    </div>
  );
}
export {
  useAuth,
  Protected,
  Shell,
  Landing,
  AuthPage,
  Dashboard,
  Projects,
  ProjectLayout,
  ProjectOverview,
  Board,
  MyTasks,
  TaskDetails,
  Notifications,
  AI,
  Teams,
  SettingsPage,
  SearchPage,
  NotFound,
  ProjectDialog,
  ProjectTabs,
  TaskDialog,
  TaskList,
  Members,
  ProjectSettings,
  AIBreakdown,
};
