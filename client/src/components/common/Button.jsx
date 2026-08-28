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
      "bg-blue-600 hover:bg-blue-700 text-white",
    secondary:
      "bg-gray-100 hover:bg-gray-200 text-gray-800",
    danger:
      "bg-red-600 hover:bg-red-700 text-white",
    outline:
      "border border-gray-300 hover:bg-gray-50 text-gray-700",
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