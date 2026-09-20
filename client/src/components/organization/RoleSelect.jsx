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
        border-slate-700
        bg-slate-950
        px-3
        py-2
        text-sm
        text-slate-100
        outline-none
        focus:border-blue-500
        focus:ring-2
        focus:ring-blue-500/20
        disabled:bg-slate-800
        disabled:text-slate-400
      "
    >
      <option value="hr_admin" className="bg-slate-900 text-slate-100">
        HR Admin
      </option>

      <option value="recruiter" className="bg-slate-900 text-slate-100">
        Recruiter
      </option>

      <option value="interviewer" className="bg-slate-900 text-slate-100">
        Interviewer
      </option>
    </select>
  );
};

export default RoleSelect;