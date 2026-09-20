import { useState } from "react";

import Input from "../common/Input";
import Button from "../common/Button";

const JobForm = ({
  initialData = {},
  onSubmit,
  loading = false,
  submitText = "Create Job",
}) => {
  const [form, setForm] =
    useState({
      title:
        initialData.title || "",

      department:
        initialData.department || "",

      description:
        initialData.description || "",

      location:
        initialData.location || "",

      employmentType:
        initialData.employmentType ||
        "full-time",

      experienceLevel:
        initialData.experienceLevel ||
        "entry",

      salaryMin:
        initialData.salaryMin || "",

      salaryMax:
        initialData.salaryMax || "",

      openings:
        initialData.openings || 1,

      skills:
        initialData.skills?.join(
          ", "
        ) || "",

      requirements:
        initialData.requirements?.join(
          "\n"
        ) || "",

      responsibilities:
        initialData.responsibilities?.join(
          "\n"
        ) || "",

      applicationDeadline:
        initialData.applicationDeadline
          ? initialData.applicationDeadline.slice(
              0,
              10
            )
          : "",
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

    const jobData = {
      ...form,

      salaryMin:
        form.salaryMin
          ? Number(
              form.salaryMin
            )
          : null,

      salaryMax:
        form.salaryMax
          ? Number(
              form.salaryMax
            )
          : null,

      openings: Number(
        form.openings
      ),

      skills: form.skills
        .split(",")
        .map((item) =>
          item.trim()
        )
        .filter(Boolean),

      requirements:
        form.requirements
          .split("\n")
          .map((item) =>
            item.trim()
          )
          .filter(Boolean),

      responsibilities:
        form.responsibilities
          .split("\n")
          .map((item) =>
            item.trim()
          )
          .filter(Boolean),
    };

    onSubmit(jobData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Input
          label="Job Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Frontend Developer"
          required
        />

        <Input
          label="Department"
          name="department"
          value={form.department}
          onChange={handleChange}
          placeholder="Engineering"
        />

        <Input
          label="Location"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Remote / Delhi / Hybrid"
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-200">
            Employment Type
          </label>

          <select
            name="employmentType"
            value={
              form.employmentType
            }
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100"
          >
            <option value="full-time" className="bg-slate-900 text-slate-100">
              Full Time
            </option>

            <option value="part-time" className="bg-slate-900 text-slate-100">
              Part Time
            </option>

            <option value="contract" className="bg-slate-900 text-slate-100">
              Contract
            </option>

            <option value="internship" className="bg-slate-900 text-slate-100">
              Internship
            </option>

            <option value="freelance" className="bg-slate-900 text-slate-100">
              Freelance
            </option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-200">
            Experience Level
          </label>

          <select
            name="experienceLevel"
            value={
              form.experienceLevel
            }
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100"
          >
            <option value="entry" className="bg-slate-900 text-slate-100">
              Entry
            </option>

            <option value="junior" className="bg-slate-900 text-slate-100">
              Junior
            </option>

            <option value="mid" className="bg-slate-900 text-slate-100">
              Mid
            </option>

            <option value="senior" className="bg-slate-900 text-slate-100">
              Senior
            </option>

            <option value="lead" className="bg-slate-900 text-slate-100">
              Lead
            </option>
          </select>
        </div>

        <Input
          label="Minimum Salary"
          name="salaryMin"
          type="number"
          value={form.salaryMin}
          onChange={handleChange}
          placeholder="500000"
        />

        <Input
          label="Maximum Salary"
          name="salaryMax"
          type="number"
          value={form.salaryMax}
          onChange={handleChange}
          placeholder="1000000"
        />

        <Input
          label="Number of Openings"
          name="openings"
          type="number"
          value={form.openings}
          onChange={handleChange}
          min="1"
        />

        <Input
          label="Application Deadline"
          name="applicationDeadline"
          type="date"
          value={
            form.applicationDeadline
          }
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-200">
          Description
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="6"
          required
          placeholder="Describe the job..."
          className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-200">
          Skills
        </label>

        <Input
          name="skills"
          value={form.skills}
          onChange={handleChange}
          placeholder="React, JavaScript, Node.js"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-200">
          Requirements
        </label>

        <textarea
          name="requirements"
          value={form.requirements}
          onChange={handleChange}
          rows="5"
          placeholder="One requirement per line"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-200">
          Responsibilities
        </label>

        <textarea
          name="responsibilities"
          value={
            form.responsibilities
          }
          onChange={handleChange}
          rows="5"
          placeholder="One responsibility per line"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
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

export default JobForm;