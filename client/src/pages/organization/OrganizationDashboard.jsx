import { Link } from "react-router-dom";

import Loader from "../../components/common/Loader";
import OrganizationCard from "../../components/organization/OrganizationCard";

import { useOrganization } from "../../context/useOrganization";

const OrganizationDashboard = () => {
  const { organization, membership, loading, error } = useOrganization();

  if (loading) {
    return <Loader text="Loading organization..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-8 text-text">
        <div className="rounded-xl border border-accent/30 bg-accent/10 p-5 text-accent-readable">
          {error}
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-background px-4 py-8 text-text lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-surface p-8">
          <p className="text-sm font-medium text-primary">
            Recruiter workspace
          </p>
          <h1 className="mt-2 text-3xl font-bold">
            You can set up an organization later
          </h1>
          <p className="mt-3 text-muted">
            You’re signed in, but organization-based hiring tools are available
            after you create or join an organization.
          </p>
          <Link className="portal-button mt-6 inline-flex" to="/organization/setup">
            Create organization
          </Link>
          <p className="mt-5 text-sm text-muted">
            Already invited? Open the invitation link you received to join an
            organization.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6 text-text lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-text">Organization</p>

          <h1 className="mt-1 text-3xl font-bold text-text">
            {organization.name}
          </h1>

          <p className="mt-2 text-muted">Manage your HireFlow workspace</p>
        </div>

        <OrganizationCard organization={organization} membership={membership} />
      </div>
    </div>
  );
};

export default OrganizationDashboard;
