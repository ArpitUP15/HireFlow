import {
  BriefcaseBusiness,
  Mail,
  MapPin,
} from "lucide-react";

const statusStyles = {
  applied:
    "bg-blue-50 text-blue-700",

  screening:
    "bg-yellow-50 text-yellow-700",

  shortlisted:
    "bg-purple-50 text-purple-700",

  interview:
    "bg-orange-50 text-orange-700",

  selected:
    "bg-green-50 text-green-700",

  rejected:
    "bg-red-50 text-red-700",
};


const ApplicationCard = ({
  application,
  onView,
  onStatusChange,
  onDelete,
}) => {
  const candidate =
    application.candidate;

  const job =
    application.job;

  return (
    <div className="rounded-2xl border border-gray-200     p-6 shadow-sm transition hover:shadow-md">

      {/* Header */}

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-b from-slate-900 to-slate-700 text-white  font-bold">
            {candidate?.firstName?.[0]}
            {candidate?.lastName?.[0]}
          </div>

          <div>

            <button
              onClick={() =>
                onView(
                  application._id
                )
              }
              className="font-bold text-gray-900 hover:text-blue-600"
            >
              {candidate?.firstName}{" "}
              {candidate?.lastName}
            </button>

            <p className="text-sm text-gray-500">
              {candidate?.headline ||
                "Candidate"}
            </p>

          </div>

        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            statusStyles[
              application.status
            ] ||
            "bg-gray-100 text-gray-700"
          }`}
        >
          {application.status}
        </span>

      </div> 


      {/* Details */}

      <div className="mt-5 space-y-2 text-sm text-gray-500">

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

      {candidate?.skills?.length >
        0 && (
        <div className="mt-5 flex flex-wrap gap-2">

          {candidate.skills
            .slice(0, 5)
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


      {/* Actions */}

      <div className="mt-6 border-t pt-5">

        <div className="flex flex-wrap gap-2">

          <button
            onClick={() =>
              onView(
                application._id
              )
            }
            className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium hover:bg-gray-200"
          >
            View
          </button>


          <select
            value={
              application.status
            }
            onChange={(event) =>
              onStatusChange(
                application._id,
                event.target.value
              )
            }
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="applied">
              Applied
            </option>

            <option value="screening">
              Screening
            </option>

            <option value="shortlisted">
              Shortlisted
            </option>

            <option value="interview">
              Interview
            </option>

            <option value="selected">
              Selected
            </option>

            <option value="rejected">
              Rejected
            </option>
          </select>


          <button
            onClick={() =>
              onDelete(
                application._id
              )
            }
            className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
};

export default ApplicationCard;