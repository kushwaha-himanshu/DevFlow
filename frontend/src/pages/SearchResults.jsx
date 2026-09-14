import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { searchService } from "../services/searchService";
import { PageHeader, Loading, EmptyState, Avatar } from "../components/common";
import { TaskCard } from "../components/task/TaskCard";

export function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [res, setRes] = useState(null);

  useEffect(() => {
    let active = true;

    async function fetchData() {
      if (!q) return;
      const nextResults = await searchService.search(q);
      if (active) setRes(nextResults);
    }

    setRes(null);
    fetchData();

    return () => {
      active = false;
    };
  }, [q]);

  return (
    <>
      <PageHeader
        eyebrow="Search"
        title={q ? `Results for "${q}"` : "Search DevSync"}
      />
      {!q ? (
        <EmptyState title="Start by typing in the global search" />
      ) : !res ? (
        <Loading />
      ) : (
        <div className="grid dashboard-grid">
          <section className="panel">
            <h3>Tasks</h3>
            <div className="task-stack" style={{ marginTop: 15 }}>
              {res.tasks.map((t) => (
                <TaskCard task={t} key={t.id} compact />
              ))}
            </div>
          </section>
          <section className="panel">
            <h3>Projects</h3>
            {res.projects.map((p) => (
              <Link key={p.id} className="project-row" to={`/projects/${p.id}`}>
                {p.name}
              </Link>
            ))}
            <h3 style={{ marginTop: 25 }}>People</h3>
            {res.users.map((u) => (
              <div className="activity" key={u.id}>
                <Avatar id={u.id} />
                <div>
                  <h4>{u.name}</h4>
                  <p>{u.email}</p>
                </div>
              </div>
            ))}
          </section>
        </div>
      )}
    </>
  );
}

export default SearchResults;
