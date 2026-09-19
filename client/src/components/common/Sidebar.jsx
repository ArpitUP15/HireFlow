import {
  LayoutDashboard,
  BriefcaseBusiness,
  Users,
  FileText,
  CalendarDays,
  Building2,
  UserCog,
  Settings,
  LogOut,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/useAuth";


// =====================================================
// SIDEBAR
// =====================================================

const Sidebar = () => {

  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();


  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogout = async () => {

    try {

      await logout();

      navigate(
        "/login",
        {
          replace: true,
        }
      );

    } catch (error) {

      console.error(
        "Logout failed:",
        error
      );

    }
  };


  // ===================================================
  // NAVIGATION ITEMS
  // ===================================================

  const navigationItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },

    {
      label: "Jobs",
      path: "/jobs",
      icon: BriefcaseBusiness,
    },

    {
      label: "Candidates",
      path: "/candidates",
      icon: Users,
    },

    {
      label: "Applications",
      path: "/applications",
      icon: FileText,
    },

    {
      label: "Interviews",
      path: "/interviews",
      icon: CalendarDays,
    },

    {
      label: "Team",
      path: "/team",
      icon: UserCog,
    },

    {
      label: "Organization",
      path: "/organization",
      icon: Building2,
    },

    {
      label: "Settings",
      path: "/organization/settings",
      icon: Settings,
    },
  ];


  return (

    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-white/10 bg-slate-950 text-white">


      {/* =================================================
          LOGO
      ================================================= */}

      <div className="flex h-20 items-center border-b border-white/10 px-6">

        <NavLink
          to="/dashboard"
          className="text-2xl font-bold tracking-tight"
        >

          <span className="text-white">
            Hire
          </span>

          <span className="text-blue-500">
            Flow
          </span>

        </NavLink>

      </div>


      {/* =================================================
          NAVIGATION
      ================================================= */}

      <nav className="flex-1 overflow-y-auto px-4 py-6">

        <div className="space-y-2">

          {navigationItems.map(
            (item) => {

              const Icon =
                item.icon;


              return (

                <NavLink
                  key={
                    item.path
                  }
                  to={
                    item.path
                  }
                  className={({
                    isActive,
                  }) =>
                    `
                    group flex items-center gap-3 rounded-xl px-4 py-3
                    text-sm font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-600/15 text-blue-400"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }
                    `
                  }
                >

                  <Icon
                    size={20}
                    strokeWidth={2}
                    className="shrink-0"
                  />

                  <span>
                    {item.label}
                  </span>

                </NavLink>

              );
            }
          )}

        </div>

      </nav>


      {/* =================================================
          USER SECTION
      ================================================= */}

      <div className="border-t border-white/10 p-4">


        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 p-3">


          {/* USER AVATAR */}

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">

            {user?.firstName
              ?.charAt(0)
              ?.toUpperCase() || "U"}

          </div>


          {/* USER INFO */}

          <div className="min-w-0 flex-1">

            <p className="truncate text-sm font-medium text-white">

              {user?.firstName || "User"}{" "}

              {user?.lastName || ""}

            </p>


            <p className="truncate text-xs text-slate-500">

              {user?.email || ""}

            </p>

          </div>

        </div>


        {/* LOGOUT */}

        <button
          type="button"
          onClick={
            handleLogout
          }
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
        >

          <LogOut
            size={20}
          />

          <span>
            Logout
          </span>

        </button>

      </div>

    </aside>
  );
};


export default Sidebar;