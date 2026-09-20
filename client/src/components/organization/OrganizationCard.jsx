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
        border-slate-800
        bg-slate-900/90
        p-6
        text-slate-100
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
            bg-blue-500/20
            text-blue-300
          "
        >
          <Building2 size={28} />
        </div>

        <div className="min-w-0">
          <h2 className="text-xl font-bold text-white">
            {organization.name}
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            {organization.industry ||
              "Industry not specified"}
          </p>

          <span
            className="
              mt-3
              inline-block
              rounded-full
              border
              border-blue-400/30
              bg-blue-500/10
              px-3
              py-1
              text-xs
              font-medium
              text-blue-300
            "
          >
            {membership?.role}
          </span>
        </div>
      </div>

      {organization.description && (
        <p className="mt-5 text-sm leading-6 text-slate-300">
          {organization.description}
        </p>
      )}

      <div
        className="
          mt-6
          grid
          gap-3
          border-t
          border-slate-800
          pt-5
          sm:grid-cols-2
        "
      >
        <div className="flex items-center gap-2 text-sm text-slate-300">
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
              text-blue-300
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