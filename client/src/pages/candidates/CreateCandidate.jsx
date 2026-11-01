import { useState } from "react";

import CandidateForm from "../../components/candidates/CandidateForm";

import { createCandidate } from "../../services/candidateService";

const CreateCandidate = () => {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (candidateData) => {
    try {
      setLoading(true);
      setError("");

      await createCandidate(candidateData);

      window.location.href = "/candidates";
    } catch (error) {
      setError(error.response?.data?.message || "Unable to create candidate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6 text-text lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-text">Add Candidate</h1>

        <p className="mt-2 text-muted">
          Add a candidate to your talent database.
        </p>

        {error && (
          <div className="mt-6 rounded-lg border border-accent/30 bg-accent/10 p-4 text-accent-readable">
            {error}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-border bg-surface/90 p-6 shadow-sm">
          <CandidateForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default CreateCandidate;
