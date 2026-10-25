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

import { setText, bindCardSpotlight } from "../core/utils.js";
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
    wrapper.className = "certificate-card-wrapper reveal is-visible";
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
        <div class="browser-bar-actions">
            <div class="browser-status-chip">
                <span class="pulse-ring" aria-hidden="true"></span>
                <span class="status-text">VERIFIED</span>
            </div>
            ${cert.verificationUrl && cert.verificationUrl !== '#' ? `
            <a href="${cert.verificationUrl}" class="browser-view-full-btn" target="_blank" rel="noopener noreferrer" title="View original authentic document" onclick="event.stopPropagation();">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <span>Original PDF</span>
            </a>` : ''}
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
                toggleActions: "restart none restart none"
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

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Clean up any existing certificate card stack ScrollTriggers
    ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.id && String(st.vars.id).startsWith("cert-card-stack-")) {
            st.kill();
        }
    });

    const cardWrappers = Array.from(document.querySelectorAll(".certificate-card-wrapper:not(.is-hidden)"));

    if (reducedMotion) {
        // Reduced Motion: Reset to standard stacked flow
        cardWrappers.forEach((wrapper) => {
            const card = wrapper.querySelector(".certificate-card");
            if (card) {
                gsap.set(card, { clearProps: "transform,opacity,filter" });
            }
        });
        return;
    }

    if (cardWrappers.length <= 1) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const targetScale = isMobile ? 0.94 : 0.92;
    const targetOpacity = isMobile ? 0.5 : 0.45;
    const targetBlur = isMobile ? "blur(3px)" : "blur(4px)";
    const startTrigger = isMobile ? "top 85%" : "top 80%";
    const endTrigger = isMobile ? "top 16%" : "top 18%";

    cardWrappers.forEach((wrapper, i) => {
        wrapper.style.zIndex = String(i + 1);
        const card = wrapper.querySelector(".certificate-card");
        if (!card) return;

        // If not the last card, animate it as the NEXT card enters and slides over
        if (i < cardWrappers.length - 1) {
            const nextWrapper = cardWrappers[i + 1];

            gsap.to(card, {
                scale: targetScale,
                opacity: targetOpacity,
                filter: targetBlur,
                transformOrigin: "center top",
                ease: "none",
                scrollTrigger: {
                    id: `cert-card-stack-${i}`,
                    trigger: nextWrapper,
                    start: startTrigger,
                    end: endTrigger,
                    scrub: true,
                    invalidateOnRefresh: true
                }
            });
        }
    });
};

/**
 * Parallax on Certificate Preview Media - Disabled vertical translation
 * so that 100% of official certificates, borders, and signatures are always visible.
 */
export const initCertificateParallax = () => {
    if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach((st) => {
            if (st.vars.id && String(st.vars.id).startsWith("cert-parallax-")) {
                st.kill();
            }
        });
    }

    const mediaList = Array.from(document.querySelectorAll(".certificate-preview-media"));
    mediaList.forEach((media) => {
        if (window.gsap) {
            window.gsap.set(media, { clearProps: "transform" });
        }
    });
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
    bindCardSpotlight(".certificate-card");
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
 * Ensures Certificate Lightbox Modal exists in DOM
 */
export const ensureCertificateModal = () => {
    let overlay = document.getElementById("cert-modal-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "cert-modal-overlay";
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.setAttribute("aria-labelledby", "cert-modal-title");
        overlay.setAttribute("data-lenis-prevent", "");
        overlay.innerHTML = `
            <div class="cert-modal" data-lenis-prevent>
                <button class="cert-modal-close" id="cert-modal-close" aria-label="Close certificate modal">
                    <svg viewBox="0 0 24 24">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                <div class="cert-modal-media">
                    <img src="" alt="" class="cert-modal-img" id="cert-modal-img">
                </div>
                <h2 class="cert-modal-title sr-only" id="cert-modal-title"></h2>
                <div class="cert-modal-body" aria-hidden="true">
                    <span class="cert-modal-badge" id="cert-modal-badge">Verified Credential</span>
                    <p class="cert-modal-issuer" id="cert-modal-issuer"></p>
                    <p class="cert-modal-desc" id="cert-modal-desc"></p>
                    <div class="cert-modal-actions">
                        <a href="#" class="cert-modal-btn cert-modal-btn-primary" id="cert-modal-open-link" target="_blank" rel="noopener noreferrer">
                            <span>View Full Image</span>
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                <polyline points="7 7 17 7 17 17"></polyline>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }
    return overlay;
};

/**
 * Opens Certificate Lightbox Modal
 * @param {Object} cert
 */
export const openCertificateModal = (cert) => {
    const overlay = ensureCertificateModal();
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
    const overlay = ensureCertificateModal();
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

    const defaultFilter =
        filterButtons.find((button) => button.classList.contains("is-active"))?.getAttribute("data-filter") || "all";
    applyFilter(defaultFilter);
};
