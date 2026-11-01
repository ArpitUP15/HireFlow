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
          className="block text-sm font-medium text-text"
        >
          {label}
          {required && <span className="text-accent-readable ml-1">*</span>}
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
          text-text
          placeholder:text-muted
          outline-none
          transition-opacity
          focus:border-secondary
          focus:ring-2
          focus:ring-secondary/20
          ${error ? "border-accent" : "border-border"}
        `}
      />

      {error && <p className="text-sm text-accent-readable">{error}</p>}
    </div>
  );
};

export default Input;
