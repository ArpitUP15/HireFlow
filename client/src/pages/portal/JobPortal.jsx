import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getPortalJobs, applyToJob } from "../../services/portalService";
const keys = [
  "search",
  "location",
  "employmentType",
  "experienceLevel",
  "department",
  "skill",
];
export default function JobPortal() {
  const [params, setParams] = useSearchParams();
  const query = params.toString();
  const [filters, setFilters] = useState(() =>
    Object.fromEntries(keys.map((k) => [k, params.get(k) || ""])),
  );
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [revision, setRevision] = useState(0);
  const page = Math.max(1, Number(params.get("page")) || 1);
  useEffect(() => {
    const controller = new AbortController();
    getPortalJobs(
      Object.fromEntries(new URLSearchParams(query)),
      controller.signal,
    )
      .then((d) => {
        setData(d);
        setError("");
      })
      .catch((e) => {
        if (e.code !== "ERR_CANCELED")
          setError(e.response?.data?.message || "Could not load jobs");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [query, revision]);
  const search = (e) => {
    e.preventDefault();
    setLoading(true);
    setParams(Object.fromEntries(Object.entries(filters).filter(([, v]) => v)));
  };
  const apply = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await applyToJob(active._id, coverLetter);
      setMessage(
        `Application submitted for ${active.title}. Track updates in your dashboard.`,
      );
      setActive(null);
      setCoverLetter("");
      setRevision((n) => n + 1);
    } catch (e) {
      setMessage(
        e.response?.data?.message ||
          "Application could not be submitted. Please retry.",
      );
    } finally {
      setSaving(false);
    }
  };
  return (
    <section className="portal-page">
      <div className="portal-heading">
        <div>
          <p className="eyebrow">JOB PORTAL</p>
          <h1>Find your next role</h1>
          <p>Browse published openings across organizations.</p>
        </div>
        <Link to="/profile" className="portal-button secondary">
          Update profile
        </Link>
      </div>
      <form className="portal-filters" onSubmit={search}>
        {[
          ["search", "Search title, description or skills"],
          ["location", "Location"],
          ["department", "Department"],
          ["skill", "Skill"],
        ].map(([key, label]) => (
          <label key={key}>
            {label}
            <input
              maxLength={200}
              value={filters[key]}
              onChange={(e) =>
                setFilters((f) => ({ ...f, [key]: e.target.value }))
              }
              placeholder={key === "search" ? "e.g. React developer" : label}
            />
          </label>
        ))}
        <label>
          Employment type
          <select
            value={filters.employmentType}
            onChange={(e) =>
              setFilters((f) => ({ ...f, employmentType: e.target.value }))
            }
          >
            <option value="">All types</option>
            {[
              "full-time",
              "part-time",
              "contract",
              "internship",
              "freelance",
            ].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <label>
          Experience level
          <select
            value={filters.experienceLevel}
            onChange={(e) =>
              setFilters((f) => ({ ...f, experienceLevel: e.target.value }))
            }
          >
            <option value="">All levels</option>
            {["entry", "junior", "mid", "senior", "lead"].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <div className="portal-actions">
          <button className="portal-button">Search jobs</button>
          <button
            type="button"
            className="portal-button secondary"
            onClick={() => {
              setFilters(Object.fromEntries(keys.map((k) => [k, ""])));
              setLoading(true);
              setParams({});
            }}
          >
            Clear filters
          </button>
        </div>
      </form>
      {message && (
        <p role="status" className="portal-message">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="portal-message error">
          {error}
        </p>
      )}
      {loading ? (
        <p role="status">Loading jobs...</p>
      ) : (
        <>
          <p className="portal-result-count">
            {data?.total || 0} available jobs
          </p>
          <div className="portal-jobs">
            {data?.jobs?.map((job) => (
              <article className="portal-card" key={job._id}>
                <p className="eyebrow">
                  {job.organization?.name || "Organization"}
                </p>
                <h2>{job.title}</h2>
                <p>
                  {job.location || "Location not specified"} ·{" "}
                  {job.employmentType} · {job.experienceLevel}
                </p>
                <p className="job-excerpt">{job.description}</p>
                <div className="portal-tags">
                  {job.skills?.map((s, i) => (
                    <span key={`${s}-${i}`}>{s}</span>
                  ))}
                </div>
                {(job.salaryMin != null || job.salaryMax != null) && (
                  <p>
                    Salary: {job.salaryCurrency}{" "}
                    {job.salaryMin?.toLocaleString() ?? "Not specified"} to{" "}
                    {job.salaryMax?.toLocaleString() ?? "Not specified"}
                  </p>
                )}
                <details>
                  <summary>Job description and requirements</summary>
                  <p className="whitespace-pre-wrap">{job.description}</p>
                  <h3>Requirements</h3>
                  <ul>
                    {job.requirements?.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                  <h3>Responsibilities</h3>
                  <ul>
                    {job.responsibilities?.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                  {job.applicationDeadline && (
                    <p>
                      Apply by{" "}
                      {new Date(job.applicationDeadline).toLocaleDateString()}
                    </p>
                  )}
                </details>
                <button
                  disabled={job.hasApplied}
                  className="portal-button"
                  onClick={() => {
                    setActive(job);
                    setCoverLetter("");
                    setMessage("");
                  }}
                >
                  {job.hasApplied ? "Already applied" : "Apply for this role"}
                </button>
              </article>
            ))}
          </div>
          {!error && !data?.jobs?.length && (
            <div className="portal-empty">
              No published jobs match these filters. Try a broader search.
            </div>
          )}
        </>
      )}
      <div className="portal-pagination">
        <button
          disabled={page <= 1 || loading}
          onClick={() => {
            setLoading(true);
            setParams((p) => {
              p.set("page", page - 1);
              return p;
            });
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
            setParams((p) => {
              p.set("page", page + 1);
              return p;
            });
          }}
        >
          Next
        </button>
      </div>
      {active && (
        <div className="portal-modal-backdrop">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="apply-title"
            className="portal-modal"
          >
            <h2 id="apply-title">Apply: {active.title}</h2>
            <p>
              Your profile and uploaded resume will be shared with{" "}
              {active.organization?.name}. The recruiter reviews your
              application and any AI screening suggestions.
            </p>
            <form onSubmit={apply}>
              <label>
                Cover letter (optional)
                <textarea
                  autoFocus
                  rows={6}
                  maxLength={10000}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </label>
              <div className="portal-actions">
                <button disabled={saving} className="portal-button">
                  {saving ? "Submitting..." : "Submit application"}
                </button>
                <button
                  disabled={saving}
                  type="button"
                  className="portal-button secondary"
                  onClick={() => setActive(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}
