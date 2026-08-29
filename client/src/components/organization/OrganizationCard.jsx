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
        border-blue-200
        bg-blue-50
        text-black
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
            bg-blue-200
            text-black
          "
        >
          <Building2 size={28} />
        </div>

        <div className="min-w-0">
          <h2 className="text-xl font-bold">
            {organization.name}
          </h2>

          <p className="mt-1 text-sm text-black/70">
            {organization.industry ||
              "Industry not specified"}
          </p>

          <span
            className="
              mt-3
              inline-block
              rounded-full
              bg-blue-200
              px-3
              py-1
              text-xs
              font-medium
              text-black
            "
          >
            {membership?.role}
          </span>
        </div>
      </div>

      {organization.description && (
        <p className="mt-5 text-sm leading-6 text-black/80">
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
        <div className="flex items-center gap-2 text-sm text-black/80">
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
              text-black
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