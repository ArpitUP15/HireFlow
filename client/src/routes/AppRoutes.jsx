import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import { useAuth } from "../context/useAuth";
import { useOrganization } from "../context/useOrganization";
import DashboardLayout from "../components/common/DashboardLayout";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AcceptInvitation from "../pages/auth/AcceptInvitation";
import Dashboard from "../pages/DashBoard";
import CandidateDashboard from "../pages/portal/CandidateDashboard";
import JobPortal from "../pages/portal/JobPortal";
import CandidateProfile from "../pages/portal/CandidateProfile";
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
import InterviewAssistant from "../pages/interviews/InterviewAssistant";
import AdminDashboard from "../pages/admin/AdminDashboard";
import NotFound from "../pages/NotFound";
import Unauthorized from "../pages/Unauthorized";
import Pipeline from "../pages/pipeline/Pipeline";
import Legal from "../pages/Legal";
const StaffOnly = () =>
  useAuth().user.role === "candidate" ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Outlet />
  );
const CandidateOnly = () =>
  useAuth().user.role === "candidate" ? (
    <Outlet />
  ) : (
    <Navigate to="/dashboard" replace />
  );
const OrganizationOwnerOnly = () => {
  const { hasRole } = useOrganization();
  return hasRole("owner") ? (
    <Outlet />
  ) : (
    <Navigate to="/dashboard" replace />
  );
};
const CandidateManagement = () =>
  useAuth().user.role === "recruiter" ? (
    <Navigate to="/applications" replace />
  ) : (
    <Outlet />
  );
const AdminOnly = () =>
  useAuth().user.role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" replace />
  );
const DashboardPage = () => {
  const { user } = useAuth();
  const { hasPermission, membership } = useOrganization();
  return user.role === "admin" ? (
    <Navigate to="/admin" replace />
  ) : user.role === "candidate" ? (
    <CandidateDashboard />
  ) : !membership ? (
    <OrganizationDashboard />
  ) : user.role === "recruiter" ? (
    <Dashboard />
  ) : hasPermission("viewAnalytics") ? (
    <Dashboard />
  ) : hasPermission("manageInterviews") ? (
    <Navigate to="/interviews" replace />
  ) : (
    <OrganizationDashboard />
  );
};
const JobsPage = () =>
  useAuth().user.role === "candidate" ? <JobPortal /> : <Jobs />;
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/privacy" element={<Legal type="privacy" />} />
      <Route path="/terms" element={<Legal type="terms" />} />
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route path="/accept-invitation" element={<AcceptInvitation />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<StaffOnly />}>
          <Route path="/organization/setup" element={<OrganizationSetup />} />
        </Route>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route element={<CandidateOnly />}>
            <Route path="/profile" element={<CandidateProfile />} />
          </Route>
          <Route element={<StaffOnly />}>
            <Route path="/organization" element={<OrganizationDashboard />} />
            <Route element={<OrganizationOwnerOnly />}>
              <Route
                path="/organization/settings"
                element={<OrganizationSettings />}
              />
            </Route>
            <Route path="/team" element={<TeamManagement />} />
            <Route path="/jobs/create" element={<CreateJob />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/jobs/:id/edit" element={<EditJob />} />
            <Route element={<CandidateManagement />}>
              <Route path="/candidates" element={<Candidates />} />
              <Route path="/candidates/create" element={<CreateCandidate />} />
              <Route path="/candidates/:id" element={<CandidateDetails />} />
              <Route path="/candidates/:id/edit" element={<EditCandidate />} />
            </Route>
            <Route path="/applications" element={<Applications />} />
            <Route
              path="/applications/create"
              element={<CreateApplication />}
            />
            <Route path="/applications/:id" element={<ApplicationDetails />} />
            <Route path="/interviews" element={<Interviews />} />
            <Route path="/interviews/create" element={<CreateInterview />} />
            <Route path="/interviews/:id" element={<InterviewDetails />} />
            <Route path="/interviews/:id/edit" element={<EditInterview />} />
            <Route
              path="/interviews/:id/assistant"
              element={<InterviewAssistant />}
            />
            <Route path="/pipeline" element={<Pipeline />} />
          </Route>
          <Route element={<AdminOnly />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Route>
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
