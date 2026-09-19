import {
  useEffect,
  useState,
} from "react";

import {
  Loader2,
} from "lucide-react";


const initialForm = {
  application: "",
  title: "",
  round: "technical",
  roundName: "",
  type: "video",
  scheduledAt: "",
  duration: 60,
  meetingLink: "",
  location: "",
  interviewers: [],
  notes: "",
};


const InterviewForm = ({
  applications = [],
  members = [],
  interview = null,
  onSubmit,
  onCancel,
  loading = false,
}) => {

  const [
    formData,
    setFormData,
  ] = useState(initialForm);


  const [
    error,
    setError,
  ] = useState("");


  // ===================================================
  // EDIT DATA
  // ===================================================

  useEffect(() => {

    if (!interview) {

      setFormData(
        initialForm
      );

      return;
    }


    setFormData({
      application:
        interview.application?._id ||
        interview.application ||
        "",

      title:
        interview.title || "",

      round:
        interview.round ||
        "technical",

      roundName:
        interview.roundName ||
        "",

      type:
        interview.type ||
        "video",

      scheduledAt:
        interview.scheduledAt
          ? new Date(
              interview.scheduledAt
            )
              .toISOString()
              .slice(0, 16)
          : "",

      duration:
        interview.duration ||
        60,

      meetingLink:
        interview.meetingLink ||
        "",

      location:
        interview.location ||
        "",

      interviewers:
        interview.interviewers?.map(
          (item) =>
            item._id || item
        ) || [],

      notes:
        interview.notes ||
        "",
    });

  }, [interview]);


  // ===================================================
  // INPUT
  // ===================================================

  const handleChange =
    (event) => {

      const {
        name,
        value,
      } = event.target;


      setFormData(
        (previous) => ({
          ...previous,
          [name]: value,
        })
      );
    };


  // ===================================================
  // INTERVIEWERS
  // ===================================================

  const handleInterviewerChange =
    (event) => {

      const values =
        Array.from(
          event.target.selectedOptions
        ).map(
          (option) =>
            option.value
        );


      setFormData(
        (previous) => ({
          ...previous,
          interviewers: values,
        })
      );
    };


  // ===================================================
  // SUBMIT
  // ===================================================

  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setError("");


      if (!formData.application) {

        setError(
          "Please select an application."
        );

        return;
      }


      if (!formData.title.trim()) {

        setError(
          "Interview title is required."
        );

        return;
      }


      if (!formData.scheduledAt) {

        setError(
          "Interview date and time are required."
        );

        return;
      }


      try {

        await onSubmit({
          ...formData,

          title:
            formData.title.trim(),

          roundName:
            formData.roundName.trim(),

          meetingLink:
            formData.meetingLink.trim(),

          location:
            formData.location.trim(),

          notes:
            formData.notes.trim(),

          duration:
            Number(
              formData.duration
            ),
        });

      } catch (error) {

        setError(
          error?.response
            ?.data
            ?.message ||
          error?.message ||
          "Failed to save interview."
        );
      }
    };


  return (

    <form
      onSubmit={
        handleSubmit
      }
      className="space-y-6"
    >


      {/* ERROR */}

      {error && (

        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">

          {error}

        </div>
      )}


      {/* APPLICATION */}

      <div>

        <label className="mb-2 block text-sm font-medium text-slate-200">

          Application

        </label>


        <select
          name="application"
          value={
            formData.application
          }
          onChange={
            handleChange
          }
          required
          disabled={
            Boolean(interview) ||
            loading
          }
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500 disabled:opacity-50"
        >

          <option value="">
            Select application
          </option>


          {applications.map(
            (application) => (

              <option
                key={
                  application._id
                }
                value={
                  application._id
                }
              >

                {application.candidate?.firstName ||
                  "Candidate"}{" "}
                -{" "}
                {application.job?.title ||
                  "Job"}

              </option>

            )
          )}

        </select>

      </div>


      {/* TITLE */}

      <div>

        <label className="mb-2 block text-sm font-medium text-slate-200">

          Interview Title

        </label>


        <input
          name="title"
          value={
            formData.title
          }
          onChange={
            handleChange
          }
          placeholder="Technical Interview"
          required
          disabled={
            loading
          }
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
        />

      </div>


      {/* ROUND + TYPE */}

      <div className="grid gap-6 md:grid-cols-2">


        <div>

          <label className="mb-2 block text-sm font-medium text-slate-200">

            Interview Round

          </label>


          <select
            name="round"
            value={
              formData.round
            }
            onChange={
              handleChange
            }
            disabled={
              loading
            }
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
          >

            <option value="screening">
              Screening
            </option>

            <option value="technical">
              Technical
            </option>

            <option value="hr">
              HR
            </option>

            <option value="managerial">
              Managerial
            </option>

            <option value="final">
              Final
            </option>

            <option value="custom">
              Custom
            </option>

          </select>

        </div>


        <div>

          <label className="mb-2 block text-sm font-medium text-slate-200">

            Interview Type

          </label>


          <select
            name="type"
            value={
              formData.type
            }
            onChange={
              handleChange
            }
            disabled={
              loading
            }
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
          >

            <option value="video">
              Video
            </option>

            <option value="phone">
              Phone
            </option>

            <option value="onsite">
              Onsite
            </option>

          </select>

        </div>

      </div>


      {/* DATE + DURATION */}

      <div className="grid gap-6 md:grid-cols-2">


        <div>

          <label className="mb-2 block text-sm font-medium text-slate-200">

            Date & Time

          </label>


          <input
            type="datetime-local"
            name="scheduledAt"
            value={
              formData.scheduledAt
            }
            onChange={
              handleChange
            }
            required
            disabled={
              loading
            }
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-500"
          />

        </div>


        <div>

          <label className="mb-2 block text-sm font-medium text-slate-200">

            Duration (minutes)

          </label>


          <input
            type="number"
            name="duration"
            min="15"
            step="15"
            value={
              formData.duration
            }
            onChange={
              handleChange
            }
            disabled={
              loading
            }
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-500"
          />

        </div>

      </div>


      {/* MEETING LINK */}

      {formData.type === "video" && (

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-200">

            Meeting Link

          </label>


          <input
            type="url"
            name="meetingLink"
            value={
              formData.meetingLink
            }
            onChange={
              handleChange
            }
            placeholder="https://meet.google.com/..."
            disabled={
              loading
            }
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
          />

        </div>

      )}


      {/* LOCATION */}

      {formData.type === "onsite" && (

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-200">

            Location

          </label>


          <input
            name="location"
            value={
              formData.location
            }
            onChange={
              handleChange
            }
            placeholder="Office / Meeting Room"
            disabled={
              loading
            }
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
          />

        </div>

      )}


      {/* INTERVIEWERS */}

      <div>

        <label className="mb-2 block text-sm font-medium text-slate-200">

          Interviewers

        </label>


        <select
          multiple
          value={
            formData.interviewers
          }
          onChange={
            handleInterviewerChange
          }
          disabled={
            loading
          }
          className="min-h-32 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
        >

          {members.map(
            (member) => (

              <option
                key={
                  member._id
                }
                value={
                  member.user?._id ||
                  member._id
                }
              >

                {member.user?.firstName ||
                  ""}{" "}
                {member.user?.lastName ||
                  ""}{" "}
                -
                {" "}
                {member.user?.email ||
                  ""}

              </option>

            )
          )}

        </select>

        <p className="mt-2 text-xs text-slate-500">

          Hold Ctrl while selecting multiple interviewers.

        </p>

      </div>


      {/* NOTES */}

      <div>

        <label className="mb-2 block text-sm font-medium text-slate-200">

          Notes

        </label>


        <textarea
          name="notes"
          rows="4"
          value={
            formData.notes
          }
          onChange={
            handleChange
          }
          placeholder="Interview preparation notes..."
          disabled={
            loading
          }
          className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
        />

      </div>


      {/* ACTIONS */}

      <div className="flex justify-end gap-3 border-t border-white/10 pt-6">

        {onCancel && (

          <button
            type="button"
            onClick={
              onCancel
            }
            disabled={
              loading
            }
            className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 hover:bg-white/5"
          >
            Cancel
          </button>

        )}


        <button
          type="submit"
          disabled={
            loading
          }
          className="flex min-w-[160px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
        >

          {loading ? (

            <>
              <Loader2
                size={18}
                className="animate-spin"
              />

              Saving...

            </>

          ) : (

            interview
              ? "Update Interview"
              : "Schedule Interview"

          )}

        </button>

      </div>

    </form>
  );
};


export default InterviewForm;