const pause = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 180));

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

export default aiService;
