const CandidateRanking = ({
  candidate,
}) => {
  const screening =
    candidate?.aiScreening;

  if (!screening) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-slate-400">
          Candidate has not been AI screened yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">
          AI Screening
        </h3>

        <span className="text-2xl font-bold text-blue-400">
          {screening.matchScore}%
        </span>
      </div>

      <div className="mt-5">
        <p className="text-sm text-slate-400">
          Skills Matched
        </p>

        <div className="mt-2 flex flex-wrap gap-2">
          {screening.skillsMatched?.map(
            (skill) => (
              <span
                key={skill}
                className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400"
              >
                {skill}
              </span>
            )
          )}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-sm text-slate-400">
          Recommendation
        </p>

        <p className="mt-2 text-sm text-white">
          {screening.recommendation}
        </p>
      </div>
    </div>
  );
};

export default CandidateRanking;