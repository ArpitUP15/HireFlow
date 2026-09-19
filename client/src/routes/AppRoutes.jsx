import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";


// =====================================================
// ROUTES
// =====================================================

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";


// =====================================================
// AUTH PAGES
// =====================================================

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AcceptInvitation from "../pages/auth/AcceptInvitation";


// =====================================================
// GENERAL PAGES
// =====================================================

import Home from "../pages/Home";
import Dashboard from "../pages/DashBoard";
import NotFound from "../pages/NotFound";
import Unauthorized from "../pages/Unauthorized";


// =====================================================
// ORGANIZATION
// =====================================================

import OrganizationSetup from "../pages/organization/OrganizationSetup";
import OrganizationDashboard from "../pages/organization/OrganizationDashboard";
import OrganizationSettings from "../pages/organization/OrganizationSettings";


// =====================================================
// TEAM
// =====================================================

import TeamManagement from "../pages/TeamManagement";


// =====================================================
// JOBS
// =====================================================

import Jobs from "../pages/jobs/Jobs";
import CreateJob from "../pages/jobs/CreateJob";
import EditJob from "../pages/jobs/EditJob";
import JobDetails from "../pages/jobs/JobDetails";


// =====================================================
// CANDIDATES
// =====================================================

import Candidates from "../pages/candidates/Candidates";
import CreateCandidate from "../pages/candidates/CreateCandidate";
import EditCandidate from "../pages/candidates/EditCandidate";
import CandidateDetails from "../pages/candidates/CandidateDetails";


// =====================================================
// APPLICATIONS
// =====================================================

import Applications from "../pages/applications/Applications";
import CreateApplication from "../pages/applications/CreateApplication";
import ApplicationDetails from "../pages/applications/ApplicationDetails";


// =====================================================
// INTERVIEWS — PHASE 6
// =====================================================

import Interviews from "../pages/interviews/Interviews";
import CreateInterview from "../pages/interviews/CreateInterview";
import InterviewDetails from "../pages/interviews/InterviewDetails";


// =====================================================
// LAYOUT
// =====================================================

import DashboardLayout from "../components/common/DashboardLayout";


// =====================================================
// APP ROUTES
// =====================================================

const AppRoutes = () => {

  return (

    <Routes>


      {/* =================================================
          PUBLIC HOME
      ================================================= */}

      <Route
        path="/"
        element={
          <Home />
        }
      />


      {/* =================================================
          PUBLIC ROUTES
      ================================================= */}

      <Route
        element={
          <PublicRoute />
        }
      >

        <Route
          path="/login"
          element={
            <Login />
          }
        />

        <Route
          path="/register"
          element={
            <Register />
          }
        />

      </Route>


      {/* =================================================
          ACCEPT INVITATION
      ================================================= */}

      <Route
        path="/accept-invitation"
        element={
          <AcceptInvitation />
        }
      />


      {/* =================================================
          PROTECTED ROUTES
      ================================================= */}

      <Route
        element={
          <ProtectedRoute />
        }
      >

        {/* =================================================
            DASHBOARD LAYOUT
        ================================================= */}
       <Route
         path="/organization/setup"
         element={
       <OrganizationSetup />
        }
       />
        <Route
          element={
            <DashboardLayout />
          }
        >


          {/* ===============================================
              DASHBOARD
          =============================================== */}

          <Route
            path="/dashboard"
            element={
              <Dashboard />
            }
          />


          {/* ===============================================
              ORGANIZATION
          =============================================== */}

          <Route
            path="/organization"
            element={
              <OrganizationDashboard />
            }
          />

          <Route
            path="/organization/settings"
            element={
              <OrganizationSettings />
            }
          />


          {/* ===============================================
              TEAM
          =============================================== */}

          <Route
            path="/team"
            element={
              <TeamManagement />
            }
          />


          {/* ===============================================
              JOBS
          =============================================== */}

          <Route
            path="/jobs"
            element={
              <Jobs />
            }
          />

          <Route
            path="/jobs/create"
            element={
              <CreateJob />
            }
          />

          <Route
            path="/jobs/:id"
            element={
              <JobDetails />
            }
          />

          <Route
            path="/jobs/:id/edit"
            element={
              <EditJob />
            }
          />


          {/* ===============================================
              CANDIDATES
          =============================================== */}

          <Route
            path="/candidates"
            element={
              <Candidates />
            }
          />

          <Route
            path="/candidates/create"
            element={
              <CreateCandidate />
            }
          />

          <Route
            path="/candidates/:id"
            element={
              <CandidateDetails />
            }
          />

          <Route
            path="/candidates/:id/edit"
            element={
              <EditCandidate />
            }
          />


          {/* ===============================================
              APPLICATIONS
          =============================================== */}

          <Route
            path="/applications"
            element={
              <Applications />
            }
          />

          <Route
            path="/applications/create"
            element={
              <CreateApplication />
            }
          />

          <Route
            path="/applications/:id"
            element={
              <ApplicationDetails />
            }
          />


          {/* ===============================================
              INTERVIEWS — PHASE 6
          =============================================== */}

          <Route
            path="/interviews"
            element={
              <Interviews />
            }
          />

          <Route
            path="/interviews/create"
            element={
              <CreateInterview />
            }
          />

          <Route
            path="/interviews/:id"
            element={
              <InterviewDetails />
            }
          />

        </Route>

      </Route>


      {/* =================================================
          UNAUTHORIZED
      ================================================= */}

      <Route
        path="/unauthorized"
        element={
          <Unauthorized />
        }
      />


      {/* =================================================
          404
      ================================================= */}

      <Route
        path="*"
        element={
          <NotFound />
        }
      />

    </Routes>
  );
};


export default AppRoutes;