import { useState, useEffect, useCallback } from "react";
import { taskService } from "../services/taskService";

export default function useTasks(projectId) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    const data = projectId
      ? await taskService.getProjectTasks(projectId)
      : [];
    setTasks(data);
    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      loadTasks();
    }
  }, [projectId, loadTasks]);

  return { tasks, loading, refresh: loadTasks };
}
