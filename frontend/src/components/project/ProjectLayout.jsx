import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Code2,
  Pencil,
  MoreHorizontal,
  Plus,
  UsersRound,
  ListChecks,
  CheckCircle2,
  Gauge,
  History,
  ExternalLink,
  GitBranch,
  GitCommitHorizontal,
  GitMerge,
  MoreVertical,
  LockKeyhole,
  Cloud,
  Sparkles,
  Terminal,
  Eye,
  Mail,
  Search,
  Filter,
  ChevronDown,
  UserPlus,
  X,
  Info,
} from "lucide-react";
import { projects } from "../../mock/projects";
import { users } from "../../mock/users";
import { tasks } from "../../mock/tasks";
import { statusLabel } from "../../lib/constants";
import { projectService } from "../../services/projectService";
import { Avatar, EmptyState } from "../common";
import { ProjectTabs } from "./ProjectTabs";
import { Board } from "../board/Board";
import { TaskList } from "../board/TaskList";

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

function Members({ p }) {
  const [open, setOpen] = useState(false);
  const [ids, setIds] = useState(p.memberIds);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("ALL");
  const [memberRole, setMemberRole] = useState("DEVELOPER");

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

function ProjectSettingsContent({ p }) {
  const [data, setData] = useState({ ...p });
  const [saved, setSaved] = useState(false);

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

export function ProjectLayout({ mode = "overview" }) {
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
        <ProjectSettingsContent p={p} />
      )}
    </div>
  );
}

export { ProjectOverview, Members, ProjectSettingsContent };
export default ProjectLayout;
