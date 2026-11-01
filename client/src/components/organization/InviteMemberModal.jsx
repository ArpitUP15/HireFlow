import { useState } from "react";

import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";

import { inviteMember } from "../../services/organizationService";

const InviteMemberModal = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState("");

  const [role, setRole] = useState("recruiter");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [invitation, setInvitation] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await inviteMember({
        email,
        role,
      });

      setInvitation(data.invitation);

      onSuccess?.();
    } catch (error) {
      setError(error.response?.data?.message || "Unable to send invitation");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setRole("recruiter");
    setError("");
    setInvitation(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Invite Team Member">
      {!invitation ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-lg bg-accent/10 p-3 text-sm text-accent-readable">
              {error}
            </div>
          )}

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="recruiter@example.com"
            required
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-muted">
              Role
            </label>

            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2.5"
            >
              <option value="recruiter">Recruiter</option>

              <option value="hr_admin">HR Admin</option>

              <option value="interviewer">Interviewer</option>
            </select>
          </div>

          <Button type="submit" loading={loading} className="w-full">
            Create Invitation
          </Button>
        </form>
      ) : (
        <div className="space-y-5">
          <div className="rounded-lg bg-secondary/10 p-4 text-sm text-secondary-readable">
            Invitation email sent to {invitation.email}.
          </div>
          {invitation.notificationSent && (
            <p className="text-sm text-muted">
              An in-app notification was also sent to their account.
            </p>
          )}

          <Button onClick={handleClose} className="w-full">
            Done
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default InviteMemberModal;
