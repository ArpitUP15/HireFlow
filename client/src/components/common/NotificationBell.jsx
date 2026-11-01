import { useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
export default function NotificationBell({
  canLoadNotifications = true,
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const toggle = async () => {
    setOpen(!open);
    if (!open) {
      try {
        const [organizationResponse, invitationResponse] = await Promise.all([
          canLoadNotifications
            ? api.get("/notifications")
            : Promise.resolve({ data: { notifications: [] } }),
          api.get("/notifications/invitations"),
        ]);
        setItems(
          [
            ...(organizationResponse.data.notifications || []),
            ...(invitationResponse.data.notifications || []),
          ].sort(
            (left, right) =>
              new Date(right.createdAt) - new Date(left.createdAt),
          ),
        );
        setError("");
      } catch {
        setError("Could not load notifications");
      }
    }
  };
  const read = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setItems(items.map((n) => (n._id === id ? { ...n, read: true } : n)));
    } catch {
      setError("Could not mark notification as read");
    }
  };
  const openNotification = async (notification) => {
    if (
      notification.type === "invitation" &&
      notification.metadata?.invitationId
    ) {
      try {
        await api.patch(`/notifications/invitations/${notification._id}/read`);
        setItems((current) =>
          current.map((item) =>
            item._id === notification._id ? { ...item, read: true } : item,
          ),
        );
        navigate(
          `/accept-invitation?invitationId=${encodeURIComponent(notification.metadata.invitationId)}`,
        );
      } catch {
        setError("Could not open invitation");
      }
      return;
    }
    await read(notification._id);
  };
  return (
    <div className="notification-wrap">
      <button aria-label="Notifications" aria-expanded={open} onClick={toggle}>
        <Bell size={19} />
      </button>
      {open && (
        <div className="notification-menu">
          <h3>Notifications</h3>
          {error && <p role="alert">{error}</p>}
          {!items.length && <p>No notifications.</p>}
          {items.map((n) => (
            <button key={n._id} onClick={() => openNotification(n)}>
              <strong>{n.title}</strong>
              <span>{n.message}</span>
              <small>
                {n.type === "invitation"
                  ? "Accept invitation"
                  : n.read
                    ? "Read"
                    : "Mark as read"}
              </small>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
