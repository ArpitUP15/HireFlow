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
    <div className="overflow-x-auto">
      <table className="w-full min-w-175">
        <thead>
          <tr className="border-b bg-gray-50 text-left">
            <th className="px-5 py-4 text-sm font-semibold text-gray-600">
              Member
            </th>

            <th className="px-5 py-4 text-sm font-semibold text-gray-600">
              Role
            </th>

            <th className="px-5 py-4 text-sm font-semibold text-gray-600">
              Status
            </th>

            <th className="px-5 py-4 text-right text-sm font-semibold text-gray-600">
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
                className="border-b last:border-0"
              >
                <td className="px-5 py-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {user?.firstName}{" "}
                      {user?.lastName}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs text-blue-600">
                          You
                        </span>
                      )}
                    </p>

                    <p className="text-sm text-gray-500">
                      {user?.email}
                    </p>
                  </div>
                </td>

                <td className="px-5 py-4">
                  {isOwner ? (
                    <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
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
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
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
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
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
        <div className="py-12 text-center text-gray-500">
          No team members found.
        </div>
      )}
    </div>
  );
};

export default MemberTable;