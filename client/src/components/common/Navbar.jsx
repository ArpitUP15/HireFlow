import { Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import ThemeToggle from "./ThemeToggle";
import NotificationBell from "./NotificationBell";
import { useOrganization } from "../../context/useOrganization";
export default function Navbar({ onMenu }) {
  const { user, logout } = useAuth();
  const { organization } = useOrganization();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const signOut = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      setError("Sign out failed. Please retry.");
    }
  };
  return (
    <header className="workspace-navbar">
      <button
        aria-label="Open navigation"
        className="lg:hidden"
        onClick={onMenu}
      >
        <Menu size={22} />
      </button>
      <span>
        {user?.firstName} {user?.lastName}
        <small>
          {user?.role === "candidate"
            ? "Candidate account"
            : "Recruiter workspace"}
        </small>
      </span>
      <div className="portal-actions">
        <ThemeToggle />
        <NotificationBell
          canLoadNotifications={
            Boolean(organization) || user?.role === "candidate"
          }
        />
        <button aria-label="Sign out" onClick={signOut}>
          <LogOut size={18} />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
      {error && <p role="alert">{error}</p>}
    </header>
  );
}
