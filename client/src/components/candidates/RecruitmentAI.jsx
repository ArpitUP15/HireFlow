import { useEffect, useState } from "react";
import api from "../../services/api";
import { parseResume, runAI, getAIHistory } from "../../services/hireflowAI";
function Findings({ data }) {
  return (
    <div className="ai-findings">
      {Object.entries(data || {}).map(([key, value]) => (
        <div key={key}>
          <h3>
            {key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (s) => s.toUpperCase())}
          </h3>
          {Array.isArray(value) ? (
            <ul>
              {value.map((entry, i) => (
                <li key={i}>
                  {typeof entry === "object" ? (
                    <Findings data={entry} />
                  ) : (
                    entry
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>{String(value)}</p>
          )}
        </div>
      ))}
    </div>
  );
}
export default function RecruitmentAI({
  candidateId: initialCandidate,
  jobId: initialJob,
  showHistory = true,
}) {
  const [candidateId, setCandidate] = useState(initialCandidate || "");
  const [jobId, setJob] = useState(initialJob || "");
  const [choices, setChoices] = useState([]);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");
  useEffect(() => {
    let active = true;
    api
      .get(initialCandidate ? "/jobs" : "/candidates")
      .then((r) => {
        if (active)
          setChoices(
            r.data.jobs || r.data.candidates || r.data.data?.jobs || [],
          );
      })
      .catch((e) => {
        if (active)
          setError(e.response?.data?.message || "Could not load records");
      });
    if (showHistory) {
      getAIHistory(
        initialCandidate ? { candidate: initialCandidate } : { job: initialJob },
      )
        .then((d) => {
          if (active) setHistory(d);
        })
        .catch(() => {});
    }
    return () => {
      active = false;
    };
  }, [initialCandidate, initialJob, showHistory]);
  async function run(type) {
    setBusy(type);
    setError("");
    setResult(null);
    try {
      const response =
        type === "parse"
          ? await parseResume(file, candidateId)
          : await runAI(type, { candidateId, jobId, count, difficulty });
      setResult(response.data);
      if (showHistory) {
        setHistory(
          await getAIHistory(
            initialCandidate
              ? { candidate: initialCandidate }
              : { job: initialJob },
          ),
        );
      }
    } catch (e) {
      setError(e.response?.data?.message || "AI request failed. Please retry.");
    } finally {
      setBusy("");
    }
  }
  return (
    <section className="portal-card space-y-4">
      <h2>Recruitment AI</h2>
      <p>
        Review extracted facts and requirement evidence. A recruiter makes every
        hiring decision. Resume content is sent to Groq when you run an AI
        action.
      </p>
      <label>
        {initialCandidate ? "Compare with job" : "Select candidate"}
        <select
          value={initialCandidate ? jobId : candidateId}
          onChange={(e) => {
            (initialCandidate ? setJob : setCandidate)(e.target.value);
            setResult(null);
          }}
        >
          <option value="">Choose a record</option>
          {choices.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title || `${c.firstName} ${c.lastName}`}
            </option>
          ))}
        </select>
      </label>
      {initialCandidate && (
        <div>
          <label>
            PDF or DOCX resume (5 MB maximum)
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
          <button
            className="portal-button"
            disabled={!file || !!busy}
            onClick={() => run("parse")}
          >
            {busy === "parse" ? "Parsing..." : "Parse and save resume findings"}
          </button>
        </div>
      )}
      <div className="portal-actions">
        <button
          className="portal-button"
          disabled={!candidateId || !jobId || !!busy}
          onClick={() => run("screen")}
        >
          {busy === "screen" ? "Screening..." : "Screen qualifications"}
        </button>
        <button
          className="portal-button secondary"
          disabled={!candidateId || !jobId || !!busy}
          onClick={() => run("match")}
        >
          {busy === "match" ? "Comparing..." : "Match job requirements"}
        </button>
      </div>
      <div className="portal-form-grid">
        <label>
          Question count
          <input
            type="number"
            min="1"
            max="10"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
        </label>
        <label>
          Difficulty
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            {["easy", "medium", "hard"].map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </label>
      </div>
      <button
        className="portal-button secondary"
        disabled={!candidateId || !jobId || !!busy}
        onClick={() => run("interview-questions")}
      >
        {busy === "interview-questions"
          ? "Generating..."
          : "Generate interview questions"}
      </button>
      {error && (
        <p role="alert" className="portal-message error">
          {error}
        </p>
      )}
      <div aria-live="polite">{result && <Findings data={result} />}</div>
      {showHistory && (
        <details>
          <summary>Saved AI findings ({history.length})</summary>
          {history.map((h) => (
            <details key={h._id}>
              <summary>
                {h.type} · {h.status} · {new Date(h.createdAt).toLocaleString()}
              </summary>
              <p>Model: {h.model}</p>
              <Findings data={h.result} />
            </details>
          ))}
        </details>
      )}
    </section>
  );
}
