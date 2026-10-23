import {
  useEffect,
  useState,
} from "react";

import {
  Plus,
  Search,
} from "lucide-react";

import JobCard from "../../components/jobs/JobCard";

import {
  getJobs,
  deleteJob,
  publishJob,
  closeJob,
} from "../../services/jobService";

const Jobs = () => {
  const [jobs, setJobs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const loadJobs = async () => {
    try {
      setLoading(true);

      const data =
        await getJobs({
          search,
        });

      setJobs(data.jobs || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleDelete = async (
    id
  ) => {
    if (
      !window.confirm(
        "Delete this job?"
      )
    ) {
      return;
    }

    try {
      await deleteJob(id);

      await loadJobs();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to delete job"
      );
    }
  };

  const handlePublish = async (
    id
  ) => {
    try {
      await publishJob(id);

      await loadJobs();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to publish job"
      );
    }
  };

  const handleClose = async (
    id
  ) => {
    try {
      await closeJob(id);

      await loadJobs();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to close job"
      );
    }
  };

  return (
    <div className="min-h-screen bg-neutral px-4 py-6 text-primary lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Jobs
            </h1>

            <p className="mt-2 text-slate-400">
              Manage your organization's job openings.
            </p>
          </div>

          <button
            onClick={() =>
              (window.location.href =
                "/jobs/create")
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-500"
          >
            <Plus size={18} />
            Create Job
          </button>
        </div>

        <div className="mt-8 flex gap-3">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key ===
                  "Enter"
                ) {
                  loadJobs();
                }
              }}
              placeholder="Search jobs..."
              className="w-full rounded-lg border border-slate-700 bg-slate-900/80 py-2.5 pl-10 pr-4 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <button
            onClick={loadJobs}
            className="rounded-lg bg-slate-100 px-5 py-2.5 font-medium text-slate-900 transition hover:bg-slate-200"
          >
            Search
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400">
            Loading jobs...
          </div>
        ) : jobs.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 py-20 text-center">
            <h2 className="text-xl font-semibold text-white">
              No jobs found
            </h2>

            <p className="mt-2 text-slate-400">
              Create your first job opening.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onView={(id) =>
                  (window.location.href =
                    `/jobs/${id}`)
                }
                onEdit={(id) =>
                  (window.location.href =
                    `/jobs/${id}/edit`)
                }
                onDelete={
                  handleDelete
                }
                onPublish={
                  handlePublish
                }
                onClose={
                  handleClose
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;