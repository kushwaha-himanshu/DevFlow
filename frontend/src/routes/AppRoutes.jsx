import { Route, Routes } from "react-router-dom";
import Landing from "../pages/public/Landing";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import ProjectPage from "../pages/ProjectOverview";
import Board from "../pages/KanbanBoardPage";
import MyTasks from "../pages/MyTasks";
import TaskDetails from "../pages/TaskDetailsPage";
import Notifications from "../pages/Notifications";
import AI from "../pages/AIAssistant";
import Teams from "../pages/TeamMembers";
import Settings from "../pages/Settings";
import Search from "../pages/SearchResults";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import { Shell } from "../legacy/AppFeatures";

const protectedPage = (element) => (
  <ProtectedRoute>
    <Shell>{element}</Shell>
  </ProtectedRoute>
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={protectedPage(<Dashboard />)} />
      <Route path="/projects" element={protectedPage(<Projects />)} />
      <Route
        path="/projects/:projectId"
        element={protectedPage(<ProjectPage />)}
      />
      <Route
        path="/projects/:projectId/board"
        element={protectedPage(<Board />)}
      />
      <Route
        path="/projects/:projectId/list"
        element={protectedPage(<Board mode="list" />)}
      />
      <Route
        path="/projects/:projectId/members"
        element={protectedPage(<ProjectPage mode="members" />)}
      />
      <Route
        path="/projects/:projectId/settings"
        element={protectedPage(<ProjectPage mode="settings" />)}
      />
      <Route path="/tasks/:taskId" element={protectedPage(<TaskDetails />)} />
      <Route path="/my-tasks" element={protectedPage(<MyTasks />)} />
      <Route path="/notifications" element={protectedPage(<Notifications />)} />
      <Route path="/ai" element={protectedPage(<AI />)} />
      <Route path="/teams" element={protectedPage(<Teams />)} />
      <Route path="/settings" element={protectedPage(<Settings />)} />
      <Route path="/search" element={protectedPage(<Search />)} />
      <Route path="*" element={protectedPage(<NotFound />)} />
    </Routes>
  );
}
