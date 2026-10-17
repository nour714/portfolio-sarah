/**
 * Skills Module
 * Clean Architecture - Presentation Layer
 * Interactive Circular Arc Carousel with Curved Arch Band
 * Sarah Nabil - Machine Learning, AI & Data Science Specialist
 */

// ==========================================================================
// Official & Bespoke Vector SVGs for Machine Learning & Data Science Stack
// ==========================================================================

const PYTHON_SVG = `<svg viewBox="0 0 24 24" class="skill-svg" width="34" height="34" aria-hidden="true">
    <path fill="#387eb8" d="M11.9 2c-5.1 0-4.8 2.2-4.8 2.2l.01 2.3h4.9v.7H5.2S2 6.8 2 12c0 5.1 2.8 4.9 2.8 4.9h1.7v-2.4s-.1-2.8 2.8-2.8h4.8s2.7.04 2.7-2.6V4.7S17.1 2 11.9 2zm-2.7 1.5c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z"/>
    <path fill="#ffe052" d="M12.1 22c5.1 0 4.8-2.2 4.8-2.2l-.01-2.3H12v-.7h6.8s3.2.4 3.2-4.8c0-5.1-2.8-4.9-2.8-4.9h-1.7v2.4s.1 2.8-2.8 2.8H9.9s-2.7-.04-2.7 2.6v4.4s-.3 2.7 4.9 2.7zm2.7-1.5c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"/>
</svg>`;

const ML_SVG = `<svg viewBox="0 0 24 24" fill="none" class="skill-svg" width="28" height="28" aria-hidden="true">
    <rect x="5" y="5" width="14" height="14" rx="3" fill="rgba(168,85,247,0.22)" stroke="#a855f7" stroke-width="1.8"/>
    <circle cx="9" cy="9" r="1.6" fill="#c084fc"/>
    <circle cx="15" cy="9" r="1.6" fill="#c084fc"/>
    <circle cx="12" cy="14" r="1.8" fill="#e879f9"/>
    <path d="M9 9l3 5 3-5" stroke="#a855f7" stroke-width="1.6"/>
    <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" stroke="#c084fc" stroke-width="1.6" stroke-linecap="round"/>
</svg>`;

const SKLEARN_SVG = `<svg viewBox="0 0 24 24" class="skill-svg" width="30" height="30" aria-hidden="true">
    <ellipse cx="7" cy="12" rx="4" ry="7" fill="#f97316" opacity="0.9"/>
    <ellipse cx="17" cy="12" rx="4" ry="7" fill="#38bdf8" opacity="0.9"/>
    <path d="M7 6c3 3 7 3 10 0M7 18c3-3 7-3 10 0" stroke="#ffffff" stroke-width="1.6" fill="none"/>
</svg>`;

const XGBOOST_SVG = `<svg viewBox="0 0 24 24" fill="none" class="skill-svg" width="28" height="28" aria-hidden="true">
    <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" fill="rgba(34,197,94,0.22)" stroke="#22c55e" stroke-width="1.8"/>
    <path d="M8 8l8 8M16 8l-8 8" stroke="#4ade80" stroke-width="2.4" stroke-linecap="round"/>
</svg>`;

const RANDOM_FOREST_SVG = `<svg viewBox="0 0 24 24" fill="none" class="skill-svg" width="28" height="28" aria-hidden="true">
    <circle cx="12" cy="4" r="2.5" fill="#10b981"/>
    <circle cx="6" cy="12" r="2" fill="#34d399"/>
    <circle cx="18" cy="12" r="2" fill="#34d399"/>
    <circle cx="4" cy="19" r="1.8" fill="#6ee7b7"/>
    <circle cx="8" cy="19" r="1.8" fill="#6ee7b7"/>
    <circle cx="16" cy="19" r="1.8" fill="#6ee7b7"/>
    <circle cx="20" cy="19" r="1.8" fill="#6ee7b7"/>
    <path d="M12 6.5L6 10M12 6.5L18 10M6 14L4 17.2M6 14L8 17.2M18 14L16 17.2M18 14L20 17.2" stroke="#10b981" stroke-width="1.6"/>
</svg>`;

const PANDAS_SVG = `<svg viewBox="0 0 24 24" fill="none" class="skill-svg" width="28" height="28" aria-hidden="true">
    <rect x="4" y="4" width="7" height="7" rx="1.5" fill="#e11d48"/>
    <rect x="13" y="4" width="7" height="7" rx="1.5" fill="#fb7185"/>
    <rect x="4" y="13" width="7" height="7" rx="1.5" fill="#f43f5e"/>
    <rect x="13" y="13" width="7" height="7" rx="1.5" fill="#e11d48"/>
</svg>`;

const NUMPY_SVG = `<svg viewBox="0 0 24 24" fill="none" class="skill-svg" width="28" height="28" aria-hidden="true">
    <polygon points="12,2 22,8 22,18 12,22 2,18 2,8" stroke="#4f46e5" stroke-width="1.8" fill="rgba(79,70,229,0.18)"/>
    <line x1="12" y1="2" x2="12" y2="22" stroke="#818cf8" stroke-width="1.5"/>
    <line x1="2" y1="8" x2="22" y2="18" stroke="#818cf8" stroke-width="1.5"/>
</svg>`;

const SQL_SVG = `<svg viewBox="0 0 24 24" fill="none" class="skill-svg" width="26" height="26" aria-hidden="true">
    <ellipse cx="12" cy="5" rx="8" ry="3" fill="rgba(56,189,248,0.25)" stroke="#38bdf8" stroke-width="1.8"/>
    <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" stroke="#38bdf8" stroke-width="1.8"/>
    <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" stroke="#0ea5e9" stroke-width="1.8"/>
</svg>`;

const DATA_PREP_SVG = `<svg viewBox="0 0 24 24" fill="none" class="skill-svg" width="28" height="28" aria-hidden="true">
    <path d="M3 6h18M6 12h12M9 18h6" stroke="#06b6d4" stroke-width="2.2" stroke-linecap="round"/>
    <circle cx="7" cy="6" r="2" fill="#22d3ee"/>
    <circle cx="15" cy="12" r="2" fill="#22d3ee"/>
    <circle cx="11" cy="18" r="2" fill="#22d3ee"/>
</svg>`;

const FEATURE_ENG_SVG = `<svg viewBox="0 0 24 24" fill="none" class="skill-svg" width="28" height="28" aria-hidden="true">
    <path d="M4 6h16M4 12h16M4 18h16" stroke="rgba(236,72,153,0.45)" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="9" cy="6" r="2.5" fill="#ec4899" stroke="#f472b6" stroke-width="1.5"/>
    <circle cx="16" cy="12" r="2.5" fill="#ec4899" stroke="#f472b6" stroke-width="1.5"/>
    <circle cx="7" cy="18" r="2.5" fill="#ec4899" stroke="#f472b6" stroke-width="1.5"/>
</svg>`;

const SMOTE_SVG = `<svg viewBox="0 0 24 24" fill="none" class="skill-svg" width="28" height="28" aria-hidden="true">
    <path d="M12 3v18M4 7l8-4 8 4M4 7l3 7h-6l3-7zM20 7l3 7h-6l3-7z" stroke="#14b8a6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="12" cy="19" r="2" fill="#2dd4bf"/>
</svg>`;

const EVAL_SVG = `<svg viewBox="0 0 24 24" fill="none" class="skill-svg" width="28" height="28" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="#fb7185" stroke-width="1.8" fill="rgba(251,113,133,0.18)"/>
    <circle cx="12" cy="12" r="5" stroke="#f43f5e" stroke-width="1.8"/>
    <circle cx="12" cy="12" r="2" fill="#ffffff"/>
</svg>`;

const CV_SVG = `<svg viewBox="0 0 24 24" fill="none" class="skill-svg" width="28" height="28" aria-hidden="true">
    <rect x="3" y="5" width="4" height="14" rx="1.5" fill="#6366f1"/>
    <rect x="8.5" y="5" width="4" height="14" rx="1.5" fill="#818cf8"/>
    <rect x="14" y="5" width="4" height="14" rx="1.5" fill="#818cf8"/>
    <rect x="19.5" y="5" width="2" height="14" rx="1" fill="rgba(99,102,241,0.3)"/>
</svg>`;

const SEABORN_SVG = `<svg viewBox="0 0 24 24" fill="none" class="skill-svg" width="28" height="28" aria-hidden="true">
    <path d="M3 18c3-1 4-10 8-10s5 11 10 9" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round"/>
    <circle cx="11" cy="8" r="2.5" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>
    <circle cx="16" cy="14" r="2" fill="#0ea5e9"/>
</svg>`;

const EDA_SVG = `<svg viewBox="0 0 24 24" fill="none" class="skill-svg" width="28" height="28" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="3" stroke="#f59e0b" stroke-width="1.8" fill="rgba(245,158,11,0.15)"/>
    <path d="M7 16v-4M12 16v-7M17 16v-2" stroke="#fbbf24" stroke-width="2.2" stroke-linecap="round"/>
</svg>`;

const ALGO_SVG = `<svg viewBox="0 0 24 24" fill="none" class="skill-svg" width="28" height="28" aria-hidden="true">
    <rect x="9" y="3" width="6" height="4" rx="1.5" fill="#3b82f6" stroke="#60a5fa" stroke-width="1.2"/>
    <rect x="3" y="15" width="6" height="4" rx="1.5" fill="#3b82f6" stroke="#60a5fa" stroke-width="1.2"/>
    <rect x="15" y="15" width="6" height="4" rx="1.5" fill="#3b82f6" stroke="#60a5fa" stroke-width="1.2"/>
    <path d="M12 7v4M6 13h12M6 13v2M18 13v2" stroke="#60a5fa" stroke-width="1.8"/>
</svg>`;

const GIT_SVG = `<svg viewBox="0 0 24 24" class="skill-svg" width="28" height="28" aria-hidden="true">
    <path fill="#f05032" d="M21.6 10.9L13.1 2.4c-.6-.6-1.5-.6-2.1 0L8.7 4.7l2.7 2.7c.6-.2 1.4 0 1.9.5.5.5.7 1.3.5 1.9l2.6 2.6c.6-.2 1.4 0 1.9.5.8.8.8 2.1 0 2.9s-2.1.8-2.9 0c-.6-.6-.7-1.4-.4-2.1L12.5 11v5.1c.2.1.4.3.5.5.8.8.8 2.1 0 2.9s-2.1.8-2.9 0c-.8-.8-.8-2.1 0-2.9.2-.2.4-.4.6-.5V10.8c-.2-.1-.4-.3-.6-.5-.6-.6-.7-1.4-.4-2.1L7.1 5.6 2.4 10.3c-.6.6-.6 1.5 0 2.1l8.5 8.5c.6.6 1.5.6 2.1 0l8.5-8.5c.6-.6.6-1.5.1-2.1z"/>
</svg>`;

const SVG_MAP = {
    "python": PYTHON_SVG,
    "svg-python": PYTHON_SVG,
    "machine learning": ML_SVG,
    "svg-ml": ML_SVG,
    "scikit-learn": SKLEARN_SVG,
    "scikit": SKLEARN_SVG,
    "svg-sklearn": SKLEARN_SVG,
    "xgboost": XGBOOST_SVG,
    "svg-xgboost": XGBOOST_SVG,
    "random forest": RANDOM_FOREST_SVG,
    "svg-random-forest": RANDOM_FOREST_SVG,
    "pandas": PANDAS_SVG,
    "svg-pandas": PANDAS_SVG,
    "numpy": NUMPY_SVG,
    "svg-numpy": NUMPY_SVG,
    "sql": SQL_SVG,
    "svg-sql": SQL_SVG,
    "data preprocessing": DATA_PREP_SVG,
    "svg-data-prep": DATA_PREP_SVG,
    "feature engineering": FEATURE_ENG_SVG,
    "svg-feature-eng": FEATURE_ENG_SVG,
    "smote": SMOTE_SVG,
    "smote & resampling": SMOTE_SVG,
    "imbalanced data (smote)": SMOTE_SVG,
    "svg-smote": SMOTE_SVG,
    "model evaluation": EVAL_SVG,
    "roc-auc & f1-score": EVAL_SVG,
    "svg-eval": EVAL_SVG,
    "cross-validation": CV_SVG,
    "svg-cv": CV_SVG,
    "seaborn": SEABORN_SVG,
    "svg-seaborn": SEABORN_SVG,
    "eda": EDA_SVG,
    "exploratory eda": EDA_SVG,
    "exploratory dashboards": EDA_SVG,
    "svg-eda": EDA_SVG,
    "algorithms": ALGO_SVG,
    "oop & algorithms": ALGO_SVG,
    "svg-algo": ALGO_SVG,
    "git": GIT_SVG,
    "svg-git": GIT_SVG
};

// ==========================================================================
// Comprehensive Skill Metadata
// ==========================================================================

export const SKILL_METADATA = {
    "python": {
        level: "EXPERT",
        progress: 96,
        description: "Core language for ML development, algorithms, data processing pipelines, and model evaluation.",
        color: "#38bdf8",
        haloColor: "rgba(56, 189, 248, 0.45)",
        barColor: "#38bdf8",
        label: "PYTHON"
    },
    "machine learning": {
        level: "EXPERT",
        progress: 95,
        description: "End-to-end predictive modeling, supervised and unsupervised learning, and classification pipelines.",
        color: "#a855f7",
        haloColor: "rgba(168, 85, 247, 0.45)",
        barColor: "#c084fc",
        label: "ML"
    },
    "scikit-learn": {
        level: "EXPERT",
        progress: 94,
        description: "Robust model architectures, transformers, hyperparameter tuning via GridSearchCV, and pipelines.",
        color: "#f97316",
        haloColor: "rgba(249, 115, 22, 0.45)",
        barColor: "#fb923c",
        label: "SKLEARN"
    },
    "xgboost": {
        level: "EXPERT",
        progress: 94,
        description: "High-performance gradient boosting on tabular data with custom objective and regularization tuning.",
        color: "#22c55e",
        haloColor: "rgba(34, 197, 94, 0.45)",
        barColor: "#4ade80",
        label: "XGBOOST"
    },
    "random forest": {
        level: "ADVANCED",
        progress: 92,
        description: "Ensemble learning with bagging, decision tree ensembles, and feature importance diagnostics.",
        color: "#10b981",
        haloColor: "rgba(16, 185, 129, 0.45)",
        barColor: "#34d399",
        label: "FOREST"
    },
    "pandas": {
        level: "EXPERT",
        progress: 95,
        description: "High-speed tabular manipulation, aggregations, data reshaping, and missing-value handling.",
        color: "#e11d48",
        haloColor: "rgba(225, 29, 72, 0.45)",
        barColor: "#f43f5e",
        label: "PANDAS"
    },
    "numpy": {
        level: "EXPERT",
        progress: 93,
        description: "Vectorized numerical computing, matrix linear algebra, and high-performance array transformations.",
        color: "#4f46e5",
        haloColor: "rgba(79, 70, 229, 0.45)",
        barColor: "#818cf8",
        label: "NUMPY"
    },
    "sql": {
        level: "ADVANCED",
        progress: 91,
        description: "Writing relational queries, aggregations, window functions, and structured database extraction.",
        color: "#0ea5e9",
        haloColor: "rgba(14, 165, 233, 0.45)",
        barColor: "#38bdf8",
        label: "SQL"
    },
    "data preprocessing": {
        level: "EXPERT",
        progress: 96,
        description: "Automated data cleaning, outlier treatment, feature scaling, and categorical encoding.",
        color: "#06b6d4",
        haloColor: "rgba(6, 182, 212, 0.45)",
        barColor: "#22d3ee",
        label: "DATA PREP"
    },
    "feature engineering": {
        level: "EXPERT",
        progress: 94,
        description: "Creating high-impact domain features, interaction terms, and dimensionality reduction strategies.",
        color: "#ec4899",
        haloColor: "rgba(236, 72, 153, 0.45)",
        barColor: "#f472b6",
        label: "FEATURE ENG"
    },
    "smote": {
        level: "SPECIALIZED",
        progress: 90,
        description: "Tackling severe class imbalance using synthetic minority over-sampling and hybrid techniques.",
        color: "#14b8a6",
        haloColor: "rgba(20, 184, 166, 0.45)",
        barColor: "#2dd4bf",
        label: "SMOTE"
    },
    "model evaluation": {
        level: "EXPERT",
        progress: 95,
        description: "Comprehensive metrics analysis with ROC-AUC curves, Precision-Recall, and confusion matrices.",
        color: "#fb7185",
        haloColor: "rgba(251, 113, 133, 0.45)",
        barColor: "#f43f5e",
        label: "EVALUATION"
    },
    "cross-validation": {
        level: "EXPERT",
        progress: 93,
        description: "Preventing data leakage and overfitting using Stratified K-Fold and validation schemes.",
        color: "#818cf8",
        haloColor: "rgba(129, 140, 248, 0.45)",
        barColor: "#a5b4fc",
        label: "CV"
    },
    "matplotlib": {
        level: "ADVANCED",
        progress: 91,
        description: "Crafting publication-quality statistical charts, diagnostic plots, and distribution graphs.",
        color: "#38bdf8",
        haloColor: "rgba(56, 189, 248, 0.45)",
        barColor: "#38bdf8",
        label: "MATPLOTLIB"
    },
    "seaborn": {
        level: "ADVANCED",
        progress: 91,
        description: "Multi-variate statistical visualization, correlation matrices, pairplots, and distribution curves.",
        color: "#0284c7",
        haloColor: "rgba(2, 132, 199, 0.45)",
        barColor: "#38bdf8",
        label: "SEABORN"
    },
    "eda": {
        level: "EXPERT",
        progress: 95,
        description: "Uncovering statistical patterns, anomalies, business insights, and hypothesis validations.",
        color: "#f59e0b",
        haloColor: "rgba(245, 158, 11, 0.45)",
        barColor: "#fbbf24",
        label: "EDA"
    },
    "algorithms": {
        level: "ADVANCED",
        progress: 90,
        description: "Clean object-oriented architecture, modular code design, and efficient data structures.",
        color: "#3b82f6",
        haloColor: "rgba(59, 130, 246, 0.45)",
        barColor: "#60a5fa",
        label: "ALGORITHMS"
    },
    "git": {
        level: "ADVANCED",
        progress: 88,
        description: "Collaborative Git workflows, reproducible experiments, and clean repository management.",
        color: "#f05032",
        haloColor: "rgba(240, 80, 50, 0.45)",
        barColor: "#fb7185",
        label: "GIT"
    }
};

/**
 * Enriches raw skill items with metadata
 */
export const enrichSkill = (item) => {
    const rawName = typeof item === "object" ? item.name : String(item || "");
    const key = (rawName || "").trim().toLowerCase();
    const meta = SKILL_METADATA[key] || {};

    return {
        name: rawName,
        icon: (typeof item === "object" && item.icon) || key,
        level: (typeof item === "object" && item.level) || meta.level || "EXPERT",
        progress: (typeof item === "object" && item.progress) || meta.progress || 92,
        description: (typeof item === "object" && item.description) || meta.description || `Specialized competence and practical implementation in ${rawName}.`,
        color: (typeof item === "object" && item.color) || meta.color || "#38bdf8",
        haloColor: (typeof item === "object" && item.haloColor) || meta.haloColor || "rgba(56, 189, 248, 0.45)",
        barColor: (typeof item === "object" && item.barColor) || meta.barColor || "#fb7185",
        label: (typeof item === "object" && item.label) || meta.label || (rawName.length > 8 ? rawName.slice(0, 6).toUpperCase() : rawName.toUpperCase())
    };
};

/**
 * Creates an icon element (devicon or SVG)
 */
export const getSkillIconElement = (item) => {
    const itemName = typeof item === "object" ? item.name : String(item || "");
    const itemIcon = typeof item === "object" ? item.icon : "";
    const key = (itemName || "").trim().toLowerCase();
    const iconKey = (itemIcon || "").trim().toLowerCase();

    // 1. Direct SVG registered
    const svgMarkup = SVG_MAP[iconKey] || SVG_MAP[key];
    if (svgMarkup) {
        const span = document.createElement("span");
        span.className = "skill-icon skill-icon-svg";
        span.setAttribute("aria-hidden", "true");
        span.innerHTML = svgMarkup;
        return span;
    }

    // 2. Devicon class
    if (itemIcon && itemIcon.startsWith("devicon-")) {
        const i = document.createElement("i");
        i.className = `skill-icon ${itemIcon}`;
        i.setAttribute("aria-hidden", "true");
        return i;
    }

    // 3. Known devicons by name
    const deviconMap = {
        python: "devicon-python-plain colored",
        pandas: "devicon-pandas-plain colored",
        numpy: "devicon-numpy-plain colored",
        scikit: "devicon-scikitlearn-plain colored",
        matplotlib: "devicon-matplotlib-plain colored",
        git: "devicon-git-plain colored"
    };

    for (const [sub, cls] of Object.entries(deviconMap)) {
        if (key.includes(sub)) {
            const i = document.createElement("i");
            i.className = `skill-icon ${cls}`;
            i.setAttribute("aria-hidden", "true");
            return i;
        }
    }

    // Fallback
    const span = document.createElement("span");
    span.className = "skill-icon skill-icon-svg";
    span.setAttribute("aria-hidden", "true");
    span.innerHTML = ML_SVG;
    return span;
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
    const stageWidth = stageEl ? stageEl.clientWidth : 960;
    const isMobile = stageWidth < 640;
    const canvasEl = document.querySelector(".skills-arch-canvas");
    const canvasWidth = canvasEl ? canvasEl.clientWidth : Math.min(stageWidth, 1000);
    const scale = Math.min(canvasWidth, 1000) / 1000;
    const r = 460 * scale;
    const cy = 519.0877 * scale;
    const stepAngle = isMobile ? 0.401 : 0.358;
    const maxOffset = isMobile ? 2.5 : 3.5;

    return { isMobile, scale, r, cy, stepAngle, maxOffset };
};

/**
 * Updates all orbital badges along the curved ribbon at the specified fractional virtual index
 */
const updateArcBadges = (vIndex) => {
    if (!trackEl || !skillList.length) return;
    const count = skillList.length;
    const { r, cy, stepAngle, maxOffset } = getArcGeometry();

    for (let i = 0; i < count; i++) {
        const itemEl = trackEl.querySelector(`[data-index="${i}"]`);
        if (!itemEl) continue;

        let diff = (i - vIndex) % count;
        if (diff > count / 2) diff -= count;
        if (diff < -count / 2) diff += count;

        const absDiff = Math.abs(diff);

        if (absDiff > maxOffset + 0.5) {
            itemEl.style.transform = `translate(calc(-50% + ${diff < 0 ? -r * 1.15 : r * 1.15}px), calc(-50% + ${cy}px)) scale(0.4)`;
            itemEl.style.opacity = "0";
            itemEl.style.pointerEvents = "none";
            itemEl.setAttribute("aria-hidden", "true");
            continue;
        }

        const theta = diff * stepAngle;
        const x = r * Math.sin(theta);
        const y = cy - r * Math.cos(theta);

        // Smooth opacity handoff near apex spotlight
        let opacity = 0;
        if (absDiff >= 0.45) {
            if (absDiff <= 1.0) {
                opacity = 0.35 + (absDiff - 0.45) * (0.6 / 0.55);
            } else {
                opacity = Math.max(0.3, 0.95 - (absDiff - 1.0) * 0.22);
            }
        } else {
            opacity = Math.max(0, (absDiff / 0.45) * 0.35);
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
                renderSkillsArcCarousel(index, true);
            });

            trackEl.appendChild(btn);
        });
    }

    // Controls: Prev & Next with tactile click response
    if (prevBtn && !prevBtn._hasBoundClick) {
        prevBtn._hasBoundClick = true;
        prevBtn.addEventListener("click", () => {
            if (window.gsap) {
                window.gsap.fromTo(prevBtn, { scale: 0.88 }, { scale: 1, duration: 0.3, ease: "back.out(2)" });
            }
            renderSkillsArcCarousel(activeIndex - 1, true);
        });
    }

    if (nextBtn && !nextBtn._hasBoundClick) {
        nextBtn._hasBoundClick = true;
        nextBtn.addEventListener("click", () => {
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
            // Ignore interaction when clicking controls or spotlight buttons
            if (e.target.closest(".skills-controls") || e.target.closest(".skills-spotlight")) return;
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
