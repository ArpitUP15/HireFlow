import {
  useEffect,
  useState,
} from "react";

import ApplicationForm from "../../components/application/ApplicationForm";

import {
  getJobs,
} from "../../services/jobService";

import {
  getCandidates,
} from "../../services/candidateService";

import {
  createApplication,
} from "../../services/applicationService";


const CreateApplication = () => {

  const [jobs, setJobs] =
    useState([]);

  const [
    candidates,
    setCandidates,
  ] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [
    pageLoading,
    setPageLoading,
  ] = useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    const loadData =
      async () => {
        try {

          const [
            jobsData,
            candidatesData,
          ] =
            await Promise.all([
              getJobs({
                status:
                  "published",
              }),

              getCandidates(),
            ]);

          setJobs(
            jobsData.jobs || []
          );

          setCandidates(
            candidatesData.candidates ||
              []
          );

        } catch (error) {

          setError(
            error.response?.data
              ?.message ||
              "Failed to load data"
          );

        } finally {

          setPageLoading(false);

        }
      };

    loadData();

  }, []);


  const handleSubmit =
    async (data) => {

      try {

        setLoading(true);
        setError("");

        await createApplication(
          data
        );

        window.location.href =
          "/applications";

      } catch (error) {

        setError(
          error.response?.data
            ?.message ||
            "Failed to create application"
        );

      } finally {

        setLoading(false);

      }
    };


  if (pageLoading) {
    return (
      <div className="p-10 text-center">
        Loading...
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">

      <div className="mx-auto max-w-4xl">

        <h1 className="text-3xl font-bold">
          Create Application
        </h1>

        <p className="mt-2 text-gray-500">
          Connect a candidate with a job opening.
        </p>


        {error && (
          <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}


        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

          <ApplicationForm
            jobs={jobs}
            candidates={candidates}
            onSubmit={
              handleSubmit
            }
            loading={loading}
          />

        </div>

      </div>

    </div>
  );
};

export default CreateApplication;