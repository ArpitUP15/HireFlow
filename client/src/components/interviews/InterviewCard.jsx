import {
  Calendar,
  Clock,
  ExternalLink,
  MapPin,
  Video,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";


const InterviewCard = ({
  interview,
}) => {

  const date =
    new Date(
      interview.scheduledAt
    );


  return (

    <div className="rounded-2xl border border-white/10 bg-slate-900 p-5 transition hover:border-blue-500/30">


      <div className="flex items-start justify-between gap-4">


        <div>

          <h3 className="text-lg font-semibold text-white">

            {interview.title}

          </h3>


          <p className="mt-1 text-sm text-slate-400">

            {interview.candidate?.firstName ||
              "Candidate"}{" "}

            {interview.candidate?.lastName ||
              ""}

          </p>

        </div>


        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium capitalize text-blue-400">

          {interview.status?.replace(
            "_",
            " "
          )}

        </span>

      </div>


      <div className="mt-5 grid gap-3 text-sm text-slate-400">


        <div className="flex items-center gap-2">

          <Calendar
            size={16}
          />

          {date.toLocaleDateString()}

        </div>


        <div className="flex items-center gap-2">

          <Clock
            size={16}
          />

          {date.toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          )}

          {" • "}

          {interview.duration} min

        </div>


        <div className="flex items-center gap-2">

          {interview.type === "video" ? (

            <Video size={16} />

          ) : (

            <MapPin size={16} />

          )}

          <span className="capitalize">

            {interview.type}

          </span>

        </div>

      </div>


      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">


        <span className="text-sm capitalize text-slate-500">

          {interview.round}

        </span>


        <Link
          to={`/interviews/${interview._id}`}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >

          View

          <ExternalLink
            size={15}
          />

        </Link>

      </div>

    </div>
  );
};


export default InterviewCard;