/**
 * UI Animations & Interactions Module
 * Clean Architecture - Presentation / UI Layer
 */

import { getMediaMatch } from "../core/utils.js";

export const initScrollReveal = () => {
    const reducedMotion = getMediaMatch("(prefers-reduced-motion: reduce)");
    const revealItems = new Set();

    const collectRevealTargets = (selector) => {
        const nodes = Array.from(document.querySelectorAll(selector)).filter(
            (node) => node instanceof HTMLElement
        );

        nodes.forEach((node) => {
            node.classList.add("reveal");
            revealItems.add(node);
        });
    };

    collectRevealTargets(".section-kicker, .about-panel");
    collectRevealTargets(".skills-headline, .skills-board, .skills-note");
    collectRevealTargets(".projects-headline, .projects-copy, .projects-filters, .projects-grid");
    collectRevealTargets(".project-card");
    collectRevealTargets(".experience-header, .experience-metrics, .experience-card");
    collectRevealTargets(".contact-header, .contact-panel, .contact-form, .contact-item");

    const items = Array.from(revealItems);
    if (!items.length) return;

    if (reducedMotion || typeof window.IntersectionObserver !== "function") {
        items.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, activeObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                activeObserver.unobserve(entry.target);
            });
        },
        { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    items.forEach((item) => observer.observe(item));

    window.__refreshScrollReveal = () => {
        const nextItems = Array.from(document.querySelectorAll(".reveal:not(.is-visible)"));
        nextItems.forEach((item) => observer.observe(item));
    };
};

export function refreshScrollReveal() {
    if (typeof window.__refreshScrollReveal === "function") {
        window.__refreshScrollReveal();
    }
}

export const initScrollProgressBar = () => {
    const bar = document.getElementById("scroll-progress-bar");
    if (!bar) return;

    const updateBar = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = `${Math.min(progress, 100)}%`;
    };

    window.addEventListener("scroll", updateBar, { passive: true });
    updateBar();
};

export const initCustomCursor = () => {
    // Skip on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let rafId = 0;

    // Smooth ring follow
    const animateRing = () => {
        const ease = 0.14;
        ringX += (mouseX - ringX) * ease;
        ringY += (mouseY - ringY) * ease;

        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;

        rafId = requestAnimationFrame(animateRing);
    };

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;
    }, { passive: true });

    // Hover effect on interactive elements
    const hoverTargets = "a, button, [role='button'], input, select, textarea, .project-card, .stat-card, .skill-chip";

    document.addEventListener("mouseover", (e) => {
        if (e.target.closest(hoverTargets)) {
            dot.classList.add("is-hovering");
            ring.classList.add("is-hovering");
        }
    });

    document.addEventListener("mouseout", (e) => {
        if (e.target.closest(hoverTargets)) {
            dot.classList.remove("is-hovering");
            ring.classList.remove("is-hovering");
        }
    });

    document.addEventListener("mouseleave", () => {
        dot.style.opacity = "0";
        ring.style.opacity = "0";
    });

    document.addEventListener("mouseenter", () => {
        dot.style.opacity = "1";
        ring.style.opacity = "1";
    });

    // Hide default cursor on body
    document.body.style.cursor = "none";

    animateRing();
};

export const initBackToTop = () => {
    const btn = document.getElementById("back-to-top");
    if (!btn) return;

    const SHOW_THRESHOLD = 400;

    const toggleVisibility = () => {
        btn.classList.toggle("is-visible", window.scrollY > SHOW_THRESHOLD);
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });

    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    toggleVisibility();
};

export const initCounterAnimation = () => {
    const counters = Array.from(document.querySelectorAll(".stat-number[data-target]"));
    if (!counters.length) return;

    const reducedMotion = getMediaMatch("(prefers-reduced-motion: reduce)");

    if (reducedMotion || typeof window.IntersectionObserver !== "function") {
        counters.forEach((counter) => {
            counter.textContent = counter.getAttribute("data-target") || "0";
        });
        return;
    }

    const animateCounter = (el, target, duration = 1800) => {
        const start = performance.now();
        const startVal = 0;

        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

        const tick = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutCubic(progress);
            const current = Math.round(startVal + (target - startVal) * eased);
            el.textContent = String(current);

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = String(target);
            }
        };

        requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.getAttribute("data-target") || "0", 10);
                animateCounter(el, target);
                observer.unobserve(el);
            });
        },
        { threshold: 0.5 }
    );

    counters.forEach((counter) => observer.observe(counter));
};
