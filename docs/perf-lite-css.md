# Performance Lite CSS Audit & Selector Reference (Task 2)

All changes in this document are strictly scoped under `html.perf-lite` (low-memory/concurrency devices, slow 2G/3G connections, SaveData, reduced-motion, or `?perf=lite`) and `html.is-touch` (touch-screen devices with coarse pointer).

**Desktop Guarantee:** Desktops with fine pointer and capable hardware match neither selector, retaining 100% of the original glassmorphism, animations, multi-layer shadows, and cursor effects.

---

## 1. Touch-Only Overrides (`html.is-touch`)
Disables mouse-dependent hover interactions that cause stickiness, jank, or needless repaints on mobile touches:

| Selector | Original Behavior | `html.is-touch` Override | Purpose |
| :--- | :--- | :--- | :--- |
| `#cursor-glow, .cursor-glow` | Trailing cursor spotlight | `display: none !important;` | No cursor pointer exists on touch displays |
| `[data-magnetic]` | Magnetic spring pull | `transform: none !important;` | Eliminates touch-drag conflict |
| `[data-tilt]` | 3D card tilt | `transform: none !important;` | Eliminates orientation/pointer conflict |
| `[data-spotlight]` | Radial cursor glow | `transform: none !important;` | Removes mouse tracking |
| `.project-card:hover` | `translateY(-8px) scale(1.01)` | `transform: none !important;` | Prevents stuck hover state on tap |
| `.certificate-card:hover` | `translateY(-6px)` | `transform: none !important;` | Prevents stuck hover state on tap |
| `.certificate-card:hover .cert-image` | `scale(1.05)` | `transform: none !important;` | Eliminates image zoom repaint on tap |
| `.about-group-card:hover` | `translateY(-4px)` | `transform: none !important;` | Prevents stuck hover state on tap |
| `.contact-item:hover` | `translateY(-4px)` | `transform: none !important;` | Prevents stuck hover state on tap |
| `.experience-card:hover` | `translateY(-4px)` | `transform: none !important;` | Prevents stuck hover state on tap |
| `.hero-orbit-link:hover` | `scale(1.15) translateY(-4px)` | `transform: none !important;` | Clean touch response |
| `.hero-telemetry-card:hover` | `translateY(-4px)` | `transform: none !important;` | Clean touch response |
| `.skills-arc-item:hover` | `scale(1.1)` | `transform: none !important;` | Clean touch response |
| `.stat-card:hover, .skills-metric:hover` | Card lift | `transform: none !important;` | Clean touch response |
| `.btn:hover` (CV page) | `translateY(-2px)` | `transform: none !important;` | Clean touch response |

---

## 2. Backdrop-Filter Elimination (`html.perf-lite`)
`backdrop-filter: blur(...)` requires the GPU to read back the frame buffer, downsample, apply separable gaussian passes, and composite on every scroll frame. Replaced with solid/high-opacity backgrounds matching the original hue for equal or better WCAG AA contrast:

| Selector | Original `backdrop-filter` | `html.perf-lite` Background Replacement (Dark / Light) |
| :--- | :--- | :--- |
| `.site-header.is-scrolled .nav-shell, .nav-list` | `blur(20px)` | Dark: `#0b0f19` / Light: `#ffffff` |
| `.menu-toggle` | `blur(12px)` | Dark: `#141a29` / Light: `#f1f5f9` |
| `.hero-status-pill` | `blur(12px)` | Dark: `#0f172a` / Light: `#ffffff` |
| `.hero-role` | `blur(16px)` | Dark: `#0f172a` / Light: `#ffffff` |
| `.hero-orbit-link` | `blur(16px)` | Dark: `#0f172a` / Light: `#ffffff` |
| `.hero-orbit-tooltip` | `blur(16px)` | Dark: `#0f172a` / Light: `#ffffff` |
| `.hero-hud-btn, .hero-telemetry-card, .hero-replay-btn` | `blur(16px)` | Dark: `#0f172a` / Light: `#ffffff` |
| `.about-panel, .about-group-card` | `blur(16px)` | Dark: `#0d1322` / Light: `#ffffff` |
| `.about-status` | `blur(12px)` | Dark: `#111827` / Light: `#f3f4f6` |
| `.skills-spotlight-icon, .skills-spotlight-meta, .skills-arc-badge, .skills-controls, .skills-nav-btn` | `blur(16px)` | Dark: `#0f172a` / Light: `#ffffff` |
| `.projects-side-indicator, .projects-filters, .project-card, .preview-live-overlay` | `blur(16px)` | Dark: `#0e1424` / Light: `#ffffff` |
| `.certificates-side-indicator, .certificates-filters, .certificate-card, .cert-overlay, .cert-zoom-btn` | `blur(16px)` | Dark: `#0e1424` / Light: `#ffffff` |
| `#project-modal-overlay, #cert-modal-overlay` | `blur(16px)` | Dark: `rgba(4, 7, 14, 0.94)` / Light: `rgba(248, 250, 252, 0.96)` |
| `.project-modal-close, .cert-modal-close` | `blur(10px)` | Dark: `#1e293b` / Light: `#e2e8f0` |
| `#portfolio-toast, #back-to-top` | `blur(16px)` | Dark: `#0f172a` / Light: `#ffffff` |
| `.cv-shell` | `blur(16px)` | Dark: `#0e1222` / Light: `#ffffff` |

---

## 3. Large Decorative Blur Elimination (`html.perf-lite`)
Heavy decorative blur effects (> 15px radius) cause catastrophic fillrate throttling on budget mobile GPUs (e.g. Mali-G52, Adreno 506):

| Selector | Original `filter: blur(...)` | `html.perf-lite` Action |
| :--- | :--- | :--- |
| `.hero-visual-glow-primary` | `blur(90px)` | `display: none !important; filter: none !important;` |
| `.hero-visual-glow-secondary` | `blur(70px)` | `display: none !important; filter: none !important;` |
| `.hero-visual-glow` | `blur(60px)` | `display: none !important; filter: none !important;` |
| `.hero-portrait-halo-aura` | `blur(40px)` | `display: none !important; filter: none !important;` |
| `.hero-orbit-glow` | `blur(15px)` | `display: none !important; filter: none !important;` |
| `.about-visual-glow` | `blur(60px)` | `display: none !important; filter: none !important;` |
| `.skills-spotlight-halo` | `blur(80px)` | `display: none !important; filter: none !important;` |
| `.hero-portrait-layer-halo` | `blur(20px)` | `filter: none !important;` |
| `.hero-portrait-frame` | `blur(20px)` | `filter: none !important;` |
| `.reveal` | `blur(12px)` | `filter: none !important;` |

---

## 4. Multi-Layer Box Shadow Simplification (`html.perf-lite`)
Deep multi-layer shadows (e.g. `0 24px 60px rgba(...), 0 0 40px rgba(...)`) simplified to a single lightweight shadow (`0 4px 12px rgba(0, 0, 0, 0.25)` in dark mode, `0 4px 12px rgba(15, 23, 42, 0.08)` in light mode):

- `.project-card`
- `.certificate-card`
- `.about-panel`
- `.about-group-card`
- `.contact-panel`
- `.contact-form`
- `.contact-item`
- `.stat-card`
- `.skills-metric`
- `.about-node`
- `.experience-card`
- `.site-header.is-scrolled .nav-shell`
- `.hero-orbit-link`
- `.hero-telemetry-card`
- `.hero-hud-btn`
- `.cv-shell`
- `.btn-prominent`

---

## 5. Infinite Decorative Keyframes & Stale `will-change` Removal (`html.perf-lite`)

### Infinite Animations Paused (`animation: none !important`):
- `.hero-portrait-interactive` (`@keyframes heroOrbitSpin`)
- `.hero-orbit-container` (`@keyframes heroOrbitSpinReverse`)
- `.hero-orbit-item` (`@keyframes heroOrbitFloat1..3`)
- `.skills-spotlight-halo` (`@keyframes skillsArchGlowPulse`)
- `.projects-header::after` (`@keyframes projects-shimmer`)
- `.certificates-header::after` (`@keyframes cert-laser-shimmer`)
- `.about-visual-backdrop::after` (`@keyframes aboutSweep`)
- `[data-glow-drift]` (`@keyframes glowDrift`)
- `.avatar-orbit` (`@keyframes avatarOrbit`)

*Functional animations kept intact:* Live availability dot (`.live-pulse-dot`), loading spinners, focus rings.

### Compositor Layers Freed:
- `html.perf-lite *, html.perf-lite *::before, html.perf-lite *::after { will-change: auto !important; }`
- Releases dozens of persistent GPU memory allocations across hero, about, projects, skills, and contact cards.
