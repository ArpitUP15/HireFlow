import api from "./api";


// ============================================================
// GET ALL CANDIDATES
// ============================================================

export const getCandidates = () => {
  return api.get("/candidates");
};


// ============================================================
// GET CANDIDATE BY ID
// ============================================================

export const getCandidateById = (id) => {
  return api.get(`/candidates/${id}`);
};


// ============================================================
// CREATE CANDIDATE
// ============================================================

export const createCandidate = (candidateData) => {
  return api.post(
    "/candidates",
    candidateData
  );
};


// ============================================================
// UPDATE CANDIDATE
// ============================================================

export const updateCandidate = (
  id,
  candidateData
) => {
  return api.put(
    `/candidates/${id}`,
    candidateData
  );
};


// ============================================================
// DELETE CANDIDATE
// ============================================================

export const deleteCandidate = (id) => {
  return api.delete(
    `/candidates/${id}`
  );
};

