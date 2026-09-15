import { useState, useEffect } from "react";
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
import { useAuth } from "../../context/AuthContext";
import { users } from "../../mock/users";
import { tasks } from "../../mock/tasks";
import { statusLabel } from "../../lib/constants";
import { projectService } from "../../services/projectService";
import { Avatar, EmptyState, Loading } from "../common";
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
  const { user } = useAuth();
  const currentUserId = user?.id || user?._id;

  const ts = tasks.filter((t) => t.projectId === p.id);
  const completed = ts.filter((t) => t.status === "DONE").length;

  const members = (p.members || []).map((m) => {
    const uId = typeof m.user === "object" ? m.user?._id || m.user?.id : m.user;
    const foundUser = users.find((u) => u.id === uId || u._id === uId);
    const isMe = currentUserId === uId;
    return {
      id: uId,
      name:
        (typeof m.user === "object" && (m.user.fullname || m.user.name)) ||
        (isMe ? user?.name : foundUser?.name) ||
        (m.role === "OWNER" ? "Project Owner" : "Team Member"),
      email:
        (typeof m.user === "object" && m.user.email) ||
        (isMe ? user?.email : foundUser?.email) ||
        "",
      role: m.role || "DEVELOPER",
    };
  });

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
              <History size={14} /> Updated recently
            </span>
          </div>
          <span className="project-section-label">Description</span>
          <p className="project-description">
            {p.description || "No description provided."} A modern workspace for real-time collaboration,
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
              <span>github.com/devsync/{p.key?.toLowerCase()}-platform</span>
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
          <ProjectDetail
            label="Created By"
            value={
              p.ownerId === currentUserId
                ? user?.name || "You"
                : users.find((u) => u.id === p.ownerId)?.name || "Project Owner"
            }
          />
          <ProjectDetail
            label="Created Date"
            value={
              p.createdAt
                ? new Date(p.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Jan 14, 2025"
            }
          />
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

function Members({ p, onProjectUpdate }) {
  const { user } = useAuth();
  const currentUserId = user?.id || user?._id;
  const isOwner =
    p.ownerId === currentUserId ||
    (p.members || []).some(
      (m) =>
        (m.user?._id || m.user) === currentUserId && m.role === "OWNER",
    );

  const [open, setOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("ALL");
  const [memberRole, setMemberRole] = useState("DEVELOPER");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogError, setDialogError] = useState(null);
  const [actionError, setActionError] = useState(null);

  const handleAdd = async (emailToAdd) => {
    const email = (emailToAdd || inviteEmail || "").trim();
    if (!email) {
      setDialogError("Please enter a valid user email.");
      return;
    }

    try {
      setIsSubmitting(true);
      setDialogError(null);
      setActionError(null);
      const updated = await projectService.addMember(p.id, {
        email,
        role: memberRole,
      });
      onProjectUpdate?.(updated);
      setOpen(false);
      setInviteEmail("");
    } catch (err) {
      setDialogError(
        err.response?.data?.message ||
          err.message ||
          "Failed to add member to project.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (targetUserId) => {
    try {
      setActionError(null);
      const updated = await projectService.removeMember(p.id, targetUserId);
      onProjectUpdate?.(updated);
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          err.message ||
          "Failed to remove member.",
      );
    }
  };

  const memberList = (p.members || []).map((m) => {
    const uId = typeof m.user === "object" ? m.user?._id || m.user?.id : m.user;
    const foundUser = users.find((u) => u.id === uId || u._id === uId);
    const isMe = currentUserId === uId;
    return {
      id: uId,
      name:
        (typeof m.user === "object" && (m.user.fullname || m.user.name)) ||
        (isMe ? user?.name : foundUser?.name) ||
        (m.role === "OWNER" ? "Project Owner" : `User (${String(uId).slice(-4)})`),
      email:
        (typeof m.user === "object" && m.user.email) ||
        (isMe ? user?.email : foundUser?.email) ||
        "",
      role: m.role || "DEVELOPER",
      isOwner: m.role === "OWNER" || uId === p.ownerId,
    };
  });

  const filteredMembers = memberList
    .filter((m) => role === "ALL" || m.role === role)
    .filter((m) =>
      `${m.name} ${m.email} ${m.role}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );

  const developers = memberList.filter((m) => m.role === "DEVELOPER").length;
  const viewers = memberList.filter((m) => m.role === "VIEWER").length;

  return (
    <div className="team-management-page">
      <div className="team-management-header">
        <div>
          <span className="eyebrow">Project access</span>
          <h2>Team Members</h2>
          <p>Manage members, roles, and access for this project repository.</p>
        </div>
      </div>
      {actionError && (
        <div
          className="projects-notice"
          role="alert"
          style={{ color: "#d92d20", background: "#fef3f2", marginBottom: 16 }}
        >
          {actionError}
        </div>
      )}
      <div className="team-summary-grid">
        <MemberSummary
          label="Total Members"
          value={memberList.length}
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
        {isOwner && (
          <button className="btn primary" onClick={() => setOpen(true)}>
            <UserPlus size={16} /> Add Member
          </button>
        )}
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
            {filteredMembers.map((u) => {
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
                  <td className="team-email">{u.email || "—"}</td>
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
                      className={`team-status ${u.id === currentUserId ? "online" : ""}`}
                    >
                      <i />
                      {u.id === currentUserId ? "Active now" : "Active recently"}
                    </span>
                  </td>
                  <td className="team-actions-cell">
                    {u.isOwner ? (
                      <span
                        className="badge priority-LOW"
                        style={{ fontSize: 11, padding: "3px 8px" }}
                      >
                        Owner
                      </span>
                    ) : isOwner ? (
                      <button
                        className="btn secondary"
                        style={{
                          color: "#d92d20",
                          fontSize: 12,
                          padding: "4px 10px",
                        }}
                        type="button"
                        onClick={() => handleRemove(u.id)}
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        className="team-more"
                        type="button"
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
      {!filteredMembers.length && (
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
                disabled={isSubmitting}
              >
                <X size={18} />
              </button>
            </div>

            {dialogError && (
              <div
                className="dialog-error"
                role="alert"
                style={{
                  color: "#d92d20",
                  fontSize: 13,
                  background: "#fef3f2",
                  border: "1px solid #fee4e2",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  margin: "12px 0",
                }}
              >
                {dialogError}
              </div>
            )}

            <label className="add-member-label">
              Member Email <small>Registered user email address</small>
            </label>
            <div className="add-member-search">
              <Mail size={17} />
              <input
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter member email (e.g. user@example.com)..."
                disabled={isSubmitting}
              />
              <span>DevSync</span>
            </div>
            <label className="add-member-label">Project Scope &amp; Role</label>
            <div className="member-role-options">
              <label className={memberRole === "DEVELOPER" ? "selected" : ""}>
                <input
                  type="radio"
                  name="member-role"
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn primary"
                disabled={isSubmitting}
                onClick={() => handleAdd()}
              >
                <UserPlus size={15} /> {isSubmitting ? "Adding…" : "Add Member"}
              </button>
            </div>
            <div className="project-list add-member-list">
              {users
                .filter(
                  (u) =>
                    !memberList.some(
                      (m) => m.id === u.id || m.email === u.email,
                    ),
                )
                .map((u) => (
                  <button
                    className="project-row"
                    style={{ border: 0, background: "#fff", textAlign: "left" }}
                    key={u.id}
                    disabled={isSubmitting}
                    onClick={() => handleAdd(u.email)}
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

function ProjectSettingsContent({ p, onProjectUpdate }) {
  const [data, setData] = useState({
    name: p.name || "",
    description: p.description || "",
    key: p.key || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setData({
      name: p.name || "",
      description: p.description || "",
      key: p.key || "",
    });
  }, [p]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSaved(false);
      const updated = await projectService.updateProject(p.id, {
        name: data.name,
        description: data.description,
        key: data.key,
      });
      setSaved(true);
      onProjectUpdate?.(updated);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update project settings.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="panel" style={{ maxWidth: 660 }}>
      <h3>Project settings</h3>
      <p style={{ fontSize: 12, color: "#798397" }}>
        Update project details and general settings.
      </p>

      {error && (
        <div
          className="projects-notice"
          role="alert"
          style={{ color: "#d92d20", background: "#fef3f2", marginBottom: 16 }}
        >
          {error}
        </div>
      )}

      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Project name
          <input
            required
            value={data.name}
            disabled={saving}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
        </label>
        <label>
          Description
          <textarea
            value={data.description}
            disabled={saving}
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />
        </label>
        <label>
          Project key
          <input
            required
            value={data.key}
            disabled={saving}
            onChange={(e) => setData({ ...data, key: e.target.value })}
          />
        </label>
        {saved && (
          <small style={{ color: "#168257" }}>
            Project updated successfully.
          </small>
        )}
        <div>
          <button className="btn primary" disabled={saving}>
            {saving ? "Saving changes…" : "Save changes"}
          </button>
        </div>
      </form>
      <hr
        style={{ border: 0, borderTop: "1px solid #eee", margin: "28px 0" }}
      />
      <h3 style={{ color: "#b42318" }}>Danger zone</h3>
      <p style={{ fontSize: 12, color: "#798397" }}>
        Project deletion is managed by workspace administrators.
      </p>
    </div>
  );
}

export function ProjectLayout({ mode = "overview" }) {
  const { projectId } = useParams();
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await projectService.getProject(projectId);
        if (isMounted) setP(data);
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load project",
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  if (loading) {
    return <Loading label="Loading project…" />;
  }

  if (error || !p) {
    const isForbidden = error === "You are not a member of this project";
    return (
      <EmptyState
        title={isForbidden ? "Access Denied" : "Project not found"}
        subtitle={
          isForbidden
            ? "You don't have permission to view this project."
            : error || "The requested project could not be found."
        }
      />
    );
  }

  const handleProjectUpdate = (updatedProject) => {
    setP(updatedProject);
  };

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
        <Members p={p} onProjectUpdate={handleProjectUpdate} />
      ) : (
        <ProjectSettingsContent
          p={p}
          onProjectUpdate={handleProjectUpdate}
        />
      )}
    </div>
  );
}

export { ProjectOverview, Members, ProjectSettingsContent };
export default ProjectLayout;
