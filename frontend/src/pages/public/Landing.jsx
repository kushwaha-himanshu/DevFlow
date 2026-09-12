import { Link } from "react-router-dom";
const features = [
  [
    "⚡",
    "AI-Powered Task Breakdown",
    "Transform broad engineering requirements into modular, checkable subtasks and acceptance criteria.",
  ],
  [
    "◫",
    "Git-Native Workflow",
    "Keep branches, pull requests, CI results, and delivery status aligned with every task.",
  ],
  [
    "◌",
    "Real-time Collaboration",
    "Make important context visible to every engineer without adding ceremony.",
  ],
  [
    "✓",
    "Simple & Powerful",
    "Fast boards, flexible task scoping and clear sprint metrics—without bloat.",
  ],
];
const steps = [
  [
    "01",
    "Define Technical Scope",
    "Write a user story or API requirement. DevSync organizes it by project key, priority, assignee, and branch target.",
    "git checkout -b feature/int-18",
  ],
  [
    "02",
    "Deconstruct with AI",
    "Generate modular subtasks with acceptance criteria. Review, edit, and select exactly the work you want.",
    "AI: 5 subtasks recommended",
  ],
  [
    "03",
    "Ship & Automate Review",
    "Link pull requests and use transparent status updates to keep your team aligned.",
    "PR #14 merged · Task INT-18 closed",
  ],
];
function Column({ title, count, active, cards }) {
  return (
    <div className={`sl-col ${active ? "active" : ""}`}>
      <header>
        <span>● {title}</span>
        <b>{count}</b>
      </header>
      {cards.map((c) => (
        <article key={c[0]}>
          <div>
            <code>{c[0]}</code>
            <em>{c[2]}</em>
          </div>
          <p>{c[1]}</p>
          <small>
            Mar 18 <i>RS</i>
          </small>
        </article>
      ))}
    </div>
  );
}
export default function StitchLanding() {
  return (
    <div className="sl">
      <div className="sl-announce">
        <b>New v2.4</b>
        <span>Introducing AI Task Breakdown & Git PR Live Telemetry.</span>
        <a href="#features">Explore features →</a>
      </div>
      <header className="sl-nav">
        <Link className="sl-logo" to="/">
          <i>DS</i>DevSync
        </Link>
        <nav>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#ai-assistance">AI Engine</a>
          <a href="#workflow">Developer Workflow</a>
        </nav>
        <div>
          <Link to="/login">Sign In</Link>
          <Link className="sl-btn small" to="/register">
            Get Started Free
          </Link>
        </div>
      </header>
      <main>
        <section className="sl-hero">
          <span className="sl-pill">
            <i /> Developer-First Project Management & Collaboration
          </span>
          <h1>
            Build. Plan. Ship.
            <br />
            <em>Together.</em>
          </h1>
          <p>
            The developer-first project management platform powered by AI.
            Transform technical requirements into sprint-ready tasks, track
            work, and ship faster with your engineering team.
          </p>
          <div className="sl-actions">
            <Link className="sl-btn" to="/register">
              Get Started →
            </Link>
            <a className="sl-ghost" href="#preview">
              ▶ Watch Demo
            </a>
          </div>
          <div className="sl-trust">
            <span>✓ Free for up to 10 engineers</span>
            <span>✓ Zero-friction GitHub sync</span>
            <span>✓ No credit card required</span>
          </div>
          <div id="preview" className="sl-preview">
            <div className="sl-browser">
              <header>
                <span>
                  <i />
                  <i />
                  <i />
                </span>
                <code>app.devsync.io/projects/interview-platform</code>
                <b>Sprint 24 · 75% Done</b>
              </header>
              <div className="sl-app">
                <aside>
                  <strong>
                    <i>DS</i> <span>DevSync</span>
                  </strong>
                  <p>Dashboard</p>
                  <p className="chosen">Projects</p>
                  <p>My Tasks</p>
                  <p>AI Assistant</p>
                  <p>Settings</p>
                  <small>HK &nbsp; Himanshu K.</small>
                </aside>
                <section>
                  <header>
                    <div>
                      <h3>
                        Interview Platform <code>INT-Core</code>
                      </h3>
                      <p>Real-time collaborative paired execution engine</p>
                    </div>
                    <button>+ New Task</button>
                  </header>
                  <div className="sl-board">
                    <Column
                      title="TODO"
                      count="4"
                      cards={[
                        [
                          "INT-12",
                          "Setup project structure & core boilerplate",
                          "High",
                        ],
                        [
                          "INT-14",
                          "Design UI mockups for live coding screen",
                          "Medium",
                        ],
                      ]}
                    />
                    <Column
                      title="IN PROGRESS"
                      count="3"
                      active
                      cards={[
                        ["INT-18", "Build login API with SSO & OAuth", "High"],
                        [
                          "INT-19",
                          "Integrate JWT middleware with refresh rotation",
                          "High",
                        ],
                      ]}
                    />
                    <div className="sl-ai-mini">
                      <header>
                        ✦ AI Assistant Active <b>BETA</b>
                      </header>
                      <div>
                        <strong>Recommended Subtasks:</strong>
                        <p>✓ POST /api/auth/register</p>
                        <p>✓ Bcrypt password hashing</p>
                        <p>⚡ Implement JWT middleware</p>
                        <p>○ Email token reset flow</p>
                      </div>
                      <button>Apply 4 Subtasks →</button>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="sl-section white">
          <header>
            <small>ENGINEERED FOR TECHNICAL TEAMS</small>
            <h2>Everything developers need to execute with precision</h2>
            <p>
              Built ground-up with Git-native workflows, engineering telemetry,
              and lightweight AI assistance.
            </p>
          </header>
          <div className="sl-feature-grid">
            {features.map((x) => (
              <article key={x[1]}>
                <i>{x[0]}</i>
                <h3>{x[1]}</h3>
                <p>{x[2]}</p>
                <code>Explore capability →</code>
              </article>
            ))}
          </div>
        </section>
        <section id="how-it-works" className="sl-section">
          <header>
            <small>SIMPLE 3-STEP PROCESS</small>
            <h2>From feature idea to deployed code</h2>
            <p>
              DevSync bridges the gap between PM specifications and engineering
              implementation.
            </p>
          </header>
          <div className="sl-steps">
            {steps.map((x) => (
              <article key={x[0]}>
                <b>{x[0]}</b>
                <h3>{x[1]}</h3>
                <p>{x[2]}</p>
                <code>{x[3]}</code>
              </article>
            ))}
          </div>
        </section>
        <section id="ai-assistance" className="sl-ai">
          <div>
            <small>LIGHTWEIGHT AI PARTNER</small>
            <h2>
              AI that assists your engineers, not replaces their judgment.
            </h2>
            <p>
              DevSync’s AI structures messy scopes into manageable subtasks,
              suggests test coverage, and drafts daily standup summaries.
            </p>
            {[
              "User-Controlled Selection",
              "Context-Aware Architectural Suggestions",
              "Automated Daily Standup Digest",
            ].map((x) => (
              <p className="sl-check" key={x}>
                ✓{" "}
                <span>
                  <b>{x}</b>
                  <br />
                  Every recommendation stays visible, editable, and under your
                  control.
                </span>
              </p>
            ))}
          </div>
          <div className="sl-ai-window">
            <header>
              ✦{" "}
              <span>
                <b>AI Task Breakdown</b>
                <small>Context: Build Authentication System</small>
              </span>
              <em>5 selected</em>
            </header>
            {[
              "Create user registration API endpoint",
              "Implement JWT token generation & refresh middleware",
              "Write end-to-end authentication tests with Jest",
            ].map((x, i) => (
              <label key={x}>
                <input type="checkbox" defaultChecked />
                <span>
                  <b>{x}</b>
                  <small>
                    {i === 0
                      ? "POST /api/auth/register"
                      : i === 1
                        ? "auth.middleware.ts"
                        : "auth.test.ts"}
                  </small>
                </span>
                <em>{i === 2 ? "Medium" : "High"}</em>
              </label>
            ))}
            <footer>
              <button>Regenerate</button>
              <Link className="sl-btn small" to="/register">
                Create 5 Selected Tasks
              </Link>
            </footer>
          </div>
        </section>
        <section id="workflow" className="sl-section">
          <header>
            <small>INTEGRATIONS & SPEED</small>
            <h2>Fits right into your existing toolchain</h2>
            <p>
              No context switching. DevSync works seamlessly with developer
              workflows your team already loves.
            </p>
          </header>
          <div className="sl-workflow">
            {[
              ["git", "Branch & PR Telemetry"],
              ["⌘K", "Keyboard-Driven Navigation"],
              ["API", "REST & Webhook Extensibility"],
            ].map((x) => (
              <article key={x[1]}>
                <i>{x[0]}</i>
                <h3>{x[1]}</h3>
                <p>
                  Built for high-velocity software teams that need calm, clear
                  execution.
                </p>
                <code>● Developer workflow ready</code>
              </article>
            ))}
          </div>
        </section>
        <section className="sl-final">
          <small>READY TO ACCELERATE YOUR ENGINEERING CYCLE?</small>
          <h2>Start building with DevSync today. Free for developers.</h2>
          <p>
            Plan, track, and ship high-impact software without project
            management clutter.
          </p>
          <div>
            <Link className="sl-btn light" to="/register">
              Create Free Account
            </Link>
            <Link className="sl-outline" to="/login">
              Explore the Demo
            </Link>
          </div>
          <small>Setup takes under 2 minutes · No credit card required</small>
        </section>
      </main>
      <footer className="sl-footer">
        <div>
          <Link className="sl-logo" to="/">
            <i>DS</i>DevSync
          </Link>
          <p>
            Plan. Build. Ship. Together. Developer-first project management with
            assistive AI.
          </p>
          <small>© 2026 DevSync Technologies Inc.</small>
        </div>
        <div>
          <b>Product</b>
          <a href="#features">Kanban Boards</a>
          <a href="#ai-assistance">AI Task Breakdown</a>
        </div>
        <div>
          <b>Resources</b>
          <a href="#workflow">Developer Workflow</a>
          <a href="#">Documentation</a>
        </div>
        <div>
          <b>Company</b>
          <a href="#">About Us</a>
          <a href="#">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}
