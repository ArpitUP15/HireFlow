import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Building2,
  Loader2,
} from "lucide-react";

import {
  useAuth,
} from "../../context/useAuth";
import {
  createOrganization,
  getMyOrganizations,
} from "../../services/organizationService";


const OrganizationSetup = () => {

  const navigate =
    useNavigate();

  const {
    user,
  } = useAuth();

  useEffect(() => {
    const redirectIfExistingOrganization = async () => {
      if (!user) {
        return;
      }

      if (user.role === "candidate") {
        navigate("/dashboard", {
          replace: true,
        });

        return;
      }

      try {
        const response =
          await getMyOrganizations();

        const hasOrganization =
          (response?.organizations || []).length > 0;

        if (hasOrganization) {
          navigate("/organization", {
            replace: true,
          });
        }
      } catch (error) {
        console.error(
          "Organization redirect check failed:",
          error
        );
      }
    };

    redirectIfExistingOrganization();
  }, [navigate, user]);

  const [
    formData,
    setFormData,
  ] = useState({
    name: "",
    description: "",
    website: "",
    industry: "",
    companySize: "",
    logo: "",
  });


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  // ===================================================
  // INPUT CHANGE
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
    };


  // ===================================================
  // SUBMIT
  // ===================================================

  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setError("");

      setLoading(true);


      try {

        const response =
          await createOrganization({
            name:
              formData.name.trim(),

            description:
              formData.description.trim(),

            website:
              formData.website.trim(),

            industry:
              formData.industry.trim(),

            companySize:
              formData.companySize,

            logo:
              formData.logo.trim(),
          });


        const organizationId =
          response
            ?.organization
            ?._id;


        if (!organizationId) {

          throw new Error(
            "Organization was created, but no organization ID was returned."
          );
        }


        // ---------------------------------------------
        // Store selected organization
        // ---------------------------------------------

        localStorage.setItem(
          "currentOrganizationId",
          organizationId
        );


        // ---------------------------------------------
        // Dashboard
        // ---------------------------------------------

        navigate(
          "/dashboard",
          {
            replace: true,
          }
        );

      } catch (error) {

        console.error(
          "Organization creation error:",
          error
        );


        setError(
          error?.response
            ?.data
            ?.message ||
          error?.message ||
          "Unable to create organization."
        );

      } finally {

        setLoading(false);
      }
    };


  // ===================================================
  // UI
  // ===================================================

  return (

    <div className="min-h-screen bg-slate-950 px-6 py-12 text-white">

      <div className="mx-auto max-w-2xl">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-10 text-center">

          <h1 className="text-3xl font-bold">

            Create your{" "}

            <span className="text-blue-500">
              organization
            </span>

          </h1>


          <p className="mt-3 text-slate-400">

            Set up your organization to start using HireFlow.

          </p>

        </div>


        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={
            handleSubmit
          }
          className="rounded-2xl border border-white/10 bg-slate-900 p-8 shadow-2xl"
        >


          {/* Error */}

          {error && (

            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">

              {error}

            </div>

          )}


          {/* Organization Name */}

          <div className="mb-6">

            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium"
            >
              Organization Name
            </label>


            <div className="relative">

              <Building2
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />


              <input
                id="name"
                name="name"
                type="text"
                value={
                  formData.name
                }
                onChange={
                  handleChange
                }
                placeholder="e.g. HireFlow Technologies"
                required
                disabled={
                  loading
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white outline-none placeholder:text-slate-600 focus:border-blue-500 disabled:opacity-50"
              />

            </div>

          </div>


          {/* Description */}

          <div className="mb-6">

            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium"
            >
              Description
            </label>


            <textarea
              id="description"
              name="description"
              value={
                formData.description
              }
              onChange={
                handleChange
              }
              placeholder="Tell us about your organization"
              rows={4}
              disabled={
                loading
              }
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500 disabled:opacity-50"
            />

          </div>


          {/* Website */}

          <div className="mb-6">

            <label
              htmlFor="website"
              className="mb-2 block text-sm font-medium"
            >
              Website
            </label>


            <input
              id="website"
              name="website"
              type="url"
              value={
                formData.website
              }
              onChange={
                handleChange
              }
              placeholder="https://example.com"
              disabled={
                loading
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500 disabled:opacity-50"
            />

          </div>


          {/* Industry */}

          <div className="mb-6">

            <label
              htmlFor="industry"
              className="mb-2 block text-sm font-medium"
            >
              Industry
            </label>


            <input
              id="industry"
              name="industry"
              type="text"
              value={
                formData.industry
              }
              onChange={
                handleChange
              }
              placeholder="e.g. Software Development"
              disabled={
                loading
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500 disabled:opacity-50"
            />

          </div>


          {/* Company Size */}

          <div className="mb-8">

            <label
              htmlFor="companySize"
              className="mb-2 block text-sm font-medium"
            >
              Company Size
            </label>


            <select
              id="companySize"
              name="companySize"
              value={
                formData.companySize
              }
              onChange={
                handleChange
              }
              disabled={
                loading
              }
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500 disabled:opacity-50"
            >

              <option value="">
                Select company size
              </option>

              <option value="1-10">
                1-10 employees
              </option>

              <option value="11-50">
                11-50 employees
              </option>

              <option value="51-200">
                51-200 employees
              </option>

              <option value="201-500">
                201-500 employees
              </option>

              <option value="501-1000">
                501-1000 employees
              </option>

              <option value="1001-5000">
                1001-5000 employees
              </option>

              <option value="5000+">
                5000+ employees
              </option>

            </select>

          </div>


          {/* Submit */}

          <button
            type="submit"
            disabled={
              loading
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {loading ? (

              <>

                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Creating organization...

              </>

            ) : (

              "Create Organization"

            )}

          </button>

        </form>

      </div>

    </div>
  );
};


export default OrganizationSetup;