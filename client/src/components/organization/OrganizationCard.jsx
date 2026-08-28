import {
  Building2,
  Globe,
  Users,
} from "lucide-react";

const OrganizationCard = ({
  organization,
  membership,
}) => {
  return (
    <div
      className="
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-6
        shadow-sm
      "
    >
      <div className="flex items-start gap-4">
        <div
          className="
            flex
            h-14
            w-14
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-blue-100
            text-blue-600
          "
        >
          <Building2 size={28} />
        </div>

        <div className="min-w-0">
          <h2 className="text-xl font-bold">
            {organization.name}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {organization.industry ||
              "Industry not specified"}
          </p>

          <span
            className="
              mt-3
              inline-block
              rounded-full
              bg-blue-50
              px-3
              py-1
              text-xs
              font-medium
              text-blue-600
            "
          >
            {membership?.role}
          </span>
        </div>
      </div>

      {organization.description && (
        <p className="mt-5 text-sm leading-6 text-gray-600">
          {organization.description}
        </p>
      )}

      <div
        className="
          mt-6
          grid
          gap-3
          border-t
          pt-5
          sm:grid-cols-2
        "
      >
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users size={17} />
          {organization.companySize ||
            "Size not specified"}
        </div>

        {organization.website && (
          <a
            href={organization.website}
            target="_blank"
            rel="noreferrer"
            className="
              flex
              items-center
              gap-2
              text-sm
              text-blue-600
              hover:underline
            "
          >
            <Globe size={17} />
            Website
          </a>
        )}
      </div>
    </div>
  );
};

export default OrganizationCard;