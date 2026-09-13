import { Routes, Route, Navigate } from "react-router-dom";

// Protected Route Component
import ProtectedRoute from "./ProtectedRoute";

// Authentication Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Dashboard Page
import Dashboard from "../../src/pages/DashBoard";

// Job Management Pages
import Jobs from "../pages/jobs/Jobs";
import CreateJob from "../pages/jobs/CreateJob";
import EditJob from "../pages/jobs/EditJob";
import JobDetails from "../pages/jobs/JobDetails";

// Candidate Management Pages
import Candidates from "../pages/candidates/Candidates";
import CreateCandidate from "../pages/candidates/CreateCandidate";
import EditCandidate from "../pages/candidates/EditCandidate";
import CandidateDetails from "../pages/candidates/CandidateDetails";

// Application Management Pages
import Applications from "../pages/applications/Applications";
import CreateApplication from "../pages/applications/CreateApplication";
import ApplicationDetails from "../pages/applications/ApplicationDetails";

/**
 * AppRoutes Component
 * Handles all public, protected, and fallback routing configuration for HireFlow.
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* ========================================
          PUBLIC ROUTES
          ======================================== */}
      <Route
        path="/login"
        element={<Login />}
      />
      <Route
        path="/register"
        element={<Register />}
      />

      {/* ========================================
          PROTECTED ROUTES
          ======================================== */}
      <Route element={<ProtectedRoute />}>
        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* ======================================
            JOB ROUTES
            ====================================== */}
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

        {/* ======================================
            CANDIDATE ROUTES
            ====================================== */}
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

        {/* ======================================
            APPLICATION ROUTES
            ====================================== */}
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

      {/* ========================================
          DEFAULT ROUTE
          ======================================== */}
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      {/* ========================================
          404 FALLBACK ROUTE
          ======================================== */}
      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
};

export default AppRoutes;