/**
 * Scroll Reveal Orchestration, Headline Words & Counter Animations
 * Clean Architecture - Presentation / Animations Layer
 */

import { getMediaMatch } from "../../core/utils.js";
import { initSkillsAssemblyAnimation } from "../skills.js";
import {
    initAboutAssembly,
    initProjectsAssembly,
    initCertificatesAssembly,
    initContactAssembly,
    initFooterAssembly
} from "./section-assemblies.js";
import { initCard3DTilt } from "./scroll-effects.js";

/**
 * Splits text into words wrapped in masks for luxury editorial reveals
 * Preserves full accessibility via aria-label
 */
export const splitWordsForReveal = (element) => {
    if (!element || element.dataset.motionSplit === "true") return;

    if (element.querySelector(".title-word, .motion-word")) {
        element.dataset.motionSplit = "true";
        return;
    }

    const rawText = (element.textContent || "").trim();
    if (!rawText) return;

    const words = rawText.split(/\s+/);
    element.textContent = "";
    element.setAttribute("aria-label", rawText);

    words.forEach((wordText, index) => {
        const mask = document.createElement("span");
        mask.className = "motion-word-mask";
        mask.setAttribute("aria-hidden", "true");

        const word = document.createElement("span");
        word.className = "motion-word";
        word.textContent = wordText;
        word.style.setProperty("--word-index", String(index));

        mask.appendChild(word);
        element.appendChild(mask);
        if (index < words.length - 1) {
            element.appendChild(document.createTextNode(" "));
        }
    });

    element.dataset.motionSplit = "true";
};

/**
 * Initializes Counter Animations with GSAP ScrollTrigger
 */
export const initCounterAnimation = () => {
    const counters = Array.from(document.querySelectorAll(".stat-number[data-target]"));
    if (!counters.length) return;

    const reducedMotion = getMediaMatch("(prefers-reduced-motion: reduce)");

    if (reducedMotion || !window.gsap) {
        counters.forEach((counter) => {
            counter.textContent = counter.getAttribute("data-target") || "0";
        });
        return;
    }

    const gsap = window.gsap;

    counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute("data-target") || "0", 10);
        if (isNaN(target)) return;

        const obj = { val: 0 };
        gsap.to(obj, {
            val: target,
            duration: 1.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: counter,
                start: "top 88%",
                once: true
            },
            onUpdate: () => {
                counter.textContent = String(Math.round(obj.val));
            }
        });
    });
};

/**
 * Initializes Cinematic Scroll Reveals using GSAP ScrollTrigger & IntersectionObserver
 */
export const initScrollReveal = () => {
    const reducedMotion = getMediaMatch("(prefers-reduced-motion: reduce)");
    const selectorGroups = [
        [".section-kicker, .skills-headline, .projects-headline, .certificates-headline, .contact-header", "up"],
        [".about-panel, .projects-copy, .certificates-copy", "soft"],
        [".projects-filters, .certificates-filters", "left"],
        [".contact-panel, .contact-form", "soft"],
        [".project-card-wrapper, .certificate-card-wrapper, .contact-item, .stat-card, .skills-metric", "card"]
    ];

    let observer;
    const observe = (element) => {
        if (!element || element.classList.contains("is-visible")) return;
        if (reducedMotion || typeof window.IntersectionObserver !== "function") {
            element.classList.add("is-visible");
        } else {
            observer.observe(element);
        }
    };

    const decorate = () => {
        const activeGroups = (window.gsap && window.ScrollTrigger && !reducedMotion) ? [
            [".section-kicker", "up"],
            [".stat-card, .skills-metric", "card"]
        ] : selectorGroups;

        activeGroups.forEach(([selector, variant]) => {
            const elements = Array.from(document.querySelectorAll(selector)).filter(
                (node) => node instanceof HTMLElement && !node.classList.contains("is-hidden")
            );

            elements.forEach((element, index) => {
                element.classList.add("reveal", `reveal--${variant}`);
                if (variant === "card") {
                    element.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 85}ms`);
                }
                observe(element);
            });
        });
    };

    if (!reducedMotion && typeof window.IntersectionObserver === "function") {
        observer = new IntersectionObserver(
            (entries, activeObserver) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("is-visible");
                    activeObserver.unobserve(entry.target);
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
        );
    }

    decorate();

    window.__refreshScrollReveal = () => {
        decorate();
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    };

    // If GSAP & ScrollTrigger are loaded, layer cinematic motion flourishes!
    if (window.gsap && window.ScrollTrigger && !reducedMotion) {
        const gsap = window.gsap;
        const ScrollTrigger = window.ScrollTrigger;

        ScrollTrigger.getAll().forEach((st) => {
            if (st.vars.id && String(st.vars.id).startsWith("cinematic-reveal-")) {
                st.kill();
            }
        });

        // 1. Staggered Headline Word Reveals
        const titleSelectors = [
            "#about-title",
            "#skills-title",
            "#contact-title"
        ];

        titleSelectors.forEach((sel) => {
            const titleEl = document.querySelector(sel);
            if (!titleEl) return;
            splitWordsForReveal(titleEl);
            const words = titleEl.querySelectorAll(".motion-word");
            if (!words.length) return;

            gsap.fromTo(
                words,
                { yPercent: 48, autoAlpha: 0, filter: "blur(6px)" },
                {
                    yPercent: 0,
                    autoAlpha: 1,
                    filter: "blur(0px)",
                    duration: 0.9,
                    ease: "power4.out",
                    stagger: 0.035,
                    scrollTrigger: {
                        id: `cinematic-reveal-title-${sel.replace("#", "")}`,
                        trigger: titleEl,
                        start: "top 88%",
                        toggleActions: "restart none restart none"
                    }
                }
            );
        });

        // 2. Initialize Section Convergence Choreographies
        initAboutAssembly();
        initSkillsAssemblyAnimation();
        initProjectsAssembly();
        initCertificatesAssembly();
        initContactAssembly();
        initFooterAssembly();

        // Refresh on full load
        const handleRefresh = () => {
            requestAnimationFrame(() => {
                ScrollTrigger.refresh();
                if (window.__lenis) window.__lenis.resize();
            });
        };

        window.addEventListener("load", handleRefresh);
    }
};

/**
 * Refreshes ScrollTrigger calculations after dynamic content injection
 */
export function refreshScrollReveal() {
    if (typeof window.__refreshScrollReveal === "function") {
        window.__refreshScrollReveal();
    }
    initCard3DTilt();
    if (window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
    }
}
