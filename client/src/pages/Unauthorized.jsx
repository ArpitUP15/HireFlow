import { Link } from "react-router-dom";

function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-text">
      <div className="text-center">
        <div className="text-7xl font-bold">403</div>

        <h1 className="mt-5 text-3xl font-bold">Access Denied</h1>

        <p className="mt-3 text-muted">
          You don't have permission to access this page.
        </p>

        <Link
          to="/dashboard"
          className="mt-7 inline-block rounded-xl bg-primary px-6 py-3 font-semibold hover:bg-primary/90 text-background"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default Unauthorized;
