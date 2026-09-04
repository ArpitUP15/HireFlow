import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import {
  getCandidateById,
  updateCandidate,
} from "../../services/candidateService";

const EditCandidate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    currentTitle: "",
    experience: "",
    skills: "",
    education: "",
    linkedin: "",
    github: "",
    portfolio: "",
    resumeUrl: "",
    notes: "",
  });

  // ==========================================
  // FETCH CANDIDATE
  // ==========================================

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        setLoading(true);

        const response =
          await getCandidateById(id);

        const candidate =
          response.data?.candidate ||
          response.data;

        setFormData({
          firstName: candidate.firstName || "",
          lastName: candidate.lastName || "",
          email: candidate.email || "",
          phone: candidate.phone || "",
          location: candidate.location || "",
          currentTitle:
            candidate.currentTitle || "",
          experience:
            candidate.experience || "",
          skills: Array.isArray(candidate.skills)
            ? candidate.skills.join(", ")
            : candidate.skills || "",
          education:
            candidate.education || "",
          linkedin:
            candidate.linkedin || "",
          github:
            candidate.github || "",
          portfolio:
            candidate.portfolio || "",
          resumeUrl:
            candidate.resumeUrl || "",
          notes:
            candidate.notes || "",
        });
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
            "Failed to load candidate."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  // ==========================================
  // INPUT
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

        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      await updateCandidate(id, payload);

      navigate(`/candidates/${id}`);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to update candidate."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">

      {/* Header */}
      <div className="mb-8 flex items-center gap-4">

        <button
          onClick={() =>
            navigate(`/candidates/${id}`)
          }
          className="rounded-lg border p-2 hover:bg-gray-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-3xl font-bold">
            Edit Candidate
          </h1>

          <p className="mt-1 text-gray-500">
            Update candidate profile information.
          </p>
        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* Personal Information */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center gap-3">
            <User className="h-5 w-5 text-blue-600" />

            <h2 className="text-lg font-semibold">
              Personal Information
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium">
                First Name *
              </label>

              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Last Name *
              </label>

              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Email *
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border py-3 pl-10 pr-4"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Phone
              </label>

              <div className="relative">
                <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />

                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border py-3 pl-10 pr-4"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Location
              </label>

              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />

                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Dehradun, India"
                  className="w-full rounded-lg border py-3 pl-10 pr-4"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Professional Information */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-lg font-semibold">
            Professional Information
          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium">
                Current Job Title
              </label>

              <input
                name="currentTitle"
                value={formData.currentTitle}
                onChange={handleChange}
                placeholder="Frontend Developer"
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Experience
              </label>

              <input
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="2 years"
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Skills
              </label>

              <input
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, JavaScript, Node.js, MongoDB"
                className="w-full rounded-lg border px-4 py-3"
              />

              <p className="mt-2 text-xs text-gray-500">
                Separate skills using commas.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Education
              </label>

              <textarea
                name="education"
                value={formData.education}
                onChange={handleChange}
                rows="3"
                placeholder="B.Tech in Computer Science..."
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>

          </div>
        </div>

        {/* Links */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-lg font-semibold">
            Online Profiles
          </h2>

          <div className="space-y-4">

            <input
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="LinkedIn URL"
              className="w-full rounded-lg border px-4 py-3"
            />

            <input
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="GitHub URL"
              className="w-full rounded-lg border px-4 py-3"
            />

            <input
              name="portfolio"
              value={formData.portfolio}
              onChange={handleChange}
              placeholder="Portfolio URL"
              className="w-full rounded-lg border px-4 py-3"
            />

            <input
              name="resumeUrl"
              value={formData.resumeUrl}
              onChange={handleChange}
              placeholder="Resume URL"
              className="w-full rounded-lg border px-4 py-3"
            />

          </div>
        </div>

        {/* Notes */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <h2 className="mb-4 text-lg font-semibold">
            Recruiter Notes
          </h2>

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="5"
            placeholder="Add internal recruiter notes..."
            className="w-full rounded-lg border px-4 py-3"
          />

        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">

          <button
            type="button"
            onClick={() =>
              navigate(`/candidates/${id}`)
            }
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

export default EditCandidate;

