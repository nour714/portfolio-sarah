/**
 * Admin Application Entry Point (Content Studio)
 * Clean Architecture - Admin Bootstrap Layer
 */

import { safelyInit } from "./core/utils.js";
import { initThemeToggle } from "./modules/theme.js";
import { initMenu } from "./modules/navigation.js";
import { initHeroRoleTyping, initHeroAvatarFallback } from "./modules/hero.js";
import { initProjectFilters, initProjectShare, initProjectModal } from "./modules/projects.js";
import {
    initScrollReveal,
    initScrollProgressBar,
    initBackToTop,
    initCounterAnimation
} from "./modules/animations.js";
import { initConstellation } from "./modules/constellation.js";
import { initContactFormFallback } from "./modules/contact.js";
import { applyAdminState } from "./core/state.js";
import { portfolioData } from "./data/portfolio-data.js";
import { initAdminDashboard } from "./admin/admin-dashboard.js";

const bootAdmin = () => {
    // Hydrate DOM with portfolioData
    safelyInit(() => applyAdminState(portfolioData));
    safelyInit(initThemeToggle);
    safelyInit(initMenu);
    safelyInit(initHeroRoleTyping);
    safelyInit(initHeroAvatarFallback);
    safelyInit(initProjectFilters);
    safelyInit(initProjectShare);
    safelyInit(initScrollReveal);
    safelyInit(initConstellation);
    safelyInit(initAdminDashboard);
    safelyInit(initScrollProgressBar);
    safelyInit(initBackToTop);
    safelyInit(initCounterAnimation);
    safelyInit(initProjectModal);
    safelyInit(initContactFormFallback);
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootAdmin);
} else {
    bootAdmin();
}
