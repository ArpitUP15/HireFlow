import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  Mail,
  MapPin,
  BriefcaseBusiness,
  Star,
} from "lucide-react";

import {
  getApplicationById,
  updateApplicationStatus,
} from "../../services/applicationService";


const ApplicationDetails =
  () => {

    const id =
      window.location.pathname.split(
        "/"
      )[2];

    const [
      application,
      setApplication,
    ] = useState(null);

    const [loading, setLoading] =
      useState(true);


    const loadApplication =
      async () => {

        try {

          const data =
            await getApplicationById(
              id
            );

          setApplication(
            data.application
          );

        } catch (error) {

          console.error(error);

        } finally {

          setLoading(false);

        }

      };


    useEffect(() => {

      loadApplication();

    }, [id]);


    const handleStatus =
      async (status) => {

        try {

          await updateApplicationStatus(
            id,
            status
          );

          await loadApplication();

        } catch (error) {

          alert(
            error.response?.data
              ?.message ||
              "Failed to update status"
          );

        }

      };


    if (loading) {

      return (
        <div className="p-10 text-center">
          Loading application...
        </div>
      );

    }


    if (!application) {

      return (
        <div className="p-10 text-center">
          Application not found
        </div>
      );

    }


    const candidate =
      application.candidate;

    const job =
      application.job;


    return (
      <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-700 p-6 text-white lg:p-8">

        <div className="mx-auto max-w-6xl">

          <button
            onClick={() =>
              (window.location.href =
                "/applications")
            }
            className="mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={18} />
            Back to Applications
          </button>


          {/* Candidate Header */}

          <div className="rounded-2xl border p-6 shadow-sm">

            <div className="flex flex-col justify-between gap-6 md:flex-row">

              <div className="flex gap-4">

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-b from-slate-900 to-slate-700 text-white  font-bold ">

                  {candidate.firstName?.[0]}
                  {candidate.lastName?.[0]}

                </div>


                <div>

                  <h1 className="text-2xl font-bold">
                    {candidate.firstName}{" "}
                    {candidate.lastName}
                  </h1>

                  <p className="mt-1 text-gray-500">
                    {candidate.headline ||
                      "Candidate"}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">

                    <span className="flex items-center gap-1">
                      <Mail size={15} />
                      {candidate.email}
                    </span>

                    {candidate.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={15} />
                        {candidate.location}
                      </span>
                    )}

                  </div>

                </div>

              </div>


              <div>

                <select
                  value={
                    application.status
                  }
                  onChange={(event) =>
                    handleStatus(
                      event.target.value
                    )
                  }
                  className="rounded-lg border border-gray-300 px-4 py-2.5 font-medium"
                >

                  <option value="applied">
                    Applied
                  </option>

                  <option value="screening">
                    Screening
                  </option>

                  <option value="shortlisted">
                    Shortlisted
                  </option>

                  <option value="interview">
                    Interview
                  </option>

                  <option value="selected">
                    Selected
                  </option>

                  <option value="rejected">
                    Rejected
                  </option>

                </select>

              </div>

            </div>

          </div>


          <div className="mt-6 grid gap-6 lg:grid-cols-3">


            {/* Main */}

            <div className="space-y-6 lg:col-span-2">


              {/* Job */}

              <div className="rounded-2xl border p-6 shadow-sm">

                <h2 className="text-lg font-bold">
                  Applied Position
                </h2>

                <div className="mt-4">

                  <h3 className="text-xl font-semibold">
                    {job.title}
                  </h3>

                  <p className="mt-1 text-gray-500">
                    {job.department}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">

                    <span className="flex items-center gap-1">
                      <MapPin size={15} />
                      {job.location ||
                        "Remote"}
                    </span>

                    <span className="flex items-center gap-1">
                      <BriefcaseBusiness
                        size={15}
                      />
                      {
                        job.employmentType
                      }
                    </span>

                  </div>

                </div>

              </div>


              {/* Summary */}

              <div className="rounded-2xl border    p-6 shadow-sm">

                <h2 className="text-lg font-bold">
                  Candidate Summary
                </h2>

                <p className="mt-4 whitespace-pre-wrap leading-7 text-gray-600">
                  {candidate.summary ||
                    "No summary available."}
                </p>

              </div>


              {/* Skills */}

              <div className="rounded-2xl border    p-6 shadow-sm">

                <h2 className="text-lg font-bold">
                  Skills
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">

                  {candidate.skills?.map(
                    (skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-blue-50 px-3 py-1.5 text-sm text-blue-700"
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>

              </div>


              {/* Cover Letter */}

              <div className="rounded-2xl border    p-6 shadow-sm">

                <h2 className="text-lg font-bold">
                  Cover Letter
                </h2>

                <p className="mt-4 whitespace-pre-wrap leading-7 text-gray-600">
                  {application.coverLetter ||
                    "No cover letter provided."}
                </p>

              </div>


              {/* Notes */}

              <div className="rounded-2xl border    p-6 shadow-sm">

                <h2 className="text-lg font-bold">
                  Recruiter Notes
                </h2>

                <p className="mt-4 whitespace-pre-wrap leading-7 text-gray-600">
                  {application.recruiterNotes ||
                    "No recruiter notes."}
                </p>

              </div>

            </div>


            {/* Sidebar */}

            <div className="space-y-6">


              {/* Rating */}

              <div className="rounded-2xl border    p-6 shadow-sm">

                <h2 className="font-bold">
                  Candidate Rating
                </h2>

                <div className="mt-4 flex items-center gap-1">

                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <Star
                        key={star}
                        size={20}
                        className={
                          star <=
                          (application.rating ||
                            0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    )
                  )}

                </div>

              </div>


              {/* Experience */}

              <div className="rounded-2xl border    p-6 shadow-sm">

                <p className="text-sm text-gray-500">
                  Experience
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {candidate.experience ||
                    0}{" "}
                  years
                </p>

              </div>


              {/* Resume */}

              {candidate.resumeUrl && (
                <a
                  href={
                    candidate.resumeUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-2xl bg-blue-600 p-4 text-center font-medium text-white hover:bg-blue-700"
                >
                  View Resume
                </a>
              )}

            </div>

          </div>

        </div>

      </div>
    );
  };


export default ApplicationDetails;