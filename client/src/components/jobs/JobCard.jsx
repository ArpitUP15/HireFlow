import { MapPin, BriefcaseBusiness, Users } from "lucide-react";

const JobCard = ({ job, onEdit, onDelete, onPublish, onClose, onView }) => {
  const isPublished = job.status === "published";

  return (
    <div className="rounded-2xl border border-border bg-surface/90 p-6 shadow-sm transition-opacity hover:border-border hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <button
            onClick={() => onView(job._id)}
            className="text-left text-xl font-bold text-text hover:text-primary"
          >
            {job.title}
          </button>

          <p className="mt-1 text-sm text-muted">
            {job.department || "General"}
          </p>
        </div>

        <span
          className={`
            rounded-full
            px-3
            py-1
            text-xs
            font-medium
            ${
              job.status === "published"
                ? "border border-secondary/30 bg-secondary/10 text-secondary-readable"
                : job.status === "closed"
                  ? "border border-accent/30 bg-accent/10 text-accent-readable"
                  : "border border-secondary/30 bg-secondary/10 text-secondary-readable"
            }
          `}
        >
          {job.status}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-4 text-sm text-muted">
        <span className="flex items-center gap-1.5">
          <MapPin size={16} />
          {job.location || "Remote"}
        </span>

        <span className="flex items-center gap-1.5">
          <BriefcaseBusiness size={16} />
          {job.employmentType}
        </span>

        <span className="flex items-center gap-1.5">
          <Users size={16} />
          {job.openings} opening
          {job.openings !== 1 ? "s" : ""}
        </span>
      </div>

      {job.skills?.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {job.skills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-surface-hover px-3 py-1 text-xs text-text"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-5">
        <button
          onClick={() => onView(job._id)}
          className="rounded-lg bg-surface-hover px-3 py-2 text-sm font-medium text-text hover:bg-surface-hover"
        >
          View
        </button>

        <button
          onClick={() => onEdit(job._id)}
          className="rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/20"
        >
          Edit
        </button>

        <button
          onClick={() =>
            isPublished
              ? (window.location.href = "/applications/create")
              : onView(job._id)
          }
          className={`rounded-lg px-3 py-2 text-sm font-medium ${
            isPublished
              ? "   text-text shadow-lg shadow-primary/30   bg-background"
              : "bg-surface-hover text-muted"
          }`}
        >
          {isPublished ? "Apply" : "View Details"}
        </button>

        {job.status === "draft" && (
          <button
            onClick={() => onPublish(job._id)}
            className="rounded-lg bg-secondary/10 px-3 py-2 text-sm font-medium text-secondary-readable hover:bg-secondary/20"
          >
            Publish
          </button>
        )}

        {job.status === "published" && (
          <button
            onClick={() => onClose(job._id)}
            className="rounded-lg bg-accent/10 px-3 py-2 text-sm font-medium text-accent-readable hover:bg-accent/20"
          >
            Close
          </button>
        )}

        <button
          onClick={() => onDelete(job._id)}
          className="rounded-lg bg-accent/10 px-3 py-2 text-sm font-medium text-accent-readable hover:bg-accent/20"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default JobCard;
