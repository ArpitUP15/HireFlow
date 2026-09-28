import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createInterview,
} from "../../services/interviewServices";

const CreateInterview = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    application: "",
    candidate: "",
    job: "",
    interviewer: "",
    interviewType: "Technical",
    interviewDate: "",
    startTime: "",
    endTime: "",
    mode: "Online",
    location: "",
    meetingLink: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      await createInterview(form);

      navigate("/interviews");
    } catch (error) {
      console.error(
        "Failed to create interview:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-white">
          Schedule Interview
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <input
            name="application"
            placeholder="Application ID"
            value={form.application}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-white"
          />

          <input
            name="candidate"
            placeholder="Candidate ID"
            value={form.candidate}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-white"
          />

          <input
            name="job"
            placeholder="Job ID"
            value={form.job}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-white"
          />

          <input
            name="interviewer"
            placeholder="Interviewer User ID"
            value={form.interviewer}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-white"
          />

          <select
            name="interviewType"
            value={form.interviewType}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-white"
          >
            <option>Technical</option>
            <option>HR</option>
            <option>Behavioral</option>
            <option>Screening</option>
            <option>Final</option>
          </select>

          <input
            type="datetime-local"
            name="interviewDate"
            value={form.interviewDate}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-white"
          />

          <select
            name="mode"
            value={form.mode}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-white"
          >
            <option>Online</option>
            <option>Offline</option>
            <option>Hybrid</option>
          </select>

          {form.mode !== "Offline" && (
            <input
              name="meetingLink"
              placeholder="Meeting Link"
              value={form.meetingLink}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-white"
            />
          )}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {loading
              ? "Scheduling..."
              : "Schedule Interview"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateInterview;