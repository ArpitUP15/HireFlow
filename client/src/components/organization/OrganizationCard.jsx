import { Building2, Globe, Users } from "lucide-react";

const OrganizationCard = ({ organization, membership }) => {
  return (
    <div className="\n        rounded-2xl\n        border\n        border-border\n        bg-surface/90\n        p-6\n        text-text\n        shadow-sm\n      ">
      <div className="flex items-start gap-4">
        <div className="\n            flex\n            h-14\n            w-14\n            shrink-0\n            items-center\n            justify-center\n            rounded-xl\n            bg-primary/20\n            text-primary\n          ">
          <Building2 size={28} />
        </div>

        <div className="min-w-0">
          <h2 className="text-xl font-bold text-text">
            {organization.name}
          </h2>

          <p className="mt-1 text-sm text-muted">
            {organization.industry || "Industry not specified"}
          </p>

          <span className="\n              mt-3\n              inline-block\n              rounded-full\n              border\n              border-primary/30\n              bg-primary/10\n              px-3\n              py-1\n              text-xs\n              font-medium\n              text-primary\n            ">
            {membership?.role}
          </span>
        </div>
      </div>

      {organization.description && (
        <p className="mt-5 text-sm leading-6 text-text">
          {organization.description}
        </p>
      )}

      <div className="\n          mt-6\n          grid\n          gap-3\n          border-t\n          border-border\n          pt-5\n          sm:grid-cols-2\n        ">
        <div className="flex items-center gap-2 text-sm text-text">
          <Users size={17} />
          {organization.companySize || "Size not specified"}
        </div>

        {organization.website && (
          <a
            href={organization.website}
            target="_blank"
            rel="noreferrer"
            className="\n              flex\n              items-center\n              gap-2\n              text-sm\n              text-primary\n              hover:underline\n            "
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
