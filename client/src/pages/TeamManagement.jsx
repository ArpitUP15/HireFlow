import {
  useEffect,
  useState,
} from "react";

import {
  UserPlus,
  RefreshCw,
} from "lucide-react";

import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import InviteMemberModal from "../components/organization/InviteMemberModal";
import MemberTable from "../components/organization/MemberTable";

import {
  getMembers,
  updateMemberRole,
  removeMember,
} from "../services/organizationService";

import {
  useOrganization,
} from "../context/OrganizationContext";

const TeamManagement = () => {
  const {
    membership,
    organization,
  } = useOrganization();

  const [members, setMembers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [error, setError] =
    useState("");

  const canManage =
    membership?.role ===
      "owner" ||
    membership?.role ===
      "hr_admin";

  const loadMembers = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getMembers();

      setMembers(
        data.members || []
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load members"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleRoleChange = async (
    memberId,
    role
  ) => {
    try {
      await updateMemberRole(
        memberId,
        role
      );

      await loadMembers();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update role"
      );
    }
  };

  const handleRemove = async (
    memberId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to remove this member?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await removeMember(
        memberId
      );

      await loadMembers();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to remove member"
      );
    }
  };

  if (loading) {
    return <Loader text="Loading team..." />;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_30%),linear-gradient(180deg,#020817_0%,#0f172a_100%)] px-4 py-6 text-slate-100 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-slate-300">
              {organization?.name}
            </p>

            <h1 className="mt-1 text-3xl font-bold text-white">
              Team Management
            </h1>

            <p className="mt-2 text-slate-400">
              Manage your organization's recruitment team.
            </p>
          </div>

          {canManage && (
            <Button
              onClick={() =>
                setModalOpen(true)
              }
            >
              <span className="flex items-center gap-2">
                <UserPlus size={18} />
                Invite Member
              </span>
            </Button>
          )}
        </div>

        {error && (
          <div className="mb-6 flex items-center justify-between rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            <span>{error}</span>

            <button
              onClick={loadMembers}
              className="rounded p-1 text-red-300 hover:bg-red-500/20"
            >
              <RefreshCw
                size={17}
              />
            </button>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-sm">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="font-semibold text-white">
              Team Members
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {members.length} member
              {members.length !== 1
                ? "s"
                : ""}
            </p>
          </div>

          <MemberTable
            members={members}
            currentUserId={
              membership?.user
            }
            onRoleChange={
              handleRoleChange
            }
            onRemove={
              handleRemove
            }
            canManage={canManage}
          />
        </div>
      </div>

      <InviteMemberModal
        isOpen={modalOpen}
        onClose={() =>
          setModalOpen(false)
        }
        onSuccess={
          loadMembers
        }
      />
    </div>
  );
};

export default TeamManagement;