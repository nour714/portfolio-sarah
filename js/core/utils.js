/**
 * Pure Utility Helpers
 * Clean Architecture - Core / Domain Layer
 */

import { SVG_NS } from "./constants.js";

export const getMediaMatch = (query) => (
    typeof window.matchMedia === "function" ? window.matchMedia(query).matches : false
);

export const emitThemeChange = () => {
    try {
        window.dispatchEvent(new Event("themechange"));
    } catch (_error) {
        // Ignore event dispatch issues in very old browsers.
    }
};

export const shareLink = async ({ title = document.title, url = window.location.href } = {}) => {
    const normalizedUrl = url || window.location.href;

    if (typeof navigator.share === "function") {
        try {
            await navigator.share({ title, url: normalizedUrl });
            return "shared";
        } catch (error) {
            if (error && error.name === "AbortError") return "cancelled";
        }
    }

    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        try {
            await navigator.clipboard.writeText(normalizedUrl);
            return "copied";
        } catch (_error) {
            // Fall back to opening the link when clipboard access is blocked.
        }
    }

    window.open(normalizedUrl, "_blank", "noopener,noreferrer");
    return "opened";
};

export const createSvgElement = (tag, attributes = {}) => {
    const element = document.createElementNS(SVG_NS, tag);
    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, String(value));
    });
    return element;
};

export const createShareIcon = (size = null) => {
    const svg = createSvgElement("svg", {
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "aria-hidden": "true"
    });

    if (size) {
        svg.setAttribute("width", String(size));
        svg.setAttribute("height", String(size));
    }

    svg.append(
        createSvgElement("circle", { cx: "18", cy: "5", r: "3" }),
        createSvgElement("circle", { cx: "6", cy: "12", r: "3" }),
        createSvgElement("circle", { cx: "18", cy: "19", r: "3" }),
        createSvgElement("line", { x1: "8.59", y1: "13.51", x2: "15.42", y2: "17.49" }),
        createSvgElement("line", { x1: "15.41", y1: "6.51", x2: "8.59", y2: "10.49" })
    );

    return svg;
};

export const getText = (selector, root = document) => {
    if (!selector) return String(root?.textContent || "").trim();
    const node = root.querySelector(selector);
    return node ? String(node.textContent || "").trim() : "";
};

export const setText = (node, value) => {
    if (!node) return;
    node.textContent = value || "";
};

export const parseList = (value, mode = "lines") => {
    if (!value) return [];
    if (mode === "comma") {
        return value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
    }
    return value
        .split(/\n/)
        .map((item) => item.trim())
        .filter(Boolean);
};

export const formatList = (list, mode = "lines") => {
    if (!Array.isArray(list)) return "";
    if (mode === "comma") {
        return list.join(", ");
    }
    return list.join("\n");
};

export const findContactItemByLabel = (labelText) => {
    const items = Array.from(document.querySelectorAll(".contact-item"));
    const target = labelText.toLowerCase();
    return (
        items.find((item) => getText(".contact-label", item).toLowerCase() === target) ||
        items.find((item) => (item.getAttribute("href") || "").toLowerCase().includes(target))
    );
};

export const safelyInit = (initializer) => {
    try {
        initializer();
    } catch (_error) {
        // Keep the rest of interactive controls working even if one initializer fails.
    }
};

export const bindCardSpotlight = (selector) => {
    const isTouch = Boolean(window.__perf && window.__perf.isTouch) || getMediaMatch("(pointer: coarse)");
    if (isTouch || (window.__perf && window.__perf.lite)) return;
    const cards = Array.from(document.querySelectorAll(selector));
    cards.forEach((card) => {
        if (card.dataset.spotlightBound) return;
        card.dataset.spotlightBound = "true";
        card.addEventListener("pointermove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });
};

