import { useCallback, useEffect, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5001/api";

const TOKEN_KEY = "hireflow_token";
const ORGANIZATION_KEY = "hireflow_organization_id";

const Organization = () => {
  const [organization, setOrganization] = useState(null);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const [error, setError] = useState("");
  const [errorType, setErrorType] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    industry: "",
    website: "",
    location: "",
  });

  // ============================================================
  // GET TOKEN
  // ============================================================

  const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
  };

  // ============================================================
  // FETCH ORGANIZATION
  // ============================================================

  const fetchOrganization = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");
        setErrorType("");

        const token = getToken();

        // --------------------------------------------------------
        // USER NOT LOGGED IN
        // --------------------------------------------------------

        if (!token) {
          setOrganization(null);
          setError(
            "Your session has expired. Please login again."
          );
          setErrorType("auth");

          return;
        }

        const organizationId =
          localStorage.getItem(
            ORGANIZATION_KEY
          );

        // --------------------------------------------------------
        // NO ORGANIZATION SELECTED
        // --------------------------------------------------------

        if (!organizationId) {
          setOrganization(null);
          setShowCreateForm(false);

          return;
        }

        // --------------------------------------------------------
        // FETCH ORGANIZATION
        // --------------------------------------------------------

        const response = await fetch(
          `${API_BASE_URL}/organizations/${organizationId}`,
          {
            method: "GET",

            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
              "x-organization-id":
                organizationId,
            },

            credentials: "include",
          }
        );

        let data = {};

        try {
          data = await response.json();
        } catch {
          data = {};
        }

        // --------------------------------------------------------
        // UNAUTHORIZED
        // --------------------------------------------------------

        if (response.status === 401) {
          setOrganization(null);

          setError(
            data.message ||
              "Your session has expired. Please login again."
          );

          setErrorType("auth");

          return;
        }

        // --------------------------------------------------------
        // ORGANIZATION NOT FOUND
        // --------------------------------------------------------

        if (response.status === 404) {
          /*
           * The saved organization ID is no longer valid.
           *
           * Remove it so the application doesn't keep trying
           * to load the same invalid organization.
           */

          localStorage.removeItem(
            ORGANIZATION_KEY
          );

          setOrganization(null);
          setError("");
          setErrorType("");

          return;
        }

        // --------------------------------------------------------
        // OTHER SERVER ERROR
        // --------------------------------------------------------

        if (!response.ok) {
          throw new Error(
            data.message ||
              `Server error (${response.status})`
          );
        }

        // --------------------------------------------------------
        // EXTRACT ORGANIZATION
        // --------------------------------------------------------

        const loadedOrganization =
          data.organization ||
          data.data ||
          data;

        if (
          !loadedOrganization ||
          !loadedOrganization._id
        ) {
          throw new Error(
            "Invalid organization data received from server."
          );
        }

        setOrganization(
          loadedOrganization
        );
        setError("");
        setErrorType("");
      } catch (err) {
        console.error(
          "Organization loading error:",
          err
        );

        /*
         * IMPORTANT:
         *
         * Network/server errors should NOT delete the
         * organization ID because the organization may
         * still exist.
         */

        setOrganization(null);

        setError(
          err.message ||
            "Unable to load organization. Please try again."
        );

        setErrorType("server");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    fetchOrganization();
  }, [fetchOrganization]);

  // ============================================================
  // HANDLE FORM INPUT
  // ============================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ============================================================
  // CREATE ORGANIZATION
  // ============================================================

  const handleCreateOrganization =
    async (event) => {
      event.preventDefault();

      setError("");
      setErrorType("");

      const name =
        formData.name.trim();

      if (!name) {
        setError(
          "Organization name is required."
        );
        setErrorType("validation");

        return;
      }

      try {
        setCreating(true);

        const token = getToken();

        if (!token) {
          setError(
            "Please login before creating an organization."
          );

          setErrorType("auth");

          return;
        }

        /*
         * IMPORTANT:
         *
         * Do NOT send x-organization-id here.
         *
         * We are creating the organization for the
         * first time, therefore an organization ID
         * does not exist yet.
         */

        const response = await fetch(
          `${API_BASE_URL}/organizations`,
          {
            method: "POST",

            headers: {
              Accept:
                "application/json",

              "Content-Type":
                "application/json",

              Authorization: `Bearer ${token}`,
            },

            credentials: "include",

            body: JSON.stringify({
              name,

              description:
                formData.description.trim(),

              industry:
                formData.industry.trim(),

              website:
                formData.website.trim(),

              location:
                formData.location.trim(),
            }),
          }
        );

        let data = {};

        try {
          data = await response.json();
        } catch {
          data = {};
        }

        // --------------------------------------------------------
        // AUTH ERROR
        // --------------------------------------------------------

        if (response.status === 401) {
          setError(
            data.message ||
              "Your session has expired. Please login again."
          );

          setErrorType("auth");

          return;
        }

        // --------------------------------------------------------
        // VALIDATION / BAD REQUEST
        // --------------------------------------------------------

        if (response.status === 400) {
          setError(
            data.message ||
              "Please check the organization details."
          );

          setErrorType("validation");

          return;
        }

        // --------------------------------------------------------
        // DUPLICATE ORGANIZATION
        // --------------------------------------------------------

        if (response.status === 409) {
          setError(
            data.message ||
              "An organization with these details already exists."
          );

          setErrorType("validation");

          return;
        }

        // --------------------------------------------------------
        // OTHER ERROR
        // --------------------------------------------------------

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to create organization."
          );
        }

        // --------------------------------------------------------
        // GET CREATED ORGANIZATION
        // --------------------------------------------------------

        const createdOrganization =
          data.organization ||
          data.data;

        if (
          !createdOrganization ||
          !createdOrganization._id
        ) {
          throw new Error(
            "Organization was created, but the server did not return its ID."
          );
        }

        // --------------------------------------------------------
        // SAVE ORGANIZATION ID
        // --------------------------------------------------------

        localStorage.setItem(
          ORGANIZATION_KEY,
          createdOrganization._id
        );

        // --------------------------------------------------------
        // UPDATE STATE
        // --------------------------------------------------------

        setOrganization(
          createdOrganization
        );

        setShowCreateForm(false);

        setFormData({
          name: "",
          description: "",
          industry: "",
          website: "",
          location: "",
        });

        setError("");
        setErrorType("");
      } catch (err) {
        console.error(
          "Create organization error:",
          err
        );

        setError(
          err.message ||
            "Unable to create organization."
        );

        setErrorType("server");
      } finally {
        setCreating(false);
      }
    };

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050b1c] p-8 text-white">
        <div className="flex min-h-100 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-700 border-t-blue-500" />

            <p className="text-gray-400">
              Loading organization...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // ORGANIZATION NOT AVAILABLE
  // ============================================================

  if (!organization) {
    return (
      <div className="min-h-screen bg-[#050b1c] p-8 text-white">
        <div className="mx-auto max-w-5xl">
          {/* PAGE HEADER */}

          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              Organization
            </h1>

            <p className="mt-2 text-gray-400">
              Manage your HireFlow organization.
            </p>
          </div>

          {/* ERROR */}

          {error && (
            <div
              className={`mb-6 rounded-xl border px-5 py-4 ${
                errorType === "auth"
                  ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
                  : "border-red-500/30 bg-red-500/10 text-red-300"
              }`}
            >
              <p className="font-medium">
                {error}
              </p>

              {errorType ===
                "server" && (
                <button
                  type="button"
                  onClick={
                    fetchOrganization
                  }
                  className="mt-3 underline hover:no-underline"
                >
                  Try again
                </button>
              )}
            </div>
          )}

          {/* EMPTY STATE */}

          <div className="rounded-2xl border border-white/10 bg-[#0b1228] p-10 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl">
              🏢
            </div>

            <h2 className="text-2xl font-semibold">
              No organization selected.
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-gray-400">
              Create an organization to
              manage jobs, candidates,
              applications, interviews and
              your recruitment team.
            </p>

            {/* LOGIN ERROR */}

            {errorType === "auth" ? (
              <button
                type="button"
                onClick={() => {
                  window.location.href =
                    "/login";
                }}
                className="mt-7 rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
              >
                Go to Login
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setErrorType("");
                  setShowCreateForm(true);
                }}
                className="mt-7 rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
              >
                + Create Organization
              </button>
            )}
          </div>
        </div>

        {/* ======================================================
            CREATE ORGANIZATION MODAL
        ====================================================== */}

        {showCreateForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0b1228] shadow-2xl">
              {/* MODAL HEADER */}

              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <div>
                  <h2 className="text-xl font-semibold">
                    Create Organization
                  </h2>

                  <p className="mt-1 text-sm text-gray-400">
                    Create your organization
                    to continue.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!creating) {
                      setShowCreateForm(
                        false
                      );
                      setError("");
                    }
                  }}
                  className="text-2xl text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>

              {/* FORM */}

              <form
                onSubmit={
                  handleCreateOrganization
                }
                className="space-y-5 p-6"
              >
                {error && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                {/* NAME */}

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Organization Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={
                      formData.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. HireFlow Technologies"
                    required
                    disabled={creating}
                    className="w-full rounded-xl border border-white/10 bg-[#070d20] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-blue-500 disabled:opacity-50"
                  />
                </div>

                {/* INDUSTRY */}

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Industry
                  </label>

                  <input
                    type="text"
                    name="industry"
                    value={
                      formData.industry
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Software / IT"
                    disabled={creating}
                    className="w-full rounded-xl border border-white/10 bg-[#070d20] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-blue-500 disabled:opacity-50"
                  />
                </div>

                {/* LOCATION */}

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={
                      formData.location
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Delhi, India"
                    disabled={creating}
                    className="w-full rounded-xl border border-white/10 bg-[#070d20] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-blue-500 disabled:opacity-50"
                  />
                </div>

                {/* WEBSITE */}

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Website
                  </label>

                  <input
                    type="url"
                    name="website"
                    value={
                      formData.website
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="https://example.com"
                    disabled={creating}
                    className="w-full rounded-xl border border-white/10 bg-[#070d20] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-blue-500 disabled:opacity-50"
                  />
                </div>

                {/* DESCRIPTION */}

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={
                      formData.description
                    }
                    onChange={
                      handleChange
                    }
                    rows="4"
                    placeholder="Tell us about your organization..."
                    disabled={creating}
                    className="w-full resize-none rounded-xl border border-white/10 bg-[#070d20] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-blue-500 disabled:opacity-50"
                  />
                </div>

                {/* ACTIONS */}

                <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
                  <button
                    type="button"
                    onClick={() => {
                      if (!creating) {
                        setShowCreateForm(
                          false
                        );
                        setError("");
                      }
                    }}
                    disabled={creating}
                    className="rounded-xl border border-white/10 px-5 py-3 text-gray-300 hover:bg-white/5 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={creating}
                    className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {creating
                      ? "Creating..."
                      : "Create Organization"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================
  // ORGANIZATION LOADED SUCCESSFULLY
  // ============================================================

  return (
    <div className="min-h-screen bg-[#050b1c] p-8 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Organization
          </h1>

          <p className="mt-2 text-gray-400">
            Manage your organization.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0b1228] p-7">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/20 text-2xl">
              🏢
            </div>

            <div>
              <h2 className="text-2xl font-semibold">
                {organization.name}
              </h2>

              {organization.industry && (
                <p className="mt-1 text-gray-400">
                  {organization.industry}
                </p>
              )}

              {organization.location && (
                <p className="mt-2 text-sm text-gray-500">
                  📍{" "}
                  {organization.location}
                </p>
              )}
            </div>
          </div>

          {organization.description && (
            <p className="mt-6 border-t border-white/10 pt-5 leading-7 text-gray-400">
              {organization.description}
            </p>
          )}

          {organization.website && (
            <a
              href={
                organization.website
              }
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-block text-blue-400 hover:text-blue-300"
            >
              Visit Website →
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Organization;

