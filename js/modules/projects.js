/**
 * Projects Module - Machine Learning Engineer Portfolio
 * Clean Architecture - Presentation / UI Layer
 * 
 * Drives production-grade scroll interactions:
 * - Staggered section intro word reveal (blur-to-sharp)
 * - Sticky stacked cards with 60fps scale-down (1 -> 0.92) and dimming
 * - Parallax preview media inside browser frames
 * - Live animated metrics counters (accuracy, latency, F1)
 * - Dynamic SVG pipeline diagram (pathLength scroll drawing)
 * - Section scroll progress bar & side active indicator (01 / 04)
 * - Tech stack tags stagger reveal
 * - Real-time cursor spotlight & lift hover interactions
 */

import { shareLink, bindCardSpotlight } from "../core/utils.js";
import {
    createPipelineSvg,
    createMetricsHtml,
    createProjectCard
} from "./projects/project-card.js";
import {
    animateModalArchitecture,
    initProjectModal
} from "./projects/project-modal.js";

export {
    createPipelineSvg,
    createMetricsHtml,
    createProjectCard,
    animateModalArchitecture,
    initProjectModal
};

/**
 * Initializes Social Share for project cards
 */
export const initProjectShare = () => {
    const flashCopiedState = (button) => {
        const previousLabel = button.getAttribute("aria-label");
        button.classList.add("is-copied");
        button.setAttribute("aria-label", "Link copied");

        window.setTimeout(() => {
            button.classList.remove("is-copied");
            if (previousLabel) button.setAttribute("aria-label", previousLabel);
        }, 1300);
    };

    const handleShare = async (button) => {
        const shareTitle = button.getAttribute("data-share-title") || document.title;
        const shareUrl = button.getAttribute("data-share-url") || window.location.href;
        const outcome = await shareLink({ title: shareTitle, url: shareUrl });
        if (outcome === "copied") flashCopiedState(button);
    };

    document.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const button = target.closest(".share-btn");
        if (!button) return;
        event.preventDefault();
        handleShare(button);
    });
};

/**
 * Section Intro: Heading words reveal one by one (blur-to-sharp + translateY)
 */
export const initProjectsSectionIntro = () => {
    if (!window.gsap || !window.ScrollTrigger) return;
    const gsap = window.gsap;
    const words = Array.from(document.querySelectorAll(".projects-title-reveal .title-word"));
    if (!words.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        words.forEach((w) => gsap.set(w, { opacity: 1, y: 0, filter: "none" }));
        return;
    }

    gsap.fromTo(
        words,
        { y: 38, opacity: 0, filter: "blur(10px)" },
        {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.9,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".projects-headline",
                start: "top 86%",
                toggleActions: "restart none restart none"
            }
        }
    );
};

/**
 * Sticky Stacked Cards:
 * Each project card sticks to the top while scrolling.
 * As the next card slides over it, the previous card scales down (1 -> 0.92), dims, and blurs slightly.
 */
export const initStickyCardStack = () => {
    if (!window.gsap || !window.ScrollTrigger) return;
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isLite = Boolean(window.__perf && window.__perf.lite);

    // Clean up any existing card stack ScrollTriggers
    ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.id && String(st.vars.id).startsWith("card-stack-")) {
            st.kill();
        }
    });

    const cardWrappers = Array.from(document.querySelectorAll(".project-card-wrapper:not(.is-hidden)"));

    if (reducedMotion || isLite) {
        // Reduced Motion & Weak Devices: Standard stacked flow, no scrubbed scaling/blurring
        cardWrappers.forEach((wrapper) => {
            const card = wrapper.querySelector(".project-card");
            if (card) {
                gsap.set(card, { clearProps: "transform,opacity,filter" });
            }
        });
        return;
    }

    if (cardWrappers.length <= 1) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const targetScale = isMobile ? 0.94 : 0.92;
    const targetOpacity = isMobile ? 0.5 : 0.45;
    const targetBlur = isMobile ? "blur(3px)" : "blur(4px)";
    const startTrigger = isMobile ? "top 85%" : "top 80%";
    const endTrigger = isMobile ? "top 16%" : "top 18%";

    cardWrappers.forEach((wrapper, i) => {
        wrapper.style.zIndex = String(i + 1);
        const card = wrapper.querySelector(".project-card");
        if (!card) return;

        // If not the last card, animate it as the NEXT card enters and slides over
        if (i < cardWrappers.length - 1) {
            const nextWrapper = cardWrappers[i + 1];

            gsap.to(card, {
                scale: targetScale,
                opacity: targetOpacity,
                filter: targetBlur,
                transformOrigin: "center top",
                ease: "none",
                scrollTrigger: {
                    id: `card-stack-${i}`,
                    trigger: nextWrapper,
                    start: startTrigger,
                    end: endTrigger,
                    scrub: true,
                    invalidateOnRefresh: true
                }
            });
        }
    });
};

/**
 * Parallax on Media Preview inside each card's browser frame
 */
export const initProjectParallax = () => {
    if (!window.gsap || !window.ScrollTrigger) return;
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const isLite = Boolean(window.__perf && window.__perf.lite);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || isLite) return;

    ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.id && String(st.vars.id).startsWith("card-parallax-")) {
            st.kill();
        }
    });

    const mediaList = Array.from(document.querySelectorAll(".project-preview-media"));
    mediaList.forEach((media, i) => {
        const wrapper = media.closest(".project-card-wrapper") || media.closest(".project-card");
        if (!wrapper) return;

        gsap.fromTo(
            media,
            { yPercent: -8 },
            {
                yPercent: 8,
                ease: "none",
                scrollTrigger: {
                    id: `card-parallax-${i}`,
                    trigger: wrapper,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.2
                }
            }
        );
    });
};

/**
 * Animated Metric Counters (Count up from 0 to target when card becomes visible)
 */
export const initProjectCounters = (scope = document) => {
    if (!window.gsap || !window.ScrollTrigger) return;
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    const metrics = Array.from(scope.querySelectorAll(".project-metric[data-target]"));
    metrics.forEach((metric) => {
        const numberEl = metric.querySelector(".metric-number");
        if (!numberEl || metric.dataset.counted === "true") return;

        const target = parseFloat(metric.dataset.target || "0");
        const isDecimal = String(metric.dataset.target).includes(".");
        const decimals = isDecimal ? (String(metric.dataset.target).split(".")[1] || "").length : 0;
        const obj = { val: 0 };

        ScrollTrigger.create({
            trigger: metric,
            start: "top 88%",
            once: true,
            onEnter: () => {
                metric.dataset.counted = "true";
                gsap.to(obj, {
                    val: target,
                    duration: 1.8,
                    ease: "power2.out",
                    onUpdate: () => {
                        numberEl.textContent = isDecimal
                            ? obj.val.toFixed(decimals)
                            : Math.round(obj.val).toString();
                    }
                });
            }
        });
    });
};

/**
 * Pipeline Diagram: Connecting lines draw themselves with SVG pathLength tied to scroll
 */
export const initPipelineDiagrams = () => {
    if (!window.gsap || !window.ScrollTrigger) return;
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    const diagrams = Array.from(document.querySelectorAll(".project-pipeline"));
    diagrams.forEach((diagram, i) => {
        const line = diagram.querySelector(".pipeline-progress-line");
        const nodes = Array.from(diagram.querySelectorAll(".pipeline-node"));
        const card = diagram.closest(".project-card") || diagram;

        if (line) {
            gsap.fromTo(
                line,
                { strokeDashoffset: 100 },
                {
                    strokeDashoffset: 0,
                    duration: 1.4,
                    ease: "power2.out",
                    scrollTrigger: {
                        id: `pipeline-line-${i}`,
                        trigger: card,
                        start: "top 78%",
                        once: true
                    }
                }
            );
        }

        if (nodes.length) {
            nodes.forEach((node, nIdx) => {
                gsap.fromTo(
                    node,
                    { opacity: 0.3, scale: 0.94 },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 0.55,
                        delay: 0.15 + nIdx * 0.14,
                        ease: "back.out(1.5)",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 78%",
                            once: true
                        }
                    }
                );
            });
        }
    });
};

/**
 * Tech Stack Tags Stagger Reveal
 */
export const initProjectTagsAnimation = () => {
    if (!window.gsap || !window.ScrollTrigger) return;
    const gsap = window.gsap;
    const cards = Array.from(document.querySelectorAll(".project-card"));

    cards.forEach((card) => {
        const tags = Array.from(card.querySelectorAll(".project-tech-tags li"));
        if (!tags.length) return;

        gsap.fromTo(
            tags,
            { y: 14, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.5,
                stagger: 0.04,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 82%",
                    once: true
                }
            }
        );
    });
};

/**
 * Scroll Progress Bar (Top) & Vertical Side Indicator (01 / 04)
 */
export const initProjectsScrollIndicator = () => {
    if (!window.gsap || !window.ScrollTrigger) return;
    const ScrollTrigger = window.ScrollTrigger;

    const progressBar = document.getElementById("projects-progress-bar");
    const sideIndicator = document.getElementById("projects-side-indicator");
    const activeNumEl = document.getElementById("projects-indicator-active");
    const totalNumEl = document.getElementById("projects-indicator-total");
    const projectsSection = document.getElementById("projects");

    if (!projectsSection) return;

    const cardWrappers = Array.from(document.querySelectorAll(".project-card-wrapper:not(.is-hidden)"));
    if (totalNumEl) {
        totalNumEl.textContent = cardWrappers.length.toString().padStart(2, "0");
    }

    // Fixed Top Progress Bar linked to section
    if (progressBar) {
        ScrollTrigger.create({
            trigger: projectsSection,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
                progressBar.style.transform = `scaleX(${self.progress})`;
            }
        });
    }

    // Side Progress Indicator
    if (activeNumEl && sideIndicator) {
        ScrollTrigger.create({
            trigger: projectsSection,
            start: "top 60%",
            end: "bottom 30%",
            onToggle: (self) => {
                sideIndicator.classList.toggle("is-visible", self.isActive);
            }
        });

        cardWrappers.forEach((wrapper, idx) => {
            ScrollTrigger.create({
                trigger: wrapper,
                start: "top center",
                end: "bottom center",
                onEnter: () => {
                    activeNumEl.textContent = (idx + 1).toString().padStart(2, "0");
                },
                onEnterBack: () => {
                    activeNumEl.textContent = (idx + 1).toString().padStart(2, "0");
                }
            });
        });
    }
};

/**
 * Desktop Hover Spotlight Sheen
 */
export const initCardSpotlight = () => {
    bindCardSpotlight(".project-card");
};

/**
 * Master Scroll & Interaction Orchestration for Projects
 */
export const refreshProjectScrollInteractions = () => {
    initProjectsSectionIntro();
    initStickyCardStack();
    initProjectParallax();
    initProjectCounters();
    initPipelineDiagrams();
    initProjectTagsAnimation();
    initProjectsScrollIndicator();
    initCardSpotlight();

    if (window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
    }
};

/**
 * Initializes Category Filter Tabs with smooth transitions
 */
export const initProjectFilters = () => {
    const filterButtons = Array.from(document.querySelectorAll(".project-filter"));
    if (!filterButtons.length) return;

    const getProjectWrappers = () => Array.from(document.querySelectorAll(".project-card-wrapper[data-category]"));
    let currentFilter = "all";

    const setActiveFilter = (targetFilter) => {
        const normalizedFilter = targetFilter || "all";
        currentFilter = normalizedFilter;

        filterButtons.forEach((button) => {
            const isActive = (button.getAttribute("data-filter") || "all") === normalizedFilter;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });

        const wrappers = getProjectWrappers();
        const newlyVisible = [];

        wrappers.forEach((wrapper) => {
            const categories = (wrapper.getAttribute("data-category") || "")
                .split(/\s+/)
                .filter(Boolean);
            const shouldShow = normalizedFilter === "all" || categories.includes(normalizedFilter);
            const wasHidden = wrapper.classList.contains("is-hidden");

            if (shouldShow) {
                wrapper.classList.remove("is-hidden");
                wrapper.classList.add("is-visible");
                if (wasHidden) newlyVisible.push(wrapper);
            } else {
                wrapper.classList.add("is-hidden");
            }
        });

        if (window.gsap && newlyVisible.length > 0) {
            window.gsap.fromTo(
                newlyVisible,
                { opacity: 0, y: 20, scale: 0.96 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.45,
                    stagger: 0.06,
                    ease: "power3.out",
                    overwrite: "auto",
                    clearProps: "transform"
                }
            );
        }

        // Refresh dynamic calculations
        refreshProjectScrollInteractions();
    };

    window.__applyProjectFilter = () => setActiveFilter(currentFilter);

    const defaultFilter =
        filterButtons.find((button) => button.classList.contains("is-active"))?.getAttribute("data-filter") || "all";
    setActiveFilter(defaultFilter);

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            setActiveFilter(button.getAttribute("data-filter") || "all");
        });
    });

    // Window resize handler for responsive sticky switching
    window.addEventListener("resize", () => {
        initStickyCardStack();
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    });
};
