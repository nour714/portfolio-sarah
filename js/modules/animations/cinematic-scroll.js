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
        // Starts slightly lower, rises with smooth camera parallax, and settles gracefully
        aboutTl.fromTo(
            imageTarget,
            {
                y: 40 * factor,
                scale: 0.97
            },
            {
                y: -35 * factor,
                scale: 1.025,
                ease: "none"
            },
            0
        );

        // 2. Backdrop Arch: Moves at a slower rate (giving true layered depth behind Sarah & Robot)
        if (aboutBackdrop) {
            aboutTl.fromTo(
                aboutBackdrop,
                {
                    y: 18 * factor,
                    scale: 0.98
                },
                {
                    y: -14 * factor,
                    scale: 1.015,
                    ease: "none"
                },
                0
            );
        }

        // 3. Radial Glow Spotlight: Peaks in scale and luminescence when centered
        if (aboutGlow) {
            aboutTl.fromTo(
                aboutGlow,
                {
                    scale: 0.82,
                    opacity: 0.4
                },
                {
                    scale: 1.22,
                    opacity: 0.95,
                    ease: "sine.inOut"
                },
                0
            );
        }
    }

    // -------------------------------------------------------------
    // 3. ABOUT VISUAL 3D INTERACTIVE GYRO / MOUSE PARALLAX
    // -------------------------------------------------------------
    const visualImageTarget = aboutImageWrap || aboutImage;
    if (!isCoarsePointer && aboutVisual && visualImageTarget) {
        const rotateXTo = gsap.quickTo(aboutVisual, "rotateX", { duration: 0.5, ease: "power2.out" });
        const rotateYTo = gsap.quickTo(aboutVisual, "rotateY", { duration: 0.5, ease: "power2.out" });
        const imgXTo = gsap.quickTo(visualImageTarget, "x", { duration: 0.45, ease: "power3.out" });
        const imgYTo = gsap.quickTo(visualImageTarget, "y", { duration: 0.45, ease: "power3.out" });
        const glowXTo = aboutGlow ? gsap.quickTo(aboutGlow, "x", { duration: 0.6, ease: "power2.out" }) : null;
        const glowYTo = aboutGlow ? gsap.quickTo(aboutGlow, "y", { duration: 0.6, ease: "power2.out" }) : null;

        const targetArea = aboutPanel || aboutVisual;

        targetArea.addEventListener("pointermove", (e) => {
            const rect = aboutVisual.getBoundingClientRect();
            const relX = e.clientX - rect.left;
            const relY = e.clientY - rect.top;

            // Normalized (-0.5 to +0.5)
            const normX = Math.max(-0.6, Math.min(0.6, relX / rect.width - 0.5));
            const normY = Math.max(-0.6, Math.min(0.6, relY / rect.height - 0.5));

            // Luxury cinematic micro-tilt
            const maxTilt = 4.2;
            rotateYTo(normX * maxTilt);
            rotateXTo(-normY * maxTilt);

            // Layered Parallax: Image shifts slightly towards the light, glow shifts opposite
            imgXTo(normX * 12);
            imgYTo(normY * 8);

            if (glowXTo && glowYTo) {
                glowXTo(-normX * 22);
                glowYTo(-normY * 16);
            }
        });

        targetArea.addEventListener("pointerleave", () => {
            rotateXTo(0);
            rotateYTo(0);
            imgXTo(0);
            imgYTo(0);
            if (glowXTo && glowYTo) {
                glowXTo(0);
                glowYTo(0);
            }
        });
    }
};
