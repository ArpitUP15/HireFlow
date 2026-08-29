import { Routes, Route } from "react-router-dom";

import {
  OrganizationProvider,
} from "./context/OrganizationContext";

import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicRoute from "./components/common/PublicRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/DashBoard";
import OrganizationSetup from "./pages/OrganizationSetup";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import OrganizationSettings from "./pages/OrganizationSettings";
import TeamManagement from "./pages/TeamManagement";
import AcceptInvitation from "./pages/AcceptInvitation";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

        {/* Invitation */}
       <Route
  path="/accept-invitation"
  element={<AcceptInvitation />}
/>

        {/* Protected application */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/organization/setup"
            element={
              <OrganizationSetup />
            }
          />

          <Route
            path="/organization"
            element={
              <OrganizationProvider>
                <OrganizationDashboard />
              </OrganizationProvider>
            }
          />

          <Route
            path="/organization/settings"
            element={
              <OrganizationProvider>
                <OrganizationSettings />
              </OrganizationProvider>
            }
          />

          <Route
            path="/organization/team"
            element={
              <OrganizationProvider>
                <TeamManagement />
              </OrganizationProvider>
            }
          />
        </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;