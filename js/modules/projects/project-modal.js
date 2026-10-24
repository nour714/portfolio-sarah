/**
 * Project Detail Lightbox Modal (Case Study Deep Dive)
 * Clean Architecture - Presentation / Projects Layer
 */

import { createShareIcon, shareLink } from "../../core/utils.js";
import { showToast } from "../../services/toast.service.js";
import { projects as defaultProjects } from "../../data/projects.js";
import { createPipelineSvg, createMetricsHtml } from "./project-card.js";

/**
 * Triggers interactive animations inside the opened Case Study modal
 */
export const animateModalArchitecture = (modalEl) => {
    if (!window.gsap) return;
    const gsap = window.gsap;

    // 1. Metric Counters inside modal
    const metrics = Array.from(modalEl.querySelectorAll(".project-metric[data-target]"));
    metrics.forEach((metric) => {
        const numberEl = metric.querySelector(".metric-number");
        if (!numberEl) return;
        const target = parseFloat(metric.dataset.target || "0");
        const isDecimal = String(metric.dataset.target).includes(".");
        const decimals = isDecimal ? (String(metric.dataset.target).split(".")[1] || "").length : 0;
        const obj = { val: 0 };
        gsap.fromTo(
            obj,
            { val: 0 },
            {
                val: target,
                duration: 1.4,
                ease: "power2.out",
                onUpdate: () => {
                    numberEl.textContent = isDecimal
                        ? obj.val.toFixed(decimals)
                        : Math.round(obj.val).toString();
                }
            }
        );
    });

    // 2. SVG Architecture Pipeline inside modal
    const pipeline = modalEl.querySelector(".project-pipeline");
    if (pipeline) {
        const line = pipeline.querySelector(".pipeline-progress-line");
        const nodes = Array.from(pipeline.querySelectorAll(".pipeline-node"));
        if (line) {
            gsap.fromTo(
                line,
                { strokeDashoffset: 100 },
                { strokeDashoffset: 0, duration: 1.3, ease: "power2.out", delay: 0.1 }
            );
        }
        if (nodes.length) {
            gsap.fromTo(
                nodes,
                { opacity: 0, scale: 0.86, y: 8 },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.45,
                    stagger: 0.08,
                    ease: "back.out(1.5)",
                    delay: 0.15
                }
            );
        }
    }
};

/**
 * Initializes Project Detail Lightbox Modal (Case Study Deep Dive)
 */
export const initProjectModal = () => {
    let overlay = document.getElementById("project-modal-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "project-modal-overlay";
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.setAttribute("aria-labelledby", "project-modal-title");
        overlay.setAttribute("data-lenis-prevent", "");
        overlay.innerHTML = `
            <div class="project-modal" data-lenis-prevent>
                <button class="project-modal-close" id="project-modal-close" aria-label="Close modal">
                    <svg viewBox="0 0 24 24">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                <img src="" alt="" class="project-modal-img" id="project-modal-img">
                <div class="project-modal-body">
                    <div class="project-modal-cats" id="project-modal-cats"></div>
                    <h2 class="project-modal-title" id="project-modal-title"></h2>
                    <div class="project-modal-problem-slot" id="project-modal-problem-slot"></div>
                    <div class="project-modal-metrics-slot" id="project-modal-metrics-slot"></div>
                    <div class="project-modal-pipeline-slot" id="project-modal-pipeline-slot"></div>
                    <div class="project-modal-overview-slot">
                        <h3 class="modal-section-heading">System Overview</h3>
                        <p class="project-modal-desc" id="project-modal-desc"></p>
                    </div>
                    <div class="project-modal-highlights-slot" id="project-modal-highlights-slot">
                        <h3 class="modal-section-heading">Architecture & Engineering Highlights</h3>
                        <ul class="project-modal-highlights" id="project-modal-highlights"></ul>
                    </div>
                    <div class="project-modal-tech-slot">
                        <h3 class="modal-section-heading">Technologies Used</h3>
                        <div class="project-modal-tech" id="project-modal-tech"></div>
                    </div>
                    <div class="project-modal-actions" id="project-modal-actions"></div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    const closeBtn = document.getElementById("project-modal-close");
    if (!overlay || !closeBtn) return;
    overlay.setAttribute("aria-hidden", "true");

    let lastFocusedElement = null;
    let previousBodyOverflow = "";

    const getProjectDataByIndex = (projectIndex) => {
        if (window.__projectsData && window.__projectsData[projectIndex]) {
            return window.__projectsData[projectIndex];
        }
        if (Array.isArray(defaultProjects) && defaultProjects[projectIndex]) {
            return defaultProjects[projectIndex];
        }
        return null;
    };

    const openModal = (projectIndex) => {
        const project = getProjectDataByIndex(projectIndex);
        if (!project) return;

        lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const titleEl = document.getElementById("project-modal-title");
        const descEl = document.getElementById("project-modal-desc");
        const catsEl = document.getElementById("project-modal-cats");
        const problemSlot = document.getElementById("project-modal-problem-slot");
        const metricsSlot = document.getElementById("project-modal-metrics-slot");
        const pipelineSlot = document.getElementById("project-modal-pipeline-slot");
        const highlightsEl = document.getElementById("project-modal-highlights");
        const highlightsSlot = document.getElementById("project-modal-highlights-slot");
        const techEl = document.getElementById("project-modal-tech");
        const imgEl = document.getElementById("project-modal-img");
        const actionsEl = document.getElementById("project-modal-actions");

        if (titleEl) titleEl.textContent = project.title || "ML System Architecture";
        if (descEl) descEl.textContent = project.description || "";

        // Category & Meta Badges
        if (catsEl) {
            catsEl.innerHTML = "";
            const tags = Array.from(new Set([...(project.categories || []), ...(project.meta || [])]));
            tags.forEach((tag) => {
                const span = document.createElement("span");
                span.className = "project-modal-cat";
                span.textContent = tag;
                catsEl.appendChild(span);
            });
        }

        // Preview Image
        if (imgEl) {
            const imgSrc = project.image?.src || project.previewUrl || "";
            if (imgSrc) {
                imgEl.src = imgSrc;
                imgEl.alt = project.image?.alt || project.title || "Project Preview";
                imgEl.style.display = "block";
            } else {
                imgEl.style.display = "none";
            }
        }

        // Problem Statement Box
        if (problemSlot) {
            if (project.problemStatement) {
                problemSlot.style.display = "block";
                problemSlot.innerHTML = `
                    <div class="project-problem-box modal-problem-box">
                        <span class="problem-pill">PROBLEM</span>
                        <p class="problem-text">${project.problemStatement}</p>
                    </div>
                `;
            } else {
                problemSlot.style.display = "none";
                problemSlot.innerHTML = "";
            }
        }

        // Key Performance Metrics Grid
        if (metricsSlot) {
            if (Array.isArray(project.metrics) && project.metrics.length) {
                metricsSlot.style.display = "block";
                metricsSlot.innerHTML = `
                    <div class="modal-section-badge">
                        <span class="modal-dot"></span>
                        <span>Key Production Metrics</span>
                    </div>
                    ${createMetricsHtml(project.metrics)}
                `;
            } else {
                metricsSlot.style.display = "none";
                metricsSlot.innerHTML = "";
            }
        }

        // MLOps Pipeline Architecture Diagram
        if (pipelineSlot) {
            if (Array.isArray(project.pipeline) && project.pipeline.length) {
                pipelineSlot.style.display = "block";
                pipelineSlot.innerHTML = createPipelineSvg(project.pipeline, "modal-" + projectIndex);
            } else {
                pipelineSlot.style.display = "none";
                pipelineSlot.innerHTML = "";
            }
        }

        // Key Highlights
        if (highlightsEl && highlightsSlot) {
            if (Array.isArray(project.highlights) && project.highlights.length) {
                highlightsSlot.style.display = "block";
                highlightsEl.innerHTML = "";
                project.highlights.forEach((h) => {
                    const li = document.createElement("li");
                    li.textContent = h;
                    highlightsEl.appendChild(li);
                });
            } else {
                highlightsSlot.style.display = "none";
            }
        }

        // Tech Stack
        if (techEl) {
            techEl.innerHTML = "";
            (project.tech || []).forEach((t) => {
                const span = document.createElement("span");
                span.className = "project-modal-tech-tag";
                span.textContent = t;
                techEl.appendChild(span);
            });
        }

        // Actions: Share
        if (actionsEl) {
            actionsEl.innerHTML = "";
            const shareBtn = document.createElement("button");
            shareBtn.type = "button";
            shareBtn.className = "project-modal-btn project-modal-btn-primary";
            shareBtn.innerHTML = `<span>Share Project</span>`;
            shareBtn.prepend(createShareIcon(16));
            shareBtn.addEventListener("click", async () => {
                const outcome = await shareLink({
                    title: project.shareTitle || project.title,
                    url: project.shareUrl || project.githubUrl || window.location.href
                });
                if (outcome === "copied") {
                    showToast("Link copied to clipboard!");
                }
            });
            actionsEl.appendChild(shareBtn);
        }

        overlay.classList.add("is-open");
        overlay.setAttribute("aria-hidden", "false");
        closeBtn.focus();

        // Trigger dynamic animations inside modal
        animateModalArchitecture(overlay);
    };

    const closeModal = () => {
        if (!overlay.classList.contains("is-open")) return;
        overlay.classList.remove("is-open");
        overlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = previousBodyOverflow;
        if (lastFocusedElement) {
            lastFocusedElement.focus();
            lastFocusedElement = null;
        }
    };

    document.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const detailButton = target.closest(".project-detail-btn");
        if (detailButton) {
            event.preventDefault();
            const index = Number(detailButton.getAttribute("data-project") || 0);
            openModal(index);
            return;
        }

        if (target === overlay || target.closest("#project-modal-close")) {
            event.preventDefault();
            closeModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && overlay.classList.contains("is-open")) {
            closeModal();
        }
    });
};
