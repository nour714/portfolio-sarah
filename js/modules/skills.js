/**
 * Skills Module
 * Clean Architecture - Presentation Layer
 * Interactive Circular Arc Carousel with Curved Arch Band
 * Sarah Nabil - Machine Learning, AI & Data Science Specialist
 */

import {
    SKILL_METADATA,
    enrichSkill,
    getSkillIconElement
} from "./skills/skill-icons.js";

export {
    SKILL_METADATA,
    enrichSkill,
    getSkillIconElement
};

/**
 * Creates legacy skill card for semantic fallback / backward compatibility
 */
export const createSkillCard = (item) => {
    const itemName = typeof item === "object" ? item.name : String(item || "");

    const card = document.createElement("article");
    card.className = "skill-card";
    card.tabIndex = 0;
    card.setAttribute("role", "listitem");
    card.setAttribute("aria-label", itemName);

    const iconWrap = document.createElement("div");
    iconWrap.className = "skill-icon-wrap";
    iconWrap.appendChild(getSkillIconElement(item));

    const name = document.createElement("span");
    name.className = "skill-name";
    name.textContent = itemName;

    card.append(iconWrap, name);
    return card;
};

// ==========================================================================
// Interactive Circular Arc Carousel State & Controller
// High-Craft GSAP Orbital Physics & 3D Interactive Animation
// ==========================================================================

let activeIndex = 0;
let skillList = [];
let virtualArcIndex = 0;

let stageEl = null;
let trackEl = null;
let spotlightEl = null;
let iconWrapEl = null;
let haloEl = null;
let iconEl = null;
let counterEl = null;
let titleEl = null;
let levelEl = null;
let barFillEl = null;
let descEl = null;
let prevBtn = null;
let nextBtn = null;

let arcTween = null;
let idleFloatTween = null;
let idleHaloTween = null;
let assemblyTimeline = null;
let hasAssembled = false;

// Auto-Rotation (Auto-Play) Engine
const AUTO_PLAY_INTERVAL = 2200; // Snappy 2.2 seconds per skill
let autoPlayTimer = null;
let isAutoPlayPaused = false;
let isUserDragging = false;
let isStageVisible = true;

/**
 * Schedules the next automatic skill switch
 */
const scheduleNextAutoPlay = () => {
    if (autoPlayTimer) {
        clearTimeout(autoPlayTimer);
        autoPlayTimer = null;
    }

    if (isAutoPlayPaused || isUserDragging || !isStageVisible || !skillList.length) {
        return;
    }

    autoPlayTimer = setTimeout(() => {
        if (isAutoPlayPaused || isUserDragging || !isStageVisible) return;
        renderSkillsArcCarousel(activeIndex + 1, true);
    }, AUTO_PLAY_INTERVAL);
};

export const pauseAutoPlay = () => {
    isAutoPlayPaused = true;
    if (autoPlayTimer) {
        clearTimeout(autoPlayTimer);
        autoPlayTimer = null;
    }
};

export const resumeAutoPlay = () => {
    isAutoPlayPaused = false;
    scheduleNextAutoPlay();
};

/**
 * Computes exact circular ribbon arc geometry based on responsive stage width
 */
const getArcGeometry = () => {
    const stageWidth = stageEl ? stageEl.clientWidth : (window.innerWidth || 960);
    const isMobile = stageWidth < 640;
    const canvasEl = document.querySelector(".skills-arch-canvas");
    const rawCanvasWidth = canvasEl ? canvasEl.clientWidth : stageWidth;
    const canvasWidth = Math.min(rawCanvasWidth, stageWidth, 1000);
    const scale = Math.max(0.3, Math.min(canvasWidth, 1000) / 1000);
    const r = 460 * scale;
    const cy = 519.0877 * scale;
    const stepAngle = isMobile ? 0.46 : 0.358;
    const maxOffset = isMobile ? 1.4 : 3.5;

    return { isMobile, scale, r, cy, stepAngle, maxOffset };
};

/**
 * Updates all orbital badges along the curved ribbon at the specified fractional virtual index
 */
const updateArcBadges = (vIndex) => {
    if (!trackEl || !skillList.length) return;
    const count = skillList.length;
    const { isMobile, r, cy, stepAngle, maxOffset } = getArcGeometry();

    for (let i = 0; i < count; i++) {
        const itemEl = trackEl.querySelector(`[data-index="${i}"]`);
        if (!itemEl) continue;

        let diff = (i - vIndex) % count;
        if (diff > count / 2) diff -= count;
        if (diff < -count / 2) diff += count;

        const absDiff = Math.abs(diff);

        if (absDiff > maxOffset) {
            itemEl.style.transform = `translate(calc(-50% + ${diff < 0 ? -r * 1.15 : r * 1.15}px), calc(-50% + ${cy}px)) scale(0.4)`;
            itemEl.style.opacity = "0";
            itemEl.style.visibility = "hidden";
            itemEl.style.pointerEvents = "none";
            itemEl.setAttribute("aria-hidden", "true");
            continue;
        }

        itemEl.style.visibility = "visible";

        const theta = diff * stepAngle;
        const x = r * Math.sin(theta);
        const y = cy - r * Math.cos(theta);

        // Smooth opacity handoff near apex spotlight and tapering at arc ends
        let opacity = 0;
        if (absDiff < 0.45) {
            opacity = Math.max(0, (absDiff / 0.45) * 0.35);
        } else if (absDiff <= 1.0) {
            opacity = 0.35 + (absDiff - 0.45) * (0.6 / 0.55);
        } else if (isMobile) {
            const remaining = Math.max(0, (maxOffset - absDiff) / (maxOffset - 1.0));
            opacity = remaining * 0.95;
        } else if (absDiff <= 3.0) {
            opacity = 0.95 - (absDiff - 1.0) * 0.22;
        } else {
            const remaining = Math.max(0, (maxOffset - absDiff) / (maxOffset - 3.0));
            opacity = remaining * 0.51;
        }

        const badgeScale = Math.max(0.72, 1.0 - Math.min(absDiff, 3) * 0.08);
        const zIndex = Math.max(1, Math.round(10 - absDiff * 2));

        itemEl.style.transform = `translate(calc(-50% + ${Math.round(x)}px), calc(-50% + ${Math.round(y)}px)) scale(${badgeScale.toFixed(3)})`;
        itemEl.style.opacity = opacity.toFixed(3);
        itemEl.style.zIndex = String(zIndex);
        itemEl.style.pointerEvents = absDiff < 0.35 ? "none" : "auto";
        itemEl.setAttribute("aria-hidden", "false");
        itemEl.setAttribute("aria-selected", absDiff < 0.5 ? "true" : "false");
    }
};

/**
 * Continuous Zero-Gravity Levitation for the Spotlight Apex Icon
 */
const startIdleFloating = () => {
    if (!window.gsap || !iconEl) return;
    window.gsap.killTweensOf(iconEl);
    idleFloatTween = window.gsap.to(iconEl, {
        y: -5,
        rotationZ: 1.2,
        duration: 2.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
    });
};

/**
 * Continuous Pulsing Aura Breathing for the Spotlight Halo
 */
const startIdleHalo = () => {
    if (!window.gsap || !haloEl) return;
    window.gsap.killTweensOf(haloEl);
    idleHaloTween = window.gsap.to(haloEl, {
        scale: 1.08,
        opacity: 0.98,
        duration: 2.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
    });
};

/**
 * Renders the carousel at the given active index with cinema-grade GSAP animations
 */
export const renderSkillsArcCarousel = (newIndex = activeIndex, animated = true) => {
    if (!stageEl || !skillList.length) return;

    const count = skillList.length;
    // Calculate shortest angular delta on the circle
    let delta = (newIndex - activeIndex) % count;
    if (delta > count / 2) delta -= count;
    if (delta < -count / 2) delta += count;

    const direction = delta >= 0 ? 1 : -1;
    activeIndex = ((newIndex % count) + count) % count;
    const currentSkill = skillList[activeIndex];

    // Stop continuous idle float during transition
    if (idleFloatTween) idleFloatTween.kill();
    if (idleHaloTween) idleHaloTween.kill();

    // 2. Animate Badges & Spotlight with GSAP
    if (animated && window.gsap) {
        // A. Cinematic Orbital Motion of Badges along the curved arch ribbon
        const startV = virtualArcIndex;
        const targetV = virtualArcIndex + delta;

        if (arcTween) arcTween.kill();
        const tweenProxy = { v: startV };

        arcTween = window.gsap.to(tweenProxy, {
            v: targetV,
            duration: 0.62,
            ease: "expo.out",
            onUpdate: () => {
                virtualArcIndex = tweenProxy.v;
                updateArcBadges(virtualArcIndex);
            },
            onComplete: () => {
                virtualArcIndex = ((targetV % count) + count) % count;
                updateArcBadges(virtualArcIndex);
            }
        });

        // B. Arch Ribbon Cinematic Energy Flash (Light Beam Sweep along curved track)
        const glowLine = document.querySelector(".skills-arch-glow-line");
        if (glowLine) {
            window.gsap.killTweensOf(glowLine);
            window.gsap.fromTo(
                glowLine,
                {
                    opacity: 1,
                    stroke: currentSkill.color,
                    filter: `drop-shadow(0 0 14px ${currentSkill.color}) drop-shadow(0 0 28px ${currentSkill.color})`
                },
                {
                    opacity: 0.35,
                    stroke: "rgba(168, 85, 247, 0.35)",
                    filter: "drop-shadow(0 0 5px rgba(168, 85, 247, 0.45))",
                    duration: 0.65,
                    ease: "power2.out"
                }
            );
        }

        // C. Kill prior tweens
        window.gsap.killTweensOf([iconEl, haloEl, titleEl, descEl, levelEl, barFillEl, counterEl]);
        window.gsap.set(iconEl, { x: 0, y: 0, clearProps: "transform" });

        // Update spotlight color variables
        if (haloEl) {
            haloEl.style.setProperty("--spotlight-glow", currentSkill.haloColor);
        }

        // Update active icon DOM
        if (iconEl) {
            iconEl.innerHTML = "";
            iconEl.style.setProperty("--spotlight-border", currentSkill.color);
            iconEl.style.setProperty("--spotlight-glow", currentSkill.haloColor);
            iconEl.appendChild(getSkillIconElement(currentSkill));
        }

        // D. Spotlight Icon Cinematic 3D Vault
        window.gsap.fromTo(
            iconEl,
            {
                scale: 0.4,
                rotationY: direction * 60,
                rotationX: -16,
                z: -70,
                opacity: 0.2,
                filter: `brightness(2.6) drop-shadow(0 0 30px ${currentSkill.color}) blur(3px)`
            },
            {
                scale: 1,
                rotationY: 0,
                rotationX: 0,
                z: 0,
                opacity: 1,
                filter: "brightness(1) blur(0px)",
                duration: 0.62,
                ease: "expo.out",
                onComplete: startIdleFloating
            }
        );

        // E. Halo Shockwave Pulse Bloom
        window.gsap.fromTo(
            haloEl,
            { scale: 0.35, opacity: 0.2, filter: "blur(10px) brightness(2.2)" },
            {
                scale: 1.3,
                opacity: 1,
                filter: "blur(20px) brightness(1)",
                duration: 0.28,
                ease: "power2.out",
                onComplete: () => {
                    window.gsap.to(haloEl, {
                        scale: 1,
                        opacity: 0.9,
                        duration: 0.32,
                        ease: "power2.inOut",
                        onComplete: startIdleHalo
                    });
                }
            }
        );

        // F. Dual-Phase Cinematic Editorial Text Dissolve & Reveal
        window.gsap.to([titleEl, descEl], {
            opacity: 0,
            y: -8,
            filter: "blur(4px)",
            duration: 0.12,
            ease: "power2.in",
            onComplete: () => {
                // Update DOM text at nadir of blur
                if (counterEl) {
                    const currentNum = String(activeIndex + 1).padStart(2, "0");
                    const totalNum = String(count).padStart(2, "0");
                    counterEl.textContent = `${currentNum} / ${totalNum}`;
                }
                if (titleEl) titleEl.textContent = currentSkill.name;
                if (descEl) descEl.textContent = currentSkill.description;
                if (levelEl) {
                    levelEl.textContent = currentSkill.level;
                    levelEl.style.color = currentSkill.barColor;
                }

                // Phase B: Cinematic reveal of new text with letter-tracking expansion
                window.gsap.fromTo(
                    titleEl,
                    { opacity: 0, y: 16, scale: 0.97, filter: "blur(6px)", letterSpacing: "0.04em" },
                    { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", letterSpacing: "-0.025em", duration: 0.5, ease: "expo.out" }
                );

                window.gsap.fromTo(
                    descEl,
                    { opacity: 0, y: 10, filter: "blur(3px)" },
                    { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.45, delay: 0.04, ease: "power2.out" }
                );

                window.gsap.fromTo(
                    counterEl,
                    { opacity: 0.2, y: -6 },
                    { opacity: 1, y: 0, duration: 0.3, ease: "expo.out" }
                );

                window.gsap.fromTo(
                    levelEl,
                    { opacity: 0, x: -10, filter: "blur(2px)" },
                    { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.35, ease: "expo.out" }
                );
            }
        });

        // G. Progress Bar Capacitor Charge Surge
        if (barFillEl) {
            barFillEl.style.background = currentSkill.barColor;
            window.gsap.fromTo(
                barFillEl,
                { width: "0%" },
                { width: `${currentSkill.progress}%`, duration: 0.58, delay: 0.12, ease: "expo.out" }
            );
        }
    } else {
        // Fallback or Initial Render
        if (counterEl) {
            const currentNum = String(activeIndex + 1).padStart(2, "0");
            const totalNum = String(count).padStart(2, "0");
            counterEl.textContent = `${currentNum} / ${totalNum}`;
        }
        if (titleEl) titleEl.textContent = currentSkill.name;
        if (descEl) descEl.textContent = currentSkill.description;
        if (levelEl) {
            levelEl.textContent = currentSkill.level;
            levelEl.style.color = currentSkill.barColor;
        }
        if (haloEl) haloEl.style.setProperty("--spotlight-glow", currentSkill.haloColor);
        if (iconEl) {
            iconEl.innerHTML = "";
            iconEl.style.setProperty("--spotlight-border", currentSkill.color);
            iconEl.style.setProperty("--spotlight-glow", currentSkill.haloColor);
            iconEl.appendChild(getSkillIconElement(currentSkill));
        }
        if (barFillEl) {
            barFillEl.style.background = currentSkill.barColor;
            barFillEl.style.width = `${currentSkill.progress}%`;
        }
        virtualArcIndex = activeIndex;
        updateArcBadges(virtualArcIndex);
        startIdleFloating();
        startIdleHalo();
    }

    // Schedule next automatic switch (Auto-Play)
    scheduleNextAutoPlay();
};

/**
 * Initializes the Arc Carousel
 */
export const initSkillsArcCarousel = (rawItems) => {
    stageEl = document.getElementById("skills-arc-stage");
    if (!stageEl) return;

    trackEl = document.getElementById("skills-arc-track");
    spotlightEl = document.getElementById("skills-spotlight");
    iconWrapEl = document.getElementById("spotlight-icon-wrap");
    haloEl = document.getElementById("spotlight-halo");
    iconEl = document.getElementById("spotlight-icon");
    counterEl = document.getElementById("spotlight-counter");
    titleEl = document.getElementById("spotlight-title");
    levelEl = document.getElementById("spotlight-level");
    barFillEl = document.getElementById("spotlight-bar-fill");
    descEl = document.getElementById("spotlight-desc");
    prevBtn = document.getElementById("skills-nav-prev");
    nextBtn = document.getElementById("skills-nav-next");

    // Flatten / extract items
    let items = [];
    if (Array.isArray(rawItems) && rawItems.length) {
        items = rawItems;
    } else if (rawItems && Array.isArray(rawItems.items) && rawItems.items.length) {
        items = rawItems.items;
    } else if (rawItems && Array.isArray(rawItems.groups)) {
        rawItems.groups.forEach((g) => {
            (g.items || []).forEach((it) => items.push(it));
        });
    }

    if (!items.length) return;

    // Enrich all skills with metadata
    skillList = items.map(enrichSkill);

    // Default to Python (index 0)
    activeIndex = 0;
    virtualArcIndex = 0;

    // Build the arc track items DOM
    if (trackEl) {
        trackEl.innerHTML = "";
        skillList.forEach((skill, index) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "skills-arc-item";
            btn.setAttribute("data-index", String(index));
            btn.setAttribute("aria-label", `Select skill: ${skill.name}`);

            const badge = document.createElement("div");
            badge.className = "skills-arc-badge";
            badge.appendChild(getSkillIconElement(skill));

            const label = document.createElement("span");
            label.className = "skills-arc-label";
            label.textContent = skill.label;

            btn.append(badge, label);

            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (assemblyTimeline && assemblyTimeline.isActive()) {
                    assemblyTimeline.progress(1);
                }
                renderSkillsArcCarousel(index, true);
            });

            trackEl.appendChild(btn);
        });
    }

    // Controls: Prev & Next with tactile click response
    if (prevBtn && !prevBtn._hasBoundClick) {
        prevBtn._hasBoundClick = true;
        prevBtn.addEventListener("click", () => {
            if (assemblyTimeline && assemblyTimeline.isActive()) {
                assemblyTimeline.progress(1);
            }
            if (window.gsap) {
                window.gsap.fromTo(prevBtn, { scale: 0.88 }, { scale: 1, duration: 0.3, ease: "back.out(2)" });
            }
            renderSkillsArcCarousel(activeIndex - 1, true);
        });
    }

    if (nextBtn && !nextBtn._hasBoundClick) {
        nextBtn._hasBoundClick = true;
        nextBtn.addEventListener("click", () => {
            if (assemblyTimeline && assemblyTimeline.isActive()) {
                assemblyTimeline.progress(1);
            }
            if (window.gsap) {
                window.gsap.fromTo(nextBtn, { scale: 0.88 }, { scale: 1, duration: 0.3, ease: "back.out(2)" });
            }
            renderSkillsArcCarousel(activeIndex + 1, true);
        });
    }

    // Drag / Touch Gesture Handling with Real-Time Curved Ribbon Tracking
    if (!stageEl._hasBoundDrag) {
        stageEl._hasBoundDrag = true;
        let isPointerDown = false;
        let startX = 0;
        let startVirtual = 0;

        // Auto-Play Pause on Hover / Focus
        stageEl.addEventListener("mouseenter", () => {
            pauseAutoPlay();
        });

        stageEl.addEventListener("mouseleave", () => {
            resumeAutoPlay();
        });

        stageEl.addEventListener("focusin", () => {
            pauseAutoPlay();
        });

        stageEl.addEventListener("focusout", (e) => {
            if (!stageEl.contains(e.relatedTarget)) {
                resumeAutoPlay();
            }
        });

        stageEl.addEventListener("pointerdown", (e) => {
            if (assemblyTimeline && assemblyTimeline.isActive()) {
                assemblyTimeline.progress(1);
            }
            // Ignore interaction only when clicking navigation buttons so they can be clicked
            if (e.target.closest(".skills-nav-btn")) return;
            isPointerDown = true;
            isUserDragging = true;
            pauseAutoPlay();
            startX = e.clientX;
            startVirtual = virtualArcIndex;
            if (arcTween) arcTween.kill();
            stageEl.classList.add("is-dragging");
        });

        window.addEventListener("pointermove", (e) => {
            if (!isPointerDown) return;
            const deltaX = e.clientX - startX;
            // 150px drag represents one skill step
            const stepDelta = -deltaX / 150;
            virtualArcIndex = startVirtual + stepDelta;
            updateArcBadges(virtualArcIndex);
        });

        window.addEventListener("pointerup", (e) => {
            if (!isPointerDown) return;
            isPointerDown = false;
            isUserDragging = false;
            stageEl.classList.remove("is-dragging");

            const deltaX = e.clientX - startX;
            if (Math.abs(deltaX) > 20) {
                const targetIdx = Math.round(virtualArcIndex);
                renderSkillsArcCarousel(targetIdx, true);
            } else {
                renderSkillsArcCarousel(Math.round(virtualArcIndex), true);
            }
            resumeAutoPlay();
        });

        stageEl.addEventListener("pointercancel", () => {
            if (!isPointerDown) return;
            isPointerDown = false;
            isUserDragging = false;
            stageEl.classList.remove("is-dragging");
            renderSkillsArcCarousel(Math.round(virtualArcIndex), true);
            resumeAutoPlay();
        });

        // Tab Visibility Change handling
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                pauseAutoPlay();
            } else {
                resumeAutoPlay();
            }
        });

        // IntersectionObserver: auto-play only when scrolled into view
        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    isStageVisible = entry.isIntersecting;
                    if (isStageVisible) {
                        resumeAutoPlay();
                    } else {
                        pauseAutoPlay();
                    }
                });
            }, { threshold: 0.2 });
            observer.observe(stageEl);
        } else {
            isStageVisible = true;
            resumeAutoPlay();
        }

        // Keyboard navigation
        stageEl.addEventListener("keydown", (e) => {
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                renderSkillsArcCarousel(activeIndex - 1, true);
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                renderSkillsArcCarousel(activeIndex + 1, true);
            }
        });

        // Window resize debounced recalculation
        let resizeTimer = null;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                updateArcBadges(virtualArcIndex);
            }, 80);
        });
    }

    // Initial Render
    renderSkillsArcCarousel(activeIndex, false);
};

/**
 * Cinema-Grade Convergence Assembly Motion
 * "كل حاجه تتجمع قدامي لما اوصل لقسم الاسكيلز"
 * Gathers and converges all dispersed badges, arch ribbons, spotlight 3D core,
 * capacitor progress surge, and interactive controls when reaching the skills section.
 * Supports bidirectional playback (both forward scroll and reverse scroll).
 */
export const initSkillsAssemblyAnimation = () => {
    stageEl = document.getElementById("skills-arc-stage");
    if (!stageEl || !skillList.length) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    // Check reduced motion preference (WCAG AA compliance)
    const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!gsap || !ScrollTrigger || prefersReducedMotion) {
        if (stageEl) stageEl.classList.remove("is-assembling");
        startIdleFloating();
        startIdleHalo();
        resumeAutoPlay();
        return;
    }

    // Kill any existing assembly trigger/timeline to prevent duplicate stacking
    if (assemblyTimeline) {
        assemblyTimeline.kill();
        assemblyTimeline = null;
    }
    const existingSt = ScrollTrigger.getById("skills-convergence-assembly");
    if (existingSt) {
        existingSt.kill();
    }

    const archCanvas = document.querySelector(".skills-arch-canvas");
    const glowLine = document.querySelector(".skills-arch-glow-line");
    const metaEl = document.querySelector(".skills-spotlight-meta");
    const dragHint = document.getElementById("skills-drag-hint");
    const skillsNote = document.querySelector(".skills-note");

    const getVisibleBadges = () => {
        const count = skillList.length;
        const { maxOffset } = getArcGeometry();
        const list = [];
        for (let i = 0; i < count; i++) {
            const itemEl = trackEl ? trackEl.querySelector(`[data-index="${i}"]`) : null;
            if (!itemEl) continue;

            let diff = (i - activeIndex) % count;
            if (diff > count / 2) diff -= count;
            if (diff < -count / 2) diff += count;

            const absDiff = Math.abs(diff);
            if (absDiff <= maxOffset + 0.6 && absDiff > 0.3) {
                const badge = itemEl.querySelector(".skills-arc-badge");
                const label = itemEl.querySelector(".skills-arc-label");
                list.push({ itemEl, badge, label, diff, absDiff });
            }
        }
        return list.sort((a, b) => b.absDiff - a.absDiff);
    };

    const getSpreadFactor = () => {
        const isMobile = window.innerWidth < 640;
        const isTablet = window.innerWidth < 960 && !isMobile;
        return isMobile ? 0.45 : isTablet ? 0.75 : 1.0;
    };

    const resetAssembly = () => {
        if (assemblyTimeline) {
            assemblyTimeline.kill();
            assemblyTimeline = null;
        }
        pauseAutoPlay();
        if (idleFloatTween) idleFloatTween.kill();
        if (idleHaloTween) idleHaloTween.kill();

        if (stageEl) stageEl.classList.add("is-assembling");

        const sortedBadges = getVisibleBadges();
        const spreadFactor = getSpreadFactor();

        sortedBadges.forEach(({ badge, label, diff, absDiff }) => {
            const dir = diff < 0 ? -1 : 1;
            const scatterX = dir * (120 + absDiff * 55) * spreadFactor;
            const scatterY = (45 + absDiff * 30) * spreadFactor;
            const scatterRot = dir * (25 + absDiff * 14);

            if (badge) {
                gsap.set(badge, {
                    x: scatterX,
                    y: scatterY,
                    scale: 0.15,
                    rotation: scatterRot,
                    opacity: 0,
                    filter: "blur(12px)"
                });
            }
            if (label) {
                gsap.set(label, { opacity: 0, y: 10 });
            }
        });

        if (archCanvas) gsap.set(archCanvas, { scale: 0.8, y: 35, opacity: 0, filter: "blur(12px)" });
        if (iconEl) gsap.set(iconEl, { y: -75, scale: 0.15, rotationY: 180, opacity: 0 });
        if (haloEl) gsap.set(haloEl, { scale: 0.1, opacity: 0 });
        if (counterEl) gsap.set(counterEl, { y: -16, opacity: 0 });
        if (titleEl) gsap.set(titleEl, { y: 22, opacity: 0, filter: "blur(8px)" });
        if (metaEl) gsap.set(metaEl, { scale: 0.9, opacity: 0 });
        if (barFillEl) gsap.set(barFillEl, { width: "0%" });
        if (descEl) gsap.set(descEl, { y: 16, opacity: 0, filter: "blur(4px)" });
        if (prevBtn) gsap.set(prevBtn, { x: -35, opacity: 0 });
        if (nextBtn) gsap.set(nextBtn, { x: 35, opacity: 0 });
        if (dragHint) gsap.set(dragHint, { y: 18, opacity: 0 });
        if (skillsNote) gsap.set(skillsNote, { y: 22, opacity: 0 });
    };

    const playAssembly = () => {
        if (idleFloatTween) idleFloatTween.kill();
        if (idleHaloTween) idleHaloTween.kill();
        pauseAutoPlay();

        if (stageEl) stageEl.classList.add("is-assembling");

        const sortedBadges = getVisibleBadges();
        const spreadFactor = getSpreadFactor();
        const activeSkill = skillList[activeIndex] || skillList[0];

        if (assemblyTimeline) {
            assemblyTimeline.kill();
        }

        assemblyTimeline = gsap.timeline({
            id: "skills-convergence-assembly-timeline",
            onComplete: () => {
                hasAssembled = true;
                if (stageEl) stageEl.classList.remove("is-assembling");
                sortedBadges.forEach(({ badge, label }) => {
                    if (badge) gsap.set(badge, { clearProps: "transform,filter,opacity" });
                    if (label) gsap.set(label, { clearProps: "opacity,transform" });
                });
                startIdleFloating();
                startIdleHalo();
                resumeAutoPlay();
            }
        });

        // 1. Arch Canvas & Luminous Track Emergence
        if (archCanvas) {
            assemblyTimeline.fromTo(
                archCanvas,
                { scale: 0.8, y: 35, opacity: 0, filter: "blur(12px)" },
                { scale: 1, y: 0, opacity: 1, filter: "blur(0px)", duration: 0.95, ease: "power3.out" },
                0
            );
        }

        if (glowLine) {
            assemblyTimeline.fromTo(
                glowLine,
                { opacity: 0.05, strokeWidth: 1 },
                {
                    opacity: 1,
                    strokeWidth: 3.5,
                    filter: "drop-shadow(0 0 16px rgba(167, 139, 250, 0.95))",
                    duration: 0.65,
                    ease: "power2.out",
                    yoyo: true,
                    repeat: 1
                },
                0.12
            );
        }

        // 2. Central Spotlight Apex Vault & Shockwave Bloom
        if (iconEl) {
            assemblyTimeline.fromTo(
                iconEl,
                {
                    y: -75,
                    scale: 0.15,
                    rotationY: 180,
                    rotationX: -25,
                    opacity: 0,
                    filter: `blur(14px) brightness(2.6) drop-shadow(0 0 35px ${activeSkill.color})`
                },
                {
                    y: 0,
                    scale: 1,
                    rotationY: 0,
                    rotationX: 0,
                    opacity: 1,
                    filter: "blur(0px) brightness(1)",
                    duration: 0.85,
                    ease: "back.out(1.8)"
                },
                0.08
            );
        }

        if (haloEl) {
            assemblyTimeline.fromTo(
                haloEl,
                { scale: 0.1, opacity: 0, filter: "blur(6px)" },
                {
                    scale: 1.5,
                    opacity: 1,
                    filter: "blur(24px)",
                    duration: 0.38,
                    ease: "power2.out"
                },
                0.5
            );
            assemblyTimeline.to(
                haloEl,
                { scale: 1, opacity: 0.85, duration: 0.32, ease: "power2.inOut" },
                0.88
            );
        }

        // 3. Staggered Badges Inward Convergence ("كل حاجه تتجمع قدامي")
        sortedBadges.forEach(({ badge, label, diff, absDiff }, idx) => {
            if (!badge) return;
            const dir = diff < 0 ? -1 : 1;
            const scatterX = dir * (120 + absDiff * 55) * spreadFactor;
            const scatterY = (45 + absDiff * 30) * spreadFactor;
            const scatterRot = dir * (25 + absDiff * 14);

            const badgeStartTime = 0.16 + idx * 0.045;

            assemblyTimeline.fromTo(
                badge,
                {
                    x: scatterX,
                    y: scatterY,
                    scale: 0.15,
                    rotation: scatterRot,
                    opacity: 0,
                    filter: "blur(12px)"
                },
                {
                    x: 0,
                    y: 0,
                    scale: 1,
                    rotation: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 0.85,
                    ease: "back.out(1.4)"
                },
                badgeStartTime
            );

            if (label) {
                assemblyTimeline.fromTo(
                    label,
                    { opacity: 0, y: 10 },
                    { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
                    badgeStartTime + 0.35
                );
            }
        });

        // 4. Spotlight Typography & Capacitor Progress Surge
        if (counterEl) {
            assemblyTimeline.fromTo(
                counterEl,
                { y: -16, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.45, ease: "expo.out" },
                0.35
            );
        }

        if (titleEl) {
            assemblyTimeline.fromTo(
                titleEl,
                { y: 22, scale: 0.94, opacity: 0, filter: "blur(8px)", letterSpacing: "0.06em" },
                { y: 0, scale: 1, opacity: 1, filter: "blur(0px)", letterSpacing: "-0.025em", duration: 0.65, ease: "expo.out" },
                0.4
            );
        }

        if (metaEl) {
            assemblyTimeline.fromTo(
                metaEl,
                { scale: 0.9, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" },
                0.45
            );
        }

        if (barFillEl) {
            const targetWidth = activeSkill ? activeSkill.progress : 96;
            assemblyTimeline.fromTo(
                barFillEl,
                { width: "0%" },
                { width: `${targetWidth}%`, duration: 0.9, ease: "expo.out" },
                0.5
            );
        }

        if (descEl) {
            assemblyTimeline.fromTo(
                descEl,
                { y: 16, opacity: 0, filter: "blur(4px)" },
                { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.55, ease: "power2.out" },
                0.55
            );
        }

        // 5. Navigation Controls & Hints
        if (prevBtn) {
            assemblyTimeline.fromTo(
                prevBtn,
                { x: -35, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.55, ease: "power3.out" },
                0.55
            );
        }

        if (nextBtn) {
            assemblyTimeline.fromTo(
                nextBtn,
                { x: 35, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.55, ease: "power3.out" },
                0.55
            );
        }

        if (dragHint) {
            assemblyTimeline.fromTo(
                dragHint,
                { y: 18, scale: 0.9, opacity: 0 },
                { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" },
                0.6
            );
        }

        if (skillsNote) {
            assemblyTimeline.fromTo(
                skillsNote,
                { y: 22, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
                0.68
            );
        }
    };

    // Prime elements into dispersed initial state
    resetAssembly();

    // Create bidirectional ScrollTrigger for both downward and reverse upward scroll
    ScrollTrigger.create({
        id: "skills-convergence-assembly",
        trigger: stageEl,
        start: "top 82%",
        end: "bottom 20%",
        onEnter: () => {
            playAssembly();
        },
        onEnterBack: () => {
            playAssembly();
        },
        onLeaveBack: () => {
            resetAssembly();
        }
    });

    if (ScrollTrigger.isInViewport(stageEl, 0.15)) {
        playAssembly();
    }
};
