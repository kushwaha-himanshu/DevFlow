import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getGoogleIdToken } from "../../services/firebase";

export function AuthPage({ register = false }) {
  const nav = useNavigate();
  const { login, register: signUp, loginWithGoogle } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (register) {
        await signUp(form);
      } else {
        await login(form.email, form.password);
      }
      nav("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const signInWithGoogle = async () => {
    setBusy(true);
    setError("");
    try {
      const idToken = await getGoogleIdToken();
      await loginWithGoogle(idToken);
      nav("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (register) {
    return (
      <div className="signup-stitch">
        <header>
          <Link className="login-logo" to="/">
            <i>↔</i>DevSync
          </Link>
          <Link className="login-back" to="/">
            Back to website ↗
          </Link>
        </header>
        <main>
          <form className="signup-card" onSubmit={submit}>
            <div className="login-card-head">
              <i>‹›</i>
              <h1>Create an account</h1>
              <p>Start collaborating and managing projects with DevSync</p>
            </div>
            <label>
              Full Name
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Alex Mercer"
              />
            </label>
            <label>
              Email Address
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
              />
            </label>
            <label>
              Password
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••••••"
              />
            </label>
            <label>
              Confirm Password
              <input type="password" required placeholder="••••••••••••" />
            </label>
            <div className="password-hints">
              <b>Password requirements</b>
              <span>✓ At least 8 characters</span>
              <span>✓ One number</span>
              <span>✓ One special character</span>
            </div>
            <label className="terms">
              <input type="checkbox" required defaultChecked /> I agree to the{" "}
              <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>.
            </label>
            {error && <small className="login-error">{error}</small>}
            <button className="login-submit" disabled={busy}>
              {busy ? "Please wait..." : "Sign Up →"}
            </button>
            <div className="login-divider">
              <span>or continue with</span>
            </div>
            <div className="login-social">
              <button type="button" onClick={signInWithGoogle} disabled={busy}>
                G&nbsp;&nbsp; Google
              </button>
              <button type="button">◉&nbsp;&nbsp; GitHub</button>
            </div>
            <p className="login-signup">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
          <p className="login-trust">
            ● Git Sync Active &nbsp; • &nbsp; ▢ 256-bit SSL Encrypted
          </p>
        </main>
        <footer>
          © 2026 DevSync Technologies Inc. &nbsp; • &nbsp; Privacy Policy &nbsp;
          • &nbsp; Terms of Service &nbsp; • &nbsp; System Status
        </footer>
      </div>
    );
  }

  return (
    <div className="login-stitch">
      <header>
        <Link className="login-logo" to="/">
          <i>↔</i>DevSync
        </Link>
        <Link className="login-back" to="/">
          Back to website ↗
        </Link>
      </header>
      <main>
        <form className="login-card" onSubmit={submit}>
          <div className="login-card-head">
            <i>‹›</i>
            <h1>Welcome Back!</h1>
            <p>Login to your DevSync workspace</p>
          </div>
          <label>
            Email Address
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </label>
          <label>
            <span>
              Password <button type="button">Forgot password?</button>
            </span>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••••••"
            />
          </label>
          <label className="remember">
            <input type="checkbox" /> Remember this device for 30 days
          </label>
          {error && <small className="login-error">{error}</small>}
          <button className="login-submit" disabled={busy}>
            {busy ? "Please wait..." : "Login →"}
          </button>
          <div className="login-divider">
            <span>or continue with</span>
          </div>
          <div className="login-social">
            <button type="button" onClick={signInWithGoogle} disabled={busy}>
              G&nbsp;&nbsp; Google
            </button>
            <button type="button">◉&nbsp;&nbsp; GitHub</button>
          </div>
          <p className="login-signup">
            Don't have an account?{" "}
            <Link to="/register">Sign up for free</Link>
          </p>
        </form>
        <p className="login-trust">
          ● Git Sync Active &nbsp; • &nbsp; ▢ 256-bit SSL Encrypted
        </p>
      </main>
      <footer>
        © 2026 DevSync Technologies Inc. &nbsp; • &nbsp; Privacy Policy &nbsp;
        • &nbsp; Terms of Service &nbsp; • &nbsp; System Status
      </footer>
    </div>
  );
}

export default AuthPage;
