import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Plus, Loader2 } from "lucide-react";

import { getInterviews } from "../../services/interviewServices";

const Interviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInterviews()
      .then((d) => setInterviews(d.interviews || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Interviews</h1>

          <p className="mt-2 text-muted">
            Manage candidate interviews and feedback.
          </p>
        </div>

        <Link
          to="/interviews/create"
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-3 font-medium text-background hover:bg-primary/90"
        >
          <Plus size={18} />
          Schedule Interview
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={35} />
        </div>
      ) : interviews.length === 0 ? (
        <div className="rounded-2xl border border-border bg-primary/5 p-10 text-center">
          <CalendarDays className="mx-auto text-muted" size={40} />

          <h2 className="mt-4 text-xl font-semibold text-text">
            No interviews scheduled
          </h2>

          <p className="mt-2 text-muted">
            Schedule your first candidate interview.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {interviews.map((interview) => (
            <Link
              key={interview._id}
              to={`/interviews/${interview._id}`}
              className="rounded-2xl border border-border bg-primary/5 p-5 transition-opacity hover:border-primary/40"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-text">
                    {interview.candidate?.firstName}{" "}
                    {interview.candidate?.lastName}
                  </h2>

                  <p className="mt-1 text-sm text-muted">
                    {interview.job?.title}
                  </p>
                </div>

                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                  {interview.status}
                </span>
              </div>

              <div className="mt-4 text-sm text-muted">
                {interview.interviewType} • {interview.mode}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Interviews;
