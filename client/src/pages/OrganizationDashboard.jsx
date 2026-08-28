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
      <div className="p-8">
        <div className="rounded-xl bg-red-50 p-5 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="p-8">
        No organization selected.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-600">
            Organization
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            {organization.name}
          </h1>

          <p className="mt-2 text-gray-500">
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
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 text-blue-600">
        {icon}
      </div>

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold capitalize">
        {value}
      </p>
    </div>
  );
};

export default OrganizationDashboard;