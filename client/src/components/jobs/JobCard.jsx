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
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <button
            onClick={() =>
              onView(job._id)
            }
            className="text-left text-xl font-bold text-gray-900 hover:text-blue-600"
          >
            {job.title}
          </button>

          <p className="mt-1 text-sm text-gray-500">
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
                ? "bg-green-50 text-green-700"
                : job.status ===
                  "closed"
                ? "bg-red-50 text-red-700"
                : "bg-yellow-50 text-yellow-700"
            }
          `}
        >
          {job.status}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-4 text-sm text-gray-500">
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
                className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700"
              >
                {skill}
              </span>
            ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2 border-t pt-5">
        <button
          onClick={() =>
            onView(job._id)
          }
          className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium hover:bg-gray-200"
        >
          View
        </button>

        <button
          onClick={() =>
            onEdit(job._id)
          }
          className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
        >
          Edit
        </button>

        {job.status ===
          "draft" && (
          <button
            onClick={() =>
              onPublish(job._id)
            }
            className="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100"
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
            className="rounded-lg bg-orange-50 px-3 py-2 text-sm font-medium text-orange-700 hover:bg-orange-100"
          >
            Close
          </button>
        )}

        <button
          onClick={() =>
            onDelete(job._id)
          }
          className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default JobCard;