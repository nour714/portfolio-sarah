/**
 * Toast Notification Service
 * Clean Architecture - Presentation / Notification Service
 */

export const showToast = (message, duration = 3000) => {
    const toast = document.getElementById("portfolio-toast");
    if (!toast) return;

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
