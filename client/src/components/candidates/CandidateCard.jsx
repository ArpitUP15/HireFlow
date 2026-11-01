import { Mail, MapPin, BriefcaseBusiness } from "lucide-react";

const CandidateCard = ({ candidate, onView, onEdit, onDelete }) => {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
          {candidate.firstName?.[0]}
          {candidate.lastName?.[0]}
        </div>

        <div className="min-w-0">
          <button
            onClick={() => onView(candidate._id)}
            className="text-lg font-bold hover:text-primary"
          >
            {candidate.firstName} {candidate.lastName}
          </button>

          <p className="mt-1 text-sm text-muted">
            {candidate.headline || "Candidate"}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2 text-sm text-muted">
        <div className="flex items-center gap-2">
          <Mail size={16} />
          {candidate.email}
        </div>

        {candidate.location && (
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            {candidate.location}
          </div>
        )}

        <div className="flex items-center gap-2">
          <BriefcaseBusiness size={16} />
          {candidate.experience || 0} years experience
        </div>
      </div>

      {candidate.skills?.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {candidate.skills.slice(0, 6).map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-surface px-3 py-1 text-xs text-muted"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 flex gap-2 border-t pt-5">
        <button
          onClick={() => onView(candidate._id)}
          className="rounded-lg bg-surface px-3 py-2 text-sm"
        >
          View
        </button>

        <button
          onClick={() => onEdit(candidate._id)}
          className="rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(candidate._id)}
          className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent-readable"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default CandidateCard;
