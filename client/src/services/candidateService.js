import api from "./organizationService";


// CREATE CANDIDATE
export const createCandidate =
  async (candidateData) => {
    const response =
      await api.post(
        "/candidates",
        candidateData
      );

    return response.data;
  };


// GET CANDIDATES
export const getCandidates =
  async (params = {}) => {
    const response =
      await api.get(
        "/candidates",
        {
          params,
        }
      );

    return response.data;
  };


// GET CANDIDATE
export const getCandidateById =
  async (id) => {
    const response =
      await api.get(
        `/candidates/${id}`
      );

    return response.data;
  };


// UPDATE CANDIDATE
export const updateCandidate =
  async (
    id,
    candidateData
  ) => {
    const response =
      await api.put(
        `/candidates/${id}`,
        candidateData
      );

    return response.data;
  };


// DELETE CANDIDATE
export const deleteCandidate =
  async (id) => {
    const response =
      await api.delete(
        `/candidates/${id}`
      );

    return response.data;
  };