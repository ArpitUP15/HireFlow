import {
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  LogIn,
  Mail,
  Lock
} from "lucide-react";

import { useAuth } from "../../context/useAuth";

function Login() {
  const navigate =
    useNavigate();

  const {
    login
  } = useAuth();

  const [
    formData,
    setFormData
  ] = useState({
    email: "",
    password: ""
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
    setLoading(true);

    try {
      await login(
        formData.email,
        formData.password
      );

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">

      <div className="w-full max-w-md">

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
            Welcome back
          </h1>

          <p className="mt-2 text-slate-400">
            Sign in to your HireFlow account
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

          {/* Email */}

          <div className="mb-5">

            <label className="mb-2 block text-sm font-medium">
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
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500"
              />

            </div>

          </div>

          {/* Password */}

          <div className="mb-6">

            <label className="mb-2 block text-sm font-medium">
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
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500"
              />

            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >

            <LogIn size={18} />

            {loading
              ? "Signing in..."
              : "Sign In"}

          </button>

          <p className="mt-6 text-center text-sm text-slate-400">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="text-blue-400 hover:text-blue-300"
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