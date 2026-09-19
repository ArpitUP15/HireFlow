import {
  useEffect,
  useState,
} from "react";

import {
  CalendarPlus,
  Loader2,
  RefreshCw,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  getInterviews,
} from "../../services/interviewServices";

import InterviewCard from "../../components/interviews/InterviewCard";


const Interviews = () => {

  const [
    interviews,
    setInterviews,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  const loadInterviews =
    async () => {

      try {

        setLoading(true);

        setError("");


        const response =
          await getInterviews();


        setInterviews(
          response.interviews || []
        );

      } catch (error) {

        console.error(
          "Failed to load interviews:",
          error
        );


        setError(
          error?.response
            ?.data
            ?.message ||
          "Unable to load interviews."
        );

      } finally {

        setLoading(false);
      }
    };


  useEffect(() => {

    loadInterviews();

  }, []);


  return (

    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white">


      <div className="mx-auto max-w-7xl">


        {/* HEADER */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">


          <div>

            <h1 className="text-3xl font-bold">

              Interviews

            </h1>


            <p className="mt-2 text-slate-400">

              Schedule and manage candidate interviews.

            </p>

          </div>


          <div className="flex gap-3">


            <button
              onClick={
                loadInterviews
              }
              className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm hover:bg-white/5"
            >

              <RefreshCw
                size={17}
              />

              Refresh

            </button>


            <Link
              to="/interviews/create"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold hover:bg-blue-500"
            >

              <CalendarPlus
                size={17}
              />

              Schedule Interview

            </Link>

          </div>

        </div>


        {/* ERROR */}

        {error && (

          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">

            {error}

          </div>

        )}


        {/* LOADING */}

        {loading ? (

          <div className="flex min-h-64 items-center justify-center">

            <Loader2
              size={35}
              className="animate-spin text-blue-500"
            />

          </div>

        ) : interviews.length === 0 ? (

          <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900 p-12 text-center">

            <CalendarPlus
              size={45}
              className="mx-auto text-slate-600"
            />


            <h2 className="mt-4 text-xl font-semibold">

              No interviews scheduled

            </h2>


            <p className="mt-2 text-slate-500">

              Schedule your first candidate interview.

            </p>

          </div>

        ) : (

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {interviews.map(
              (interview) => (

                <InterviewCard
                  key={
                    interview._id
                  }
                  interview={
                    interview
                  }
                />

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
};


export default Interviews;