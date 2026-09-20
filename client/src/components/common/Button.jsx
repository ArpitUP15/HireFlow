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
      "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20",
    secondary:
      "bg-slate-800 hover:bg-slate-700 text-slate-100",
    danger:
      "bg-red-600 hover:bg-red-500 text-white",
    outline:
      "border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-100",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        px-4 py-2.5
        rounded-lg
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