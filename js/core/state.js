/**
 * State Management & Normalization
 * Clean Architecture - Domain / State Layer
 */

import { getText, setText, findContactItemByLabel } from "./utils.js";
import { resolveHeroRoles } from "../modules/hero.js";
import { createProjectCard } from "../modules/projects.js";
import { createCertificateCard } from "../modules/certificates.js";
import { createSkillCard, initSkillsArcCarousel } from "../modules/skills.js";

export const isPlainObject = (value) => Boolean(value && typeof value === "object" && !Array.isArray(value));

export const deepClone = (value) => {
    try {
        return JSON.parse(JSON.stringify(value));
    } catch (_error) {
        return null;
    }
};

export const deepMerge = (target, source) => {
    if (!isPlainObject(target) || !isPlainObject(source)) return target;
    Object.keys(source).forEach((key) => {
        const sourceValue = source[key];
        if (Array.isArray(sourceValue)) {
            if (sourceValue.length > 0 || !Array.isArray(target[key]) || target[key].length === 0) {
                target[key] = sourceValue.slice();
            }
            return;
        }
        if (isPlainObject(sourceValue)) {
            if (!isPlainObject(target[key])) {
                target[key] = {};
            }
            deepMerge(target[key], sourceValue);
            return;
        }
        if (sourceValue !== undefined) {
            target[key] = sourceValue;
        }
    });
    return target;
};

export const extractAdminState = () => {
    const heroName = getText(".hero-name-highlight") || getText(".hero-text h1 span:last-of-type") || getText(".hero-text h1 span");
    const heroCopy = getText(".hero-copy");
    const heroRoles = resolveHeroRoles();
    const heroAvatar = document.querySelector(".hero-avatar-img");
    const heroPrimary = document.querySelector(".hero-actions .hero-btn");
    const heroSecondary = document.querySelector(".hero-actions .hero-btn-secondary");

    const heroSocialLinks = Array.from(document.querySelectorAll(".hero-social-link"));
    const social = { github: "", linkedin: "", email: "" };
    heroSocialLinks.forEach((link) => {
        const href = link.getAttribute("href") || "";
        const label = String(link.getAttribute("aria-label") || "").toLowerCase();
        if (label.includes("github") || href.includes("github")) social.github = href;
        if (label.includes("linkedin") || href.includes("linkedin")) social.linkedin = href;
        if (href.startsWith("mailto:")) social.email = href.replace("mailto:", "");
    });

    const contactEmailItem = findContactItemByLabel("email");
    if (contactEmailItem && !social.email) {
        const emailValue = getText(".contact-value", contactEmailItem);
        if (emailValue) social.email = emailValue;
    }
    const contactLinkedInItem = findContactItemByLabel("linkedin");
    if (contactLinkedInItem && !social.linkedin) {
        social.linkedin = contactLinkedInItem.getAttribute("href") || social.linkedin;
    }
    const contactGithubItem = findContactItemByLabel("github");
    if (contactGithubItem && !social.github) {
        social.github = contactGithubItem.getAttribute("href") || social.github;
    }
    const contactLocationItem = findContactItemByLabel("location");
    const contactLinkedInLabel = contactLinkedInItem ? getText(".contact-value", contactLinkedInItem) : "";
    const contactGithubLabel = contactGithubItem ? getText(".contact-value", contactGithubItem) : "";

    const aboutMetrics = Array.from(document.querySelectorAll(".about-track .about-node")).map((node) => ({
        value: getText("strong", node),
        label: getText("span", node)
    }));

    const skillsMetricsNodes = Array.from(document.querySelectorAll(".skills-metric"));
    const skillsMetrics = { domains: "", tools: "", core: "", cloud: "" };
    skillsMetricsNodes.forEach((metric) => {
        const label = getText("dt", metric).toLowerCase();
        const value = getText("dd", metric);
        if (label.includes("domain")) skillsMetrics.domains = value;
        else if (label.includes("tool")) skillsMetrics.tools = value;
        else if (label.includes("core")) skillsMetrics.core = value;
        else if (label.includes("cloud")) skillsMetrics.cloud = value;
    });

    const skillItems = Array.from(document.querySelectorAll(".skill-card")).map((card) => ({
        name: getText(".skill-name", card)
    }));

    const skillGroups = Array.from(document.querySelectorAll(".skill-group")).map((group) => ({
        title: getText("h3", group),
        label: getText(".skill-group-label", group),
        items: Array.from(group.querySelectorAll(".skill-chip span:last-child")).map((item) =>
            String(item.textContent || "").trim()
        )
    }));

    const skillsNoteStrong = document.querySelector(".skills-note strong");
    const skillsNoteLabel = skillsNoteStrong ? String(skillsNoteStrong.textContent || "").trim() : "Focus:";
    const skillsNoteText = (() => {
        const note = document.querySelector(".skills-note");
        if (!note) return "";
        const raw = String(note.textContent || "").trim();
        if (!skillsNoteLabel) return raw;
        return raw.replace(skillsNoteLabel, "").trim();
    })();

    const projects = Array.from(document.querySelectorAll(".project-card")).map((card, index) => {
        const title = getText(".project-title", card);
        const shareButton = card.querySelector(".share-btn");
        return {
            id: `project-${index + 1}`,
            title,
            categories: (card.getAttribute("data-category") || "").split(/\s+/).filter(Boolean),
            meta: Array.from(card.querySelectorAll(".project-meta span")).map((item) => getText("", item)),
            description: getText(".project-description", card),
            highlights: Array.from(card.querySelectorAll(".project-highlights li")).map((item) => getText("", item)),
            tech: Array.from(card.querySelectorAll(".project-tech-tags li")).map((item) => getText("", item)),
            image: {
                src: card.querySelector(".project-image")?.getAttribute("src") || "",
                alt: card.querySelector(".project-image")?.getAttribute("alt") || title
            },
            githubUrl: card.querySelector(".github-btn")?.getAttribute("href") || "",
            shareUrl: shareButton?.getAttribute("data-share-url") || "",
            shareTitle: shareButton?.getAttribute("data-share-title") || title
        };
    });

    const experienceMetrics = Array.from(document.querySelectorAll(".experience-metric")).map((metric) => ({
        label: getText("span", metric),
        value: getText("strong", metric),
        description: getText("p", metric)
    }));

    const experienceItems = Array.from(document.querySelectorAll(".experience-card")).map((card) => ({
        role: getText("h3", card),
        org: getText(".experience-org", card),
        period: getText(".experience-period", card),
        summary: getText(".experience-summary", card),
        points: Array.from(card.querySelectorAll(".experience-points li")).map((item) => getText("", item)),
        tags: Array.from(card.querySelectorAll(".experience-tags span")).map((item) => getText("", item))
    }));

    const contactPanelTitle = getText(".contact-panel-head h3");
    const contactPanelCopy = getText(".contact-panel-head p");
    const contactAvailabilityTitle = getText(".contact-availability-title");
    const contactAvailabilityCopy = getText(".contact-availability-copy");
    const contactFormTitle = getText(".contact-form-head h3");
    const contactFormCopy = getText(".contact-form-head p");
    const contactFormNote = getText(".contact-note");
    const contactFormSubmit = getText(".contact-form-footer button");

    return {
        hero: {
            name: heroName,
            roles: heroRoles,
            copy: heroCopy,
            avatar: {
                src: heroAvatar?.getAttribute("src") || "",
                alt: heroAvatar?.getAttribute("alt") || ""
            },
            primary: {
                text: heroPrimary ? String(heroPrimary.textContent || "").trim() : "",
                url: heroPrimary?.getAttribute("href") || ""
            },
            secondary: {
                text: heroSecondary ? String(heroSecondary.textContent || "").trim() : "",
                url: heroSecondary?.getAttribute("href") || ""
            }
        },
        about: {
            status: getText(".about-status"),
            location: getText(".about-location"),
            title: getText("#about-title"),
            copy: getText(".about-copy"),
            signature: getText(".about-signature"),
            metrics: aboutMetrics
        },
        skills: {
            title: getText("#skills-title"),
            copy: getText(".skills-copy"),
            metrics: skillsMetrics,
            groups: skillGroups,
            items: skillItems,
            noteLabel: skillsNoteLabel,
            noteText: skillsNoteText
        },
        projectsSection: {
            title: getText("#projects-title"),
            copy: getText(".projects-copy")
        },
        projects,
        experience: {
            title: getText("#experience-title"),
            copy: getText(".experience-copy"),
            metrics: experienceMetrics,
            items: experienceItems
        },
        contact: {
            title: getText("#contact-title"),
            copy: getText(".contact-copy"),
            primary: {
                text: getText(".contact-actions .contact-btn-primary"),
                url: document.querySelector(".contact-actions .contact-btn-primary")?.getAttribute("href") || ""
            },
            secondary: {
                text: getText(".contact-actions .contact-btn-ghost"),
                url: document.querySelector(".contact-actions .contact-btn-ghost")?.getAttribute("href") || ""
            },
            location: contactLocationItem ? getText(".contact-value", contactLocationItem) : "",
            linkedinLabel: contactLinkedInLabel,
            githubLabel: contactGithubLabel,
            panelTitle: contactPanelTitle,
            panelCopy: contactPanelCopy,
            availabilityTitle: contactAvailabilityTitle,
            availabilityCopy: contactAvailabilityCopy,
            formTitle: contactFormTitle,
            formCopy: contactFormCopy,
            formNote: contactFormNote,
            formSubmit: contactFormSubmit
        },
        social
    };
};

export const normalizeAdminState = (state) => {
    if (!state) return state;
    state.about = state.about || { metrics: [] };
    state.about.metrics = Array.isArray(state.about.metrics) ? state.about.metrics : [];

    state.skills = state.skills || { metrics: {}, groups: [], items: [] };
    state.skills.metrics = state.skills.metrics || {};
    state.skills.groups = Array.isArray(state.skills.groups) ? state.skills.groups : [];
    state.skills.items = Array.isArray(state.skills.items) ? state.skills.items : [];

    state.projectsSection = state.projectsSection || {};
    state.projects = Array.isArray(state.projects) ? state.projects : [];
    state.projects.forEach((project) => {
        project.categories = Array.isArray(project.categories) ? project.categories : [];
        project.meta = Array.isArray(project.meta) ? project.meta : [];
        project.highlights = Array.isArray(project.highlights) ? project.highlights : [];
        project.tech = Array.isArray(project.tech) ? project.tech : [];
        project.image = project.image || { src: "", alt: "" };
    });

    state.experience = state.experience || { metrics: [], items: [] };
    state.experience.metrics = Array.isArray(state.experience.metrics) ? state.experience.metrics : [];
    state.experience.items = Array.isArray(state.experience.items) ? state.experience.items : [];

    state.contact = state.contact || {};
    state.social = state.social || {};
    return state;
};

export const applyHeroState = (hero) => {
    const heroRoleTyped = document.getElementById("hero-role-typed");
    const nameSpan = document.querySelector(".hero-name-highlight") || document.querySelector(".hero-text h1 span:last-of-type") || document.querySelector(".hero-text h1 span");
    const heroCopy = document.querySelector(".hero-copy");
    const heroPrimary = document.querySelector(".hero-actions .hero-btn");
    const heroSecondary = document.querySelector(".hero-actions .hero-btn-secondary");
    const heroAvatar = document.querySelector(".hero-avatar-img");

    if (nameSpan) setText(nameSpan, hero?.name || "");
    if (heroCopy) setText(heroCopy, hero?.copy || "");
    if (heroPrimary) {
        setText(heroPrimary, hero?.primary?.text || "");
        if (hero?.primary?.url) heroPrimary.setAttribute("href", hero.primary.url);
    }
    if (heroSecondary) {
        setText(heroSecondary, hero?.secondary?.text || "");
        if (hero?.secondary?.url) heroSecondary.setAttribute("href", hero.secondary.url);
    }
    if (heroAvatar) {
        if (hero?.avatar?.src) heroAvatar.setAttribute("src", hero.avatar.src);
        if (hero?.avatar?.alt) heroAvatar.setAttribute("alt", hero.avatar.alt);
    }

    if (heroRoleTyped && hero?.roles?.length) {
        heroRoleTyped.setAttribute("data-roles", hero.roles.join(" | "));
        const controller = window.__heroRoleTypingController;
        if (controller && typeof controller.updateRoles === "function") {
            controller.updateRoles(hero.roles);
        } else {
            heroRoleTyped.textContent = hero.roles[0];
        }
    }
};

export const applyAboutState = (about) => {
    setText(document.querySelector(".about-status"), about?.status || "");
    setText(document.querySelector(".about-location"), about?.location || "");
    setText(document.querySelector("#about-title"), about?.title || "");
    setText(document.querySelector(".about-copy"), about?.copy || "");
    setText(document.querySelector(".about-signature"), about?.signature || "");

    const track = document.querySelector(".about-track");
    if (track && Array.isArray(about?.metrics)) {
        track.innerHTML = "";
        about.metrics.forEach((metric) => {
            const node = document.createElement("article");
            node.className = "about-node";
            const strong = document.createElement("strong");
            strong.textContent = metric.value || "";
            const span = document.createElement("span");
            span.textContent = metric.label || "";
            node.append(strong, span);
            track.append(node);
        });
    }
};

export const applySkillsState = (skills) => {
    setText(document.querySelector("#skills-title"), skills?.title || "");
    setText(document.querySelector(".skills-copy"), skills?.copy || "");

    const metricsNodes = Array.from(document.querySelectorAll(".skills-metric"));
    metricsNodes.forEach((metric) => {
        const label = getText("dt", metric).toLowerCase();
        if (label.includes("domain")) setText(metric.querySelector("dd"), skills?.metrics?.domains || "");
        if (label.includes("tool")) setText(metric.querySelector("dd"), skills?.metrics?.tools || "");
        if (label.includes("core")) setText(metric.querySelector("dd"), skills?.metrics?.core || "");
        if (label.includes("cloud")) setText(metric.querySelector("dd"), skills?.metrics?.cloud || "");
    });

    let allItems = [];
    if (Array.isArray(skills?.items) && skills.items.length) {
        allItems = skills.items;
    } else if (Array.isArray(skills?.groups)) {
        skills.groups.forEach((group) => {
            (group.items || []).forEach((item) => {
                allItems.push(item);
            });
        });
    }

    // Modern Interactive Circular Arc Carousel
    if (allItems.length) {
        initSkillsArcCarousel(allItems);
    }

    const board = document.querySelector(".skills-board");
    if (board && allItems.length) {
        board.innerHTML = "";
        allItems.forEach((item) => {
            board.appendChild(createSkillCard(item));
        });
    }

    const skillsNote = document.querySelector(".skills-note");
    if (skillsNote) {
        const label = skills?.noteLabel || "";
        const noteText = skills?.noteText || "";
        skillsNote.innerHTML = "";
        if (label) {
            const strong = document.createElement("strong");
            strong.textContent = label;
            skillsNote.appendChild(strong);
            skillsNote.appendChild(document.createTextNode(` ${noteText}`));
        } else {
            skillsNote.textContent = noteText;
        }
    }
};

export const applyProjectsState = (projectsSection, projects) => {
    const titleEl = document.querySelector("#projects-title");
    if (titleEl && projectsSection?.title) {
        const words = projectsSection.title.split(/\s+/).filter(Boolean);
        titleEl.innerHTML = words.map((w) => `<span class="title-word">${w}</span>`).join(" ");
    }
    setText(document.querySelector(".projects-copy"), projectsSection?.copy || "");

    const grid = document.querySelector(".projects-grid");
    if (!grid || !Array.isArray(projects)) return;
    window.__projectsData = projects;
    grid.innerHTML = "";
    projects.forEach((project, index) => {
        grid.appendChild(createProjectCard(project, index));
    });

    if (typeof window.__applyProjectFilter === "function") {
        window.__applyProjectFilter();
    }
};

export const applyCertificatesState = (certificatesSection, certificates) => {
    const titleEl = document.querySelector("#certificates-title");
    if (titleEl && certificatesSection?.title) {
        const words = certificatesSection.title.split(/\s+/).filter(Boolean);
        titleEl.innerHTML = words.map((w) => `<span class="title-word">${w}</span>`).join(" ");
    }
    setText(document.querySelector(".certificates-copy"), certificatesSection?.copy || "");

    const grid = document.querySelector(".certificates-grid");
    if (!grid) return;
    if (Array.isArray(certificates) && certificates.length > 0) {
        grid.innerHTML = "";
        certificates.forEach((cert, index) => {
            grid.appendChild(createCertificateCard(cert, index));
        });
    }

    if (typeof window.__applyCertificateFilter === "function") {
        window.__applyCertificateFilter();
    }
};

export const applyExperienceState = (experience) => {
    setText(document.querySelector("#experience-title"), experience?.title || "");
    setText(document.querySelector(".experience-copy"), experience?.copy || "");

    const metricContainer = document.querySelector(".experience-metrics");
    if (metricContainer && Array.isArray(experience?.metrics)) {
        metricContainer.innerHTML = "";
        experience.metrics.forEach((metric) => {
            const article = document.createElement("article");
            article.className = "experience-metric reveal";
            const label = document.createElement("span");
            label.textContent = metric.label || "";
            const value = document.createElement("strong");
            value.textContent = metric.value || "";
            const copy = document.createElement("p");
            copy.textContent = metric.description || "";
            article.append(label, value, copy);
            metricContainer.append(article);
        });
    }

    const grid = document.querySelector(".experience-grid");
    if (grid && Array.isArray(experience?.items)) {
        grid.innerHTML = "";
        experience.items.forEach((item) => {
            const card = document.createElement("article");
            card.className = "experience-card reveal";
            const role = document.createElement("div");
            role.className = "experience-role";
            const roleMeta = document.createElement("div");
            const title = document.createElement("h3");
            title.textContent = item.role || "";
            const org = document.createElement("p");
            org.className = "experience-org";
            org.textContent = item.org || "";
            roleMeta.append(title, org);
            const period = document.createElement("span");
            period.className = "experience-period";
            period.textContent = item.period || "";
            role.append(roleMeta, period);

            const summary = document.createElement("p");
            summary.className = "experience-summary";
            summary.textContent = item.summary || "";

            const points = document.createElement("ul");
            points.className = "experience-points";
            (item.points || []).forEach((point) => {
                const li = document.createElement("li");
                li.textContent = point;
                points.append(li);
            });

            const tags = document.createElement("div");
            tags.className = "experience-tags";
            (item.tags || []).forEach((tag) => {
                const span = document.createElement("span");
                span.textContent = tag;
                tags.append(span);
            });

            card.append(role, summary, points, tags);
            grid.append(card);
        });
    }
};

export const applyContactState = (contact, social) => {
    setText(document.querySelector("#contact-title"), contact?.title || "");
    setText(document.querySelector(".contact-copy"), contact?.copy || "");

    const primaryBtn = document.querySelector(".contact-actions .contact-btn-primary");
    if (primaryBtn) {
        setText(primaryBtn, contact?.primary?.text || "");
        if (contact?.primary?.url) primaryBtn.setAttribute("href", contact.primary.url);
    }
    const secondaryBtn = document.querySelector(".contact-actions .contact-btn-ghost");
    if (secondaryBtn) {
        setText(secondaryBtn, contact?.secondary?.text || "");
        if (contact?.secondary?.url) secondaryBtn.setAttribute("href", contact.secondary.url);
    }

    const emailItem = findContactItemByLabel("email");
    if (emailItem) {
        const emailValue = emailItem.querySelector(".contact-value");
        setText(emailValue, social?.email || "");
        if (social?.email && emailItem.tagName === "A") {
            emailItem.setAttribute("href", `mailto:${social.email}`);
        }
    }

    const locationItem = findContactItemByLabel("location");
    if (locationItem) {
        setText(locationItem.querySelector(".contact-value"), contact?.location || "");
    }

    const linkedinItem = findContactItemByLabel("linkedin");
    if (linkedinItem) {
        if (social?.linkedin) linkedinItem.setAttribute("href", social.linkedin);
        setText(linkedinItem.querySelector(".contact-value"), contact?.linkedinLabel || "");
    }

    const githubItem = findContactItemByLabel("github");
    if (githubItem) {
        if (social?.github) githubItem.setAttribute("href", social.github);
        setText(githubItem.querySelector(".contact-value"), contact?.githubLabel || "");
    }

    setText(document.querySelector(".contact-panel-head h3"), contact?.panelTitle || "");
    setText(document.querySelector(".contact-panel-head p"), contact?.panelCopy || "");
    setText(document.querySelector(".contact-availability-title"), contact?.availabilityTitle || "");
    setText(document.querySelector(".contact-availability-copy"), contact?.availabilityCopy || "");

    setText(document.querySelector(".contact-form-head h3"), contact?.formTitle || "");
    setText(document.querySelector(".contact-form-head p"), contact?.formCopy || "");
    setText(document.querySelector(".contact-note"), contact?.formNote || "");
    setText(document.querySelector(".contact-form-footer button"), contact?.formSubmit || "");
};

export const applySocialState = (social) => {
    const socialLinks = Array.from(document.querySelectorAll("a[aria-label]"));
    socialLinks.forEach((link) => {
        const label = String(link.getAttribute("aria-label") || "").toLowerCase();
        if (label.includes("github") && social?.github) link.setAttribute("href", social.github);
        if (label.includes("linkedin") && social?.linkedin) link.setAttribute("href", social.linkedin);
        if (label.includes("email") && social?.email) link.setAttribute("href", `mailto:${social.email}`);
    });
};

export const applyAdminState = (state) => {
    if (!state) return;
    applyHeroState(state.hero);
    applyAboutState(state.about);
    applySkillsState(state.skills);
    applyProjectsState(state.projectsSection, state.projects);
    applyCertificatesState(state.certificatesSection, state.certificates);
    applyExperienceState(state.experience);
    applyContactState(state.contact, state.social);
    applySocialState(state.social);

    // Sync with admin dashboard state if initialized
    if (window.__syncAdminDashboardState) {
        window.__syncAdminDashboardState(state);
    }
};
