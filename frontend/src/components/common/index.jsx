import { TASK_STATUS, statusLabel } from "../../lib/constants";
import { users } from "../../mock/users";
import { TaskCard } from "../task/TaskCard";
import { ProjectCard } from "../project/ProjectCard";

export const Avatar = ({ id, size = "" }) => {
  const u = users.find((x) => x.id === id) || users[0];
  return (
    <span
      className={`avatar ${size}`}
      style={{ background: u?.color || "#6d5dfc" }}
      title={u?.name || "User"}
    >
      {(u?.name || "User")
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

export { TaskCard, ProjectCard };
