import {
  BriefcaseBusiness,
  Mail,
  MapPin,
} from "lucide-react";

const statusStyles = {
  applied:
    "border border-blue-400/30 bg-blue-500/10 text-blue-300",

  screening:
    "border border-yellow-400/30 bg-yellow-500/10 text-yellow-300",

  shortlisted:
    "border border-purple-400/30 bg-purple-500/10 text-purple-300",

  interview:
    "border border-orange-400/30 bg-orange-500/10 text-orange-300",

  selected:
    "border border-green-400/30 bg-green-500/10 text-green-300",

  rejected:
    "border border-red-400/30 bg-red-500/10 text-red-300",
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
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-sm transition hover:border-slate-700 hover:shadow-lg">

      {/* Header */}

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-slate-700 to-slate-500 font-bold text-white">
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
              className="font-bold text-slate-100 hover:text-blue-400"
            >
              {candidate?.firstName}{" "}
              {candidate?.lastName}
            </button>

            <p className="text-sm text-slate-400">
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
            "border border-slate-600 bg-slate-800 text-slate-200"
          }`}
        >
          {application.status}
        </span>

      </div> 


      {/* Details */}

      <div className="mt-5 space-y-2 text-sm text-slate-400">

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
                className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-200"
              >
                {skill}
              </span>
            ))}

        </div>
      )}


      {/* Actions */}

      <div className="mt-6 border-t border-slate-800 pt-5">

        <div className="flex flex-wrap gap-2">

          <button
            onClick={() =>
              onView(
                application._id
              )
            }
            className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700"
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
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
          >
            <option value="applied" className="bg-slate-900 text-slate-100">
              Applied
            </option>

            <option value="screening" className="bg-slate-900 text-slate-100">
              Screening
            </option>

            <option value="shortlisted" className="bg-slate-900 text-slate-100">
              Shortlisted
            </option>

            <option value="interview" className="bg-slate-900 text-slate-100">
              Interview
            </option>

            <option value="selected" className="bg-slate-900 text-slate-100">
              Selected
            </option>

            <option value="rejected" className="bg-slate-900 text-slate-100">
              Rejected
            </option>
          </select>


          <button
            onClick={() =>
              onDelete(
                application._id
              )
            }
            className="rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/20"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
};

export default ApplicationCard;