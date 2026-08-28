import { useState } from "react";

import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";

import {
  inviteMember,
} from "../../services/organizationService";

const InviteMemberModal = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] =
    useState("");

  const [role, setRole] =
    useState("recruiter");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [invitationLink, setInvitationLink] =
    useState("");

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data =
        await inviteMember({
          email,
          role,
        });

      setInvitationLink(
        data.invitation.invitationLink
      );

      onSuccess?.();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to send invitation"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setRole("recruiter");
    setError("");
    setInvitationLink("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Invite Team Member"
    >
      {!invitationLink ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value
              )
            }
            placeholder="recruiter@example.com"
            required
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Role
            </label>

            <select
              value={role}
              onChange={(event) =>
                setRole(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
            >
              <option value="recruiter">
                Recruiter
              </option>

              <option value="hr_admin">
                HR Admin
              </option>

              <option value="interviewer">
                Interviewer
              </option>
            </select>
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full"
          >
            Create Invitation
          </Button>
        </form>
      ) : (
        <div className="space-y-5">
          <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
            Invitation created successfully.
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">
              Invitation Link
            </p>

            <textarea
              readOnly
              value={invitationLink}
              rows="4"
              className="w-full rounded-lg border border-gray-300 p-3 text-sm"
            />
          </div>

          <p className="text-xs text-gray-500">
            Development mode: this link is shown
            here instead of being emailed.
          </p>

          <Button
            onClick={handleClose}
            className="w-full"
          >
            Done
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default InviteMemberModal;