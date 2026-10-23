const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
}) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-slate-200"
        >
          {label}
          {required && (
            <span className="text-red-400 ml-1">
              *
            </span>
          )}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`
          w-full
          rounded-sm
          border
          bg-surface
          px-3.5
          py-2.5
          text-primary
          placeholder:text-secondary
          outline-none
          transition
          focus:border-secondary
          focus:ring-2
          focus:ring-secondary/20
          ${
            error
              ? "border-red-500"
              : "border-border"
          }
        `}
      />

      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;