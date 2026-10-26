/**
 * Contact Form Module
 * Clean Architecture - Presentation / UI Layer
 */

import { showToast } from "../services/toast.service.js";

export const initContactFormFallback = () => {
    const contactForm = document.getElementById("contact-form");
    const statusNote = document.getElementById("contact-status-note");
    if (!contactForm) return;

    contactForm.addEventListener("submit", (e) => {
        if (window.FirebaseAdminAPI) return; // If Firebase is ever active, let it handle
        e.preventDefault();
        const formData = new FormData(contactForm);
        const name = (formData.get("name") || "").toString().trim();
        const email = (formData.get("email") || "").toString().trim();
        const projectType = (formData.get("project_type") || "").toString().trim();
        const message = (formData.get("message") || "").toString().trim();

        const subject = encodeURIComponent(`Project Inquiry: ${projectType || "General"} - ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nProject Type: ${projectType}\n\nMessage:\n${message}`);

        window.location.href = `mailto:sarahhnabil71@gmail.com?subject=${subject}&body=${body}`;

        if (statusNote) {
            statusNote.textContent = "Redirecting to your email client to send your message...";
            statusNote.style.color = "var(--brand-light, #a78bfa)";
        }
        showToast("Opening email client to send message...");
    });
};
