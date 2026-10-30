# Sarah Nabil — Machine Learning & AI Specialist Portfolio

[![Architecture](https://img.shields.io/badge/Architecture-Clean%20%26%20Modular-cyan.svg)](#-architecture-overview)
[![CSS](https://img.shields.io/badge/CSS-Modular%20Layers-purple.svg)](#-performance-caching--css-build)
[![JS](https://img.shields.io/badge/JS-ES6%2B%20Modules-yellow.svg)](#-architecture-overview)
[![Motion](https://img.shields.io/badge/Motion-GSAP%20%2B%20Lenis-green.svg)](#-highlights--key-features)

> **Modern, high-performance personal portfolio for Sarah Nabil (سارة نبيل)** — Machine Learning & Artificial Intelligence Specialist with hands-on expertise in data exploration, preprocessing, classification modeling, predictive analytics, and end-to-end ML pipelines.

---

## 🌟 Highlights & Key Features

- **🎬 Cinematic Video Hero Intro:** High-impact video-based intro for desktop with HUD telemetry controls, instant skip on scroll or keypress, and reduced-motion / battery-saving detection. Mobile devices and low-bandwidth connections automatically skip video downloads in favor of an optimized static visual backdrop.
- **⚡ Clean Architecture & Modular Codebase:** Zero monolithic files. JavaScript and CSS are strictly split into domain-driven modules following Clean Architecture principles (Core, Data, Services, Modules, Vendor, Admin).
- **📜 Cinematic Motion System (Lenis + GSAP + ScrollTrigger):** Hardware-accelerated smooth scrolling via Lenis, synchronized with GSAP ScrollTrigger for choreographed section reveals, staggered text reveals, magnetic controls, and 3D card tilt.
- **🎯 3D Skills Arc Carousel:** Interactive 3D cylindrical depth carousel with touch, drag, and autoplay controls, category filtering, and live telemetry indicators.
- **🏆 Stacked Certificates Showcase:** Interactive sticky card stack, category filter tabs, and modal deep-dive preview with verified credential IDs and direct validation links.
- **📊 Centralized Portfolio Content:** Projects, skills, certificates, and timeline data are structured in [`js/data/`](js/data/) (`portfolio-data.js`, `projects.js`, `certificates.js`). For optimal search engine indexing (SEO), the hero and contact text are pre-rendered directly in `index.html` as well as defined in `portfolio-data.js`, and should be kept in sync.
- **🎛️ Integrated Content Studio (`admin.html`):** Visual CMS dashboard to edit bio, projects, and skills with real-time responsive preview, JSON import/export, and optional Firebase real-time sync.
- **💳 3D Holographic Contact Card:** Interactive 3D business card responding to live mouse coordinates, paired with an accessible, validated message form (supporting Formspree / Web3Forms with automatic mailto fallback).
- **📄 Dedicated Curriculum Vitae Page (`cv.html`):** Custom-styled CV previewer with dark/light mode toggle, one-click PDF download, and responsive mobile-optimized access.
- **📱 Mobile-First & Accessible:** Built with accessibility in mind, responsive layout down to 360px screens, visible `:focus-visible` focus rings, semantic heading hierarchy, keyboard-navigable dialogs, and reduced-motion fallbacks.
- **🔍 SEO & Social Ready:** Rich Open Graph (OG), Twitter Card metadata, JSON-LD Person schema, canonical URLs, `robots.txt`, and XML sitemap for search engines and social platforms (LinkedIn, WhatsApp).

---

## 🏗️ Architecture Overview

```
portfolio-sarah/
├── index.html                     # Main public portfolio (dynamic hydration & pre-rendered SEO)
├── admin.html                     # Content Studio & CMS Dashboard
├── cv.html                        # Dedicated CV previewer with theme toggle & PDF download
├── cv.pdf                         # Resume document
├── style.css                      # Master CSS index importing modular development layers
├── vercel.json                    # Vercel deployment headers, security headers, clean URLs & caching
├── service-worker.js              # Legacy service worker cleanup script
├── robots.txt                     # Search engine crawler directives
├── sitemap.xml                    # XML sitemap covering root and /cv
├── LICENSE                        # MIT License
├── firestore.rules                # Cloud Firestore Security Rules
├── gemini_generated_video_8cc9ee73.mp4 # Cinematic video backdrop for desktop hero intro
│
├── scripts/
│   └── build-css.js               # Zero-dependency Node script to bundle and cache-bust css/main.css
│
├── js/
│   ├── main.js                    # Public site bootstrap & module orchestrator
│   ├── cv.js                      # CV page theme toggle & state manager
│   ├── admin.js                   # Admin dashboard bootstrap & preview controller
│   │
│   ├── core/                      # Core foundations
│   │   ├── constants.js           # App configuration, selectors, initial state
│   │   ├── utils.js               # DOM helpers, card spotlight, share utilities
│   │   └── state.js               # Central state manager & DOM hydration engines
│   │
│   ├── data/                      # Content Data Store
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
│   │   ├── animations.js          # Cinematic motion, Lenis, GSAP, 3D tilt
│   │   └── contact.js             # Interactive contact form & API submission
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
│   ├── main.css                   # Concatenated production stylesheet (generated by build-css.js)
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
│   ├── cv/
│   │   └── cv.css                 # Dedicated styles for CV previewer & mobile action
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
└── images/                        # Optimized web assets (WebP, PNG, JPG, SVG)
    ├── certificates/              # Certificate preview images & compressed PDFs
    └── ...                        # Project screenshots, logos, and icons
```

---

## ⚡ Performance, Caching & CSS Build

### 1. Rebuilding `css/main.css`
The project maintains modular CSS files in development for clean organization and concatenates them for production to eliminate `@import` chaining waterfall delays:

```bash
node scripts/build-css.js
```

What `scripts/build-css.js` does:
- Concatenates the 15 CSS layers in their exact architectural order into `css/main.css`.
- Automatically rewrites relative asset paths (e.g. `../images/...` to `images/...`).
- Computes the SHA-256 content hash of `css/main.css`.
- Updates the stylesheet tag in `index.html` to `<link rel="stylesheet" href="/css/main.css?v=<hash>">` to guarantee instant cache-busting upon deployment.

### 2. Caching Strategy (`vercel.json`)
The Vercel deployment configuration enforces distinct caching tiers:
- **Code Assets & HTML (`/js/(.*)`, `/css/(.*)`, `style.css`, HTML routes):**
  `Cache-Control: public, max-age=0, must-revalidate`
  Ensures returning visitors never get stuck on stale JavaScript or CSS files.
- **Media & Fonts (`/images/(.*)`, `.webp`, `.png`, `.jpg`, `.svg`, `.mp4`, `.pdf`, `.woff2`):**
  `Cache-Control: public, max-age=604800, stale-while-revalidate=86400`
  Cached in browser for 7 days with a 1-day stale-while-revalidate window for smooth instant rendering.
- **Security Headers:**
  Includes a strict `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and `Referrer-Policy: strict-origin-when-cross-origin`.

---

### 3. Device Tier & `perf-lite` Detection Thresholds
A synchronous script executes in the `<head>` of `index.html` and `cv.html` before stylesheets render, assigning classes to `document.documentElement` (`is-touch` and `perf-lite`) and exporting `window.__perf = { isTouch, lite }`. Query overrides (`?perf=lite` and `?perf=full`) take precedence.

| Device Tier | Criteria / Triggers for `lite` | Behavior when `lite` is Active |
| :--- | :--- | :--- |
| **Desktop-Class**<br>`(hover: hover)` and `(pointer: fine)` | • `navigator.connection.saveData === true`<br>• Network effectiveType is `slow-2g`, `2g`, or `3g`<br>• `prefers-reduced-motion: reduce`<br>• `navigator.deviceMemory <= 2` GB | Disables Lenis smooth scrolling, heavy backdrop blurs, ambient glow effects, and infinite keyframe loops while preserving desktop mouse interactions. |
| **Touch / Mobile**<br>`(hover: none)` and `(pointer: coarse)` | • `navigator.connection.saveData === true`<br>• Network effectiveType is `slow-2g`, `2g`, or `3g`<br>• `prefers-reduced-motion: reduce`<br>• `navigator.deviceMemory <= 4` GB<br>• `navigator.hardwareConcurrency <= 4` cores | Bypasses 3D tilt, pointer spotlight, Lenis, and complex scrubbed animations; uses native momentum scrolling and simplified card shadows. |
| **Manual Override** | • `?perf=lite` forces `lite = true`<br>• `?perf=full` forces `lite = false` | Allows instant deterministic testing and developer profiling across all device classes. |

---

## 🛠️ Build System & Production Bundling

The project includes an ultra-fast build workflow powered by `esbuild` that compiles, bundles, and minifies assets with immutable content hashing for Vercel deployment:

```bash
# 1. Install devDependencies
npm install

# 2. Build production assets (bundles JS, minifies CSS, generates hashes, updates HTML)
npm run build

# Or build individual targets:
npm run build:css   # Bundle and minify CSS
npm run build:js    # Bundle and minify JS modules
```

### Build Outputs
- `js/dist/main.[hash].min.js` + `.map`: Minified bundle of the 26-module dependency graph (~141 KB).
- `css/dist/main.[hash].min.css` + `.map`: Minified master stylesheet with dead space & redundant comments stripped (~155 KB).
- `js/dist/cv.[hash].min.js` & `css/dist/cv.[hash].min.css`: Optimized bundles for the CV page.
- Source maps (`.map`) are intentionally public to facilitate transparency, open inspection, and live production debugging.
- Vercel automatically serves hashed files under `/js/dist/` and `/css/dist/` with `Cache-Control: public, max-age=31536000, immutable`.

---

## 🚀 Getting Started

### Run Locally
Because this project uses modern ES Modules (`type="module"`), serve it via an HTTP server (to avoid CORS restrictions on local file imports):

```bash
# Option A: Using Python 3
python -m http.server 8080

# Option B: Using Node.js / npx
npx serve .

# Option C: Using VS Code Live Server extension
# Right-click index.html -> "Open with Live Server"
```

Open `http://localhost:8080` in your modern browser.

---

## ✏️ Updating Content

There are **two ways** to update the portfolio:

### Method A: Direct Code Update (Recommended)
Edit the structured data files inside [`js/data/`](js/data/):
- **[`js/data/portfolio-data.js`](js/data/portfolio-data.js)**:
  - `hero`: Name, roles, intro copy, CTA buttons. (*Note: hero copy is also pre-rendered in `index.html` for SEO; please update both.*)
  - `about`: Professional summary, location, status, metrics.
  - `experience`: Training, roles, organizations, periods, accomplishments, skill tags.
  - `contact`: Email, WhatsApp, social links, location. (*Note: contact headers and status notes are also in `index.html`.*)
- **[`js/data/projects.js`](js/data/projects.js)**: Title, category (`ai`, `ml`, `analysis`), live link, GitHub repository, problem statement, key results, architecture pipeline diagrams, and metrics.
- **[`js/data/certificates.js`](js/data/certificates.js)**: Certificate name, issuer, issue date, credential ID, verification URL, skills acquired, and preview image.

### Method B: Content Studio (`admin.html`)
1. Open `admin.html` in your browser.
2. Edit any field in real-time in the left panel.
3. Observe instant live updates inside the preview window.
4. Click **"Save Changes"** (saves to `localStorage`) or **"Export JSON"** to backup your changes.

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
