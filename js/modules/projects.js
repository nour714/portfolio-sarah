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

import { createShareIcon, shareLink } from "../core/utils.js";
import { showToast } from "../services/toast.service.js";
import { projects as defaultProjects } from "../data/projects.js";

/**
 * Creates an SVG Architecture Pipeline Flow with drawing connecting line
 */
const createPipelineSvg = (pipeline, index) => {
    if (!Array.isArray(pipeline) || !pipeline.length) return "";

    const nodesHtml = pipeline.map((stage, sIdx) => {
        const title = typeof stage === "string" ? stage : stage.label;
        const detail = typeof stage === "object" && stage.detail ? stage.detail : "";
        return `
            <div class="pipeline-node" data-stage="${sIdx}">
                <div class="node-bullet">
                    <span class="bullet-inner"></span>
                    <span class="bullet-ring"></span>
                </div>
                <div class="node-meta">
                    <span class="node-title">${title}</span>
                    ${detail ? `<span class="node-detail">${detail}</span>` : ""}
                </div>
            </div>
        `;
    }).join("");

    return `
        <div class="project-pipeline" aria-label="Machine learning architecture pipeline">
            <div class="pipeline-header">
                <span class="pipeline-tag">
                    <span class="pipeline-indicator-dot" aria-hidden="true"></span>
                    MLOps Pipeline Architecture
                </span>
                <span class="pipeline-subtag">End-to-End Orchestration</span>
            </div>
            <div class="pipeline-flow">
                <div class="pipeline-svg-wrapper" aria-hidden="true">
                    <svg class="pipeline-svg-line" viewBox="0 0 100 2" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="pipe-grad-${index}" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stop-color="#8b5cf6" />
                                <stop offset="50%" stop-color="#a855f7" />
                                <stop offset="100%" stop-color="#22d3ee" />
                            </linearGradient>
                        </defs>
                        <line class="pipeline-bg-line" x1="0" y1="1" x2="100" y2="1" stroke="rgba(139, 92, 246, 0.2)" stroke-width="2" />
                        <line class="pipeline-progress-line" x1="0" y1="1" x2="100" y2="1" stroke="url(#pipe-grad-${index})" stroke-width="2" stroke-dasharray="100" stroke-dashoffset="100" />
                    </svg>
                </div>
                <div class="pipeline-nodes-row">
                    ${nodesHtml}
                </div>
            </div>
        </div>
    `;
};

/**
 * Creates 3 Animated Metric Counters
 */
const createMetricsHtml = (metrics = []) => {
    if (!Array.isArray(metrics) || !metrics.length) return "";

    return `
        <div class="project-metrics-grid" role="group" aria-label="Key performance metrics">
            ${metrics.map((m) => `
                <div class="project-metric" data-target="${m.value}" data-prefix="${m.prefix || ""}" data-suffix="${m.suffix || ""}">
                    <div class="metric-value-wrap">
                        <span class="metric-prefix">${m.prefix || ""}</span>
                        <span class="metric-number">0</span>
                        <span class="metric-suffix">${m.suffix || ""}</span>
                    </div>
                    <span class="metric-label">${m.label}</span>
                </div>
            `).join("")}
        </div>
    `;
};

/**
 * Factory function: Creates a production-grade ML Engineer Project Card
 */
export const createProjectCard = (project, index) => {
    const cardIndexStr = project.index || String(index + 1).padStart(2, "0");

    // Wrapper for sticky stacking & ScrollTrigger tracking
    const wrapper = document.createElement("div");
    wrapper.className = "project-card-wrapper reveal";
    wrapper.setAttribute("data-category", (project.categories || []).join(" "));
    wrapper.setAttribute("data-card-index", cardIndexStr);

    // Inner Article Card
    const card = document.createElement("article");
    card.className = "project-card";
    card.setAttribute("data-category", (project.categories || []).join(" "));
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-labelledby", `project-title-${project.id || index}`);

    // Spotlight & Glow Overlay
    const spotlight = document.createElement("div");
    spotlight.className = "card-spotlight";
    spotlight.setAttribute("aria-hidden", "true");

    const radialGlow = document.createElement("div");
    radialGlow.className = "card-radial-glow";
    radialGlow.setAttribute("aria-hidden", "true");

    card.append(spotlight, radialGlow);

    // Card Header Banner (Index + System Category Tag)
    const headerBanner = document.createElement("div");
    headerBanner.className = "project-card-header";

    const indexBadge = document.createElement("div");
    indexBadge.className = "project-card-index";
    indexBadge.setAttribute("aria-hidden", "true");
    indexBadge.textContent = cardIndexStr;

    const categoryBadge = document.createElement("div");
    categoryBadge.className = "project-category-badge";
    const primaryCategory = (project.meta && project.meta[0]) || "Machine Learning";
    categoryBadge.textContent = primaryCategory;

    headerBanner.append(indexBadge, categoryBadge);
    card.append(headerBanner);

    // Main 2-Column Split: Content Column + Preview Column
    const cardBody = document.createElement("div");
    cardBody.className = "project-card-body";

    // 1. Content Column (Left on Desktop)
    const contentCol = document.createElement("div");
    contentCol.className = "project-content-col";

    // Title
    const title = document.createElement("h3");
    title.className = "project-title";
    title.id = `project-title-${project.id || index}`;
    title.textContent = project.title || "ML Project";

    // Short "What I Built" description
    const description = document.createElement("p");
    description.className = "project-description";
    description.textContent = project.description || "";

    // Tech Stack Tags
    const techList = document.createElement("ul");
    techList.className = "project-tech-tags";
    techList.setAttribute("aria-label", "Technologies used");
    (project.tech || []).forEach((t) => {
        const li = document.createElement("li");
        li.textContent = t;
        techList.append(li);
    });

    // Action Buttons
    const actionsRow = document.createElement("div");
    actionsRow.className = "project-actions-row";

    // Project Detail Modal Trigger
    const caseStudyBtn = document.createElement("button");
    caseStudyBtn.type = "button";
    caseStudyBtn.className = "project-btn project-btn-primary project-detail-btn";
    caseStudyBtn.setAttribute("data-project", String(index));
    caseStudyBtn.setAttribute("aria-label", `View details for ${project.title}`);
    caseStudyBtn.innerHTML = `<span>View Details</span><span class="case-study-arrow" aria-hidden="true">→</span>`;

    actionsRow.append(caseStudyBtn);

    contentCol.append(
        title,
        description,
        techList,
        actionsRow
    );

    // 2. Preview Column (Right on Desktop) - Browser-Style Frame
    const previewCol = document.createElement("div");
    previewCol.className = "project-preview-col";

    const browserFrame = document.createElement("div");
    browserFrame.className = "project-browser-frame";

    // Browser chrome toolbar
    const browserBar = document.createElement("div");
    browserBar.className = "browser-frame-bar";
    browserBar.innerHTML = `
        <div class="browser-controls" aria-hidden="true">
            <span class="browser-dot dot-close"></span>
            <span class="browser-dot dot-min"></span>
            <span class="browser-dot dot-max"></span>
        </div>
        <div class="browser-address-pill">
            <span class="browser-lock-icon" aria-hidden="true">🔒</span>
            <span class="browser-url-text">sarahnabil.ai/models/${project.id || index}</span>
        </div>
        <div class="browser-status-chip">
            <span class="pulse-ring" aria-hidden="true"></span>
            <span class="status-text">LIVE</span>
        </div>
    `;

    // Browser viewport with Parallax Media Container
    const browserViewport = document.createElement("div");
    browserViewport.className = "browser-viewport";

    const parallaxMedia = document.createElement("div");
    parallaxMedia.className = "project-preview-media";

    const img = document.createElement("img");
    img.className = "project-image";
    img.loading = "lazy";
    img.decoding = "async";
    img.src = project.image?.src || "";
    img.alt = project.image?.alt || project.title || "Project Preview";

    // Live Inference Overlay Chip
    const liveOverlay = document.createElement("div");
    liveOverlay.className = "preview-live-overlay";
    liveOverlay.innerHTML = `
        <span class="overlay-pulse-dot" aria-hidden="true"></span>
        <span>CUDA Ingestion Ready</span>
    `;

    parallaxMedia.append(img, liveOverlay);
    browserViewport.append(parallaxMedia);
    browserFrame.append(browserBar, browserViewport);
    previewCol.append(browserFrame);

    // Assemble Card Body
    cardBody.append(contentCol, previewCol);
    card.append(cardBody);
    wrapper.append(card);

    return wrapper;
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
                once: true
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

    const isDesktop = window.matchMedia("(min-width: 900px)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Clean up any existing card stack ScrollTriggers
    ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.id && String(st.vars.id).startsWith("card-stack-")) {
            st.kill();
        }
    });

    const cardWrappers = Array.from(document.querySelectorAll(".project-card-wrapper:not(.is-hidden)"));

    if (!isDesktop || reducedMotion) {
        // Mobile or Reduced Motion: Reset to standard stacked flow
        cardWrappers.forEach((wrapper) => {
            const card = wrapper.querySelector(".project-card");
            if (card) {
                gsap.set(card, { clearProps: "transform,opacity,filter" });
            }
        });
        return;
    }

    if (cardWrappers.length <= 1) return;

    cardWrappers.forEach((wrapper, i) => {
        const card = wrapper.querySelector(".project-card");
        if (!card) return;

        // If not the last card, animate it as the NEXT card enters and slides over
        if (i < cardWrappers.length - 1) {
            const nextWrapper = cardWrappers[i + 1];

            gsap.to(card, {
                scale: 0.92,
                opacity: 0.45,
                filter: "blur(4px)",
                transformOrigin: "center top",
                ease: "none",
                scrollTrigger: {
                    id: `card-stack-${i}`,
                    trigger: nextWrapper,
                    start: "top 80%",
                    end: "top 18%",
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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const cards = Array.from(document.querySelectorAll(".project-card"));

    cards.forEach((card) => {
        card.addEventListener("pointermove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });
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

/**
 * Triggers interactive animations inside the opened Case Study modal
 */
export const animateModalArchitecture = (modalEl) => {
    if (!window.gsap) return;
    const gsap = window.gsap;

    // 1. Metric Counters inside modal
    const metrics = Array.from(modalEl.querySelectorAll(".project-metric[data-target]"));
    metrics.forEach((metric) => {
        const numberEl = metric.querySelector(".metric-number");
        if (!numberEl) return;
        const target = parseFloat(metric.dataset.target || "0");
        const isDecimal = String(metric.dataset.target).includes(".");
        const decimals = isDecimal ? (String(metric.dataset.target).split(".")[1] || "").length : 0;
        const obj = { val: 0 };
        gsap.fromTo(
            obj,
            { val: 0 },
            {
                val: target,
                duration: 1.4,
                ease: "power2.out",
                onUpdate: () => {
                    numberEl.textContent = isDecimal
                        ? obj.val.toFixed(decimals)
                        : Math.round(obj.val).toString();
                }
            }
        );
    });

    // 2. SVG Architecture Pipeline inside modal
    const pipeline = modalEl.querySelector(".project-pipeline");
    if (pipeline) {
        const line = pipeline.querySelector(".pipeline-progress-line");
        const nodes = Array.from(pipeline.querySelectorAll(".pipeline-node"));
        if (line) {
            gsap.fromTo(
                line,
                { strokeDashoffset: 100 },
                { strokeDashoffset: 0, duration: 1.3, ease: "power2.out", delay: 0.1 }
            );
        }
        if (nodes.length) {
            gsap.fromTo(
                nodes,
                { opacity: 0, scale: 0.86, y: 8 },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.45,
                    stagger: 0.08,
                    ease: "back.out(1.5)",
                    delay: 0.15
                }
            );
        }
    }
};

/**
 * Initializes Project Detail Lightbox Modal (Case Study Deep Dive)
 */
export const initProjectModal = () => {
    const overlay = document.getElementById("project-modal-overlay");
    const closeBtn = document.getElementById("project-modal-close");
    if (!overlay || !closeBtn) return;
    overlay.setAttribute("aria-hidden", "true");

    let lastFocusedElement = null;
    let previousBodyOverflow = "";

    const getProjectDataByIndex = (projectIndex) => {
        if (window.__projectsData && window.__projectsData[projectIndex]) {
            return window.__projectsData[projectIndex];
        }
        if (Array.isArray(defaultProjects) && defaultProjects[projectIndex]) {
            return defaultProjects[projectIndex];
        }
        return null;
    };

    const openModal = (projectIndex) => {
        const project = getProjectDataByIndex(projectIndex);
        if (!project) return;

        lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const titleEl = document.getElementById("project-modal-title");
        const descEl = document.getElementById("project-modal-desc");
        const catsEl = document.getElementById("project-modal-cats");
        const problemSlot = document.getElementById("project-modal-problem-slot");
        const metricsSlot = document.getElementById("project-modal-metrics-slot");
        const pipelineSlot = document.getElementById("project-modal-pipeline-slot");
        const highlightsEl = document.getElementById("project-modal-highlights");
        const highlightsSlot = document.getElementById("project-modal-highlights-slot");
        const techEl = document.getElementById("project-modal-tech");
        const imgEl = document.getElementById("project-modal-img");
        const actionsEl = document.getElementById("project-modal-actions");

        if (titleEl) titleEl.textContent = project.title || "ML System Architecture";
        if (descEl) descEl.textContent = project.description || "";

        // Category & Meta Badges
        if (catsEl) {
            catsEl.innerHTML = "";
            const tags = Array.from(new Set([...(project.categories || []), ...(project.meta || [])]));
            tags.forEach((tag) => {
                const span = document.createElement("span");
                span.className = "project-modal-cat";
                span.textContent = tag;
                catsEl.appendChild(span);
            });
        }

        // Preview Image
        if (imgEl) {
            const imgSrc = project.image?.src || project.previewUrl || "";
            if (imgSrc) {
                imgEl.src = imgSrc;
                imgEl.alt = project.image?.alt || project.title || "Project Preview";
                imgEl.style.display = "block";
            } else {
                imgEl.style.display = "none";
            }
        }

        // Problem Statement Box
        if (problemSlot) {
            if (project.problemStatement) {
                problemSlot.style.display = "block";
                problemSlot.innerHTML = `
                    <div class="project-problem-box modal-problem-box">
                        <span class="problem-pill">PROBLEM</span>
                        <p class="problem-text">${project.problemStatement}</p>
                    </div>
                `;
            } else {
                problemSlot.style.display = "none";
                problemSlot.innerHTML = "";
            }
        }

        // Key Performance Metrics Grid
        if (metricsSlot) {
            if (Array.isArray(project.metrics) && project.metrics.length) {
                metricsSlot.style.display = "block";
                metricsSlot.innerHTML = `
                    <div class="modal-section-badge">
                        <span class="modal-dot"></span>
                        <span>Key Production Metrics</span>
                    </div>
                    ${createMetricsHtml(project.metrics)}
                `;
            } else {
                metricsSlot.style.display = "none";
                metricsSlot.innerHTML = "";
            }
        }

        // MLOps Pipeline Architecture Diagram
        if (pipelineSlot) {
            if (Array.isArray(project.pipeline) && project.pipeline.length) {
                pipelineSlot.style.display = "block";
                pipelineSlot.innerHTML = createPipelineSvg(project.pipeline, "modal-" + projectIndex);
            } else {
                pipelineSlot.style.display = "none";
                pipelineSlot.innerHTML = "";
            }
        }

        // Key Highlights
        if (highlightsEl && highlightsSlot) {
            if (Array.isArray(project.highlights) && project.highlights.length) {
                highlightsSlot.style.display = "block";
                highlightsEl.innerHTML = "";
                project.highlights.forEach((h) => {
                    const li = document.createElement("li");
                    li.textContent = h;
                    highlightsEl.appendChild(li);
                });
            } else {
                highlightsSlot.style.display = "none";
            }
        }

        // Tech Stack
        if (techEl) {
            techEl.innerHTML = "";
            (project.tech || []).forEach((t) => {
                const span = document.createElement("span");
                span.className = "project-modal-tech-tag";
                span.textContent = t;
                techEl.appendChild(span);
            });
        }

        // Actions: Share
        if (actionsEl) {
            actionsEl.innerHTML = "";
            const shareBtn = document.createElement("button");
            shareBtn.type = "button";
            shareBtn.className = "project-modal-btn project-modal-btn-primary";
            shareBtn.innerHTML = `<span>Share Project</span>`;
            shareBtn.prepend(createShareIcon(16));
            shareBtn.addEventListener("click", async () => {
                const outcome = await shareLink({
                    title: project.shareTitle || project.title,
                    url: project.shareUrl || project.githubUrl || window.location.href
                });
                if (outcome === "copied") {
                    showToast("Link copied to clipboard!");
                }
            });
            actionsEl.appendChild(shareBtn);
        }

        overlay.classList.add("is-open");
        overlay.setAttribute("aria-hidden", "false");
        closeBtn.focus();

        // Trigger dynamic animations inside modal
        animateModalArchitecture(overlay);
    };

    const closeModal = () => {
        if (!overlay.classList.contains("is-open")) return;
        overlay.classList.remove("is-open");
        overlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = previousBodyOverflow;
        if (lastFocusedElement) {
            lastFocusedElement.focus();
            lastFocusedElement = null;
        }
    };

    document.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const detailButton = target.closest(".project-detail-btn");
        if (detailButton) {
            event.preventDefault();
            const index = Number(detailButton.getAttribute("data-project") || 0);
            openModal(index);
            return;
        }

        if (target === overlay || target.closest("#project-modal-close")) {
            event.preventDefault();
            closeModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && overlay.classList.contains("is-open")) {
            closeModal();
        }
    });
};
