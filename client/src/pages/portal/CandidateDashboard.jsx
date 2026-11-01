import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyApplications } from "../../services/portalService";
import ApplicationStatus from "../../components/application/ApplicationStatus";
import { statuses } from "../../components/application/statuses";
import { useAuth } from "../../context/useAuth";
export default function CandidateDashboard() {
  const { user } = useAuth();
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const onFocus = () => setRevision((n) => n + 1);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    getMyApplications({ status, page, limit: 15 }, controller.signal)
      .then((d) => {
        setData(d);
        setError("");
      })
      .catch((e) => {
        if (e.code !== "ERR_CANCELED")
          setError(e.response?.data?.message || "Could not load applications");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [status, page, revision]);
  const counts = data?.counts || {};
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
  return (
    <section className="portal-page">
      <div className="portal-heading">
        <div>
          <p className="eyebrow">CANDIDATE WORKSPACE</p>
          <h1>Welcome, {user.firstName}</h1>
          <p>Track every job application and the progress of each review.</p>
        </div>
        <Link className="portal-button" to="/jobs">
          Find a job
        </Link>
      </div>
      <div className="portal-stats">
        {[
          ["All applications", total],
          ...statuses.map((s) => [
            s.charAt(0).toUpperCase() + s.slice(1),
            counts[s] || 0,
          ]),
        ].map(([label, value]) => (
          <div className="portal-stat" key={label}>
            <span>{label}</span>
            <strong>{loading ? "..." : value}</strong>
          </div>
        ))}
      </div>
      <div className="portal-heading">
        <h2>Application history</h2>
        <div className="portal-actions">
          <label>
            Status{" "}
            <select
              value={status}
              onChange={(e) => {
                setLoading(true);
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All statuses</option>
              {statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <button
            className="portal-button secondary"
            onClick={() => {
              setLoading(true);
              setRevision((n) => n + 1);
            }}
          >
            Refresh
          </button>
        </div>
      </div>
      {error && (
        <p role="alert" className="portal-message error">
          {error}
        </p>
      )}
      {loading ? (
        <p role="status">Loading applications...</p>
      ) : !error && !data?.applications?.length ? (
        <div className="portal-empty">
          <h3>No applications yet</h3>
          <p>Complete your profile and browse the job portal to apply.</p>
          <Link to="/profile">Complete profile</Link>
        </div>
      ) : (
        <div className="portal-history">
          {data?.applications?.map((a) => (
            <article className="portal-card" key={a._id}>
              <div className="portal-heading">
                <div>
                  <h3>{a.job?.title || "Job no longer available"}</h3>
                  <p>
                    {a.organization?.name || "Organization"} ·{" "}
                    {a.job?.location || "Location not specified"}
                  </p>
                </div>
                <ApplicationStatus status={a.status} />
              </div>
              <p>
                Applied {new Date(a.appliedAt).toLocaleDateString()} · Last
                update {new Date(a.lastStatusChangedAt).toLocaleDateString()}
              </p>
              <details>
                <summary>View status history</summary>
                <ol className="status-history">
                  {(a.statusHistory?.length
                    ? a.statusHistory
                    : [{ status: a.status, changedAt: a.lastStatusChangedAt }]
                  ).map((h, i) => (
                    <li key={i}>
                      <ApplicationStatus status={h.status} />
                      <time>{new Date(h.changedAt).toLocaleString()}</time>
                    </li>
                  ))}
                </ol>
                {a.coverLetter && (
                  <p className="whitespace-pre-wrap">{a.coverLetter}</p>
                )}
              </details>
            </article>
          ))}
        </div>
      )}
      <div className="portal-pagination">
        <button
          disabled={page <= 1 || loading}
          onClick={() => {
            setLoading(true);
            setPage((n) => n - 1);
          }}
        >
          Previous
        </button>
        <span>
          Page {page} of {Math.max(1, data?.pages || 1)}
        </span>
        <button
          disabled={page >= (data?.pages || 1) || loading}
          onClick={() => {
            setLoading(true);
            setPage((n) => n + 1);
          }}
        >
          Next
        </button>
      </div>
    </section>
  );
}
