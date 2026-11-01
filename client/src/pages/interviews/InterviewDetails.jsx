import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getInterviewById,
  updateInterviewStatus,
  deleteInterview,
  addInterviewFeedback,
  updateHiringDecision,
} from "../../services/interviewServices";
export default function InterviewDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState("");
  const [notes, setNotes] = useState("");
  const [decision, setDecision] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    getInterviewById(id)
      .then((d) => {
        setInterview(d.interview);
        setFeedback(d.interview.feedback || "");
        setScore(d.interview.overallScore ?? "");
        setNotes(d.interview.notes || "");
      })
      .catch((e) =>
        setError(e.response?.data?.message || "Could not load interview"),
      );
  }, [id]);
  const action = async (work) => {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await work();
      setMessage("Changes saved");
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Action failed");
    } finally {
      setSaving(false);
    }
  };
  const remove = () => {
    if (window.confirm("Delete this interview?"))
      action(async () => {
        await deleteInterview(id);
        navigate("/interviews");
      });
  };
  return (
    <section className="portal-page">
      <Link to="/interviews">Back to interviews</Link>
      <h1>{interview?.title || "Interview details"}</h1>
      {error && (
        <p role="alert" className="portal-message error">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="portal-message">
          {message}
        </p>
      )}
      {interview ? (
        <>
          <div className="portal-heading">
            <p>
              {interview.candidate?.firstName} {interview.candidate?.lastName} ·{" "}
              {interview.job?.title}
            </p>
            <div className="portal-actions">
              <Link
                className="portal-button secondary"
                to={`/interviews/${id}/edit`}
              >
                Edit interview
              </Link>
              <Link
                className="portal-button"
                to={`/interviews/${id}/assistant`}
              >
                Open scorecard
              </Link>
              <button
                className="portal-button secondary"
                disabled={saving}
                onClick={remove}
              >
                Delete
              </button>
            </div>
          </div>
          <div className="portal-profile-layout">
            <article className="portal-card">
              <h2>Schedule</h2>
              <p>
                {new Date(
                  interview.interviewDate || interview.scheduledAt,
                ).toLocaleString()}{" "}
                · {interview.duration || 60} minutes
              </p>
              <p>
                {interview.interviewType} · {interview.mode}
              </p>
              <p>{interview.location}</p>
              {/^https?:\/\//i.test(interview.meetingLink || "") && (
                <a
                  href={interview.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  Join meeting
                </a>
              )}
              <p>
                Interviewers:{" "}
                {interview.interviewers
                  ?.map((i) => `${i.firstName} ${i.lastName}`)
                  .join(", ")}
              </p>
              <label>
                Status
                <select
                  disabled={saving}
                  value={interview.status}
                  onChange={(e) =>
                    action(async () => {
                      const d = await updateInterviewStatus(id, e.target.value);
                      setInterview(d.interview);
                    })
                  }
                >
                  {[
                    "Scheduled",
                    "Confirmed",
                    "Completed",
                    "Cancelled",
                    "Rescheduled",
                    "No Show",
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
            </article>
            <form
              className="portal-card"
              onSubmit={(e) => {
                e.preventDefault();
                action(() =>
                  addInterviewFeedback(id, {
                    feedback,
                    score: score === "" ? undefined : Number(score),
                    recommendation: notes,
                  }),
                );
              }}
            >
              <h2>Feedback</h2>
              <label>
                Interview feedback
                <textarea
                  rows={5}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </label>
              <label>
                Overall score (0 to 10)
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                />
              </label>
              <label>
                Notes
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </label>
              <button disabled={saving} className="portal-button mt-4">
                Save feedback
              </button>
            </form>
          </div>
          <form
            className="portal-card mt-6"
            onSubmit={(e) => {
              e.preventDefault();
              action(() => updateHiringDecision(id, decision));
            }}
          >
            <h2>Application decision</h2>
            <p>
              This updates the application status and the candidate's dashboard
              history.
            </p>
            <div className="portal-actions">
              <label>
                Decision
                <select
                  required
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                >
                  <option value="">Choose decision</option>
                  <option value="selected">Selected</option>
                  <option value="rejected">Rejected</option>
                </select>
              </label>
              <button disabled={saving || !decision} className="portal-button">
                Save decision
              </button>
            </div>
          </form>
        </>
      ) : (
        !error && <p>Loading interview...</p>
      )}
    </section>
  );
}
