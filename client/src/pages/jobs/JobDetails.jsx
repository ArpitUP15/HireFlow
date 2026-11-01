import { useEffect, useState } from "react";
import RecruitmentAI from "../../components/candidates/RecruitmentAI";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  MapPin,
  Briefcase,
  Users,
  DollarSign,
  Loader2,
} from "lucide-react";

import { getJobById, deleteJob } from "../../services/jobService";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH JOB
  // ==========================================

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);

        const response = await getJobById(id);

        setJob(response.job || response.data?.job || response.data);
      } catch (err) {
        console.error(err);

        setError(err.response?.data?.message || "Failed to load job.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  // ==========================================
  // DELETE JOB
  // ==========================================

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?",
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await deleteJob(id);

      navigate("/jobs");
    } catch (err) {
      console.error(err);

      setError(err.response?.data?.message || "Failed to delete job.");

      setDeleting(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 text-center">
        <h2 className="text-2xl font-bold">Job not found</h2>

        <button
          onClick={() => navigate("/jobs")}
          className="mt-4 rounded-lg bg-primary px-5 py-3 text-background"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  // ==========================================
  // FORMAT
  // ==========================================

  const skills = Array.isArray(job.skills) ? job.skills : [];

  const salary =
    job.salaryMin || job.salaryMax
      ? `₹${Number(job.salaryMin || 0).toLocaleString()} - ₹${Number(
          job.salaryMax || 0,
        ).toLocaleString()}`
      : "Not specified";

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <RecruitmentAI jobId={id} />
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => navigate("/jobs")}
          className="flex items-center gap-2 text-muted hover:text-text"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Jobs
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/jobs/${id}/edit`)}
            className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-surface"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-on-accent hover:bg-accent/90 disabled:opacity-60"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg bg-accent/10 px-4 py-3 text-accent-readable">
          {error}
        </div>
      )}

      {/* Job Header */}
      <div className="rounded-2xl border bg-surface p-8 shadow-sm">
        <div className="flex flex-col justify-between gap-6 md:flex-row">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <Briefcase className="h-7 w-7 text-primary" />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-text">
                  {job.title}
                </h1>

                <p className="text-muted">{job.department || "General"}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm">
                <MapPin className="h-4 w-4" />
                {job.location || "Remote"}
              </span>

              <span className="flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm">
                <Briefcase className="h-4 w-4" />
                {job.employmentType || "Full Time"}
              </span>
            </div>
          </div>

          <div>
            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                job.status === "published"
                  ? "bg-secondary/10 text-secondary-readable"
                  : job.status === "closed"
                    ? "bg-accent/10 text-accent-readable"
                    : "bg-secondary/10 text-secondary-readable"
              }`}
            >
              {job.status?.toUpperCase() || "DRAFT"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Left */}
        <div className="space-y-6 lg:col-span-2">
          {/* Description */}
          <div className="rounded-xl border bg-surface p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Job Description</h2>

            <p className="whitespace-pre-line leading-7 text-muted">
              {job.description || "No description provided."}
            </p>
          </div>

          {/* Skills */}
          <div className="rounded-xl border bg-surface p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Required Skills</h2>

            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted">No skills specified.</p>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Salary */}
          <div className="rounded-xl border bg-surface p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-secondary-readable" />

              <h3 className="font-semibold">Salary Range</h3>
            </div>

            <p className="text-xl font-bold text-text">{salary}</p>
          </div>

          {/* Experience */}
          <div className="rounded-xl border bg-surface p-6 shadow-sm">
            <h3 className="mb-3 font-semibold">Experience Level</h3>

            <p className="capitalize text-muted">
              {job.experienceLevel || "Entry Level"}
            </p>
          </div>

          {/* Candidates */}
          <div className="rounded-xl border bg-surface p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />

              <h3 className="font-semibold">Applications</h3>
            </div>

            <p className="text-3xl font-bold">{job.applicationCount || 0}</p>

            <button
              onClick={() => navigate(`/applications/job/${id}`)}
              className="mt-4 text-sm font-medium text-primary hover:underline"
            >
              View Applications →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
