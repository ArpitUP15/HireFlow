import {useState,} from "react";
import JobForm from "../../components/jobs/JObForm";
import {createJob,} from "../../services/jobService";
const CreateJob = () => {
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState("");

  const handleSubmit = async (
    jobData
  ) => {
    try {
      setLoading(true);
      setError("");

      await createJob(jobData);

      window.location.href =
        "/jobs";
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create job"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_30%),linear-gradient(180deg,#020817_0%,#0f172a_100%)] px-4 py-6 text-slate-100 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-white">
          Create Job
        </h1>

        <p className="mt-2 text-slate-400">
          Create a new job opening.
        </p>

        {error && (
          <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-sm">
          <JobForm
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

export default CreateJob;