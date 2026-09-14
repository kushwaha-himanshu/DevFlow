import { useState, useEffect, useCallback } from "react";
import { notificationService } from "../services/notificationService";

export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    const data = await notificationService.getNotifications();
    setNotifications(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadNotifications();
    window.addEventListener("notifications-updated", loadNotifications);
    return () => {
      window.removeEventListener("notifications-updated", loadNotifications);
    };
  }, [loadNotifications]);

  return { notifications, loading, refresh: loadNotifications };
}
