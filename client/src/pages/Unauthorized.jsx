import { Link } from "react-router-dom";

function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">

      <div className="text-center">

        <div className="text-7xl font-bold">
          403
        </div>

        <h1 className="mt-5 text-3xl font-bold">
          Access Denied
        </h1>

        <p className="mt-3 text-slate-400">
          You don't have permission to access this page.
        </p>

        <Link
          to="/dashboard"
          className="mt-7 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
        >
          Back to Dashboard
        </Link>

      </div>

    </div>
  );
}

export default Unauthorized;