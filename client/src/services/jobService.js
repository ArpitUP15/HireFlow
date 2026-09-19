import api from "./api";


export const getJobs = async () => {

  const response =
    await api.get("/jobs");

  return response;
};


export const getJobById =
  async (id) => {

    const response =
      await api.get(
        `/jobs/${id}`
      );

    return response;
  };


export const createJob =
  async (jobData) => {

    const response =
      await api.post(
        "/jobs",
        jobData
      );

    return response;
  };


export const updateJob =
  async (
    id,
    jobData
  ) => {

    const response =
      await api.put(
        `/jobs/${id}`,
        jobData
      );

    return response;
  };


export const deleteJob =
  async (id) => {

    const response =
      await api.delete(
        `/jobs/${id}`
      );

    return response;
  };


export const publishJob =
  async (id) => {

    const response =
      await api.patch(
        `/jobs/${id}/publish`
      );

    return response;
  };


export const closeJob =
  async (id) => {

    const response =
      await api.patch(
        `/jobs/${id}/close`
      );

    return response;
  };