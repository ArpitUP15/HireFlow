import {useEffect,useState,} from "react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";

import {
  getCurrentOrganization,
  updateOrganization,
} from "../services/organizationService";

import {
  useOrganization,
} from "../context/OrganizationContext";

const OrganizationSettings = () => {
  const {
    membership,
    loadOrganization,
  } = useOrganization();

  const [form, setForm] =
    useState({
      name: "",
      description: "",
      website: "",
      industry: "",
      companySize: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const data =
          await getCurrentOrganization();

        const org =
          data.organization;

        setForm({
          name: org.name || "",
          description:
            org.description || "",
          website:
            org.website || "",
          industry:
            org.industry || "",
          companySize:
            org.companySize || "",
        });
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load organization"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]:
        event.target.value,
    });
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await updateOrganization(
        form
      );

      await loadOrganization();

      setMessage(
        "Organization updated successfully."
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update organization"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  const canEdit =
    membership?.role ===
      "owner" ||
    membership?.role ===
      "hr_admin";

  if (!canEdit) {
    return (
      <div className="min-h-screen bg-blue-600 p-8 text-black">
        <div className="rounded-xl bg-blue-50 p-5 text-black">
          You don't have permission to edit this organization.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-600 p-6 text-black lg:p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold">
          Organization Settings
        </h1>

        <p className="mt-2 text-black/70">
          Update your organization's information.
        </p>

        {message && (
          <div className="mt-6 rounded-lg bg-green-50 p-4 text-sm text-black">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-black">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="
            mt-8
            space-y-5
            rounded-2xl
            border
            border-blue-200
            bg-blue-50
            p-6
            shadow-sm
          "
        >
          <Input
            label="Organization Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-black">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="5"
              className="w-full rounded-lg border border-blue-300 bg-white p-3 text-black outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <Input
            label="Website"
            name="website"
            value={form.website}
            onChange={handleChange}
          />

          <Input
            label="Industry"
            name="industry"
            value={form.industry}
            onChange={handleChange}
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-black">
              Company Size
            </label>

            <select
              name="companySize"
              value={form.companySize}
              onChange={handleChange}
              className="w-full rounded-lg border border-blue-300 bg-white px-3 py-2.5 text-black"
            >
              <option>1-10</option>
              <option>11-50</option>
              <option>51-200</option>
              <option>201-500</option>
              <option>501-1000</option>
              <option>1001-5000</option>
              <option>5000+</option>
            </select>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              loading={saving}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizationSettings;