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
    <div className="min-h-screen p-6 lg:p-8 bg-linear-to-b from- to-slate-900 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Jobs
            </h1>

            <p className="mt-2 text-gray-500">
              Manage your organization's job openings.
            </p>
          </div>

          <button
            onClick={() =>
              (window.location.href =
                "/jobs/create")
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Create Job
          </button>
        </div>

        <div className="mt-8 flex gap-3">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2  text-gray-400"
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
              className="w-full rounded-lg border border-gray-300  py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <button
            onClick={loadJobs}
            className="rounded-lg bg-gray-900 px-5 py-2.5 font-medium text-white"
          >
            Search
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-500">
            Loading jobs...
          </div>
        ) : jobs.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed  py-20 text-center">
            <h2 className="text-xl font-semibold">
              No jobs found
            </h2>

            <p className="mt-2 text-gray-500">
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