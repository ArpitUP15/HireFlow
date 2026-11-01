import api from "./api";

export const getApplications = async (params = {}) => {
  const response = await api.get("/applications", { params });

  return response.data;
};

export const getApplicationById = async (id) => {
  const response = await api.get(`/applications/${id}`);

  return response.data;
};

export const createApplication = async (applicationData) => {
  const response = await api.post("/applications", applicationData);

  return response.data;
};

export const updateApplication = async (id, applicationData) => {
  const response = await api.put(`/applications/${id}`, applicationData);

  return response.data;
};

export const updateApplicationStatus = async (id, status) => {
  const response = await api.patch(`/applications/${id}/status`, {
    status,
  });

  return response.data;
};

export const deleteApplication = async (id) => {
  const response = await api.delete(`/applications/${id}`);

  return response.data;
};

export const getRecruitmentPipeline = async () => {
  const response = await api.get("/applications/pipeline");

  return response.data;
};
