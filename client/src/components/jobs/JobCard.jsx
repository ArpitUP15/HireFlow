import {
  MapPin,
  BriefcaseBusiness,
  Users,
  MoreVertical,
} from "lucide-react";

const JobCard = ({
  job,
  onEdit,
  onDelete,
  onPublish,
  onClose,
  onView,
}) => {
  const isPublished = job.status === "published";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-sm transition hover:border-slate-700 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <button
            onClick={() =>
              onView(job._id)
            }
            className="text-left text-xl font-bold text-slate-100 hover:text-blue-400"
          >
            {job.title}
          </button>

          <p className="mt-1 text-sm text-slate-400">
            {job.department ||
              "General"}
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
              job.status ===
              "published"
                ? "border border-green-400/30 bg-green-500/10 text-green-300"
                : job.status ===
                  "closed"
                ? "border border-red-400/30 bg-red-500/10 text-red-300"
                : "border border-yellow-400/30 bg-yellow-500/10 text-yellow-300"
            }
          `}
        >
          {job.status}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-400">
        <span className="flex items-center gap-1.5">
          <MapPin size={16} />
          {job.location ||
            "Remote"}
        </span>

        <span className="flex items-center gap-1.5">
          <BriefcaseBusiness
            size={16}
          />
          {job.employmentType}
        </span>

        <span className="flex items-center gap-1.5">
          <Users size={16} />
          {job.openings} opening
          {job.openings !== 1
            ? "s"
            : ""}
        </span>
      </div>

      {job.skills?.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {job.skills
            .slice(0, 5)
            .map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-200"
              >
                {skill}
              </span>
            ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-800 pt-5">
        <button
          onClick={() =>
            onView(job._id)
          }
          className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700"
        >
          View
        </button>

        <button
          onClick={() =>
            onEdit(job._id)
          }
          className="rounded-lg bg-blue-500/10 px-3 py-2 text-sm font-medium text-blue-300 hover:bg-blue-500/20"
        >
          Edit
        </button>

        <button
          onClick={() =>
            isPublished
              ? (window.location.href =
                  "/applications/create")
              : onView(job._id)
          }
          className={`rounded-lg px-3 py-2 text-sm font-medium ${
            isPublished
              ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/30 hover:from-blue-500 hover:to-indigo-500"
              : "bg-slate-800 text-slate-400"
          }`}
        >
          {isPublished ? "Apply" : "View Details"}
        </button>

        {job.status ===
          "draft" && (
          <button
            onClick={() =>
              onPublish(job._id)
            }
            className="rounded-lg bg-green-500/10 px-3 py-2 text-sm font-medium text-green-300 hover:bg-green-500/20"
          >
            Publish
          </button>
        )}

        {job.status ===
          "published" && (
          <button
            onClick={() =>
              onClose(job._id)
            }
            className="rounded-lg bg-orange-500/10 px-3 py-2 text-sm font-medium text-orange-300 hover:bg-orange-500/20"
          >
            Close
          </button>
        )}

        <button
          onClick={() =>
            onDelete(job._id)
          }
          className="rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/20"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default JobCard;