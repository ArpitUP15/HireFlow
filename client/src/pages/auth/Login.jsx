import { useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { LogIn, Mail, Lock, Loader2 } from "lucide-react";

import { useAuth } from "../../context/useAuth";
import { getMyOrganizations } from "../../services/organizationService";

function Login() {
  const navigate = useNavigate();

  const location = useLocation();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  // ===================================================
  // HANDLE INPUT
  // ===================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // ===================================================
  // SUBMIT
  // ===================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const email = formData.email.trim().toLowerCase();

    if (!email || !formData.password) {
      setError("Email and password are required.");

      return;
    }

    try {
      setLoading(true);

      const authResponse = await login(email, formData.password);

      const userRole = authResponse?.user?.role;

      let redirectPath = location.state?.from?.pathname || "/dashboard";

      const invitationPath = redirectPath.startsWith("/accept-invitation?")
        ? redirectPath
        : null;
      if (userRole === "candidate") redirectPath = "/dashboard";
      if (userRole !== "candidate") {
        const organizationResponse = await getMyOrganizations();

        const hasOrganization =
          (organizationResponse?.organizations || []).length > 0;

        if (hasOrganization) {
          redirectPath = "/organization";
        }
      }

      navigate(invitationPath || redirectPath, {
        replace: true,
      });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-text">
      <div className="w-full max-w-md">
        {/* =========================================
            HEADER
        ========================================= */}

        <div className="mb-8 text-center">
          <Link to="/" className="text-3xl font-bold">
            Hire
            <span className="text-primary">Flow</span>
          </Link>

          <h1 className="mt-8 text-3xl font-bold">Welcome back</h1>

          <p className="mt-2 text-muted">Sign in to your HireFlow account</p>
        </div>

        {/* =========================================
            FORM
        ========================================= */}

        <form
          onSubmit={handleSubmit}

          className="rounded-2xl border border-border bg-surface/70 p-8 shadow-2xl"
        >
          {/* ERROR */}

          {error && (
            <div className="mb-6 rounded-xl border border-accent/30 bg-accent/10 p-4 text-sm text-accent-readable">
              {error}
            </div>
          )}

          {/* EMAIL */}

          <div className="mb-5">
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-border bg-primary/5 py-3 pl-10 pr-4 text-text outline-none transition-opacity placeholder:text-muted focus:border-primary disabled:opacity-50"
              />
            </div>
          </div>

          {/* PASSWORD */}

          <div className="mb-6">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />

              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="••••••••"
                className="w-full rounded-xl border border-border bg-primary/5 py-3 pl-10 pr-4 text-text outline-none transition-opacity placeholder:text-muted focus:border-primary disabled:opacity-50"
              />
            </div>
          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold transition-opacity hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 text-background"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>

          {/* REGISTER LINK */}

          <p className="mt-6 text-center text-sm text-muted">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary hover:text-primary"
            >
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
