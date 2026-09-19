import api from "./api";


// =====================================================
// CREATE ORGANIZATION
// =====================================================

export const createOrganization =
  async (organizationData) => {

    const response =
      await api.post(
        "/organizations",
        organizationData
      );

    return response.data;
  };


// =====================================================
// GET MY ORGANIZATIONS
// =====================================================

export const getMyOrganizations =
  async () => {

    const response =
      await api.get(
        "/organizations/my"
      );

    return response.data;
  };


// =====================================================
// GET CURRENT ORGANIZATION
// =====================================================

export const getCurrentOrganization =
  async () => {

    const response =
      await api.get(
        "/organizations/current"
      );

    return response.data;
  };


// =====================================================
// UPDATE ORGANIZATION
// =====================================================

export const updateOrganization =
  async (organizationData) => {

    const response =
      await api.put(
        "/organizations/current",
        organizationData
      );

    return response.data;
  };


// =====================================================
// GET MEMBERS
// =====================================================

export const getMembers =
  async () => {

    const response =
      await api.get(
        "/organizations/members"
      );

    return response.data;
  };


// =====================================================
// INVITE MEMBER
// =====================================================

export const inviteMember =
  async (memberData) => {

    const response =
      await api.post(
        "/organizations/invite",
        memberData
      );

    return response.data;
  };


// =====================================================
// ACCEPT INVITATION
// =====================================================

export const acceptInvitation =
  async (token) => {

    const response =
      await api.post(
        "/organizations/accept-invitation",
        {
          token,
        }
      );

    return response.data;
  };


// =====================================================
// UPDATE MEMBER ROLE
// =====================================================

export const updateMemberRole =
  async (
    memberId,
    role
  ) => {

    const response =
      await api.patch(
        `/organizations/members/${memberId}/role`,
        {
          role,
        }
      );

    return response.data;
  };


// =====================================================
// REMOVE MEMBER
// =====================================================

export const removeMember =
  async (memberId) => {

    const response =
      await api.delete(
        `/organizations/members/${memberId}`
      );

    return response.data;
  };