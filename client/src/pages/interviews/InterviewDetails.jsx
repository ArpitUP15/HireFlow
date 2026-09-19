import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Calendar,
  Clock,
  Loader2,
  Trash2,
} from "lucide-react";

import {
  getInterviewById,
  deleteInterview,
  updateInterviewStatus,
  addInterviewFeedback,
  updateHiringDecision,
} from "../../services/interviewService";


const InterviewDetails = () => {

  const {
    id,
  } = useParams();


  const navigate =
    useNavigate();


  const [
    interview,
    setInterview,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);


  const [
    feedback,
    setFeedback,
  ] = useState("");


  const [
    score,
    setScore,
  ] = useState("");


  const [
    recommendation,
    setRecommendation,
  ] = useState("");


  const [
    decision,
    setDecision,
  ] = useState("pending");


  const [
    error,
    setError,
  ] = useState("");


  // ===================================================
  // LOAD
  // ===================================================

  const loadInterview =
    async () => {

      try {

        setLoading(true);

        const response =
          await getInterviewById(
            id
          );


        const data =
          response.interview;


        setInterview(data);

        setFeedback(
          data.feedback || ""
        );

        setScore(
          data.score ?? ""
        );

        setRecommendation(
          data.recommendation ||
          ""
        );

        setDecision(
          data.hiringDecision ||
          "pending"
        );

      } catch (error) {

        setError(
          error?.response
            ?.data
            ?.message ||
          "Unable to load interview."
        );

      } finally {

        setLoading(false);
      }
    };


  useEffect(() => {

    loadInterview();

  }, [id]);


  // ===================================================
  // STATUS
  // ===================================================

  const handleStatus =
    async (status) => {

      try {

        setActionLoading(true);


        const response =
          await updateInterviewStatus(
            id,
            status
          );


        setInterview(
          response.interview
        );

      } catch (error) {

        setError(
          error?.response
            ?.data
            ?.message ||
          "Unable to update status."
        );

      } finally {

        setActionLoading(false);
      }
    };


  // ===================================================
  // FEEDBACK
  // ===================================================

  const handleFeedback =
    async () => {

      try {

        setActionLoading(true);


        const response =
          await addInterviewFeedback(
            id,
            {
              feedback,
              score:
                score === ""
                  ? null
                  : Number(score),
              recommendation,
            }
          );


        setInterview(
          response.interview
        );

      } catch (error) {

        setError(
          error?.response
            ?.data
            ?.message ||
          "Unable to save feedback."
        );

      } finally {

        setActionLoading(false);
      }
    };


  // ===================================================
  // DECISION
  // ===================================================

  const handleDecision =
    async () => {

      try {

        setActionLoading(true);


        const response =
          await updateHiringDecision(
            id,
            decision
          );


        setInterview(
          response.interview
        );

      } catch (error) {

        setError(
          error?.response
            ?.data
            ?.message ||
          "Unable to update hiring decision."
        );

      } finally {

        setActionLoading(false);
      }
    };


  // ===================================================
  // DELETE
  // ===================================================

  const handleDelete =
    async () => {

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this interview?"
        );


      if (!confirmed) {
        return;
      }


      try {

        setActionLoading(true);


        await deleteInterview(
          id
        );


        navigate(
          "/interviews",
          {
            replace: true,
          }
        );

      } catch (error) {

        setError(
          error?.response
            ?.data
            ?.message ||
          "Unable to delete interview."
        );

      } finally {

        setActionLoading(false);
      }
    };


  if (loading) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-slate-950">

        <Loader2
          size={35}
          className="animate-spin text-blue-500"
        />

      </div>
    );
  }


  if (!interview) {

    return (

      <div className="min-h-screen bg-slate-950 p-8 text-white">

        {error ||
          "Interview not found."}

      </div>
    );
  }


  const scheduledDate =
    new Date(
      interview.scheduledAt
    );


  return (

    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white">

      <div className="mx-auto max-w-5xl">


        {/* HEADER */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>

            <h1 className="text-3xl font-bold">

              {interview.title}

            </h1>


            <p className="mt-2 text-slate-400">

              {interview.candidate?.firstName}{" "}
              {interview.candidate?.lastName}

            </p>

          </div>


          <div className="flex gap-3">


            <Link
              to="/interviews"
              className="rounded-xl border border-white/10 px-4 py-3 text-sm hover:bg-white/5"
            >
              Back
            </Link>


            <button
              onClick={
                handleDelete
              }
              disabled={
                actionLoading
              }
              className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold hover:bg-red-500 disabled:opacity-50"
            >

              <Trash2
                size={16}
              />

              Delete

            </button>

          </div>

        </div>


        {/* ERROR */}

        {error && (

          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">

            {error}

          </div>

        )}


        <div className="grid gap-6 lg:grid-cols-2">


          {/* INTERVIEW INFO */}

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">

            <h2 className="mb-6 text-xl font-semibold">

              Interview Details

            </h2>


            <div className="space-y-4 text-sm">


              <div className="flex items-center gap-3 text-slate-300">

                <Calendar
                  size={18}
                  className="text-blue-400"
                />

                {scheduledDate.toLocaleString()}

              </div>


              <div className="flex items-center gap-3 text-slate-300">

                <Clock
                  size={18}
                  className="text-blue-400"
                />

                {interview.duration} minutes

              </div>


              <p className="capitalize text-slate-400">

                Round:{" "}
                {interview.round}

              </p>


              <p className="capitalize text-slate-400">

                Type:{" "}
                {interview.type}

              </p>


              <p className="capitalize text-slate-400">

                Status:{" "}
                {interview.status?.replace(
                  "_",
                  " "
                )}

              </p>


              {interview.meetingLink && (

                <a
                  href={
                    interview.meetingLink
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline"
                >

                  Join meeting

                </a>

              )}


              {interview.location && (

                <p className="text-slate-400">

                  Location:{" "}
                  {interview.location}

                </p>

              )}

            </div>


            {/* STATUS */}

            <div className="mt-6 border-t border-white/10 pt-6">

              <label className="mb-2 block text-sm text-slate-400">

                Update Status

              </label>


              <select
                value={
                  interview.status
                }
                onChange={(event) =>
                  handleStatus(
                    event.target.value
                  )
                }
                disabled={
                  actionLoading
                }
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
              >

                <option value="scheduled">
                  Scheduled
                </option>

                <option value="in_progress">
                  In Progress
                </option>

                <option value="completed">
                  Completed
                </option>

                <option value="cancelled">
                  Cancelled
                </option>

                <option value="rescheduled">
                  Rescheduled
                </option>

              </select>

            </div>

          </div>


          {/* FEEDBACK */}

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">

            <h2 className="mb-6 text-xl font-semibold">

              Interview Feedback

            </h2>


            <textarea
              value={
                feedback
              }
              onChange={(event) =>
                setFeedback(
                  event.target.value
                )
              }
              rows="6"
              placeholder="Enter interview feedback..."
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
            />


            <div className="mt-4 grid gap-4 md:grid-cols-2">


              <div>

                <label className="mb-2 block text-sm text-slate-400">

                  Score / 10

                </label>


                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  value={
                    score
                  }
                  onChange={(event) =>
                    setScore(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                />

              </div>


              <div>

                <label className="mb-2 block text-sm text-slate-400">

                  Recommendation

                </label>


                <select
                  value={
                    recommendation
                  }
                  onChange={(event) =>
                    setRecommendation(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
                >

                  <option value="">
                    Select
                  </option>

                  <option value="strong_yes">
                    Strong Yes
                  </option>

                  <option value="yes">
                    Yes
                  </option>

                  <option value="neutral">
                    Neutral
                  </option>

                  <option value="no">
                    No
                  </option>

                  <option value="strong_no">
                    Strong No
                  </option>

                </select>

              </div>

            </div>


            <button
              onClick={
                handleFeedback
              }
              disabled={
                actionLoading
              }
              className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold hover:bg-blue-500 disabled:opacity-50"
            >

              Save Feedback

            </button>

          </div>


          {/* HIRING DECISION */}

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 lg:col-span-2">

            <h2 className="mb-4 text-xl font-semibold">

              Hiring Decision

            </h2>


            <div className="flex flex-col gap-4 sm:flex-row">

              <select
                value={
                  decision
                }
                onChange={(event) =>
                  setDecision(
                    event.target.value
                  )
                }
                className="flex-1 rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
              >

                <option value="pending">
                  Pending
                </option>

                <option value="hire">
                  Hire
                </option>

                <option value="reject">
                  Reject
                </option>

                <option value="hold">
                  Hold
                </option>

              </select>


              <button
                onClick={
                  handleDecision
                }
                disabled={
                  actionLoading
                }
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500 disabled:opacity-50"
              >

                Save Decision

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};


export default InterviewDetails;