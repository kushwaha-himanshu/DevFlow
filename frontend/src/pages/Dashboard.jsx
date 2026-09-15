import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Folder,
  ClipboardList,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { projectService } from "../services/projectService";
import { tasks } from "../mock/tasks";
import {
  PageHeader,
  StatCard,
  Loading,
  StatusBadge,
  Avatar,
  EmptyState,
} from "../components/common";
import { TaskCard } from "../components/task/TaskCard";

export function Dashboard() {
  const [ps, setPs] = useState(null);

  useEffect(() => {
    projectService
      .getProjects()
      .then(setPs)
      .catch(() => setPs([]));
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

export default Dashboard;
