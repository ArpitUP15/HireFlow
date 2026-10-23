import {
  Moon,
  Sun,
} from "lucide-react";

import {
  useTheme,
} from "../../context/useTheme";

const ThemeToggle = ({
  className = "",
}) => {
  const {
    theme,
    toggleTheme,
  } = useTheme();

  const nextTheme =
    theme === "light" ? "dark" : "light";
  const Icon =
    theme === "light" ? Moon : Sun;

  return (
    <button
      type="button"
      aria-label={`Switch to ${nextTheme} mode`}
      aria-pressed={theme === "dark"}
      title={`Switch to ${nextTheme} mode`}
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-primary transition hover:bg-neutral ${className}`}
    >
      <Icon size={18} aria-hidden="true" />
      <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
    </button>
  );
};

export default ThemeToggle;
