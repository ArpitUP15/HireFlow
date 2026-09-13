import {
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  UserPlus,
  Mail,
  Lock,
  Briefcase
} from "lucide-react";

import { useAuth } from "../../context/useAuth";

function Register() {
  const navigate =
    useNavigate();

  const {
    register
  } = useAuth();

  const [
    formData,
    setFormData
  ] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "candidate"
  });

  const [
    error,
    setError
  ] = useState("");

  const [
    loading,
    setLoading
  ] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]:
        event.target.value
    });
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError(
        "Passwords do not match"
      );

      return;
    }

    if (formData.password.length < 8) {
      setError(
        "Password must contain at least 8 characters"
      );

      return;
    }

    setLoading(true);

    try {
      await register({
        firstName:
          formData.firstName,

        lastName:
          formData.lastName,

        email:
          formData.email,

        password:
          formData.password,

        role:
          formData.role
      });

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-white">

      <div className="w-full max-w-lg">

        <div className="mb-8 text-center">

          <Link
            to="/"
            className="text-3xl font-bold"
          >
            Hire
            <span className="text-blue-500">
              Flow
            </span>
          </Link>

          <h1 className="mt-8 text-3xl font-bold">
            Create your account
          </h1>

          <p className="mt-2 text-slate-400">
            Join the future of recruitment
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-white/3 p-8"
        >

          {error && (
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">

            {/* First Name */}

            <div>

              <label className="mb-2 block text-sm">
                First Name
              </label>

              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Arpit"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>

            {/* Last Name */}

            <div>

              <label className="mb-2 block text-sm">
                Last Name
              </label>

              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Bansal"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>

          </div>

          {/* Email */}

          <div className="mt-5">

            <label className="mb-2 block text-sm">
              Email
            </label>

            <div className="relative">

              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 outline-none focus:border-blue-500"
              />

            </div>

          </div>

          {/* Password */}

          <div className="mt-5">

            <label className="mb-2 block text-sm">
              Password
            </label>

            <div className="relative">

              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Minimum 8 characters"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 outline-none focus:border-blue-500"
              />

            </div>

          </div>

          {/* Confirm Password */}

          <div className="mt-5">

            <label className="mb-2 block text-sm">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={
                formData.confirmPassword
              }
              onChange={handleChange}
              required
              placeholder="Repeat your password"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>

          {/* Role */}

          <div className="mt-5">

            <label className="mb-2 block text-sm">
              Account Type
            </label>

            <div className="relative">

              <Briefcase
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full appearance-none rounded-xl border border-white/10 bg-slate-900 py-3 pl-10 pr-4 outline-none focus:border-blue-500"
              >
                <option value="candidate">
                  Candidate
                </option>

                <option value="recruiter">
                  Recruiter
                </option>
              </select>

            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold hover:bg-blue-500 disabled:opacity-50"
          >

            <UserPlus size={18} />

            {loading
              ? "Creating account..."
              : "Create Account"}

          </button>

          <p className="mt-6 text-center text-sm text-slate-400">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-blue-400"
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