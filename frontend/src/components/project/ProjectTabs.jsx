import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  KanbanSquare,
  ListChecks,
  UsersRound,
  Settings,
} from "lucide-react";

export function ProjectTabs({ id }) {
  return (
    <div className="project-overview-tabs">
      <NavLink end to={`/projects/${id}`}>
        <LayoutGrid size={17} />
        Overview
      </NavLink>
      <NavLink to={`/projects/${id}/board`}>
        <KanbanSquare size={17} /> Board
      </NavLink>
      <NavLink to={`/projects/${id}/list`}>
        <ListChecks size={17} /> List
      </NavLink>
      <NavLink to={`/projects/${id}/members`}>
        <UsersRound size={17} /> Members
      </NavLink>
      <NavLink to={`/projects/${id}/settings`}>
        <Settings size={17} /> Settings
      </NavLink>
    </div>
  );
}

export default ProjectTabs;
