import {
  useEffect,
  useState,
} from "react";

import {
  Plus,
  Search,
} from "lucide-react";

import ApplicationCard from "../../components/application/ApplicationCard";

import {
  getApplications,
  updateApplicationStatus,
  deleteApplication,
  getRecruitmentPipeline,
} from "../../services/applicationService";


const Applications = () => {

  const [
    applications,
    setApplications,
  ] = useState([]);

  const [pipeline, setPipeline] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [loading, setLoading] =
    useState(true);


  const loadApplications =
    async () => {

      try {

        setLoading(true);

        const data =
          await getApplications({
            search,
            status,
          });

        setApplications(
          data.applications ||
            []
        );

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }
    };


  const loadPipeline =
    async () => {

      try {

        const data =
          await getRecruitmentPipeline();

        setPipeline(
          data.pipeline || []
        );

      } catch (error) {

        console.error(error);

      }
    };


  useEffect(() => {

    loadApplications();
    loadPipeline();

  }, []);


  const handleStatusChange =
    async (
      id,
      newStatus
    ) => {

      try {

        await updateApplicationStatus(
          id,
          newStatus
        );

        await loadApplications();
        await loadPipeline();

      } catch (error) {

        alert(
          error.response?.data
            ?.message ||
            "Failed to update status"
        );

      }
    };


  const handleDelete =
    async (id) => {

      if (
        !window.confirm(
          "Delete this application?"
        )
      ) {
        return;
      }

      try {

        await deleteApplication(
          id
        );

        await loadApplications();
        await loadPipeline();

      } catch (error) {

        alert(
          error.response?.data
            ?.message ||
            "Failed to delete application"
        );

      }
    };


  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_30%),linear-gradient(180deg,#020817_0%,#0f172a_100%)] px-4 py-6 text-slate-100 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

          <div>

            <h1 className="text-3xl font-bold text-white">
              Applications
            </h1>

            <p className="mt-2 text-slate-400">
              Manage your recruitment pipeline.
            </p>

          </div>


          <button
            onClick={() =>
              (window.location.href =
                "/applications/create")
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-500"
          >
            <Plus size={18} />
            New Application
          </button>

        </div>


        {/* Pipeline */}

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">

          {pipeline.map(
            (item) => (
              <button
                key={
                  item.status
                }
                onClick={() => {
                  setStatus(
                    item.status
                  );

                  setTimeout(
                    loadApplications,
                    0
                  );
                }}
                className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 text-left shadow-sm transition hover:border-blue-500/70 hover:bg-slate-800"
              >

                <p className="text-xs font-medium uppercase text-slate-400">
                  {item.status}
                </p>

                <p className="mt-2 text-2xl font-bold text-white">
                  {item.count}
                </p>

              </button>
            )
          )}

        </div>


        {/* Search */}

        <div className="mt-8 flex flex-col gap-3 md:flex-row">

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
                  loadApplications();
                }

              }}
              placeholder="Search candidate or job..."
              className="w-full rounded-lg border border-slate-700 bg-slate-900/80 py-2.5 pl-10 pr-4 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            />

          </div>


          <select
            value={status}
            onChange={(event) => {

              setStatus(
                event.target.value
              );

            }}
            className="rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-slate-100"
          >

            <option value="" className="bg-slate-900 text-slate-100">
              All Statuses
            </option>

            <option value="applied" className="bg-slate-900 text-slate-100">
              Applied
            </option>

            <option value="screening" className="bg-slate-900 text-slate-100">
              Screening
            </option>

            <option value="shortlisted" className="bg-slate-900 text-slate-100">
              Shortlisted
            </option>

            <option value="interview" className="bg-slate-900 text-slate-100">
              Interview
            </option>

            <option value="selected" className="bg-slate-900 text-slate-100">
              Selected
            </option>

            <option value="rejected" className="bg-slate-900 text-slate-100">
              Rejected
            </option>

          </select>


          <button
            onClick={
              loadApplications
            }
            className="rounded-lg bg-slate-100 px-5 py-2.5 font-medium text-slate-900 transition hover:bg-slate-200"
          >
            Search
          </button>

        </div>


        {/* Applications */}

        {loading ? (

          <div className="py-20 text-center text-slate-400">
            Loading applications...
          </div>

        ) : applications.length ===
          0 ? (

          <div className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 py-20 text-center">

            <h2 className="text-xl font-semibold text-white">
              No applications found
            </h2>

            <p className="mt-2 text-slate-400">
              Create your first application.
            </p>

          </div>

        ) : (

          <div className="mt-8 grid gap-5 lg:grid-cols-2">

            {applications.map(
              (application) => (

                <ApplicationCard
                  key={
                    application._id
                  }
                  application={
                    application
                  }
                  onView={(id) =>
                    (window.location.href =
                      `/applications/${id}`)
                  }
                  onStatusChange={
                    handleStatusChange
                  }
                  onDelete={
                    handleDelete
                  }
                />

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
};

export default Applications;