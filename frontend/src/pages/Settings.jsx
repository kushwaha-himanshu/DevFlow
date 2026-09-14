import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { PageHeader, Avatar } from "../components/common";

export function Settings() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [section, setSection] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [alerts, setAlerts] = useState({
    assignments: true,
    mentions: true,
    digest: true,
    weekly: false,
  });

  return (
    <div className="settings-page">
      <PageHeader eyebrow="DevSync · Preferences" title="Settings">
        <span className="settings-sync-status">
          <i /> Cloud sync active
        </span>
      </PageHeader>
      <div className="settings-layout">
        <aside className="settings-sidebar">
          <nav>
            <b>Personal</b>
            {[
              ["profile", "Profile"],
              ["account", "Account & Security"],
              ["notifications", "Notifications"],
              ["integrations", "Integrations"],
            ].map(([value, label]) => (
              <button
                type="button"
                className={section === value ? "active" : ""}
                key={value}
                onClick={() => setSection(value)}
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="settings-node">
            <small>DevSync Node</small>
            <b>us-east-1</b>
            <span>
              <i /> All pipelines operational
            </span>
          </div>
        </aside>
        <section className="settings-content">
          {section === "profile" && (
            <div className="panel settings-card">
              <div className="settings-card-heading">
                <div>
                  <h2>Personal Profile</h2>
                  <p>
                    Configure your public engineering profile and localized
                    display attributes.
                  </p>
                </div>
                <span>Public in DevSync</span>
              </div>
              <div className="settings-avatar">
                <Avatar id={user?.id} size="large" />
                <div>
                  <button type="button" className="btn primary">
                    Change Avatar
                  </button>
                  <p>Recommended: JPG, PNG, or GIF up to 5MB.</p>
                </div>
              </div>
              <form
                className="settings-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  updateUser({ ...user, name });
                  setSaved(true);
                }}
              >
                <label>
                  Full Name
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
                <label>
                  Username / Handle
                  <input
                    value={`@${(name || "user").split(" ")[0].toLowerCase()}`}
                    readOnly
                  />
                </label>
                <label>
                  Work Email
                  <input value={user?.email || ""} disabled />
                </label>
                <label>
                  Role / Designation
                  <input value="Engineering Lead" readOnly />
                </label>
                <label className="wide">
                  Bio &amp; Technical Scope
                  <textarea
                    rows="3"
                    defaultValue="Engineering Lead on DevSync Core and Platform Architecture."
                  />
                </label>
                <div className="settings-form-actions">
                  <span>
                    {saved ? "Saved successfully." : "Last updated today"}
                  </span>
                  <button className="btn primary">Save Changes</button>
                </div>
              </form>
            </div>
          )}
          {section === "account" && (
            <div className="panel settings-card">
              <div className="settings-card-heading">
                <div>
                  <h2>Account &amp; Security</h2>
                  <p>
                    Manage authentication and account access for this mock
                    workspace.
                  </p>
                </div>
              </div>
              {[
                ["Work email", user?.email || "", "Verified"],
                ["Password", "••••••••••••", "Change password"],
                [
                  "Two-factor authentication",
                  "Not configured",
                  "Configure 2FA",
                ],
              ].map(([label, value, action]) => (
                <div className="settings-info-row" key={label}>
                  <span>{label}</span>
                  <b>{value}</b>
                  <button type="button" className="btn secondary">
                    {action}
                  </button>
                </div>
              ))}
            </div>
          )}
          {section === "notifications" && (
            <div className="panel settings-card">
              <div className="settings-card-heading">
                <div>
                  <h2>Notification Rules</h2>
                  <p>
                    Fine-tune how DevSync dispatches reviews, mentions, and
                    sprint reports.
                  </p>
                </div>
                <span>Auto-synced</span>
              </div>
              {[
                [
                  "assignments",
                  "Task & Pull Request Assignments",
                  "Receive alerts when tasks or PRs need your review.",
                ],
                [
                  "mentions",
                  "Mentions & Thread Comments",
                  "Get notified when teammates mention you.",
                ],
                [
                  "digest",
                  "Daily Standup Summary",
                  "Receive an AI-generated daily digest.",
                ],
                [
                  "weekly",
                  "Weekly Velocity Report",
                  "A weekly summary of sprint metrics and blockers.",
                ],
              ].map(([key, label, description]) => (
                <div className="settings-toggle-row" key={key}>
                  <span>
                    <b>{label}</b>
                    <small>{description}</small>
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={alerts[key]}
                    className={alerts[key] ? "on" : ""}
                    onClick={() =>
                      setAlerts({ ...alerts, [key]: !alerts[key] })
                    }
                  >
                    <i />
                  </button>
                </div>
              ))}
            </div>
          )}
          {section === "integrations" && (
            <div className="panel settings-card">
              <div className="settings-card-heading">
                <div>
                  <h2>Connected Integrations</h2>
                  <p>
                    Synchronize repositories, ticket lifecycles, and team
                    communication pipelines.
                  </p>
                </div>
              </div>
              {[
                ["GitHub Enterprise", "org: devsync · 14 repositories"],
                ["Slack Workspace", "#engineering-daily"],
              ].map(([name, detail]) => (
                <div className="integration-row" key={name}>
                  <b>{name}</b>
                  <span>{detail}</span>
                  <em>Connected</em>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Settings;
