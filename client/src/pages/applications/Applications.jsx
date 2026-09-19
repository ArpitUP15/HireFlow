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
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">

      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

          <div>

            <h1 className="text-3xl font-bold">
              Applications
            </h1>

            <p className="mt-2 text-gray-500">
              Manage your recruitment pipeline.
            </p>

          </div>


          <button
            onClick={() =>
              (window.location.href =
                "/applications/create")
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
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
                className="rounded-xl border    p-4 text-left shadow-sm hover:shadow-md"
              >

                <p className="text-xs font-medium uppercase text-gray-500">
                  {item.status}
                </p>

                <p className="mt-2 text-2xl font-bold">
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
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
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
              className="w-full rounded-lg border border-gray-300    py-2.5 pl-10 pr-4"
            />

          </div>


          <select
            value={status}
            onChange={(event) => {

              setStatus(
                event.target.value
              );

            }}
            className="rounded-lg border border-gray-300    px-4 py-2.5"
          >

            <option value="">
              All Statuses
            </option>

            <option value="applied">
              Applied
            </option>

            <option value="screening">
              Screening
            </option>

            <option value="shortlisted">
              Shortlisted
            </option>

            <option value="interview">
              Interview
            </option>

            <option value="selected">
              Selected
            </option>

            <option value="rejected">
              Rejected
            </option>

          </select>


          <button
            onClick={
              loadApplications
            }
            className="rounded-lg bg-gray-900 px-5 py-2.5 font-medium text-white"
          >
            Search
          </button>

        </div>


        {/* Applications */}

        {loading ? (

          <div className="py-20 text-center text-gray-500">
            Loading applications...
          </div>

        ) : applications.length ===
          0 ? (

          <div className="mt-8 rounded-2xl border border-dashed    py-20 text-center">

            <h2 className="text-xl font-semibold">
              No applications found
            </h2>

            <p className="mt-2 text-gray-500">
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