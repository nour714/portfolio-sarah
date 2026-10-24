# Sarah Nabil — Machine Learning & AI Specialist Portfolio

[![Architecture](https://img.shields.io/badge/Architecture-Clean%20%26%20Modular-cyan.svg)](#-architecture-overview)
[![CSS](https://img.shields.io/badge/CSS-14%20Layer%20Modules-purple.svg)](#-css-modular-architecture)
[![JS](https://img.shields.io/badge/JS-ES6%2B%20Modules-yellow.svg)](#-javascript-modular-architecture)
[![Motion](https://img.shields.io/badge/Motion-GSAP%20%2B%20Lenis-green.svg)](#-cinematic-motion-system)
[![Testing](https://img.shields.io/badge/Tests-100%25%20Passing-brightgreen.svg)](#-automated-testing--verification)

> **Modern, high-performance personal portfolio for Sarah Nabil (سارة نبيل)** — Machine Learning & Artificial Intelligence Specialist with hands-on expertise in data exploration, preprocessing, classification modeling, predictive analytics, and end-to-end ML pipelines.

---

## 🌟 Highlights & Key Features

- **🍏 Interactive 3D Apple-Style Scroll Intro:** Pre-rendered dual-fidelity canvas sequence (192 WebP frames for desktop and mobile) with butter-smooth scroll synchronization, ambient telemetry HUD, dynamic vignette corrections, and seamless camera zoom transition into the main portfolio.
- **⚡ Clean Architecture & Modular Codebase:** Zero monolithic files. JavaScript and CSS are strictly split into domain-driven modules following Clean Architecture principles (Core, Data, Services, Modules, Vendor, Admin).
- **📜 Cinematic Motion System (Lenis + GSAP + ScrollTrigger):** Hardware-accelerated smooth scrolling via Lenis, synchronized with GSAP ScrollTrigger for choreographed section reveals, staggered text reveals, magnetic controls, and 3D card tilt.
- **🎯 3D Skills Arc Carousel:** Interactive 3D cylindrical depth carousel with touch, drag, and autoplay controls, category filtering, and live telemetry indicators.
- **🏆 Stacked Certificates Showcase:** Interactive sticky card stack, category filter tabs, and modal deep-dive preview with verified credential IDs and direct validation links.
- **📊 Single Source of Truth:** All projects, skills, certificates, metrics, and timeline items are managed centrally in [`js/data/`](js/data/) (`portfolio-data.js`, `projects.js`, `certificates.js`).
- **🎛️ Integrated Content Studio (`admin.html`):** Visual CMS dashboard to edit bio, projects, and skills with real-time responsive preview, JSON import/export, and optional Firebase real-time sync.
- **💳 3D Holographic Contact Card:** Interactive 3D business card responding to live mouse/gyroscope coordinates, paired with an accessible, validated message form.
- **📄 Dedicated Curriculum Vitae Page (`cv.html`):** Custom-styled CV previewer with dark/light mode toggle and one-click PDF download.
- **🖱️ macOS-Style Custom Interactive Cursors:** Context-aware SVG cursors (arrow, pointer, text) with dynamic sheen and drop-shadow effects.
- **📱 Mobile-First & Accessible:** WCAG 2.1 AA compliant, responsive layout down to 360px screens, keyboard navigable dialogs, and reduced-motion fallbacks.
- **🔍 SEO & Social Ready:** Rich Open Graph (OG) and Twitter Card metadata for LinkedIn, WhatsApp, and Twitter link previews.

---

## 🏗️ Architecture Overview

```
New Portfilo/
├── index.html                     # Main public portfolio (dynamic hydration & cinematic hero)
├── admin.html                     # Content Studio & CMS Dashboard
├── cv.html                        # Dedicated CV previewer with PDF download
├── cv.pdf                         # Resume document
├── style.css                      # Master CSS index importing all modular layers
├── firestore.rules                # Cloud Firestore Security Rules
├── gemini_generated_video_8cc9ee73.mp4 # Cinematic video backdrop for hero
│
├── js/
│   ├── main.js                    # Public site bootstrap & module orchestrator
│   ├── admin.js                   # Admin dashboard bootstrap & preview controller
│   │
│   ├── core/                      # Core foundations
│   │   ├── constants.js           # App configuration, selectors, initial state
│   │   ├── utils.js               # DOM helpers, card spotlight, share utilities
│   │   └── state.js               # Central state manager & DOM hydration engines
│   │
│   ├── data/                      # Content Data Store (Single Source of Truth)
│   │   ├── portfolio-data.js      # Central portfolio data (hero, about, experience, contact)
│   │   ├── projects.js            # Machine learning & data analysis project records
│   │   └── certificates.js        # Professional certifications & credential metadata
│   │
│   ├── services/                  # External & side-effect services
│   │   ├── storage.service.js     # LocalStorage abstraction with safe fallback
│   │   ├── toast.service.js       # Accessible toast notification system
│   │   ├── firebase-api.js        # Firebase SDK + Firestore REST API integration
│   │   └── firebase.service.js    # Firebase state synchronization bridge
│   │
│   ├── modules/                   # UI Feature Modules
│   │   ├── theme.js               # Dark / Light theme toggle & persistence
│   │   ├── navigation.js          # Navbar scroll-spy, mobile drawer, smooth scroll
│   │   ├── hero.js                # Dynamic role typewriter & avatar fallback
│   │   ├── hero-intro.js          # Cinematic video stage & intro controls
│   │   ├── skills.js              # 3D Arc Carousel & categorized skills board
│   │   ├── projects.js            # Filter tabs, project modals, spotlight & share
│   │   ├── certificates.js        # Sticky certificates stack, filters & detail modal
│   │   ├── animations.js          # Cinematic motion, Lenis, GSAP, 3D tilt, custom cursor
│   │   └── contact.js             # Interactive contact form & fallback handling
│   │
│   ├── vendor/                    # Local production vendor libraries
│   │   ├── gsap.min.js            # GreenSock Animation Platform
│   │   ├── ScrollTrigger.min.js   # GSAP ScrollTrigger plugin
│   │   └── lenis.min.js           # Lenis smooth scroll engine
│   │
│   └── admin/                     # Admin specific logic
│       ├── admin-preview.js       # Live preview iframe synchronization
│       └── admin-dashboard.js     # CRUD forms, schema validator, file uploaders
│
├── css/
│   ├── base/
│   │   ├── variables.css          # Design tokens, color palette, typography
│   │   └── reset.css              # Modern CSS reset & base accessibility rules
│   │
│   ├── components/
│   │   ├── header.css             # Navbar, logo badge, theme toggle
│   │   ├── hero.css               # Hero section, neural badge, CTAs, avatar
│   │   ├── hero-video.css         # Cinematic video stage, HUD controls, scrim
│   │   ├── about.css              # Bio narrative, metric chips, timeline nodes
│   │   ├── skills.css             # 3D Arc Carousel, skill cards & badges
│   │   ├── projects.css           # Project cards, sticky stack, pipeline diagrams
│   │   ├── certificates.css       # Sticky certificate cards, filters & details
│   │   ├── experience.css         # Timeline tracks & organization cards
│   │   ├── contact.css            # 3D holographic card & validated message form
│   │   ├── modal.css              # Project & certificate detail dialogs
│   │   └── toast.css              # Toast notification alerts
│   │
│   ├── features/
│   │   └── animations.css         # Keyframes, glow effects, scroll reveals
│   │
│   ├── vendor/
│   │   └── lenis.min.css          # Lenis smooth scroll layout styles
│   │
│   └── admin/
│       └── admin.css              # Content Studio panel, split view, forms
│
├── images/                        # Optimized web assets (WebP & PNG)
│   ├── certificates/              # Certificate preview images
│   ├── cursors/                   # Custom macOS SVG cursor graphics
│   └── ...                        # Project screenshots, logos, and icons
│
└── tests/
    └── test_architecture.mjs      # Automated module integrity & architecture test suite
```

---

## 🚀 Getting Started

### 1. Run Locally
Because this project uses modern ES Modules (`type="module"`), it should be served via an HTTP server (to prevent browser CORS restrictions on `file://` module imports):

```bash
# Option A: Using VS Code Live Server extension:
# Right-click index.html -> "Open with Live Server"

# Option B: Using Python:
python -m http.server 8080

# Option C: Using Node.js / npx:
npx serve .
```

Open `http://localhost:8080` in your modern browser.

---

## ✏️ Updating Content

There are **two ways** to update the portfolio:

### Method A: Direct Code Update (Recommended)
Edit the structured data files inside [`js/data/`](js/data/):
- **[`js/data/portfolio-data.js`](js/data/portfolio-data.js)**:
  - `hero`: Name, roles, intro copy, CTA buttons.
  - `about`: Professional summary, location, status, metrics.
  - `experience`: Training, roles, organizations, periods, accomplishments, skill tags.
  - `contact`: Email, WhatsApp, social links, location.
- **[`js/data/projects.js`](js/data/projects.js)**: Title, category (`ai`, `ml`, `analysis`), live link, GitHub repository, problem statement, key results, architecture pipeline diagrams, and metrics.
- **[`js/data/certificates.js`](js/data/certificates.js)**: Certificate name, issuer, issue date, credential ID, verification URL, skills acquired, and preview image.

### Method B: Content Studio (`admin.html`)
1. Open `admin.html` in your browser.
2. Edit any field in real-time in the left panel.
3. Observe instant live updates inside the preview window.
4. Click **"Save Changes"** (saves to `localStorage`) or **"Export JSON"** to backup your changes.

---

## 🧪 Automated Testing & Verification

A dedicated verification test suite checks that all JavaScript modules, CSS layers, DOM mount points, and exports are present and structurally sound.

Run the test suite using Node.js:

```bash
node tests/test_architecture.mjs
```

### Verification Output:
```
✅ Constants loaded: [ 'ADMIN_THEME_KEY', 'HERO_ROLES', 'MOBILE_NAV_BREAKPOINT', 'SVG_NS', 'THEME_STORAGE_KEY' ]
✅ Portfolio Data loaded: [ 'hero', 'social', 'about', 'skills', 'projectsSection', 'projects', 'certificatesSection', 'certificates', 'experience', 'contact' ]
✅ Utils loaded: [ 'createShareIcon', 'createSvgElement', 'emitThemeChange', ... ]
✅ State loaded: [ 'applyAboutState', 'applyAdminState', ... ]
✅ Storage loaded: [ 'storageService' ]
✅ Toast loaded: [ 'showToast' ]
✅ Firebase loaded: [ 'firebaseService', 'initPublicPortfolio' ]
✅ Theme loaded: [ 'applyTheme', 'initThemeToggle' ]
✅ Navigation loaded: [ 'initMenu' ]
✅ Hero loaded: [ 'createHeroTypingController', 'initHeroAvatarFallback', ... ]
✅ Skills loaded: [ 'SKILL_METADATA', 'createSkillCard', 'initSkillsArcCarousel', ... ]
✅ Projects loaded: [ 'animateModalArchitecture', 'createProjectCard', 'initStickyCardStack', ... ]
✅ Certificates loaded: [ 'openCertificateModal', 'initStickyCertificateStack', ... ]
✅ Animations loaded: [ 'initLenis', 'initScrollReveal', 'initCard3DTilt', ... ]
✅ Contact loaded: [ 'initContactFormFallback' ]
✅ Admin Preview loaded: [ 'renderPreview', 'updatePreviewScale' ]
✅ Admin Dashboard loaded: [ 'initAdminDashboard' ]

🎉 ALL ACTIVE JS MODULES RESOLVED AND IMPORTED WITHOUT ERRORS!

--- Checking Modular CSS Files ---
✅ CSS Module: css/vendor/lenis.min.css (511 bytes)
✅ CSS Module: css/base/variables.css (8453 bytes)
✅ CSS Module: css/base/reset.css (3360 bytes)
✅ CSS Module: css/components/header.css (17709 bytes)
✅ CSS Module: css/components/hero.css (12685 bytes)
✅ CSS Module: css/components/about.css (11457 bytes)
✅ CSS Module: css/components/skills.css (14548 bytes)
✅ CSS Module: css/components/projects.css (24414 bytes)
✅ CSS Module: css/components/certificates.css (19804 bytes)
✅ CSS Module: css/components/experience.css (6293 bytes)
✅ CSS Module: css/components/contact.css (13780 bytes)
✅ CSS Module: css/components/modal.css (9247 bytes)
✅ CSS Module: css/components/toast.css (1141 bytes)
✅ CSS Module: css/features/animations.css (10179 bytes)

🎉 ALL CSS MODULES EXIST AND ARE LINKED IN STYLE.CSS!
```

---

## 🔒 Security & Best Practices

- **Zero Secret Exposure:** No API keys, credentials, or sensitive tokens are stored in source code.
- **Sanitized DOM Manipulation:** Dynamic hydration uses safe sanitization utilities (`setText`, `createSvgElement`, `createElement`) to prevent Cross-Site Scripting (XSS).
- **Tab-Nabbing Protection:** All external outbound links enforce `target="_blank"` with `rel="noopener noreferrer"`.
- **CSS Logical Properties:** Built with future-proof RTL/LTR readiness using logical layout units (`padding-inline`, `margin-inline`, `inset-inline`).

---

## 👤 Author

**Sarah Nabil Abu Al-Magd Ahmad (سارة نبيل أبو المجد أحمد)**
- **Education:** Bachelor's Degree in Artificial Intelligence (General Program), Faculty of Artificial Intelligence, Kafrelsheikh University (GPA: 3.27 / 4.00 · Expected 2028)
- **Role:** Machine Learning, Computer Vision & Artificial Intelligence Specialist
- **Core Skills:** Python, C++, OpenCV, ANN, Machine Learning (Classification, Regression, Supervised & Unsupervised), SQL & MySQL, Qt Framework, NumPy, Matplotlib
- **Accredited Training:** NTI Machine Learning Training (120 hrs | Score: 95%), Sprints × Microsoft AI Camp, CIB Programming Internship, LinkedIn Learning AI
- **Email:** [sarahhnabil71@gmail.com](mailto:sarahhnabil71@gmail.com)
- **WhatsApp:** [+20 1099478701](https://wa.me/201099478701)
- **LinkedIn:** [linkedin.com/in/sarahnabil](https://www.linkedin.com/in/sarahnabil)
- **GitHub:** [github.com/sarahnabil](https://github.com/sarahnabil)
