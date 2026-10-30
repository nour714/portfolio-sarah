/**
 * Cinematic Scroll Orchestration System
 * Hero & About Multiplane Optical Parallax & 3D Spatial Depth
 * Clean Architecture - Presentation / Animations Layer
 */

import { getMediaMatch } from "../../core/utils.js";
import { getSpreadFactor } from "./section-assemblies.js";

/**
 * Initializes Cinematic Scroll Parallax for Hero and About sections
 */
export const initCinematicScroll = () => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    const reduceMotion = getMediaMatch("(prefers-reduced-motion: reduce)");
    if (reduceMotion) return;

    const factor = getSpreadFactor();
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const isTouch = Boolean(window.__perf && window.__perf.isTouch) || isCoarsePointer;
    const isLite = Boolean(window.__perf && window.__perf.lite);

    // -------------------------------------------------------------
    // 1. HERO SECTION CINEMATIC SCROLL PARALLAX (Camera Pull & Depth)
    // -------------------------------------------------------------
    const heroSection = document.getElementById("hero");
    const heroPortrait = document.querySelector(".hero-portrait-frame");
    const heroGlowPrimary = document.querySelector(".hero-visual-glow-primary");
    const heroGlowSecondary = document.querySelector(".hero-visual-glow-secondary");
    const heroVideoStage = document.getElementById("hero-video-stage");
    const heroText = document.querySelector(".hero-text");

    if (heroSection && heroPortrait) {
        if (isLite) {
            // Lite Devices: Clean one-shot entrance without scrubbed scroll math or pinning
            gsap.fromTo(
                heroPortrait,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
            );
        } else {
            // Multiplane scrubbed parallax as user scrolls down from hero
            const heroTl = gsap.timeline({
                scrollTrigger: {
                    id: "hero-cinematic-scroll",
                    trigger: heroSection,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1.2,
                    invalidateOnRefresh: true
                }
            });

            // Foreground: The Android robot sinks smoothly with optical depth, tilts slightly, and dissolves
            heroTl.to(
                heroPortrait,
                {
                    y: 110 * factor,
                    scale: 0.92,
                    rotationZ: 1.2,
                    opacity: 0.28,
                    filter: "blur(8px)",
                    ease: "power2.inOut"
                },
                0
            );

            // Halos: Drift upward in opposing optical plane and shrink
            const glowTargets = [heroGlowPrimary, heroGlowSecondary].filter(Boolean);
            if (glowTargets.length) {
                heroTl.to(
                    glowTargets,
                    {
                        y: -65 * factor,
                        scale: 0.72,
                        opacity: 0.15,
                        ease: "power1.out"
                    },
                    0
                );
            }

            // Background Video/Poster Stage: Subtle cinematic camera push-in and darkness falloff
            if (heroVideoStage) {
                heroTl.to(
                    heroVideoStage,
                    {
                        y: 50 * factor,
                        scale: 1.08,
                        opacity: 0.35,
                        ease: "power1.out"
                    },
                    0
                );
            }

            // Hero Typography: Subtle upward drift with gentle fade
            if (heroText) {
                heroTl.to(
                    heroText,
                    {
                        y: -65 * factor,
                        opacity: 0.25,
                        ease: "power1.in"
                    },
                    0
                );
            }
        }
    }

    // -------------------------------------------------------------
    // 2. ABOUT SECTION CINEMATIC SCROLL PARALLAX (Dimensional Alcove)
    // -------------------------------------------------------------
    const aboutSection = document.getElementById("about");
    const aboutPanel = document.querySelector(".about-panel");
    const aboutVisual = document.querySelector(".about-visual");
    const aboutImageWrap = document.querySelector(".about-image-wrap");
    const aboutImage = document.querySelector(".about-image");
    const aboutBackdrop = document.querySelector(".about-visual-backdrop");
    const aboutGlow = document.querySelector(".about-visual-glow");

    if (aboutSection && (aboutImageWrap || aboutImage)) {
        const imageTarget = aboutImageWrap || aboutImage;

        if (isLite) {
            // Lite Devices: Natural one-shot reveal, zero scroll-linked position calculations
            gsap.fromTo(
                imageTarget,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.75,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: aboutSection,
                        start: "top 82%",
                        once: true
                    }
                }
            );
        } else {
            // Continuous scrubbed parallax through the entire viewport passage
            const aboutTl = gsap.timeline({
                scrollTrigger: {
                    id: "about-cinematic-scroll",
                    trigger: aboutSection,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.2,
                    invalidateOnRefresh: true
                }
            });

            // 1. Sarah & AI Robot: Optical elevator glide through the alcove
            aboutTl.fromTo(
                imageTarget,
                {
                    y: 16 * factor,
                    scale: 0.98
                },
                {
                    y: -16 * factor,
                    scale: 1.015,
                    ease: "none"
                },
                0
            );

            // 2. Backdrop Arch: Moves at a slower rate
            if (aboutBackdrop) {
                aboutTl.fromTo(
                    aboutBackdrop,
                    {
                        y: 10 * factor,
                        scale: 0.98
                    },
                    {
                        y: -10 * factor,
                        scale: 1.01,
                        ease: "none"
                    },
                    0
                );
            }

            // 3. Radial Glow Spotlight
            if (aboutGlow) {
                aboutTl.fromTo(
                    aboutGlow,
                    {
                        scale: 0.85,
                        opacity: 0.4
                    },
                    {
                        scale: 1.15,
                        opacity: 0.9,
                        ease: "sine.inOut"
                    },
                    0
                );
            }
        }
    }

    // -------------------------------------------------------------
    // 3. ABOUT PANEL 3D INTERACTIVE TILT & MULTIPLANE PARALLAX (Desktop only)
    // -------------------------------------------------------------
    if (aboutPanel && !isTouch && !isLite) {
        const aboutShell = document.querySelector(".about-shell") || aboutPanel;
        const panelRotateXTo = gsap.quickTo(aboutPanel, "rotationX", { duration: 0.45, ease: "power2.out" });
        const panelRotateYTo = gsap.quickTo(aboutPanel, "rotationY", { duration: 0.45, ease: "power2.out" });

        const aboutBackdrop = document.querySelector(".about-visual-backdrop");
        const aboutGlow = document.querySelector(".about-visual-glow");
        const imageTarget = aboutImageWrap || aboutImage;

        // Animate the image as one unified portrait to prevent Sarah & Robot from detaching
        const imageXTo = imageTarget ? gsap.quickTo(imageTarget, "x", { duration: 0.45, ease: "power2.out" }) : null;
        const backdropXTo = aboutBackdrop ? gsap.quickTo(aboutBackdrop, "x", { duration: 0.55, ease: "power2.out" }) : null;
        const glowXTo = aboutGlow ? gsap.quickTo(aboutGlow, "x", { duration: 0.6, ease: "power2.out" }) : null;

        // Auto-inject spotlight sheen if not already present
        if (!aboutPanel.querySelector(".card-spotlight")) {
            const spotlight = document.createElement("div");
            spotlight.className = "card-spotlight";
            spotlight.setAttribute("aria-hidden", "true");
            aboutPanel.prepend(spotlight);
        }

        const handlePointerMove = (e) => {
            if (e.pointerType === "touch") return; // Keep page scroll natural on touch drag

            // Stable calculation relative to aboutShell to avoid transform feedback loop/jitter
            const rect = aboutShell.getBoundingClientRect();
            const relX = e.clientX - rect.left;
            const relY = e.clientY - rect.top;

            // Update dynamic spotlight sheen coordinates inside aboutPanel
            aboutPanel.style.setProperty("--mouse-x", `${relX}px`);
            aboutPanel.style.setProperty("--mouse-y", `${relY}px`);

            // Normalized (-0.5 to +0.5)
            const normX = Math.max(-0.5, Math.min(0.5, relX / rect.width - 0.5));
            const normY = Math.max(-0.5, Math.min(0.5, relY / rect.height - 0.5));

            // Refined stable 3D tilt for the master panel (2.5deg max, no Y translation to eliminate jitter)
            const maxTilt = 2.5;
            panelRotateYTo(normX * maxTilt * 2);
            panelRotateXTo(-normY * maxTilt * 2);

            // Dynamic reactive 3D drop shadow moving opposite to light source
            aboutPanel.style.setProperty("--tilt-shadow-x", `${-normX * 24}px`);
            aboutPanel.style.setProperty("--tilt-shadow-y", `${-normY * 18 + 25}px`);

            // Cohesive Depth: Sarah & Robot move together cleanly, Backdrop arch counter-shifts
            if (imageXTo) {
                imageXTo(normX * 10);
            }
            if (backdropXTo) {
                backdropXTo(-normX * 8);
            }
            if (glowXTo) {
                glowXTo(-normX * 16);
            }
        };

        const handlePointerLeave = () => {
            panelRotateXTo(0);
            panelRotateYTo(0);
            aboutPanel.style.removeProperty("--tilt-shadow-x");
            aboutPanel.style.removeProperty("--tilt-shadow-y");
            if (imageXTo) {
                imageXTo(0);
            }
            if (backdropXTo) {
                backdropXTo(0);
            }
            if (glowXTo) {
                glowXTo(0);
            }
        };

        aboutShell.addEventListener("pointermove", handlePointerMove);
        aboutShell.addEventListener("pointerleave", handlePointerLeave);
    }
};
