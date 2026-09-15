import { useState } from "react";
import { FolderPlus, X, LockKeyhole, Globe2, ArrowRight } from "lucide-react";

export function ProjectDialog({ onClose, onCreate }) {
  const [data, setData] = useState({
    name: "",
    key: "",
    description: "",
    visibility: "private",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

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
          try {
            setIsSubmitting(true);
            setError(null);
            await onCreate({
              name: data.name,
              description: data.description,
              key: data.key || generatedKey,
              visibility: data.visibility,
            });
            onClose();
          } catch (err) {
            setError(
              err.response?.data?.message ||
                err.message ||
                "Failed to create project"
            );
          } finally {
            setIsSubmitting(false);
          }
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
            disabled={isSubmitting}
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div
            className="dialog-error"
            role="alert"
            style={{
              color: "#d92d20",
              fontSize: 13,
              background: "#fef3f2",
              border: "1px solid #fee4e2",
              padding: "8px 12px",
              borderRadius: "6px",
            }}
          >
            {error}
          </div>
        )}

        <label className="dialog-field">
          Project name <span className="required">*</span>
          <input
            required
            autoFocus
            placeholder="e.g. Interview Platform"
            value={data.name}
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
          <button
            type="button"
            className="btn secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button className="btn primary" disabled={isSubmitting}>
            {isSubmitting ? (
              "Creating…"
            ) : (
              <>
                Create Project <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProjectDialog;
