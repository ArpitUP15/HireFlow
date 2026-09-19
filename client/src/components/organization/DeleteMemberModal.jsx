import { useState } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";

const DeleteMemberModal = ({
  isOpen,
  onClose,
  member,
  onConfirm,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !member) {
    return null;
  }

  const memberName =
    `${member.user?.firstName || ""} ${
      member.user?.lastName || ""
    }`.trim() ||
    member.user?.email ||
    "this member";

  const handleConfirm = async () => {
    try {
      setError("");
      setLoading(true);

      await onConfirm(member);

      onClose();
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to remove member."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500/10">
              <AlertTriangle
                size={22}
                className="text-red-400"
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Remove Member
              </h2>

              <p className="text-sm text-slate-400">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="mt-6">
          <p className="text-sm leading-6 text-slate-300">
            Are you sure you want to remove{" "}
            <span className="font-semibold text-white">
              {memberName}
            </span>{" "}
            from this organization?
          </p>

          {member.user?.email && (
            <p className="mt-2 text-sm text-slate-500">
              {member.user.email}
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="flex min-w-30 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />

                Removing...
              </>
            ) : (
              "Remove Member"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteMemberModal;