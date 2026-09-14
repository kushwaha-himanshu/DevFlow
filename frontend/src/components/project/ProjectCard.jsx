import { Link } from "react-router-dom";

export function ProjectCard({ project }) {
  return (
    <Link className="project-card" to={`/projects/${project.id}`}>
      <div className="project-icon" style={{ background: project.color }}>
        {project.key}
      </div>
      <div className="project-card-head">
        <div>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
        </div>
        <span className="more">•••</span>
      </div>
      <div className="progress-line">
        <i style={{ width: `${project.progress}%`, background: project.color }} />
      </div>
      <div className="project-footer">
        <span>{project.progress}% complete</span>
        <span>Open project →</span>
      </div>
    </Link>
  );
}

export default ProjectCard;
