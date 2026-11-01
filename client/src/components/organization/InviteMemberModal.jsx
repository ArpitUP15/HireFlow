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

  const [invitationLink, setInvitationLink] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailConfigured, setEmailConfigured] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await inviteMember({
        email,
        role,
      });

      setInvitationLink(data.invitation.invitationLink);
      setEmailSent(Boolean(data.invitation.emailSent));
      setEmailConfigured(Boolean(data.invitation.emailConfigured));

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
    setInvitationLink("");
    setEmailSent(false);
    setEmailConfigured(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Invite Team Member">
      {!invitationLink ? (
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
            Send Invitation
          </Button>
        </form>
      ) : (
        <div className="space-y-5">
          <div className="rounded-lg bg-secondary/10 p-4 text-sm text-secondary-readable">
            {emailSent
              ? "Invitation email sent successfully. The recipient can use the link in their email to join your organization."
              : emailConfigured
                ? "Invitation created, but email delivery failed. Copy the invitation link below and share it directly."
                : "Invitation created, but no email provider is configured. Set RESEND_API_KEY in server/.env to send invitations by email."}
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-muted">
              Invitation Link
            </p>

            <textarea
              readOnly
              value={invitationLink}
              rows="4"
              className="w-full rounded-lg border border-border p-3 text-sm"
            />
          </div>

          <p className="text-xs text-muted">
            {emailSent
              ? "You can also copy this link and share it directly if needed."
              : "Setup fallback: copy this link and share it directly until email delivery is configured."}
          </p>

          <Button onClick={handleClose} className="w-full">
            Done
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default InviteMemberModal;
