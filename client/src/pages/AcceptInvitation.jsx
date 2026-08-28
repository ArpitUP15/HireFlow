import {
  useEffect,
  useState,
} from "react";

import {
  CheckCircle,
  XCircle,
} from "lucide-react";

import Button from "../components/common/Button";

import {
  acceptInvitation,
} from "../services/organizationService";

const AcceptInvitation = () => {
  const [status, setStatus] =
    useState("loading");

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    const accept = async () => {
      const params =
        new URLSearchParams(
          window.location.search
        );

      const token =
        params.get("token");

      if (!token) {
        setStatus("error");
        setMessage(
          "Invitation token is missing."
        );
        return;
      }

      try {
        const data =
          await acceptInvitation(
            token
          );

        setStatus("success");
        setMessage(
          data.message ||
            "Invitation accepted successfully."
        );
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Unable to accept invitation."
        );
      }
    };

    accept();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        {status === "loading" && (
          <>
            <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

            <h1 className="text-xl font-bold">
              Accepting invitation...
            </h1>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle
              size={52}
              className="mx-auto mb-5 text-green-500"
            />

            <h1 className="text-2xl font-bold">
              Welcome to the team!
            </h1>

            <p className="mt-3 text-gray-500">
              {message}
            </p>

            <Button
              className="mt-6 w-full"
              onClick={() =>
                (window.location.href =
                  "/organization")
              }
            >
              Go to Organization
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle
              size={52}
              className="mx-auto mb-5 text-red-500"
            />

            <h1 className="text-2xl font-bold">
              Invitation failed
            </h1>

            <p className="mt-3 text-red-500">
              {message}
            </p>

            <Button
              variant="secondary"
              className="mt-6 w-full"
              onClick={() =>
                (window.location.href =
                  "/")
              }
            >
              Go Home
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default AcceptInvitation;