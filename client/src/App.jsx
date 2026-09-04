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
import Jobs from "./pages/jobs/Jobs";
import CreateJob from "./pages/jobs/CreateJob";

import Candidates from "./pages/candidates/Candidates";
import CreateCandidate from "./pages/candidates/CreateCandidate";
import EditJob from "./pages/jobs/EditJob";
import JobDetails from "./pages/jobs/JobDetails";

import EditCandidate from "./pages/candidates/EditCandidate";
import CandidateDetails from "./pages/candidates/CandidateDetails";

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

       {/* Phase 3 */}

      <Route
        path="/organization"
        element={
          <OrganizationProvider>
            <OrganizationDashboard />
          </OrganizationProvider>
        }
      />

  <Route
    path="/organization/setup"
    element={
      <OrganizationSetup />
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

  <Route
    path="/organization/settings"
    element={
      <OrganizationProvider>
        <OrganizationSettings />
      </OrganizationProvider>
    }
  />

  {/* Phase 4 - Jobs */}

  <Route
    path="/jobs"
    element={
      <OrganizationProvider>
        <Jobs />
      </OrganizationProvider>
    }
  />

  <Route
    path="/jobs/create"
    element={
      <OrganizationProvider>
        <CreateJob />
      </OrganizationProvider>
    }
  />

  <Route
    path="/jobs/:id"
    element={
      <OrganizationProvider>
        <JobDetails />
      </OrganizationProvider>
    }
  />

  <Route
    path="/jobs/:id/edit"
    element={
      <OrganizationProvider>
        <EditJob />
      </OrganizationProvider>
    }
  />

  {/* Phase 4 - Candidates */}

  <Route
    path="/candidates"
    element={
      <OrganizationProvider>
        <Candidates />
      </OrganizationProvider>
    }
  />

  <Route
    path="/candidates/create"
    element={
      <OrganizationProvider>
        <CreateCandidate />
      </OrganizationProvider>
    }
  />

  <Route
    path="/candidates/:id"
    element={
      <OrganizationProvider>
        <CandidateDetails />
      </OrganizationProvider>
    }
  />

  <Route
    path="/candidates/:id/edit"
    element={
      <OrganizationProvider>
        <EditCandidate />
      </OrganizationProvider>
    }
  />

     </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>

  );
};

export default App;