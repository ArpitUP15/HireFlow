import { useCallback, useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import CandidateCard from "../../components/candidates/CandidateCard";
import {
  getCandidates,
  deleteCandidate,
} from "../../services/candidateService";

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const loadCandidates = useCallback(async () => {
    try {
      const data = await getCandidates({
        search,
      });

      setCandidates(data.candidates || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    getCandidates({ search })
      .then((d) => setCandidates(d.candidates || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this candidate?")) {
      return;
    }

    try {
      await deleteCandidate(id);

      await loadCandidates();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to delete candidate");
    }
  };

  return (
    <div className="min-h-screen    text-text p-6 lg:p-8 bg-background">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold">Candidates</h1>

            <p className="mt-2 text-muted">
              Manage your organization's talent pool.
            </p>
          </div>

          <button
            onClick={() => (window.location.href = "/candidates/create")}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-background hover:bg-primary/90"
          >
            <Plus size={18} />
            Add Candidate
          </button>
        </div>

        <div className="mt-8 flex gap-3">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  loadCandidates();
                }
              }}
              placeholder="Search by name, email or skill..."
              className="w-full rounded-lg border border-border    py-2.5 pl-10 pr-4 outline-none"
            />
          </div>

          <button
            onClick={loadCandidates}
            className="rounded-lg bg-surface px-5 py-2.5 font-medium text-text"
          >
            Search
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-muted">
            Loading candidates...
          </div>
        ) : candidates.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed    py-20 text-center">
            <h2 className="text-xl font-semibold">No candidates found</h2>

            <p className="mt-2 text-muted">Add your first candidate.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {candidates.map((candidate) => (
              <CandidateCard
                key={candidate._id}
                candidate={candidate}
                onView={(id) => (window.location.href = `/candidates/${id}`)}
                onEdit={(id) =>
                  (window.location.href = `/candidates/${id}/edit`)
                }
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Candidates;
