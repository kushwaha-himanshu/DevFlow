import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="empty">
      <div className="empty-icon">404</div>
      <h3>This page has wandered off</h3>
      <Link className="btn primary" to="/dashboard">
        Back to dashboard
      </Link>
    </div>
  );
}

export default NotFound;
