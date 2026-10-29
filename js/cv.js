/**
 * CV Page Bootstrap & Theme Controller
 * Clean Architecture - Presentation Layer
 */

import { THEME_STORAGE_KEY } from "./core/constants.js";

const applyTheme = (theme) => {
    const isLight = theme === "light";
    document.body.classList.toggle("light-mode", isLight);
    const toggle = document.querySelector(".theme-toggle");
    if (toggle) {
        toggle.textContent = isLight ? "Dark" : "Light";
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
