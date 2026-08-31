import {
  Mail,
  MapPin,
  BriefcaseBusiness,
} from "lucide-react";

const CandidateCard = ({
  candidate,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
          {candidate.firstName?.[0]}
          {candidate.lastName?.[0]}
        </div>

        <div className="min-w-0">
          <button
            onClick={() =>
              onView(candidate._id)
            }
            className="text-lg font-bold hover:text-blue-600"
          >
            {candidate.firstName}{" "}
            {candidate.lastName}
          </button>

          <p className="mt-1 text-sm text-gray-500">
            {candidate.headline ||
              "Candidate"}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2 text-sm text-gray-500">
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
          <BriefcaseBusiness
            size={16}
          />
          {candidate.experience || 0} years
          experience
        </div>
      </div>

      {candidate.skills?.length >
        0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {candidate.skills
            .slice(0, 6)
            .map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
              >
                {skill}
              </span>
            ))}
        </div>
      )}

      <div className="mt-5 flex gap-2 border-t pt-5">
        <button
          onClick={() =>
            onView(candidate._id)
          }
          className="rounded-lg bg-gray-100 px-3 py-2 text-sm"
        >
          View
        </button>

        <button
          onClick={() =>
            onEdit(candidate._id)
          }
          className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700"
        >
          Edit
        </button>

        <button
          onClick={() =>
            onDelete(candidate._id)
          }
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default CandidateCard;