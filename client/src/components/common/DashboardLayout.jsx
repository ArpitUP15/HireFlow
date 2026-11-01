import { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useOrganization } from "../../context/useOrganization";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { organization, loading, error } = useOrganization();
  const location = useLocation();
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
      <Sidebar isOpen={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-64">
        <Navbar onMenu={() => setOpen(true)} />
        <main>
          <Outlet key={organization?._id || user._id} />
        </main>
      </div>
    </div>
  );
}
