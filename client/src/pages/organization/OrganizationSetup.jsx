import { useState } from "react";
import { Building2 } from "lucide-react";

import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

import {
  createOrganization,
} from "../../services/organizationService";

const OrganizationSetup = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    website: "",
    industry: "",
    companySize: "1-10",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

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
      setLoading(true);
      setError("");

      const data =
        await createOrganization(form);

      localStorage.setItem(
        "currentOrganizationId",
        data.organization._id
      );

      window.location.href =
        "/organization";
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create organization"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        bg-blue-600
        text-black
        flex
        items-center
        justify-center
        px-4
      "
    >
      <div
        className="
          w-full
          max-w-2xl
          rounded-2xl
          bg-blue-50
          p-8
          shadow-lg
        "
      >
        <div className="mb-8 text-center">
          <div
            className="
              mx-auto
              mb-4
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-xl
              bg-blue-200
              text-black
            "
          >
            <Building2 size={28} />
          </div>

          <h1 className="text-2xl font-bold">
            Create your organization
          </h1>

          <p className="mt-2 text-black/70">
            Set up your HireFlow workspace
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-black">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <Input
            label="Organization Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="HireFlow Technologies"
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
              rows="4"
              placeholder="Tell us about your company..."
              className="
                w-full
                rounded-lg
                border
                border-blue-300
                bg-white
                text-black
                px-3.5
                py-2.5
                outline-none
                focus:ring-2
                focus:ring-blue-500/20
              "
            />
          </div>

          <Input
            label="Website"
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="https://example.com"
          />

          <Input
            label="Industry"
            name="industry"
            value={form.industry}
            onChange={handleChange}
            placeholder="Software / IT"
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Company Size
            </label>

            <select
              name="companySize"
              value={form.companySize}
              onChange={handleChange}
              className="
                w-full
                rounded-lg
                border
                border-blue-300
                bg-white
                text-black
                px-3.5
                py-2.5
              "
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

          <Button
            type="submit"
            loading={loading}
            className="w-full"
          >
            Create Organization
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OrganizationSetup;