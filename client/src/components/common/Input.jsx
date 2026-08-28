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
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1">
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
          px-3.5
          py-2.5
          outline-none
          transition
          focus:ring-2
          focus:ring-blue-500/20
          ${
            error
              ? "border-red-500"
              : "border-gray-300"
          }
        `}
      />

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;