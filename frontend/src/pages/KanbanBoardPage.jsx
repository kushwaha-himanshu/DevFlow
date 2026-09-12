import { ProjectLayout } from "../legacy/AppFeatures";

export default function KanbanBoardPage({ mode = "board" }) {
  return <ProjectLayout mode={mode} />;
}
