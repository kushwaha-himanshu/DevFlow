import { useState } from "react";
import { FolderPlus, X, LockKeyhole, Globe2, ArrowRight } from "lucide-react";

export function ProjectDialog({ onClose, onCreate }) {
  const [data, setData] = useState({
    name: "",
    key: "",
    description: "",
    visibility: "private",
  });
  const generatedKey = (data.name || "NEW")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 3)
    .toUpperCase();

  return (
    <div className="dialog-backdrop" role="presentation">
      <form
        className="dialog project-dialog form-grid"
        onSubmit={async (e) => {
          e.preventDefault();
          await onCreate(data);
          onClose();
        }}
      >
        <div className="project-dialog-header">
          <div className="project-dialog-title">
            <span className="project-dialog-icon">
              <FolderPlus size={17} />
            </span>
            <div>
              <h2>Create New Project</h2>
              <p>Start collaborating and managing repositories with DevSync</p>
            </div>
          </div>
          <button
            type="button"
            className="dialog-close"
            aria-label="Close modal"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        <label className="dialog-field">
          Project name <span className="required">*</span>
          <input
            required
            autoFocus
            placeholder="e.g. Interview Platform"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
        </label>
        <label className="dialog-field">
          <span className="field-label-row">
            Description <small>Optional</small>
          </span>
          <textarea
            rows="3"
            placeholder="Describe your project goals, repositories, or target sprint milestones..."
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />
        </label>
        <label className="dialog-field">
          <span className="field-label-row">
            Project key <small>Auto-generated or custom</small>
          </span>
          <input
            required
            maxLength="10"
            className="project-key-input"
            placeholder="e.g. INT"
            value={data.key}
            onChange={(e) =>
              setData({ ...data, key: e.target.value.toUpperCase() })
            }
          />
          <span className="project-key-preview">
            {data.key || generatedKey}-101
          </span>
          <small className="field-help">
            Used as the prefix for task IDs, commits, and branch tags.
          </small>
        </label>
        <fieldset className="visibility-field">
          <legend>Visibility</legend>
          <label className={data.visibility === "private" ? "selected" : ""}>
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={data.visibility === "private"}
              onChange={(e) => setData({ ...data, visibility: e.target.value })}
            />
            <LockKeyhole size={15} />
            <span>
              <strong>Private</strong>
              <small>Only invited team members can view or contribute.</small>
            </span>
            <em>Recommended</em>
          </label>
          <label className={data.visibility === "public" ? "selected" : ""}>
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={data.visibility === "public"}
              onChange={(e) => setData({ ...data, visibility: e.target.value })}
            />
            <Globe2 size={15} />
            <span>
              <strong>Public</strong>
              <small>
                Anyone with the organization link can view the project.
              </small>
            </span>
          </label>
        </fieldset>
        <div className="dialog-actions">
          <button type="button" className="btn secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary">
            Create Project <ArrowRight size={15} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProjectDialog;
