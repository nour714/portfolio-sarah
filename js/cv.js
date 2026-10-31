/**
 * CV Page Bootstrap & Theme Controller
 * Clean Architecture - Presentation Layer
 */

import { THEME_STORAGE_KEY } from "./core/constants.js";

const SUN_ICON = '<svg class="theme-icon theme-icon-sun" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';

const MOON_ICON = '<svg class="theme-icon theme-icon-moon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';

const applyTheme = (theme) => {
    const isLight = theme === "light";
    document.body.classList.toggle("light-mode", isLight);
    const toggle = document.querySelector(".theme-toggle");
    if (toggle) {
        toggle.innerHTML = `${isLight ? MOON_ICON : SUN_ICON}<span>${isLight ? "Dark mode" : "Light mode"}</span>`;
        toggle.setAttribute("aria-pressed", String(isLight));
        toggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
    }
};

const initTheme = () => {
    let saved = "dark";
    try {
        saved = localStorage.getItem(THEME_STORAGE_KEY) || "dark";
    } catch (_) {}
    applyTheme(saved);

    const toggle = document.querySelector(".theme-toggle");
    if (toggle) {
        toggle.addEventListener("click", () => {
            const next = document.body.classList.contains("light-mode") ? "dark" : "light";
            applyTheme(next);
            try {
                localStorage.setItem(THEME_STORAGE_KEY, next);
            } catch (_) {}
        });
    }
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTheme);
} else {
    initTheme();
}
