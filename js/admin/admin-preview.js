/**
 * Admin Live Preview Module
 * Clean Architecture - Admin Feature Layer
 */

export const renderPreview = () => {
    const preview = document.getElementById("admin-preview");
    const iframe = preview?.querySelector("iframe");
    if (!preview || !iframe) return;

    const header = document.querySelector(".site-header");
    const main = document.querySelector("main");
    const footer = document.querySelector("footer");
    const bgEffects = document.querySelector(".bg-effects");

    if (!main) return;

    // Helper to clone and cleanup
    const prepareClone = (el) => {
        if (!el) return null;
        const clone = el.cloneNode(true);

        // Remove admin-related components from the preview
        const toRemove = clone.querySelectorAll(
            ".admin-launch, .admin-dashboard, .admin-auth-overlay, #admin-close, [data-admin-close]"
        );
        toRemove.forEach((node) => node.remove());

        // Remove loading/priority attributes for preview speed
        clone.querySelectorAll("img").forEach((img) => {
            img.loading = "lazy";
            img.decoding = "async";
            img.removeAttribute("fetchpriority");
        });
        // Force reveal elements to be visible
        clone.querySelectorAll(".reveal").forEach((node) => {
            node.classList.add("is-visible");
        });
        return clone;
    };

    const headerClone = prepareClone(header);
    const mainClone = prepareClone(main);
    const footerClone = prepareClone(footer);
    const bgEffectsClone = prepareClone(bgEffects);

    const isLight = document.body.classList.contains("light-mode");
    const baseHref = new URL(".", window.location.href).href;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <base href="${baseHref}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css">
    <link rel="stylesheet" href="style.css">
    <style>
        body { margin: 0; padding: 0; min-height: 100vh; position: relative; }
        /* Ensure background gradients from style.css show up correctly in iframe */
        html { scroll-behavior: smooth; }
        /* Hide scrollbars for cleaner preview */
        body::-webkit-scrollbar { width: 0; background: transparent; }
        body { scrollbar-width: none; }
    </style>
</head>
<body class="${isLight ? "light-mode" : ""}">
    <div id="preview-root">
        ${bgEffectsClone ? bgEffectsClone.outerHTML : ""}
        ${headerClone ? headerClone.outerHTML : ""}
        ${mainClone ? mainClone.outerHTML : ""}
        ${footerClone ? footerClone.outerHTML : ""}
    </div>
</body>
</html>`;
    iframe.srcdoc = html;
};

export const updatePreviewScale = () => {
    // No scale adjustments needed for iframe-based preview.
};
