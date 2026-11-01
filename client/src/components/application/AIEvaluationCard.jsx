import { useEffect, useState } from "react";
import { runAI, getAIHistory } from "../../services/hireflowAI";
export default function AIEvaluationCard({ candidateId, jobId, onScreened }) {
  const [result, setResult] = useState(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false);
  useEffect(() => {
    let active = true;
    getAIHistory({ candidate: candidateId, job: jobId })
      .then((d) => {
        const latest = d.find(
          (h) =>
            h.status === "succeeded" &&
            ["screening", "matching"].includes(h.type),
        );
        if (active && latest) setResult(latest.result);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [candidateId, jobId]);
  async function run(type) {
    setLoading(true);
    setError("");
    try {
      const d = await runAI(type, { candidateId, jobId });
      setResult(d.data);
      onScreened?.(d.data);
    } catch (e) {
      setError(e.response?.data?.message || "AI request failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <section className="portal-card">
      <h2>AI qualification review</h2>
      <p>Review documented evidence before making a hiring decision.</p>
      <div className="portal-actions">
        <button
          className="portal-button"
          disabled={loading}
          onClick={() => run("screen")}
        >
          {loading ? "Processing..." : "Screen qualifications"}
        </button>
        <button
          className="portal-button secondary"
          disabled={loading}
          onClick={() => run("match")}
        >
          Match job requirements
        </button>
      </div>
      {error && <p role="alert">{error}</p>}
      {result && (
        <div>
          <p>{result.summary || result.explanation}</p>
          {[
            "matchedQualifications",
            "missingEvidence",
            "concernsToVerify",
            "strengths",
            "matchedSkills",
          ]
            .filter((k) => result[k])
            .map((k) => (
              <div key={k}>
                <h3>{k.replace(/([A-Z])/g, " $1")}</h3>
                <ul>
                  {result[k].map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            ))}
          {result.requirements?.map((r, i) => (
            <article key={i}>
              <h3>
                {r.requirement}: {r.status.replaceAll("_", " ")}
              </h3>
              <p>{r.evidence}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
