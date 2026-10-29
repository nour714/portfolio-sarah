/**
 * Lenis Smooth Scroll Engine
 * Clean Architecture - Presentation / Animations Layer
 */

import { getMediaMatch } from "../../core/utils.js";

/**
 * Initializes Lenis Smooth Scrolling engine synchronized with GSAP Ticker
 */
export const initLenis = () => {
    const reduceMotion = getMediaMatch("(prefers-reduced-motion: reduce)");
    const isPerfLiteOrTouch = Boolean(window.__perf && (window.__perf.isTouch || window.__perf.lite));

    // Native scrolling is far smoother and consumes much less battery/CPU on mobile and weak devices
    if (reduceMotion || isPerfLiteOrTouch || typeof window.Lenis === "undefined") {
        // Fallback smooth anchor scrolling using native standards
        document.addEventListener("click", (e) => {
            const anchor = e.target.closest("a[href^='#']");
            if (!anchor) return;
            const href = anchor.getAttribute("href");
            if (!href || href === "#" || href.length < 2) return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });

            if (window.history?.pushState) {
                window.history.pushState(null, "", href);
            }
        });
        return null;
    }

    const lenis = new window.Lenis({
        lerp: 0.08,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.5,
        anchors: true
    });

    window.__lenis = lenis;

    if (window.gsap && window.ScrollTrigger) {
        window.gsap.registerPlugin(window.ScrollTrigger);
        window.gsap.defaults({ ease: "power3.out", duration: 0.85 });

        lenis.on("scroll", window.ScrollTrigger.update);

        window.gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        window.gsap.ticker.lagSmoothing(0);
    } else {
        const raf = (time) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
    }

    // Modal scroll lock observer to pause/resume Lenis cleanly
    try {
        const modalObserver = new MutationObserver(() => {
            const isProjectOpen = document.getElementById("project-modal-overlay")?.classList.contains("is-open");
            const isCertOpen = document.getElementById("cert-modal-overlay")?.classList.contains("is-open") ||
                document.body.classList.contains("modal-open");

            if (isProjectOpen || isCertOpen) {
                lenis.stop();
            } else {
                lenis.start();
            }
        });

        const projectOverlay = document.getElementById("project-modal-overlay");
        const certOverlay = document.getElementById("cert-modal-overlay");
        if (projectOverlay) modalObserver.observe(projectOverlay, { attributes: true, attributeFilter: ["class"] });
        if (certOverlay) modalObserver.observe(certOverlay, { attributes: true, attributeFilter: ["class"] });
        modalObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });

        // Pause Lenis rAF loop when tab is hidden to save battery & CPU
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                lenis.stop();
            } else {
                lenis.start();
            }
        });
    } catch (_) {
        // Observer fallback
    }

    // Intercept in-page anchor links for butter-smooth scrolling
    document.addEventListener("click", (e) => {
        const anchor = e.target.closest("a[href^='#']");
        if (!anchor) return;
        const href = anchor.getAttribute("href");
        if (!href || href === "#" || href.length < 2) return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        lenis.scrollTo(target, {
            offset: -75,
            duration: 1.15,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });

        if (window.history?.pushState) {
            window.history.pushState(null, "", href);
        }
    });

    return lenis;
};
