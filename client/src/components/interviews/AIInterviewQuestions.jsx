import { useState } from "react";
import { runAI } from "../../services/hireflowAI";
export default function AIInterviewQuestions({ candidateId, jobId }) {
  const [questions, setQuestions] = useState([]),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function generate() {
    setBusy(true);
    setError("");
    try {
      const r = await runAI("interview-questions", {
        candidateId,
        jobId,
        count: 5,
        difficulty: "medium",
      });
      setQuestions(r.data.questions);
    } catch (e) {
      setError(e.response?.data?.message || "Could not generate questions");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="portal-card">
      <h2>Interview questions</h2>
      <p>
        Generate role-specific questions with evaluation guidance. Edit the
        questions before your interview.
      </p>
      <button
        className="portal-button"
        disabled={busy || !candidateId || !jobId}
        onClick={generate}
      >
        {busy ? "Generating..." : "Generate questions"}
      </button>
      {error && <p role="alert">{error}</p>}
      {questions.map((q, i) => (
        <div className="my-4" key={i}>
          <label>
            Question {i + 1} · {q.category}
            <textarea
              value={q.question}
              onChange={(e) =>
                setQuestions(
                  questions.map((x, j) =>
                    j === i ? { ...x, question: e.target.value } : x,
                  ),
                )
              }
            />
          </label>
          <p>Evaluation guide: {q.evaluationGuide}</p>
        </div>
      ))}
    </section>
  );
}
