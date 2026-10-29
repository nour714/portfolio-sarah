# Performance Baseline Report (Task 0)

Captured on: 2026-10-29T18:07:00Z  
Target URL: `https://eng-sarah.vercel.app/`  
Lighthouse Version: 13.6.0  
Preset: Mobile (Device Emulation: Moto G Power / mobile viewport 412x823, Slow 4G Network Throttling, 4x CPU Slowdown).

---

## 1. Summary Metrics

| Metric | Homepage (`/`) | CV Page (`/cv`) | Target / Notes |
| :--- | :--- | :--- | :--- |
| **Performance Score** | **66 / 100** | **84 / 100** | Primary optimization target |
| **Largest Contentful Paint (LCP)** | **5.4 s** | **3.1 s** | Severely penalized by uncompressed images & webfonts |
| **Total Blocking Time (TBT)** | **220 ms** | **0 ms** | Main thread execution of 29 scripts + animation setup |
| **Cumulative Layout Shift (CLS)** | **0.032** | **0.035** | Within Good (< 0.1), to preserve |
| **Total Transfer Size** | **1,774.7 KB** (~1.77 MB) | **143.4 KB** | Heavy initial payload on Slow 4G |
| **Total Network Requests** | **49** | **16** | Unbundled ES modules create waterfall chains |
| **JavaScript Transfer Size** | **136.7 KB** (29 requests) | **77.5 KB** (6 requests) | Unbundled ES modules (depth 4) |
| **CSS Transfer Size** | **56.7 KB** (3 requests) | **4.0 KB** (3 requests) | Includes render-blocking Devicon & Google Fonts CSS |
| **Image Transfer Size** | **843.1 KB** (8 requests) | **0 KB** (0 requests) | Large original WebP/PNGs without mobile srcsets |
| **Font Transfer Size** | **720.1 KB** (7 requests) | **39.0 KB** | Remote Google Fonts download over CDN |

---

## 2. Resource Breakdown

### Homepage (`/`)
- **Images:** 8 requests, 843,092 bytes (Largest image: `about-me-polished.webp` ~505 KB).
- **Fonts:** 7 requests, 720,099 bytes (Multiple Google Fonts Poppins & Space Grotesk variants).
- **JavaScript:** 29 requests, 136,736 bytes (Vendor libraries: GSAP, ScrollTrigger, Lenis + 26 unbundled local modules).
- **Stylesheets:** 3 requests, 56,670 bytes (`/css/main.css`, Devicon CDN CSS, Google Fonts CSS).
- **Document:** 1 request, 11,026 bytes (`/index.html`).

### CV Page (`/cv`)
- **JavaScript:** 6 requests, 77,466 bytes.
- **Stylesheets:** 3 requests, 4,018 bytes.
- **Fonts:** 38,988 bytes.
- **Document:** 1 request, 1,934 bytes.

---

## 3. Key Bottlenecks Identified

1. **Network Waterfall (29 Script Requests):** Native ES modules require sequential HTTP roundtrips on mobile Slow 4G. Bundling with esbuild into a single hashed bundle will eliminate roundtrip latency.
2. **Render-Blocking Third-Party CSS:** `devicon.min.css` (CDN) blocks initial paint while only 8 icons are used.
3. **Remote Google Fonts:** External Google Fonts domains (`fonts.googleapis.com`, `fonts.gstatic.com`) incur DNS, TLS, and roundtrip latency plus 720 KB font transfer. Self-hosting woff2 latin subset will cut size and avoid connection delays.
4. **Oversized Images:** `about-me-polished.webp` (~505 KB) and portfolio screenshots lack mobile srcset variants (480w / 800w).
5. **Expensive CSS Effects on Mobile:** Multiple `backdrop-filter: blur(...)`, deep box-shadows, continuous decorative animations, and Lenis smooth scrolling add thread pressure on low-tier mobile CPUs.

