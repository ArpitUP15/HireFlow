import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/useTheme";

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark mode"
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      onClick={toggleTheme}
      className={`relative inline-flex h-9 w-16 shrink-0 items-center rounded-full border border-border bg-surface transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${className}`}
    >
      {/* Sliding thumb */}
      <span
        aria-hidden="true"
        className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow-sm transition-transform duration-300 ease-in-out motion-reduce:transition-none ${
          isDark ? "translate-x-7" : "translate-x-0"
        }`}
      >
        {isDark ? <Moon size={14} /> : <Sun size={14} />}
      </span>

      {/* Inactive icon */}
      <span
        aria-hidden="true"
        className={`absolute text-muted transition-opacity duration-200 motion-reduce:transition-none ${
          isDark ? "left-2 opacity-70" : "right-2 opacity-70"
        }`}
      >
        {isDark ? <Sun size={14} /> : <Moon size={14} />}
      </span>
    </button>
  );
};

export default ThemeToggle;