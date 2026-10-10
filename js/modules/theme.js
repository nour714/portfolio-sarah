/**
 * Theme Controller Module
 * Clean Architecture - Presentation / UI Layer
 */

import { THEME_STORAGE_KEY } from "../core/constants.js";
import { emitThemeChange } from "../core/utils.js";
import { storageService } from "../services/storage.service.js";

export const applyTheme = (theme) => {
    const isLightTheme = theme === "light";
    document.body.classList.toggle("light-mode", isLightTheme);
    const themeToggle = document.querySelector(".theme-toggle");
    if (themeToggle) {
        themeToggle.textContent = isLightTheme ? "Dark" : "Light";
        themeToggle.setAttribute("aria-pressed", String(isLightTheme));
        themeToggle.setAttribute("aria-label", isLightTheme ? "Switch to dark mode" : "Switch to light mode");
    }
    emitThemeChange();
};

export const initThemeToggle = () => {
    const themeToggle = document.querySelector(".theme-toggle");
    const savedTheme = storageService.getItem(THEME_STORAGE_KEY, "dark");

    applyTheme(savedTheme || "dark");
    if (!themeToggle) return;
    if (window.__themeToggleBound) return;
    window.__themeToggleBound = true;

    themeToggle.addEventListener("click", () => {
        const nextTheme = document.body.classList.contains("light-mode") ? "dark" : "light";
        applyTheme(nextTheme);
        storageService.setItem(THEME_STORAGE_KEY, nextTheme);
    });
};
