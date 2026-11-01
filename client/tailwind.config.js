export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      'text': 'var(--text)',
      'background': 'var(--background)',
      'primary': 'var(--primary)',
      'secondary': 'var(--secondary)',
      'accent': 'var(--accent)',
      surface: 'var(--surface)',
      'surface-hover': 'var(--surface-hover)',
      border: 'var(--border)',
      muted: 'var(--muted)',
      overlay: 'var(--overlay)',
      'on-accent': 'var(--on-accent)',
      'secondary-readable': 'var(--secondary-readable)',
      'accent-readable': 'var(--accent-readable)',
    },

    extend: {
      fontFamily: {
        sans: ["Public Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "4px",
        xl: "8px",
        "2xl": "8px",
      },
    },
  },
};
