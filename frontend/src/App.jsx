import { useState, useEffect, createContext, useContext } from "react";
import {
  Routes,
  Route,
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
} from "lucide-react";
import {
  authService,
  projectService,
  taskService,
  commentService,
  notificationService,
  aiService,
  searchService,
} from "./services/services";
import { users, projects, tasks } from "./mock/data";
import { AppLayout } from "./components/layout";
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
} from "./components/common";
import { statusLabel } from "./lib/constants";
import StitchLanding from "./pages/StitchLanding";
const Auth = createContext();
const useAuth = () => useContext(Auth);
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
  if (register) return <div className="signup-stitch"><header><Link className="login-logo" to="/"><i>↔</i>DevSync</Link><Link className="login-back" to="/">Back to website ↗</Link></header><main><form className="signup-card" onSubmit={submit}><div className="login-card-head"><i>‹›</i><h1>Create an account</h1><p>Start collaborating and managing projects with DevSync</p></div><label>Full Name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Alex Mercer"/></label><label>Email Address<input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></label><label>Password<input type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••••••"/></label><label>Confirm Password<input type="password" required placeholder="••••••••••••"/></label><div className="password-hints"><b>Password requirements</b><span>✓ At least 8 characters</span><span>✓ One number</span><span>✓ One special character</span></div><label className="terms"><input type="checkbox" required defaultChecked/> I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.</label>{error&&<small className="login-error">{error}</small>}<button className="login-submit" disabled={busy}>{busy?'Please wait...':'Sign Up →'}</button><div className="login-divider"><span>or continue with</span></div><div className="login-social"><button type="button">G&nbsp;&nbsp; Google</button><button type="button">◉&nbsp;&nbsp; GitHub</button></div><p className="login-signup">Already have an account? <Link to="/login">Login</Link></p></form><p className="login-trust">● Git Sync Active &nbsp; • &nbsp; ▢ 256-bit SSL Encrypted</p></main><footer>© 2026 DevSync Technologies Inc. &nbsp; • &nbsp; Privacy Policy &nbsp; • &nbsp; Terms of Service &nbsp; • &nbsp; System Status</footer></div>;
  if (!register) return <div className="login-stitch"><header><Link className="login-logo" to="/"><i>↔</i>DevSync</Link><Link className="login-back" to="/">Back to website ↗</Link></header><main><form className="login-card" onSubmit={submit}><div className="login-card-head"><i>‹›</i><h1>Welcome Back!</h1><p>Login to your DevSync workspace</p></div><label>Email Address<input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></label><label><span>Password <button type="button">Forgot password?</button></span><input type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••••••"/></label><label className="remember"><input type="checkbox"/> Remember this device for 30 days</label>{error&&<small className="login-error">{error}</small>}<button className="login-submit" disabled={busy}>{busy?'Please wait...':'Login →'}</button><div className="login-divider"><span>or continue with</span></div><div className="login-social"><button type="button">G&nbsp;&nbsp; Google</button><button type="button">◉&nbsp;&nbsp; GitHub</button></div><p className="login-signup">Don't have an account? <Link to="/register">Sign up for free</Link></p></form><p className="login-trust">● Git Sync Active &nbsp; • &nbsp; ▢ 256-bit SSL Encrypted</p></main><footer>© 2026 DevSync Technologies Inc. &nbsp; • &nbsp; Privacy Policy &nbsp; • &nbsp; Terms of Service &nbsp; • &nbsp; System Status</footer></div>;
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
    <>
      <PageHeader eyebrow="Workspace" title="Good morning, Himanshu">
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
    </>
  );
}
function ProjectDialog({ onClose, onCreate }) {
  const [data, setData] = useState({ name: "", key: "", description: "" });
  return (
    <div className="dialog-backdrop">
      <form
        className="dialog form-grid"
        onSubmit={async (e) => {
          e.preventDefault();
          await onCreate(data);
          onClose();
        }}
      >
        <h2>Create a project</h2>
        <p>Give your next piece of work a clear home.</p>
        <label>
          Project name
          <input
            required
            autoFocus
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
        </label>
        <label>
          Project key
          <input
            required
            maxLength="5"
            value={data.key}
            onChange={(e) =>
              setData({ ...data, key: e.target.value.toUpperCase() })
            }
          />
        </label>
        <label>
          Description
          <textarea
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />
        </label>
        <div className="dialog-actions">
          <button type="button" className="btn secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary">Create project</button>
        </div>
      </form>
    </div>
  );
}
function Projects() {
  const [ps, setPs] = useState(null),
    [open, setOpen] = useState(false);
  const load = () => projectService.getProjects().then(setPs);
  useEffect(() => {
    load();
  }, []);
  return (
    <>
      <PageHeader eyebrow="Workspace" title="Projects">
        <button className="btn primary" onClick={() => setOpen(true)}>
          <Plus size={16} /> New project
        </button>
      </PageHeader>
      {!ps ? (
        <Loading label="Loading projects…" />
      ) : (
        <div className="grid projects-grid">
          {ps.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
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
    </>
  );
}
function ProjectTabs({ id }) {
  return (
    <div className="tabs">
      <NavLink end to={`/projects/${id}`}>
        Overview
      </NavLink>
      <NavLink to={`/projects/${id}/board`}>Board</NavLink>
      <NavLink to={`/projects/${id}/list`}>List</NavLink>
      <NavLink to={`/projects/${id}/members`}>Members</NavLink>
      <NavLink to={`/projects/${id}/settings`}>Settings</NavLink>
    </div>
  );
}
function ProjectLayout({ mode = "overview" }) {
  const { projectId } = useParams();
  const p = projects.find((x) => x.id === projectId);
  if (!p) return <EmptyState title="Project not found" />;
  return (
    <>
      <div className="project-hero">
        <div>
          <span className="eyebrow">{p.key} · Project</span>
          <h1>{p.name}</h1>
          <p>{p.description}</p>
        </div>
        <Link className="btn primary" to={`/projects/${p.id}/board`}>
          Open board
        </Link>
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
    </>
  );
}
function ProjectOverview({ p }) {
  const ts = tasks.filter((t) => t.projectId === p.id);
  return (
    <div className="grid overview-grid">
      <section className="panel">
        <div className="panel-head">
          <h3>Project progress</h3>
          <b>{p.progress}%</b>
        </div>
        <div className="progress-line">
          <i style={{ width: p.progress + "%", background: p.color }} />
        </div>
        <div className="grid stats" style={{ marginTop: 20 }}>
          {statusOptions.map((s) => (
            <div key={s}>
              <small style={{ color: "#7c8698" }}>{statusLabel(s)}</small>
              <h2 style={{ margin: "5px 0", fontFamily: "Space Grotesk" }}>
                {ts.filter((t) => t.status === s).length}
              </h2>
            </div>
          ))}
        </div>
        <div className="panel-head" style={{ marginTop: 30 }}>
          <h3>Recent tasks</h3>
          <Link to={`/projects/${p.id}/board`}>View board</Link>
        </div>
        <div className="task-stack">
          {ts.slice(0, 3).map((t) => (
            <TaskCard task={t} key={t} />
          ))}
        </div>
      </section>
      <aside className="panel">
        <div className="panel-head">
          <h3>Team</h3>
          <Link to={`/projects/${p.id}/members`}>Manage</Link>
        </div>
        {p.memberIds.map((id) => {
          const u = users.find((x) => x.id === id);
          return (
            <div className="activity" key={id}>
              <Avatar id={id} />
              <div>
                <h4>{u.name}</h4>
                <p>{u.role}</p>
              </div>
            </div>
          );
        })}
      </aside>
    </div>
  );
}
function TaskDialog({ project, onClose, onCreate }) {
  const [data, setData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    assigneeId: "user-1",
  });
  return (
    <div className="dialog-backdrop">
      <form
        className="dialog form-grid"
        onSubmit={async (e) => {
          e.preventDefault();
          await onCreate({ ...data, projectId: project.id });
          onClose();
        }}
      >
        <h2>Create task</h2>
        <p>Add a clear, actionable piece of work.</p>
        <label>
          Title
          <input
            required
            autoFocus
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
          />
        </label>
        <label>
          Description
          <textarea
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />
        </label>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
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
            Assignee
            <select
              value={data.assigneeId}
              onChange={(e) => setData({ ...data, assigneeId: e.target.value })}
            >
              {project.memberIds.map((id) => (
                <option value={id} key={id}>
                  {users.find((u) => u.id === id).name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="dialog-actions">
          <button type="button" className="btn secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary">Create task</button>
        </div>
      </form>
    </div>
  );
}
function Board({ p }) {
  const [ts, setTs] = useState([]),
    [create, setCreate] = useState(false),
    [ai, setAi] = useState(false);
  const load = () => taskService.getProjectTasks(p.id).then(setTs);
  useEffect(() => {
    load();
  }, [p.id]);
  const move = async (t, status) => {
    await taskService.updateTask(t.id, { status });
    load();
  };
  return (
    <>
      <div className="toolbar">
        <span style={{ fontSize: 12, fontWeight: 700 }}>{ts.length} tasks</span>
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
              {ts
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
                  {users.find((u) => u.id === t.assigneeId).name}
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
    [ids, setIds] = useState(p.memberIds);
  const add = async (id) => {
    await projectService.addMember(p.id, id);
    setIds([...projects.find((x) => x.id === p.id).memberIds]);
    setOpen(false);
  };
  return (
    <>
      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>Team members</h3>
            <small>{ids.length} people have access to this project.</small>
          </div>
          <button className="btn primary" onClick={() => setOpen(true)}>
            <Plus size={15} /> Add member
          </button>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Email</th>
                <th>Role</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {ids.map((id) => {
                const u = users.find((x) => x.id === id);
                return (
                  <tr key={id}>
                    <td>
                      <div className="assignee">
                        <Avatar id={id} />
                        <b>{u.name}</b>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>
                      <button className="btn secondary">Manage</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {open && (
        <div className="dialog-backdrop">
          <div className="dialog">
            <h2>Add a member</h2>
            <p>Invite someone into {p.name}.</p>
            <div className="project-list">
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
            <div className="dialog-actions">
              <button className="btn secondary" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
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
    [req, setReq] = useState("Create a complete authentication workflow");
  const generate = async () => {
    const x = await aiService.divideTask(req);
    setIdeas(x);
    setSelected(x.map((_, i) => i));
  };
  const create = async () => {
    for (const i of selected)
      await taskService.createTask({ ...ideas[i], projectId: project.id });
    onCreated();
    onClose();
  };
  return (
    <div className="dialog-backdrop">
      <div className="dialog">
        <h2>
          <Sparkles size={18} style={{ color: "#6c5ce7" }} /> AI task breakdown
        </h2>
        <p>Turn a requirement into a reviewable task plan.</p>
        {!ideas ? (
          <>
            <label className="form-grid">
              Requirement
              <textarea value={req} onChange={(e) => setReq(e.target.value)} />
            </label>
            <div className="dialog-actions">
              <button className="btn secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="btn primary" onClick={generate}>
                Generate suggestions
              </button>
            </div>
          </>
        ) : (
          <>
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
                  <div>
                    <h4>
                      {x.title} <PriorityBadge priority={x.priority} />
                    </h4>
                    <p>{x.description}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="dialog-actions">
              <button className="btn secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="btn primary" onClick={create}>
                Create selected ({selected.length})
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
    [filter, setFilter] = useState("ALL");
  useEffect(() => {
    taskService.getMyTasks(user.id).then(setTs);
  }, [user]);
  if (!ts) return <Loading label="Loading your tasks…" />;
  const list = filter === "ALL" ? ts : ts.filter((t) => t.status === filter);
  return (
    <>
      <PageHeader eyebrow="Personal work" title="My tasks" />
      <div className="tabs">
        {["ALL", ...statusOptions].map((x) => (
          <button
            key={x}
            onClick={() => setFilter(x)}
            className={filter === x ? "active" : ""}
          >
            {x === "ALL" ? "All" : statusLabel(x)}
          </button>
        ))}
      </div>
      {list.length ? (
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
      ) : (
        <EmptyState title="No tasks match this filter" />
      )}
    </>
  );
}
function TaskDetails() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null),
    [cs, setCs] = useState([]),
    [comment, setComment] = useState(""),
    [ai, setAi] = useState(null);
  const nav = useNavigate();
  const load = () => {
    taskService.getTask(taskId).then(setTask);
    commentService.getComments(taskId).then(setCs);
  };
  useEffect(() => {
    load();
  }, [taskId]);
  if (!task) return <Loading label="Loading task…" />;
  const owner = users.find((u) => u.id === task.assigneeId),
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
    <>
      <button
        className="btn secondary"
        onClick={() => nav(`/projects/${task.projectId}/board`)}
      >
        <ArrowLeft size={15} /> Back to board
      </button>
      <div className="grid detail-layout" style={{ marginTop: 20 }}>
        <article className="panel">
          <div className="detail-title">
            <StatusBadge status={task.status} />
            <div>
              <span className="task-key">
                {task.taskKey} · {project?.name}
              </span>
              <h1>{task.title}</h1>
              <p>{task.description}</p>
            </div>
          </div>
          <section className="detail-section">
            <h3>Acceptance criteria</h3>
            <p style={{ fontSize: 13, color: "#647084" }}>
              {task.acceptanceCriteria || "No acceptance criteria yet."}
            </p>
          </section>
          <section className="detail-section">
            <div className="panel-head">
              <h3>Comments</h3>
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
                      <span>just now</span>
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
              <button className="btn primary">Send</button>
            </form>
          </section>
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
        <aside className="panel side-meta">
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
            <div>{task.dueDate}</div>
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
    </>
  );
}
function Notifications() {
  const [notes, setNotes] = useState(null);
  useEffect(() => {
    notificationService.getNotifications().then(setNotes);
  }, []);
  if (!notes) return <Loading />;
  return (
    <>
      <PageHeader eyebrow="Inbox" title="Notifications">
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
      <section className="panel" style={{ maxWidth: 800 }}>
        {notes.map((n) => (
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
    </>
  );
}
function AI() {
  const [result, setResult] = useState(null);
  return (
    <>
      <PageHeader eyebrow="DevSync AI" title="Daily standup" />
      <div className="panel" style={{ maxWidth: 850 }}>
        <p style={{ fontSize: 13, color: "#6d778b" }}>
          Generate a concise snapshot of the work your team has completed,
          planned and blocked.
        </p>
        <div className="toolbar">
          <select>
            {projects.map((p) => (
              <option key={p.id}>{p.name}</option>
            ))}
          </select>
          <select>
            <option>This week</option>
          </select>
          <button
            className="btn primary"
            onClick={async () => setResult(await aiService.generateStandup())}
          >
            <Sparkles size={15} /> Generate standup
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
    </>
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
  const [name, setName] = useState(user.name);
  return (
    <>
      <PageHeader eyebrow="Workspace" title="Settings" />
      <section className="panel" style={{ maxWidth: 620 }}>
        <h3>Profile</h3>
        <form
          className="form-grid"
          style={{ marginTop: 20 }}
          onSubmit={(e) => {
            e.preventDefault();
            updateUser({ ...user, name });
          }}
        >
          <label>
            Full name
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            Email
            <input value={user.email} disabled />
          </label>
          <div>
            <button className="btn primary">Save profile</button>
          </div>
        </form>
      </section>
    </>
  );
}
function SearchPage() {
  const [params] = useSearchParams(),
    q = params.get("q") || "",
    [res, setRes] = useState(null);
  useEffect(() => {
    if (q) searchService.search(q).then(setRes);
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
export default function App() {
  const [user, setUser] = useState(null),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    setUser(authService.getCurrentUser());
    setLoading(false);
  }, []);
  const value = {
    user,
    loading,
    login: async (...a) => setUser(await authService.login(...a)),
    register: async (d) => setUser(await authService.register(d)),
    logout: () => {
      authService.logout();
      setUser(null);
    },
    updateUser: (u) => {
      localStorage.setItem("devsync_mock_user", JSON.stringify(u));
      setUser(u);
    },
  };
  const page = (C) => (
    <Protected>
      <Shell>
        <C />
      </Shell>
    </Protected>
  );
  return (
    <Auth.Provider value={value}>
      <Routes>
        <Route path="/" element={<StitchLanding />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage register />} />
        <Route path="/dashboard" element={page(Dashboard)} />
        <Route path="/projects" element={page(Projects)} />
        <Route path="/projects/:projectId" element={page(ProjectLayout)} />
        <Route
          path="/projects/:projectId/board"
          element={page(() => (
            <ProjectLayout mode="board" />
          ))}
        />
        <Route
          path="/projects/:projectId/list"
          element={page(() => (
            <ProjectLayout mode="list" />
          ))}
        />
        <Route
          path="/projects/:projectId/members"
          element={page(() => (
            <ProjectLayout mode="members" />
          ))}
        />
        <Route
          path="/projects/:projectId/settings"
          element={page(() => (
            <ProjectLayout mode="settings" />
          ))}
        />
        <Route path="/tasks/:taskId" element={page(TaskDetails)} />
        <Route path="/my-tasks" element={page(MyTasks)} />
        <Route path="/notifications" element={page(Notifications)} />
        <Route path="/ai" element={page(AI)} />
        <Route path="/teams" element={page(Teams)} />
        <Route path="/settings" element={page(SettingsPage)} />
        <Route path="/search" element={page(SearchPage)} />
        <Route path="*" element={page(NotFound)} />
      </Routes>
    </Auth.Provider>
  );
}
