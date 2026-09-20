import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Loader2,
  Save,
  User,
  BriefcaseBusiness,
  Video,
  MapPin,
  FileText,
  AlertCircle,
} from "lucide-react";

import {
  getInterviewById,
  updateInterview,
} from "../../services/interviewServices.js";

const EditInterview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    candidate: "",
    job: "",
    interviewType: "technical",
    interviewDate: "",
    startTime: "",
    endTime: "",
    mode: "online",
    location: "",
    meetingLink: "",
    interviewer: "",
    status: "scheduled",
    notes: "",
  });

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getInterviewById(id);

        const interview = response?.interview;

        if (!interview) {
          throw new Error("Interview details not found");
        }

        setFormData({
          candidate:
            interview.candidate?._id ||
            interview.candidate ||
            "",

          job:
            interview.job?._id ||
            interview.job ||
            "",

          interviewType:
            interview.interviewType ||
            "technical",

          interviewDate: interview.interviewDate
            ? new Date(interview.interviewDate)
                .toISOString()
                .split("T")[0]
            : "",

          startTime: interview.startTime || "",

          endTime: interview.endTime || "",

          mode: interview.mode || "online",

          location: interview.location || "",

          meetingLink: interview.meetingLink || "",

          interviewer:
            interview.interviewer?._id ||
            interview.interviewer ||
            "",

          status: interview.status || "scheduled",

          notes: interview.notes || "",
        });
      } catch (err) {
        console.error("Failed to fetch interview:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load interview"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInterview();
    }
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.candidate) {
      setError("Candidate is required.");
      return;
    }

    if (!formData.job) {
      setError("Job is required.");
      return;
    }

    if (!formData.interviewDate) {
      setError("Interview date is required.");
      return;
    }

    if (!formData.startTime) {
      setError("Start time is required.");
      return;
    }

    if (!formData.endTime) {
      setError("End time is required.");
      return;
    }

    if (formData.endTime <= formData.startTime) {
      setError("End time must be later than start time.");
      return;
    }

    if (formData.mode === "online" && !formData.meetingLink) {
      setError("Meeting link is required for online interviews.");
      return;
    }

    if (formData.mode === "offline" && !formData.location) {
      setError("Location is required for offline interviews.");
      return;
    }

    try {
      setSaving(true);

      await updateInterview(id, formData);

      setSuccess("Interview updated successfully.");

      setTimeout(() => {
        navigate(`/interviews/${id}`);
      }, 800);
    } catch (err) {
      console.error("Failed to update interview:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update interview. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />

          <p className="text-sm text-slate-400">
            Loading interview...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate(`/interviews/${id}`)}
              className="mb-4 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
            >
              <ArrowLeft size={18} />
              Back to Interview
            </button>

            <h1 className="text-3xl font-bold tracking-tight">
              Edit Interview
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Update the interview schedule and details.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0 text-red-400"
            />

            <div>
              <p className="font-medium text-red-400">
                Unable to update interview
              </p>

              <p className="mt-1 text-sm text-red-300/80">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-400">
            {success}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-xl"
        >
          {/* Candidate & Job */}
          <div className="border-b border-white/10 p-6">
            <div className="mb-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <User size={20} className="text-blue-400" />
                Interview Participants
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Candidate, job and interviewer information.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">

              {/* Candidate */}
              <div>
                <label
                  htmlFor="candidate"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Candidate ID
                </label>

                <input
                  id="candidate"
                  name="candidate"
                  type="text"
                  value={formData.candidate}
                  onChange={handleChange}
                  placeholder="Enter candidate ID"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>

              {/* Job */}
              <div>
                <label
                  htmlFor="job"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Job ID
                </label>

                <input
                  id="job"
                  name="job"
                  type="text"
                  value={formData.job}
                  onChange={handleChange}
                  placeholder="Enter job ID"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>

              {/* Interviewer */}
              <div>
                <label
                  htmlFor="interviewer"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Interviewer ID
                </label>

                <input
                  id="interviewer"
                  name="interviewer"
                  type="text"
                  value={formData.interviewer}
                  onChange={handleChange}
                  placeholder="Enter interviewer ID"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>

              {/* Interview Type */}
              <div>
                <label
                  htmlFor="interviewType"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Interview Type
                </label>

                <select
                  id="interviewType"
                  name="interviewType"
                  value={formData.interviewType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                >
                  <option value="technical">
                    Technical
                  </option>

                  <option value="hr">
                    HR
                  </option>

                  <option value="behavioral">
                    Behavioral
                  </option>

                  <option value="screening">
                    Screening
                  </option>

                  <option value="final">
                    Final
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="border-b border-white/10 p-6">
            <div className="mb-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <CalendarDays
                  size={20}
                  className="text-blue-400"
                />
                Interview Schedule
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Set the interview date and time.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">

              {/* Date */}
              <div>
                <label
                  htmlFor="interviewDate"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Interview Date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="interviewDate"
                    name="interviewDate"
                    type="date"
                    value={formData.interviewDate}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Start */}
              <div>
                <label
                  htmlFor="startTime"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Start Time
                </label>

                <div className="relative">
                  <Clock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* End */}
              <div>
                <label
                  htmlFor="endTime"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  End Time
                </label>

                <div className="relative">
                  <Clock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Interview Mode */}
          <div className="border-b border-white/10 p-6">
            <div className="mb-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Video size={20} className="text-blue-400" />
                Interview Mode
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Specify how the interview will be conducted.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">

              {/* Mode */}
              <div>
                <label
                  htmlFor="mode"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Mode
                </label>

                <select
                  id="mode"
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                >
                  <option value="online">
                    Online
                  </option>

                  <option value="offline">
                    Offline
                  </option>

                  <option value="hybrid">
                    Hybrid
                  </option>
                </select>
              </div>

              {/* Meeting Link */}
              {formData.mode === "online" ||
              formData.mode === "hybrid" ? (
                <div>
                  <label
                    htmlFor="meetingLink"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Meeting Link
                  </label>

                  <div className="relative">
                    <Video
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      id="meetingLink"
                      name="meetingLink"
                      type="url"
                      value={formData.meetingLink}
                      onChange={handleChange}
                      placeholder="https://meet.google.com/..."
                      className="w-full rounded-xl border border-white/10 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="location"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Location
                  </label>

                  <div className="relative">
                    <MapPin
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Office / Meeting room"
                      className="w-full rounded-xl border border-white/10 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Location for Hybrid */}
              {formData.mode === "hybrid" && (
                <div>
                  <label
                    htmlFor="location"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Physical Location
                  </label>

                  <div className="relative">
                    <MapPin
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Office / Meeting room"
                      className="w-full rounded-xl border border-white/10 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status & Notes */}
          <div className="p-6">
            <div className="mb-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <FileText
                  size={20}
                  className="text-blue-400"
                />
                Additional Details
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update interview status and add notes.
              </p>
            </div>

            <div className="space-y-6">

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                >
                  <option value="scheduled">
                    Scheduled
                  </option>

                  <option value="confirmed">
                    Confirmed
                  </option>

                  <option value="completed">
                    Completed
                  </option>

                  <option value="cancelled">
                    Cancelled
                  </option>

                  <option value="rescheduled">
                    Rescheduled
                  </option>

                  <option value="no_show">
                    No Show
                  </option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label
                  htmlFor="notes"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Notes
                </label>

                <textarea
                  id="notes"
                  name="notes"
                  rows="5"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add interview notes..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-white/10 bg-slate-950/50 p-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate(`/interviews/${id}`)}
              disabled={saving}
              className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInterview;