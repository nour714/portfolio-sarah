/**
 * Contact Form Module
 * Clean Architecture - Presentation / UI Layer
 */

import { showToast } from "../services/toast.service.js";

// TODO: Replace with your real Formspree endpoint (e.g. https://formspree.io/f/your_form_id)
// Left as placeholder per instruction. Form submissions currently fall back to opening mailto.
export const FORM_ENDPOINT = "https://formspree.io/f/XXXXXXXX";

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
            const response = await fetch(FORM_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    project_type: projectType || "General",
                    message
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
            const fallbackMsg = "Opening your email app...";
            if (statusNote) {
                statusNote.textContent = fallbackMsg;
                statusNote.style.color = "var(--brand-accent, #38bdf8)";
            }
            showToast("Opening your email app...");

            const subject = encodeURIComponent(`Inquiry: ${projectType || "General"} - ${name}`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nInquiry Type: ${projectType}\n\nMessage:\n${message}`);
            window.location.href = `mailto:sarahhnabil71@gmail.com?subject=${subject}&body=${body}`;

            setTimeout(() => {
                if (statusNote && statusNote.textContent === fallbackMsg) {
                    statusNote.textContent = "Your message will be delivered to Sarah's inbox.";
                    statusNote.style.color = "";
                }
            }, 5000);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        }
    });
};
