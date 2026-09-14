import { useState, useEffect } from "react";
import { Search, UsersRound, Sparkles, Plus } from "lucide-react";
import { taskService } from "../../services/taskService";
import { useAuth } from "../../context/AuthContext";
import { statusOptions } from "../common";
import { statusLabel } from "../../lib/constants";
import { TaskCard } from "../task/TaskCard";
import { TaskDialog } from "../task/TaskDialog";
import { AIBreakdown } from "../ai/AIBreakdown";

export function Board({ p }) {
  const [ts, setTs] = useState([]);
  const [create, setCreate] = useState(false);
  const [ai, setAi] = useState(false);
  const [query, setQuery] = useState("");
  const [mineOnly, setMineOnly] = useState(false);
  const [highPriority, setHighPriority] = useState(false);
  const [sort, setSort] = useState("priority");
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
    .filter((task) => !mineOnly || task.assigneeId === user?.id)
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

export default Board;
