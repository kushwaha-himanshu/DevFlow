import { notifications } from "../mock/notifications";

const pause = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 180));

export const notificationService = {
  getNotifications: () => pause(notifications),
  markAsRead: (id) => {
    const n = notifications.find((n) => n.id === id);
    if (n) n.read = true;
    window.dispatchEvent(new Event("notifications-updated"));
    return pause(n);
  },
  markAllAsRead: () => {
    notifications.forEach((n) => (n.read = true));
    window.dispatchEvent(new Event("notifications-updated"));
    return pause(notifications);
  },
};

export default notificationService;
