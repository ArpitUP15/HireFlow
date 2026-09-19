import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Loader2,
} from "lucide-react";

import InterviewForm from "../../components/interview/InterviewForm";

import {
  createInterview,
} from "../../services/interviewService";

import {
  getApplications,
} from "../../services/applicationService";

import {
  getMembers,
} from "../../services/organizationService";


const CreateInterview = () => {

  const navigate =
    useNavigate();


  const [
    applications,
    setApplications,
  ] = useState([]);


  const [
    members,
    setMembers,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    saving,
    setSaving,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  useEffect(() => {

    const loadData =
      async () => {

        try {

          setLoading(true);


          const [
            applicationsResponse,
            membersResponse,
          ] = await Promise.all([
            getApplications(),
            getMembers(),
          ]);


          setApplications(
            applicationsResponse
              ?.applications || []
          );


          setMembers(
            membersResponse
              ?.members || []
          );

        } catch (error) {

          console.error(
            "Failed to load interview data:",
            error
          );


          setError(
            error?.response
              ?.data
              ?.message ||
            "Unable to load required data."
          );

        } finally {

          setLoading(false);
        }
      };


    loadData();

  }, []);


  const handleSubmit =
    async (data) => {

      try {

        setSaving(true);

        setError("");


        await createInterview(
          data
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
          "Failed to schedule interview."
        );

        throw error;

      } finally {

        setSaving(false);
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


  return (

    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white">

      <div className="mx-auto max-w-3xl">


        <h1 className="mb-2 text-3xl font-bold">

          Schedule Interview

        </h1>


        <p className="mb-8 text-slate-400">

          Schedule an interview for a candidate application.

        </p>


        {error && (

          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">

            {error}

          </div>

        )}


        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">

          <InterviewForm
            applications={
              applications
            }
            members={
              members
            }
            onSubmit={
              handleSubmit
            }
            onCancel={() =>
              navigate(
                "/interviews"
              )
            }
            loading={
              saving
            }
          />

        </div>

      </div>

    </div>
  );
};


export default CreateInterview;