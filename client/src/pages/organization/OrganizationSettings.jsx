import { useEffect, useState } from "react";
import {
  Building2,
  Users,
  UserPlus,
  Settings,
  RefreshCw,
  Shield,
  Mail,
  Trash2,
  Edit3,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import OrganizationForm from "../../components/organization/OrganizationForm";
import DeleteMemberModal from "../../components/organization/DeleteMemberModal";
import InviteMemberModal from "../../components/organization/InviteMemberModal";
import RoleSelect from "../../components/organization/RoleSelect";
import MemberTable from "../../components/organization/MemberTable";

import {
  getCurrentOrganization,
  updateOrganization,
  getMembers,
  inviteMember,
  updateMemberRole,
  removeMember,
} from "../../services/organizationService";

import { useAuth } from "../../context/useAuth";
import { useOrganization } from "../../context/OrganizationContext";

const OrganizationSettings = () => {
  const { user } = useAuth();
  const { currentOrganization, refreshOrganization } = useOrganization();

  const [organization, setOrganization] = useState(currentOrganization || null);
  const [members, setMembers] = useState([]);
  const [loadingOrganization, setLoadingOrganization] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [savingOrganization, setSavingOrganization] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showOrganizationForm, setShowOrganizationForm] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* --------------------------------------------------
   * Load Organization
   * -------------------------------------------------- */
  const loadOrganization = async () => {
    try {
      setLoadingOrganization(true);
      setError("");

      const response = await getCurrentOrganization();
      const organizationData =
        response?.organization ||
        response?.data?.organization ||
        response?.data ||
        response;

      setOrganization(organizationData);
    } catch (error) {
      console.error("Failed to load organization:", error);
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load organization."
      );
    } finally {
      setLoadingOrganization(false);
    }
  };

  /* --------------------------------------------------
   * Load Members
   * -------------------------------------------------- */
  const loadMembers = async () => {
    try {
      setLoadingMembers(true);

      const response = await getMembers();
      const memberData =
        response?.members || response?.data?.members || response?.data || [];

      setMembers(Array.isArray(memberData) ? memberData : []);
    } catch (error) {
      console.error("Failed to load members:", error);
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load organization members."
      );
    } finally {
      setLoadingMembers(false);
    }
  };

  /* --------------------------------------------------
   * Initial Load
   * -------------------------------------------------- */
  useEffect(() => {
    loadOrganization();
    loadMembers();
  }, []);

  /* --------------------------------------------------
   * Refresh Everything
   * -------------------------------------------------- */
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setError("");
      setSuccess("");

      await Promise.all([loadOrganization(), loadMembers()]);

      if (refreshOrganization) {
        await refreshOrganization();
      }

      setSuccess("Organization information refreshed successfully.");
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setRefreshing(false);
    }
  };

  /* --------------------------------------------------
   * Update Organization
   * -------------------------------------------------- */
  const handleUpdateOrganization = async (organizationData) => {
    try {
      setSavingOrganization(true);
      setError("");
      setSuccess("");

      const response = await updateOrganization(organizationData);
      const updatedOrganization =
        response?.organization ||
        response?.data?.organization ||
        response?.data ||
        organizationData;

      setOrganization(updatedOrganization);

      if (refreshOrganization) {
        await refreshOrganization();
      }

      setShowOrganizationForm(false);
      setSuccess("Organization updated successfully.");
    } catch (error) {
      console.error("Failed to update organization:", error);
      throw error;
    } finally {
      setSavingOrganization(false);
    }
  };

  /* --------------------------------------------------
   * Invite Member
   * -------------------------------------------------- */
  const handleInviteMember = async (memberData) => {
    try {
      setError("");
      setSuccess("");

      const response = await inviteMember(memberData);
      const message =
        response?.message ||
        response?.data?.message ||
        "Invitation sent successfully.";

      setSuccess(message);
      setShowInviteModal(false);
      await loadMembers();
    } catch (error) {
      console.error("Failed to invite member:", error);
      throw error;
    }
  };

  /* --------------------------------------------------
   * Update Member Role
   * -------------------------------------------------- */
  const handleUpdateMemberRole = async (member, role) => {
    try {
      setError("");
      setSuccess("");

      await updateMemberRole(member._id, role);

      setMembers((previousMembers) =>
        previousMembers.map((currentMember) =>
          currentMember._id === member._id
            ? { ...currentMember, role }
            : currentMember
        )
      );

      setSuccess("Member role updated successfully.");
    } catch (error) {
      console.error("Failed to update member role:", error);
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update member role."
      );
    }
  };

  /* --------------------------------------------------
   * Open / Close Delete Modal
   * -------------------------------------------------- */
  const handleOpenDeleteModal = (member) => {
    setSelectedMember(member);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    if (!showDeleteModal) return;
    setShowDeleteModal(false);
    setSelectedMember(null);
  };

  /* --------------------------------------------------
   * Remove Member
   * -------------------------------------------------- */
  const handleRemoveMember = async (member) => {
    try {
      setError("");
      setSuccess("");

      await removeMember(member._id);

      setMembers((previousMembers) =>
        previousMembers.filter(
          (currentMember) => currentMember._id !== member._id
        )
      );

      setSuccess("Member removed successfully.");
      setShowDeleteModal(false);
      setSelectedMember(null);
    } catch (error) {
      console.error("Failed to remove member:", error);
      throw error;
    }
  };

  /* --------------------------------------------------
   * Check Current User & Permissions
   * -------------------------------------------------- */
  const currentMembership = members.find(
    (member) => member.user?._id === user?._id || member.user === user?._id
  );

  const canManageMembers =
    currentMembership?.role === "owner" ||
    currentMembership?.role === "hr_admin" ||
    currentMembership?.permissions?.manageMembers === true;

  const canManageOrganization =
    currentMembership?.role === "owner" ||
    currentMembership?.role === "hr_admin";

  /* --------------------------------------------------
   * Loading State
   * -------------------------------------------------- */
  if (loadingOrganization && !organization) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <RefreshCw size={32} className="mx-auto animate-spin text-blue-500" />
          <p className="mt-4 text-sm text-slate-400">
            Loading organization settings...
          </p>
        </div>
      </div>
    );
  }

  /* --------------------------------------------------
   * Render
   * -------------------------------------------------- */
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                <Settings size={24} className="text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                  Organization Settings
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Manage your organization, members and permissions.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
            <AlertCircle size={20} className="mt-0.5 shrink-0 text-red-400" />
            <div>
              <p className="font-medium text-red-300">Something went wrong</p>
              <p className="mt-1 text-sm text-red-400">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4">
            <CheckCircle size={20} className="mt-0.5 shrink-0 text-green-400" />
            <p className="text-sm text-green-400">{success}</p>
          </div>
        )}

        {/* Organization Information Section */}
        <section className="mb-8 rounded-2xl border border-white/10 bg-white/3 p-5 shadow-xl sm:p-6">
          <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Building2 size={20} className="text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">
                  Organization Information
                </h2>
                <p className="text-sm text-slate-500">
                  Update your company details.
                </p>
              </div>
            </div>

            {canManageOrganization && (
              <button
                type="button"
                onClick={() =>
                  setShowOrganizationForm((previous) => !previous)
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                <Edit3 size={17} />
                {showOrganizationForm ? "Cancel" : "Edit Organization"}
              </button>
            )}
          </div>

          {showOrganizationForm ? (
            <OrganizationForm
              organization={organization}
              onSubmit={handleUpdateOrganization}
              onCancel={() => setShowOrganizationForm(false)}
              loading={savingOrganization}
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/2 p-5">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Organization Name
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {organization?.name || "Not available"}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/2 p-5">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Industry
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {organization?.industry || "Not specified"}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/2 p-5">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Company Size
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {organization?.companySize || "Not specified"}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/2 p-5">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Website
                </p>
                {organization?.website ? (
                  <a
                    href={organization.website}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 block truncate text-lg font-semibold text-blue-400 hover:text-blue-300"
                  >
                    {organization.website}
                  </a>
                ) : (
                  <p className="mt-2 text-lg font-semibold">Not specified</p>
                )}
              </div>

              <div className="md:col-span-2 rounded-xl border border-white/10 bg-white/2 p-5">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Description
                </p>
                <p className="mt-2 leading-7 text-slate-300">
                  {organization?.description ||
                    "No organization description has been added yet."}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Members Section */}
        <section className="rounded-2xl border border-white/10 bg-white/3 p-5 shadow-xl sm:p-6">
          <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                <Users size={20} className="text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Organization Members</h2>
                <p className="text-sm text-slate-500">
                  Manage team members and their roles.
                </p>
              </div>
            </div>

            {canManageMembers && (
              <button
                type="button"
                onClick={() => setShowInviteModal(true)}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                <UserPlus size={17} />
                Invite Member
              </button>
            )}
          </div>

          {/* Member Stats */}
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/2 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Members</p>
                  <p className="mt-1 text-2xl font-bold">{members.length}</p>
                </div>
                <Users size={22} className="text-blue-400" />
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/2 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Active Members</p>
                  <p className="mt-1 text-2xl font-bold">
                    {
                      members.filter(
                        (member) =>
                          !member.status || member.status === "active"
                      ).length
                    }
                  </p>
                </div>
                <CheckCircle size={22} className="text-green-400" />
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/2 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Administrators</p>
                  <p className="mt-1 text-2xl font-bold">
                    {
                      members.filter(
                        (member) =>
                          member.role === "owner" ||
                          member.role === "hr_admin"
                      ).length
                    }
                  </p>
                </div>
                <Shield size={22} className="text-purple-400" />
              </div>
            </div>
          </div>

          {/* Member Table */}
          {loadingMembers ? (
            <div className="flex min-h-55 items-center justify-center">
              <div className="text-center">
                <RefreshCw
                  size={28}
                  className="mx-auto animate-spin text-blue-500"
                />
                <p className="mt-3 text-sm text-slate-500">Loading members...</p>
              </div>
            </div>
          ) : members.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 p-10 text-center">
              <Users size={40} className="mx-auto text-slate-600" />
              <h3 className="mt-4 text-lg font-semibold">No members found</h3>
              <p className="mt-2 text-sm text-slate-500">
                Invite your first team member to start collaborating.
              </p>
              {canManageMembers && (
                <button
                  type="button"
                  onClick={() => setShowInviteModal(true)}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  <UserPlus size={17} />
                  Invite Member
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-175">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Member
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Role
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>
                    {canManageMembers && (
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => {
                    const memberUser = member.user || {};
                    const firstName = memberUser.firstName || "";
                    const lastName = memberUser.lastName || "";
                    const fullName =
                      `${firstName} ${lastName}`.trim() ||
                      memberUser.email ||
                      "Unknown User";

                    const isCurrentUser =
                      memberUser._id === user?._id || memberUser === user?._id;
                    const isOwner = member.role === "owner";

                    return (
                      <tr
                        key={member._id}
                        className="border-b border-white/5 transition hover:bg-white/2"
                      >
                        {/* Member Info */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-sm font-semibold text-blue-400">
                              {firstName?.charAt(0)?.toUpperCase() ||
                                memberUser.email?.charAt(0)?.toUpperCase() ||
                                "U"}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-medium text-white">
                                {fullName}
                                {isCurrentUser && (
                                  <span className="ml-2 rounded-full bg-blue-500/10 px-2 py-1 text-xs text-blue-400">
                                    You
                                  </span>
                                )}
                              </p>
                              <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                <Mail size={12} />
                                <span className="truncate">
                                  {memberUser.email}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role Selector/Badge */}
                        <td className="px-4 py-4">
                          {canManageMembers && !isOwner && !isCurrentUser ? (
                            <select
                              value={member.role || "member"}
                              onChange={(event) =>
                                handleUpdateMemberRole(member, event.target.value)
                              }
                              className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none focus:border-blue-500"
                            >
                              <option value="member">Member</option>
                              <option value="recruiter">Recruiter</option>
                              <option value="hr">HR</option>
                              <option value="hr_admin">HR Admin</option>
                            </select>
                          ) : (
                            <span className="inline-flex rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium capitalize text-slate-300">
                              {(member.role || "member").replace("_", " ")}
                            </span>
                          )}
                        </td>

                        {/* Status Badge */}
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                              !member.status || member.status === "active"
                                ? "bg-green-500/10 text-green-400"
                                : member.status === "pending"
                                ? "bg-yellow-500/10 text-yellow-400"
                                : "bg-slate-500/10 text-slate-400"
                            }`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {member.status || "active"}
                          </span>
                        </td>

                        {/* Actions */}
                        {canManageMembers && (
                          <td className="px-4 py-4 text-right">
                            {!isOwner && !isCurrentUser && (
                              <button
                                type="button"
                                onClick={() => handleOpenDeleteModal(member)}
                                className="inline-flex items-center gap-2 rounded-lg border border-red-500/25 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                              >
                                <Trash2 size={15} />
                                Remove
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Modals */}
        <InviteMemberModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          onSubmit={handleInviteMember}
        />

        <DeleteMemberModal
          isOpen={showDeleteModal}
          onClose={handleCloseDeleteModal}
          member={selectedMember}
          onConfirm={handleRemoveMember}
        />
      </div>
    </div>
  );
};

export default OrganizationSettings;