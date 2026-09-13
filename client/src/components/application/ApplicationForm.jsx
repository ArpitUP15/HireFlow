import {
  useState,
} from "react";

import Button from "../common/Button";

const ApplicationForm = ({
  jobs = [],
  candidates = [],
  onSubmit,
  loading = false,
}) => {

  const [form, setForm] =
    useState({
      job: "",
      candidate: "",
      source: "manual",
      coverLetter: "",
      recruiterNotes: "",
      rating: "",
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

    if (
      !form.job ||
      !form.candidate
    ) {
      return;
    }

    onSubmit({
      ...form,

      rating: form.rating
        ? Number(form.rating)
        : null,
    });
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      {/* Job */}

      <div>

        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Job
        </label>

        <select
          name="job"
          value={form.job}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
        >

          <option value="">
            Select Job
          </option>

          {jobs.map((job) => (
            <option
              key={job._id}
              value={job._id}
            >
              {job.title}
            </option>
          ))}

        </select>

      </div>


      {/* Candidate */}

      <div>

        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Candidate
        </label>

        <select
          name="candidate"
          value={
            form.candidate
          }
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
        >

          <option value="">
            Select Candidate
          </option>

          {candidates.map(
            (candidate) => (
              <option
                key={
                  candidate._id
                }
                value={
                  candidate._id
                }
              >
                {candidate.firstName}{" "}
                {candidate.lastName}{" "}
                — {candidate.email}
              </option>
            )
          )}

        </select>

      </div>


      {/* Source */}

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

          <option value="website">
            Website
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

          <option value="other">
            Other
          </option>

        </select>

      </div>


      {/* Rating */}

      <div>

        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Initial Rating
        </label>

        <select
          name="rating"
          value={form.rating}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
        >

          <option value="">
            No Rating
          </option>

          <option value="1">
            1 / 5
          </option>

          <option value="2">
            2 / 5
          </option>

          <option value="3">
            3 / 5
          </option>

          <option value="4">
            4 / 5
          </option>

          <option value="5">
            5 / 5
          </option>

        </select>

      </div>


      {/* Cover Letter */}

      <div>

        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Cover Letter
        </label>

        <textarea
          name="coverLetter"
          value={
            form.coverLetter
          }
          onChange={handleChange}
          rows="5"
          placeholder="Candidate cover letter..."
          className="w-full rounded-lg border border-gray-300 p-3"
        />

      </div>


      {/* Recruiter Notes */}

      <div>

        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Recruiter Notes
        </label>

        <textarea
          name="recruiterNotes"
          value={
            form.recruiterNotes
          }
          onChange={handleChange}
          rows="5"
          placeholder="Add recruiter notes..."
          className="w-full rounded-lg border border-gray-300 p-3"
        />

      </div>


      <Button
        type="submit"
        loading={loading}
        className="w-full"
      >
        Create Application
      </Button>

    </form>
  );
};

export default ApplicationForm;