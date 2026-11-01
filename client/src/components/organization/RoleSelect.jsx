const RoleSelect = ({ value, onChange, disabled = false }) => {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      className="\n        rounded-lg\n        border\n        border-border\n        bg-background\n        px-3\n        py-2\n        text-sm\n        text-text\n        outline-none\n        focus:border-primary\n        focus:ring-2\n        focus:ring-primary/20\n        disabled:bg-surface-hover\n        disabled:text-muted\n      "
    >
      <option value="hr_admin" className="bg-surface text-text">
        HR Admin
      </option>

      <option value="recruiter" className="bg-surface text-text">
        Recruiter
      </option>

      <option value="interviewer" className="bg-surface text-text">
        Interviewer
      </option>
    </select>
  );
};

export default RoleSelect;
