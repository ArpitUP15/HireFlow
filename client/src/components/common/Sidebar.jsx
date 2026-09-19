import {
  LayoutDashboard,
  BriefcaseBusiness,
  Users,
  FileText,
  CalendarDays,
  UserRoundCog,
  Building2,
  Settings,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

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
];

const Sidebar = ({
  isOpen,
  onClose,
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
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
          border-white/10
          bg-slate-950
          transition-transform
          duration-300
          lg:translate-x-0
          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <NavLink
            to="/dashboard"
            className="text-2xl font-bold"
          >
            <span className="text-white">
              Hire
            </span>

            <span className="text-blue-500">
              Flow
            </span>
          </NavLink>

          {/* Mobile Close */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Main Menu
          </p>

          <div className="space-y-1">
            {navigationItems.map(
              ({
                name,
                path,
                icon: Icon,
              }) => (
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
                    transition
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }
                    `
                  }
                >
                  <Icon
                    size={19}
                    strokeWidth={2}
                  />

                  <span>{name}</span>
                </NavLink>
              )
            )}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-white/10 p-4">
          <div className="rounded-xl border border-blue-500/10 bg-blue-500/5 p-4">
            <p className="text-sm font-semibold text-white">
              HireFlow
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              AI-powered recruitment and HR
              management platform.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;