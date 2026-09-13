import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import ProtectedRoute from "./components/common/ProtectedRoute";

// Auth
import Login from "./pages/Login";
import Register from "./pages/Register";

// Dashboard
import Dashboard from "./pages/DashBoard";

// Phase 4 - Jobs
import Jobs from "./pages/jobs/Jobs";
import CreateJob from "./pages/jobs/CreateJob";

import EditJob from "./pages/jobs/EditJob";
import JobDetails from "./pages/jobs/JobDetails";

// Phase 4 - Candidates
import Candidates from "./pages/candidates/Candidates";
import CreateCandidate from "./pages/candidates/CreateCandidate";
import EditCandidate from "./pages/candidates/EditCandidate";
import CandidateDetails from "./pages/candidates/CandidateDetails";

// Phase 5 - Applications
import Applications from "./pages/applications/Applications";
import CreateApplication from "./pages/applications/CreateApplication";
import ApplicationDetails from "./pages/applications/ApplicationDetails";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* =====================================================
            PUBLIC ROUTES
        ===================================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =====================================================
            PROTECTED ROUTES
        ===================================================== */}

        <Route element={<ProtectedRoute />}>

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
          <Route
  path="/applications"
  element={
    <OrganizationProvider>
      <Applications />
    </OrganizationProvider>
  }
/>

<Route
  path="/applications/create"
  element={
    <OrganizationProvider>
      <CreateApplication />
    </OrganizationProvider>
  }
/>

<Route
  path="/applications/:id"
  element={
    <OrganizationProvider>
      <ApplicationDetails />
    </OrganizationProvider>
  }
/>


          {/* =================================================
              PHASE 4 - JOBS
          ================================================= */}

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


          {/* =================================================
              PHASE 4 - CANDIDATES
          ================================================= */}

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


          {/* =================================================
              PHASE 5 - APPLICATIONS
          ================================================= */}

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


        {/* =====================================================
            FALLBACK
        ===================================================== */}

        <Route
          path="*"
          element={<Login />}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;