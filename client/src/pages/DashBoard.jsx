import {
  useEffect,
  useState,
} from "react";

import {
  BriefcaseBusiness,
  Users,
  FileText,
  UserCheck,
  Loader2,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

import {
  getDashboardAnalytics,
} from "../services/analyticsService";

const DashBoard = () => {
  const [
    dashboardData,
    setDashboardData,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load Analytics
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadDashboard =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await getDashboardAnalytics();

          setDashboardData(
            response?.analytics || null
          );
        } catch (error) {
          console.error(
            "Dashboard analytics error:",
            error
          );

          setError(
            error?.response?.data?.message ||
              "Failed to load dashboard analytics."
          );
        } finally {
          setLoading(false);
        }
      };

    loadDashboard();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2
            size={40}
            className="animate-spin text-blue-500"
          />

          <p className="mt-4 text-sm text-slate-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
          <div className="flex items-center gap-3">
            <AlertCircle
              size={24}
              className="text-red-400"
            />

            <div>
              <h2 className="font-semibold text-white">
                Unable to load dashboard
              </h2>

              <p className="mt-1 text-sm text-red-300">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Default Data
  |--------------------------------------------------------------------------
  */

  const overview =
    dashboardData?.overview || {
      totalJobs: 0,
      activeJobs: 0,
      totalCandidates: 0,
      totalApplications: 0,
      totalHired: 0,
    };

  const pipeline =
    dashboardData?.pipeline || {
      applied: 0,
      screening: 0,
      shortlisted: 0,
      interview: 0,
      selected: 0,
      rejected: 0,
    };

  const recentApplications =
    dashboardData?.recentApplications ||
    [];

  const jobStatistics =
    dashboardData?.jobStatistics || [];

  /*
  |--------------------------------------------------------------------------
  | Stat Cards
  |--------------------------------------------------------------------------
  */

  const stats = [
    {
      title: "Total Jobs",
      value: overview.totalJobs,
      icon: BriefcaseBusiness,
    },

    {
      title: "Active Jobs",
      value: overview.activeJobs,
      icon: TrendingUp,
    },

    {
      title: "Candidates",
      value: overview.totalCandidates,
      icon: Users,
    },

    {
      title: "Applications",
      value: overview.totalApplications,
      icon: FileText,
    },

    {
      title: "Hired",
      value: overview.totalHired,
      icon: UserCheck,
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | Pipeline
  |--------------------------------------------------------------------------
  */

  const pipelineItems = [
    {
      label: "Applied",
      value: pipeline.applied,
    },

    {
      label: "Screening",
      value: pipeline.screening,
    },

    {
      label: "Shortlisted",
      value: pipeline.shortlisted,
    },

    {
      label: "Interview",
      value: pipeline.interview,
    },

    {
      label: "Selected",
      value: pipeline.selected,
    },

    {
      label: "Rejected",
      value: pipeline.rejected,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-white sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-blue-400">
          Recruitment Overview
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-400">
          Monitor your recruitment activity
          and hiring performance.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map(
          ({
            title,
            value,
            icon: Icon,
          }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/3 p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-500/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                  <Icon
                    size={21}
                    className="text-blue-400"
                  />
                </div>
              </div>

              <p className="mt-5 text-sm text-slate-400">
                {title}
              </p>

              <p className="mt-1 text-3xl font-bold">
                {value}
              </p>
            </div>
          )
        )}
      </div>

      {/* Pipeline */}
      <section className="mt-8 rounded-2xl border border-white/10 bg-white/3 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Recruitment Pipeline
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Candidate progression through
            your hiring process.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {pipelineItems.map(
            (item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/10 bg-slate-900/60 p-4"
              >
                <p className="text-sm text-slate-500">
                  {item.label}
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {item.value}
                </p>
              </div>
            )
          )}
        </div>
      </section>

      {/* Bottom Grid */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        {/* Recent Applications */}
        <section className="rounded-2xl border border-white/10 bg-white/3 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Recent Applications
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest candidate applications.
            </p>
          </div>

          {recentApplications.length ===
          0 ? (
            <div className="py-10 text-center text-sm text-slate-500">
              No applications found.
            </div>
          ) : (
            <div className="space-y-3">
              {recentApplications.map(
                (application) => {
                  const candidate =
                    application.candidate;

                  const candidateName =
                    candidate
                      ? `${candidate.firstName || ""} ${
                          candidate.lastName || ""
                        }`.trim()
                      : "Unknown Candidate";

                  return (
                    <div
                      key={
                        application._id
                      }
                      className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-900/60 p-4"
                    >
                      <div>
                        <p className="font-medium">
                          {candidateName}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {application.job
                            ?.title ||
                            "Unknown Job"}
                        </p>
                      </div>

                      <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium capitalize text-blue-400">
                        {
                          application.status
                        }
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </section>

        {/* Job Statistics */}
        <section className="rounded-2xl border border-white/10 bg-white/3 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Job Performance
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Applications and hires by job.
            </p>
          </div>

          {jobStatistics.length ===
          0 ? (
            <div className="py-10 text-center text-sm text-slate-500">
              No job application data
              available.
            </div>
          ) : (
            <div className="space-y-4">
              {jobStatistics.map(
                (job) => (
                  <div
                    key={job.jobId}
                    className="rounded-xl border border-white/5 bg-slate-900/60 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium">
                        {job.title ||
                          "Untitled Job"}
                      </p>

                      <span className="text-sm text-blue-400">
                        {
                          job.applications
                        }{" "}
                        applications
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>
                        Applications
                      </span>

                      <span>
                        {job.applications}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                      <span>
                        Selected
                      </span>

                      <span className="text-green-400">
                        {job.selected}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default DashBoard;