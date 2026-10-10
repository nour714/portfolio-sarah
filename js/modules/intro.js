/**
 * AI Intro / Splash Screen Module
 * Clean Architecture - Presentation / UI Layer
 */

export const initAiIntroScreen = () => {
    const introScreen = document.getElementById("ai-intro-screen");
    if (!introScreen) return;

    const progressBar = document.getElementById("ai-intro-progress-bar");
    const pctLabel = document.getElementById("ai-intro-pct");
    const cmdLabel = document.getElementById("ai-intro-cmd");
    const skipBtn = document.getElementById("ai-intro-skip-btn");

    // Lock page scroll while intro is visible
    document.body.style.overflow = "hidden";

    const steps = [
        { pct: 18, text: "INITIALIZING NEURAL ENVIRONMENT..." },
        { pct: 42, text: "LOADING COMPUTER VISION & DL MODELS..." },
        { pct: 75, text: "SYNCHRONIZING PROJECT REPOSITORIES..." },
        { pct: 92, text: "OPTIMIZING INTERACTION LATENCY..." },
        { pct: 100, text: "SYSTEM READY // WELCOME, ALLAA." }
    ];

    let currentStepIndex = 0;
    let currentPct = 0;
    let isTerminated = false;
    let animationInterval = null;

    const terminateIntro = () => {
        if (isTerminated) return;
        isTerminated = true;

        if (animationInterval) clearInterval(animationInterval);

        if (progressBar) progressBar.style.width = "100%";
        if (pctLabel) pctLabel.textContent = "100";
        if (cmdLabel) cmdLabel.textContent = "SYSTEM READY // WELCOME";

        introScreen.classList.add("fade-out");
        document.body.style.overflow = "";

        setTimeout(() => {
            introScreen.remove();
        }, 850);
    };

    if (skipBtn) {
        skipBtn.addEventListener("click", () => {
            terminateIntro();
        });
    }

    const duration = 2200; // ~2.2 seconds total duration
    const intervalMs = 25;
    const totalTicks = duration / intervalMs;
    const increment = 100 / totalTicks;

    animationInterval = setInterval(() => {
        currentPct += increment;
        if (currentPct >= 100) {
            currentPct = 100;
            clearInterval(animationInterval);
            if (progressBar) progressBar.style.width = "100%";
            if (pctLabel) pctLabel.textContent = "100";
            if (cmdLabel) cmdLabel.textContent = steps[steps.length - 1].text;
            setTimeout(terminateIntro, 350);
            return;
        }

        const rounded = Math.floor(currentPct);
        if (progressBar) progressBar.style.width = `${currentPct}%`;
        if (pctLabel) pctLabel.textContent = String(rounded);
        introScreen.setAttribute("aria-valuenow", String(rounded));

        if (currentStepIndex < steps.length - 1 && rounded >= steps[currentStepIndex].pct) {
            currentStepIndex++;
            if (cmdLabel) cmdLabel.textContent = steps[currentStepIndex].text;
        }
    }, intervalMs);
};
