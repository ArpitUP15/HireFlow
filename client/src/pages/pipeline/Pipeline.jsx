import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  ChevronDown,
  Loader2,
  RefreshCw,
  User,
  Users,
} from "lucide-react";

import {
  getApplications,
  updateApplicationStatus,
} from "../../services/applicationService";

const PIPELINE_COLUMNS = [
  {
    id: "applied",
    title: "Applied",
    description: "New applications",
  },
  {
    id: "screening",
    title: "Screening",
    description: "Under review",
  },
  {
    id: "shortlisted",
    title: "Shortlisted",
    description: "Selected for next step",
  },
  {
    id: "interview",
    title: "Interview",
    description: "Interview stage",
  },
  {
    id: "selected",
    title: "Selected",
    description: "Selected candidates",
  },
  {
    id: "rejected",
    title: "Rejected",
    description: "Rejected applications",
  },
];

const Pipeline = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const loadApplications = async ({
    showLoader = true,
  } = {}) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const response = await getApplications();

      setApplications(
        Array.isArray(response?.applications)
          ? response.applications
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load applications:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load recruitment pipeline."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const groupedApplications = useMemo(() => {
    const grouped = {};

    PIPELINE_COLUMNS.forEach((column) => {
      grouped[column.id] = [];
    });

    applications.forEach((application) => {
      const status = application?.status;

      if (grouped[status]) {
        grouped[status].push(application);
      } else {
        grouped.applied.push(application);
      }
    });

    return grouped;
  }, [applications]);

  const handleStatusChange = async (
    applicationId,
    newStatus
  ) => {
    const previousApplications = [
      ...applications,
    ];

    try {
      setUpdatingId(applicationId);
      setError("");

      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application._id === applicationId
            ? {
                ...application,
                status: newStatus,
              }
            : application
        )
      );

      await updateApplicationStatus(
        applicationId,
        newStatus
      );
    } catch (err) {
      console.error(
        "Failed to update application status:",
        err
      );

      setApplications(previousApplications);

      setError(
        err?.response?.data?.message ||
          "Failed to update application status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getCandidateName = (application) => {
    const candidate = application?.candidate;

    if (!candidate) {
      return "Unknown Candidate";
    }

    const fullName = [
      candidate.firstName,
      candidate.lastName,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      fullName ||
      candidate.name ||
      "Unknown Candidate"
    );
  };

  const getCandidateEmail = (application) => {
    return (
      application?.candidate?.email ||
      "No email available"
    );
  };

  const getJobTitle = (application) => {
    return (
      application?.job?.title ||
      application?.job?.name ||
      "Job not available"
    );
  };

  const formatDate = (date) => {
    if (!date) {
      return "No date";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "applied":
        return "border-blue-500/20 bg-blue-500/10 text-blue-400";

      case "screening":
        return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";

      case "shortlisted":
        return "border-purple-500/20 bg-purple-500/10 text-purple-400";

      case "interview":
        return "border-orange-500/20 bg-orange-500/10 text-orange-400";

      case "selected":
        return "border-green-500/20 bg-green-500/10 text-green-400";

      case "rejected":
        return "border-red-500/20 bg-red-500/10 text-red-400";

      default:
        return "border-white/10 bg-white/5 text-slate-400";
    }
  };

  const renderApplicationCard = (
    application
  ) => {
    const applicationId =
      application?._id;

    const currentStatus =
      application?.status || "applied";

    const isUpdating =
      updatingId === applicationId;

    return (
      <div
        key={applicationId}
        className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-lg transition hover:border-blue-500/30 hover:bg-slate-900"
      >
        {/* Candidate information */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <User size={18} />
            </div>

            <div className="min-w-0">
              <h3 className="truncate font-semibold text-white">
                {getCandidateName(
                  application
                )}
              </h3>

              <p className="truncate text-xs text-slate-500">
                {getCandidateEmail(
                  application
                )}
              </p>
            </div>
          </div>

          {isUpdating && (
            <Loader2
              size={17}
              className="shrink-0 animate-spin text-blue-400"
            />
          )}
        </div>

        {/* Job */}
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
          <BriefcaseBusiness
            size={15}
          />

          <span className="truncate">
            {getJobTitle(application)}
          </span>
        </div>

        {/* Application date */}
        <p className="mt-3 text-xs text-slate-500">
          Applied{" "}
          {formatDate(
            application?.createdAt
          )}
        </p>

        {/* Status selector */}
        <div className="relative mt-4">
          <select
            value={currentStatus}
            disabled={isUpdating}
            onChange={(event) =>
              handleStatusChange(
                applicationId,
                event.target.value
              )
            }
            className={`w-full appearance-none rounded-xl border px-3 py-2.5 pr-9 text-sm font-medium outline-none transition focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60 ${getStatusColor(
              currentStatus
            )}`}
          >
            {PIPELINE_COLUMNS.map(
              (column) => (
                <option
                  key={column.id}
                  value={column.id}
                  className="bg-slate-900 text-white"
                >
                  {column.title}
                </option>
              )
            )}
          </select>

          <ChevronDown
            size={17}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2
            size={40}
            className="animate-spin text-blue-500"
          />

          <p className="mt-4 text-sm text-slate-400">
            Loading recruitment pipeline...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-white sm:p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 text-blue-500">
              <Users size={23} />
            </div>

            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                Recruitment Pipeline
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Track candidates through every
                recruitment stage.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            loadApplications({
              showLoader: false,
            })
          }
          disabled={refreshing}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {PIPELINE_COLUMNS.map(
          (column) => (
            <div
              key={column.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {column.title}
              </p>

              <p className="mt-2 text-2xl font-bold text-white">
                {
                  groupedApplications[
                    column.id
                  ].length
                }
              </p>
            </div>
          )
        )}
      </div>

      {/* Pipeline */}
      {applications.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">
          <Users
            size={48}
            className="text-slate-600"
          />

          <h2 className="mt-4 text-xl font-semibold text-white">
            No applications yet
          </h2>

          <p className="mt-2 max-w-md text-center text-sm text-slate-500">
            Applications will appear here as
            candidates apply for your jobs.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-6">
          <div className="flex min-w-[1500px] gap-4">
            {PIPELINE_COLUMNS.map(
              (column) => {
                const columnApplications =
                  groupedApplications[
                    column.id
                  ];

                return (
                  <section
                    key={column.id}
                    className="flex w-[245px] shrink-0 flex-col rounded-2xl border border-white/10 bg-white/[0.02]"
                  >
                    {/* Column header */}
                    <div className="border-b border-white/10 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="font-semibold text-white">
                            {column.title}
                          </h2>

                          <p className="mt-1 text-xs text-slate-500">
                            {column.description}
                          </p>
                        </div>

                        <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-white/10 px-2 text-xs font-semibold text-slate-300">
                          {
                            columnApplications.length
                          }
                        </span>
                      </div>
                    </div>

                    {/* Cards */}
                    <div className="flex min-h-[300px] flex-1 flex-col gap-3 p-3">
                      {columnApplications.length ===
                      0 ? (
                        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-white/10 p-5 text-center">
                          <p className="text-xs text-slate-600">
                            No applications
                          </p>
                        </div>
                      ) : (
                        columnApplications.map(
                          (
                            application
                          ) =>
                            renderApplicationCard(
                              application
                            )
                        )
                      )}
                    </div>
                  </section>
                );
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Pipeline;