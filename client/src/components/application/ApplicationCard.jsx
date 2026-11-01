import { BriefcaseBusiness, Mail, MapPin } from "lucide-react";

const statusStyles = {
  applied: "border border-primary/30 bg-primary/10 text-primary",

  screening:
    "border border-secondary/30 bg-secondary/10 text-secondary-readable",

  shortlisted:
    "border border-primary/30 bg-primary/10 text-primary",

  interview: "border border-accent/30 bg-accent/10 text-accent-readable",

  selected:
    "border border-secondary/30 bg-secondary/10 text-secondary-readable",

  rejected: "border border-accent/30 bg-accent/10 text-accent-readable",
};

const ApplicationCard = ({ application, onView, onStatusChange, onDelete }) => {
  const candidate = application.candidate;

  const job = application.job;

  return (
    <div className="rounded-2xl border border-border bg-surface/90 p-6 shadow-sm transition-opacity hover:border-border hover:shadow-lg">
      {/* Header */}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full    font-bold text-text bg-background">
            {candidate?.firstName?.[0]}
            {candidate?.lastName?.[0]}
          </div>

          <div>
            <button
              onClick={() => onView(application._id)}
              className="font-bold text-text hover:text-primary"
            >
              {candidate?.firstName} {candidate?.lastName}
            </button>

            <p className="text-sm text-muted">
              {candidate?.headline || "Candidate"}
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            statusStyles[application.status] ||
            "border border-border bg-surface-hover text-text"
          }`}
        >
          {application.status}
        </span>
      </div>

      {/* Details */}

      <div className="mt-5 space-y-2 text-sm text-muted">
        <div className="flex items-center gap-2">
          <BriefcaseBusiness size={16} />

          {job?.title}
        </div>

        <div className="flex items-center gap-2">
          <Mail size={16} />

          {candidate?.email}
        </div>

        {candidate?.location && (
          <div className="flex items-center gap-2">
            <MapPin size={16} />

            {candidate.location}
          </div>
        )}
      </div>

      {/* Skills */}

      {candidate?.skills?.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {candidate.skills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-surface-hover px-3 py-1 text-xs text-text"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}

      <div className="mt-6 border-t border-border pt-5">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onView(application._id)}
            className="rounded-lg bg-surface-hover px-3 py-2 text-sm font-medium text-text hover:bg-surface-hover"
          >
            View
          </button>

          <select
            value={application.status}
            onChange={(event) =>
              onStatusChange(application._id, event.target.value)
            }
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-text"
          >
            <option value="applied" className="bg-surface text-text">
              Applied
            </option>

            <option
              value="screening"
              className="bg-surface text-text"
            >
              Screening
            </option>

            <option
              value="shortlisted"
              className="bg-surface text-text"
            >
              Shortlisted
            </option>

            <option
              value="interview"
              className="bg-surface text-text"
            >
              Interview
            </option>

            <option
              value="selected"
              className="bg-surface text-text"
            >
              Selected
            </option>

            <option
              value="rejected"
              className="bg-surface text-text"
            >
              Rejected
            </option>
          </select>

          <button
            onClick={() => onDelete(application._id)}
            className="rounded-lg bg-accent/10 px-3 py-2 text-sm font-medium text-accent-readable hover:bg-accent/20"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
