import { useState, useEffect, useCallback } from "react";

/**
 * @description Represents the user's chosen theme setting.
 * 'system' means the theme follows the OS preference.
 */
type ThemePreference = "light" | "dark" | "system";

/**
 * @description Represents the actual theme applied to the UI (resolved from ThemePreference).
 */
type AppliedTheme = "light" | "dark";

/**
 * @constant {string} THEME_STORAGE_KEY
 * @description Key used to store the theme preference in localStorage.
 */
const THEME_STORAGE_KEY = "themePreference";

/**
 * Gets the current system theme preference (light or dark).
 * @returns {AppliedTheme} The detected system theme ('light' or 'dark').
 */
const getSystemTheme = (): AppliedTheme => {
  // Check if window.matchMedia is supported and if dark mode is preferred
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
};

/**
 * @hook useTheme
 * @description A custom hook to manage the application's theme (light/dark/system).
 * It handles reading/writing the preference to localStorage, detecting system preferences,
 * and applying the correct theme class to the HTML root element.
 * @returns {[ThemePreference, (theme: ThemePreference) => void]} A tuple containing:
 *  - The current theme preference state ('light', 'dark', or 'system').
 *  - A function to update the theme preference.
 */
export const useTheme = (): [
  ThemePreference,
  (theme: ThemePreference) => void
] => {
  const [themePreference, setThemePreference] = useState<ThemePreference>(
    () => {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      // Ensure the stored value is a valid ThemePreference, otherwise default to 'system'
      if (
        storedTheme === "light" ||
        storedTheme === "dark" ||
        storedTheme === "system"
      ) {
        return storedTheme;
      }
      return "system";
    }
  );

  /**
   * Applies the given theme ('light' or 'dark') to the document's root element
   * by adding the corresponding class name.
   * @param {AppliedTheme} theme - The theme ('light' or 'dark') to apply.
   */
  const applyTheme = useCallback((theme: AppliedTheme) => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    // Optional: Set color-scheme style for better browser integration
    root.style.setProperty("color-scheme", theme);
  }, []);

  // Effect runs when themePreference changes or on initial mount
  useEffect(
    () => {
      let actualTheme: AppliedTheme;

      if (themePreference === "system") {
        actualTheme = getSystemTheme();
      } else {
        actualTheme = themePreference;
      }

      applyTheme(actualTheme);

      // Listener for changes in the OS theme preference
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      /**
       * Handles changes detected in the system's color scheme preference.
       * @param {MediaQueryListEvent} e - The media query event.
       */
      const handleSystemChange = (e: MediaQueryListEvent) => {
        if (themePreference === "system") {
          applyTheme(e.matches ? "dark" : "light");
        }
      };

      mediaQuery.addEventListener("change", handleSystemChange);

      // Persist the user's *preference* (not the resolved theme) to localStorage
      localStorage.setItem(THEME_STORAGE_KEY, themePreference);

      // Cleanup listener on unmount or when themePreference changes
      return () => {
        mediaQuery.removeEventListener("change", handleSystemChange);
      };
    },
    // Dependencies for the effect
    [themePreference, applyTheme]
  );

  return [themePreference, setThemePreference];
};
