
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Loader2,
  Briefcase,
  MapPin,
  DollarSign,
} from "lucide-react";

import {
  getJobById,
  updateJob,
} from "../../services/jobService";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "",
    location: "",
    employmentType: "full-time",
    experienceLevel: "entry",
    salaryMin: "",
    salaryMax: "",
    skills: "",
    status: "draft",
  });

  // ==========================================
  // FETCH JOB
  // ==========================================

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getJobById(id);

        const job = response.data?.job || response.data;

        setFormData({
          title: job.title || "",
          description: job.description || "",
          department: job.department || "",
          location: job.location || "",
          employmentType: job.employmentType || "full-time",
          experienceLevel: job.experienceLevel || "entry",
          salaryMin: job.salaryMin || "",
          salaryMax: job.salaryMax || "",
          skills: Array.isArray(job.skills)
            ? job.skills.join(", ")
            : job.skills || "",
          status: job.status || "draft",
        });
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
            "Failed to load job."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        ...formData,

        salaryMin:
          formData.salaryMin === ""
            ? undefined
            : Number(formData.salaryMin),

        salaryMax:
          formData.salaryMax === ""
            ? undefined
            : Number(formData.salaryMax),

        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      await updateJob(id, payload);

      navigate(`/jobs/${id}`);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to update job."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">

      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => navigate(`/jobs/${id}`)}
          className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Job
          </h1>

          <p className="mt-1 text-gray-500">
            Update job information and requirements.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >

        {/* Basic Information */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center gap-3">
            <Briefcase className="h-5 w-5 text-blue-600" />

            <h2 className="text-lg font-semibold">
              Basic Information
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">

            {/* Title */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Job Title *
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. Frontend Developer"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Department */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Department
              </label>

              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Engineering"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Location */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Location
              </label>

              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Dehradun / Remote"
                  className="w-full rounded-lg border py-3 pl-10 pr-4 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Employment Type */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Employment Type
              </label>

              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-3"
              >
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Experience Level
              </label>

              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-3"
              >
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="lead">Lead</option>
                <option value="executive">Executive</option>
              </select>
            </div>

          </div>
        </div>

        {/* Description */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-lg font-semibold">
            Job Description
          </h2>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="7"
            required
            placeholder="Describe the role, responsibilities and expectations..."
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* Salary */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-blue-600" />

            <h2 className="text-lg font-semibold">
              Compensation
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium">
                Minimum Salary
              </label>

              <input
                type="number"
                name="salaryMin"
                value={formData.salaryMin}
                onChange={handleChange}
                placeholder="300000"
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Maximum Salary
              </label>

              <input
                type="number"
                name="salaryMax"
                value={formData.salaryMax}
                onChange={handleChange}
                placeholder="600000"
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>

          </div>
        </div>

        {/* Skills */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <h2 className="mb-2 text-lg font-semibold">
            Required Skills
          </h2>

          <p className="mb-4 text-sm text-gray-500">
            Separate skills using commas.
          </p>

          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="React, JavaScript, Node.js, MongoDB"
            className="w-full rounded-lg border px-4 py-3"
          />
        </div>

        {/* Status */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <h2 className="mb-4 text-lg font-semibold">
            Job Status
          </h2>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-3 md:w-1/2"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">

          <button
            type="button"
            onClick={() => navigate(`/jobs/${id}`)}
            className="rounded-lg border px-6 py-3 font-medium hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save Changes
              </>
            )}
          </button>

        </div>

      </form>
    </div>
  );
};

export default EditJob;
