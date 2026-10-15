/**
 * Main Application Entry Point (Public Portfolio)
 * Clean Architecture - Application Bootstrap Layer
 */

import { safelyInit } from "./core/utils.js";
import { applyAdminState } from "./core/state.js";
import { portfolioData } from "./data/portfolio-data.js";
import { initThemeToggle } from "./modules/theme.js";
import { initMenu } from "./modules/navigation.js";
import { initHeroRoleTyping, initHeroAvatarFallback } from "./modules/hero.js";
import { initMlBackground } from "./modules/ml-background.js";
import { initProjectFilters, initProjectShare, initProjectModal, refreshProjectScrollInteractions } from "./modules/projects.js";
import { initCertificateFilters, initCertificateModal, refreshCertificateScrollInteractions } from "./modules/certificates.js";
import {
    initLenis,
    initHeroCinematicEntrance,
    initScrollReveal,
    refreshScrollReveal,
    initScrollProgressBar,
    initCustomCursor,
    initBackToTop,
    initCounterAnimation,
    initMagnetic,
    initCard3DTilt
} from "./modules/animations.js";
import { initConstellation } from "./modules/constellation.js";
import { initContactFormFallback } from "./modules/contact.js";
import { initPublicPortfolio } from "./services/firebase.service.js";

const boot = () => {
    // 1. Data-Driven Hydration (Render from portfolioData)
    safelyInit(() => applyAdminState(portfolioData));

    // 2. Lenis Smooth Scroll Engine
    safelyInit(initLenis);

    // 3. UI & Interaction Modules
    safelyInit(initThemeToggle);
    safelyInit(initMenu);
    safelyInit(initHeroRoleTyping);
    safelyInit(initMlBackground);
    safelyInit(initHeroAvatarFallback);
    safelyInit(initHeroCinematicEntrance);
    safelyInit(initProjectFilters);
    safelyInit(refreshProjectScrollInteractions);
    safelyInit(initProjectShare);
    safelyInit(initCertificateFilters);
    safelyInit(refreshCertificateScrollInteractions);
    safelyInit(initCertificateModal);
    safelyInit(initScrollReveal);
    safelyInit(initConstellation);
    safelyInit(() => initPublicPortfolio(refreshScrollReveal));
    safelyInit(initScrollProgressBar);
    safelyInit(initCustomCursor);
    safelyInit(initBackToTop);
    safelyInit(initCounterAnimation);
    safelyInit(initMagnetic);
    safelyInit(initCard3DTilt);
    safelyInit(initProjectModal);
    safelyInit(initContactFormFallback);
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
} else {
    boot();
}
