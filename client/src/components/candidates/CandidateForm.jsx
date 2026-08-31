import { useState } from "react";

import Input from "../common/Input";
import Button from "../common/Button";

const CandidateForm = ({
  initialData = {},
  onSubmit,
  loading = false,
  submitText = "Add Candidate",
}) => {
  const [form, setForm] =
    useState({
      firstName:
        initialData.firstName || "",

      lastName:
        initialData.lastName || "",

      email:
        initialData.email || "",

      phone:
        initialData.phone || "",

      location:
        initialData.location || "",

      headline:
        initialData.headline || "",

      summary:
        initialData.summary || "",

      skills:
        initialData.skills?.join(
          ", "
        ) || "",

      experience:
        initialData.experience || 0,

      resumeUrl:
        initialData.resumeUrl || "",

      linkedinUrl:
        initialData.linkedinUrl ||
        "",

      portfolioUrl:
        initialData.portfolioUrl ||
        "",

      source:
        initialData.source ||
        "manual",
    });

  const handleChange = (
    event
  ) => {
    setForm({
      ...form,
      [event.target.name]:
        event.target.value,
    });
  };

  const handleSubmit = (
    event
  ) => {
    event.preventDefault();

    onSubmit({
      ...form,

      experience: Number(
        form.experience
      ),

      skills: form.skills
        .split(",")
        .map((skill) =>
          skill.trim()
        )
        .filter(Boolean),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Input
          label="First Name"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          required
        />

        <Input
          label="Last Name"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <Input
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />

        <Input
          label="Location"
          name="location"
          value={form.location}
          onChange={handleChange}
        />

        <Input
          label="Professional Headline"
          name="headline"
          value={form.headline}
          onChange={handleChange}
          placeholder="MERN Stack Developer"
        />

        <Input
          label="Experience (years)"
          name="experience"
          type="number"
          value={form.experience}
          onChange={handleChange}
          min="0"
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Source
          </label>

          <select
            name="source"
            value={form.source}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
          >
            <option value="manual">
              Manual
            </option>

            <option value="linkedin">
              LinkedIn
            </option>

            <option value="referral">
              Referral
            </option>

            <option value="job-board">
              Job Board
            </option>

            <option value="website">
              Website
            </option>

            <option value="other">
              Other
            </option>
          </select>
        </div>
      </div>

      <Input
        label="Skills"
        name="skills"
        value={form.skills}
        onChange={handleChange}
        placeholder="React, Node.js, MongoDB"
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Professional Summary
        </label>

        <textarea
          name="summary"
          value={form.summary}
          onChange={handleChange}
          rows="6"
          className="w-full rounded-lg border border-gray-300 p-3"
          placeholder="Candidate summary..."
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Input
          label="Resume URL"
          name="resumeUrl"
          value={form.resumeUrl}
          onChange={handleChange}
          placeholder="https://..."
        />

        <Input
          label="LinkedIn URL"
          name="linkedinUrl"
          value={form.linkedinUrl}
          onChange={handleChange}
          placeholder="https://linkedin.com/in/..."
        />

        <Input
          label="Portfolio URL"
          name="portfolioUrl"
          value={form.portfolioUrl}
          onChange={handleChange}
          placeholder="https://..."
        />
      </div>

      <Button
        type="submit"
        loading={loading}
        className="w-full"
      >
        {submitText}
      </Button>
    </form>
  );
};

export default CandidateForm;