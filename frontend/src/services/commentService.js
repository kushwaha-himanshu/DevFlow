import { comments } from "../mock/comments";

const pause = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 180));
const uid = (prefix) => `${prefix}-${Date.now()}`;

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

export default commentService;
