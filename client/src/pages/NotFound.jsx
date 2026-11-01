import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-text">
      <div className="text-center">
        <h1 className="text-7xl font-bold">404</h1>

        <p className="mt-4 text-muted">Page not found.</p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-primary px-5 py-3 font-medium hover:bg-primary/90 text-background"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
