import { projects } from "../mock/projects";

const pause = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 180));
const uid = (prefix) => `${prefix}-${Date.now()}`;

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
      visibility: data.visibility || "private",
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

export default projectService;
