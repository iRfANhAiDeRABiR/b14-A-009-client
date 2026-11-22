"use client";

import * as React from "react";

export const THEME_STORAGE_KEY = "gearnest-theme";
const THEME_EVENT = "gearnest-theme-change";

export const ThemeContext = React.createContext({
  theme: "light",
  isDark: false,
  setTheme: () => {},
  toggleTheme: () => {},
});

function applyDomTheme(nextTheme) {
  if (typeof document === "undefined") return;
  const resolved = nextTheme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = resolved;
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

function readStoredTheme() {
  if (typeof window === "undefined") return "light";

  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "dark" || stored === "light") {
      return stored;
    }
  } catch {
    // Ignore storage restriction gracefully.
  }

  if (typeof document !== "undefined") {
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  }
  return "light";
}

function subscribeThemeStore(callback) {
  if (typeof window === "undefined") return () => {};

  const handleStorage = (event) => {
    if (!event.key || event.key === THEME_STORAGE_KEY) {
      applyDomTheme(readStoredTheme());
      callback();
    }
  };

  const handleCustomChange = () => {
    callback();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(THEME_EVENT, handleCustomChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(THEME_EVENT, handleCustomChange);
  };
}

export function ThemeProvider({ children }) {
  const theme = React.useSyncExternalStore(
    subscribeThemeStore,
    readStoredTheme,
    () => "light"
  );

  React.useEffect(() => {
    applyDomTheme(theme);
  }, [theme]);

  const setTheme = React.useCallback((nextTheme) => {
    const resolved = nextTheme === "dark" ? "dark" : "light";
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, resolved);
    } catch {
      // Ignore storage restriction gracefully.
    }
    applyDomTheme(resolved);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(THEME_EVENT));
    }
  }, []);

  const toggleTheme = React.useCallback(() => {
    const current = readStoredTheme();
    setTheme(current === "dark" ? "light" : "dark");
  }, [setTheme]);

  const value = React.useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      setTheme,
      toggleTheme,
    }),
    [setTheme, theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
