import {
  Users,
  Briefcase,
  FileText,
  UserCheck,
  LogOut
} from "lucide-react";

import { useAuth } from "../context/useAuth";

function Dashboard() {
  const {
    user,
    logout
  } = useAuth();

  const stats = [
    {
      title: "Total Jobs",
      value: "24",
      icon: Briefcase
    },
    {
      title: "Candidates",
      value: "1,248",
      icon: Users
    },
    {
      title: "Applications",
      value: "3,842",
      icon: FileText
    },
    {
      title: "Hired",
      value: "86",
      icon: UserCheck
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <header className="border-b border-white/10">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

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

            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:bg-white/5"
            >
              <LogOut size={17} />
              Logout
            </button>

          </div>

        </div>

      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">

        <div className="mb-10">

          <h2 className="text-3xl font-bold">
            Welcome back,{" "}
            {user?.firstName} 👋
          </h2>

          <p className="mt-2 text-slate-400">
            Here's what's happening with your recruitment activities.
          </p>

        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {stats.map((stat) => {

            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-white/10 bg-white/3 p-6"
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
                    <Icon size={24} />
                  </div>

                </div>

              </div>
            );
          })}

        </div>

        <section className="mt-10">

          <h2 className="mb-5 text-xl font-semibold">
            Recruitment Pipeline
          </h2>

          <div className="grid gap-5 md:grid-cols-5">

            {[
              ["Applied", 428],
              ["Screening", 186],
              ["Shortlisted", 92],
              ["Interview", 48],
              ["Selected", 18]
            ].map(
              ([stage, count]) => (
                <div
                  key={stage}
                  className="rounded-2xl border border-white/10 bg-white/3 p-5"
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

      </main>

    </div>
  );
}

export default Dashboard;