import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Routes
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

// Auth
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AcceptInvitation from "../pages/auth/AcceptInvitation";

// General
import Home from "../pages/Home";
import Dashboard from "../pages/DashBoard";
import NotFound from "../pages/NotFound";
import Unauthorized from "../pages/Unauthorized";

// Organization
import OrganizationSetup from "../pages/organization/OrganizationSetup";
import OrganizationDashboard from "../pages/organization/OrganizationDashboard";
import OrganizationSettings from "../pages/organization/OrganizationSettings";

// Team
import TeamManagement from "../pages/TeamManagement";

// Jobs
import Jobs from "../pages/jobs/Jobs";
import CreateJob from "../pages/jobs/CreateJob";
import EditJob from "../pages/jobs/EditJob";
import JobDetails from "../pages/jobs/JobDetails";

// Candidates
import Candidates from "../pages/candidates/Candidates";
import CreateCandidate from "../pages/candidates/CreateCandidate";
import EditCandidate from "../pages/candidates/EditCandidate";
import CandidateDetails from "../pages/candidates/CandidateDetails";

// Applications
import Applications from "../pages/applications/Applications";
import CreateApplication from "../pages/applications/CreateApplication";
import ApplicationDetails from "../pages/applications/ApplicationDetails";

const AppRoutes = () => {
  return (
    <Routes>

      {/* ==================================================
          PUBLIC ROUTES
          ================================================== */}

      <Route path="/" element={<Home />} />

      <Route element={<PublicRoute />}>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />
      </Route>

      <Route
        path="/accept-invitation"
        element={<AcceptInvitation />}
      />

      {/* ==================================================
          PROTECTED ROUTES
          ================================================== */}

      <Route element={<ProtectedRoute />}>

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* Organization */}
        <Route
          path="/organization"
          element={<OrganizationDashboard />}
        />

        <Route
          path="/organization/setup"
          element={<OrganizationSetup />}
        />

        <Route
          path="/organization/settings"
          element={<OrganizationSettings />}
        />

        {/* Team */}
        <Route
          path="/team"
          element={<TeamManagement />}
        />

        {/* Jobs */}
        <Route
          path="/jobs"
          element={<Jobs />}
        />

        <Route
          path="/jobs/create"
          element={<CreateJob />}
        />

        <Route
          path="/jobs/:id"
          element={<JobDetails />}
        />

        <Route
          path="/jobs/:id/edit"
          element={<EditJob />}
        />

        {/* Candidates */}
        <Route
          path="/candidates"
          element={<Candidates />}
        />

        <Route
          path="/candidates/create"
          element={<CreateCandidate />}
        />

        <Route
          path="/candidates/:id"
          element={<CandidateDetails />}
        />

        <Route
          path="/candidates/:id/edit"
          element={<EditCandidate />}
        />

        {/* Applications */}
        <Route
          path="/applications"
          element={<Applications />}
        />

        <Route
          path="/applications/create"
          element={<CreateApplication />}
        />

        <Route
          path="/applications/:id"
          element={<ApplicationDetails />}
        />

      </Route>

      {/* ==================================================
          UNAUTHORIZED
          ================================================== */}

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />

      {/* ==================================================
          404
          ================================================== */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
};

export default AppRoutes;