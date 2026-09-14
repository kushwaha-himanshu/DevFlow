import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  Copy,
  MoreHorizontal,
  Info,
  CheckCircle2,
  ListChecks,
  Plus,
  Circle,
  MessageSquare,
  Send,
  CalendarDays,
  Check,
  X,
} from "lucide-react";
import { taskService } from "../services/taskService";
import { commentService } from "../services/commentService";
import { aiService } from "../services/aiService";
import { users } from "../mock/users";
import { projects } from "../mock/projects";
import {
  StatusBadge,
  PriorityBadge,
  Avatar,
  Loading,
  EmptyState,
  statusOptions,
} from "../components/common";

export function TaskDetails() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [cs, setCs] = useState([]);
  const [comment, setComment] = useState("");
  const [ai, setAi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subtasks, setSubtasks] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [accepted, setAccepted] = useState([]);
  const [aiPanel, setAiPanel] = useState(false);
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

  const owner = users.find((u) => u.id === task.assigneeId) || users[0];
  const project = projects.find((p) => p.id === task.projectId);

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
                        <Avatar id={u?.id} />
                        <div className="comment-body">
                          <strong>{u?.name || "User"}</strong>
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

export default TaskDetails;
