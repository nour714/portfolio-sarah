/**
 * Toast Notification Service
 * Clean Architecture - Presentation / Notification Service
 */

export const showToast = (message, duration = 3000) => {
    let toast = document.getElementById("portfolio-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "portfolio-toast";
        toast.setAttribute("role", "status");
        toast.setAttribute("aria-live", "polite");
        document.body.appendChild(toast);
    }

    if (toast.__hideTimeoutId) {
        window.clearTimeout(toast.__hideTimeoutId);
    }

    toast.textContent = message;
    toast.classList.add("show");

    toast.__hideTimeoutId = window.setTimeout(() => {
        toast.classList.remove("show");
        toast.__hideTimeoutId = 0;
    }, duration);
};
