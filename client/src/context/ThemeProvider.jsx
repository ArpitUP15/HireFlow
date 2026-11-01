import { useLayoutEffect, useMemo, useState } from "react";

import { ThemeContext } from "./ThemeContext";

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() =>
    window.localStorage.getItem("hireflow-theme") === "dark" ? "dark" : "light",
  );

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.removeAttribute("data-theme");
    const browserTheme = document.querySelector('meta[name="theme-color"]');
    browserTheme?.setAttribute(
      "content",
      getComputedStyle(root).getPropertyValue("--background").trim(),
    );
    window.localStorage.setItem("hireflow-theme", theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () =>
        setTheme((currentTheme) =>
          currentTheme === "light" ? "dark" : "light",
        ),
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
