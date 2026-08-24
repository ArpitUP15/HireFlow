import {
  Users,
  Briefcase,
  FileText,
  UserCheck
} from "lucide-react";

function Dashboard() {

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
        <div className="mx-auto max-w-7xl px-6 py-5">

          <h1 className="text-2xl font-bold">
            HireFlow Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Recruitment overview
          </p>

        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* Stats */}

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

        {/* Recruitment pipeline */}

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
            ].map(([stage, count]) => (

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

            ))}

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;