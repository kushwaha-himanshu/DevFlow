import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { List, KanbanSquare, Plus, Search } from "lucide-react";
import { taskService } from "../services/taskService";
import { projects } from "../mock/projects";
import { useAuth } from "../context/AuthContext";
import {
  PageHeader,
  Loading,
  EmptyState,
  StatusBadge,
  statusOptions,
} from "../components/common";
import { statusLabel } from "../lib/constants";
import { TaskCard } from "../components/task/TaskCard";

export function MyTasks() {
  const { user } = useAuth();
  const [ts, setTs] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const [view, setView] = useState("list");

  useEffect(() => {
    if (user?.id) {
      taskService.getMyTasks(user.id).then(setTs);
    }
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

export default MyTasks;
