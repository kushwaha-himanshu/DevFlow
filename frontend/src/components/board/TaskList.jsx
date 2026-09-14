import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { taskService } from "../../services/taskService";
import { users } from "../../mock/users";
import { StatusBadge, PriorityBadge, Avatar } from "../common";

export function TaskList({ p }) {
  const [ts, setTs] = useState([]);

  useEffect(() => {
    taskService.getProjectTasks(p.id).then(setTs);
  }, [p.id]);

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Assignee</th>
            <th>Due date</th>
          </tr>
        </thead>
        <tbody>
          {ts.map((t) => (
            <tr key={t.id}>
              <td>
                <Link className="task-title" to={`/tasks/${t.id}`}>
                  {t.taskKey} · {t.title}
                </Link>
              </td>
              <td>
                <StatusBadge status={t.status} />
              </td>
              <td>
                <PriorityBadge priority={t.priority} />
              </td>
              <td>
                <div className="assignee">
                  <Avatar id={t.assigneeId} />
                  {users.find((u) => u.id === t.assigneeId)?.name ||
                    "Unknown member"}
                </div>
              </td>
              <td>{t.dueDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskList;
