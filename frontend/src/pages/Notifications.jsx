import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Bell } from "lucide-react";
import { notificationService } from "../services/notificationService";
import { PageHeader, Loading, EmptyState } from "../components/common";

export function Notifications() {
  const [notes, setNotes] = useState(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [unreadOnly, setUnreadOnly] = useState(false);

  useEffect(() => {
    notificationService.getNotifications().then(setNotes);
  }, []);

  if (!notes) return <Loading />;

  const visibleNotes = notes
    .filter((note) => filter === "ALL" || note.type === filter)
    .filter((note) => !unreadOnly || !note.read)
    .filter((note) => note.message.toLowerCase().includes(query.toLowerCase()));

  const unread = notes.filter((note) => !note.read).length;

  return (
    <div className="notifications-page">
      <PageHeader eyebrow="Inbox" title="Notifications">
        <label className="notification-search">
          <Search size={16} />
          <span className="sr-only">Filter alerts</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter alerts..."
          />
        </label>
        <button
          className="btn secondary"
          onClick={async () => {
            await notificationService.markAllAsRead();
            setNotes([...notes]);
          }}
        >
          Mark all as read
        </button>
      </PageHeader>
      <p className="notifications-intro">
        You have {unread} unread updates across your projects and connected
        repositories.
      </p>
      <div className="notification-filter-bar">
        <div className="tabs">
          {[
            ["ALL", "All"],
            ["TASK", "Tasks"],
            ["COMMENT", "Comments"],
          ].map(([value, label]) => (
            <button
              type="button"
              key={value}
              className={filter === value ? "active" : ""}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <label>
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(e) => setUnreadOnly(e.target.checked)}
          />{" "}
          Unread only
        </label>
      </div>
      <section className="panel notifications-list">
        {visibleNotes.map((n) => (
          <Link
            className={`notification ${!n.read ? "unread" : ""}`}
            to={`/tasks/${n.taskId}`}
            onClick={() => notificationService.markAsRead(n.id)}
            key={n.id}
          >
            <div className="notification-icon">
              <Bell size={15} />
            </div>
            <div>
              <p>{n.message}</p>
              <small>{n.createdAt}</small>
            </div>
          </Link>
        ))}
      </section>
      {!visibleNotes.length && (
        <EmptyState title="No notifications match your filters" />
      )}
    </div>
  );
}

export default Notifications;
