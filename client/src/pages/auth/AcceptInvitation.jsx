import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useOrganization } from "../../context/useOrganization";
import { acceptInvitation } from "../../services/organizationService";
import { getMe } from "../../services/authService";
export default function AcceptInvitation() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const invitationId = params.get("invitationId");
  const invitationPath = invitationId
    ? `/accept-invitation?invitationId=${encodeURIComponent(invitationId)}`
    : `/accept-invitation?token=${encodeURIComponent(token || "")}`;
  const { user, loading, setUser } = useAuth();
  const { loadOrganizations } = useOrganization();
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const accept = async () => {
    setSaving(true);
    try {
      await acceptInvitation(token, invitationId);
      const d = await getMe();
      setUser(d.user);
      await loadOrganizations();
      setDone(true);
      setMessage(
        "Invitation accepted. You can open the organization workspace.",
      );
    } catch (e) {
      setMessage(e.response?.data?.message || "Could not accept invitation");
    } finally {
      setSaving(false);
    }
  };
  return (
    <main className="portal-page legal-page">
      <Link to="/">HireFlow</Link>
      <h1>Join an organization</h1>
      {!token && !invitationId ? (
        <p>Invalid invitation link.</p>
      ) : loading ? (
        <p>Checking account...</p>
      ) : !user ? (
        <>
          <p>
            Sign in using the email address that received this invitation. Then
            return to this link.
          </p>
          <Link
            className="portal-button"
            to="/login"
            state={{
              from: {
                pathname: invitationPath,
              },
            }}
          >
            Sign in
          </Link>
          <p>
            {token && (
              <Link to={`/register?invitation=${encodeURIComponent(token)}`}>
                Create an account
              </Link>
            )}
          </p>
        </>
      ) : done ? (
        <Link className="portal-button" to="/organization">
          Open organization
        </Link>
      ) : (
        <>
          <p>
            Signed in as {user.email}. Accepting this invitation gives this
            account access to the organization's recruiter workspace.
          </p>
          <button className="portal-button" disabled={saving} onClick={accept}>
            {saving ? "Accepting..." : "Accept invitation"}
          </button>
        </>
      )}
      {message && <p role="status">{message}</p>}
    </main>
  );
}
