/**
 * UI Animations & Interactions Module
 * Cinematic GSAP + ScrollTrigger + Lenis Motion System
 * Clean Architecture - Presentation / UI Layer
 */

import { getMediaMatch } from "../core/utils.js";

/**
 * Splits text into words wrapped in masks for luxury editorial reveals
 * Preserves full accessibility via aria-label
 */
const splitWordsForReveal = (element) => {
    if (!element || element.dataset.motionSplit === "true") return;

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
 * Initializes Lenis Smooth Scrolling engine synchronized with GSAP Ticker
 */
export const initLenis = () => {
    const reduceMotion = getMediaMatch("(prefers-reduced-motion: reduce)");
    if (reduceMotion || typeof window.Lenis === "undefined") {
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

/**
 * Initializes Cinematic Hero Entrance Sequence
 */
export const initHeroCinematicEntrance = () => {
    const reduceMotion = getMediaMatch("(prefers-reduced-motion: reduce)");
    const hero = document.getElementById("hero");
    if (!hero) return;

    if (reduceMotion || !window.gsap) {
        hero.querySelectorAll(".reveal, .hero-text, .hero-copy, .hero-actions").forEach((el) => {
            el.classList.add("is-visible");
        });
        return;
    }

    const playHeroEntrance = () => {
        const tl = window.gsap.timeline({ defaults: { ease: "power4.out" } });

        const mlbgStage = document.getElementById("mlbg-stage");
        if (mlbgStage) {
            tl.fromTo(
                mlbgStage,
                { opacity: 0.2 },
                { opacity: 1, duration: 1.6, ease: "power2.out" },
                0
            );
        }

        tl.fromTo(
                ".hero-status-pill",
                { y: 20, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.75 },
                0.1
            )
            .fromTo(
                ".hero-text h1",
                { y: 35, autoAlpha: 0, filter: "blur(8px)" },
                { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 1 },
                0.2
            )
            .fromTo(
                ".hero-role",
                { y: 22, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.85 },
                0.35
            )
            .fromTo(
                ".hero-copy",
                { y: 20, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.9 },
                0.45
            )
            .fromTo(
                ".hero-social-link",
                { y: 16, autoAlpha: 0, scale: 0.9 },
                { y: 0, autoAlpha: 1, scale: 1, duration: 0.65, stagger: 0.06 },
                0.6
            )
            .fromTo(
                ".hero-actions .hero-btn",
                { y: 20, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.75, stagger: 0.08 },
                0.7
            );
    };

    const introScreen = document.getElementById("ai-intro-screen");
    if (introScreen) {
        window.addEventListener("ai-intro-finished", playHeroEntrance, { once: true });
        // Failsafe in case intro is skipped or takes long
        setTimeout(() => {
            if (!introScreen.isConnected) playHeroEntrance();
        }, 3200);
    } else {
        playHeroEntrance();
    }
};

/**
 * Initializes Cinematic Scroll Reveals using GSAP ScrollTrigger
 */
export const initScrollReveal = () => {
    const reducedMotion = getMediaMatch("(prefers-reduced-motion: reduce)");
    const revealItems = new Set();

    // Ensure all target elements are tracked for visibility
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
    collectRevealTargets(".certificates-headline, .certificates-copy, .certificates-filters, .certificate-card");
    collectRevealTargets(".experience-header, .experience-metrics, .experience-card");
    collectRevealTargets(".contact-header, .contact-panel, .contact-form, .contact-item");

    const items = Array.from(revealItems);
    if (!items.length) return;

    if (reducedMotion || typeof window.IntersectionObserver !== "function") {
        items.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    // Infallible IntersectionObserver: guarantees every reveal element becomes visible
    const observer = new IntersectionObserver(
        (entries, activeObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                activeObserver.unobserve(entry.target);
            });
        },
        { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach((item) => observer.observe(item));

    window.__refreshScrollReveal = () => {
        const nextItems = Array.from(document.querySelectorAll(".reveal:not(.is-visible)"));
        nextItems.forEach((item) => observer.observe(item));
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    };

    // If GSAP & ScrollTrigger are loaded, layer cinematic motion flourishes!
    if (window.gsap && window.ScrollTrigger) {
        const gsap = window.gsap;
        const ScrollTrigger = window.ScrollTrigger;

        // 1. Staggered Headline Word Reveals
        const headings = [
            "#about-title",
            "#skills-title",
            "#projects-title",
            "#certificates-title",
            "#experience-title",
            "#contact-title"
        ];

        headings.forEach((sel) => {
            const titleEl = document.querySelector(sel);
            if (!titleEl) return;
            splitWordsForReveal(titleEl);
            const words = titleEl.querySelectorAll(".motion-word");
            if (!words.length) return;

            gsap.fromTo(
                words,
                { yPercent: 40, autoAlpha: 0, filter: "blur(4px)" },
                {
                    yPercent: 0,
                    autoAlpha: 1,
                    filter: "blur(0px)",
                    duration: 0.8,
                    ease: "power3.out",
                    stagger: 0.035,
                    scrollTrigger: {
                        trigger: titleEl,
                        start: "top 90%",
                        once: true
                    }
                }
            );
        });

        // 2. Subtle Parallax on about visual backdrop
        gsap.to(".about-visual-backdrop, .about-visual-glow", {
            yPercent: 12,
            ease: "none",
            scrollTrigger: {
                trigger: ".about",
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2
            }
        });

        // 3. Parallax background video in hero
        const heroBgVideo = document.querySelector(".hero-background-video");
        if (heroBgVideo) {
            gsap.to(heroBgVideo, {
                yPercent: 18,
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero",
                    start: "top top",
                    end: "bottom top",
                    scrub: 1.2
                }
            });
        }

        // 4. Staggered Batch Entrance for All Cards Across the Site
        const batchReveal = (selector, start = "top 88%", stagger = 0.07) => {
            ScrollTrigger.batch(selector, {
                start,
                once: true,
                onEnter: (batch) => {
                    gsap.fromTo(
                        batch,
                        { y: 32, autoAlpha: 0, filter: "blur(6px)", scale: 0.98 },
                        {
                            y: 0,
                            autoAlpha: 1,
                            filter: "blur(0px)",
                            scale: 1,
                            duration: 0.85,
                            ease: "power4.out",
                            stagger,
                            overwrite: "auto",
                            onComplete: () => {
                                batch.forEach((el) => el.classList.add("is-visible"));
                            }
                        }
                    );
                }
            });
        };

        batchReveal(".project-card-wrapper", "top 88%", 0.08);
        batchReveal(".certificate-card-wrapper", "top 88%", 0.08);
        batchReveal(".skill-group", "top 88%", 0.07);
        batchReveal(".experience-card", "top 88%", 0.08);
        batchReveal(".contact-item", "top 90%", 0.06);
        batchReveal(".stat-card", "top 90%", 0.07);
        batchReveal(".skills-metric", "top 90%", 0.06);

        // Refresh triggers on intro finish and load
        const handleRefresh = () => {
            requestAnimationFrame(() => {
                ScrollTrigger.refresh();
                if (window.__lenis) window.__lenis.resize();
            });
        };

        window.addEventListener("load", handleRefresh);
        window.addEventListener("ai-intro-finished", () => {
            handleRefresh();
            setTimeout(handleRefresh, 850);
        });
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

/**
 * Initializes Scroll Progress Bar tied to ScrollTrigger
 */
export const initScrollProgressBar = () => {
    const bar = document.getElementById("scroll-progress-bar");
    if (!bar) return;

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
 * Initializes Authentic MacBook macOS Custom Cursor System
 */
export const initCustomCursor = () => {
    // Skip on touch screens or small devices
    if (window.matchMedia("(pointer: coarse), (max-width: 768px)").matches) return;
    if (getMediaMatch("(prefers-reduced-motion: reduce)")) return;

    // Clean up legacy dot/ring elements if present
    document.querySelectorAll(".cursor-dot, .cursor-ring").forEach(el => el.remove());

    let cursor = document.querySelector(".macos-cursor");

    if (!cursor) {
        cursor = document.createElement("div");
        cursor.className = "macos-cursor";
        cursor.setAttribute("aria-hidden", "true");
        cursor.innerHTML = `
            <div class="macos-cursor-sheen"></div>
            <div class="macos-cursor-icon macos-cursor-arrow">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <filter id="mac-arrow-filter-dyn" x="-30%" y="-30%" width="180%" height="180%">
                            <feDropShadow dx="0.6" dy="1.4" stdDeviation="1.1" flood-color="#000000" flood-opacity="0.45"/>
                        </filter>
                    </defs>
                    <g filter="url(#mac-arrow-filter-dyn)" fill="none" fill-rule="evenodd" transform="translate(2 2)">
                        <path d="M6.148 18.473l1.863-1.003 1.615-.839-2.568-4.816h4.332L0.011 0.407v16.015l3.316-3.221z" fill="#FFFFFF"/>
                        <path d="M6.431 17l1.765-.941-2.775-5.202h3.604L1 2.814v11.188l2.53-2.442z" fill="#000000"/>
                    </g>
                </svg>
            </div>
            <div class="macos-cursor-icon macos-cursor-hand">
                <svg viewBox="0 0 28 30" width="28" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <filter id="mac-hand-filter-dyn" x="-30%" y="-30%" width="180%" height="180%">
                            <feDropShadow dx="0.6" dy="1.4" stdDeviation="1.1" flood-color="#000000" flood-opacity="0.45"/>
                        </filter>
                    </defs>
                    <g filter="url(#mac-hand-filter-dyn)" fill="none" fill-rule="evenodd" transform="translate(1 2)">
                        <path d="m3.885 13.552c.15.136.254.233.575.538.314.298.466.439.605.557.058.049.107.18.127.373.016.16.01.338-.009.509-.007.06-.013.102-.017.123-.042.228.132.44.365.442.21.002.37.005.797.012.107.002.107.002.214.004 1.16.02 1.753.014 2.178-.04.455-.056.923-.605 1.328-1.294.343.61.818 1.205 1.299 1.282.152.025.337.032.551.027.16-.003.328-.014.499-.029.128-.012.23-.023.292-.031.226-.03.373-.252.313-.472-.013-.047-.034-.134-.055-.244-.025-.127-.042-.251-.05-.364-.005-.072-.006-.137-.003-.193.006-.098.007-.152.01-.279.001-.047.001-.047.003-.088.005-.135.023-.263.082-.542.025-.122.147-.354.34-.641.057-.085.12-.174.186-.266.128-.175.265-.352.402-.521.082-.101.145-.177.18-.218.297-.424.613-1.12.729-1.525.111-.39.2-.1.11.255-1.816.03-.4.041-.724.041-1.231 0-.089 0-.089 0-.162 0-.12.001-.166 0-.222-.001-.154-.006-.306-.02-.694-.032-.814-.478-1.34-1.135-1.441-.559-.087-1.24.378-1.24.378s-.15-.523-.253-.684c-.166-.26-.594-.59-.922-.655-.336-.065-.735-.058-1.101.007-.321.057-.64.344-.825.653-.133.22-.008-.012-.14-.24-.183-.314-.61-.595-1.016-.678-.344-.071-.738-.044-1.098.063-.463.138-.536.49-.555.39-.061-.339-.067-.317-.105-.558-.143-.895-.303-1.514-.545-2.055.014.031-.088-.202-.126-.282-.064-.14-.129-.266-.2-.387-.218-.374-.468-.654-.783-.812-.545-.277-1.363-.142-1.751.31-.385.45-.449 1.202-.352 2.132.037.362.167 1.021.284 1.509.042.169.078.323.145.608.012.049.012.049.023.097.052.216.097.393.152.588-.006-.02.097.344.118.425.008.027.008.027.015.054.04.154.08.32.143.596.034.152.067.315.1.487.089.47.089.372.004.272-.06-.07-.115-.133-.169-.19-.1-.108-.191-.197-.278-.268-.635-.52-1.024-.748-1.557-.799-.876-.084-1.707.534-1.832 1.369-.076.512-.052.747.185 1.2.13.244.351.539.762 1.047.025.031.025.031.05.062.505.622.56.691.68.865.324.47 1.114 1.822 1.257 2.003z" fill="#000000"/>
                        <path d="m1.683 9.272c-.025-.031-.025-.031-.05-.062-.377-.466-.584-.743-.681-.925-.153-.292-.162-.372-.107-.738.065-.433.532-.78 1.019-.734.336.032.63.206 1.153.633.057.047.125.113.203.197.046.05.095.105.148.167.08.093.347.421.308.373.058.07.1.124.147.19.094.135.147.21.219.305-.034-.045.215.298.267.349.279.266.682.042.657-.313-.004-.059-.018-.123-.047-.234-.115-.82-.155-1.083-.247-1.568-.034-.18-.069-.351-.105-.512-.065-.286-.107-.46-.15-.625-.008-.029-.008-.029-.016-.057-.023-.085-.127-.455-.12-.43-.052-.185-.095-.354-.145-.562-.011-.047-.011-.047-.022-.095-.067-.283-.104-.442-.147-.613-.11-.456-.234-1.087-.267-1.408-.075-.724-.023-1.334.176-1.567.155-.181.596-.254.842-.129.162.082.323.262.475.522.057.098.112.204.167.323.033.073.133.299.122.274.21.47.355 1.03.488 1.867.039.247.088.528.15.871.019.102.019.102.038.203.301 1.636.279 1.512.283 1.642.016.476.718.487.749.012.01-.15.007-.285-.011-.671-.003-.055-.003-.055-.005-.11-.015-.355-.014-.56.007-.677.038-.212.229-.45.404-.502.247-.073.517-.092.733-.047.207.042.449.201.518.32.084.144.155.364.21.636.045.22.075.455.097.706.006.078.01.139.017.239.003.041.003.041.006.076.002.017.002.017.005.045.004.019.004.019.018.067.007.138.007.138.56.189.166-.2.166-.2.161-.235.027-.119.044-.25.068-.498.015-.162.022-.241.031-.323.037-.34.084-.556.141-.651.07-.118.32-.283.431-.303.281-.05.589-.055.827-.009.107.021.37.224.432.321.128.202.252.852.322 1.496-.011.043-.011.043.161.288.59-.068.59-.068.574-.174.015-.038.028-.082.045-.15.043-.16.071-.253.112-.357.029-.072.06-.133.091-.182.12-.19.433-.319.707-.277.294.046.482.267.5.729.014.381.018.527.02.671 0 .053 0 .095 0 .215 0 .074 0 .074 0 .164 0 .489-.011.794-.039 1.174-.051.653-.136 1.343-.229 1.667-.094.331-.376.951-.6 1.274-.015.015-.083.096-.17.203-.145.179-.29.365-.425.552-.073.1-.141.197-.204.291-.244.364-.4.66-.45.904-.067.317-.091.485-.098.667-.002.051-.002.051-.003.101-.002.118-.004.166-.009.252-.005.091-.004.188.004.289.01.146 0 .346 0 .346s-.127-.012-.268-.008c-.173.004-.316-.002-.415-.018-.143-.023-.53-.507-.727-.883-.303-.577-1.036-.549-1.337-.04-.272.462-.66.918-.775.932-.375.047-.955.053-2.072.033-.107-.002-.107-.002-.214-.004-.428-.007-.412.065-.403-.013.025-.22.022-.179 0-.4-.037-.369-.151-.67-.389-.87-.123-.104-.27-.241-.565-.521-.337-.32-.443-.42-.573-.534l-.801-.891c-.088-.112-.86-1.434-1.213-1.945-.137-.199-.188-.263-.714-.912z" fill="#FFFFFF"/>
                        <path d="m11.191 9.275v3.459c0 .5.75.5.75 0v-3.459c0-.5-.75-.5-.75 0zm-2.031 0l.016 3.473c.002.5.752.496.75-.004l-.016-3.473c-.002-.5-.752-.496-.75.004zm-1.209 3.454l-.021-3.426c-.003-.5-.753-.496-.75.004l.021 3.426c.003.5.753.496.75-.004z" fill="#FFFFFF"/>
                    </g>
                </svg>
            </div>
        `;
        document.body.appendChild(cursor);
    }

    let isVisible = false;

    // Direct, ultra-responsive 1:1 hardware synchronization
    if (window.gsap) {
        const gsap = window.gsap;
        const xTo = gsap.quickTo(cursor, "x", { duration: 0.02, ease: "power2.out" });
        const yTo = gsap.quickTo(cursor, "y", { duration: 0.02, ease: "power2.out" });

        window.addEventListener("mousemove", (e) => {
            xTo(e.clientX);
            yTo(e.clientY);
            if (!isVisible) {
                cursor.style.opacity = "1";
                isVisible = true;
            }
        }, { passive: true });
    } else {
        window.addEventListener("mousemove", (e) => {
            cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            if (!isVisible) {
                cursor.style.opacity = "1";
                isVisible = true;
            }
        }, { passive: true });
    }

    // Interactive target detection (Links, Buttons, Cards, Inputs, Modals)
    const hoverTargets = "a, button, [role='button'], input, select, textarea, .project-card, .certificate-card, .stat-card, .skill-chip, [data-magnetic], .filter-chip, .btn, .social-chip, .share-btn, .modal-close";

    document.addEventListener("mouseover", (e) => {
        if (e.target.closest(hoverTargets)) {
            cursor.classList.add("is-hovering");
        }
    }, { passive: true });

    document.addEventListener("mouseout", (e) => {
        if (e.target.closest(hoverTargets)) {
            cursor.classList.remove("is-hovering");
        }
    }, { passive: true });

    // Window In/Out Transitions
    document.addEventListener("mouseleave", () => {
        cursor.style.opacity = "0";
        isVisible = false;
    });

    document.addEventListener("mouseenter", () => {
        cursor.style.opacity = "1";
        isVisible = true;
    });

    // Mark body as having active MacBook cursor
    document.body.classList.add("has-macos-cursor");
};

/**
 * Initializes Back to Top Button with Lenis smooth scroll
 */
export const initBackToTop = () => {
    const btn = document.getElementById("back-to-top");
    if (!btn) return;

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

const boundMagnetic = new WeakSet();

/**
 * Initializes Fluid Magnetic Hover Interactions on primary buttons & icons
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
    if (getMediaMatch("(prefers-reduced-motion: reduce)") ||
        window.matchMedia("(pointer: coarse)").matches ||
        !window.gsap) {
        return;
    }

    const gsap = window.gsap;
    const CARD_SELECTOR = ".experience-card, .skill-card, .contact-item, .stat-card, .skills-metric, .about-node";
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

/**
 * Master Bootstrap for the Cinematic Motion System
 */
export const initCinematicMotionSystem = () => {
    initLenis();
    initHeroCinematicEntrance();
    initScrollReveal();
    initScrollProgressBar();
    initCustomCursor();
    initBackToTop();
    initCounterAnimation();
    initMagnetic();
    initCard3DTilt();
};
