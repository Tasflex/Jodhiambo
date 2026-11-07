"use client";

import { FaMoon, FaSun } from "react-icons/fa6";
import { THEME_STORAGE_KEY } from "./theme-script";

export function ThemeToggle({ className }: { className?: string }) {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* storage unavailable: theme still applies for this visit */
    }
  }

  return (
    <button type="button" className={className} onClick={toggle} aria-label="Toggle dark mode">
      <FaMoon className="theme-icon-moon" aria-hidden />
      <FaSun className="theme-icon-sun" aria-hidden />
    </button>
  );
}
