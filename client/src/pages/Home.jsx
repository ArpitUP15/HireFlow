import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileSearch,
  GitBranch,
  Globe,
  Mail,
  Menu,
  MessageSquare,
  Network,
  Play,
  Rocket,
  Search,
  Send,
  Sun,
  Moon,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  X,
  Zap,
} from "lucide-react";

import {
  getPublicStats,
  submitContactMessage,
} from "../services/publicService";
import {
  useTheme,
} from "../context/useTheme";


// =====================================================
// ANIMATED COUNTER
// =====================================================

const AnimatedCounter = ({
  value,
  duration = 1600,
}) => {

  const [
    count,
    setCount,
  ] = useState(0);


  const [
    started,
    setStarted,
  ] = useState(false);


  const ref =
    useRef(null);


  useEffect(() => {

    const observer =
      new IntersectionObserver(
        ([entry]) => {

          if (
            entry.isIntersecting &&
            !started
          ) {

            setStarted(true);
          }
        },
        {
          threshold: 0.4,
        }
      );


    if (ref.current) {
      observer.observe(
        ref.current
      );
    }


    return () => {
      observer.disconnect();
    };

  }, [started]);


  useEffect(() => {

    if (!started) {
      return;
    }


    const target =
      Number(value) || 0;


    if (target === 0) {

      setCount(0);

      return;
    }


    const startTime =
      performance.now();


    let animationFrame;


    const animate = (
      currentTime
    ) => {

      const progress =
        Math.min(
          (
            currentTime -
            startTime
          ) / duration,
          1
        );


      const eased =
        1 -
        Math.pow(
          1 - progress,
          3
        );


      setCount(
        Math.floor(
          eased * target
        )
      );


      if (progress < 1) {

        animationFrame =
          requestAnimationFrame(
            animate
          );

      } else {

        setCount(target);
      }
    };


    animationFrame =
      requestAnimationFrame(
        animate
      );


    return () => {

      cancelAnimationFrame(
        animationFrame
      );
    };

  }, [
    started,
    value,
    duration,
  ]);


  return (
    <span ref={ref}>
      {count.toLocaleString()}
    </span>
  );
};


// =====================================================
// FAQ ITEM
// =====================================================

const FAQItem = ({
  question,
  answer,
  open,
  onClick,
}) => {

  return (

    <div
      className={`
        overflow-hidden rounded-2xl
        border border-white/10
        bg-white/3
        transition-all duration-300
        ${
          open
            ? "border-blue-500/30 bg-blue-500/4"
            : ""
        }
      `}
    >

      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
      >

        <span className="text-base font-semibold text-white md:text-lg">
          {question}
        </span>


        <ChevronDown
          size={20}
          className={`
            shrink-0 text-slate-400
            transition-transform duration-300
            ${
              open
                ? "rotate-180 text-blue-400"
                : ""
            }
          `}
        />

      </button>


      <div
        className={`
          grid transition-all duration-300
          ${
            open
              ? "grid-rows-[1fr]"
              : "grid-rows-[0fr]"
          }
        `}
      >

        <div className="overflow-hidden">

          <p className="px-6 pb-6 leading-7 text-slate-400">
            {answer}
          </p>

        </div>

      </div>

    </div>
  );
};


// =====================================================
// HOME
// =====================================================

function Home() {
  const {
    theme,
    toggleTheme,
  } = useTheme();

  const [
    mobileMenu,
    setMobileMenu,
  ] = useState(false);


  const [
    activeFAQ,
    setActiveFAQ,
  ] = useState(0);


  const [
    stats,
    setStats,
  ] = useState({
    totalHired: 0,
    totalOrganizations: 0,
    totalJobs: 0,
  });


  const [
    statsLoading,
    setStatsLoading,
  ] = useState(true);


  const [
    contactForm,
    setContactForm,
  ] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });


  const [
    contactLoading,
    setContactLoading,
  ] = useState(false);


  const [
    contactMessage,
    setContactMessage,
  ] = useState({
    type: "",
    text: "",
  });


  // ===================================================
  // LOAD PUBLIC STATISTICS
  // ===================================================

  useEffect(() => {

    const loadStats =
      async () => {

        try {

          const response =
            await getPublicStats();


          setStats(
            response.stats || {
              totalHired: 0,
              totalOrganizations: 0,
              totalJobs: 0,
            }
          );

        } catch (error) {

          console.error(
            "Failed to load public statistics:",
            error
          );

        } finally {

          setStatsLoading(false);
        }
      };


    loadStats();

  }, []);


  // ===================================================
  // NAVIGATION
  // ===================================================

  const scrollToSection =
    (id) => {

      setMobileMenu(false);


      const element =
        document.getElementById(id);


      if (element) {

        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };


  // ===================================================
  // CONTACT FORM
  // ===================================================

  const handleContactChange =
    (event) => {

      const {
        name,
        value,
      } = event.target;


      setContactForm(
        (previous) => ({
          ...previous,
          [name]: value,
        })
      );
    };


  const handleContactSubmit =
    async (event) => {

      event.preventDefault();


      setContactLoading(true);


      setContactMessage({
        type: "",
        text: "",
      });


      try {

        await submitContactMessage(
          contactForm
        );


        setContactMessage({
          type: "success",
          text:
            "Thanks! Your message has been sent successfully.",
        });


        setContactForm({
          name: "",
          email: "",
          subject: "",
          message: "",
        });

      } catch (error) {

        setContactMessage({
          type: "error",
          text:
            error?.response
              ?.data
              ?.message ||
            "Unable to send your message. Please try again.",
        });

      } finally {

        setContactLoading(false);
      }
    };


  // ===================================================
  // FEATURES
  // ===================================================

  const features = [
    {
      icon: BrainCircuit,
      title: "AI-Powered Screening",
      description:
        "Analyze candidates faster with intelligent resume screening and structured recruitment workflows.",
    },

    {
      icon: Users,
      title: "Candidate Management",
      description:
        "Keep candidate profiles, applications, notes and recruitment activity organized in one place.",
    },

    {
      icon: BriefcaseBusiness,
      title: "Smart Job Management",
      description:
        "Create and manage job openings while keeping recruitment data connected to your organization.",
    },

    {
      icon: Network,
      title: "Recruitment Pipeline",
      description:
        "Track candidates from application through screening, interviews, selection and hiring.",
    },

    {
      icon: CalendarIcon,
      title: "Interview Management",
      description:
        "Schedule interviews, assign interviewers, collect feedback and record hiring decisions.",
    },

    {
      icon: ShieldCheck,
      title: "Secure Organizations",
      description:
        "JWT authentication, organization isolation and role-based access help protect recruitment data.",
    },
  ];


  // ===================================================
  // FAQ
  // ===================================================

  const faqs = [
    {
      question:
        "What is HireFlow?",

      answer:
        "HireFlow is an AI-powered recruitment and HR management platform designed to help organizations manage jobs, candidates, applications, interviews and hiring workflows from one centralized system.",
    },

    {
      question:
        "Does HireFlow support multiple organizations?",

      answer:
        "Yes. HireFlow is designed around organization-based access. Users can work inside an organization while recruitment data is isolated through the organization context.",
    },

    {
      question:
        "Can recruiters manage the complete hiring pipeline?",

      answer:
        "Yes. The platform covers jobs, candidates, applications, recruitment pipeline stages, interviews, feedback and hiring decisions.",
    },

    {
      question:
        "How does interview management work?",

      answer:
        "Recruiters can schedule an interview against an application, choose an interview round and type, assign interviewers, set the date and time, record feedback and maintain a hiring decision.",
    },

    {
      question:
        "Is HireFlow suitable for teams?",

      answer:
        "Yes. Organization and team functionality allows recruitment workflows to be managed collaboratively with role-based access.",
    },

    {
      question:
        "Can I create a HireFlow account?",

      answer:
        "Yes. Use the Get Started or Sign Up button to create your account and begin setting up your recruitment workspace.",
    },
  ];


  // ===================================================
  // TIMELINE DATA
  // ===================================================

  const timelineStats = [
    {
      number:
        stats.totalHired,
      label:
        "Candidates Hired",
      description:
        "Candidates successfully moved through the recruitment journey.",
      icon: CheckCircle2,
    },

    {
      number:
        stats.totalOrganizations,
      label:
        "Organizations",
      description:
        "Organizations using the HireFlow recruitment workspace.",
      icon: Network,
    },

    {
      number:
        stats.totalJobs,
      label:
        "Jobs Available",
      description:
        "Job opportunities managed through HireFlow.",
      icon: BriefcaseBusiness,
    },
  ];


  return (

    <div className="min-h-screen overflow-hidden  text-white">


      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 backdrop-blur-xl">

        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">


          {/* LOGO */}

          <button
            type="button"
            onClick={() =>
              scrollToSection(
                "hero"
              )
            }
            className="text-2xl font-bold tracking-tight"
          >

            Hire
            <span className="text-blue-500">
              Flow
            </span>

          </button>


          {/* DESKTOP NAV */}

          <div className="hidden items-center gap-8 md:flex">

            <button
              onClick={() =>
                scrollToSection(
                  "features"
                )
              }
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Features
            </button>


            <button
              onClick={() =>
                scrollToSection(
                  "stats"
                )
              }
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Platform
            </button>


            <button
              onClick={() =>
                scrollToSection(
                  "faqs"
                )
              }
              className="text-sm text-slate-400 transition hover:text-white"
            >
              FAQs
            </button>


            <button
              onClick={() =>
                scrollToSection(
                  "contact"
                )
              }
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Contact
            </button>

          </div>


          {/* DESKTOP ACTIONS */}

          <div className="hidden items-center gap-3 md:flex">

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              aria-pressed={theme === "dark"}
              className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2.5 text-sm font-medium transition hover:bg-white/5"
            >
              {theme === "light" ? (
                <Moon size={17} aria-hidden="true" />
              ) : (
                <Sun size={17} aria-hidden="true" />
              )}
              <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
            </button>

            <Link
              to="/login"
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:text-white"
            >
              Sign In
            </Link>


            <Link
              to="/register"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
            >
              Get Started
            </Link>

          </div>


          {/* MOBILE MENU BUTTON */}

          <button
            type="button"
            onClick={() =>
              setMobileMenu(
                (value) => !value
              )
            }
            className="rounded-lg p-2 text-slate-300 md:hidden"
          >

            {mobileMenu ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}

          </button>

        </nav>


        {/* MOBILE MENU */}

        {mobileMenu && (

          <div className="border-t border-white/10 bg-slate-950 px-6 py-5 md:hidden">

            <div className="flex flex-col gap-2">

              <button
                onClick={() =>
                  scrollToSection(
                    "features"
                  )
                }
                className="rounded-lg px-4 py-3 text-left text-slate-300 hover:bg-white/5"
              >
                Features
              </button>


              <button
                onClick={() =>
                  scrollToSection(
                    "stats"
                  )
                }
                className="rounded-lg px-4 py-3 text-left text-slate-300 hover:bg-white/5"
              >
                Platform
              </button>


              <button
                onClick={() =>
                  scrollToSection(
                    "faqs"
                  )
                }
                className="rounded-lg px-4 py-3 text-left text-slate-300 hover:bg-white/5"
              >
                FAQs
              </button>


              <button
                onClick={() =>
                  scrollToSection(
                    "contact"
                  )
                }
                className="rounded-lg px-4 py-3 text-left text-slate-300 hover:bg-white/5"
              >
                Contact
              </button>


              <div className="mt-3 flex gap-3 border-t border-white/10 pt-4">

                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                  aria-pressed={theme === "dark"}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm"
                >
                  {theme === "light" ? (
                    <Moon size={17} aria-hidden="true" />
                  ) : (
                    <Sun size={17} aria-hidden="true" />
                  )}
                  <span>{theme === "light" ? "Dark" : "Light"}</span>
                </button>

                <Link
                  to="/login"
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-center text-sm"
                >
                  Sign In
                </Link>


                <Link
                  to="/register"
                  className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold"
                >
                  Get Started
                </Link>

              </div>

            </div>

          </div>

        )}

      </header>


      {/* =================================================
          HERO
      ================================================= */}

      <main>


        <section
          id="hero"
          className="landing-hero relative flex min-h-screen items-center px-6 pb-20 pt-32"
        >


          {/* BACKGROUND GRID */}

          <div className="hero-grid absolute inset-0" />


          {/* GLOW 1 */}

          <div className="hero-glow hero-glow-one" />


          {/* GLOW 2 */}

          <div className="hero-glow hero-glow-two" />


          {/* FLOATING ORBS */}

          <div className="floating-orb orb-one" />
          <div className="floating-orb orb-two" />
          <div className="floating-orb orb-three" />


          <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">


            {/* HERO CONTENT */}

            <div>

              <div className="landing-badge mb-7 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">

                <Sparkles
                  size={15}
                />

                AI-Powered Recruitment Platform

              </div>


              <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-8xl">

                Build teams.

                <br />

                <span className="hero-gradient-text">
                  Hire smarter.
                </span>

              </h1>


              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400 md:text-xl">

                HireFlow brings jobs, candidates, applications,
                interviews and hiring decisions into one intelligent
                recruitment workspace.

              </p>


              {/* CTA */}

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">

                <Link
                  to="/register"
                  className="group flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white shadow-xl shadow-blue-600/20 transition duration-300 hover:-translate-y-1 hover:bg-blue-500"
                >

                  Start Hiring

                  <ArrowRight
                    size={19}
                    className="transition-transform group-hover:translate-x-1"
                  />

                </Link>


                <button
                  type="button"
                  onClick={() =>
                    scrollToSection(
                      "features"
                    )
                  }
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/3 px-7 py-4 font-semibold text-slate-200 backdrop-blur transition hover:border-white/20 hover:bg-white/6"
                >

                  <Play
                    size={17}
                  />

                  Explore Platform

                </button>

              </div>


              {/* TRUST */}

              <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-slate-500">

                <div className="flex items-center gap-2">

                  <CheckCircle2
                    size={16}
                    className="text-emerald-400"
                  />

                  Multi-tenant

                </div>


                <div className="flex items-center gap-2">

                  <CheckCircle2
                    size={16}
                    className="text-emerald-400"
                  />

                  RBAC

                </div>


                <div className="flex items-center gap-2">

                  <CheckCircle2
                    size={16}
                    className="text-emerald-400"
                  />

                  Interview workflow

                </div>

              </div>

            </div>


            {/* HERO VISUAL */}

            <div className="relative hidden lg:block">


              <div className="dashboard-float relative mx-auto max-w-xl">


                {/* MAIN CARD */}

                <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-blue-950/40 backdrop-blur-xl">


                  {/* TOP */}

                  <div className="mb-5 flex items-center justify-between">

                    <div>

                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Recruitment Overview
                      </p>

                      <h3 className="mt-1 text-xl font-bold">
                        Hiring Pipeline
                      </h3>

                    </div>


                    <div className="rounded-xl bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400">

                      Live

                    </div>

                  </div>


                  {/* MINI STATS */}

                  <div className="grid grid-cols-3 gap-3">

                    <div className="rounded-2xl border border-white/5 bg-white/3 p-4">

                      <Users
                        size={18}
                        className="text-blue-400"
                      />

                      <p className="mt-3 text-2xl font-bold">
                        1.2K
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Candidates
                      </p>

                    </div>


                    <div className="rounded-2xl border border-white/5 bg-white/3 p-4">

                      <BriefcaseBusiness
                        size={18}
                        className="text-violet-400"
                      />

                      <p className="mt-3 text-2xl font-bold">
                        86
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Jobs
                      </p>

                    </div>


                    <div className="rounded-2xl border border-white/5 bg-white/3 p-4">

                      <Target
                        size={18}
                        className="text-emerald-400"
                      />

                      <p className="mt-3 text-2xl font-bold">
                        72%
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Match
                      </p>

                    </div>

                  </div>


                  {/* PIPELINE */}

                  <div className="mt-5 rounded-2xl border border-white/5 bg-slate-950/70 p-5">

                    <div className="mb-5 flex items-center justify-between">

                      <span className="text-sm font-semibold">
                        Candidate Pipeline
                      </span>

                      <span className="text-xs text-slate-500">
                        This month
                      </span>

                    </div>


                    <div className="space-y-4">

                      {[
                        [
                          "Applied",
                          "78%",
                        ],
                        [
                          "Screening",
                          "62%",
                        ],
                        [
                          "Interview",
                          "41%",
                        ],
                        [
                          "Selected",
                          "24%",
                        ],
                      ].map(
                        (item) => (

                          <div
                            key={
                              item[0]
                            }
                          >

                            <div className="mb-2 flex justify-between text-xs">

                              <span className="text-slate-400">
                                {item[0]}
                              </span>

                              <span className="text-slate-500">
                                {item[1]}
                              </span>

                            </div>


                            <div className="h-2 overflow-hidden rounded-full bg-white/5">

                              <div
                                className="pipeline-bar h-full rounded-full bg-linear-to-r from-blue-600 to-cyan-400"
                                style={{
                                  width:
                                    item[1],
                                }}
                              />

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  </div>


                  {/* AI CARD */}

                  <div className="mt-4 flex items-center gap-3 rounded-2xl border border-blue-500/10 bg-blue-500/5 p-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">

                      <BrainCircuit
                        size={20}
                        className="text-blue-400"
                      />

                    </div>

                    <div>

                      <p className="text-sm font-semibold">
                        AI screening active
                      </p>

                      <p className="text-xs text-slate-500">
                        Intelligent candidate matching
                      </p>

                    </div>

                  </div>

                </div>


                {/* FLOATING CARD */}

                <div className="absolute -left-10 top-20 hidden rounded-2xl border border-white/10 bg-slate-900/90 p-4 shadow-xl backdrop-blur-xl xl:block">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">

                      <CheckCircle2
                        size={20}
                        className="text-emerald-400"
                      />

                    </div>

                    <div>

                      <p className="text-xs text-slate-500">
                        Candidate
                      </p>

                      <p className="text-sm font-semibold">
                        Shortlisted
                      </p>

                    </div>

                  </div>

                </div>


                {/* FLOATING CARD */}

                <div className="absolute -right-10 bottom-20 hidden rounded-2xl border border-white/10 bg-slate-900/90 p-4 shadow-xl backdrop-blur-xl xl:block">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/10">

                      <CalendarIcon
                        size={19}
                        className="text-violet-400"
                      />

                    </div>

                    <div>

                      <p className="text-xs text-slate-500">
                        Next interview
                      </p>

                      <p className="text-sm font-semibold">
                        Today · 4:30 PM
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* SCROLL */}

          <button
            type="button"
            onClick={() =>
              scrollToSection(
                "stats"
              )
            }
            className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-slate-600 md:flex"
          >

            Scroll to explore

            <span className="h-10 w-px bg-linear-to-b from-blue-500/70 to-transparent" />

          </button>

        </section>


        {/* =================================================
            STATS TIMELINE
        ================================================= */}

        <section
          id="stats"
          className="relative scroll-mt-20 border-y border-white/10 bg-slate-900/30 px-6 py-28"
        >

          <div className="mx-auto max-w-7xl">


            <div className="mx-auto max-w-2xl text-center">

              <div className="mb-4 inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">

                Platform in motion

              </div>


              <h2 className="text-4xl font-bold tracking-tight md:text-5xl">

                Recruitment that keeps
                <span className="text-blue-500">
                  {" "}moving.
                </span>

              </h2>


              <p className="mt-5 text-slate-400">

                Track the scale of your recruitment ecosystem
                through one connected platform.

              </p>

            </div>


            {/* TIMELINE */}

            <div className="relative mt-20">


              {/* DESKTOP LINE */}

              <div className="timeline-line absolute left-[16.66%] right-[16.66%] top-10 hidden h-px bg-linear-to-r from-transparent via-blue-500/50 to-transparent md:block" />


              <div className="grid gap-14 md:grid-cols-3">

                {timelineStats.map(
                  (
                    item,
                    index
                  ) => {

                    const Icon =
                      item.icon;


                    return (

                      <div
                        key={
                          item.label
                        }
                        className="timeline-item relative text-center"
                        style={{
                          animationDelay:
                            `${index * 150}ms`,
                        }}
                      >


                        {/* NODE */}

                        <div className="timeline-node mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-blue-500/30 bg-slate-950 shadow-xl shadow-blue-500/10">

                          <Icon
                            size={28}
                            className="text-blue-400"
                          />

                        </div>


                        {/* NUMBER */}

                        <div className="mt-7 text-5xl font-black tracking-tight md:text-6xl">

                          {statsLoading ? (
                            <span className="animate-pulse text-slate-700">
                              —
                            </span>
                          ) : (
                            <AnimatedCounter
                              value={
                                item.number
                              }
                            />
                          )}

                          <span className="text-blue-500">
                            +
                          </span>

                        </div>


                        <h3 className="mt-3 text-xl font-bold">
                          {item.label}
                        </h3>


                        <p className="mx-auto mt-3 max-w-xs leading-7 text-slate-500">
                          {item.description}
                        </p>

                      </div>

                    );
                  }
                )}

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            FEATURES
        ================================================= */}

        <section
          id="features"
          className="scroll-mt-20 px-6 py-28"
        >

          <div className="mx-auto max-w-7xl">


            <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">


              {/* LEFT */}

              <div>

                <div className="sticky top-28">

                  <div className="mb-5 inline-flex rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">

                    Powerful features

                  </div>


                  <h2 className="text-4xl font-bold leading-tight md:text-5xl">

                    Everything your
                    <span className="text-blue-500">
                      {" "}recruitment team
                    </span>
                    {" "}needs.

                  </h2>


                  <p className="mt-6 max-w-lg leading-8 text-slate-400">

                    HireFlow connects every stage of recruitment
                    into one structured workspace so teams can
                    spend less time managing data and more time
                    building great teams.

                  </p>


                  <Link
                    to="/register"
                    className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
                  >

                    Create Workspace

                    <ArrowRight
                      size={18}
                    />

                  </Link>

                </div>

              </div>


              {/* RIGHT */}

              <div className="grid gap-5 sm:grid-cols-2">

                {features.map(
                  (
                    feature,
                    index
                  ) => {

                    const Icon =
                      feature.icon;


                    return (

                      <div
                        key={
                          feature.title
                        }
                        className="feature-card group rounded-3xl border border-white/10 bg-white/2.5 p-7"
                      >

                        <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/10 bg-blue-500/10 text-blue-400 transition duration-300 group-hover:scale-110 group-hover:bg-blue-500/15">

                          <Icon
                            size={25}
                          />

                        </div>


                        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">

                          0
                          {index + 1}

                        </div>


                        <h3 className="text-xl font-bold">
                          {feature.title}
                        </h3>


                        <p className="mt-3 leading-7 text-slate-500">
                          {feature.description}
                        </p>


                        <div className="mt-7 h-px w-0 bg-blue-500 transition-all duration-500 group-hover:w-full" />

                      </div>

                    );
                  }
                )}

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            WORKFLOW
        ================================================= */}

        <section className="border-y border-white/10 bg-white/1.5 px-6 py-28">

          <div className="mx-auto max-w-7xl">


            <div className="mx-auto max-w-3xl text-center">

              <div className="mb-5 inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">

                One connected workflow

              </div>


              <h2 className="text-4xl font-bold md:text-5xl">

                From job opening to
                <span className="text-emerald-400">
                  {" "}great hire.
                </span>

              </h2>


              <p className="mt-5 leading-7 text-slate-400">

                Keep your entire recruitment journey connected
                from the first application to the final hiring decision.

              </p>

            </div>


            <div className="mt-16 grid gap-5 md:grid-cols-5">

              {[
                {
                  icon: BriefcaseBusiness,
                  title: "Create Job",
                },

                {
                  icon: Search,
                  title: "Screen",
                },

                {
                  icon: Users,
                  title: "Shortlist",
                },

                {
                  icon: CalendarIcon,
                  title: "Interview",
                },

                {
                  icon: Rocket,
                  title: "Hire",
                },
              ].map(
                (
                  item,
                  index
                ) => {

                  const Icon =
                    item.icon;


                  return (

                    <div
                      key={
                        item.title
                      }
                      className="workflow-step relative rounded-2xl border border-white/10 bg-slate-950 p-6 text-center"
                    >

                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">

                        <Icon
                          size={22}
                        />

                      </div>


                      <div className="mt-4 text-sm font-semibold">
                        {item.title}
                      </div>


                      {index <
                        4 && (

                        <div className="workflow-arrow absolute -right-4 top-1/2 hidden text-blue-500 md:block">
                          →
                        </div>

                      )}

                    </div>

                  );
                }
              )}

            </div>

          </div>

        </section>


        {/* =================================================
            FAQ
        ================================================= */}

        <section
          id="faqs"
          className="scroll-mt-20 px-6 py-28"
        >

          <div className="mx-auto max-w-4xl">


            <div className="mb-12 text-center">

              <div className="mb-5 inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">

                Frequently asked questions

              </div>


              <h2 className="text-4xl font-bold md:text-5xl">

                Questions,
                <span className="text-blue-500">
                  {" "}answered.
                </span>

              </h2>

            </div>


            <div className="space-y-3">

              {faqs.map(
                (
                  faq,
                  index
                ) => (

                  <FAQItem
                    key={
                      faq.question
                    }
                    question={
                      faq.question
                    }
                    answer={
                      faq.answer
                    }
                    open={
                      activeFAQ ===
                      index
                    }
                    onClick={() =>
                      setActiveFAQ(
                        activeFAQ ===
                          index
                          ? -1
                          : index
                      )
                    }
                  />

                )
              )}

            </div>

          </div>

        </section>


        {/* =================================================
            CONTACT
        ================================================= */}

        <section
          id="contact"
          className="scroll-mt-20 border-t border-white/10 bg-slate-900/30 px-6 py-28"
        >

          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2">


            {/* CONTACT INFO */}

            <div>

              <div className="mb-5 inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">

                Let's talk

              </div>


              <h2 className="text-4xl font-bold leading-tight md:text-5xl">

                Ready to improve
                <span className="text-cyan-400">
                  {" "}your hiring?
                </span>

              </h2>


              <p className="mt-6 max-w-xl leading-8 text-slate-400">

                Have a question about HireFlow, the recruitment
                workflow or your organization's setup? Send us
                a message and our team will get back to you.

              </p>


              <div className="mt-10 space-y-5">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">

                    <Mail
                      size={21}
                    />

                  </div>

                  <div>

                    <p className="text-xs uppercase tracking-wider text-slate-600">
                      Email
                    </p>

                    <p className="mt-1 text-sm text-slate-300">
                      hello@hireflow.dev
                    </p>

                  </div>

                </div>


                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">

                    <MessageSquare
                      size={21}
                    />

                  </div>

                  <div>

                    <p className="text-xs uppercase tracking-wider text-slate-600">
                      Support
                    </p>

                    <p className="mt-1 text-sm text-slate-300">
                      Recruitment platform support
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* CONTACT FORM */}

            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl md:p-8">


              {contactMessage.text && (

                <div
                  className={`
                    mb-6 rounded-xl border p-4 text-sm
                    ${
                      contactMessage.type ===
                      "success"
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                        : "border-red-500/20 bg-red-500/10 text-red-400"
                    }
                  `}
                >
                  {contactMessage.text}
                </div>

              )}


              <form
                onSubmit={
                  handleContactSubmit
                }
                className="space-y-5"
              >


                {/* NAME */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={
                      contactForm.name
                    }
                    onChange={
                      handleContactChange
                    }
                    placeholder="Your name"
                    required
                    maxLength={100}
                    className="w-full rounded-xl border border-white/10 bg-white/3 px-4 py-3.5 text-white outline-none placeholder:text-slate-700 transition focus:border-blue-500"
                  />

                </div>


                {/* EMAIL */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={
                      contactForm.email
                    }
                    onChange={
                      handleContactChange
                    }
                    placeholder="you@example.com"
                    required
                    maxLength={150}
                    className="w-full rounded-xl border border-white/10 bg-white/3 px-4 py-3.5 text-white outline-none placeholder:text-slate-700 transition focus:border-blue-500"
                  />

                </div>


                {/* SUBJECT */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Subject
                  </label>

                  <input
                    type="text"
                    name="subject"
                    value={
                      contactForm.subject
                    }
                    onChange={
                      handleContactChange
                    }
                    placeholder="How can we help?"
                    required
                    maxLength={200}
                    className="w-full rounded-xl border border-white/10 bg-white/3 px-4 py-3.5 text-white outline-none placeholder:text-slate-700 transition focus:border-blue-500"
                  />

                </div>


                {/* MESSAGE */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Message
                  </label>

                  <textarea
                    name="message"
                    value={
                      contactForm.message
                    }
                    onChange={
                      handleContactChange
                    }
                    placeholder="Tell us what you need..."
                    rows={5}
                    required
                    maxLength={5000}
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/3 px-4 py-3.5 text-white outline-none placeholder:text-slate-700 transition focus:border-blue-500"
                  />

                </div>


                {/* BUTTON */}

                <button
                  type="submit"
                  disabled={
                    contactLoading
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {contactLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send
                        size={17}
                      />
                    </>
                  )}

                </button>

              </form>

            </div>

          </div>

        </section>

      </main>


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="border-t border-white/10 px-6 py-10">

        <div className="mx-auto max-w-7xl">


          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">


            {/* BRAND */}

            <div>

              <Link
                to="/"
                className="text-2xl font-bold"
              >

                Hire
                <span className="text-blue-500">
                  Flow
                </span>

              </Link>


              <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">

                AI-powered recruitment and HR management
                for modern organizations.

              </p>

            </div>


            {/* LINKS */}

            <div className="flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-500">

              <button
                onClick={() =>
                  scrollToSection(
                    "features"
                  )
                }
                className="hover:text-white"
              >
                Features
              </button>

              <button
                onClick={() =>
                  scrollToSection(
                    "faqs"
                  )
                }
                className="hover:text-white"
              >
                FAQs
              </button>

              <button
                onClick={() =>
                  scrollToSection(
                    "contact"
                  )
                }
                className="hover:text-white"
              >
                Contact
              </button>

              <Link
                to="/login"
                className="hover:text-white"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="hover:text-white"
              >
                Register
              </Link>

            </div>


            {/* SOCIAL */}

            <div className="flex gap-3">

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-500 transition hover:border-white/20 hover:text-white"
              >

                <GitBranch
                  size={18}
                />

              </a>


              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-500 transition hover:border-white/20 hover:text-white"
              >

                <Globe
                  size={18}
                />

              </a>

            </div>

          </div>


          <div className="mt-8 border-t border-white/5 pt-6 text-center text-xs text-slate-700">

            © {new Date().getFullYear()} HireFlow. All rights reserved.

          </div>

        </div>

      </footer>

    </div>
  );
}


// =====================================================
// CALENDAR ICON
// =====================================================

function CalendarIcon(
  props
) {
  return (
    <Clock3
      {...props}
    />
  );
}


export default Home;