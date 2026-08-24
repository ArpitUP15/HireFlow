import { Link } from "react-router-dom";
import {
  Users,
  Briefcase,
  Brain,
  ArrowRight
} from "lucide-react";

function Home() {
  const features = [
    {
      icon: Brain,
      title: "AI Resume Screening",
      description:
        "Automatically analyze resumes and match candidates with job requirements."
    },
    {
      icon: Users,
      title: "Candidate Management",
      description:
        "Manage candidates throughout the entire recruitment lifecycle."
    },
    {
      icon: Briefcase,
      title: "Smart Job Management",
      description:
        "Create, publish and manage job openings from one dashboard."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}

      <nav className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div className="text-2xl font-bold">
            Hire<span className="text-blue-500">Flow</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium transition hover:bg-blue-500"
            >
              Dashboard
            </Link>
          </div>

        </div>
      </nav>

      {/* Hero */}

      <section className="mx-auto max-w-7xl px-6 py-24">

        <div className="max-w-4xl">

          <div className="mb-6 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
            AI-Powered Recruitment Platform
          </div>

          <h1 className="text-5xl font-bold leading-tight md:text-7xl">
            Hire the right
            <span className="text-blue-500">
              {" "}people faster.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            HireFlow helps companies manage jobs, candidates,
            applications and interviews while using AI to
            intelligently screen and rank candidates.
          </p>

          <div className="mt-10 flex gap-4">

            <Link
              to="/dashboard"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
            >
              Explore Dashboard
              <ArrowRight size={18} />
            </Link>

          </div>

        </div>

      </section>

      {/* Features */}

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-24 md:grid-cols-3">

        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur"
            >

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Icon size={24} />
              </div>

              <h3 className="text-xl font-semibold">
                {feature.title}
              </h3>

              <p className="mt-3 leading-7 text-slate-400">
                {feature.description}
              </p>

            </div>
          );
        })}

      </section>

    </div>
  );
}

export default Home;