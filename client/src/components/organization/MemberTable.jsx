import {
  Trash2,
} from "lucide-react";

import RoleSelect from "./RoleSelect";

const MemberTable = ({
  members,
  currentUserId,
  onRoleChange,
  onRemove,
  canManage,
}) => {
  return (
    <div className="overflow-x-auto bg-slate-900/90">
      <table className="w-full min-w-175">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-950 text-left">
            <th className="px-5 py-4 text-sm font-semibold text-slate-300">
              Member
            </th>

            <th className="px-5 py-4 text-sm font-semibold text-slate-300">
              Role
            </th>

            <th className="px-5 py-4 text-sm font-semibold text-slate-300">
              Status
            </th>

            <th className="px-5 py-4 text-right text-sm font-semibold text-slate-300">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {members.map((member) => {
            const user =
              member.user;

            const isOwner =
              member.role ===
              "owner";

            const isCurrentUser =
              user?._id ===
              currentUserId;

            return (
              <tr
                key={member._id}
                className="border-b border-slate-800 last:border-0"
              >
                <td className="px-5 py-4">
                  <div>
                    <p className="font-medium text-slate-100">
                      {user?.firstName}{" "}
                      {user?.lastName}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs text-blue-300">
                          You
                        </span>
                      )}
                    </p>

                    <p className="text-sm text-slate-400">
                      {user?.email}
                    </p>
                  </div>
                </td>

                <td className="px-5 py-4">
                  {isOwner ? (
                    <span className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">
                      Owner
                    </span>
                  ) : (
                    <RoleSelect
                      value={
                        member.role
                      }
                      disabled={
                        !canManage
                      }
                      onChange={(
                        role
                      ) =>
                        onRoleChange(
                          member._id,
                          role
                        )
                      }
                    />
                  )}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      font-medium
                      ${
                        member.status ===
                        "active"
                          ? "border border-green-400/30 bg-green-500/10 text-green-300"
                          : "border border-red-400/30 bg-red-500/10 text-red-300"
                      }
                    `}
                  >
                    {member.status}
                  </span>
                </td>

                <td className="px-5 py-4 text-right">
                  {!isOwner &&
                    canManage && (
                      <button
                        onClick={() =>
                          onRemove(
                            member._id
                          )
                        }
                        className="rounded-lg p-2 text-red-300 hover:bg-red-500/10"
                        title="Remove member"
                      >
                        <Trash2
                          size={18}
                        />
                      </button>
                    )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {members.length === 0 && (
        <div className="py-12 text-center text-slate-400">
          No team members found.
        </div>
      )}
    </div>
  );
};

export default MemberTable;