import {
  Building2,
  BriefcaseBusiness,
  FileText,
  Globe,
  ShieldCheck,
  Users,
} from "lucide-react";

const OrganizationCard = ({ organization, membership }) => {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="rounded-2xl border border-border bg-surface/90 p-6 text-text shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md lg:col-span-2">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Building2 size={28} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Workspace
            </p>
            <h2 className="mt-1 wrap-break-word text-xl font-bold text-text sm:text-2xl">
              {organization.name}
            </h2>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface/90 p-5 text-text shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BriefcaseBusiness size={19} />
          </span>
          <h3 className="text-sm font-semibold text-muted">Industry</h3>
        </div>
        <p className="mt-4 text-lg font-semibold">
          {organization.industry || "Not specified"}
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-surface/90 p-5 text-text shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck size={19} />
          </span>
          <h3 className="text-sm font-semibold text-muted">Your role</h3>
        </div>
        <p className="mt-4 text-lg font-semibold capitalize">
          {membership?.role || "Not specified"}
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-surface/90 p-5 text-text shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users size={19} />
          </span>
          <h3 className="text-sm font-semibold text-muted">Company size</h3>
        </div>
        <p className="mt-4 text-lg font-semibold">
          {organization.companySize || "Not specified"}
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-surface/90 p-5 text-text shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileText size={19} />
          </span>
          <h3 className="text-sm font-semibold text-muted">About</h3>
        </div>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-6">
          {organization.description || "No description added yet."}
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-surface/90 p-5 text-text shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Globe size={19} />
          </span>
          <h3 className="text-sm font-semibold text-muted">Website</h3>
        </div>
        {organization.website ? (
          <a
            href={organization.website}
            target="_blank"
            rel="noreferrer"
            className="mt-4 block break-all text-sm font-medium text-primary hover:underline"
          >
            {organization.website}
          </a>
        ) : (
          <p className="mt-4 text-sm text-muted">No website added yet.</p>
        )}
      </section>
    </div>
  );
};

export default OrganizationCard;
