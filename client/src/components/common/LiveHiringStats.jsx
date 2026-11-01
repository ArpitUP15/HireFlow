import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/useAuth";
import api from "../../services/api";
function Counter({ value }) {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    if (value == null) {
      element.textContent = "—";
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.textContent = value.toLocaleString();
      return;
    }
    let frame, start;
    const step = (now) => {
      start ??= now;
      const progress = Math.min((now - start) / 1000, 1);
      element.textContent = Math.round(
        value * (1 - Math.pow(1 - progress, 3)),
      ).toLocaleString();
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return (
    <strong
      className="hiring-stat-value"
      ref={ref}
      aria-label={value == null ? "Not available" : String(value)}
    />
  );
}
function formatElapsedTime(updatedAt) {
  if (!updatedAt) return "Loading live totals...";

  const diffMinutes = Math.max(
    0,
    Math.floor((Date.now() - new Date(updatedAt).getTime()) / 60000),
  );

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
}

function Stats({ user }) {
  const [live, setLive] = useState(null),
    [error, setError] = useState("");
  useEffect(() => {
    if (!user) return;
    const controller = new AbortController();
    let pending = false;
    async function refresh() {
      if (pending || document.hidden) return;
      pending = true;
      try {
        const r = await api.get("/stats", { signal: controller.signal });
        setLive(r.data.data);
        setError("");
      } catch (e) {
        if (!controller.signal.aborted)
          setError(
            e.response?.data?.message ||
              "Live totals are temporarily unavailable.",
          );
      } finally {
        pending = false;
      }
    }
    refresh();
    const timer = setInterval(refresh, 10000);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      controller.abort();
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [user]);
  const data = user
    ? live
    : { organizations: 128, jobsPosted: 640, candidatesHired: 215 };
  return (
    <section className="hiring-stats portal-card" aria-labelledby="stats-title">
      <p className="eyebrow">
        {user ? "LIVE PLATFORM ACTIVITY" : "INTERACTIVE PREVIEW · DEMO DATA"}
      </p>
      <h2 id="stats-title">Hiring activity across HireFlow</h2>
      <p>
        {user
          ? "Database totals refresh every 10 seconds while this page is active."
          : "These animated example numbers are fictional. Sign in to view actual platform totals."}
      </p>
      <div className="hiring-stats-grid">
        {[
          ["organizations", "Organizations created"],
          ["jobsPosted", "Jobs posted"],
          ["candidatesHired", "Candidates hired"],
        ].map(([key, label]) => (
          <div key={key}>
            <Counter value={data?.[key]} />
            <span>{label}</span>
          </div>
        ))}
      </div>
      {user && (
        <small>
          Hires count unique candidates with a selected application. {live ? `Updated ${formatElapsedTime(live.updatedAt)}` : "Loading live totals..."}
        </small>
      )}
      {error && (
        <p role="status">
          {error}{" "}
          {live ? "Showing last fetched totals." : "No totals available yet."}
        </p>
      )}
    </section>
  );
}
export default function LiveHiringStats() {
  const { user } = useAuth();
  return <Stats key={user?._id || user?.id || "guest"} user={user} />;
}
