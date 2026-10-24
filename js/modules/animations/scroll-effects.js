/**
 * Scroll Effects, Progress Bar, Back to Top, Magnetic & 3D Tilt
 * Clean Architecture - Presentation / Animations Layer
 */

import { getMediaMatch } from "../../core/utils.js";

/**
 * Initializes Scroll Progress Bar tied to ScrollTrigger
 */
export const initScrollProgressBar = () => {
    let bar = document.getElementById("scroll-progress-bar");
    if (!bar) {
        bar = document.createElement("div");
        bar.id = "scroll-progress-bar";
        bar.setAttribute("aria-hidden", "true");
        document.body.prepend(bar);
    }

    if (window.ScrollTrigger) {
        window.ScrollTrigger.create({
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
                bar.style.width = `${Math.min(self.progress * 100, 100)}%`;
            }
        });
    } else {
        const updateBar = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            bar.style.width = `${Math.min(progress, 100)}%`;
        };
        window.addEventListener("scroll", updateBar, { passive: true });
        updateBar();
    }
};

/**
 * Initializes Back to Top Button with Lenis smooth scroll
 */
export const initBackToTop = () => {
    let btn = document.getElementById("back-to-top");
    if (!btn) {
        btn = document.createElement("button");
        btn.id = "back-to-top";
        btn.setAttribute("aria-label", "Back to top");
        btn.setAttribute("data-magnetic", "");
        btn.innerHTML = `
            <svg viewBox="0 0 24 24">
                <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
        `;
        document.body.appendChild(btn);
    }

    const SHOW_THRESHOLD = 380;

    const toggleVisibility = () => {
        btn.classList.toggle("is-visible", window.scrollY > SHOW_THRESHOLD);
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });

    btn.addEventListener("click", (e) => {
        e.preventDefault();
        if (window.__lenis) {
            window.__lenis.scrollTo(0, { duration: 1.25, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    });

    toggleVisibility();
};

const boundMagnetic = new WeakSet();

/**
 * Initializes Magnetic Pull Interaction for CTAs and buttons
 */
export const initMagnetic = () => {
    if (getMediaMatch("(prefers-reduced-motion: reduce)") ||
        window.matchMedia("(pointer: coarse)").matches ||
        !window.gsap) {
        return;
    }

    const gsap = window.gsap;
    const targets = Array.from(document.querySelectorAll("[data-magnetic], .hero-btn, .hero-social-link, .brand, .theme-toggle, .contact-btn, #back-to-top, .project-filter, .certificate-filter"));

    targets.forEach((elem) => {
        if (boundMagnetic.has(elem)) return;
        boundMagnetic.add(elem);

        const strength = Number(elem.dataset.magnetic || (elem.classList.contains("project-filter") || elem.classList.contains("certificate-filter") ? 0.16 : 0.22));
        const xTo = gsap.quickTo(elem, "x", { duration: 0.45, ease: "power3.out" });
        const yTo = gsap.quickTo(elem, "y", { duration: 0.45, ease: "power3.out" });

        elem.addEventListener("pointermove", (e) => {
            const rect = elem.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * strength;
            const y = (e.clientY - rect.top - rect.height / 2) * strength;
            xTo(x);
            yTo(y);
        });

        elem.addEventListener("pointerleave", () => {
            xTo(0);
            yTo(0);
        });
    });
};

const boundCards = new WeakSet();

/**
 * Initializes Professional 3D Physics Tilt & Dynamic Spotlight Sheen for ALL Cards Across the Site
 */
export const initCard3DTilt = () => {
    if (getMediaMatch("(prefers-reduced-motion: reduce)")) {
        return;
    }

    if (!window.gsap) {
        if (typeof requestAnimationFrame === "function") {
            requestAnimationFrame(initCard3DTilt);
        }
        return;
    }

    const gsap = window.gsap;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

    // 1. Hero 3D Interactive Console Cards: Contact Section (.contact-panel and .contact-form)
    const contactCards = Array.from(document.querySelectorAll(".contact-panel, .contact-form"));
    contactCards.forEach((card, index) => {
        // Inject dynamic spotlight sheen element if not already present
        if (!card.querySelector(".card-spotlight")) {
            const spotlight = document.createElement("div");
            spotlight.className = "card-spotlight";
            spotlight.setAttribute("aria-hidden", "true");
            card.prepend(spotlight);
        }

        if (boundCards.has(card)) return;
        boundCards.add(card);

        // Ambient 3D floating levitation (subtle floating console oscillation)
        let ambientFloat = null;
        if (!getMediaMatch("(prefers-reduced-motion: reduce)")) {
            ambientFloat = gsap.to(card, {
                y: -6,
                rotateX: index === 0 ? 1.4 : -1.2,
                rotateY: index === 0 ? -1.0 : 1.3,
                duration: 3.6 + index * 0.4,
                delay: index * 0.35,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1
            });
        }

        if (!isCoarsePointer) {
            const rotateXTo = gsap.quickTo(card, "rotateX", { duration: 0.45, ease: "power2.out" });
            const rotateYTo = gsap.quickTo(card, "rotateY", { duration: 0.45, ease: "power2.out" });
            const yTo = gsap.quickTo(card, "y", { duration: 0.45, ease: "power2.out" });

            card.addEventListener("pointerenter", () => {
                if (ambientFloat) ambientFloat.pause();
            });

            card.addEventListener("pointermove", (e) => {
                const rect = card.getBoundingClientRect();
                const relX = e.clientX - rect.left;
                const relY = e.clientY - rect.top;

                // Update spotlight coordinates in real-time
                card.style.setProperty("--mouse-x", `${relX}px`);
                card.style.setProperty("--mouse-y", `${relY}px`);

                // Normalized offsets from center (-0.5 to +0.5)
                const normX = relX / rect.width - 0.5;
                const normY = relY / rect.height - 0.5;

                // Max tilt angle: 5.5deg for tactile 3D perspective
                const maxTilt = 5.5;

                rotateYTo(normX * maxTilt * 2);
                rotateXTo(-normY * maxTilt * 2);
                yTo(-8);
            });

            card.addEventListener("pointerleave", () => {
                rotateXTo(0);
                rotateYTo(0);
                yTo(0);
                gsap.delayedCall(0.5, () => {
                    if (ambientFloat) ambientFloat.resume();
                });
            });
        }
    });

    // 2. Standard 3D Cards across the rest of the site
    if (isCoarsePointer) return;

    const CARD_SELECTOR = ".experience-card, .skill-card, .stat-card, .skills-metric, .about-node";
    const cards = Array.from(document.querySelectorAll(CARD_SELECTOR));

    cards.forEach((card) => {
        if (boundCards.has(card)) return;
        boundCards.add(card);

        // Inject dynamic spotlight sheen element if not already present
        if (!card.querySelector(".card-spotlight")) {
            const spotlight = document.createElement("div");
            spotlight.className = "card-spotlight";
            spotlight.setAttribute("aria-hidden", "true");
            card.prepend(spotlight);
        }

        const rotateXTo = gsap.quickTo(card, "rotateX", { duration: 0.4, ease: "power3.out" });
        const rotateYTo = gsap.quickTo(card, "rotateY", { duration: 0.4, ease: "power3.out" });
        const yTo = gsap.quickTo(card, "y", { duration: 0.4, ease: "power3.out" });

        card.addEventListener("pointermove", (e) => {
            const rect = card.getBoundingClientRect();
            const relX = e.clientX - rect.left;
            const relY = e.clientY - rect.top;

            // Update spotlight coordinates in real-time
            card.style.setProperty("--mouse-x", `${relX}px`);
            card.style.setProperty("--mouse-y", `${relY}px`);

            // Normalized offsets from center (-0.5 to +0.5)
            const normX = relX / rect.width - 0.5;
            const normY = relY / rect.height - 0.5;

            // Maximum tilt angle: 4.8deg for small cards, 3.4deg for large cards
            const maxTilt = rect.height > 320 ? 3.4 : 4.8;

            rotateYTo(normX * maxTilt * 2);
            rotateXTo(-normY * maxTilt * 2);
            yTo(-6);
        });

        card.addEventListener("pointerleave", () => {
            rotateXTo(0);
            rotateYTo(0);
            yTo(0);
        });
    });

    window.__refreshCardAnimations = initCard3DTilt;
};
