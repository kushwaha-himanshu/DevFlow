export const TASK_STATUS = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  REVIEW: "REVIEW",
  DONE: "DONE",
};
export const PRIORITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
};
export const USER_ROLES = {
  OWNER: "OWNER",
  DEVELOPER: "DEVELOPER",
  VIEWER: "VIEWER",
};
export const statusLabel = (s) =>
  ({
    TODO: "To do",
    IN_PROGRESS: "In progress",
    REVIEW: "In review",
    DONE: "Done",
  })[s] || s;
