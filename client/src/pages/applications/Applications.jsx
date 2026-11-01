import { useCallback, useEffect, useState } from "react";

import { Plus, Search } from "lucide-react";

import ApplicationCard from "../../components/application/ApplicationCard";

import {
  getApplications,
  updateApplicationStatus,
  deleteApplication,
  getRecruitmentPipeline,
} from "../../services/applicationService";

const Applications = () => {
  const [applications, setApplications] = useState([]);

  const [pipeline, setPipeline] = useState([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);

  const loadApplications = useCallback(async () => {
    try {
      const data = await getApplications({
        search,
        status,
      });

      setApplications(data.applications || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  const loadPipeline = async () => {
    try {
      const data = await getRecruitmentPipeline();

      setPipeline(
        Object.entries(data.pipeline || {}).map(([status, count]) => ({
          status,
          count,
        })),
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getApplications({ search, status })
      .then((d) => setApplications(d.applications || []))
      .catch(console.error)
      .finally(() => setLoading(false));
    getRecruitmentPipeline()
      .then((d) =>
        setPipeline(
          Object.entries(d.pipeline || {}).map(([status, count]) => ({
            status,
            count,
          })),
        ),
      )
      .catch(console.error);
  }, [search, status]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateApplicationStatus(id, newStatus);

      await loadApplications();
      await loadPipeline();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) {
      return;
    }

    try {
      await deleteApplication(id);

      await loadApplications();
      await loadPipeline();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete application");
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6 text-text lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-text">Applications</h1>

            <p className="mt-2 text-muted">
              Manage your recruitment pipeline.
            </p>
          </div>

          <button
            onClick={() => (window.location.href = "/applications/create")}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-background transition-opacity hover:bg-primary/90"
          >
            <Plus size={18} />
            New Application
          </button>
        </div>

        {/* Pipeline */}

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {pipeline.map((item) => (
            <button
              key={item.status}
              onClick={() => {
                setStatus(item.status);
              }}
              className="rounded-xl border border-border bg-surface/80 p-4 text-left shadow-sm transition-opacity hover:border-primary/70 hover:bg-surface-hover"
            >
              <p className="text-xs font-medium uppercase text-muted">
                {item.status}
              </p>

              <p className="mt-2 text-2xl font-bold text-text">
                {item.count}
              </p>
            </button>
          ))}
        </div>

        {/* Search */}

        <div className="mt-8 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  loadApplications();
                }
              }}
              placeholder="Search candidate or job..."
              className="w-full rounded-lg border border-border bg-surface/80 py-2.5 pl-10 pr-4 text-text placeholder:text-muted focus:border-primary focus:outline-none"
            />
          </div>

          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
            }}
            className="rounded-lg border border-border bg-surface/80 px-4 py-2.5 text-text"
          >
            <option value="" className="bg-surface text-text">
              All Statuses
            </option>

            <option value="applied" className="bg-surface text-text">
              Applied
            </option>

            <option
              value="screening"
              className="bg-surface text-text"
            >
              Screening
            </option>

            <option
              value="shortlisted"
              className="bg-surface text-text"
            >
              Shortlisted
            </option>

            <option
              value="interview"
              className="bg-surface text-text"
            >
              Interview
            </option>

            <option
              value="selected"
              className="bg-surface text-text"
            >
              Selected
            </option>

            <option
              value="rejected"
              className="bg-surface text-text"
            >
              Rejected
            </option>
          </select>

          <button
            onClick={loadApplications}
            className="rounded-lg bg-surface px-5 py-2.5 font-medium text-text transition-opacity hover:bg-surface"
          >
            Search
          </button>
        </div>

        {/* Applications */}

        {loading ? (
          <div className="py-20 text-center text-muted">
            Loading applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border bg-surface/40 py-20 text-center">
            <h2 className="text-xl font-semibold text-text">
              No applications found
            </h2>

            <p className="mt-2 text-muted">Create your first application.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {applications.map((application) => (
              <ApplicationCard
                key={application._id}
                application={application}
                onView={(id) => (window.location.href = `/applications/${id}`)}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
