/**
 * Contact Form Module
 * Clean Architecture - Presentation / UI Layer
 */

import { showToast } from "../services/toast.service.js";

// Placeholder for Formspree or Web3Forms submission endpoint
// Replace with your real endpoint (e.g., https://formspree.io/f/your_form_id)
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
            statusNote.style.color = "";
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
                    inquiryType: projectType,
                    project_type: projectType,
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
        } catch (err) {
            const fallbackMsg = "Unable to send message via form service. Opening your email app as fallback...";
            if (statusNote) {
                statusNote.textContent = fallbackMsg;
                statusNote.style.color = "var(--brand-accent, #38bdf8)";
            }
            showToast("Opening email app as fallback...");

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
