import api from "./api";


export const getCandidates =
  async () => {

    const response =
      await api.get(
        "/candidates"
      );

    return response;
  };


export const getCandidateById =
  async (id) => {

    const response =
      await api.get(
        `/candidates/${id}`
      );

    return response;
  };


export const createCandidate =
  async (candidateData) => {

    const response =
      await api.post(
        "/candidates",
        candidateData
      );

    return response;
  };


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

    return response;
  };


export const deleteCandidate =
  async (id) => {

    const response =
      await api.delete(
        `/candidates/${id}`
      );

    return response;
  };