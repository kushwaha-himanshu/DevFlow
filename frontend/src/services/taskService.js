import { tasks } from "../mock/tasks";

const pause = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 180));
const uid = (prefix) => `${prefix}-${Date.now()}`;

export const taskService = {
  getProjectTasks: (id) => pause(tasks.filter((t) => t.projectId === id)),
  getMyTasks: (userId) => pause(tasks.filter((t) => t.assigneeId === userId)),
  getTask: (id) => pause(tasks.find((t) => t.id === id)),
  createTask: async (data) => {
    const t = {
      id: uid("task"),
      taskKey: `DEV-${40 + tasks.length}`,
      status: "TODO",
      priority: "MEDIUM",
      assigneeId: "user-1",
      createdById: "user-1",
      dueDate: "2026-09-30",
      labels: [],
      description: "",
      acceptanceCriteria: "",
      createdAt: "2026-09-12",
      updatedAt: "2026-09-12",
      ...data,
    };
    tasks.unshift(t);
    return pause(t);
  },
  updateTask: async (id, data) => {
    const t = tasks.find((x) => x.id === id);
    Object.assign(t, data, { updatedAt: "2026-09-12" });
    return pause(t);
  },
  getSubtasks: (id) => pause(tasks.filter((t) => t.parentTaskId === id)),
};

export default taskService;
