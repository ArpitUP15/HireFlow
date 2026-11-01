import { useEffect, useState } from "react";
import RecruitmentAI from "../../components/candidates/RecruitmentAI";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Globe,
  User,
  Loader2,
} from "lucide-react";

import {
  getCandidateById,
  deleteCandidate,
} from "../../services/candidateService";

const CandidateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);

  const [loading, setLoading] = useState(true);

  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");

  // ==========================================
  // FETCH CANDIDATE
  // ==========================================

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        setLoading(true);

        const response = await getCandidateById(id);

        setCandidate(response.candidate);
      } catch (err) {
        console.error(err);

        setError(err.response?.data?.message || "Failed to load candidate.");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this candidate?",
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await deleteCandidate(id);

      navigate("/candidates");
    } catch (err) {
      console.error(err);

      setError(err.response?.data?.message || "Failed to delete candidate.");

      setDeleting(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 text-center">
        <h2 className="text-2xl font-bold">Candidate not found</h2>

        <button
          onClick={() => navigate("/candidates")}
          className="mt-4 rounded-lg bg-primary px-5 py-3 text-background"
        >
          Back to Candidates
        </button>
      </div>
    );
  }

  const skills = Array.isArray(candidate.skills) ? candidate.skills : [];

  const fullName = `${candidate.firstName || ""} ${
    candidate.lastName || ""
  }`.trim();

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <RecruitmentAI candidateId={id} />
      {/* Top Navigation */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => navigate("/candidates")}
          className="flex items-center gap-2 text-muted hover:text-text"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Candidates
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/candidates/${id}/edit`)}
            className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-surface"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-on-accent hover:bg-accent/90 disabled:opacity-60"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-accent bg-accent/10 px-4 py-3 text-accent-readable">
          {error}
        </div>
      )}

      {/* Candidate Header */}
      <div className="rounded-2xl border bg-surface p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          {/* Avatar */}
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
            {candidate.firstName?.charAt(0)?.toUpperCase() || <User />}
          </div>

          {/* Information */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-text">
              {fullName || "Unnamed Candidate"}
            </h1>

            <p className="mt-1 text-lg text-muted">
              {candidate.currentTitle || "Candidate"}
            </p>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
              {candidate.email && (
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {candidate.email}
                </span>
              )}

              {candidate.phone && (
                <span className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {candidate.phone}
                </span>
              )}

              {candidate.location && (
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {candidate.location}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Main */}
        <div className="space-y-6 lg:col-span-2">
          {/* Professional */}
          <div className="rounded-xl border bg-surface p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">
              Professional Information
            </h2>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted">Current Position</p>

                <p className="mt-1 font-medium">
                  {candidate.currentTitle || "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted">Experience</p>

                <p className="mt-1 font-medium">
                  {candidate.experience || "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="rounded-xl border bg-surface p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold">Skills</h2>

            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted">No skills added.</p>
            )}
          </div>

          {/* Education */}
          <div className="rounded-xl border bg-surface p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Education</h2>

            <p className="whitespace-pre-line text-muted">
              {candidate.education || "No education information provided."}
            </p>
          </div>

          {/* Recruiter Notes */}
          <div className="rounded-xl border bg-surface p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Recruiter Notes</h2>

            <p className="whitespace-pre-line text-muted">
              {candidate.notes || "No recruiter notes available."}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact */}
          <div className="rounded-xl border bg-surface p-6 shadow-sm">
            <h3 className="mb-5 text-lg font-semibold">Contact</h3>

            <div className="space-y-4">
              {candidate.email && (
                <a
                  href={`mailto:${candidate.email}`}
                  className="flex items-center gap-3 text-muted hover:text-primary"
                >
                  <Mail className="h-5 w-5" />
                  <span className="truncate">{candidate.email}</span>
                </a>
              )}

              {candidate.phone && (
                <a
                  href={`tel:${candidate.phone}`}
                  className="flex items-center gap-3 text-muted hover:text-primary"
                >
                  <Phone className="h-5 w-5" />
                  {candidate.phone}
                </a>
              )}
            </div>
          </div>

          {/* Profiles */}
          <div className="rounded-xl border bg-surface p-6 shadow-sm">
            <h3 className="mb-5 text-lg font-semibold">Online Profiles</h3>

            <div className="space-y-4">
              {candidate.linkedin && (
                <a
                  href={candidate.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-muted hover:text-primary"
                >
                  <ExternalLink className="h-5 w-5" />
                  LinkedIn
                </a>
              )}

              {candidate.github && (
                <a
                  href={candidate.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-muted hover:text-primary"
                >
                  <ExternalLink className="h-5 w-5" />
                  GitHub
                </a>
              )}

              {candidate.portfolio && (
                <a
                  href={candidate.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-muted hover:text-primary"
                >
                  <Globe className="h-5 w-5" />
                  Portfolio
                </a>
              )}
            </div>
          </div>

          {/* Resume */}
          {candidate.resumeUrl && (
            <div className="rounded-xl border bg-surface p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">Resume</h3>

              <a
                href={candidate.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="block rounded-lg bg-primary px-4 py-3 text-center font-medium text-background hover:bg-primary/90"
              >
                View Resume
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDetails;
