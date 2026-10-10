/**
 * Interactive Constellation Canvas Module
 * Clean Architecture - Presentation / UI Layer
 */

import { getMediaMatch } from "../core/utils.js";

export const initConstellation = () => {
    const canvas = document.getElementById("constellation-canvas");
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = getMediaMatch("(prefers-reduced-motion: reduce)");
    const pointer = { x: 0, y: 0, active: false };

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;
    let nodes = [];
    let running = true;
    const palette = {
        line: "83, 124, 248",
        pointer: "158, 184, 255",
        node: "236, 243, 255",
        nodeAlpha: 0.72
    };

    const updatePaletteFromTheme = () => {
        const styles = window.getComputedStyle(document.body);
        const line = styles.getPropertyValue("--canvas-line").trim();
        const pointerColor = styles.getPropertyValue("--canvas-pointer").trim();
        const node = styles.getPropertyValue("--canvas-node").trim();
        const nodeAlpha = Number.parseFloat(styles.getPropertyValue("--canvas-node-alpha"));

        if (line) palette.line = line;
        if (pointerColor) palette.pointer = pointerColor;
        if (node) palette.node = node;
        if (!Number.isNaN(nodeAlpha)) palette.nodeAlpha = nodeAlpha;
    };

    const getNodeCount = () => {
        const area = window.innerWidth * window.innerHeight;
        if (area < 350000) return 42;
        if (area < 700000) return 64;
        return 90;
    };

    const createNode = () => {
        const speed = 0.31;
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * speed,
            vy: (Math.random() - 0.5) * speed,
            radius: Math.random() * 1.6 + 0.6
        };
    };

    const seedNodes = () => {
        const count = getNodeCount();
        nodes = Array.from({ length: count }, createNode);
    };

    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        context.setTransform(dpr, 0, 0, dpr, 0, 0);

        seedNodes();
    };

    const drawConnections = () => {
        const maxDistance = Math.min(182, Math.max(124, window.innerWidth * 0.125));

        for (let i = 0; i < nodes.length; i += 1) {
            for (let j = i + 1; j < nodes.length; j += 1) {
                const a = nodes[i];
                const b = nodes[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const distance = Math.hypot(dx, dy);

                if (distance > maxDistance) continue;

                const alpha = (1 - distance / maxDistance) * 0.3;
                context.strokeStyle = `rgba(${palette.line}, ${alpha})`;
                context.lineWidth = 1.15;
                context.beginPath();
                context.moveTo(a.x, a.y);
                context.lineTo(b.x, b.y);
                context.stroke();
            }
        }
    };

    const drawPointerLines = () => {
        if (!pointer.active) return;

        const pointerRange = 215;

        nodes.forEach((node) => {
            const dx = node.x - pointer.x;
            const dy = node.y - pointer.y;
            const distance = Math.hypot(dx, dy);

            if (distance > pointerRange) return;

            const alpha = (1 - distance / pointerRange) * 0.34;
            context.strokeStyle = `rgba(${palette.pointer}, ${alpha})`;
            context.lineWidth = 1.15;
            context.beginPath();
            context.moveTo(node.x, node.y);
            context.lineTo(pointer.x, pointer.y);
            context.stroke();
        });
    };

    const drawNodes = () => {
        nodes.forEach((node) => {
            if (!reducedMotion) {
                node.x += node.vx;
                node.y += node.vy;

                if (node.x < -6) node.x = width + 6;
                if (node.x > width + 6) node.x = -6;
                if (node.y < -6) node.y = height + 6;
                if (node.y > height + 6) node.y = -6;
            }

            context.beginPath();
            context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            context.fillStyle = `rgba(${palette.node}, ${palette.nodeAlpha})`;
            context.fill();
        });
    };

    const render = () => {
        context.clearRect(0, 0, width, height);
        drawConnections();
        drawPointerLines();
        drawNodes();
    };

    const animate = () => {
        if (!running) return;
        render();
        rafId = window.requestAnimationFrame(animate);
    };

    const handleThemeChange = () => {
        updatePaletteFromTheme();
        render();
    };

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener(
        "pointermove",
        (event) => {
            pointer.x = event.clientX;
            pointer.y = event.clientY;
            pointer.active = true;
        },
        { passive: true }
    );
    window.addEventListener("pointerleave", () => {
        pointer.active = false;
    });
    window.addEventListener("themechange", handleThemeChange);

    document.addEventListener("visibilitychange", () => {
        running = !document.hidden;

        if (!running && rafId) {
            window.cancelAnimationFrame(rafId);
            rafId = 0;
            return;
        }

        if (running && !rafId && !reducedMotion) {
            rafId = window.requestAnimationFrame(animate);
        }
    });

    updatePaletteFromTheme();
    resize();

    if (reducedMotion) {
        render();
        return;
    }

    rafId = window.requestAnimationFrame(animate);
};
