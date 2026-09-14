import { useState } from "react";
import { Sparkles, ArrowRight, X } from "lucide-react";
import { aiService } from "../../services/aiService";
import { users } from "../../mock/users";
import { tasks } from "../../mock/tasks";

export function TaskDialog({ project, onClose, onCreate }) {
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

export default TaskDialog;
