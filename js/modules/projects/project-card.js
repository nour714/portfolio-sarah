/**
 * Project Card Component & Pipeline SVG Helpers
 * Clean Architecture - Presentation / Projects Layer
 */

/**
 * Creates an SVG Architecture Pipeline Flow with drawing connecting line
 */
export const createPipelineSvg = (pipeline, index) => {
    if (!Array.isArray(pipeline) || !pipeline.length) return "";

    const nodesHtml = pipeline.map((stage, sIdx) => {
        const title = typeof stage === "string" ? stage : stage.label;
        const detail = typeof stage === "object" && stage.detail ? stage.detail : "";
        return `
            <div class="pipeline-node" data-stage="${sIdx}">
                <div class="node-bullet">
                    <span class="bullet-inner"></span>
                    <span class="bullet-ring"></span>
                </div>
                <div class="node-meta">
                    <span class="node-title">${title}</span>
                    ${detail ? `<span class="node-detail">${detail}</span>` : ""}
                </div>
            </div>
        `;
    }).join("");

    return `
        <div class="project-pipeline" aria-label="Machine learning architecture pipeline">
            <div class="pipeline-header">
                <span class="pipeline-tag">
                    <span class="pipeline-indicator-dot" aria-hidden="true"></span>
                    MLOps Pipeline Architecture
                </span>
                <span class="pipeline-subtag">End-to-End Orchestration</span>
            </div>
            <div class="pipeline-flow">
                <div class="pipeline-svg-wrapper" aria-hidden="true">
                    <svg class="pipeline-svg-line" viewBox="0 0 100 2" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="pipe-grad-${index}" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stop-color="#8b5cf6" />
                                <stop offset="50%" stop-color="#a855f7" />
                                <stop offset="100%" stop-color="#22d3ee" />
                            </linearGradient>
                        </defs>
                        <line class="pipeline-bg-line" x1="0" y1="1" x2="100" y2="1" stroke="rgba(139, 92, 246, 0.2)" stroke-width="2" />
                        <line class="pipeline-progress-line" x1="0" y1="1" x2="100" y2="1" stroke="url(#pipe-grad-${index})" stroke-width="2" stroke-dasharray="100" stroke-dashoffset="100" />
                    </svg>
                </div>
                <div class="pipeline-nodes-row">
                    ${nodesHtml}
                </div>
            </div>
        </div>
    `;
};

/**
 * Creates 3 Animated Metric Counters
 */
export const createMetricsHtml = (metrics = []) => {
    if (!Array.isArray(metrics) || !metrics.length) return "";

    return `
        <div class="project-metrics-grid" role="group" aria-label="Key performance metrics">
            ${metrics.map((m) => `
                <div class="project-metric" data-target="${m.value}" data-prefix="${m.prefix || ""}" data-suffix="${m.suffix || ""}">
                    <div class="metric-value-wrap">
                        <span class="metric-prefix">${m.prefix || ""}</span>
                        <span class="metric-number">0</span>
                        <span class="metric-suffix">${m.suffix || ""}</span>
                    </div>
                    <span class="metric-label">${m.label}</span>
                </div>
            `).join("")}
        </div>
    `;
};

/**
 * Factory function: Creates a production-grade ML Engineer Project Card
 */
export const createProjectCard = (project, index) => {
    const cardIndexStr = project.index || String(index + 1).padStart(2, "0");

    // Wrapper for sticky stacking & ScrollTrigger tracking
    const wrapper = document.createElement("div");
    wrapper.className = "project-card-wrapper reveal";
    wrapper.setAttribute("data-category", (project.categories || []).join(" "));
    wrapper.setAttribute("data-card-index", cardIndexStr);

    // Inner Article Card
    const card = document.createElement("article");
    card.className = "project-card";
    card.setAttribute("data-category", (project.categories || []).join(" "));
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-labelledby", `project-title-${project.id || index}`);

    // Spotlight & Glow Overlay
    const spotlight = document.createElement("div");
    spotlight.className = "card-spotlight";
    spotlight.setAttribute("aria-hidden", "true");

    const radialGlow = document.createElement("div");
    radialGlow.className = "card-radial-glow";
    radialGlow.setAttribute("aria-hidden", "true");

    card.append(spotlight, radialGlow);

    // Card Header Banner (Index + System Category Tag)
    const headerBanner = document.createElement("div");
    headerBanner.className = "project-card-header";

    const indexBadge = document.createElement("div");
    indexBadge.className = "project-card-index";
    indexBadge.setAttribute("aria-hidden", "true");
    indexBadge.textContent = cardIndexStr;

    const categoryBadge = document.createElement("div");
    categoryBadge.className = "project-category-badge";
    const primaryCategory = (project.meta && project.meta[0]) || "Machine Learning";
    categoryBadge.textContent = primaryCategory;

    headerBanner.append(indexBadge, categoryBadge);
    card.append(headerBanner);

    // Main 2-Column Split: Content Column + Preview Column
    const cardBody = document.createElement("div");
    cardBody.className = "project-card-body";

    // 1. Content Column (Left on Desktop)
    const contentCol = document.createElement("div");
    contentCol.className = "project-content-col";

    // Title
    const title = document.createElement("h3");
    title.className = "project-title";
    title.id = `project-title-${project.id || index}`;
    title.textContent = project.title || "ML Project";

    // Short "What I Built" description
    const description = document.createElement("p");
    description.className = "project-description";
    description.textContent = project.description || "";

    // Tech Stack Tags
    const techList = document.createElement("ul");
    techList.className = "project-tech-tags";
    techList.setAttribute("aria-label", "Technologies used");
    (project.tech || []).forEach((t) => {
        const li = document.createElement("li");
        li.textContent = t;
        techList.append(li);
    });

    // Action Buttons
    const actionsRow = document.createElement("div");
    actionsRow.className = "project-actions-row";

    // Project Detail Modal Trigger
    const caseStudyBtn = document.createElement("button");
    caseStudyBtn.type = "button";
    caseStudyBtn.className = "project-btn project-btn-primary project-detail-btn";
    caseStudyBtn.setAttribute("data-project", String(index));
    caseStudyBtn.setAttribute("aria-label", `View details for ${project.title}`);
    caseStudyBtn.innerHTML = `<span>View Details</span><span class="case-study-arrow" aria-hidden="true">→</span>`;

    actionsRow.append(caseStudyBtn);

    contentCol.append(
        title,
        description,
        techList,
        actionsRow
    );

    // 2. Preview Column (Right on Desktop) - Browser-Style Frame
    const previewCol = document.createElement("div");
    previewCol.className = "project-preview-col";

    const browserFrame = document.createElement("div");
    browserFrame.className = "project-browser-frame";

    // Browser chrome toolbar
    const browserBar = document.createElement("div");
    browserBar.className = "browser-frame-bar";
    browserBar.innerHTML = `
        <div class="browser-controls" aria-hidden="true">
            <span class="browser-dot dot-close"></span>
            <span class="browser-dot dot-min"></span>
            <span class="browser-dot dot-max"></span>
        </div>
        <div class="browser-address-pill">
            <span class="browser-lock-icon" aria-hidden="true">🔒</span>
            <span class="browser-url-text">sarahnabil.ai/models/${project.id || index}</span>
        </div>
        <div class="browser-status-chip">
            <span class="pulse-ring" aria-hidden="true"></span>
            <span class="status-text">LIVE</span>
        </div>
    `;

    // Browser viewport with Parallax Media Container
    const browserViewport = document.createElement("div");
    browserViewport.className = "browser-viewport";

    const parallaxMedia = document.createElement("div");
    parallaxMedia.className = "project-preview-media";

    const img = document.createElement("img");
    img.className = "project-image";
    img.loading = "lazy";
    img.decoding = "async";
    img.width = 640;
    img.height = 360;
    img.alt = project.image?.alt || project.title || "Project Preview";

    let mediaEl;
    const rawWebp = project.image?.srcWebp || (project.image?.src && project.image.src.replace(/\.(png|jpe?g)$/i, '.webp'));
    if (rawWebp) {
        const picture = document.createElement("picture");
        const source = document.createElement("source");
        const match = rawWebp.match(/^(.*)\.webp$/i);
        if (match) {
            const base = match[1];
            source.srcset = `${base}-480.webp 480w, ${base}-800.webp 800w, ${rawWebp} 1200w`;
            source.sizes = "(max-width: 600px) 480px, (max-width: 1024px) 800px, 1200px";
        } else {
            source.srcset = rawWebp;
        }
        source.type = "image/webp";
        img.src = project.image?.src || rawWebp;
        picture.append(source, img);
        mediaEl = picture;
    } else {
        img.src = project.image?.src || "";
        mediaEl = img;
    }

    // Live Inference Overlay Chip
    const liveOverlay = document.createElement("div");
    liveOverlay.className = "preview-live-overlay";
    liveOverlay.innerHTML = `
        <span class="overlay-pulse-dot" aria-hidden="true"></span>
        <span>CUDA Ingestion Ready</span>
    `;

    parallaxMedia.append(mediaEl, liveOverlay);
    browserViewport.append(parallaxMedia);
    browserFrame.append(browserBar, browserViewport);
    previewCol.append(browserFrame);

    // Assemble Card Body
    cardBody.append(contentCol, previewCol);
    card.append(cardBody);
    wrapper.append(card);

    return wrapper;
};
