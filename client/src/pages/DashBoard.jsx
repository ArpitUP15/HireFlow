import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Briefcase,
  FileText,
  UserCheck,
  LogOut,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

import { useAuth } from "../context/useAuth";
import { getJobs } from "../services/jobService";
import { getCandidates } from "../services/candidateService";
import {
  getApplications,
  getRecruitmentPipeline,
} from "../services/applicationService";

function Dashboard() {
  const { user, logout } = useAuth();

  // ============================================================
  // STATE
  // ============================================================
  const [dashboardData, setDashboardData] = useState({
    jobs: 0,
    candidates: 0,
    applications: 0,
    hired: 0,
    pipeline: {
      applied: 0,
      screening: 0,
      shortlisted: 0,
      interview: 0,
      selected: 0,
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // GET ARRAY FROM API RESPONSE
  // ============================================================
  const extractArray = (response) => {
    const data = response?.data;

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.jobs)) return data.jobs;
    if (Array.isArray(data?.candidates)) return data.candidates;
    if (Array.isArray(data?.applications)) return data.applications;
    if (Array.isArray(data?.data)) return data.data;

    return [];
  };

  // ============================================================
  // GET PIPELINE DATA
  // ============================================================
  const extractPipeline = (response, applications = []) => {
    const pipeline =
      response?.data?.pipeline ??
      response?.pipeline ??
      {};

    if (pipeline && typeof pipeline === "object" && !Array.isArray(pipeline)) {
      return {
        applied: Number(pipeline.applied ?? pipeline.Applied ?? 0),
        screening: Number(pipeline.screening ?? pipeline.Screening ?? 0),
        shortlisted: Number(pipeline.shortlisted ?? pipeline.Shortlisted ?? 0),
        interview: Number(pipeline.interview ?? pipeline.Interview ?? 0),
        selected: Number(pipeline.selected ?? pipeline.Selected ?? 0),
      };
    }

    const pipelineCounts = {
      applied: 0,
      screening: 0,
      shortlisted: 0,
      interview: 0,
      selected: 0,
    };

    applications.forEach((application) => {
      const status = String(application?.status || "")
        .toLowerCase()
        .replace(/[\s-]+/g, "_");

      switch (status) {
        case "applied":
          pipelineCounts.applied += 1;
          break;
        case "screening":
        case "screened":
          pipelineCounts.screening += 1;
          break;
        case "shortlisted":
        case "shortlist":
          pipelineCounts.shortlisted += 1;
          break;
        case "interview":
        case "interview_scheduled":
          pipelineCounts.interview += 1;
          break;
        case "selected":
        case "hired":
          pipelineCounts.selected += 1;
          break;
        default:
          break;
      }
    });

    return pipelineCounts;
  };

  // ============================================================
  // LOAD DASHBOARD DATA
  // ============================================================
  const loadDashboardData = async () => {
    const organizationId = localStorage.getItem("currentOrganizationId");

    if (!organizationId) {
      setLoading(false);
      setError("Create or select an organization to view your dashboard.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [
        jobsResponse,
        candidatesResponse,
        applicationsResponse,
        pipelineResponse,
      ] = await Promise.all([
        getJobs(),
        getCandidates(),
        getApplications(),
        getRecruitmentPipeline(),
      ]);

      const jobs = extractArray(jobsResponse);
      const candidates = extractArray(candidatesResponse);
      const applications = extractArray(applicationsResponse);

      const hiredCount = applications.filter((application) => {
        const status = String(application?.status || "").toLowerCase();
        return status === "hired" || status === "selected";
      }).length;

      const pipeline = extractPipeline(pipelineResponse, applications);

      setDashboardData({
        jobs: jobs.length,
        candidates: candidates.length,
        applications: applications.length,
        hired: hiredCount,
        pipeline,
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load dashboard data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================
  useEffect(() => {
    loadDashboardData();
  }, []);

  // ============================================================
  // STATS & PIPELINE CONFIG ARRAYS
  // ============================================================
  const stats = [
    { title: "Total Jobs", value: dashboardData.jobs, icon: Briefcase },
    { title: "Candidates", value: dashboardData.candidates, icon: Users },
    { title: "Applications", value: dashboardData.applications, icon: FileText },
    { title: "Hired", value: dashboardData.hired, icon: UserCheck },
  ];

  const pipeline = [
    { title: "Applied", value: dashboardData.pipeline.applied },
    { title: "Screening", value: dashboardData.pipeline.screening },
    { title: "Shortlisted", value: dashboardData.pipeline.shortlisted },
    { title: "Interview", value: dashboardData.pipeline.interview },
    { title: "Selected", value: dashboardData.pipeline.selected },
  ];

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <RefreshCw size={40} className="mx-auto animate-spin text-blue-500" />
          <p className="mt-4 text-sm text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN DASHBOARD RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">
              Hire<span className="text-blue-500">Flow</span>
            </h1>
            <p className="mt-1 text-sm text-slate-400">Recruitment Dashboard</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="font-medium">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs capitalize text-slate-400">
                {user?.role?.replace(/_/g, " ")}
              </p>
            </div>

            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:bg-white/5"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Welcome Section */}
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-bold">
              Welcome back, {user?.firstName || "User"} 👋
            </h2>
            <p className="mt-2 text-slate-400">
              Here's what's happening with your recruitment activities.
            </p>
          </div>

          <button
            type="button"
            onClick={loadDashboardData}
            disabled={loading}
            className="flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh Data
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
            <AlertCircle size={20} className="mt-0.5 shrink-0 text-red-400" />
            <div>
              <p className="font-medium text-red-300">
                Dashboard data could not be loaded
              </p>
              <p className="mt-1 text-sm text-red-400">{error}</p>
              <button
                type="button"
                onClick={loadDashboardData}
                className="mt-3 text-sm font-medium text-red-300 underline underline-offset-4 hover:text-red-200"
              >
                Try again
              </button>
              {error ===
                "Create or select an organization to view your dashboard." && (
                <Link
                  to="/organization/setup"
                  className="ml-4 text-sm font-medium text-red-300 underline underline-offset-4 hover:text-red-200"
                >
                  Set up an organization
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Statistics Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-white/10 bg-white/3 p-6 transition hover:border-white/20 hover:bg-white/5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{stat.title}</p>
                    <h2 className="mt-2 text-3xl font-bold">
                      {stat.value.toLocaleString()}
                    </h2>
                  </div>
                  <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                    <Icon size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recruitment Pipeline */}
        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Recruitment Pipeline</h2>
              <p className="mt-1 text-sm text-slate-500">
                Current applications by recruitment stage.
              </p>
            </div>
            <CheckCircle size={22} className="text-green-400" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-5">
            {pipeline.map((stage) => (
              <div
                key={stage.title}
                className="rounded-2xl border border-white/10 bg-white/3 p-5 transition hover:border-white/20 hover:bg-white/5"
              >
                <p className="text-sm text-slate-400">{stage.title}</p>
                <p className="mt-3 text-2xl font-bold">
                  {stage.value.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Data Summary */}
        <section className="mt-10 rounded-2xl border border-white/10 bg-white/3 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-green-500/10 p-3">
              <CheckCircle size={22} className="text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold">Live Recruitment Data</h3>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Dashboard statistics are loaded directly from your HireFlow
                backend instead of using hardcoded values.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;