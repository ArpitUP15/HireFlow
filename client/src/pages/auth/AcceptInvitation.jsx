import {
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import {
  CheckCircle,
  XCircle,
} from "lucide-react";
import Button from "../../components/common/Button";

import {
  acceptInvitation,
} from "../../services/organizationService";

const AcceptInvitation = () => {
  const [searchParams] =
    useSearchParams();

  const navigate =
    useNavigate();

  const [status, setStatus] =
    useState("loading");

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    const acceptInvite = async () => {
      const token =
        searchParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage(
          "Invalid invitation link."
        );
        return;
      }

      try {
        const data =
          await acceptInvitation(token);

        setStatus("success");
        setMessage(
          data.message ||
            "Invitation accepted successfully!"
        );

        setTimeout(() => {
          navigate("/organization");
        }, 2000);
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Unable to accept invitation."
        );
      }
    };

    acceptInvite();
  }, [searchParams, navigate]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <h2 className="text-xl font-semibold">
            Accepting invitation...
          </h2>

          <p className="mt-2 text-gray-500">
            Please wait while we add you to the organization.
          </p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
            ✓
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Invitation Accepted!
          </h1>

          <p className="mt-3 text-gray-500">
            {message}
          </p>

          <p className="mt-4 text-sm text-gray-400">
            Redirecting to your organization...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">
          ✕
        </div>

        <h1 className="text-2xl font-bold">
          Invitation Failed
        </h1>

        <p className="mt-3 text-red-500">
          {message}
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default AcceptInvitation;