import { useEffect, useState } from "react";
import api from "../../services/api";
export default function AIProcessingMetrics() {
  const [counts, setCounts] = useState(null),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const r = await api.get("/ai/metrics");
        if (active) {
          setCounts(r.data.data);
          setError("");
        }
      } catch (e) {
        if (active)
          setError(
            e.response?.data?.message || "Could not load AI processing totals",
          );
      }
    }
    load();
    const interval = setInterval(load, 30000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);
  return (
    <section className="portal-card my-6">
      <h2>AI processing activity</h2>
      <p>Current organization. Refreshes every 30 seconds.</p>
      {error && <p role="status">{error}</p>}
      {counts && (
        <div className="portal-form-grid">
          {["resume", "screening", "matching", "interview"].map((type) => (
            <div key={type}>
              <h3>{type}</h3>
              <p>
                {counts.find(
                  (r) => r._id.type === type && r._id.status === "succeeded",
                )?.count || 0}{" "}
                succeeded ·{" "}
                {counts.find(
                  (r) => r._id.type === type && r._id.status === "failed",
                )?.count || 0}{" "}
                failed
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
