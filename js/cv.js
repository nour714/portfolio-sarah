/**
 * CV Page Bootstrap
 * Clean Architecture - Presentation Layer
 */

import { THEME_STORAGE_KEY } from "./core/constants.js";

const applyPreferredTheme = () => {
    try {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem("preferred-theme");
        if (savedTheme === "light") {
            document.body.classList.add("light-mode");
        } else {
            document.body.classList.remove("light-mode");
        }
    } catch (_error) {
        // Fallback for sandboxed environments
    }
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyPreferredTheme);
} else {
    applyPreferredTheme();
}
