import {
  Outlet,
} from "react-router-dom";

import Sidebar from "./Sidebar";


// =====================================================
// DASHBOARD LAYOUT
// =====================================================

const DashboardLayout = () => {

  return (

    <div className="min-h-screen bg-slate-950 text-white">

      {/* SIDEBAR */}

      <Sidebar />


      {/* MAIN CONTENT */}

      <main className="min-h-screen pl-64">

        <Outlet />

      </main>

    </div>
  );
};


export default DashboardLayout;