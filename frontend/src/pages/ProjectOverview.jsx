import { ProjectLayout } from "../components/project/ProjectLayout";

export default function ProjectOverview({ mode = "overview" }) {
  return <ProjectLayout mode={mode} />;
}
