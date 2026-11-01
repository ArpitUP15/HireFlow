import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { UserPlus, Mail, Lock, User, Loader2 } from "lucide-react";

import { useAuth } from "../../context/useAuth";

function Register() {
  const navigate = useNavigate();

  const { register } = useAuth();

  const invitationToken = new URLSearchParams(window.location.search).get(
    "invitation",
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: invitationToken ? "recruiter" : "candidate",
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

    const firstName = formData.firstName.trim();

    const lastName = formData.lastName.trim();

    const email = formData.email.trim().toLowerCase();

    // ------------------------------------------------
    // Validation
    // ------------------------------------------------

    if (!firstName || !lastName || !email || !formData.password) {
      setError("Please fill in all required fields.");

      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");

      return;
    }

    if (!/[a-z]/.test(formData.password)) {
      setError("Password must include a lowercase letter.");

      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError("Password must include an uppercase letter.");

      return;
    }

    if (!/\d/.test(formData.password)) {
      setError("Password must include a number.");

      return;
    }

    if (!/[^A-Za-z0-9]/.test(formData.password)) {
      setError("Password must include a special character.");

      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");

      return;
    }

    try {
      setLoading(true);

      await register({
        firstName,
        lastName,
        email,

        password: formData.password,

        role: formData.role,
      });

      navigate(
        new URLSearchParams(window.location.search).get("invitation")
          ? `/accept-invitation?token=${encodeURIComponent(new URLSearchParams(window.location.search).get("invitation"))}`
          : "/dashboard",
        {
          replace: true,
        },
      );
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-10 text-text">
      <div className="w-full max-w-lg">
        {/* =========================================
            HEADER
        ========================================= */}

        <div className="mb-8 text-center">
          <Link to="/" className="text-3xl font-bold">
            Hire
            <span className="text-primary">Flow</span>
          </Link>

          <h1 className="mt-8 text-3xl font-bold">Create your account</h1>

          <p className="mt-2 text-muted">Join the future of recruitment</p>
        </div>

        {/* =========================================
            FORM
        ========================================= */}

        <form
          onSubmit={handleSubmit}

          className="rounded-2xl border border-border bg-surface/70 p-8 shadow-2xl backdrop-blur"
        >
          {/* =======================================
              ERROR
          ======================================= */}

          {error && (
            <div className="mb-6 rounded-xl border border-accent/30 bg-accent/10 p-4 text-sm text-accent-readable">
              {error}
            </div>
          )}

          {/* =======================================
              FIRST + LAST NAME
          ======================================= */}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* First Name */}

            <div>
              <label
                htmlFor="firstName"
                className="mb-2 block text-sm font-medium"
              >
                First Name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Arpit"
                  className="w-full rounded-xl border border-border bg-primary/5 py-3 pl-10 pr-4 text-text outline-none transition-opacity placeholder:text-muted focus:border-primary disabled:opacity-50"
                />
              </div>
            </div>

            {/* Last Name */}

            <div>
              <label
                htmlFor="lastName"
                className="mb-2 block text-sm font-medium"
              >
                Last Name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Bansal"
                  className="w-full rounded-xl border border-border bg-primary/5 py-3 pl-10 pr-4 text-text outline-none transition-opacity placeholder:text-muted focus:border-primary disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* =======================================
              EMAIL
          ======================================= */}

          <div className="mt-5">
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
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-border bg-primary/5 py-3 pl-10 pr-4 text-text outline-none transition-opacity placeholder:text-muted focus:border-primary disabled:opacity-50"
              />
            </div>
          </div>

          {/* =======================================
              PASSWORD
          ======================================= */}

          <div className="mt-5">
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
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                disabled={loading}
                placeholder="Create a strong password"
                className="w-full rounded-xl border border-border bg-primary/5 py-3 pl-10 pr-4 text-text outline-none transition-opacity placeholder:text-muted focus:border-primary disabled:opacity-50"
              />
            </div>
            <p className="mt-2 text-xs text-muted">
              Use at least 8 characters with uppercase and lowercase letters,
              a number, and a special character.
            </p>
          </div>

          {/* =======================================
              CONFIRM PASSWORD
          ======================================= */}

          <div className="mt-5">
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium"
            >
              Confirm Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={8}
                disabled={loading}
                placeholder="Repeat your password"
                className="w-full rounded-xl border border-border bg-primary/5 py-3 pl-10 pr-4 text-text outline-none transition-opacity placeholder:text-muted focus:border-primary disabled:opacity-50"
              />
            </div>
          </div>

          {/* =======================================
              ROLE
          ======================================= */}

          <div className="mt-5">
            <label htmlFor="role" className="mb-2 block text-sm font-medium">
              Account Type
            </label>

            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading || Boolean(invitationToken)}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-text outline-none transition-opacity focus:border-primary disabled:opacity-50"
            >
              <option value="recruiter">Recruiter</option>

              <option value="candidate">Candidate</option>
            </select>
            {invitationToken && (
              <p className="mt-2 text-sm text-muted">
                Organization invitations require a recruiter account.
              </p>
            )}
          </div>

          {/* =======================================
              SUBMIT
          ======================================= */}

          <button
            type="submit"
            disabled={loading}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold transition-opacity hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 text-background"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Create Account
              </>
            )}
          </button>

          {/* =======================================
              LOGIN LINK
          ======================================= */}

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:text-primary"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
