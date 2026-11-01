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
      "bg-primary text-background hover:brightness-90 dark:hover:brightness-110",
    secondary: "bg-transparent text-text hover:bg-primary/10",
    danger:
      "bg-accent text-on-accent hover:brightness-90 dark:hover:brightness-110",
    outline:
      "border border-border bg-background text-text hover:bg-primary/10",
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
        transition-opacity
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
