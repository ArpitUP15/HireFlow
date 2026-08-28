const RoleSelect = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <select
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
      disabled={disabled}
      className="
        rounded-lg
        border
        border-gray-300
        bg-white
        px-3
        py-2
        text-sm
        outline-none
        focus:ring-2
        focus:ring-blue-500/20
        disabled:bg-gray-100
      "
    >
      <option value="hr_admin">
        HR Admin
      </option>

      <option value="recruiter">
        Recruiter
      </option>

      <option value="interviewer">
        Interviewer
      </option>
    </select>
  );
};

export default RoleSelect;