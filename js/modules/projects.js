/**
 * Projects Module
 * Clean Architecture - Presentation / UI Layer
 */

import { createShareIcon, shareLink } from "../core/utils.js";
import { showToast } from "../services/toast.service.js";

export const createProjectCard = (project, index) => {
    const card = document.createElement("article");
    card.className = "project-card reveal";
    card.setAttribute("data-category", (project.categories || []).join(" "));

    const imageWrapper = document.createElement("div");
    imageWrapper.className = "project-image-wrapper";
    const img = document.createElement("img");
    img.className = "project-image";
    img.loading = "lazy";
    img.decoding = "async";
    img.src = project.image?.src || "";
    img.alt = project.image?.alt || project.title || "";

    const overlay = document.createElement("div");
    overlay.className = "project-overlay";
    const overlayActions = document.createElement("div");
    overlayActions.className = "overlay-actions";
    if (project.githubUrl) {
        const githubLink = document.createElement("a");
        githubLink.className = "overlay-action-btn github-btn";
        githubLink.setAttribute("aria-label", "View on GitHub");
        githubLink.setAttribute("target", "_blank");
        githubLink.setAttribute("rel", "noopener noreferrer");
        githubLink.href = project.githubUrl;
        const icon = document.createElement("i");
        icon.className = "devicon-github-original";
        icon.setAttribute("aria-hidden", "true");
        githubLink.append(icon);
        overlayActions.append(githubLink);
    }

    const shareButton = document.createElement("button");
    shareButton.type = "button";
    shareButton.className = "overlay-action-btn share-btn";
    shareButton.setAttribute("aria-label", "Share project");
    shareButton.setAttribute("data-share-title", project.shareTitle || project.title || "");
    shareButton.setAttribute("data-share-url", project.shareUrl || project.githubUrl || "");
    shareButton.append(createShareIcon());

    overlayActions.append(shareButton);
    overlay.append(overlayActions);
    imageWrapper.append(img, overlay);

    const content = document.createElement("div");
    content.className = "project-content";
    const title = document.createElement("h3");
    title.className = "project-title";
    title.textContent = project.title || "";
    const meta = document.createElement("div");
    meta.className = "project-meta";
    (project.meta || []).forEach((item) => {
        const span = document.createElement("span");
        span.textContent = item;
        meta.append(span);
    });
    const description = document.createElement("p");
    description.className = "project-description";
    description.textContent = project.description || "";

    const highlights = document.createElement("ul");
    highlights.className = "project-highlights";
    (project.highlights || []).forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        highlights.append(li);
    });

    const tech = document.createElement("ul");
    tech.className = "project-tech-tags";
    (project.tech || []).forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        tech.append(li);
    });

    const detailButton = document.createElement("button");
    detailButton.type = "button";
    detailButton.className = "project-detail-btn";
    detailButton.setAttribute("data-project", String(index));
    detailButton.setAttribute("aria-label", `View details for ${project.title || "project"}`);
    detailButton.textContent = "View Details ->";

    content.append(title, meta, description, highlights, tech, detailButton);
    card.append(imageWrapper, content);
    return card;
};

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

export const initProjectFilters = () => {
    const filterButtons = Array.from(document.querySelectorAll(".project-filter"));
    if (!filterButtons.length) return;

    const getProjectCards = () => Array.from(document.querySelectorAll(".project-card[data-category]"));
    let currentFilter = "all";

    const setActiveFilter = (targetFilter) => {
        const normalizedFilter = targetFilter || "all";
        currentFilter = normalizedFilter;

        filterButtons.forEach((button) => {
            const isActive = (button.getAttribute("data-filter") || "all") === normalizedFilter;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });

        getProjectCards().forEach((card) => {
            const categories = (card.getAttribute("data-category") || "")
                .split(/\s+/)
                .filter(Boolean);
            const shouldShow = normalizedFilter === "all" || categories.includes(normalizedFilter);
            card.classList.toggle("is-hidden", !shouldShow);
        });
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
};

export const initProjectModal = () => {
    const overlay = document.getElementById("project-modal-overlay");
    const closeBtn = document.getElementById("project-modal-close");
    if (!overlay || !closeBtn) return;
    overlay.setAttribute("aria-hidden", "true");

    let lastFocusedElement = null;
    let previousBodyOverflow = "";

    const getProjectsData = () => {
        return Array.from(document.querySelectorAll(".project-card")).map((card) => ({
            title: (card.querySelector(".project-title") || {}).textContent?.trim() || "",
            description: (card.querySelector(".project-description") || {}).textContent?.trim() || "",
            categories: (card.getAttribute("data-category") || "").split(/\s+/).filter(Boolean),
            meta: Array.from(card.querySelectorAll(".project-meta span")).map((s) => s.textContent?.trim()).filter(Boolean),
            highlights: Array.from(card.querySelectorAll(".project-highlights li")).map((li) => li.textContent?.trim()).filter(Boolean),
            tech: Array.from(card.querySelectorAll(".project-tech-tags li")).map((li) => li.textContent?.trim()).filter(Boolean),
            image: card.querySelector(".project-image")?.getAttribute("src") || "",
            imageAlt: card.querySelector(".project-image")?.getAttribute("alt") || "",
            githubUrl: card.querySelector(".github-btn")?.getAttribute("href") || "",
            shareUrl: card.querySelector(".share-btn")?.getAttribute("data-share-url") || "",
            shareTitle: card.querySelector(".share-btn")?.getAttribute("data-share-title") || "",
        }));
    };

    const fillTextList = (container, items, className = "") => {
        if (!container) return;
        container.textContent = "";
        items.forEach((item) => {
            const element = document.createElement(className ? "span" : "li");
            if (className) element.className = className;
            element.textContent = item;
            container.append(element);
        });
    };

    const openModal = (projectIndex) => {
        const projects = getProjectsData();
        const project = projects[projectIndex];
        if (!project) return;

        // Populate modal
        const img = document.getElementById("project-modal-img");
        const title = document.getElementById("project-modal-title");
        const desc = document.getElementById("project-modal-desc");
        const highlightsList = document.getElementById("project-modal-highlights");
        const techList = document.getElementById("project-modal-tech");
        const catsList = document.getElementById("project-modal-cats");
        const actions = document.getElementById("project-modal-actions");

        if (img) {
            if (project.image) {
                img.src = project.image;
                img.alt = project.imageAlt || project.title;
                img.hidden = false;
            } else {
                img.removeAttribute("src");
                img.alt = "";
                img.hidden = true;
            }
        }
        if (title) title.textContent = project.title;
        if (desc) desc.textContent = project.description;

        fillTextList(highlightsList, project.highlights);
        fillTextList(techList, project.tech, "project-modal-tech-tag");
        fillTextList(catsList, project.categories, "project-modal-cat");

        if (actions) {
            actions.textContent = "";

            if (project.githubUrl) {
                const githubLink = document.createElement("a");
                githubLink.href = project.githubUrl;
                githubLink.target = "_blank";
                githubLink.rel = "noopener noreferrer";
                githubLink.className = "project-modal-btn project-modal-btn-primary";
                const githubIcon = document.createElement("i");
                githubIcon.className = "devicon-github-original";
                githubIcon.setAttribute("aria-hidden", "true");
                githubLink.append(githubIcon, document.createTextNode(" View on GitHub"));
                actions.append(githubLink);
            }

            const shareBtn = document.createElement("button");
            shareBtn.type = "button";
            shareBtn.className = "project-modal-btn project-modal-btn-secondary";
            shareBtn.append(createShareIcon(16), document.createTextNode("Share"));
            shareBtn.addEventListener("click", async () => {
                const outcome = await shareLink({
                    title: project.shareTitle || project.title,
                    url: project.shareUrl || project.githubUrl || window.location.href
                });
                if (outcome === "copied") {
                    showToast("Link copied to clipboard!");
                }
            });
            actions.append(shareBtn);
        }

        overlay.classList.add("is-open");
        overlay.setAttribute("aria-hidden", "false");
        lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeBtn.focus();
    };

    const closeModal = () => {
        overlay.classList.remove("is-open");
        overlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = previousBodyOverflow;
        if (lastFocusedElement && lastFocusedElement.isConnected) {
            lastFocusedElement.focus();
        }
    };

    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeModal();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && overlay.classList.contains("is-open")) closeModal();
    });

    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".project-detail-btn");
        if (!btn) return;
        const index = parseInt(btn.getAttribute("data-project") || "0", 10);
        openModal(index);
    });
};
