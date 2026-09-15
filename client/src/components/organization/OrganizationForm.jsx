import { useEffect, useState } from "react";

import {
  Building2,
  Globe,
  BriefcaseBusiness,
  Users,
  FileText,
  Loader2,
} from "lucide-react";

const initialFormData = {
  name: "",
  description: "",
  website: "",
  industry: "",
  companySize: "",
  logo: "",
};

const companySizes = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1001-5000",
  "5000+",
];

const OrganizationForm = ({
  organization = null,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] =
    useState(initialFormData);

  const [error, setError] = useState("");

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name || "",
        description:
          organization.description || "",
        website:
          organization.website || "",
        industry:
          organization.industry || "",
        companySize:
          organization.companySize || "",
        logo: organization.logo || "",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [organization]);

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const trimmedName =
      formData.name.trim();

    if (!trimmedName) {
      setError(
        "Organization name is required."
      );
      return;
    }

    try {
      await onSubmit({
        name: trimmedName,
        description:
          formData.description.trim(),
        website:
          formData.website.trim(),
        industry:
          formData.industry.trim(),
        companySize:
          formData.companySize,
        logo: formData.logo.trim(),
      });
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to save organization."
      );
    }
  };

  const isEditing = Boolean(
    organization
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Organization Name */}
      <div>
        <label
          htmlFor="organization-name"
          className="mb-2 block text-sm font-medium text-slate-200"
        >
          Organization Name
        </label>

        <div className="relative">
          <Building2
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            id="organization-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter organization name"
            required
            disabled={loading}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="organization-description"
          className="mb-2 block text-sm font-medium text-slate-200"
        >
          Description
        </label>

        <div className="relative">
          <FileText
            size={18}
            className="absolute left-3 top-3 text-slate-500"
          />

          <textarea
            id="organization-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Tell us about your organization"
            rows={4}
            disabled={loading}
            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      {/* Website */}
      <div>
        <label
          htmlFor="organization-website"
          className="mb-2 block text-sm font-medium text-slate-200"
        >
          Website
        </label>

        <div className="relative">
          <Globe
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            id="organization-website"
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://example.com"
            disabled={loading}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      {/* Industry */}
      <div>
        <label
          htmlFor="organization-industry"
          className="mb-2 block text-sm font-medium text-slate-200"
        >
          Industry
        </label>

        <div className="relative">
          <BriefcaseBusiness
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            id="organization-industry"
            type="text"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            placeholder="e.g. Software Development"
            disabled={loading}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      {/* Company Size */}
      <div>
        <label
          htmlFor="organization-company-size"
          className="mb-2 block text-sm font-medium text-slate-200"
        >
          Company Size
        </label>

        <div className="relative">
          <Users
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <select
            id="organization-company-size"
            name="companySize"
            value={formData.companySize}
            onChange={handleChange}
            disabled={loading}
            className="w-full appearance-none rounded-xl border border-white/10 bg-slate-900 py-3 pl-10 pr-4 text-white outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">
              Select company size
            </option>

            {companySizes.map((size) => (
              <option
                key={size}
                value={size}
              >
                {size} employees
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Logo */}
      <div>
        <label
          htmlFor="organization-logo"
          className="mb-2 block text-sm font-medium text-slate-200"
        >
          Logo URL
        </label>

        <input
          id="organization-logo"
          type="url"
          name="logo"
          value={formData.logo}
          onChange={handleChange}
          placeholder="https://example.com/logo.png"
          disabled={loading}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 border-t border-white/10 pt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex min-w-[150px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />

              Saving...
            </>
          ) : isEditing ? (
            "Update Organization"
          ) : (
            "Create Organization"
          )}
        </button>
      </div>
    </form>
  );
};

export default OrganizationForm;