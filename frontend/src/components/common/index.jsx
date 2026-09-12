import { Link } from "react-router-dom";
import { TASK_STATUS, statusLabel } from "../../lib/constants";
import { users } from "../../mock";
export const Avatar = ({ id, size = "" }) => {
  const u = users.find((x) => x.id === id) || users[0];
  return (
    <span
      className={`avatar ${size}`}
      style={{ background: u.color }}
      title={u.name}
    >
      {u.name
        .split(" ")
        .map((x) => x[0])
        .join("")
        .slice(0, 2)}
    </span>
  );
};
export const StatusBadge = ({ status }) => (
  <span className={`badge status-${status}`}>{statusLabel(status)}</span>
);
export const PriorityBadge = ({ priority }) => (
  <span className={`badge priority-${priority}`}>{priority}</span>
);
export const EmptyState = ({ title = "Nothing here yet", action }) => (
  <div className="empty">
    <div className="empty-icon">◌</div>
    <h3>{title}</h3>
    <p>There’s nothing to show here right now.</p>
    {action}
  </div>
);
export const TaskCard = ({ task, compact = false }) => (
  <Link
    to={`/tasks/${task.id}`}
    className={`task-card ${compact ? "compact" : ""}`}
  >
    <div className="task-card-top">
      <span className="task-key">{task.taskKey}</span>
      <PriorityBadge priority={task.priority} />
    </div>
    <h4>{task.title}</h4>
    {!compact && <p>{task.description}</p>}
    <div className="task-card-bottom">
      <Avatar id={task.assigneeId} />
      <span>{task.dueDate}</span>
    </div>
  </Link>
);
export const ProjectCard = ({ project }) => (
  <Link className="project-card" to={`/projects/${project.id}`}>
    <div className="project-icon" style={{ background: project.color }}>
      {project.key}
    </div>
    <div className="project-card-head">
      <div>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
      </div>
      <span className="more">•••</span>
    </div>
    <div className="progress-line">
      <i style={{ width: `${project.progress}%`, background: project.color }} />
    </div>
    <div className="project-footer">
      <span>{project.progress}% complete</span>
      <span>Open project →</span>
    </div>
  </Link>
);
export const PageHeader = ({ eyebrow, title, children }) => (
  <div className="page-header">
    <div>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h1>{title}</h1>
    </div>
    <div className="header-actions">{children}</div>
  </div>
);
export const Loading = ({ label = "Loading…" }) => (
  <div className="loading">
    <i /> {label}
  </div>
);
export const StatCard = ({ label, value, sub, icon }) => (
  <div className="stat-card">
    <div>
      <p>{label}</p>
      <h2>{value}</h2>
      <span>{sub}</span>
    </div>
    <div className="stat-icon">{icon}</div>
  </div>
);
export const statusOptions = Object.values(TASK_STATUS);
