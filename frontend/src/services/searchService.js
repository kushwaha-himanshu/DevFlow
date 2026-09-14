import { tasks } from "../mock/tasks";
import { projects } from "../mock/projects";
import { users } from "../mock/users";

const pause = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 180));

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

export default searchService;
