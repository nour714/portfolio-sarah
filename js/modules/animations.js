/**
 * UI Animations & Interactions Master Module
 * Clean Architecture - Presentation / UI Animations Layer
 * 
 * Re-exports modular animation engines:
 * - lenis-scroll.js: Lenis smooth scroll engine
 * - custom-cursor.js: MacBook macOS interactive cursor
 * - scroll-effects.js: Scroll progress bar, back-to-top, magnetic buttons, 3D card tilt
 * - reveals.js: Word-mask splitting, stats counter animations, ScrollTrigger reveals
 * - section-assemblies.js: Cinema-grade convergence assemblies ("تتجمع قدامي")
 */

export { initLenis } from "./animations/lenis-scroll.js";
export { initCustomCursor } from "./animations/custom-cursor.js";
export {
    initScrollProgressBar,
    initBackToTop,
    initMagnetic,
    initCard3DTilt
} from "./animations/scroll-effects.js";
export {
    splitWordsForReveal,
    initCounterAnimation,
    initScrollReveal,
    refreshScrollReveal
} from "./animations/reveals.js";
export {
    getSpreadFactor,
    initHeroCinematicEntrance,
    initAboutAssembly,
    initProjectsAssembly,
    initCertificatesAssembly,
    initContactAssembly,
    initFooterAssembly
} from "./animations/section-assemblies.js";
export { initCinematicScroll } from "./animations/cinematic-scroll.js";
