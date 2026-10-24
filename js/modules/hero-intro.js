/**
 * Hero Cinematic Video Intro & Assembly Orchestration Module
 * Clean Architecture - Presentation / UI Layer
 */

import { getMediaMatch } from "../core/utils.js";

/**
 * Format raw seconds as MM:SS display string
 */
const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

/**
 * Initializes the Cinematic Video Intro and Hero Assembly Orchestration
 */
export const initHeroIntro = () => {
    const hero = document.getElementById("hero");
    const video = document.getElementById("hero-intro-video");

    if (!hero || !video) {
        // Fallback: Ensure hero is visible if video element is missing
        document.body.classList.remove("is-video-intro-active");
        document.body.classList.add("is-hero-assembled", "video-fallback-active");
        return;
    }

    let hud = document.getElementById("hero-intro-hud");
    if (!hud) {
        hud = document.createElement("div");
        hud.className = "hero-intro-hud";
        hud.id = "hero-intro-hud";
        hud.setAttribute("role", "region");
        hud.setAttribute("aria-label", "Intro Video Controls");
        hud.innerHTML = `
            <div class="hero-intro-hud-top">
                <div class="hero-intro-hud-actions">
                    <button type="button" class="hero-hud-btn hero-hud-sound-btn" id="hero-hud-sound-btn" aria-label="Unmute intro video" title="Toggle Sound">
                        <span class="hud-sound-icon hud-sound-icon-muted" aria-hidden="true">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                <line x1="23" y1="9" x2="17" y2="15"></line>
                                <line x1="17" y1="9" x2="23" y2="15"></line>
                            </svg>
                        </span>
                        <span class="hud-sound-icon hud-sound-icon-active" aria-hidden="true">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                            </svg>
                        </span>
                        <span class="hud-btn-text" id="hud-sound-btn-text">Sound On</span>
                    </button>
                    <button type="button" class="hero-hud-btn hero-hud-skip-btn" id="hero-hud-skip-btn" aria-label="Skip intro video" title="Skip to Portfolio">
                        <span class="hud-btn-text">Skip Intro</span>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <polygon points="5 4 15 12 5 20 5 4"></polygon>
                            <line x1="19" y1="5" x2="19" y2="19"></line>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        hero.appendChild(hud);
    }

    const soundBtn = document.getElementById("hero-hud-sound-btn");
    const skipBtn = document.getElementById("hero-hud-skip-btn");
    const replayBtn = document.getElementById("hero-replay-btn");

    const reduceMotion = getMediaMatch("(prefers-reduced-motion: reduce)");
    let isAssembled = false;
    let isMuted = true;

    /**
     * Updates Sound UI state (icons and labels)
     */
    const updateSoundUI = (muted) => {
        if (!soundBtn) return;
        const mutedIcon = soundBtn.querySelector(".hud-sound-icon-muted");
        const activeIcon = soundBtn.querySelector(".hud-sound-icon-active");
        const text = soundBtn.querySelector("#hud-sound-btn-text");

        if (muted) {
            if (mutedIcon) mutedIcon.style.display = "inline-flex";
            if (activeIcon) activeIcon.style.display = "none";
            if (text) text.textContent = "Sound On";
            soundBtn.setAttribute("aria-label", "Unmute intro video");
        } else {
            if (mutedIcon) mutedIcon.style.display = "none";
            if (activeIcon) activeIcon.style.display = "inline-flex";
            if (text) text.textContent = "Mute";
            soundBtn.setAttribute("aria-label", "Mute intro video");
        }
    };

    /**
     * Toggles video sound between muted and unmuted
     */
    const toggleSound = (e) => {
        e?.stopPropagation?.();
        isMuted = !isMuted;
        video.muted = isMuted;
        if (!isMuted) {
            video.volume = 1.0;
        }
        updateSoundUI(isMuted);
    };

    /**
     * Checks video timeline to trigger smooth assembly before ending
     */
    const onTimeUpdate = () => {
        if (!video.duration || isAssembled) return;
        const current = video.currentTime;
        const total = video.duration;

        // Trigger assembly slightly before absolute ending to ensure zero black frames
        if (current >= total - 0.22) {
            assembleHero();
        }
    };

    /**
     * Assembles all Home Page data and components onto the video stage
     */
    const assembleHero = ({ instant = false } = {}) => {
        if (isAssembled) return;
        isAssembled = true;

        // Keep video settled at its final cinematic frame
        try {
            if (video.duration) {
                video.currentTime = Math.max(0, video.duration - 0.05);
            }
            video.pause();
        } catch (_) {
            // Video seek guard
        }

        // Transition State Classes
        document.body.classList.remove("is-video-intro-active");
        document.body.classList.add("is-hero-assembled");
        document.body.classList.add("is-hero-assembling");

        // Unlock Lenis smooth scrolling and viewport scroll
        if (window.__lenis) {
            window.__lenis.start();
        }
        document.documentElement.style.overflow = "";

        // Trigger Role Typing Effect
        if (window.__heroRoleTypingController?.start) {
            window.__heroRoleTypingController.start();
        }

        // Instant or Reduced Motion Fallback
        if (instant || reduceMotion || !window.gsap) {
            const heroContent = document.querySelector(".hero-content");
            if (heroContent) {
                heroContent.style.opacity = "1";
                heroContent.style.visibility = "visible";
            }
            const header = document.querySelector(".site-header");
            if (header) {
                header.style.opacity = "1";
                header.style.transform = "none";
            }
            document.body.classList.remove("is-hero-assembling");
            return;
        }

        // Master GSAP Assembly Timeline ("يتجمع عليه")
        const gsap = window.gsap;
        const tl = gsap.timeline({
            defaults: { ease: "power4.out" },
            onComplete: () => document.body.classList.remove("is-hero-assembling")
        });

        // Ensure container is primed
        gsap.set(".hero-content", { visibility: "visible", autoAlpha: 1 });

        // 1. Settle the video stage like a camera pull-back
        tl.fromTo(
            ".hero-video-stage",
            { scale: 1.045 },
            { scale: 1, duration: 1.8, ease: "power3.out" },
            0
        )
        // 2. Luxury Navbar descent with frosted glass bloom
        tl.fromTo(
            ".site-header",
            { y: -32, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.95, ease: "power3.out" },
            0
        )
        // 3. Status Pill spring glide
        .fromTo(
            ".hero-status-pill",
            { y: 26, autoAlpha: 0, scale: 0.88 },
            { y: 0, autoAlpha: 1, scale: 1, duration: 0.78, ease: "back.out(1.6)" },
            0.1
        )
        // 4. Greeting and Highlight Name with blur-to-sharp reveal
        .fromTo(
            [".hero-greeting", ".hero-name-highlight"],
            { y: 40, autoAlpha: 0, filter: "blur(14px)" },
            { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 1.05, stagger: 0.12, ease: "power4.out" },
            0.2
        )
        // 5. Role Typing Capsule
        .fromTo(
            ".hero-role",
            { y: 24, autoAlpha: 0, filter: "blur(6px)" },
            { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.82, ease: "power3.out" },
            0.35
        )
        // 6. Bio Description
        .fromTo(
            ".hero-copy",
            { y: 22, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.85, ease: "power3.out" },
            0.46
        )
        // 7. Social Links staggered spring pop
        .fromTo(
            ".hero-social-link",
            { y: 20, autoAlpha: 0, scale: 0.75 },
            { y: 0, autoAlpha: 1, scale: 1, duration: 0.68, stagger: 0.08, ease: "back.out(2)" },
            0.56
        )
        // 8. CTA Action Buttons
        .fromTo(
            ".hero-actions .hero-btn",
            { y: 24, autoAlpha: 0, scale: 0.94 },
            { y: 0, autoAlpha: 1, scale: 1, duration: 0.78, stagger: 0.1, ease: "power3.out" },
            0.64
        )
        // 9. The android glides in from the side and resolves into focus
        .fromTo(
            ".hero-portrait-frame",
            {
                x: window.innerWidth < 640 ? 34 : 104,
                y: 38,
                scale: 0.86,
                autoAlpha: 0,
                filter: "blur(18px)",
                transformOrigin: "center bottom"
            },
            {
                x: 0,
                y: 0,
                scale: 1,
                autoAlpha: 1,
                filter: "blur(0px)",
                duration: 1.55,
                ease: "power4.out"
            },
            0.08
        );
    };

    /**
     * Skip Intro handler
     */
    const skipIntro = (e) => {
        e?.stopPropagation?.();
        if (video.duration) {
            video.currentTime = Math.max(0, video.duration - 0.05);
        }
        assembleHero();
    };

    /**
     * Replay Cinematic Intro sequence from start
     */
    const replayIntro = (e) => {
        e?.stopPropagation?.();
        isAssembled = false;

        // Lock Lenis scroll and viewport
        if (window.__lenis) {
            window.__lenis.stop();
            window.__lenis.scrollTo(0, { immediate: true });
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
        document.documentElement.style.overflow = "hidden";

        document.body.classList.remove("is-hero-assembled");
        document.body.classList.add("is-video-intro-active");

        const gsap = window.gsap;
        if (gsap) {
            gsap.to([".hero-text", ".site-header"], {
                autoAlpha: 0,
                y: -12,
                duration: 0.35,
                ease: "power2.in",
                onComplete: () => {
                    video.currentTime = 0;
                    video.play().catch(() => {});
                    gsap.to(hud, { autoAlpha: 1, duration: 0.4 });
                }
            });
        } else {
            video.currentTime = 0;
            video.play().catch(() => {});
        }
    };

    // Video Error Handling Fallback
    const onVideoError = () => {
        console.warn("Hero video failed to load. Falling back to portrait visual.");
        document.body.classList.remove("is-video-intro-active");
        document.body.classList.add("is-hero-assembled", "video-fallback-active");
        assembleHero({ instant: true });
    };

    // Event Bindings
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", () => assembleHero());
    video.addEventListener("error", onVideoError);

    if (soundBtn) soundBtn.addEventListener("click", toggleSound);
    if (skipBtn) skipBtn.addEventListener("click", skipIntro);
    if (replayBtn) replayBtn.addEventListener("click", replayIntro);

    // Reduced Motion Support
    if (reduceMotion) {
        assembleHero({ instant: true });
        return;
    }

    // Initialize in Intro Mode
    document.body.classList.add("is-video-intro-active");
    if (window.__lenis) {
        window.__lenis.stop();
    }
    document.documentElement.style.overflow = "hidden";

    video.muted = true;
    isMuted = true;
    updateSoundUI(true);

    // Autoplay start
    const playPromise = video.play();
    if (playPromise !== undefined) {
        playPromise.catch((err) => {
            console.info("Autoplay restricted or deferred by browser:", err);
            // On first user interaction, resume video seamlessly
            const unlockPlay = () => {
                video.play().catch(() => {});
                window.removeEventListener("pointerdown", unlockPlay);
                window.removeEventListener("keydown", unlockPlay);
            };
            window.addEventListener("pointerdown", unlockPlay, { once: true });
            window.addEventListener("keydown", unlockPlay, { once: true });
        });
    }
};
