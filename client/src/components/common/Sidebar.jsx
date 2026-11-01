import {
  UserRound,
  LayoutDashboard,
  BriefcaseBusiness,
  Users,
  FileText,
  CalendarDays,
  UserRoundCog,
  Building2,
  Settings,
  X,
  KanbanSquare,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import { useAuth } from "../../context/useAuth";
import { useOrganization } from "../../context/useOrganization";
import ThemeToggle from "./ThemeToggle";
import hireFlowSymbol from "../../assets/hireflow-symbol.png";

const navigationItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Jobs",
    path: "/jobs",
    icon: BriefcaseBusiness,
  },
  {
    name: "Candidates",
    path: "/candidates",
    icon: Users,
  },
  {
    name: "Applications",
    path: "/applications",
    icon: FileText,
  },
  {
    name: "Interviews",
    path: "/interviews",
    icon: CalendarDays,
  },
  {
    name: "Team",
    path: "/team",
    icon: UserRoundCog,
  },
  {
    name: "Organization",
    path: "/organization",
    icon: Building2,
  },
  {
    name: "Settings",
    path: "/organization/settings",
    icon: Settings,
  },
  {
    name: "Pipeline",
    path: "/pipeline",
    icon: KanbanSquare,
  },
];

const Sidebar = ({ isOpen, isVisible, onClose }) => {
  const { user } = useAuth();
  const { hasPermission, hasRole } = useOrganization();
  const permissions = {
    "/dashboard": "viewAnalytics",
    "/jobs": "manageJobs",
    "/candidates": "manageCandidates",
    "/applications": "manageApplications",
    "/pipeline": "manageApplications",
    "/interviews": "manageInterviews",
    "/team": "manageMembers",
  };

  const visibleNavigationItems =
    user?.role === "candidate"
      ? [
          { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
          { name: "Job Portal", path: "/jobs", icon: BriefcaseBusiness },
          { name: "Profile", path: "/profile", icon: UserRound },
        ]
      : user?.role === "admin"
        ? [{ name: "System dashboard", path: "/admin", icon: LayoutDashboard }]
        : navigationItems.filter((item) => {
            if (user?.role === "recruiter" && item.path === "/candidates")
              return false;
            if (item.path === "/organization/settings")
            return hasRole("owner");
          if (
            user?.role === "recruiter" &&
            ["/dashboard", "/jobs", "/applications", "/interviews"].includes(
              item.path,
            )
          )
            return true;
          return (
            !permissions[item.path] || hasPermission(permissions[item.path])
          );
          });

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-overlay/60 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-64
          flex-col
          border-r
          border-border
          bg-background
          transition-transform
          duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isVisible ? "lg:translate-x-0" : "lg:-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-border px-6">
          <NavLink
            to="/"
            aria-label="Go to HireFlow landing page"
            className="flex h-14 w-14 items-center justify-center"
            onClick={onClose}
          >
            <img
              src={hireFlowSymbol}
              alt="HireFlow"
              className="h-14 w-14 object-contain"
            />
          </NavLink>

          <button
            type="button"
            aria-label="Close navigation"
            title="Close navigation"
            onClick={onClose}
            className="rounded-lg p-2 text-muted transition-opacity hover:bg-primary/5 hover:text-text lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
            Main Menu
          </p>

          <div className="space-y-1">
            {visibleNavigationItems.map(({ name, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                onClick={onClose}
                className={({ isActive }) =>
                  `
                    group
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-3
                    text-sm
                    font-medium
                    transition-opacity
                    ${
                      isActive
                        ? "bg-primary text-background"
                        : "text-muted hover:bg-primary/5 hover:text-text"
                    }
                    `
                }
              >
                <Icon size={19} strokeWidth={2} />

                <span>{name}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-border p-4">
          <ThemeToggle className="mb-4 w-full" />
          <div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
            <p className="text-sm font-semibold text-text">HireFlow</p>

            <p className="mt-1 text-xs leading-5 text-muted">
              AI-powered recruitment and HR management platform.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
