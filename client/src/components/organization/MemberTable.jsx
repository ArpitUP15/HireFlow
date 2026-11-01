import { Trash2 } from "lucide-react";

import RoleSelect from "./RoleSelect";

const MemberTable = ({
  members,
  currentUserId,
  onRoleChange,
  onRemove,
  canManage,
}) => {
  return (
    <div className="overflow-x-auto bg-surface/90">
      <table className="w-full min-w-175">
        <thead>
          <tr className="border-b border-border bg-background text-left">
            <th className="px-5 py-4 text-sm font-semibold text-text">
              Member
            </th>

            <th className="px-5 py-4 text-sm font-semibold text-text">
              Role
            </th>

            <th className="px-5 py-4 text-sm font-semibold text-text">
              Status
            </th>

            <th className="px-5 py-4 text-right text-sm font-semibold text-text">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {members.map((member) => {
            const user = member.user;

            const isOwner = member.role === "owner";

            const isCurrentUser = user?._id === currentUserId;

            return (
              <tr
                key={member._id}
                className="border-b border-border last:border-0"
              >
                <td className="px-5 py-4">
                  <div>
                    <p className="font-medium text-text">
                      {user?.firstName} {user?.lastName}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs text-primary">
                          You
                        </span>
                      )}
                    </p>

                    <p className="text-sm text-muted">{user?.email}</p>
                  </div>
                </td>

                <td className="px-5 py-4">
                  {isOwner ? (
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      Owner
                    </span>
                  ) : (
                    <RoleSelect
                      value={member.role}
                      disabled={!canManage}
                      onChange={(role) => onRoleChange(member._id, role)}
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
                        member.status === "active"
                          ? "border border-secondary/30 bg-secondary/10 text-secondary-readable"
                          : "border border-accent/30 bg-accent/10 text-accent-readable"
                      }
                    `}
                  >
                    {member.status}
                  </span>
                </td>

                <td className="px-5 py-4 text-right">
                  {!isOwner && canManage && (
                    <button
                      onClick={() => onRemove(member._id)}
                      className="rounded-lg p-2 text-accent-readable hover:bg-accent/10"
                      title="Remove member"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {members.length === 0 && (
        <div className="py-12 text-center text-muted">
          No team members found.
        </div>
      )}
    </div>
  );
};

export default MemberTable;
