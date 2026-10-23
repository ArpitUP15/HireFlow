import {
  Menu,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  Outlet,
} from "react-router-dom";

import Sidebar from "./Sidebar";
import ThemeToggle from "./ThemeToggle";

const DashboardLayout = () => {
  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-white/10 bg-slate-950/90 px-4 backdrop-blur-lg lg:hidden">
          <button
            type="button"
            onClick={() =>
              setSidebarOpen(true)
            }
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <Menu size={22} />
          </button>

          <div className="ml-4 text-xl font-bold">
            <span className="text-white">
              Hire
            </span>

            <span className="text-blue-500">
              Flow
            </span>
          </div>
          <ThemeToggle className="ml-auto" />
        </header>

        <main className="min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;