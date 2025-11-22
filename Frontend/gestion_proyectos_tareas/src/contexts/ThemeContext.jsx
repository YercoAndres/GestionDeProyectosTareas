import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
});

const THEME_STORAGE_KEY = "projecttask-theme";

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") {
      return "dark";
    }
    return localStorage.getItem(THEME_STORAGE_KEY) || "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-dark", "theme-light");
    root.classList.add(theme === "light" ? "theme-light" : "theme-dark");
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () =>
        setTheme((prev) => (prev === "light" ? "dark" : "light")),
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

