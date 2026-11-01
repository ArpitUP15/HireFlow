import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getApplicationById,
  updateApplication,
  updateApplicationStatus,
} from "../../services/applicationService";
import { downloadResume } from "../../services/portalService";
import { statuses } from "../../components/application/statuses";
import RecruitmentAI from "../../components/candidates/RecruitmentAI";
import ResumeUpload from "../../components/candidates/ResumeUpload";
export default function ApplicationDetails() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState("");
  useEffect(() => {
    let mounted = true;
    getApplicationById(id)
      .then((d) => {
        if (mounted) {
          setApplication(d.application);
          setNotes(d.application.recruiterNotes || "");
          setRating(d.application.rating || "");
        }
      })
      .catch((e) => {
        if (mounted)
          setError(
            e.response?.data?.message || "Application could not be loaded",
          );
      });
    return () => {
      mounted = false;
    };
  }, [id]);
  const changeStatus = async (status) => {
    setSaving(true);
    try {
      const d = await updateApplicationStatus(id, status);
      setApplication((a) => ({
        ...a,
        status: d.application.status,
        statusHistory: d.application.statusHistory,
      }));
      setError("");
    } catch (e) {
      setError(e.response?.data?.message || "Status update failed");
    } finally {
      setSaving(false);
    }
  };
  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateApplication(id, {
        recruiterNotes: notes,
        rating: rating ? Number(rating) : null,
      });
      setError("");
    } catch (e) {
      setError(e.response?.data?.message || "Notes could not be saved");
    } finally {
      setSaving(false);
    }
  };
  if (!application)
    return (
      <section className="portal-page">
        {error ? <p role="alert">{error}</p> : <p>Loading application...</p>}
      </section>
    );
  const candidate = application.profileSnapshot
    ? {
        ...application.candidate,
        ...application.profileSnapshot,
        resume: application.submittedResume || application.candidate?.resume,
      }
    : application.candidate;
  const job = application.job;
  return (
    <section className="portal-page">
      <Link to="/applications">Back to applications</Link>
      <div className="portal-heading">
        <div>
          <h1>
            {candidate?.firstName} {candidate?.lastName}
          </h1>
          <p>{job?.title || "Job unavailable"}</p>
        </div>
        <label>
          Application status
          <select
            disabled={saving}
            value={application.status}
            onChange={(e) => changeStatus(e.target.value)}
          >
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      {error && (
        <p role="alert" className="portal-message error">
          {error}
        </p>
      )}
      <div className="portal-profile-layout">
        <div className="portal-history">
          <article className="portal-card">
            <h2>Applicant information</h2>
            <p>{candidate?.headline}</p>
            <p>
              {candidate?.email} · {candidate?.phone}
            </p>
            <p>{candidate?.location}</p>
            <p>{candidate?.summary}</p>
            <h3>Education</h3>
            <p>{candidate?.education || "Not supplied"}</p>
            <h3>Skills and experience</h3>
            <p>
              {candidate?.skills?.join(", ") || "Not supplied"} ·{" "}
              {candidate?.experience || 0} years
            </p>
            <h3>Cover letter</h3>
            <p className="whitespace-pre-wrap">
              {application.coverLetter || "No cover letter supplied"}
            </p>
            {candidate?.resume?.fileName && (
              <button
                className="portal-button secondary"
                onClick={() =>
                  downloadResume(
                    application.submittedResume?.fileName
                      ? `/applications/${id}/resume`
                      : `/candidates/${candidate._id}/resume`,
                    candidate.resume.originalName,
                  ).catch(() => setError("Resume could not be downloaded"))
                }
              >
                Download submitted resume
              </button>
            )}
          </article>
          {candidate && (
            <RecruitmentAI
              candidateId={candidate._id}
              jobId={job?._id}
              showHistory={false}
            />
          )}
        </div>
        <aside className="portal-history">
          <form className="portal-card" onSubmit={save}>
            <h2>Recruiter notes</h2>
            <label>
              Private notes
              <textarea
                rows={7}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>
            <label>
              Rating
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="">Unrated</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </label>
            <button disabled={saving} className="portal-button mt-4">
              {saving ? "Saving..." : "Save notes"}
            </button>
          </form>
          {candidate && !candidate.resume?.fileName && (
            <ResumeUpload
              candidateId={candidate._id}
              onUploaded={(c) =>
                setApplication((a) => ({ ...a, candidate: c }))
              }
            />
          )}
          <article className="portal-card">
            <h2>Status history</h2>
            {application.statusHistory?.map((h, i) => (
              <p key={i}>
                {h.status} · {new Date(h.changedAt).toLocaleString()}
              </p>
            ))}
          </article>
        </aside>
      </div>
    </section>
  );
}
