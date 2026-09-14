import { useState } from "react";
import { CopyCheck, RotateCw, Sparkles } from "lucide-react";
import { aiService } from "../services/aiService";
import { projects } from "../mock/projects";
import { PageHeader } from "../components/common";

export function AIAssistant() {
  const [result, setResult] = useState(null);
  const [projectId, setProjectId] = useState(projects[0]?.id || "project-1");
  const [period, setPeriod] = useState("Last 24 hours");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setBusy(true);
    setResult(await aiService.generateStandup({ projectId, period }));
    setBusy(false);
  };

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard?.writeText(
      Object.entries(result)
        .map(
          ([title, items]) =>
            `## ${title}\n${items.map((item) => `- ${item}`).join("\n")}`,
        )
        .join("\n\n"),
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="ai-standup-page">
      <PageHeader eyebrow="DevSync AI · AI Beta" title="AI Daily Standup">
        <button className="btn secondary" onClick={copy} disabled={!result}>
          <CopyCheck size={15} /> {copied ? "Copied" : "Copy Markdown"}
        </button>
      </PageHeader>
      <div className="panel ai-controls" style={{ maxWidth: 1100 }}>
        <p style={{ fontSize: 13, color: "#6d778b" }}>
          Generate a concise snapshot of the work your team has completed,
          planned and blocked.
        </p>
        <div className="toolbar">
          <label>
            Project
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Time period
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option>Last 24 hours</option>
              <option>Last 48 hours</option>
              <option>Current sprint</option>
            </select>
          </label>
          <button className="btn primary" onClick={generate} disabled={busy}>
            {busy ? <RotateCw size={15} /> : <Sparkles size={15} />}{" "}
            {busy ? "Generating..." : "Generate report"}
          </button>
        </div>
        {result && (
          <div className="grid standup-grid">
            {[
              ["Yesterday", result.yesterday],
              ["Today", result.today],
              ["Blocked", result.blocked],
            ].map(([title, list]) => (
              <div key={title}>
                <h3>{title}</h3>
                <ul>
                  {list.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AIAssistant;
