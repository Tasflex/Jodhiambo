"use client";

import { FaMoon, FaSun } from "react-icons/fa6";
import { THEME_STORAGE_KEY } from "./theme-script";

export function ThemeToggle({ className, label }: { className?: string; label?: string }) {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";

    // Cross-fade colours only while switching, so normal hovers stay snappy.
    root.classList.add("theme-transition");
    root.dataset.theme = next;
    window.setTimeout(() => root.classList.remove("theme-transition"), 400);

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
      {label && <span>{label}</span>}
    </button>
  );
}
