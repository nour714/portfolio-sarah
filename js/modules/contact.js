/**
 * Contact Form Module
 * Clean Architecture - Presentation / UI Layer
 * Submits directly to Firestore REST API with automatic mailto fallback
 */

import { showToast } from "../services/toast.service.js";

const FIRESTORE_ENDPOINT = "https://firestore.googleapis.com/v1/projects/portfolio-9a88b/databases/default/documents/messages?key=AIzaSyA2Y3RuOABffeNJmWfg_uBGqF3chsaTwfQ";

export const initContactFormFallback = () => {
    const contactForm = document.getElementById("contact-form");
    const statusNote = document.getElementById("contact-status-note");
    if (!contactForm) return;

    if (statusNote) {
        statusNote.setAttribute("aria-live", "polite");
    }

    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector("button[type='submit']");
        const originalBtnText = submitBtn ? submitBtn.textContent : "Send Message";

        const formData = new FormData(contactForm);

        // Honeypot check: silently ignore submissions if _gotcha is filled
        const gotcha = (formData.get("_gotcha") || "").toString().trim();
        if (gotcha) {
            contactForm.reset();
            return;
        }

        const name = (formData.get("name") || "").toString().trim();
        const email = (formData.get("email") || "").toString().trim();
        const projectType = (formData.get("project_type") || "").toString().trim();
        const message = (formData.get("message") || "").toString().trim();

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";
        }

        if (statusNote) {
            statusNote.textContent = "Sending your message...";
            statusNote.style.color = "var(--brand-light, #a78bfa)";
        }

        try {
            const response = await fetch(FIRESTORE_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fields: {
                        name: { stringValue: name },
                        email: { stringValue: email },
                        projectType: { stringValue: projectType || "General" },
                        message: { stringValue: message },
                        createdAt: { stringValue: new Date().toISOString() }
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Server returned HTTP ${response.status}`);
            }

            contactForm.reset();
            const successMsg = "Thank you! Your message has been sent successfully.";
            if (statusNote) {
                statusNote.textContent = successMsg;
                statusNote.style.color = "var(--brand-accent, #38bdf8)";
            }
            showToast("Message sent successfully!");

            setTimeout(() => {
                if (statusNote && statusNote.textContent === successMsg) {
                    statusNote.textContent = "Your message will be delivered to Sarah's inbox.";
                    statusNote.style.color = "";
                }
            }, 6000);
        } catch (_err) {
            const fallbackMsg = "Redirecting to your email app with your message ready to send...";
            if (statusNote) {
                statusNote.textContent = fallbackMsg;
                statusNote.style.color = "var(--brand-accent, #38bdf8)";
            }
            showToast("Opening email app to send message...");

            const subject = encodeURIComponent(`Inquiry: ${projectType || "General"} - ${name}`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nInquiry Type: ${projectType}\n\nMessage:\n${message}`);
            window.location.href = `mailto:sarahhnabil71@gmail.com?subject=${subject}&body=${body}`;
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        }
    });
};
