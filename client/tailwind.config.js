export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'text': '#e4f0e2',
         'background': '#0e180c',
        'primary': '#a6cd9c',
         'secondary': '#356269',
           'accent': '#7091b6',
},
      fontFamily: {
        sans: ['"Public Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "4px",
        xl: "8px",
        "2xl": "8px",
      },
      boxShadow: {
        sm: "0 1px 2px color-mix(in srgb, var(--color-border) 12%, transparent)",
        md: "0 1px 4px color-mix(in srgb, var(--color-border) 14%, transparent)",
        lg: "0 2px 6px color-mix(in srgb, var(--color-border) 16%, transparent)",
        xl: "0 2px 8px color-mix(in srgb, var(--color-border) 18%, transparent)",
        "2xl": "0 4px 12px color-mix(in srgb, var(--color-border) 18%, transparent)",
      },
    },
  },
};
