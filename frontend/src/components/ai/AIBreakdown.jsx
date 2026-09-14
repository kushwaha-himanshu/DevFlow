import { useState } from "react";
import { Sparkles, X, RotateCw, Pencil, Trash2, Check } from "lucide-react";
import { aiService } from "../../services/aiService";
import { taskService } from "../../services/taskService";
import { PriorityBadge } from "../common";

export function AIBreakdown({ project, onClose, onCreated }) {
  const [ideas, setIdeas] = useState(null);
  const [selected, setSelected] = useState([]);
  const [req, setReq] = useState("Create a complete authentication workflow");
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);

  const generate = async () => {
    const x = await aiService.divideTask(req);
    setIdeas(x);
    setSelected(x.map((_, i) => i));
  };

  const create = async () => {
    setBusy(true);
    for (const i of selected) {
      await taskService.createTask({ ...ideas[i], projectId: project.id });
    }
    setBusy(false);
    onCreated();
    onClose();
  };

  return (
    <div className="dialog-backdrop">
      <div className="dialog ai-breakdown-dialog">
        <div className="ai-dialog-header">
          <div>
            <h2>
              <Sparkles size={18} /> AI Task Breakdown <span>Beta</span>
            </h2>
            <p>
              Automatically decompose requirements into actionable subtasks.
            </p>
          </div>
          <button
            className="dialog-close"
            type="button"
            aria-label="Close modal"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        {!ideas ? (
          <>
            <label className="ai-requirement">
              Requirement <span className="required">*</span>
              <textarea value={req} onChange={(e) => setReq(e.target.value)} />
            </label>
            <div className="dialog-actions">
              <button className="btn secondary" type="button" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn primary"
                type="button"
                onClick={generate}
                disabled={!req.trim()}
              >
                <Sparkles size={15} /> Generate suggestions
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="ai-breakdown-context">
              <b>Requirement</b>
              <p>{req}</p>
              <button type="button" onClick={generate}>
                <RotateCw size={14} /> Regenerate
              </button>
            </div>
            <div className="ai-list-heading">
              <b>AI Suggested Tasks</b>
              <span>
                {ideas.length} generated · {selected.length} selected
              </span>
              <button
                type="button"
                onClick={() =>
                  setSelected(
                    selected.length === ideas.length
                      ? []
                      : ideas.map((_, i) => i),
                  )
                }
              >
                {selected.length === ideas.length
                  ? "Deselect all"
                  : "Select all"}
              </button>
            </div>
            <div className="ai-result">
              {ideas.map((x, i) => (
                <label className="ai-suggestion" key={i}>
                  <input
                    type="checkbox"
                    checked={selected.includes(i)}
                    onChange={(e) =>
                      setSelected(
                        e.target.checked
                          ? [...selected, i]
                          : selected.filter((n) => n !== i),
                      )
                    }
                  />
                  <div className="ai-suggestion-content">
                    {editing === i ? (
                      <input
                        value={x.title}
                        onChange={(e) =>
                          setIdeas(
                            ideas.map((idea, index) =>
                              index === i
                                ? { ...idea, title: e.target.value }
                                : idea,
                            ),
                          )
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <h4>
                        {x.title} <PriorityBadge priority={x.priority} />
                      </h4>
                    )}
                    <p>{x.description}</p>
                  </div>
                  <div className="ai-suggestion-actions">
                    <button
                      type="button"
                      aria-label="Edit suggestion"
                      onClick={(e) => {
                        e.preventDefault();
                        setEditing(editing === i ? null : i);
                      }}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      aria-label="Delete suggestion"
                      onClick={(e) => {
                        e.preventDefault();
                        setIdeas(ideas.filter((_, index) => index !== i));
                        setSelected(selected.filter((index) => index !== i));
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </label>
              ))}
            </div>
            <div className="dialog-actions">
              <button className="btn secondary" type="button" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn primary"
                type="button"
                onClick={create}
                disabled={!selected.length || busy}
              >
                <Check size={15} />{" "}
                {busy ? "Creating..." : `Create selected (${selected.length})`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AIBreakdown;
