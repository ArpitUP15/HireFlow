import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add organization ID automatically
api.interceptors.request.use(
  (config) => {
    const organizationId =
      localStorage.getItem("currentOrganizationId");

    if (organizationId) {
      config.headers["x-organization-id"] =
        organizationId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Create organization
export const createOrganization = async (
  organizationData
) => {
  const response = await api.post(
    "/organizations",
    organizationData
  );

  return response.data;
};

// Get current organization
export const getCurrentOrganization =
  async () => {
    const response = await api.get(
      "/organizations/current"
    );

    return response.data;
  };

// Update organization
export const updateOrganization =
  async (organizationData) => {
    const response = await api.put(
      "/organizations/current",
      organizationData
    );

    return response.data;
  };

// Get members
export const getMembers = async () => {
  const response = await api.get(
    "/organizations/members"
  );

  return response.data;
};

// Invite member
export const inviteMember = async (
  memberData
) => {
  const response = await api.post(
    "/organizations/invite",
    memberData
  );

  return response.data;
};

// Accept invitation
export const acceptInvitation =
  async (token) => {
    const response = await api.post(
      "/organizations/accept-invitation",
      {
        token,
      }
    );

    return response.data;
  };

// Update member role
export const updateMemberRole =
  async (memberId, role) => {
    const response = await api.patch(
      `/organizations/members/${memberId}/role`,
      {
        role,
      }
    );

    return response.data;
  };

// Remove member
export const removeMember =
  async (memberId) => {
    const response = await api.delete(
      `/organizations/members/${memberId}`
    );

    return response.data;
  };

export default api;