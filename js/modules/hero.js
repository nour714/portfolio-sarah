/**
 * Hero Section Module
 * Clean Architecture - Presentation / UI Layer
 */

import { HERO_ROLES } from "../core/constants.js";
import { getMediaMatch } from "../core/utils.js";

export const resolveHeroRoles = () => {
    const heroRoleTyped = document.getElementById("hero-role-typed");
    if (!heroRoleTyped) return [];
    const rawRoles = heroRoleTyped.getAttribute("data-roles");
    const roles = (rawRoles ? rawRoles.split("|") : HERO_ROLES)
        .map((role) => String(role).trim())
        .filter(Boolean);
    if (!roles.length) {
        const fallback = String(heroRoleTyped.textContent || "").trim();
        if (fallback) roles.push(fallback);
    }
    return roles;
};

export const createHeroTypingController = (target, roles) => {
    let roleList = Array.isArray(roles) && roles.length ? roles : [];
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timeoutId = 0;
    const reducedMotion = getMediaMatch("(prefers-reduced-motion: reduce)");

    const clearTimer = () => {
        if (!timeoutId) return;
        window.clearTimeout(timeoutId);
        timeoutId = 0;
    };

    const renderStatic = () => {
        target.textContent = roleList.join(" | ");
    };

    const tick = () => {
        if (!roleList.length) return;
        const currentRole = roleList[roleIndex];

        if (!deleting) {
            charIndex += 1;
            target.textContent = currentRole.slice(0, charIndex);

            if (charIndex === currentRole.length) {
                deleting = true;
                timeoutId = window.setTimeout(tick, 1450);
                return;
            }

            timeoutId = window.setTimeout(tick, 68);
            return;
        }

        charIndex -= 1;
        target.textContent = currentRole.slice(0, charIndex);

        if (charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roleList.length;
            timeoutId = window.setTimeout(tick, 210);
            return;
        }

        timeoutId = window.setTimeout(tick, 40);
    };

    const start = () => {
        clearTimer();
        roleIndex = 0;
        charIndex = 0;
        deleting = false;

        if (reducedMotion) {
            renderStatic();
            return;
        }

        tick();
    };

    const updateRoles = (nextRoles) => {
        roleList = Array.isArray(nextRoles) && nextRoles.length ? nextRoles : roleList;
        start();
    };

    start();
    return { updateRoles, stop: clearTimer };
};

export const initHeroRoleTyping = () => {
    const heroRoleTyped = document.getElementById("hero-role-typed");
    if (!heroRoleTyped) return;
    if (window.__heroRoleTypingController) return;

    const roles = resolveHeroRoles();
    if (!roles.length) return;
    window.__heroRoleTypingController = createHeroTypingController(heroRoleTyped, roles);
};

export const initHeroAvatarFallback = () => {
    const avatarImg = document.querySelector(".hero-avatar-img");
    if (!avatarImg) return;

    const fallbackSrc =
        avatarImg.getAttribute("data-fallback-src") || "images/avatar-placeholder.svg";

    const applyFallback = () => {
        if (avatarImg.dataset.fallbackApplied === "true") return;
        avatarImg.dataset.fallbackApplied = "true";
        avatarImg.src = fallbackSrc;
        if (!avatarImg.alt) avatarImg.alt = "Avatar placeholder";
    };

    avatarImg.addEventListener("error", applyFallback);
    if (avatarImg.complete && avatarImg.naturalWidth === 0) {
        applyFallback();
    }
};
