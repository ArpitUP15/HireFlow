import api from "./api";


// ============================================================
// CREATE APPLICATION
// ============================================================

export const createApplication = (
  applicationData
) => {
  return api.post(
    "/applications",
    applicationData
  );
};


// ============================================================
// GET ALL APPLICATIONS
// ============================================================

export const getApplications = (params = {}) => {
  return api.get(
    "/applications",
    {
      params,
    }
  );
};


// ============================================================
// GET APPLICATION BY ID
// ============================================================

export const getApplicationById = (id) => {
  return api.get(
    `/applications/${id}`
  );
};


// ============================================================
// UPDATE APPLICATION
// ============================================================

export const updateApplication = (
  id,
  applicationData
) => {
  return api.put(
    `/applications/${id}`,
    applicationData
  );
};


// ============================================================
// UPDATE APPLICATION STATUS
// ============================================================

export const updateApplicationStatus = (
  id,
  status
) => {
  return api.patch(
    `/applications/${id}/status`,
    {
      status,
    }
  );
};


// ============================================================
// DELETE APPLICATION
// ============================================================

export const deleteApplication = (id) => {
  return api.delete(
    `/applications/${id}`
  );
};


// ============================================================
// GET JOB APPLICATIONS
// ============================================================

export const getJobApplications = (
  jobId
) => {
  return api.get(
    `/applications/job/${jobId}`
  );
};


// ============================================================
// GET CANDIDATE APPLICATIONS
// ============================================================

export const getCandidateApplications = (
  candidateId
) => {
  return api.get(
    `/applications/candidate/${candidateId}`
  );
};


// ============================================================
// GET RECRUITMENT PIPELINE
// ============================================================

export const getRecruitmentPipeline = () => {
  return api.get(
    "/applications/pipeline"
  );
};

