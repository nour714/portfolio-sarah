/**
 * Navigation Module
 * Clean Architecture - Presentation / UI Layer
 */

import { MOBILE_NAV_BREAKPOINT } from "../core/constants.js";

export const initMenu = () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const navList = document.getElementById("nav-list");
    if (!menuToggle || !navList) return;

    const navLinks = Array.from(navList.querySelectorAll("a"));

    const closeMenu = () => {
        menuToggle.setAttribute("aria-expanded", "false");
        navList.classList.remove("open");
    };

    const setActiveLink = (nextActiveLink) => {
        if (!nextActiveLink) return;

        navLinks.forEach((link) => {
            const isActive = link === nextActiveLink;
            link.classList.toggle("is-active", isActive);
            const parentLi = link.closest("li");
            if (parentLi) {
                parentLi.classList.toggle("is-active-item", isActive);
            }
            if (isActive) {
                link.setAttribute("aria-current", "page");
                return;
            }
            link.removeAttribute("aria-current");
        });
    };

    const hashMatchedLink = navLinks.find((link) => link.getAttribute("href") === window.location.hash);
    const defaultActiveLink = hashMatchedLink || navLinks.find((link) => link.classList.contains("is-active")) || navLinks[0];
    setActiveLink(defaultActiveLink);

    const sectionLinks = navLinks.filter((link) => (link.getAttribute("href") || "").startsWith("#"));
    const sections = sectionLinks
        .map((link) => document.querySelector(link.getAttribute("href") || ""))
        .filter((section) => section instanceof HTMLElement);
    const NAV_OFFSET = 140;
    let scrollRafId = 0;

    const siteHeader = document.querySelector(".site-header");

    let cachedSectionOffsets = [];
    const measureSectionOffsets = () => {
        cachedSectionOffsets = sections.map((section) => ({
            id: section.id,
            top: section.offsetTop
        }));
    };
    measureSectionOffsets();

    const updateActiveFromScroll = () => {
        const scrollY = window.scrollY;
        if (siteHeader) {
            siteHeader.classList.toggle("is-scrolled", scrollY > 30);
        }

        if (!cachedSectionOffsets.length) return;
        const scrollPosition = scrollY + NAV_OFFSET;
        let currentSectionId = cachedSectionOffsets[0].id;

        for (let i = 0; i < cachedSectionOffsets.length; i++) {
            if (cachedSectionOffsets[i].top <= scrollPosition) {
                currentSectionId = cachedSectionOffsets[i].id;
            }
        }

        const activeLink = sectionLinks.find((link) => link.getAttribute("href") === `#${currentSectionId}`);
        if (activeLink) setActiveLink(activeLink);
    };

    const scheduleActiveUpdate = () => {
        if (scrollRafId) return;
        scrollRafId = window.requestAnimationFrame(() => {
            scrollRafId = 0;
            updateActiveFromScroll();
        });
    };

    menuToggle.addEventListener("click", () => {
        const expanded = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!expanded));
        navList.classList.toggle("open", !expanded);
    });

    // Desktop Capsule Expand on Hover / Focus
    const capsule = document.querySelector(".nav-center-capsule");
    if (capsule) {
        let collapseTimer = null;

        const expandCapsule = () => {
            if (collapseTimer) {
                clearTimeout(collapseTimer);
                collapseTimer = null;
            }
            capsule.classList.add("is-expanded");
        };

        const collapseCapsule = () => {
            if (collapseTimer) clearTimeout(collapseTimer);
            collapseTimer = setTimeout(() => {
                capsule.classList.remove("is-expanded");
            }, 240);
        };

        capsule.addEventListener("mouseenter", expandCapsule);
        capsule.addEventListener("mouseleave", collapseCapsule);
        capsule.addEventListener("focusin", expandCapsule);
        capsule.addEventListener("focusout", (event) => {
            if (!capsule.contains(event.relatedTarget)) {
                collapseCapsule();
            }
        });
    }

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            setActiveLink(link);
            if (window.innerWidth <= MOBILE_NAV_BREAKPOINT) closeMenu();
        });
    });

    window.addEventListener("hashchange", () => {
        const matchedLink = navLinks.find((link) => link.getAttribute("href") === window.location.hash);
        if (matchedLink) setActiveLink(matchedLink);
        scheduleActiveUpdate();
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > MOBILE_NAV_BREAKPOINT) closeMenu();
        measureSectionOffsets();
        scheduleActiveUpdate();
    });

    window.addEventListener("scroll", scheduleActiveUpdate, { passive: true });
    updateActiveFromScroll();

    document.addEventListener("click", (event) => {
        if (!navList.classList.contains("open")) return;
        const target = event.target;
        const clickedInsideMenu =
            target instanceof Node && (navList.contains(target) || menuToggle.contains(target));
        if (!clickedInsideMenu) closeMenu();
    });
};
