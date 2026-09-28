import {
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  LogIn,
  Mail,
  Lock,
  Loader2,
} from "lucide-react";

import {
  useAuth,
} from "../../context/useAuth";
import {
  getMyOrganizations,
} from "../../services/organizationService";


function Login() {

  const navigate =
    useNavigate();

  const location =
    useLocation();


  const {
    login,
  } = useAuth();


  const [
    formData,
    setFormData,
  ] = useState({
    email: "",
    password: "",
  });


  const [
    error,
    setError,
  ] = useState("");


  const [
    loading,
    setLoading,
  ] = useState(false);


  // ===================================================
  // HANDLE INPUT
  // ===================================================

  const handleChange =
    (event) => {

      const {
        name,
        value,
      } = event.target;


      setFormData(
        (previous) => ({
          ...previous,
          [name]: value,
        })
      );


      if (error) {
        setError("");
      }
    };


  // ===================================================
  // SUBMIT
  // ===================================================

  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setError("");


      const email =
        formData.email
          .trim()
          .toLowerCase();


      if (
        !email ||
        !formData.password
      ) {

        setError(
          "Email and password are required."
        );

        return;
      }


      try {

        setLoading(true);


        const authResponse =
          await login(
            email,
            formData.password
          );

        const userRole =
          authResponse?.user?.role;

        let redirectPath =
          location.state?.from
            ?.pathname ||
          "/dashboard";

        if (
          userRole !== "candidate"
        ) {
          const organizationResponse =
            await getMyOrganizations();

          const hasOrganization =
            (organizationResponse?.organizations ||
              []).length > 0;

          if (hasOrganization) {
            redirectPath =
              "/organization";
          }
        }

        navigate(
          redirectPath,
          {
            replace: true,
          }
        );

      } catch (error) {

        const message =
          error?.response
            ?.data
            ?.message ||
          error?.message ||
          "Login failed. Please try again.";


        setError(
          message
        );

      } finally {

        setLoading(false);
      }
    };


  return (

    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">

      <div className="w-full max-w-md">


        {/* =========================================
            HEADER
        ========================================= */}

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


        {/* =========================================
            FORM
        ========================================= */}

        <form
          onSubmit={
            handleSubmit
          }

          className="rounded-2xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl"
        >


          {/* ERROR */}

          {error && (

            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">

              {error}

            </div>

          )}


          {/* EMAIL */}

          <div className="mb-5">

            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
            >
              Email
            </label>


            <div className="relative">

              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />


              <input
                id="email"
                type="email"
                name="email"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                required
                disabled={
                  loading
                }
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 disabled:opacity-50"
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
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />


              <input
                id="password"
                type="password"
                name="password"
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
                required
                disabled={
                  loading
                }
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 disabled:opacity-50"
              />

            </div>

          </div>


          {/* SUBMIT */}

          <button
            type="submit"
            disabled={
              loading
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {loading ? (

              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Signing in...

              </>

            ) : (

              <>
                <LogIn
                  size={18}
                />

                Sign In
              </>

            )}

          </button>


          {/* REGISTER LINK */}

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