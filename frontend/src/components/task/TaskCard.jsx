import { Link } from "react-router-dom";
import { Avatar, PriorityBadge } from "../common";

export function TaskCard({ task, compact = false }) {
  return (
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
}

export default TaskCard;
