import { Calendar, Clock, ExternalLink, MapPin, Video } from "lucide-react";

import { Link } from "react-router-dom";

const InterviewCard = ({ interview }) => {
  const date = new Date(interview.scheduledAt);

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 transition-opacity hover:border-primary/30">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-text">
            {interview.title}
          </h3>

          <p className="mt-1 text-sm text-muted">
            {interview.candidate?.firstName || "Candidate"}{" "}
            {interview.candidate?.lastName || ""}
          </p>
        </div>

        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium capitalize text-primary">
          {interview.status?.replace("_", " ")}
        </span>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-muted">
        <div className="flex items-center gap-2">
          <Calendar size={16} />

          {date.toLocaleDateString()}
        </div>

        <div className="flex items-center gap-2">
          <Clock size={16} />
          {date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {" • "}
          {interview.duration} min
        </div>

        <div className="flex items-center gap-2">
          {interview.type === "video" ? (
            <Video size={16} />
          ) : (
            <MapPin size={16} />
          )}

          <span className="capitalize">{interview.type}</span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <span className="text-sm capitalize text-muted">
          {interview.round}
        </span>

        <Link
          to={`/interviews/${interview._id}`}
          className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-background hover:bg-primary/90"
        >
          View
          <ExternalLink size={15} />
        </Link>
      </div>
    </div>
  );
};

export default InterviewCard;
