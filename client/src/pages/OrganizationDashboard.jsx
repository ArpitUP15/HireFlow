import {
  Users,
  BriefcaseBusiness,
  UserRound,
  Settings,
} from "lucide-react";

import Loader from "../components/common/Loader";
import OrganizationCard from "../components/organization/OrganizationCard";

import {
  useOrganization,
} from "../context/OrganizationContext";

const OrganizationDashboard = () => {
  const {
    organization,
    membership,
    loading,
    error,
  } = useOrganization();

  if (loading) {
    return <Loader text="Loading organization..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-600 p-8 text-black">
        <div className="rounded-xl bg-red-50 p-5 text-black">
          {error}
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-blue-600 p-8 text-black">
        No organization selected.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-600 p-6 text-black lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-black">
            Organization
          </p>

          <h1 className="mt-1 text-3xl font-bold text-black">
            {organization.name}
          </h1>

          <p className="mt-2 text-black/70">
            Manage your HireFlow workspace
          </p>
        </div>

        <OrganizationCard
          organization={organization}
          membership={membership}
        />

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<BriefcaseBusiness size={22} />}
            title="Active Jobs"
            value="0"
          />

          <StatCard
            icon={<UserRound size={22} />}
            title="Candidates"
            value="0"
          />

          <StatCard
            icon={<Users size={22} />}
            title="Team Members"
            value="0"
          />

          <StatCard
            icon={<Settings size={22} />}
            title="Role"
            value={membership?.role || "-"}
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  icon,
  title,
  value,
}) => {
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-black shadow-sm">
      <div className="mb-4 text-black">
        {icon}
      </div>

      <p className="text-sm text-black/70">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold capitalize">
        {value}
      </p>
    </div>
  );
};

export default OrganizationDashboard;