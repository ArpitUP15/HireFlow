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
          rounded-lg
          border
          bg-slate-950
          px-3.5
          py-2.5
          text-slate-100
          placeholder:text-slate-500
          outline-none
          transition
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-500/20
          ${
            error
              ? "border-red-500"
              : "border-slate-700"
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