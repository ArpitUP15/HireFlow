import { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useOrganization } from "../../context/useOrganization";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const { user } = useAuth();
  const { organization, loading, error } = useOrganization();
  const location = useLocation();
  const toggleSidebar = () => {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setSidebarVisible((visible) => !visible);
      return;
    }
    setOpen(true);
  };
  if (user.role !== "candidate" && user.role !== "admin") {
    if (loading) return <p className="portal-page">Loading organization...</p>;
    if (error)
      return (
        <p className="portal-page" role="alert">
          {error}
        </p>
      );
    if (!organization && location.pathname !== "/dashboard")
      return <Navigate to="/dashboard" replace />;
  }
  return (
    <div className="min-h-screen bg-background text-text">
      <Sidebar
        isOpen={open}
        isVisible={sidebarVisible}
        onClose={() => setOpen(false)}
      />
      <div
        className={`transition-[padding] duration-300 ease-in-out ${
          sidebarVisible ? "lg:pl-64" : ""
        }`}
      >
        <Navbar
          onMenu={toggleSidebar}
          sidebarVisible={sidebarVisible}
        />
        <main>
          <Outlet key={organization?._id || user._id} />
        </main>
      </div>
    </div>
  );
}
