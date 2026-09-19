import {
  useEffect,
  useState,
} from "react";

import {
  Users,
  Briefcase,
  FileText,
  UserCheck,
  LogOut,
  Building2,
  Settings,
  RefreshCw,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/useAuth";

import {
  useOrganization,
} from "../context/OrganizationContext";

import {
  getJobs,
} from "../services/jobService";

import {
  getCandidates,
} from "../services/candidateService";

import {
  getApplications,
  getRecruitmentPipeline,
} from "../services/applicationService";


function Dashboard() {

  const navigate =
    useNavigate();


  const {
    user,
    logout,
  } = useAuth();


  const {
    organization,
    organizations,
    loading:
      organizationLoading,
    error:
      organizationError,
    selectOrganization,
  } = useOrganization();


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  const [
    dashboardData,
    setDashboardData,
  ] = useState({
    jobs: 0,
    candidates: 0,
    applications: 0,
    hired: 0,

    pipeline: {
      applied: 0,
      screening: 0,
      shortlisted: 0,
      interview: 0,
      selected: 0,
      rejected: 0,
    },
  });


  // ===================================================
  // LOAD DASHBOARD
  // ===================================================

  const loadDashboard =
    async () => {

      if (!organization) {
        return;
      }


      try {

        setLoading(true);

        setError("");


        const [
          jobsResponse,
          candidatesResponse,
          applicationsResponse,
          pipelineResponse,
        ] = await Promise.all([

          getJobs(),

          getCandidates(),

          getApplications(),

          getRecruitmentPipeline(),

        ]);


        const jobs =
          jobsResponse?.data
            ?.jobs || [];


        const candidates =
          candidatesResponse
            ?.data
            ?.candidates || [];


        const applications =
          applicationsResponse
            ?.data
            ?.applications || [];


        const pipeline =
          pipelineResponse
            ?.data
            ?.pipeline || {

              applied: 0,
              screening: 0,
              shortlisted: 0,
              interview: 0,
              selected: 0,
              rejected: 0,

            };


        setDashboardData({

          jobs:
            jobs.length,

          candidates:
            candidates.length,

          applications:
            applications.length,

          hired:
            pipeline.selected || 0,

          pipeline,

        });

      } catch (error) {

        console.error(
          "Dashboard loading error:",
          error
        );


        setError(
          error?.response
            ?.data
            ?.message ||
          "Dashboard data could not be loaded"
        );

      } finally {

        setLoading(false);
      }
    };


  // ===================================================
  // ORGANIZATION STATE
  // ===================================================

  useEffect(() => {

    // -----------------------------------------------
    // Still loading organization
    // -----------------------------------------------

    if (organizationLoading) {
      return;
    }


    // -----------------------------------------------
    // No organization
    // -----------------------------------------------

    if (!organization) {

      setLoading(false);

      return;
    }


    // -----------------------------------------------
    // Organization exists
    // -----------------------------------------------

    loadDashboard();

  }, [
    organization,
    organizationLoading,
  ]);


  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogout =
    async () => {

      await logout();

      navigate(
        "/login",
        {
          replace: true,
        }
      );
    };


  // ===================================================
  // ORGANIZATION LOADING
  // ===================================================

  if (organizationLoading) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">

        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />

          <p className="mt-4 text-sm text-slate-400">
            Loading your organization...
          </p>

        </div>

      </div>
    );
  }


  // ===================================================
  // NO ORGANIZATION
  // ===================================================

  if (
    !organization &&
    !organizationError
  ) {

    return (

      <div className="min-h-screen bg-slate-950 text-white">

        <header className="border-b border-white/10">

          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

            <h1 className="text-2xl font-bold">

              Hire
              <span className="text-blue-500">
                Flow
              </span>

            </h1>


            <button
              onClick={
                handleLogout
              }
              className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
            >

              <LogOut
                size={17}
              />

              Logout

            </button>

          </div>

        </header>


        <main className="flex min-h-[80vh] items-center justify-center px-6">

          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-8 text-center shadow-2xl">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10">

              <Building2
                size={30}
                className="text-blue-400"
              />

            </div>


            <h2 className="mt-6 text-2xl font-bold">
              Create your organization
            </h2>


            <p className="mt-3 text-slate-400">
              Your account is ready. Create an organization to start using HireFlow.
            </p>


            <button
              onClick={() =>
                navigate(
                  "/organization/setup"
                )
              }
              className="mt-7 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500"
            >
              Set up an organization
            </button>

          </div>

        </main>

      </div>
    );
  }


  // ===================================================
  // DASHBOARD
  // ===================================================

  const stats = [

    {
      title:
        "Total Jobs",

      value:
        dashboardData.jobs,

      icon:
        Briefcase,
    },

    {
      title:
        "Candidates",

      value:
        dashboardData.candidates,

      icon:
        Users,
    },

    {
      title:
        "Applications",

      value:
        dashboardData.applications,

      icon:
        FileText,
    },

    {
      title:
        "Hired",

      value:
        dashboardData.hired,

      icon:
        UserCheck,
    },

  ];


  const pipelineStages = [

    [
      "Applied",
      dashboardData.pipeline.applied,
    ],

    [
      "Screening",
      dashboardData.pipeline.screening,
    ],

    [
      "Shortlisted",
      dashboardData.pipeline.shortlisted,
    ],

    [
      "Interview",
      dashboardData.pipeline.interview,
    ],

    [
      "Selected",
      dashboardData.pipeline.selected,
    ],

  ];


  return (

    <div className="min-h-screen bg-slate-950 text-white">


      {/* =================================================
          HEADER
      ================================================= */}

      <header className="border-b border-white/10">

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-6 py-5">

          <div>

            <h1 className="text-2xl font-bold">

              Hire
              <span className="text-blue-500">
                Flow
              </span>

            </h1>


            <p className="mt-1 text-sm text-slate-400">
              Recruitment Dashboard
            </p>

          </div>


          <div className="flex items-center gap-4">


            {/* Organization */}

            <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 md:flex">

              <Building2
                size={17}
                className="text-blue-400"
              />


              <select
                value={
                  organization?._id ||
                  ""
                }
                onChange={
                  async (event) => {

                    await selectOrganization(
                      event.target.value
                    );
                  }
                }
                className="bg-transparent text-sm text-white outline-none"
              >

                {organizations.map(
                  (item) => (

                    <option
                      key={
                        item.organization
                          ?._id
                      }
                      value={
                        item.organization
                          ?._id
                      }
                      className="bg-slate-900"
                    >
                      {
                        item.organization
                          ?.name
                      }
                    </option>

                  )
                )}

              </select>

            </div>


            {/* User */}

            <div className="hidden text-right sm:block">

              <p className="font-medium">

                {user?.firstName}{" "}

                {user?.lastName}

              </p>


              <p className="text-xs capitalize text-slate-400">

                {user?.role?.replace(
                  "_",
                  " "
                )}

              </p>

            </div>


            {/* Logout */}

            <button
              onClick={
                handleLogout
              }
              className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:bg-white/5"
            >

              <LogOut
                size={17}
              />

              Logout

            </button>

          </div>

        </div>

      </header>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="mx-auto max-w-7xl px-6 py-10">


        {/* Welcome */}

        <div className="mb-10">

          <div className="flex flex-wrap items-center justify-between gap-4">

            <div>

              <h2 className="text-3xl font-bold">

                Welcome back,{" "}

                {user?.firstName}

                {" "}👋

              </h2>


              <p className="mt-2 text-slate-400">

                Here's what's happening with your recruitment activities.

              </p>

            </div>


            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">

              <Building2
                size={17}
                className="text-blue-400"
              />

              <span className="text-sm text-slate-300">

                {organization?.name}

              </span>

            </div>

          </div>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/10 p-5">

            <div className="flex items-start justify-between gap-4">

              <div>

                <p className="font-medium text-red-400">
                  Dashboard data could not be loaded
                </p>

                <p className="mt-1 text-sm text-red-300/80">
                  {error}
                </p>

              </div>


              <button
                onClick={
                  loadDashboard
                }
                className="flex items-center gap-2 rounded-lg border border-red-500/20 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10"
              >

                <RefreshCw
                  size={15}
                />

                Try again

              </button>

            </div>

          </div>

        )}


        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="flex min-h-[300px] items-center justify-center">

            <div className="text-center">

              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />

              <p className="mt-4 text-sm text-slate-400">
                Loading dashboard...
              </p>

            </div>

          </div>

        ) : (

          <>


            {/* =================================================
                STATS
            ================================================= */}

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {stats.map(
                (stat) => {

                  const Icon =
                    stat.icon;


                  return (

                    <div
                      key={
                        stat.title
                      }
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                    >

                      <div className="flex items-center justify-between">

                        <div>

                          <p className="text-sm text-slate-400">
                            {stat.title}
                          </p>


                          <h2 className="mt-2 text-3xl font-bold">
                            {stat.value}
                          </h2>

                        </div>


                        <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">

                          <Icon
                            size={24}
                          />

                        </div>

                      </div>

                    </div>

                  );
                }
              )}

            </div>


            {/* =================================================
                PIPELINE
            ================================================= */}

            <section className="mt-10">

              <div className="mb-5 flex items-center justify-between">

                <h2 className="text-xl font-semibold">
                  Recruitment Pipeline
                </h2>

              </div>


              <div className="grid gap-5 md:grid-cols-5">

                {pipelineStages.map(
                  ([stage, count]) => (

                    <div
                      key={stage}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                    >

                      <p className="text-sm text-slate-400">
                        {stage}
                      </p>


                      <p className="mt-3 text-2xl font-bold">
                        {count}
                      </p>

                    </div>

                  )
                )}

              </div>

            </section>

          </>

        )}

      </main>

    </div>
  );
}


export default Dashboard;