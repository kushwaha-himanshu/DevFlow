import { users, projects, tasks, comments, notifications } from "../mock/data";
const pause = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 180));
const uid = (prefix) => `${prefix}-${Date.now()}`;
export const authService = {
  getCurrentUser: () =>
    JSON.parse(localStorage.getItem("devsync_mock_user") || "null"),
  login: async (email, password) => {
    if (email === "himanshu@example.com" && password === "password123") {
      localStorage.setItem("devsync_mock_user", JSON.stringify(users[0]));
      return pause(users[0]);
    }
    throw new Error("Use the demo credentials to sign in.");
  },
  register: async ({ name, email }) => {
    const u = { ...users[0], name: name || "New developer", email };
    localStorage.setItem("devsync_mock_user", JSON.stringify(u));
    return pause(u);
  },
  logout: () => localStorage.removeItem("devsync_mock_user"),
};
export const projectService = {
  getProjects: () => pause(projects),
  getProject: (id) => pause(projects.find((p) => p.id === id)),
  createProject: async (data) => {
    const p = {
      id: uid("project"),
      key: data.key || data.name.slice(0, 3).toUpperCase(),
      description: data.description || "",
      name: data.name,
      ownerId: "user-1",
      memberIds: ["user-1"],
      progress: 0,
      color: "#6d5dfc",
    };
    projects.unshift(p);
    return pause(p);
  },
  updateProject: async (id, data) => {
    const p = projects.find((x) => x.id === id);
    Object.assign(p, data);
    return pause(p);
  },
  addMember: async (id, userId) => {
    const p = projects.find((x) => x.id === id);
    if (!p.memberIds.includes(userId)) p.memberIds.push(userId);
    return pause(p);
  },
};
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
export const commentService = {
  getComments: (taskId) => pause(comments.filter((c) => c.taskId === taskId)),
  createComment: async (data) => {
    const c = {
      id: uid("comment"),
      createdAt: new Date().toISOString(),
      ...data,
    };
    comments.push(c);
    return pause(c);
  },
};
export const notificationService = {
  getNotifications: () => pause(notifications),
  markAsRead: (id) => {
    const n = notifications.find((n) => n.id === id);
    if (n) n.read = true;
    return pause(n);
  },
  markAllAsRead: () => {
    notifications.forEach((n) => (n.read = true));
    return pause(notifications);
  },
};
export const aiService = {
  divideTask: () =>
    pause([
      {
        title: "Create Login API",
        description: "Build JWT login endpoint",
        priority: "HIGH",
      },
      {
        title: "Create Registration API",
        description: "Build registration endpoint",
        priority: "HIGH",
      },
      {
        title: "Implement JWT Middleware",
        description: "Protect authenticated routes",
        priority: "HIGH",
      },
    ]),
  generateTaskDetails: () =>
    pause({
      description:
        "A focused implementation plan with secure, reviewable behaviour.",
      criteria: "Handle validation, errors and success states.",
      priority: "HIGH",
    }),
  generateStandup: () =>
    pause({
      yesterday: ["Completed Login API", "Fixed JWT validation"],
      today: ["Authentication UI", "Unit tests"],
      blocked: ["Waiting for API review"],
    }),
};
export const searchService = {
  search: async (q) =>
    pause({
      tasks: tasks.filter((x) =>
        (x.title + x.taskKey).toLowerCase().includes(q.toLowerCase()),
      ),
      projects: projects.filter((x) =>
        x.name.toLowerCase().includes(q.toLowerCase()),
      ),
      users: users.filter((x) =>
        x.name.toLowerCase().includes(q.toLowerCase()),
      ),
    }),
};
