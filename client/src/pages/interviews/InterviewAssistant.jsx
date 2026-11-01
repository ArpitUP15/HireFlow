import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getInterviewById,
  updateInterview,
} from "../../services/interviewServices";
import InterviewScorecard from "../../components/interviews/InterviewScorecard";
import AIInterviewQuestions from "../../components/interviews/AIInterviewQuestions";
export default function InterviewAssistant() {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [scores, setScores] = useState({});
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    getInterviewById(id)
      .then((d) => {
        setInterview(d.interview);
        setScores(d.interview.scores || {});
        setFeedback(d.interview.feedback || "");
      })
      .catch((e) =>
        setMessage(e.response?.data?.message || "Could not load interview"),
      );
  }, [id]);
  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const values = Object.values(scores).filter(Number.isFinite);
      await updateInterview(id, {
        scores,
        feedback,
        overallScore: values.length
          ? values.reduce((a, b) => a + b, 0) / values.length
          : null,
      });
      setMessage("Scorecard saved");
    } catch (e) {
      setMessage(e.response?.data?.message || "Could not save scorecard");
    } finally {
      setSaving(false);
    }
  };
  return (
    <section className="portal-page">
      <Link to={`/interviews/${id}`}>Back to interview</Link>
      <h1>Interview workspace</h1>
      {message && <p role="status">{message}</p>}
      {interview && (
        <div className="portal-profile-layout">
          <AIInterviewQuestions candidateId={interview.candidate?._id} jobId={interview.job?._id} />
          <form onSubmit={save} className="portal-card">
            <InterviewScorecard scores={scores} onChange={setScores} />
            <label>
              Feedback
              <textarea
                rows={6}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </label>
            <button disabled={saving} className="portal-button mt-4">
              {saving ? "Saving..." : "Save scorecard"}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
