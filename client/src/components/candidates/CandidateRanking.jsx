const CandidateRanking = ({ candidate }) => {
  const screening = candidate?.aiScreening;

  if (!screening) {
    return (
      <div className="rounded-2xl border border-border bg-primary/5 p-5">
        <p className="text-muted">Candidate has not been AI screened yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-primary/5 p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-text">AI Screening</h3>

        <span className="text-2xl font-bold text-primary">
          {screening.matchScore}%
        </span>
      </div>

      <div className="mt-5">
        <p className="text-sm text-muted">Skills Matched</p>

        <div className="mt-2 flex flex-wrap gap-2">
          {screening.skillsMatched?.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-secondary/10 px-3 py-1 text-xs text-secondary-readable"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-sm text-muted">Recommendation</p>

        <p className="mt-2 text-sm text-text">{screening.recommendation}</p>
      </div>
    </div>
  );
};

export default CandidateRanking;
