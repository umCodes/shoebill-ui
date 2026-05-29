import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ThemeContext, type Theme } from "../contexts/ThemeContext";

const STORAGE_KEY = "app-theme";

function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // localStorage may be unavailable (SSR, private browsing restrictions, etc.)
  }

  // Fall back to the OS preference
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

interface ThemeProviderProps {
  children: ReactNode;
  /** Override the default storage key ("app-theme"). */
  storageKey?: string;
}

export function ThemeProvider({
  children,
  storageKey = STORAGE_KEY,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  // Apply the theme to <html data-theme="..."> and persist it
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    console.log(document.documentElement);
    
    try {
        localStorage.setItem(storageKey, theme);
    } catch {
      // Silently ignore write failures
    }
  }, [theme, storageKey]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}