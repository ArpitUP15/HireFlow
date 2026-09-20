import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

import DashboardLayout from "../components/common/DashboardLayout";

import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AcceptInvitation from "../pages/auth/AcceptInvitation";

import Dashboard from "../pages/DashBoard";

import OrganizationSetup from "../pages/organization/OrganizationSetup";
import OrganizationDashboard from "../pages/organization/OrganizationDashboard";
import OrganizationSettings from "../pages/organization/OrganizationSettings";

import TeamManagement from "../pages/TeamManagement";

import Jobs from "../pages/jobs/Jobs";
import CreateJob from "../pages/jobs/CreateJob";
import EditJob from "../pages/jobs/EditJob";
import JobDetails from "../pages/jobs/JobDetails";

import Candidates from "../pages/candidates/Candidates";
import CreateCandidate from "../pages/candidates/CreateCandidate";
import EditCandidate from "../pages/candidates/EditCandidate";
import CandidateDetails from "../pages/candidates/CandidateDetails";

import Applications from "../pages/applications/Applications";
import CreateApplication from "../pages/applications/CreateApplication";
import ApplicationDetails from "../pages/applications/ApplicationDetails";

import Interviews from "../pages/interviews/Interviews";
import CreateInterview from "../pages/interviews/CreateInterview";
import InterviewDetails from "../pages/interviews/InterviewDetails";
import EditInterview from "../pages/interviews/EditInterview";
import NotFound from "../pages/NotFound";
import Unauthorized from "../pages/Unauthorized";

const AppRoutes = () => {
  return (
    <Routes>

      {/* =========================
          PUBLIC ROUTES
      ========================== */}

      <Route
        path="/"
        element={<Home />}
      />

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

      {/* =========================
          PROTECTED ROUTES
      ========================== */}

      <Route element={<ProtectedRoute />}>

        {/* Organization Setup
            WITHOUT DashboardLayout */}
        <Route
          path="/organization/setup"
          element={<OrganizationSetup />}
        />

        {/* =========================
            DASHBOARD LAYOUT
        ========================== */}

        <Route element={<DashboardLayout />}>

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

          {/* Interviews */}
          <Route
            path="/interviews"
            element={<Interviews />}
          />

          <Route
            path="/interviews/create"
            element={<CreateInterview />}
          />

          <Route
            path="/interviews/:id"
            element={<InterviewDetails />}
          />

          <Route
            path="/interviews/:id/edit"
            element={<EditInterview />}
          />

        </Route>
      </Route>

      {/* =========================
          OTHER ROUTES
      ========================== */}

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
};

export default AppRoutes;