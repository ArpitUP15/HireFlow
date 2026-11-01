import { useState } from "react";

import { Loader2 } from "lucide-react";

const initialForm = {
  application: "",
  title: "",
  round: "technical",
  roundName: "",
  type: "video",
  scheduledAt: "",
  duration: 60,
  meetingLink: "",
  location: "",
  interviewers: [],
  notes: "",
};

const InterviewForm = ({
  applications = [],
  members = [],
  interview = null,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState(() => ({
    ...initialForm,
    ...interview,
    application: interview?.application?._id || interview?.application || "",
    scheduledAt: interview?.scheduledAt
      ? new Date(
          new Date(interview.scheduledAt).getTime() -
            new Date(interview.scheduledAt).getTimezoneOffset() * 60000,
        )
          .toISOString()
          .slice(0, 16)
      : "",
    interviewers: interview?.interviewers?.map((i) => i._id || i) || [],
  }));

  const [error, setError] = useState("");

  // ===================================================
  // EDIT DATA
  // ===================================================

  // ===================================================
  // INPUT
  // ===================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ===================================================
  // INTERVIEWERS
  // ===================================================

  const handleInterviewerChange = (event) => {
    const values = Array.from(event.target.selectedOptions).map(
      (option) => option.value,
    );

    setFormData((previous) => ({
      ...previous,
      interviewers: values,
    }));
  };

  // ===================================================
  // SUBMIT
  // ===================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.application) {
      setError("Please select an application.");

      return;
    }

    if (!formData.title.trim()) {
      setError("Interview title is required.");

      return;
    }

    if (!formData.scheduledAt) {
      setError("Interview date and time are required.");

      return;
    }

    try {
      await onSubmit({
        ...formData,

        title: formData.title.trim(),

        roundName: formData.roundName.trim(),

        meetingLink: formData.meetingLink.trim(),

        location: formData.location.trim(),

        notes: formData.notes.trim(),

        duration: Number(formData.duration),
      });
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to save interview.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ERROR */}

      {error && (
        <div className="rounded-xl border border-accent/20 bg-accent/10 p-4 text-sm text-accent-readable">
          {error}
        </div>
      )}

      {/* APPLICATION */}

      <div>
        <label className="mb-2 block text-sm font-medium text-text">
          Application
        </label>

        <select
          name="application"
          value={formData.application}
          onChange={handleChange}
          required
          disabled={Boolean(interview) || loading}
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-text outline-none focus:border-primary disabled:opacity-50"
        >
          <option value="">Select application</option>

          {applications.map((application) => (
            <option key={application._id} value={application._id}>
              {application.candidate?.firstName || "Candidate"} -{" "}
              {application.job?.title || "Job"}
            </option>
          ))}
        </select>
      </div>

      {/* TITLE */}

      <div>
        <label className="mb-2 block text-sm font-medium text-text">
          Interview Title
        </label>

        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Technical Interview"
          required
          disabled={loading}
          className="w-full rounded-xl border border-border bg-primary/5 px-4 py-3 text-text outline-none placeholder:text-muted focus:border-primary"
        />
      </div>

      {/* ROUND + TYPE */}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-text">
            Interview Round
          </label>

          <select
            name="round"
            value={formData.round}
            onChange={handleChange}
            disabled={loading}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-text outline-none focus:border-primary"
          >
            <option value="screening">Screening</option>

            <option value="technical">Technical</option>

            <option value="hr">HR</option>

            <option value="managerial">Managerial</option>

            <option value="final">Final</option>

            <option value="custom">Custom</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-text">
            Interview Type
          </label>

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            disabled={loading}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-text outline-none focus:border-primary"
          >
            <option value="video">Video</option>

            <option value="phone">Phone</option>

            <option value="onsite">Onsite</option>
          </select>
        </div>
      </div>

      {/* DATE + DURATION */}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-text">
            Date & Time
          </label>

          <input
            type="datetime-local"
            name="scheduledAt"
            value={formData.scheduledAt}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full rounded-xl border border-border bg-primary/5 px-4 py-3 text-text outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-text">
            Duration (minutes)
          </label>

          <input
            type="number"
            name="duration"
            min="15"
            step="15"
            value={formData.duration}
            onChange={handleChange}
            disabled={loading}
            className="w-full rounded-xl border border-border bg-primary/5 px-4 py-3 text-text outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* MEETING LINK */}

      {formData.type === "video" && (
        <div>
          <label className="mb-2 block text-sm font-medium text-text">
            Meeting Link
          </label>

          <input
            type="url"
            name="meetingLink"
            value={formData.meetingLink}
            onChange={handleChange}
            placeholder="https://meet.google.com/..."
            disabled={loading}
            className="w-full rounded-xl border border-border bg-primary/5 px-4 py-3 text-text outline-none placeholder:text-muted focus:border-primary"
          />
        </div>
      )}

      {/* LOCATION */}

      {formData.type === "onsite" && (
        <div>
          <label className="mb-2 block text-sm font-medium text-text">
            Location
          </label>

          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Office / Meeting Room"
            disabled={loading}
            className="w-full rounded-xl border border-border bg-primary/5 px-4 py-3 text-text outline-none placeholder:text-muted focus:border-primary"
          />
        </div>
      )}

      {/* INTERVIEWERS */}

      <div>
        <label className="mb-2 block text-sm font-medium text-text">
          Interviewers
        </label>

        <select
          multiple
          value={formData.interviewers}
          onChange={handleInterviewerChange}
          disabled={loading}
          className="min-h-32 w-full rounded-xl border border-border bg-surface px-4 py-3 text-text outline-none focus:border-primary"
        >
          {members.map((member) => (
            <option key={member._id} value={member.user?._id || member._id}>
              {member.user?.firstName || ""} {member.user?.lastName || ""} -{" "}
              {member.user?.email || ""}
            </option>
          ))}
        </select>

        <p className="mt-2 text-xs text-muted">
          Hold Ctrl while selecting multiple interviewers.
        </p>
      </div>

      {/* NOTES */}

      <div>
        <label className="mb-2 block text-sm font-medium text-text">
          Notes
        </label>

        <textarea
          name="notes"
          rows="4"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Interview preparation notes..."
          disabled={loading}
          className="w-full resize-none rounded-xl border border-border bg-primary/5 px-4 py-3 text-text outline-none placeholder:text-muted focus:border-primary"
        />
      </div>

      {/* ACTIONS */}

      <div className="flex justify-end gap-3 border-t border-border pt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-border px-5 py-3 text-sm font-medium text-text hover:bg-primary/5"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex min-w-[160px] items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-background hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving...
            </>
          ) : interview ? (
            "Update Interview"
          ) : (
            "Schedule Interview"
          )}
        </button>
      </div>
    </form>
  );
};

export default InterviewForm;
