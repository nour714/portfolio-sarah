/**
 * Admin Application Entry Point (Content Studio)
 * Clean Architecture - Admin Bootstrap Layer
 */

import { safelyInit } from "./core/utils.js";
import { initThemeToggle } from "./modules/theme.js";
import { applyAdminState } from "./core/state.js";
import { portfolioData } from "./data/portfolio-data.js";
import { initAdminDashboard } from "./admin/admin-dashboard.js";

const bootAdmin = () => {
    // 1. Hydrate hidden portfolio scratchpad DOM with baseline portfolioData
    safelyInit(() => applyAdminState(portfolioData));
    
    // 2. Initialize Theme Toggle
    safelyInit(initThemeToggle);

    // 3. Initialize Admin Studio Dashboard (Auth, CMS forms, live iframe preview)
    safelyInit(initAdminDashboard);
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootAdmin);
} else {
    bootAdmin();
}

