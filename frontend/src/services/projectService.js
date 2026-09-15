import api from "./api";

/**
 * Normalizes backend project data from MongoDB to ensure consistency
 * across existing UI components without altering their contracts.
 */
export const normalizeProject = (project) => {
  if (!project) return null;

  const id = project._id || project.id;
  const ownerId =
    typeof project.owner === "object"
      ? project.owner?._id || project.owner?.id
      : project.owner || project.ownerId;

  const rawMembers = Array.isArray(project.members) ? project.members : [];
  const memberIds = rawMembers.map((m) => {
    if (typeof m === "string") return m;
    if (m.user) {
      return typeof m.user === "object" ? m.user._id || m.user.id : m.user;
    }
    return m._id || m.id;
  });

  return {
    ...project,
    id,
    _id: id,
    name: project.name || "",
    key: project.key || "",
    description: project.description || "",
    ownerId,
    members: rawMembers,
    memberIds,
    color: project.color || "#6d5dfc",
    progress: project.progress ?? 0,
  };
};

export const getProjects = async () => {
  const response = await api.get("/projects");
  const list = response.data?.projects || response.data || [];
  return list.map(normalizeProject);
};

export const getProject = async (projectId) => {
  const response = await api.get(`/projects/${projectId}`);
  const project = response.data?.project || response.data;
  return normalizeProject(project);
};

export const createProject = async (projectData) => {
  const payload = {
    name: projectData.name?.trim(),
    description: projectData.description?.trim() || "",
  };
  if (projectData.key && projectData.key.trim()) {
    payload.key = projectData.key.toUpperCase().trim();
  }

  const response = await api.post("/projects", payload);
  const project = response.data?.project || response.data;
  return normalizeProject(project);
};

export const updateProject = async (projectId, projectData) => {
  const payload = {};
  if (projectData.name !== undefined) {
    payload.name = projectData.name.trim();
  }
  if (projectData.description !== undefined) {
    payload.description = projectData.description.trim();
  }
  if (projectData.key !== undefined) {
    payload.key = projectData.key.toUpperCase().trim();
  }

  const response = await api.put(`/projects/${projectId}`, payload);
  const project = response.data?.project || response.data;
  return normalizeProject(project);
};

export const addMember = async (projectId, memberData) => {
  const payload =
    typeof memberData === "string"
      ? { email: memberData.trim(), role: "DEVELOPER" }
      : {
          email: memberData.email?.trim(),
          role: memberData.role || "DEVELOPER",
        };

  const response = await api.post(`/projects/${projectId}/members`, payload);
  const project = response.data?.project || response.data;
  return normalizeProject(project);
};

export const removeMember = async (projectId, userId) => {
  const response = await api.delete(`/projects/${projectId}/members/${userId}`);
  const project = response.data?.project || response.data;
  return normalizeProject(project);
};

export const projectService = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  addMember,
  removeMember,
  normalizeProject,
};

export default projectService;
