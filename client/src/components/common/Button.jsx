const Button = ({
  children,
  type = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  onClick,
  className = "",
}) => {
  const styles = {
    primary:
      "bg-tertiary hover:bg-neutral text-on-tertiary",
    secondary:
      "bg-transparent hover:bg-surface text-secondary",
    danger:
      "bg-red-600 hover:bg-red-500 text-white",
    outline:
      "border border-border bg-surface hover:bg-neutral text-primary",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        px-5 py-3
        rounded-sm
        font-medium
        transition
        duration-200
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${styles[variant]}
        ${className}
      `}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
};

export default Button;