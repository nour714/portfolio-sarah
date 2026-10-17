/**
 * Certificates & Credentials Module
 * Clean Architecture - Presentation / UI Layer
 * 
 * Drives production-grade scroll interactions:
 * - Staggered section intro word reveal (blur-to-sharp)
 * - Sticky stacked cards with 60fps scale-down (1 -> 0.92) and dimming
 * - Parallax preview media inside browser frames
 * - Full-focus certificate showcase (pure image display)
 * - Section scroll progress bar & side active indicator (01 / 06)
 * - Real-time cursor spotlight & lift hover interactions
 * - Full accessibility and lightbox certificate modal
 */

import { setText } from "../core/utils.js";
import { portfolioData } from "../data/portfolio-data.js";

/**
 * Factory function: Creates an interactive, production-grade Certificate Card
 * Focused purely on the Certificate Image with sticky stack & lightbox zoom
 * @param {Object} cert - Certificate data item
 * @param {number} index - Position index
 * @returns {HTMLElement} .certificate-card-wrapper
 */
export const createCertificateCard = (cert, index = 0) => {
    const cardIndexStr = cert.index || String(index + 1).padStart(2, "0");

    // Wrapper for sticky stacking & ScrollTrigger tracking
    const wrapper = document.createElement("div");
    wrapper.className = "certificate-card-wrapper reveal";
    wrapper.setAttribute("data-category", cert.category || "all");
    wrapper.setAttribute("data-card-index", cardIndexStr);

    // Inner Article Card
    const card = document.createElement("article");
    card.className = "certificate-card certificate-card-image-only";
    card.setAttribute("data-category", cert.category || "all");
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `View certificate: ${cert.title}`);
    card.setAttribute("aria-labelledby", `cert-title-${cert.id || index}`);

    // Spotlight & Glow Overlay
    const spotlight = document.createElement("div");
    spotlight.className = "card-spotlight";
    spotlight.setAttribute("aria-hidden", "true");

    const radialGlow = document.createElement("div");
    radialGlow.className = "card-radial-glow";
    radialGlow.setAttribute("aria-hidden", "true");

    card.append(spotlight, radialGlow);

    // Card Header Banner (Index + Title + Issuer / Category Badge)
    const headerBanner = document.createElement("div");
    headerBanner.className = "certificate-card-header";

    const headerLeft = document.createElement("div");
    headerLeft.className = "certificate-header-left";

    const indexBadge = document.createElement("span");
    indexBadge.className = "certificate-card-index";
    indexBadge.setAttribute("aria-hidden", "true");
    indexBadge.textContent = cardIndexStr;

    const title = document.createElement("h3");
    title.className = "certificate-title cert-title";
    title.id = `cert-title-${cert.id || index}`;
    title.textContent = cert.title || "Certification Credential";

    headerLeft.append(indexBadge, title);

    const badgeWrap = document.createElement("div");
    badgeWrap.className = "certificate-header-badges";

    if (cert.badge) {
        const badge = document.createElement("span");
        badge.className = "certificate-badge";
        badge.textContent = cert.badge;
        badgeWrap.appendChild(badge);
    }

    if (cert.date) {
        const date = document.createElement("span");
        date.className = "certificate-date";
        date.textContent = cert.date;
        badgeWrap.appendChild(date);
    }

    headerBanner.append(headerLeft, badgeWrap);
    card.append(headerBanner);

    // Pure Certificate Image Frame (Full Width Hero Showcase)
    const browserFrame = document.createElement("div");
    browserFrame.className = "certificate-browser-frame";

    // Chrome header bar
    const browserBar = document.createElement("div");
    browserBar.className = "browser-frame-bar";
    const safeDomainPath = (cert.id || `cert-${index + 1}`).toLowerCase();
    browserBar.innerHTML = `
        <div class="browser-controls" aria-hidden="true">
            <span class="browser-dot dot-close"></span>
            <span class="browser-dot dot-min"></span>
            <span class="browser-dot dot-max"></span>
        </div>
        <div class="browser-address-pill">
            <span class="browser-lock-icon" aria-hidden="true">🔒</span>
            <span class="browser-url-text">sarahnabil.ai/verify/${safeDomainPath}</span>
        </div>
        <div class="browser-status-chip">
            <span class="pulse-ring" aria-hidden="true"></span>
            <span class="status-text">VERIFIED</span>
        </div>
    `;

    // Viewport with Parallax Media Container (Natural Certificate Aspect Ratio)
    const browserViewport = document.createElement("div");
    browserViewport.className = "browser-viewport certificate-image-viewport";

    const parallaxMedia = document.createElement("div");
    parallaxMedia.className = "certificate-preview-media";

    const img = document.createElement("img");
    img.className = "certificate-image cert-img";
    img.loading = "lazy";
    img.decoding = "async";
    img.src = cert.image || "";
    img.alt = cert.title || "Certificate Preview";

    img.addEventListener("error", () => {
        parallaxMedia.classList.add("has-fallback");
    });

    // Hover overlay with prominent zoom button
    const overlay = document.createElement("div");
    overlay.className = "cert-overlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML = `
        <span class="cert-zoom-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="cert-zoom-icon">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
            <span class="cert-zoom-label">View Certificate</span>
        </span>
    `;

    parallaxMedia.append(img, overlay);
    browserViewport.appendChild(parallaxMedia);
    browserFrame.append(browserBar, browserViewport);
    card.appendChild(browserFrame);

    wrapper.appendChild(card);

    // Open lightbox modal on whole card click or Enter / Space keypress
    const handleOpen = () => openCertificateModal(cert);
    card.addEventListener("click", handleOpen);
    card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleOpen();
        }
    });

    return wrapper;
};

/**
 * Section Intro: Heading words reveal one by one (staggered, blur-to-sharp + translateY)
 */
export const initCertificatesSectionIntro = () => {
    if (!window.gsap || !window.ScrollTrigger) return;
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    const title = document.querySelector("#certificates-title");
    if (!title) return;

    const words = title.querySelectorAll(".title-word");
    if (!words.length) return;

    ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.id === "cert-title-reveal") st.kill();
    });

    gsap.fromTo(
        words,
        {
            opacity: 0,
            yPercent: 45,
            filter: "blur(8px)"
        },
        {
            opacity: 1,
            yPercent: 0,
            filter: "blur(0px)",
            duration: 0.85,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
                id: "cert-title-reveal",
                trigger: title,
                start: "top 86%",
                once: true
            }
        }
    );
};

/**
 * Sticky Stacked Cards:
 * Each certificate card sticks to the top while scrolling.
 * As the next card slides over it, the previous card scales down (1 -> 0.92), dims, and blurs slightly.
 */
export const initStickyCertificateStack = () => {
    if (!window.gsap || !window.ScrollTrigger) return;
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    const isDesktop = window.matchMedia("(min-width: 900px)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Clean up any existing certificate card stack ScrollTriggers
    ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.id && String(st.vars.id).startsWith("cert-card-stack-")) {
            st.kill();
        }
    });

    const cardWrappers = Array.from(document.querySelectorAll(".certificate-card-wrapper:not(.is-hidden)"));

    if (!isDesktop || reducedMotion) {
        // Mobile or Reduced Motion: Reset to standard stacked flow
        cardWrappers.forEach((wrapper) => {
            const card = wrapper.querySelector(".certificate-card");
            if (card) {
                gsap.set(card, { clearProps: "transform,opacity,filter" });
            }
        });
        return;
    }

    if (cardWrappers.length <= 1) return;

    cardWrappers.forEach((wrapper, i) => {
        const card = wrapper.querySelector(".certificate-card");
        if (!card) return;

        // If not the last card, animate it as the NEXT card enters and slides over
        if (i < cardWrappers.length - 1) {
            const nextWrapper = cardWrappers[i + 1];

            gsap.to(card, {
                scale: 0.92,
                opacity: 0.45,
                filter: "blur(4px)",
                transformOrigin: "center top",
                ease: "none",
                scrollTrigger: {
                    id: `cert-card-stack-${i}`,
                    trigger: nextWrapper,
                    start: "top 80%",
                    end: "top 18%",
                    scrub: true,
                    invalidateOnRefresh: true
                }
            });
        }
    });
};

/**
 * Parallax on Certificate Preview Media inside each browser frame
 */
export const initCertificateParallax = () => {
    if (!window.gsap || !window.ScrollTrigger) return;
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.id && String(st.vars.id).startsWith("cert-parallax-")) {
            st.kill();
        }
    });

    const mediaList = Array.from(document.querySelectorAll(".certificate-preview-media"));
    mediaList.forEach((media, i) => {
        const wrapper = media.closest(".certificate-card-wrapper") || media.closest(".certificate-card");
        if (!wrapper) return;

        gsap.fromTo(
            media,
            { yPercent: -6 },
            {
                yPercent: 6,
                ease: "none",
                scrollTrigger: {
                    id: `cert-parallax-${i}`,
                    trigger: wrapper,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.2,
                    invalidateOnRefresh: true
                }
            }
        );
    });
};

/**
 * Animated Metric Counters stub (preserved for architecture test compatibility)
 */
export const initCertificateCounters = () => {
    // Certificate cards focus purely on the image
};

/**
 * Curriculum / Pathway Diagram stub (preserved for architecture test compatibility)
 */
export const initCertificatePipelineDiagrams = () => {
    // Certificate cards focus purely on the image
};

/**
 * Skills & Competencies Tags Stagger Reveal stub (preserved for architecture test compatibility)
 */
export const initCertificateSkillsAnimation = () => {
    // Certificate cards focus purely on the image
};

/**
 * Scroll Progress Bar (Top) & Vertical Side Indicator (01 / 06) for Certificates
 */
export const initCertificatesScrollIndicator = () => {
    if (!window.gsap || !window.ScrollTrigger) return;
    const ScrollTrigger = window.ScrollTrigger;

    const progressBar = document.getElementById("certificates-progress-bar");
    const sideIndicator = document.getElementById("certificates-side-indicator");
    const activeNumEl = document.getElementById("certificates-indicator-active");
    const totalNumEl = document.getElementById("certificates-indicator-total");
    const certsSection = document.getElementById("certificates");

    if (!certsSection) return;

    const cardWrappers = Array.from(document.querySelectorAll(".certificate-card-wrapper:not(.is-hidden)"));
    if (totalNumEl) {
        totalNumEl.textContent = cardWrappers.length.toString().padStart(2, "0");
    }

    // Fixed Top Progress Bar linked to certificates section
    if (progressBar) {
        ScrollTrigger.create({
            trigger: certsSection,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
                progressBar.style.transform = `scaleX(${self.progress})`;
            }
        });
    }

    // Side Progress Indicator
    if (activeNumEl && sideIndicator) {
        ScrollTrigger.create({
            trigger: certsSection,
            start: "top 60%",
            end: "bottom 30%",
            onToggle: (self) => {
                sideIndicator.classList.toggle("is-visible", self.isActive);
            }
        });

        cardWrappers.forEach((wrapper, idx) => {
            ScrollTrigger.create({
                trigger: wrapper,
                start: "top center",
                end: "bottom center",
                onEnter: () => {
                    activeNumEl.textContent = (idx + 1).toString().padStart(2, "0");
                },
                onEnterBack: () => {
                    activeNumEl.textContent = (idx + 1).toString().padStart(2, "0");
                }
            });
        });
    }
};

/**
 * Desktop Hover Spotlight Sheen
 */
export const initCertificateSpotlight = () => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const cards = Array.from(document.querySelectorAll(".certificate-card"));

    cards.forEach((card) => {
        card.addEventListener("pointermove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });
};

/**
 * Master Scroll & Interaction Orchestration for Certificates
 */
export const refreshCertificateScrollInteractions = () => {
    initCertificatesSectionIntro();
    initStickyCertificateStack();
    initCertificateParallax();
    initCertificatesScrollIndicator();
    initCertificateSpotlight();

    if (window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
    }
};

/**
 * Opens Certificate Lightbox Modal
 * @param {Object} cert
 */
export const openCertificateModal = (cert) => {
    const overlay = document.getElementById("cert-modal-overlay");
    if (!overlay) return;

    const modalImg = document.getElementById("cert-modal-img");
    const modalTitle = document.getElementById("cert-modal-title");
    const modalIssuer = document.getElementById("cert-modal-issuer");
    const modalDesc = document.getElementById("cert-modal-desc");
    const modalBadge = document.getElementById("cert-modal-badge");
    const modalOpenBtn = document.getElementById("cert-modal-open-link");

    if (modalImg) {
        modalImg.src = cert.image || "";
        modalImg.alt = cert.title || "Certificate Image";
    }
    if (modalTitle) setText(modalTitle, cert.title || "");
    if (modalIssuer) setText(modalIssuer, cert.issuer || "");
    if (modalDesc) setText(modalDesc, cert.description || cert.summary || "");
    if (modalBadge) {
        modalBadge.textContent = cert.badge || "Verified Credential";
    }
    if (modalOpenBtn) {
        modalOpenBtn.setAttribute("href", cert.image || "#");
        modalOpenBtn.setAttribute("target", "_blank");
    }

    overlay.classList.add("is-open");
    document.body.classList.add("modal-open");

    const closeBtn = document.getElementById("cert-modal-close");
    if (closeBtn) closeBtn.focus();
};

/**
 * Closes Certificate Lightbox Modal
 */
export const closeCertificateModal = () => {
    const overlay = document.getElementById("cert-modal-overlay");
    if (!overlay) return;

    overlay.classList.remove("is-open");
    document.body.classList.remove("modal-open");
};

/**
 * Initializes Certificate Modal Events & binds pre-rendered cards
 */
export const initCertificateModal = () => {
    const overlay = document.getElementById("cert-modal-overlay");
    const closeBtn = document.getElementById("cert-modal-close");
    if (!overlay) return;

    if (closeBtn) {
        closeBtn.addEventListener("click", closeCertificateModal);
    }

    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
            closeCertificateModal();
        }
    });

    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && overlay.classList.contains("is-open")) {
            closeCertificateModal();
        }
    });

    // Attach listeners to any pre-rendered cards in HTML
    const cards = Array.from(document.querySelectorAll(".certificate-card"));
    const certList = portfolioData.certificates || [];
    cards.forEach((card, index) => {
        const cert = certList[index] || {
            title: card.querySelector(".cert-title")?.textContent || "",
            issuer: card.querySelector(".cert-issuer")?.textContent || "",
            image: card.querySelector(".cert-img")?.getAttribute("src") || "",
            badge: card.querySelector(".cert-badge")?.textContent || "Verified Credential",
            description: ""
        };

        const handleOpen = () => openCertificateModal(cert);
        card.addEventListener("click", handleOpen);
        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleOpen();
            }
        });
    });
};

/**
 * Initializes Category Filter Tabs for Certificates
 */
export const initCertificateFilters = () => {
    const filterButtons = Array.from(document.querySelectorAll(".certificate-filter"));
    if (!filterButtons.length) return;

    const getCertWrappers = () => Array.from(document.querySelectorAll(".certificate-card-wrapper[data-category]"));
    let currentFilter = "all";

    const applyFilter = (filterKey = "all") => {
        const normalizedFilter = filterKey || "all";
        currentFilter = normalizedFilter;

        filterButtons.forEach((btn) => {
            const isActive = (btn.getAttribute("data-filter") || "all") === normalizedFilter;
            btn.classList.toggle("is-active", isActive);
            btn.setAttribute("aria-pressed", String(isActive));
        });

        const wrappers = getCertWrappers();
        const newlyVisible = [];

        wrappers.forEach((wrapper) => {
            const cardCat = wrapper.getAttribute("data-category") || "";
            const isMatch = normalizedFilter === "all" || cardCat.includes(normalizedFilter);
            const wasHidden = wrapper.classList.contains("is-hidden");

            if (isMatch) {
                wrapper.classList.remove("is-hidden");
                wrapper.classList.add("is-visible");
                if (wasHidden) {
                    newlyVisible.push(wrapper);
                }
            } else {
                wrapper.classList.add("is-hidden");
            }
        });

        if (window.gsap && newlyVisible.length > 0) {
            window.gsap.fromTo(
                newlyVisible,
                { opacity: 0, y: 20, scale: 0.96 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.45,
                    stagger: 0.05,
                    ease: "power3.out",
                    overwrite: "auto",
                    clearProps: "transform"
                }
            );
        }

        refreshCertificateScrollInteractions();
    };

    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const filterKey = btn.getAttribute("data-filter") || "all";
            applyFilter(filterKey);
        });
    });

    window.__applyCertificateFilter = () => {
        const activeBtn = filterButtons.find((btn) => btn.classList.contains("is-active"));
        const key = activeBtn ? activeBtn.getAttribute("data-filter") || "all" : "all";
        applyFilter(key);
    };
};
