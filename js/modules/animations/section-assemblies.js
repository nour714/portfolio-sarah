/**
 * Section Convergence Assemblies & Hero Entrance
 * Cinema-grade Choreography System ("تتجمع قدامي")
 * Clean Architecture - Presentation / Animations Layer
 */

import { getMediaMatch } from "../../core/utils.js";

/**
 * Helper: Responsive scatter and spread factor
 */
export const getSpreadFactor = () => {
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth < 960 && !isMobile;
    return isMobile ? 0.45 : isTablet ? 0.75 : 1.0;
};

/**
 * Initializes Cinematic Hero Entrance Sequence
 */
export const initHeroCinematicEntrance = () => {
    const hero = document.getElementById("hero");
    if (!hero) return;

    // If hero intro video is present, assembly orchestration is managed by initHeroIntro
    if (document.getElementById("hero-intro-video")) {
        return;
    }

    const reduceMotion = getMediaMatch("(prefers-reduced-motion: reduce)");

    if (reduceMotion || !window.gsap) {
        hero.querySelectorAll(".reveal, .hero-text, .hero-copy, .hero-actions, .hero-visual, .hero-portrait-frame").forEach((el) => {
            el.classList.add("is-visible");
        });
        const header = document.querySelector(".site-header");
        if (header) {
            header.style.opacity = "1";
            header.style.transform = "none";
        }
        return;
    }

    const playHeroEntrance = () => {
        const gsap = window.gsap;
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        // Ensure containers are primed and visible
        gsap.set(".hero-content", { visibility: "visible", autoAlpha: 1 });

        // 1. Luxury Navbar descent
        tl.fromTo(
            ".site-header",
            { y: -26, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.95, ease: "power3.out" },
            0
        )
        // 2. Status Pill glide
        .fromTo(
            ".hero-status-pill",
            { y: 24, autoAlpha: 0, scale: 0.94 },
            { y: 0, autoAlpha: 1, scale: 1, duration: 0.8, ease: "power3.out" },
            0.12
        )
        // 3. Greeting & Highlight Name with luxury blur-to-sharp reveal
        .fromTo(
            [".hero-greeting", ".hero-name-highlight"],
            { y: 42, autoAlpha: 0, filter: "blur(12px)" },
            { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 1.05, stagger: 0.12, ease: "power4.out" },
            0.22
        )
        // 4. Role Typing Capsule
        .fromTo(
            ".hero-role",
            { y: 24, autoAlpha: 0, filter: "blur(6px)" },
            { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.85, ease: "power3.out" },
            0.42
        )
        // 5. Bio Description
        .fromTo(
            ".hero-copy",
            { y: 24, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out" },
            0.52
        )
        // 6. Social Links staggered spring pop
        .fromTo(
            ".hero-social-link",
            { y: 20, autoAlpha: 0, scale: 0.8 },
            { y: 0, autoAlpha: 1, scale: 1, duration: 0.7, stagger: 0.08, ease: "back.out(1.7)", clearProps: "transform" },
            0.64
        )
        // 7. CTA Buttons
        .fromTo(
            ".hero-actions .hero-btn",
            { y: 22, autoAlpha: 0, scale: 0.96 },
            { y: 0, autoAlpha: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" },
            0.74
        )
        // 8. Dual Halo Ambient Glows blooming softly
        .fromTo(
            [".hero-visual-glow-primary", ".hero-visual-glow-secondary"],
            { scale: 0.75, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: 1.5, stagger: 0.15, ease: "power2.out" },
            0.18
        )
        // 9. Portrait Visual Frame Entrance with editorial blur-to-sharp
        .fromTo(
            ".hero-portrait-frame",
            { y: 46, scale: 0.93, autoAlpha: 0, filter: "blur(12px)" },
            {
                y: 0,
                scale: 1,
                autoAlpha: 1,
                filter: "blur(0px)",
                duration: 1.35,
                ease: "power3.out",
                onComplete: () => {
                    if (!reduceMotion) {
                        gsap.to(".hero-portrait-frame", {
                            y: -8,
                            duration: 3.6,
                            repeat: -1,
                            yoyo: true,
                            ease: "sine.inOut"
                        });
                    }
                }
            },
            0.28
        );
    };

    playHeroEntrance();
};

/**
 * About Section Convergence Assembly
 */
export const initAboutAssembly = () => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    const aboutPanel = document.querySelector(".about-panel");
    if (!aboutPanel) return;

    let assemblyTimeline = null;
    const aboutVisual = document.querySelector(".about-visual");
    const aboutVisualGlow = document.querySelector(".about-visual-glow");
    const aboutRobot = document.querySelector(".about-layer-robot");
    const aboutSarah = document.querySelector(".about-layer-sarah");
    const aboutTopline = document.querySelectorAll(".about-status, .about-location");
    const aboutCopy = document.querySelector(".about-copy");
    const aboutGroupCards = document.querySelectorAll(".about-group-card");

    const resetAssembly = () => {
        if (assemblyTimeline) {
            assemblyTimeline.kill();
            assemblyTimeline = null;
        }
        aboutPanel.classList.add("is-assembling");
        const factor = getSpreadFactor();

        if (aboutRobot && aboutSarah) {
            // Robot comes from the left with cinematic blur & dynamic counter-tilt
            gsap.set(aboutRobot, {
                x: -95 * factor,
                y: 10 * factor,
                scale: 0.92,
                rotationZ: -3.5,
                opacity: 0,
                filter: "blur(14px)"
            });
            // Sarah comes from the right with cinematic blur & natural tilt
            gsap.set(aboutSarah, {
                x: 95 * factor,
                y: 10 * factor,
                scale: 0.92,
                rotationZ: 3.5,
                opacity: 0,
                filter: "blur(14px)"
            });
        } else if (aboutVisual) {
            gsap.set(aboutVisual, {
                x: -70 * factor,
                y: 15 * factor,
                scale: 0.88,
                rotation: -3,
                opacity: 0,
                filter: "blur(12px)"
            });
        }
        if (aboutVisualGlow) {
            gsap.set(aboutVisualGlow, { scale: 0.25, opacity: 0 });
        }
        if (aboutTopline.length) {
            gsap.set(aboutTopline, { y: -24 * factor, opacity: 0, scale: 0.9, filter: "blur(6px)" });
        }
        if (aboutCopy) {
            gsap.set(aboutCopy, { y: 35 * factor, opacity: 0, filter: "blur(6px)" });
        }
        if (aboutGroupCards.length) {
            gsap.set(aboutGroupCards, { y: 24 * factor, opacity: 0, filter: "blur(5px)" });
        }
    };

    const playAssembly = () => {
        if (assemblyTimeline) assemblyTimeline.kill();
        aboutPanel.classList.add("is-assembling");

        assemblyTimeline = gsap.timeline({
            id: "about-convergence-assembly-timeline",
            onComplete: () => {
                aboutPanel.classList.remove("is-assembling");
                if (aboutRobot && aboutSarah) {
                    gsap.set([aboutRobot, aboutSarah], { clearProps: "transform,filter,opacity" });
                } else if (aboutVisual) {
                    gsap.set(aboutVisual, { clearProps: "transform,filter,opacity" });
                }
                if (aboutTopline.length) gsap.set(aboutTopline, { clearProps: "transform,filter,opacity" });
                if (aboutCopy) gsap.set(aboutCopy, { clearProps: "transform,filter,opacity" });
                if (aboutGroupCards.length) gsap.set(aboutGroupCards, { clearProps: "transform,filter,opacity" });
            }
        });

        if (aboutRobot && aboutSarah) {
            // 1. Robot glides in from the left and settles
            assemblyTimeline.to(
                aboutRobot,
                {
                    x: 0,
                    y: 0,
                    scale: 1,
                    rotationZ: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 1.25,
                    ease: "power4.out"
                },
                0.05
            );
            // 2. Sarah glides in from the right and locks in seamlessly
            assemblyTimeline.to(
                aboutSarah,
                {
                    x: 0,
                    y: 0,
                    scale: 1,
                    rotationZ: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 1.25,
                    ease: "power4.out"
                },
                0.08
            );
        } else if (aboutVisual) {
            assemblyTimeline.to(
                aboutVisual,
                {
                    x: 0,
                    y: 0,
                    scale: 1,
                    rotation: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 1.1,
                    ease: "power4.out"
                },
                0.05
            );
        }

        if (aboutVisualGlow) {
            assemblyTimeline.to(
                aboutVisualGlow,
                {
                    scale: 1,
                    opacity: 1,
                    duration: 1.4,
                    ease: "power2.out"
                },
                0.15
            );
        }

        if (aboutTopline.length) {
            assemblyTimeline.to(
                aboutTopline,
                {
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 0.75,
                    stagger: 0.08,
                    ease: "power3.out"
                },
                0.25
            );
        }

        if (aboutCopy) {
            assemblyTimeline.to(
                aboutCopy,
                {
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 0.9,
                    ease: "power3.out"
                },
                0.35
            );
        }

        if (aboutGroupCards.length) {
            assemblyTimeline.to(
                aboutGroupCards,
                {
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 0.8,
                    stagger: 0.08,
                    ease: "power3.out"
                },
                0.45
            );
        }
    };

    resetAssembly();

    ScrollTrigger.create({
        id: "cinematic-reveal-about-assembly",
        trigger: aboutPanel,
        start: "top 85%",
        end: "bottom 15%",
        onEnter: playAssembly,
        onEnterBack: playAssembly,
        onLeaveBack: resetAssembly
    });

    if (ScrollTrigger.isInViewport(aboutPanel, 0.15)) {
        playAssembly();
    }
};

/**
 * Projects Section Convergence Assembly
 */
export const initProjectsAssembly = () => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    const projectsSection = document.getElementById("projects");
    if (!projectsSection) return;

    let assemblyTimeline = null;
    const projectsShell = projectsSection.querySelector(".projects-shell");
    const underline = projectsSection.querySelector(".projects-underline");
    const copyEl = projectsSection.querySelector(".projects-copy");
    const filters = projectsSection.querySelectorAll(".project-filter");
    const sideIndicator = document.getElementById("projects-side-indicator");

    const getFirstCardElements = () => {
        const firstCard = projectsSection.querySelector(".project-card-wrapper:not(.is-hidden)");
        if (!firstCard) return { firstCard: null, contentCol: null, previewCol: null, tags: [] };
        const contentCol = firstCard.querySelector(".project-content-col");
        const previewCol = firstCard.querySelector(".project-preview-col");
        const tags = Array.from(firstCard.querySelectorAll(".project-tech-tags li"));
        return { firstCard, contentCol, previewCol, tags };
    };

    const resetAssembly = () => {
        if (assemblyTimeline) {
            assemblyTimeline.kill();
            assemblyTimeline = null;
        }
        if (projectsShell) projectsShell.classList.add("is-assembling");
        const factor = getSpreadFactor();

        if (underline) {
            gsap.set(underline, { scaleX: 0, transformOrigin: "center" });
        }
        if (copyEl) {
            gsap.set(copyEl, { y: 22 * factor, opacity: 0, filter: "blur(6px)" });
        }
        if (filters.length) {
            filters.forEach((btn, i) => {
                const dir = (i - (filters.length - 1) / 2);
                gsap.set(btn, {
                    x: dir * 35 * factor,
                    y: 15 * factor,
                    scale: 0.88,
                    opacity: 0
                });
            });
        }
        if (sideIndicator) {
            gsap.set(sideIndicator, { x: -45, opacity: 0 });
        }

        const { contentCol, previewCol, tags } = getFirstCardElements();
        if (contentCol) {
            gsap.set(contentCol, {
                x: -60 * factor,
                opacity: 0,
                filter: "blur(10px)"
            });
        }
        if (previewCol) {
            gsap.set(previewCol, {
                x: 60 * factor,
                scale: 0.9,
                opacity: 0,
                filter: "blur(10px)"
            });
        }
        if (tags.length) {
            gsap.set(tags, { scale: 0.75, opacity: 0 });
        }
    };

    const playAssembly = () => {
        if (assemblyTimeline) assemblyTimeline.kill();
        if (projectsShell) projectsShell.classList.add("is-assembling");

        const { contentCol, previewCol, tags } = getFirstCardElements();

        assemblyTimeline = gsap.timeline({
            id: "projects-convergence-assembly-timeline",
            onComplete: () => {
                if (projectsShell) projectsShell.classList.remove("is-assembling");
                if (underline) gsap.set(underline, { clearProps: "transform" });
                if (copyEl) gsap.set(copyEl, { clearProps: "transform,filter,opacity" });
                if (filters.length) gsap.set(filters, { clearProps: "transform,opacity" });
                if (sideIndicator) gsap.set(sideIndicator, { clearProps: "transform,opacity" });
                if (contentCol) gsap.set(contentCol, { clearProps: "transform,filter,opacity" });
                if (previewCol) gsap.set(previewCol, { clearProps: "transform,filter,opacity" });
                if (tags.length) gsap.set(tags, { clearProps: "transform,opacity" });
            }
        });

        if (underline) {
            assemblyTimeline.to(
                underline,
                { scaleX: 1, duration: 0.75, ease: "power3.out" },
                0
            );
        }

        if (copyEl) {
            assemblyTimeline.to(
                copyEl,
                { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.7, ease: "power3.out" },
                0.08
            );
        }

        if (filters.length) {
            assemblyTimeline.to(
                filters,
                {
                    x: 0,
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    duration: 0.65,
                    stagger: 0.05,
                    ease: "back.out(1.5)"
                },
                0.15
            );
        }

        if (sideIndicator) {
            assemblyTimeline.to(
                sideIndicator,
                { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
                0.2
            );
        }

        if (contentCol) {
            assemblyTimeline.to(
                contentCol,
                {
                    x: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 0.9,
                    ease: "power4.out"
                },
                0.22
            );
        }

        if (previewCol) {
            assemblyTimeline.to(
                previewCol,
                {
                    x: 0,
                    scale: 1,
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 0.95,
                    ease: "power4.out"
                },
                0.25
            );
        }

        if (tags.length) {
            assemblyTimeline.to(
                tags,
                {
                    scale: 1,
                    opacity: 1,
                    duration: 0.45,
                    stagger: 0.04,
                    ease: "back.out(1.8)"
                },
                0.55
            );
        }
    };

    resetAssembly();

    ScrollTrigger.create({
        id: "cinematic-reveal-projects-assembly",
        trigger: projectsSection,
        start: "top 80%",
        end: "bottom 15%",
        onEnter: playAssembly,
        onEnterBack: playAssembly,
        onLeaveBack: resetAssembly
    });

    if (ScrollTrigger.isInViewport(projectsSection, 0.15)) {
        playAssembly();
    }
};

/**
 * Certificates Section Convergence Assembly
 */
export const initCertificatesAssembly = () => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    const certsSection = document.getElementById("certificates");
    if (!certsSection) return;

    let assemblyTimeline = null;
    const certsShell = certsSection.querySelector(".certificates-shell");
    const underline = certsSection.querySelector(".certificates-underline");
    const copyEl = certsSection.querySelector(".certificates-copy");
    const filters = certsSection.querySelectorAll(".certificate-filter");
    const sideIndicator = document.getElementById("certificates-side-indicator");

    const getFirstCardElements = () => {
        const firstCard = certsSection.querySelector(".certificate-card-wrapper:not(.is-hidden)");
        if (!firstCard) return { firstCard: null, headerEl: null, frameEl: null, badgeEl: null };
        const headerEl = firstCard.querySelector(".certificate-card-header");
        const frameEl = firstCard.querySelector(".certificate-browser-frame");
        const badgeEl = firstCard.querySelector(".certificate-badge");
        return { firstCard, headerEl, frameEl, badgeEl };
    };

    const resetAssembly = () => {
        if (assemblyTimeline) {
            assemblyTimeline.kill();
            assemblyTimeline = null;
        }
        if (certsShell) certsShell.classList.add("is-assembling");
        const factor = getSpreadFactor();

        if (underline) {
            gsap.set(underline, { scaleX: 0, transformOrigin: "center" });
        }
        if (copyEl) {
            gsap.set(copyEl, { y: 22 * factor, opacity: 0, filter: "blur(6px)" });
        }
        if (filters.length) {
            filters.forEach((btn, i) => {
                const dir = (i - (filters.length - 1) / 2);
                gsap.set(btn, {
                    x: dir * 35 * factor,
                    y: 15 * factor,
                    scale: 0.88,
                    opacity: 0
                });
            });
        }
        if (sideIndicator) {
            gsap.set(sideIndicator, { x: -45, opacity: 0 });
        }

        const { headerEl, frameEl, badgeEl } = getFirstCardElements();
        if (headerEl) {
            gsap.set(headerEl, { y: -30 * factor, opacity: 0, filter: "blur(8px)" });
        }
        if (frameEl) {
            gsap.set(frameEl, { y: 45 * factor, scale: 0.9, opacity: 0, filter: "blur(10px)" });
        }
        if (badgeEl) {
            gsap.set(badgeEl, { scale: 0.6, opacity: 0 });
        }
    };

    const playAssembly = () => {
        if (assemblyTimeline) assemblyTimeline.kill();
        if (certsShell) certsShell.classList.add("is-assembling");

        const { headerEl, frameEl, badgeEl } = getFirstCardElements();

        assemblyTimeline = gsap.timeline({
            id: "certificates-convergence-assembly-timeline",
            onComplete: () => {
                if (certsShell) certsShell.classList.remove("is-assembling");
                if (underline) gsap.set(underline, { clearProps: "transform" });
                if (copyEl) gsap.set(copyEl, { clearProps: "transform,filter,opacity" });
                if (filters.length) gsap.set(filters, { clearProps: "transform,opacity" });
                if (sideIndicator) gsap.set(sideIndicator, { clearProps: "transform,opacity" });
                if (headerEl) gsap.set(headerEl, { clearProps: "transform,filter,opacity" });
                if (frameEl) gsap.set(frameEl, { clearProps: "transform,filter,opacity" });
                if (badgeEl) gsap.set(badgeEl, { clearProps: "transform,opacity" });
            }
        });

        if (underline) {
            assemblyTimeline.to(
                underline,
                { scaleX: 1, duration: 0.75, ease: "power3.out" },
                0
            );
        }

        if (copyEl) {
            assemblyTimeline.to(
                copyEl,
                { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.7, ease: "power3.out" },
                0.08
            );
        }

        if (filters.length) {
            assemblyTimeline.to(
                filters,
                {
                    x: 0,
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    duration: 0.65,
                    stagger: 0.05,
                    ease: "back.out(1.5)"
                },
                0.15
            );
        }

        if (sideIndicator) {
            assemblyTimeline.to(
                sideIndicator,
                { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
                0.2
            );
        }

        if (headerEl) {
            assemblyTimeline.to(
                headerEl,
                {
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 0.75,
                    ease: "back.out(1.3)"
                },
                0.22
            );
        }

        if (frameEl) {
            assemblyTimeline.to(
                frameEl,
                {
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 0.85,
                    ease: "back.out(1.2)"
                },
                0.25
            );
        }

        if (badgeEl) {
            assemblyTimeline.to(
                badgeEl,
                {
                    scale: 1,
                    opacity: 1,
                    duration: 0.45,
                    ease: "back.out(1.8)"
                },
                0.6
            );
        }
    };

    resetAssembly();

    ScrollTrigger.create({
        id: "cinematic-reveal-certificates-assembly",
        trigger: certsSection,
        start: "top 80%",
        end: "bottom 15%",
        onEnter: playAssembly,
        onEnterBack: playAssembly,
        onLeaveBack: resetAssembly
    });

    if (ScrollTrigger.isInViewport(certsSection, 0.15)) {
        playAssembly();
    }
};

/**
 * Contact Section Convergence Assembly
 */
export const initContactAssembly = () => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    const contactSection = document.getElementById("contact");
    if (!contactSection) return;

    let assemblyTimeline = null;
    const contactGrid = contactSection.querySelector(".contact-grid");
    const contactPanel = contactSection.querySelector(".contact-panel");
    const contactItems = contactSection.querySelectorAll(".contact-item");
    const contactAvailability = contactSection.querySelector(".contact-availability");
    const contactForm = document.getElementById("contact-form");
    const formFields = contactForm?.querySelectorAll(".contact-field, .contact-form-footer");
    const contactCopy = contactSection.querySelector(".contact-copy");

    const resetAssembly = () => {
        if (assemblyTimeline) {
            assemblyTimeline.kill();
            assemblyTimeline = null;
        }
        if (contactGrid) contactGrid.classList.add("is-assembling");
        const factor = getSpreadFactor();

        if (contactCopy) {
            gsap.set(contactCopy, { y: 20 * factor, opacity: 0, filter: "blur(6px)" });
        }
        if (contactPanel) {
            gsap.set(contactPanel, {
                x: -70 * factor,
                scale: 0.9,
                opacity: 0,
                filter: "blur(10px)"
            });
        }
        if (contactForm) {
            gsap.set(contactForm, {
                x: 70 * factor,
                scale: 0.9,
                opacity: 0,
                filter: "blur(10px)"
            });
        }
        if (contactItems.length) {
            contactItems.forEach((item, i) => {
                gsap.set(item, {
                    x: -25 * factor,
                    scale: 0.9,
                    opacity: 0
                });
            });
        }
        if (contactAvailability) {
            gsap.set(contactAvailability, { y: 20 * factor, opacity: 0 });
        }
        if (formFields && formFields.length) {
            gsap.set(formFields, { y: 18 * factor, opacity: 0, filter: "blur(4px)" });
        }
    };

    const playAssembly = () => {
        if (assemblyTimeline) assemblyTimeline.kill();
        if (contactGrid) contactGrid.classList.add("is-assembling");

        assemblyTimeline = gsap.timeline({
            id: "contact-convergence-assembly-timeline",
            onComplete: () => {
                if (contactGrid) contactGrid.classList.remove("is-assembling");
                if (contactCopy) gsap.set(contactCopy, { clearProps: "transform,filter,opacity" });
                if (contactPanel) gsap.set(contactPanel, { clearProps: "transform,filter,opacity" });
                if (contactItems.length) gsap.set(contactItems, { clearProps: "transform,opacity" });
                if (contactAvailability) gsap.set(contactAvailability, { clearProps: "transform,opacity" });
                if (contactForm) gsap.set(contactForm, { clearProps: "transform,filter,opacity" });
                if (formFields && formFields.length) gsap.set(formFields, { clearProps: "transform,filter,opacity" });
            }
        });

        if (contactCopy) {
            assemblyTimeline.to(
                contactCopy,
                { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.65, ease: "power3.out" },
                0
            );
        }

        if (contactPanel) {
            assemblyTimeline.to(
                contactPanel,
                {
                    x: 0,
                    scale: 1,
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 0.9,
                    ease: "back.out(1.2)"
                },
                0.08
            );
        }

        if (contactForm) {
            assemblyTimeline.to(
                contactForm,
                {
                    x: 0,
                    scale: 1,
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 0.9,
                    ease: "back.out(1.2)"
                },
                0.08
            );
        }

        if (contactItems.length) {
            assemblyTimeline.to(
                contactItems,
                {
                    x: 0,
                    scale: 1,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.07,
                    ease: "back.out(1.4)"
                },
                0.28
            );
        }

        if (contactAvailability) {
            assemblyTimeline.to(
                contactAvailability,
                { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
                0.5
            );
        }

        if (formFields && formFields.length) {
            assemblyTimeline.to(
                formFields,
                {
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 0.55,
                    stagger: 0.06,
                    ease: "power3.out"
                },
                0.3
            );
        }
    };

    resetAssembly();

    const triggerEl = contactGrid || contactSection;
    ScrollTrigger.create({
        id: "cinematic-reveal-contact-assembly",
        trigger: triggerEl,
        start: "top 82%",
        end: "bottom 18%",
        onEnter: playAssembly,
        onEnterBack: playAssembly,
        onLeaveBack: resetAssembly
    });

    if (ScrollTrigger.isInViewport(triggerEl, 0.15)) {
        playAssembly();
    }
};

/**
 * Footer Section Convergence Assembly
 */
export const initFooterAssembly = () => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    const footer = document.querySelector(".portfolio-footer");
    if (!footer) return;

    const footerElements = footer.querySelectorAll(".portfolio-footer-brand, .portfolio-footer-socials, .portfolio-footer-copy");
    if (!footerElements.length) return;

    const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
        gsap.set(footerElements, { clearProps: "all" });
        return;
    }

    let footerTimeline = null;

    const resetAssembly = () => {
        if (footerTimeline) {
            footerTimeline.kill();
            footerTimeline = null;
        }
        gsap.set(footerElements, { y: 28, opacity: 0, filter: "blur(6px)" });
    };

    const playAssembly = () => {
        if (footerTimeline) footerTimeline.kill();
        footerTimeline = gsap.to(footerElements, {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.75,
            stagger: 0.08,
            ease: "expo.out",
            onComplete: () => {
                gsap.set(footerElements, { clearProps: "transform,filter,opacity" });
            }
        });
    };

    resetAssembly();

    ScrollTrigger.create({
        id: "cinematic-reveal-footer-assembly",
        trigger: footer,
        start: "top 95%",
        onEnter: playAssembly,
        onEnterBack: playAssembly,
        onLeaveBack: resetAssembly
    });

    // Failsafe: if footer is already partially visible on screen upon initialization, play immediately
    if (ScrollTrigger.isInViewport(footer, 0.1)) {
        playAssembly();
    }
};
