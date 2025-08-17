import { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "system"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Apply the dark class if the theme is 'dark' or if it's 'system' and the system prefers dark.
    if (theme === "dark" || (theme === "system" && isDark)) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    const newTheme = root.classList.contains("dark") ? "light" : "dark";
    setTheme(newTheme);
    // Save the user's explicit choice to local storage
    localStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
