import { ProjectLayout } from "../components/project/ProjectLayout";

export default function KanbanBoardPage({ mode = "board" }) {
  return <ProjectLayout mode={mode} />;
}
