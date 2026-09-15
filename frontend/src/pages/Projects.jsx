import { useState, useEffect } from "react";
import {
  Plus,
  Grid2X2,
  List,
  Terminal,
  Search,
  ArrowUpDown,
  BarChart3,
  GitCommitHorizontal,
  UsersRound,
} from "lucide-react";
import { projectService } from "../services/projectService";
import { users } from "../mock/users";
import { tasks } from "../mock/tasks";
import { useAuth } from "../context/AuthContext";
import { PageHeader, Loading, EmptyState } from "../components/common";
import { ProjectCard } from "../components/project/ProjectCard";
import { ProjectDialog } from "../components/project/ProjectDialog";

export function Projects() {
  const [ps, setPs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("recent");
  const [syncNotice, setSyncNotice] = useState("");
  const { user } = useAuth();

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getProjects();
      setPs(data);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to load projects"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const userId = user?.id || user?._id;

  const visibleProjects = (ps || [])
    .filter((p) => {
      if (filter === "OWNED") return p.ownerId === userId;
      if (filter === "MEMBER") return p.memberIds.includes(userId);
      return true;
    })
    .filter((p) =>
      `${p.name} ${p.description} ${p.key}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    )
    .sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "progress") return b.progress - a.progress;
      return 0;
    });

  return (
    <div className="projects-stitch">
      <PageHeader
        eyebrow={`DevSync / Projects · ${ps?.length || 0} active`}
        title="Projects"
      >
        <div className="view-toggle" role="group" aria-label="Project view">
          <button
            className={`btn secondary ${view === "grid" ? "selected" : ""}`}
            type="button"
            aria-label="Grid view"
            title="Grid view"
            onClick={() => setView("grid")}
          >
            <Grid2X2 size={16} />
          </button>
          <button
            className={`btn secondary ${view === "list" ? "selected" : ""}`}
            type="button"
            aria-label="List view"
            title="List view"
            onClick={() => setView("list")}
          >
            <List size={17} />
          </button>
        </div>
        <button
          className="btn secondary"
          type="button"
          onClick={() => setSyncNotice("CLI sync is available in mock mode.")}
        >
          <Terminal size={15} /> CLI Sync
        </button>
        <button className="btn primary" onClick={() => setOpen(true)}>
          <Plus size={16} /> New project
        </button>
      </PageHeader>
      {syncNotice && (
        <div className="projects-notice" role="status">
          {syncNotice}
        </div>
      )}
      {error && (
        <div
          className="projects-notice"
          role="alert"
          style={{ color: "#d92d20", background: "#fef3f2" }}
        >
          {error}
        </div>
      )}
      <div className="projects-toolbar">
        <div
          className="project-filters"
          role="tablist"
          aria-label="Project filters"
        >
          {[
            ["ALL", "All"],
            ["OWNED", "Owned"],
            ["MEMBER", "Member"],
          ].map(([value, label]) => (
            <button
              className={filter === value ? "active" : ""}
              key={value}
              type="button"
              role="tab"
              aria-selected={filter === value}
              onClick={() => setFilter(value)}
            >
              {label}{" "}
              <b>
                {
                  (ps || []).filter((p) =>
                    value === "ALL"
                      ? true
                      : value === "OWNED"
                        ? p.ownerId === userId
                        : p.memberIds.includes(userId),
                  ).length
                }
              </b>
            </button>
          ))}
        </div>
        <label className="project-search">
          <Search size={16} />
          <span className="sr-only">Search projects</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, tags..."
          />
        </label>
        <label className="project-sort">
          <ArrowUpDown size={15} />
          <span className="sr-only">Sort projects</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="recent">Recently Updated</option>
            <option value="progress">Progress</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>
      {loading && !ps ? (
        <Loading label="Loading projects…" />
      ) : (
        <>
          <div
            className={`grid projects-grid ${view === "list" ? "list-view" : ""}`}
          >
            {visibleProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
          {!visibleProjects.length && (
            <EmptyState
              title={
                ps && ps.length === 0
                  ? "No projects yet"
                  : "No projects match your search"
              }
              subtitle={
                ps && ps.length === 0
                  ? "Create your first project to get started with DevSync."
                  : undefined
              }
            />
          )}
          <div className="projects-summary">
            <div>
              <BarChart3 size={20} />
              <span>
                <small>Average project progress</small>
                <strong>
                  {Math.round(
                    (ps || []).reduce(
                      (total, project) => total + (project.progress || 0),
                      0,
                    ) / ((ps || []).length || 1),
                  )}
                  %
                </strong>
              </span>
            </div>
            <div>
              <GitCommitHorizontal size={20} />
              <span>
                <small>Tasks tracked</small>
                <strong>{tasks.length} tasks</strong>
              </span>
            </div>
            <div>
              <UsersRound size={20} />
              <span>
                <small>Contributors</small>
                <strong>{users.length} engineers</strong>
              </span>
            </div>
          </div>
        </>
      )}
      {open && (
        <ProjectDialog
          onClose={() => setOpen(false)}
          onCreate={async (d) => {
            const newProject = await projectService.createProject(d);
            setPs((prev) => (prev ? [newProject, ...prev] : [newProject]));
          }}
        />
      )}
    </div>
  );
}

export default Projects;
