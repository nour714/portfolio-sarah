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
import { initProjectFilters, initProjectShare, initProjectModal } from "./modules/projects.js";
import { initCertificateFilters, initCertificateModal } from "./modules/certificates.js";
import {
    initScrollReveal,
    refreshScrollReveal,
    initScrollProgressBar,
    initCustomCursor,
    initBackToTop,
    initCounterAnimation
} from "./modules/animations.js";
import { initConstellation } from "./modules/constellation.js";
import { initContactFormFallback } from "./modules/contact.js";
import { initPublicPortfolio } from "./services/firebase.service.js";
import { initAiIntroScreen } from "./modules/intro.js";

const boot = () => {
    // 1. Data-Driven Hydration (Render from portfolioData)
    safelyInit(() => applyAdminState(portfolioData));

    // 2. UI & Interaction Modules
    safelyInit(initThemeToggle);
    safelyInit(initMenu);
    safelyInit(initHeroRoleTyping);
    safelyInit(initHeroAvatarFallback);
    safelyInit(initProjectFilters);
    safelyInit(initProjectShare);
    safelyInit(initCertificateFilters);
    safelyInit(initCertificateModal);
    safelyInit(initScrollReveal);
    safelyInit(initConstellation);
    safelyInit(() => initPublicPortfolio(refreshScrollReveal));
    safelyInit(initScrollProgressBar);
    safelyInit(initCustomCursor);
    safelyInit(initBackToTop);
    safelyInit(initCounterAnimation);
    safelyInit(initProjectModal);
    safelyInit(initContactFormFallback);
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        boot();
        initAiIntroScreen();
    });
} else {
    boot();
    initAiIntroScreen();
}
