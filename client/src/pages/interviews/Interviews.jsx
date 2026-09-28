import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Plus,
  Loader2,
} from "lucide-react";

import { getInterviews } from "../../services/interviewServices";

const Interviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadInterviews = async () => {
    try {
      setLoading(true);

      const response = await getInterviews();

      setInterviews(response.interviews || []);
    } catch (error) {
      console.error(
        "Failed to load interviews:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Interviews
          </h1>

          <p className="mt-2 text-slate-400">
            Manage candidate interviews and feedback.
          </p>
        </div>

        <Link
          to="/interviews/create"
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-500"
        >
          <Plus size={18} />
          Schedule Interview
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2
            className="animate-spin text-blue-500"
            size={35}
          />
        </div>
      ) : interviews.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
          <CalendarDays
            className="mx-auto text-slate-500"
            size={40}
          />

          <h2 className="mt-4 text-xl font-semibold text-white">
            No interviews scheduled
          </h2>

          <p className="mt-2 text-slate-400">
            Schedule your first candidate interview.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {interviews.map((interview) => (
            <Link
              key={interview._id}
              to={`/interviews/${interview._id}`}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-blue-500/40"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-white">
                    {interview.candidate?.firstName}{" "}
                    {interview.candidate?.lastName}
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    {interview.job?.title}
                  </p>
                </div>

                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                  {interview.status}
                </span>
              </div>

              <div className="mt-4 text-sm text-slate-400">
                {interview.interviewType} •{" "}
                {interview.mode}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Interviews;