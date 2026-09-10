# DevFlow — Complete Full Service Documentation

This document covers the complete service/module architecture for:

1. Backend
2. React Web Frontend
3. VS Code Extension
4. Real-time communication
5. AI integration
6. Git integration
7. Feature-wise responsibilities
8. Data flow between all layers

---

# 1. DevFlow Architecture

```text
                         DEVFLOW
                            │
              ┌─────────────┴─────────────┐
              │                           │
          React Web                VS Code Extension
        Main Platform                Productivity Tool
              │                           │
              └─────────────┬─────────────┘
                            │
                     REST API + Socket.IO
                            │
                            ▼
                   Node.js + Express
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
   Controllers          Services          Socket Layer
        │                   │                   │
        ▼                   ▼                   ▼
   Validation       Business Logic       Real-Time Events
                            │
                            ▼
                      Repositories
                            │
                            ▼
                         MongoDB
                            │
                  ┌─────────┴─────────┐
                  │                   │
               AI API            Git/GitHub
```

---

# 2. Complete Repository Structure

```text
devflow/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── constants/
│   │   └── App.jsx
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── services/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── socket/
│   │   └── server.js
│   └── package.json
│
├── extension/
│   ├── src/
│   │   ├── ExtensionManager.js
│   │   ├── APIClient.js
│   │   ├── AuthService.js
│   │   ├── TaskService.js
│   │   ├── NotificationManager.js
│   │   ├── GitService.js
│   │   ├── SocketClient.js
│   │   ├── TaskProvider.js
│   │   ├── NotificationProvider.js
│   │   ├── WebviewManager.js
│   │   └── commands/
│   │       ├── LoginCommand.js
│   │       ├── CreateTaskCommand.js
│   │       ├── UpdateTaskCommand.js
│   │       ├── CreateBugCommand.js
│   │       └── CreateBranchCommand.js
│   ├── extension.js
│   └── package.json
│
├── docs/
│   ├── architecture.md
│   ├── api.md
│   ├── database.md
│   └── services.md
│
├── README.md
└── .gitignore
```

---

# 3. Backend Service Layer

The backend follows:

```text
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
MongoDB
```

## Backend Services

```text
AuthService
ProjectService
TaskService
CommentService
NotificationService
AIService
StandupService
GitService
```

---

# 4. AuthService

## Responsibility

```text
Register
Login
Password hashing
Password verification
JWT generation
Get current user
```

## Main methods

```text
register()
login()
getCurrentUser()
```

## Flow

```text
Register
  ↓
Validate input
  ↓
Check email
  ↓
Hash password
  ↓
Save User
```

Login:

```text
Email + Password
       ↓
Find User
       ↓
Compare Password
       ↓
Generate JWT
       ↓
Return Token
```

---

# 5. ProjectService

## Responsibility

```text
Create project
Update project
Delete project
Get projects
Get project details
Add member
Remove member
```

## Main methods

```text
createProject()
getProjects()
getProject()
updateProject()
deleteProject()
addMember()
removeMember()
```

## Permission model

```text
OWNER
 ├── Create
 ├── Update
 ├── Delete
 └── Manage Members

DEVELOPER
 ├── View
 └── Work on tasks

VIEWER
 └── Read-only
```

---

# 6. TaskService

This is the central backend service.

## Responsibility

```text
Create task
Update task
Delete task
Assign task
Change status
Change priority
Create subtasks
Get project tasks
Get user's tasks
```

## Main methods

```text
createTask()
getTask()
getProjectTasks()
getMyTasks()
updateTask()
deleteTask()
createSubtask()
getSubtasks()
```

## Task lifecycle

```text
TODO
  ↓
IN_PROGRESS
  ↓
REVIEW
  ↓
DONE
```

## Task creation flow

```text
Task Request
      ↓
Validate Project
      ↓
Validate Assignee
      ↓
Generate Task Key
      ↓
Save Task
      ↓
NotificationService
      ↓
SocketService
```

---

# 7. CommentService

## Responsibility

```text
Create comment
Get comments
Delete comment
Mention users
```

## Flow

```text
Comment Request
      ↓
Validate Task
      ↓
Save Comment
      ↓
NotificationService
      ↓
SocketService
```

---

# 8. NotificationService

## Notification types

```text
TASK_ASSIGNED
TASK_UPDATED
COMMENT_ADDED
MENTION
TASK_COMPLETED
MEMBER_ADDED
```

## Methods

```text
createNotification()
getUserNotifications()
markAsRead()
markAllAsRead()
```

## Flow

```text
Business Action
      ↓
NotificationService
      ↓
NotificationRepository
      ↓
MongoDB

        +

SocketService
      ↓
User's browser / VS Code
```

---

# 9. AIService

## Responsibility

This service is the only layer that communicates with the LLM provider.

## Methods

```text
divideTask()
generateTaskDetails()
generateStandup()
```

## Never do this

```text
React → LLM API
VS Code → LLM API
```

## Correct architecture

```text
React / VS Code
       ↓
Backend API
       ↓
AIService
       ↓
LLM Provider
```

This keeps API keys private.

---

# 10. StandupService

## Responsibility

Collect real project activity and prepare it for AI.

## Data collected

```text
Completed tasks
In-progress tasks
Blocked tasks
Recent comments
Recent activity
```

## Flow

```text
StandupService
     │
     ├── TaskRepository
     ├── CommentRepository
     └── Activity data
              ↓
          AIService
              ↓
             LLM
```

---

# 11. GitService

## Responsibility

```text
Create branch name
Get branch information
Get repository status
```

For the MVP, local Git operations are primarily performed by the VS Code extension.

Example:

```text
DEV-42 Build Login API
        ↓
feature/DEV-42-build-login-api
```

---

# 12. Backend Repositories

Repositories hide MongoDB operations.

```text
UserRepository
ProjectRepository
TaskRepository
CommentRepository
NotificationRepository
```

Each repository performs operations such as:

```text
create()
findById()
findMany()
update()
delete()
```

Services should not contain raw database queries when repository abstraction is being used.

---

# 13. React Frontend Architecture

The frontend is the **main DevFlow platform**.

```text
React
 │
 ├── Pages
 │
 ├── Components
 │
 ├── Context
 │
 ├── Hooks
 │
 ├── Services
 │
 └── Utils
       │
       ▼
     Axios
       │
       ▼
   Backend API
```

---

# 14. React Frontend Folder Structure

```text
client/src/
│
├── components/
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── ProjectCard.jsx
│   ├── TeamMembers.jsx
│   ├── TaskCard.jsx
│   ├── TaskModal.jsx
│   ├── TaskDetails.jsx
│   ├── KanbanBoard.jsx
│   ├── KanbanColumn.jsx
│   ├── CommentSection.jsx
│   ├── NotificationPanel.jsx
│   ├── AIDividerModal.jsx
│   ├── AITaskDetails.jsx
│   └── StandupCard.jsx
│
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Projects.jsx
│   ├── Project.jsx
│   ├── Board.jsx
│   ├── MyTasks.jsx
│   └── Task.jsx
│
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── projectService.js
│   ├── taskService.js
│   ├── commentService.js
│   ├── notificationService.js
│   ├── aiService.js
│   └── socketService.js
│
├── context/
│   ├── AuthContext.jsx
│   └── ProjectContext.jsx
│
├── hooks/
│   ├── useAuth.js
│   ├── useTasks.js
│   ├── useSocket.js
│   └── useNotifications.js
│
├── utils/
│   ├── formatDate.js
│   ├── taskHelpers.js
│   └── validation.js
│
└── App.jsx
```

---

# 15. Frontend API Service

Create one Axios client.

```javascript
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

export default api;
```

Attach JWT through an interceptor.

```javascript
api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});
```

The rest of the frontend services reuse this client.

---

# 16. Frontend AuthService

## File

```text
client/src/services/authService.js
```

## Responsibilities

```text
Register
Login
Get current user
Logout
```

## Methods

```text
register()
login()
getMe()
logout()
```

Example:

```javascript
import api from "./api";

export const register = (data) => {
    return api.post("/auth/register", data);
};

export const login = (data) => {
    return api.post("/auth/login", data);
};

export const getMe = () => {
    return api.get("/auth/me");
};
```

---

# 17. AuthContext

Authentication is shared by many React components.

## Responsibility

```text
Current user
Login state
Loading state
Login function
Logout function
```

Example structure:

```javascript
const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // authentication logic

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
```

---

# 18. ProjectService — Frontend

## File

```text
client/src/services/projectService.js
```

## Methods

```text
createProject()
getProjects()
getProject()
updateProject()
deleteProject()
addMember()
removeMember()
```

Example:

```javascript
import api from "./api";

export const getProjects = () => {
    return api.get("/projects");
};

export const createProject = (data) => {
    return api.post("/projects", data);
};

export const getProject = (id) => {
    return api.get(`/projects/${id}`);
};
```

---

# 19. TaskService — Frontend

## File

```text
client/src/services/taskService.js
```

## Methods

```text
createTask()
getTasks()
getTask()
updateTask()
deleteTask()
getMyTasks()
createSubtask()
```

Example:

```javascript
export const createTask = (data) => {
    return api.post("/tasks", data);
};

export const updateTask = (id, data) => {
    return api.put(`/tasks/${id}`, data);
};

export const getProjectTasks = (projectId) => {
    return api.get(`/tasks/project/${projectId}`);
};
```

---

# 20. Task UI Architecture

Task-related React components:

```text
TaskCard
   ↓
TaskModal
   ↓
TaskDetails
   ↓
CommentSection
   ↓
Subtasks
```

Task card example:

```text
┌─────────────────────────────┐
│ DEV-42                      │
│ Build Login API             │
│                             │
│ HIGH        Rahul           │
│ IN_PROGRESS                 │
└─────────────────────────────┘
```

---

# 21. KanbanBoard Component

## Responsibility

Display tasks grouped by status.

```text
KanbanBoard
 │
 ├── Todo Column
 ├── In Progress Column
 ├── Review Column
 └── Done Column
```

Data grouping:

```javascript
const todo = tasks.filter(
    task => task.status === "TODO"
);
```

When status changes:

```text
Drag / Button
     ↓
taskService.updateTask()
     ↓
Backend
     ↓
Socket event
     ↓
Update local state
```

---

# 22. useTasks Hook

Instead of putting task-fetching code in every component, create:

```text
useTasks()
```

Responsibilities:

```text
Load tasks
Create task
Update task
Delete task
Manage loading state
Manage errors
```

Example:

```javascript
function useTasks(projectId) {

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    // fetch tasks
    // create/update/delete helpers

    return {
        tasks,
        loading
    };
}
```

---

# 23. CommentService — Frontend

## Responsibilities

```text
Get comments
Add comment
Delete comment
```

Methods:

```text
getComments(taskId)
createComment(taskId, content)
deleteComment(commentId)
```

UI:

```text
Task
 │
 └── Comments
       │
       ├── Rahul: API completed
       ├── Himanshu: Please add tests
       └── Rahul: Tests added
```

---

# 24. NotificationService — Frontend

## Responsibilities

```text
Load notifications
Mark notification read
Mark all read
```

Methods:

```text
getNotifications()
markAsRead()
markAllAsRead()
```

UI:

```text
🔔 3

Notifications
────────────────
DEV-42 assigned to you
New comment on DEV-45
DEV-39 completed
```

---

# 25. Frontend SocketService

## Purpose

Maintain Socket.IO connection from React.

```text
client/src/services/socketService.js
```

Connection:

```javascript
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL, {
    autoConnect: false
});

export default socket;
```

## Events

```text
taskCreated
taskUpdated
taskDeleted
commentAdded
notification
memberAdded
```

---

# 26. useSocket Hook

Responsible for subscribing/unsubscribing from events.

Example:

```javascript
useEffect(() => {

    socket.on("taskUpdated", handleTaskUpdated);

    return () => {
        socket.off("taskUpdated", handleTaskUpdated);
    };

}, []);
```

This prevents duplicated event listeners.

---

# 27. Real-Time Frontend Data Flow

When Rahul changes a task:

```text
VS Code / Web
      ↓
PUT /api/tasks/:id
      ↓
TaskService
      ↓
MongoDB
      ↓
Socket.IO
      ↓
taskUpdated
      ↓
Other React clients
      ↓
State update
      ↓
UI changes
```

No page refresh is required.

---

# 28. AIService — Frontend

The frontend AI service does NOT call an LLM directly.

It only calls backend AI endpoints.

Methods:

```text
divideTask()
generateTaskDetails()
generateStandup()
```

Example:

```javascript
export const divideTask = (data) => {
    return api.post("/ai/divide-task", data);
};

export const generateTaskDetails = (data) => {
    return api.post("/ai/task-details", data);
};

export const generateStandup = (data) => {
    return api.post("/ai/standup", data);
};
```

---

# 29. AIDividerModal

## Responsibility

Show AI-generated subtasks and let the user approve them.

UI:

```text
AI Task Divider

Requirement:
Build Authentication System

Suggestions:

☑ Create Login API
☑ Create Registration API
☑ JWT Middleware
☐ Login UI
☑ Authentication Tests

[Create Selected Tasks]
```

Actions:

```text
Edit
Delete
Select
Deselect
Add
Assign
```

AI never automatically creates tasks.

---

# 30. AI Task Details UI

Task page:

```text
DEV-42
Build Login API

[✨ Generate Details]
```

AI returns:

```text
Description
...

Acceptance Criteria
✓ Validate credentials
✓ Generate JWT
✓ Handle invalid credentials

Priority
HIGH

[Apply]
```

---

# 31. AI Standup UI

Dashboard button:

```text
[Generate Daily Standup]
```

Output:

```text
Yesterday
• Login API completed
• JWT validation fixed

Today
• Authentication UI

Blocked
• Waiting for API review
```

The information comes from real project activity.

---

# 32. React Pages

## Login

Responsibilities:

```text
Input email
Input password
Call authService.login()
Save auth state
Navigate to dashboard
```

## Register

```text
Name
Email
Password
Confirm password
```

## Dashboard

Show:

```text
Projects
My Tasks
Recent Activity
Notifications
Standup
```

## Projects

Show:

```text
Project cards
Create project
```

## Project

Show:

```text
Project information
Team
Task count
Recent tasks
```

## Board

Show:

```text
Kanban columns
Task cards
Filters
```

## My Tasks

Show:

```text
Tasks assigned to current user
```

## Task

Show:

```text
Task details
Description
Status
Priority
Assignee
Comments
Subtasks
AI actions
```

---

# 33. VS Code Extension Architecture

VS Code is a **companion**, not the complete product.

```text
VS Code
   │
   ├── ExtensionManager
   ├── APIClient
   ├── AuthService
   ├── TaskService
   ├── SocketClient
   ├── TaskProvider
   ├── NotificationManager
   └── GitService
           │
           ▼
      DevFlow Backend
```

---

# 34. VS Code Folder Structure

```text
extension/
│
├── src/
│   ├── ExtensionManager.js
│   ├── APIClient.js
│   ├── AuthService.js
│   ├── TaskService.js
│   ├── NotificationManager.js
│   ├── SocketClient.js
│   ├── GitService.js
│   ├── TaskProvider.js
│   ├── NotificationProvider.js
│   ├── WebviewManager.js
│   │
│   └── commands/
│       ├── LoginCommand.js
│       ├── LogoutCommand.js
│       ├── CreateTaskCommand.js
│       ├── UpdateTaskCommand.js
│       ├── CreateBugCommand.js
│       └── CreateBranchCommand.js
│
├── extension.js
└── package.json
```

---

# 35. ExtensionManager

## Responsibility

Acts as the extension entry point/orchestrator.

When VS Code starts:

```text
ExtensionManager
      ↓
Initialize APIClient
      ↓
Initialize AuthService
      ↓
Initialize TaskService
      ↓
Initialize SocketClient
      ↓
Register commands
      ↓
Register sidebar providers
      ↓
Start extension
```

Example:

```javascript
class ExtensionManager {

    constructor(context) {
        this.context = context;
    }

    initialize() {
        // initialize services
    }
}
```

This is a good example of **composition**.

---

# 36. VS Code APIClient

## Responsibility

Central HTTP communication layer.

```text
APIClient
   ↓
Backend REST API
```

Methods:

```text
get()
post()
put()
delete()
```

Example:

```javascript
class APIClient {

    constructor(baseURL, token) {
        this.baseURL = baseURL;
        this.token = token;
    }

    async get(path) {
        // HTTP GET
    }

    async post(path, data) {
        // HTTP POST
    }
}
```

Every extension service can reuse it.

---

# 37. VS Code AuthService

## Responsibility

```text
Login
Logout
Token storage
Session restoration
```

## Secure storage

Use:

```text
context.secrets
```

Do NOT store JWT in:

```text
settings.json
plain text files
package.json
```

Flow:

```text
VS Code
 ↓
Login UI
 ↓
POST /api/auth/login
 ↓
JWT
 ↓
VS Code SecretStorage
```

---

# 38. VS Code TaskService

## Responsibility

The extension version of TaskService talks to backend APIs.

Methods:

```text
getMyTasks()
getTask()
updateTask()
createTask()
createBug()
```

Example:

```text
TaskService
     ↓
APIClient
     ↓
GET /api/tasks/my-tasks
```

The business truth remains on the backend.

---

# 39. TaskProvider

VS Code Tree View needs a provider.

Responsibilities:

```text
Load tasks
Convert tasks to TreeItems
Refresh tasks
Show task labels
```

Example display:

```text
DEVFLOW

My Tasks
│
├── 🔴 DEV-42 Fix Authentication
├── 🟡 DEV-45 Login UI
└── 🟢 DEV-39 Write Tests
```

When status changes:

```text
TaskService.updateTask()
       ↓
TaskProvider.refresh()
```

---

# 40. NotificationManager

## Responsibility

Show VS Code notifications.

Examples:

```text
DevFlow: DEV-42 assigned to you
DevFlow: DEV-45 was moved to REVIEW
DevFlow: New comment on DEV-39
```

Use VS Code notification APIs.

---

# 41. SocketClient — VS Code

The extension can maintain a Socket.IO connection to receive real-time updates.

```text
SocketClient
     ↓
Backend Socket.IO
```

Events:

```text
taskUpdated
taskCreated
commentAdded
notification
```

On task update:

```text
Socket Event
     ↓
TaskProvider.refresh()
     ↓
VS Code task list updates
```

---

# 42. VS Code Task Details

When user clicks a task:

```text
DEV-42
Fix Authentication

Priority: HIGH
Status: IN_PROGRESS
Assignee: Rahul

Description:
...

[Change Status]
[Add Comment]
[Create Branch]
```

Use a Webview only when custom UI is useful.

For simple lists, Tree View is enough.

---

# 43. CreateTaskCommand

Command:

```text
DevFlow: Create Task
```

Flow:

```text
VS Code Command
      ↓
Ask title
      ↓
Ask description
      ↓
Choose project
      ↓
Choose priority
      ↓
TaskService.createTask()
      ↓
Backend
      ↓
Task created
```

---

# 44. UpdateTaskCommand

Command:

```text
DevFlow: Change Task Status
```

Flow:

```text
Select Task
      ↓
Choose Status
      ↓
TaskService.updateTask()
      ↓
Backend
      ↓
MongoDB
      ↓
Socket.IO
      ↓
Web + VS Code update
```

---

# 45. CreateBugCommand

Command:

```text
DevFlow: Create Bug
```

Capture context such as:

```text
Current file
Selected text
Current line
Git branch
Error message
```

Optional AI:

```text
Captured Error
      ↓
AIService
      ↓
Suggested Title
Suggested Description
      ↓
Human Review
      ↓
Create Task
```

For the MVP, human confirmation is required before creating the task.

---

# 46. GitService — VS Code

## Responsibility

Interact with the local Git repository.

Methods:

```text
getCurrentBranch()
createBranch()
checkoutBranch()
getStatus()
```

Example:

```text
Task:
DEV-42 Build Login API

Command:
DevFlow: Create Task Branch

Result:
feature/DEV-42-build-login-api
```

---

# 47. CreateBranchCommand

Flow:

```text
Select Task
      ↓
Generate branch name
      ↓
GitService.createBranch()
      ↓
Local Git repository
```

Branch naming format:

```text
feature/DEV-42-build-login-api
```

For bugs:

```text
bugfix/DEV-50-login-crash
```

---

# 48. VS Code Webview

Use Webviews only when Tree View is insufficient.

Good Webview uses:

```text
Task details
AI suggestions
Standup
Complex forms
```

Avoid using Webviews for everything.

Simple task lists should use Tree View.

---

# 49. Frontend ↔ Backend Service Mapping

```text
React authService
       ↓
AuthController
       ↓
AuthService
       ↓
UserRepository
       ↓
MongoDB
```

```text
React projectService
       ↓
ProjectController
       ↓
ProjectService
       ↓
ProjectRepository
       ↓
MongoDB
```

```text
React taskService
       ↓
TaskController
       ↓
TaskService
       ↓
TaskRepository
       ↓
MongoDB
```

```text
React aiService
       ↓
AIController
       ↓
AIService
       ↓
LLM
```

---

# 50. VS Code ↔ Backend Mapping

```text
VS Code AuthService
       ↓
APIClient
       ↓
POST /api/auth/login
       ↓
Backend AuthService
```

```text
VS Code TaskService
       ↓
APIClient
       ↓
GET /api/tasks/my-tasks
       ↓
Backend TaskService
       ↓
TaskRepository
       ↓
MongoDB
```

```text
VS Code GitService
       ↓
Local Git
```

---

# 51. Complete Task Update Example from Web

User changes status:

```text
TODO → IN_PROGRESS
```

Flow:

```text
KanbanBoard
    ↓
taskService.updateTask()
    ↓
PUT /api/tasks/:id
    ↓
authMiddleware
    ↓
TaskController
    ↓
TaskService
    ↓
TaskRepository
    ↓
MongoDB
    ↓
NotificationService
    ↓
SocketService
    ↓
taskUpdated
    ↓
All project clients
```

---

# 52. Complete Task Update Example from VS Code

```text
VS Code TaskProvider
      ↓
UpdateTaskCommand
      ↓
TaskService
      ↓
APIClient
      ↓
PUT /api/tasks/:id
      ↓
Backend TaskService
      ↓
MongoDB
      ↓
Socket.IO
      ↓
React Web
```

This is the key DevFlow experience.

---

# 53. Real-Time Synchronization

A project has:

```text
project:123
```

Every connected member joins:

```text
project:123
```

When a task changes:

```javascript
io.to(`project:${projectId}`)
  .emit("taskUpdated", task);
```

All members receive it.

Individual notifications use:

```text
user:456
```

Example:

```javascript
io.to(`user:${userId}`)
  .emit("notification", notification);
```

---

# 54. Complete AI Task Divider Flow

```text
React AIDividerModal
        ↓
frontend aiService
        ↓
POST /api/ai/divide-task
        ↓
AIController
        ↓
AIService
        ↓
LLM Provider
        ↓
Structured suggestions
        ↓
React
        ↓
Human edits/selects
        ↓
taskService.createTask()
        ↓
TaskService
        ↓
MongoDB
```

AI does not silently modify the project.

---

# 55. Complete AI Standup Flow

```text
React StandupCard
       ↓
POST /api/ai/standup
       ↓
StandupService
       │
       ├── TaskRepository
       ├── CommentRepository
       └── Activity data
                ↓
             AIService
                ↓
               LLM
                ↓
          Standup response
                ↓
              React
```

---

# 56. Frontend State Strategy

Keep state simple.

Use:

```text
AuthContext
ProjectContext
Local component state
Custom hooks
```

Do not introduce Redux unless the application genuinely requires it.

Example:

```text
Global
 ├── User
 └── Current Project

Local
 ├── Modal
 ├── Form
 ├── Kanban filters
 └── Task details
```

---

# 57. Error Handling — Frontend

Every API service should handle:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
429 Too Many Requests
500 Server Error
```

UI examples:

```text
Invalid credentials
You do not have permission
Task not found
Something went wrong
Too many requests
```

---

# 58. Loading States

Every network-driven UI should show loading state.

Examples:

```text
Creating project...
Loading tasks...
Generating AI suggestions...
Updating task...
```

Buttons should be disabled while a request is being submitted when duplicate requests could cause problems.

---

# 59. VS Code Error Handling

Extension should handle:

```text
Not logged in
Token expired
Backend unavailable
Task deleted
Permission denied
Network error
```

Example:

```text
DevFlow:
Unable to connect to backend.
Please check your connection.
```

---

# 60. Security Responsibilities

## Backend

```text
JWT
bcrypt
Input validation
Role authorization
Rate limiting
CORS
Environment variables
Error handling
```

## React

Never expose:

```text
MONGO_URI
JWT_SECRET
AI_API_KEY
GITHUB_CLIENT_SECRET
```

## VS Code

Use:

```text
SecretStorage
```

for the JWT.

---

# 61. Complete OOP Architecture

## Backend

```text
AuthService
ProjectService
TaskService
CommentService
NotificationService
AIService
StandupService
GitService
```

Use:

```text
Encapsulation
Abstraction
Composition
Dependency Injection
Polymorphism where useful
```

## Frontend

React itself is component-based rather than class-OOP-heavy.

Use functions/hooks for UI and use service modules to separate concerns.

Good separation:

```text
Component
   ↓
Frontend Service
   ↓
API
```

## VS Code

Use classes where they improve structure:

```text
ExtensionManager
APIClient
AuthService
TaskService
NotificationManager
GitService
TaskProvider
SocketClient
```

---

# 62. Two-Person Work Distribution

## Person 1 — Backend

Owns:

```text
server/

UserRepository
AuthService
ProjectRepository
ProjectService
TaskRepository
TaskService
CommentRepository
CommentService
NotificationRepository
NotificationService
SocketService
AIService
StandupService
Git backend support
Security
API documentation
Deployment
```

## Person 2 — Frontend + VS Code

Owns:

```text
client/
extension/

React pages
React components
Frontend services
Contexts
Hooks
Socket client
AI UI
VS Code AuthService
VS Code TaskService
TaskProvider
NotificationManager
GitService
Commands
Extension UI
```

## Shared

```text
API contract
Testing
Integration
Git
PR reviews
Demo
```

---

# 63. Feature-wise Complete Development Order

## Feature 1 — Authentication

Backend:

```text
User Model
UserRepository
AuthService
AuthController
AuthRoutes
AuthMiddleware
```

Frontend:

```text
Login
Register
AuthContext
authService
Protected Routes
```

VS Code:

```text
AuthService
Login Command
SecretStorage
```

---

# 64. Feature 2 — Projects

Backend:

```text
Project Model
ProjectRepository
ProjectService
ProjectController
```

Frontend:

```text
Projects.jsx
Project.jsx
ProjectCard
Project Form
projectService
```

VS Code:

```text
Load user's projects if needed
```

---

# 65. Feature 3 — Team Members

Backend:

```text
ProjectService
Member authorization
```

Frontend:

```text
TeamMembers
Add Member
Remove Member
Role selector
```

VS Code:

No major UI required.

---

# 66. Feature 4 — Tasks

Backend:

```text
Task Model
TaskRepository
TaskService
TaskController
```

Frontend:

```text
TaskCard
TaskModal
TaskDetails
taskService
```

VS Code:

```text
TaskService
TaskProvider
```

---

# 67. Feature 5 — Kanban

Backend:

```text
TaskService.updateTask()
```

Frontend:

```text
KanbanBoard
KanbanColumn
TaskCard
```

VS Code:

```text
UpdateTaskCommand
```

---

# 68. Feature 6 — Comments

Backend:

```text
CommentModel
CommentRepository
CommentService
```

Frontend:

```text
CommentSection
commentService
```

VS Code:

```text
Add Comment command
```

---

# 69. Feature 7 — Notifications

Backend:

```text
NotificationModel
NotificationRepository
NotificationService
```

Frontend:

```text
NotificationPanel
notificationService
useNotifications
```

VS Code:

```text
NotificationManager
NotificationProvider
```

---

# 70. Feature 8 — Real-Time

Backend:

```text
SocketService
Project rooms
User rooms
Socket events
```

Frontend:

```text
socketService
useSocket
```

VS Code:

```text
SocketClient
```

---

# 71. Feature 9 — AI Task Divider

Backend:

```text
AIService
AIController
```

Frontend:

```text
AIDividerModal
aiService
```

VS Code:

Optional later.

---

# 72. Feature 10 — AI Task Details

Backend:

```text
AIService
```

Frontend:

```text
AITaskDetails
```

---

# 73. Feature 11 — AI Standup

Backend:

```text
StandupService
AIService
```

Frontend:

```text
StandupCard
```

VS Code:

Optional command:

```text
DevFlow: Generate Standup
```

---

# 74. Feature 12 — VS Code Tasks

Extension:

```text
AuthService
APIClient
TaskService
TaskProvider
```

Show:

```text
My Tasks
```

---

# 75. Feature 13 — VS Code Status Updates

Extension:

```text
UpdateTaskCommand
TaskService
SocketClient
```

Flow:

```text
VS Code
 ↓
TaskService
 ↓
Backend
 ↓
MongoDB
 ↓
Socket.IO
 ↓
Web
```

---

# 76. Feature 14 — Git Branch Integration

Extension:

```text
GitService
CreateBranchCommand
```

Example:

```text
DEV-42
 ↓
feature/DEV-42-build-login-api
```

---

# 77. Feature 15 — Bug to Task

Extension:

```text
CreateBugCommand
```

Possible AI:

```text
Error context
 ↓
AI suggestion
 ↓
Human review
 ↓
Create task
```

---

# 78. Feature 16 — GitHub PR Integration

Optional.

Possible architecture:

```text
GitHub
   ↓
Webhook / API
   ↓
Backend
   ↓
TaskService
   ↓
Task updated
   ↓
Socket.IO
   ↓
React + VS Code
```

Do this only after MVP completion.

---

# 79. Complete End-to-End System Example

Scenario:

```text
Himanshu creates:
Build Authentication System
```

AI:

```text
Login API
Registration API
JWT Middleware
Authentication UI
Tests
```

Himanshu reviews and creates selected tasks.

Rahul gets:

```text
DEV-42 Login API
```

Rahul opens VS Code.

```text
DEVFLOW
My Tasks
 └── DEV-42 Login API
```

Rahul changes:

```text
TODO → IN_PROGRESS
```

Backend:

```text
TaskService
 ↓
MongoDB
 ↓
Socket.IO
```

Himanshu's React board changes automatically.

Rahul comments:

```text
"Login API completed."
```

Notification:

```text
Himanshu:
Rahul commented on DEV-42
```

Rahul creates:

```text
feature/DEV-42-login-api
```

Later:

```text
DEV-42 → REVIEW → DONE
```

AI Standup summarizes the actual work.

This is the complete DevFlow story.

---

# 80. Final Architecture Diagram

```text
                           DEVFLOW
                              │
              ┌───────────────┴────────────────┐
              │                                │
         React Web                        VS Code
       Main Platform                    Companion
              │                                │
              │                                │
              └──────────────┬─────────────────┘
                             │
                    REST API + Socket.IO
                             │
                             ▼
                     Node.js + Express
                             │
        ┌────────────────────┼─────────────────────┐
        │                    │                     │
        ▼                    ▼                     ▼
   Controllers           Services              Socket
                             │
         ┌───────────────────┼───────────────────┐
         │          │        │        │          │
         ▼          ▼        ▼        ▼          ▼
      Auth      Project     Task   Comment   Notification
       │           │          │        │          │
       ▼           ▼          ▼        ▼          ▼
      User       Project     Task   Comment  Notification
     Repo         Repo       Repo     Repo      Repo
         │           │          │        │          │
         └───────────┴──────────┴────────┴─────────┘
                             │
                             ▼
                          MongoDB
                             │
                  ┌──────────┴──────────┐
                  │                     │
                AI API              Git/GitHub
```

---

# 81. Golden Implementation Rule

Every feature must be completed end-to-end:

```text
Database
   ↓
Repository
   ↓
Service
   ↓
Controller
   ↓
Route
   ↓
API Test
   ↓
Frontend Service
   ↓
React Component/Page
   ↓
Real-Time (when required)
   ↓
VS Code Integration (when required)
   ↓
Testing
```

Do not build all backend services first and postpone frontend integration for a long time.

Build one feature completely before starting the next major feature.

---

# 82. Recommended Build Sequence

```text
01. Repository Setup
02. Backend Setup
03. MongoDB Connection
04. User Model
05. UserRepository
06. AuthService
07. Authentication API
08. React Authentication
09. Project Model
10. ProjectRepository
11. ProjectService
12. Project API
13. Project UI
14. Task Model
15. TaskRepository
16. TaskService
17. Task API
18. Task UI
19. My Tasks
20. Kanban
21. Comments
22. Notifications
23. Socket.IO
24. AI Task Divider
25. AI Task Details
26. AI Standup
27. VS Code Authentication
28. VS Code My Tasks
29. VS Code Status Updates
30. Git Branch Integration
31. Bug → Task
32. Security
33. Testing
34. Deployment
35. Demo
```

---

# 83. Features to Avoid in MVP

```text
❌ Microservices
❌ Kubernetes
❌ Kafka
❌ Complex Redis
❌ Full Jira clone
❌ AI chatbot
❌ Mobile application
❌ Complex permission system
❌ Advanced analytics
❌ Heavy GitHub automation
```

Focus on:

```text
Web platform
+
Real-time collaboration
+
AI assistance
+
VS Code workflow
```

---

# 84. DevFlow Product Vision

> **Plan on the web. Code in VS Code. Collaborate in real time. Let AI assist the workflow.**

The web application is the complete product.

The VS Code extension is a productivity companion.

Both use the same backend, database, APIs, and real-time infrastructure.
