/**
 * Admin Dashboard Controller
 * Clean Architecture - Admin Feature Layer
 */

import { ADMIN_THEME_KEY } from "../core/constants.js";
import { getText, setText, parseList, formatList } from "../core/utils.js";
import { extractAdminState, normalizeAdminState, deepClone, deepMerge, applyAdminState } from "../core/state.js";
import { renderPreview, updatePreviewScale } from "./admin-preview.js";
import { showToast } from "../services/toast.service.js";

export const initAdminDashboard = () => {
    const dashboard = document.getElementById("admin-dashboard");
    const launch = document.getElementById("admin-launch");
    if (!dashboard || !launch) return;

    const isDedicatedAdminPage = document.body.classList.contains("admin-only");
    let adminState = normalizeAdminState(extractAdminState());
    const baselineAdminState = deepClone(adminState);
    let savedAdminState = deepClone(adminState);
    let hasPersistedAdminState = false;

    const saveStatus = document.getElementById("admin-save-status");
    let saveTimeout = 0;
    const markDirty = () => {
        if (!saveStatus) return;
        saveStatus.textContent = "Unsaved";
        saveStatus.classList.add("is-dirty");
    };
    const markSaved = () => {
        if (!saveStatus) return;
        saveStatus.textContent = "Saved";
        saveStatus.classList.remove("is-dirty");
    };
    const markSnapshotPendingSave = () => {
        markDirty();
        if (saveStatus) saveStatus.textContent = "Not saved - click Save to push to Firestore";
    };
    const applySavedStateStatus = () => {
        if (hasPersistedAdminState) {
            markSaved();
            return;
        }
        markSnapshotPendingSave();
    };

    function openAdmin() {
        document.body.classList.add("admin-open");
        dashboard.setAttribute("aria-hidden", "false");
        schedulePreview();
        updatePreviewScale();
    }

    function closeAdmin() {
        document.body.classList.remove("admin-open");
        dashboard.setAttribute("aria-hidden", "true");
    }

    function schedulePreview() {
        if (!document.body.classList.contains("admin-open")) return;
        window.requestAnimationFrame(() => {
            renderPreview();
            updatePreviewScale();
        });
    }

    function scheduleSave() {
        markDirty();
        if (saveTimeout) window.clearTimeout(saveTimeout);
        saveTimeout = window.setTimeout(persistState, 1000);
    }

    // Auth Logic
    const loginSection = document.getElementById("admin-login-section");
    const loginForm = document.getElementById("admin-login-form");
    const loginEmail = document.getElementById("login-email");
    const loginPassword = document.getElementById("login-pass");
    const loginButton = document.getElementById("login-btn");
    const loginError = document.getElementById("login-error");
    const showLoginBtn = document.getElementById("admin-show-login");
    const logoutBtn = document.getElementById("admin-logout");

    let isAuthenticated = false;
    let adminAuthBound = false;

    const setLoginError = (message = "") => {
        if (!loginError) return;
        const hasMessage = Boolean(message);
        loginError.textContent = message;
        loginError.hidden = !hasMessage;
        loginError.style.display = hasMessage ? "block" : "none";
    };

    const hideLoginGate = () => {
        setLoginError("");
        if (loginSection) {
            loginSection.hidden = true;
            loginSection.style.display = "none";
            loginSection.setAttribute("aria-hidden", "true");
        }
    };

    const syncAuthButtons = () => {
        if (showLoginBtn) showLoginBtn.style.display = isAuthenticated ? "none" : "block";
        if (logoutBtn) logoutBtn.style.display = isAuthenticated ? "block" : "none";
    };

    const syncEditingAccess = () => {
        const controls = dashboard.querySelectorAll(
            [
                "#admin-save",
                "#admin-reset",
                '.admin-section:not([data-section="messages"]) input',
                '.admin-section:not([data-section="messages"]) textarea',
                '.admin-section:not([data-section="messages"]) select',
                '.admin-section:not([data-section="messages"]) button[data-action]'
            ].join(", ")
        );

        controls.forEach((control) => {
            if (
                !(control instanceof HTMLInputElement) &&
                !(control instanceof HTMLTextAreaElement) &&
                !(control instanceof HTMLSelectElement) &&
                !(control instanceof HTMLButtonElement)
            ) {
                return;
            }
            control.disabled = !isAuthenticated;
        });

        dashboard.querySelectorAll('.admin-section:not([data-section="messages"]) .admin-upload').forEach((upload) => {
            upload.style.pointerEvents = isAuthenticated ? "" : "none";
            upload.setAttribute("aria-disabled", String(!isAuthenticated));
        });

        if (!saveStatus) return;
        if (isAuthenticated) {
            applySavedStateStatus();
            return;
        }
        saveStatus.textContent = "Read-only mode";
        saveStatus.classList.add("is-dirty");
    };

    const showLoginGate = () => {
        setLoginError("");
        if (loginSection) {
            loginSection.hidden = false;
            loginSection.style.display = "flex";
            loginSection.setAttribute("aria-hidden", "false");
        }
        syncAuthButtons();
        closeAdmin();
        window.requestAnimationFrame(() => {
            if (loginEmail) loginEmail.focus();
        });
    };

    const loadRemoteAdminState = async () => {
        if (!window.FirebaseAdminAPI) return;
        try {
            const remoteData = await window.FirebaseAdminAPI.loadPortfolioData();
            if (remoteData && Object.keys(remoteData).length > 0) {
                adminState = normalizeAdminState(deepMerge(deepClone(baselineAdminState), remoteData));
                savedAdminState = deepClone(adminState);
                hasPersistedAdminState = true;
                applyAdminState(adminState);
                renderDynamicLists();
                syncInputValues();
                syncEditingAccess();
                markSaved();
                return;
            }

            adminState = normalizeAdminState(deepClone(baselineAdminState));
            savedAdminState = deepClone(adminState);
            hasPersistedAdminState = false;
            applyAdminState(adminState);
            renderDynamicLists();
            syncInputValues();
            syncEditingAccess();
            if (isAuthenticated) {
                markSnapshotPendingSave();
            } else if (saveStatus) {
                saveStatus.textContent = "Read-only mode";
                saveStatus.classList.add("is-dirty");
            }
        } catch (err) {
            console.warn("[Firebase REST] Could not load remote data for admin, using local state.", err);
            savedAdminState = deepClone(adminState);
            hasPersistedAdminState = false;
            syncEditingAccess();
            if (isAuthenticated) {
                markSnapshotPendingSave();
            } else if (saveStatus) {
                saveStatus.textContent = "Read-only mode";
                saveStatus.classList.add("is-dirty");
            }
        }
    };

    const showAdminDashboard = () => {
        hideLoginGate();
        syncAuthButtons();
        openAdmin();
        syncEditingAccess();
    };

    closeAdmin();
    if (isDedicatedAdminPage) showLoginGate();

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = String(loginEmail?.value || "").trim();
            const password = String(loginPassword?.value || "");

            if (!email || !password) {
                setLoginError("Enter your email and password.");
                return;
            }

            if (!window.FirebaseAdminAPI) {
                setLoginError("Firebase is still loading. Please try again.");
                return;
            }

            if (loginButton) {
                loginButton.textContent = "Logging in...";
                loginButton.disabled = true;
            }
            setLoginError("");

            try {
                await window.FirebaseAdminAPI.login(email, password);
                window.location.reload();
            } catch (_error) {
                setLoginError("Login failed. Check your email/password.");
            } finally {
                if (loginButton) {
                    loginButton.textContent = "Login";
                    loginButton.disabled = false;
                }
            }
        });
    }

    if (showLoginBtn) {
        showLoginBtn.addEventListener("click", () => {
            showLoginGate();
        });
    }

    if (loginSection) {
        loginSection.addEventListener("click", (event) => {
            if (event.target !== loginSection) return;
            if (isDedicatedAdminPage) return;
            hideLoginGate();
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            if (window.FirebaseAdminAPI) await window.FirebaseAdminAPI.logout();
        });
    }

    // Setup Firebase auth listener — waits for firebase-ready if needed
    const setupAdminAuth = () => {
        if (!window.FirebaseAdminAPI || adminAuthBound) return;
        adminAuthBound = true;
        window.FirebaseAdminAPI.onAuthStateChanged(async (user) => {
            isAuthenticated = !!user;
            if (!isAuthenticated) {
                showLoginGate();
                return;
            }

            showAdminDashboard();
            await loadRemoteAdminState();
        });
    };

    if (window.FirebaseAdminAPI || window.__firebaseReady) {
        setupAdminAuth();
    } else {
        window.addEventListener("firebase-ready", setupAdminAuth, { once: true });
    }

    const persistState = async () => {
        if (!window.FirebaseAdminAPI) {
            console.warn("Firebase not ready yet. Retrying save in 1s...");
            window.setTimeout(persistState, 1000);
            return;
        }
        if (!isAuthenticated) {
            const statusEl = document.getElementById("admin-save-status");
            if (statusEl) {
                statusEl.textContent = "Not signed in";
                statusEl.classList.add("is-dirty");
            }
            console.warn("Save skipped: user is not authenticated.");
            return;
        }
        try {
            await window.FirebaseAdminAPI.savePortfolioData(adminState);
            savedAdminState = deepClone(adminState);
            hasPersistedAdminState = true;
            markSaved();
        } catch (_error) {
            console.error("Failed to save to Firebase", _error);
            markDirty();
        }
    };

    // Public API to sync external state changes (e.g. from Firestore) back into the dashboard
    window.__syncAdminDashboardState = (newState) => {
        if (!newState) return;
        adminState = normalizeAdminState(deepClone(newState));
        savedAdminState = deepClone(adminState);
        hasPersistedAdminState = true;
        syncInputValues();
        renderDynamicLists();
        schedulePreview();
        markSaved();
    };





    const applySocialAndContact = () => {
        applySocialState(adminState.social);
        applyContactState(adminState.contact, adminState.social);
    };

    const bindings = [
        { id: "admin-hero-name", path: "hero.name", apply: () => applyHeroState(adminState.hero) },
        {
            id: "admin-hero-roles",
            path: "hero.roles",
            fromInput: (value) => value.split("|").map((item) => item.trim()).filter(Boolean),
            toInput: (value) => (Array.isArray(value) ? value.join(" | ") : ""),
            apply: () => applyHeroState(adminState.hero)
        },
        { id: "admin-hero-copy", path: "hero.copy", apply: () => applyHeroState(adminState.hero) },
        { id: "admin-hero-avatar", path: "hero.avatar.src", apply: () => applyHeroState(adminState.hero) },
        { id: "admin-hero-avatar-alt", path: "hero.avatar.alt", apply: () => applyHeroState(adminState.hero) },
        { id: "admin-hero-primary-text", path: "hero.primary.text", apply: () => applyHeroState(adminState.hero) },
        { id: "admin-hero-primary-url", path: "hero.primary.url", apply: () => applyHeroState(adminState.hero) },
        { id: "admin-hero-secondary-text", path: "hero.secondary.text", apply: () => applyHeroState(adminState.hero) },
        { id: "admin-hero-secondary-url", path: "hero.secondary.url", apply: () => applyHeroState(adminState.hero) },
        { id: "admin-about-status", path: "about.status", apply: () => applyAboutState(adminState.about) },
        { id: "admin-about-location", path: "about.location", apply: () => applyAboutState(adminState.about) },
        { id: "admin-about-title", path: "about.title", apply: () => applyAboutState(adminState.about) },
        { id: "admin-about-copy", path: "about.copy", apply: () => applyAboutState(adminState.about) },
        { id: "admin-about-signature", path: "about.signature", apply: () => applyAboutState(adminState.about) },
        { id: "admin-skills-title", path: "skills.title", apply: () => applySkillsState(adminState.skills) },
        { id: "admin-skills-copy", path: "skills.copy", apply: () => applySkillsState(adminState.skills) },
        { id: "admin-skills-domains", path: "skills.metrics.domains", apply: () => applySkillsState(adminState.skills) },
        { id: "admin-skills-tools", path: "skills.metrics.tools", apply: () => applySkillsState(adminState.skills) },
        { id: "admin-skills-core", path: "skills.metrics.core", apply: () => applySkillsState(adminState.skills) },
        { id: "admin-skills-cloud", path: "skills.metrics.cloud", apply: () => applySkillsState(adminState.skills) },
        { id: "admin-skills-note-label", path: "skills.noteLabel", apply: () => applySkillsState(adminState.skills) },
        { id: "admin-skills-note", path: "skills.noteText", apply: () => applySkillsState(adminState.skills) },
        { id: "admin-projects-title", path: "projectsSection.title", apply: () => applyProjectsState(adminState.projectsSection, adminState.projects) },
        { id: "admin-projects-copy", path: "projectsSection.copy", apply: () => applyProjectsState(adminState.projectsSection, adminState.projects) },
        { id: "admin-experience-title", path: "experience.title", apply: () => applyExperienceState(adminState.experience) },
        { id: "admin-experience-copy", path: "experience.copy", apply: () => applyExperienceState(adminState.experience) },
        { id: "admin-contact-title", path: "contact.title", apply: () => applyContactState(adminState.contact, adminState.social) },
        { id: "admin-contact-copy", path: "contact.copy", apply: () => applyContactState(adminState.contact, adminState.social) },
        { id: "admin-contact-primary-text", path: "contact.primary.text", apply: () => applyContactState(adminState.contact, adminState.social) },
        { id: "admin-contact-primary-url", path: "contact.primary.url", apply: () => applyContactState(adminState.contact, adminState.social) },
        { id: "admin-contact-secondary-text", path: "contact.secondary.text", apply: () => applyContactState(adminState.contact, adminState.social) },
        { id: "admin-contact-secondary-url", path: "contact.secondary.url", apply: () => applyContactState(adminState.contact, adminState.social) },
        { id: "admin-contact-location", path: "contact.location", apply: () => applyContactState(adminState.contact, adminState.social) },
        { id: "admin-contact-linkedin-label", path: "contact.linkedinLabel", apply: () => applyContactState(adminState.contact, adminState.social) },
        { id: "admin-contact-github-label", path: "contact.githubLabel", apply: () => applyContactState(adminState.contact, adminState.social) },
        { id: "admin-contact-availability-title", path: "contact.availabilityTitle", apply: () => applyContactState(adminState.contact, adminState.social) },
        { id: "admin-contact-availability-copy", path: "contact.availabilityCopy", apply: () => applyContactState(adminState.contact, adminState.social) },
        { id: "admin-contact-panel-title", path: "contact.panelTitle", apply: () => applyContactState(adminState.contact, adminState.social) },
        { id: "admin-contact-panel-copy", path: "contact.panelCopy", apply: () => applyContactState(adminState.contact, adminState.social) },
        { id: "admin-contact-form-title", path: "contact.formTitle", apply: () => applyContactState(adminState.contact, adminState.social) },
        { id: "admin-contact-form-copy", path: "contact.formCopy", apply: () => applyContactState(adminState.contact, adminState.social) },
        { id: "admin-contact-form-note", path: "contact.formNote", apply: () => applyContactState(adminState.contact, adminState.social) },
        { id: "admin-contact-form-submit", path: "contact.formSubmit", apply: () => applyContactState(adminState.contact, adminState.social) },
        { id: "admin-contact-email", path: "social.email", apply: () => applySocialAndContact() },
        { id: "admin-social-email", path: "social.email", apply: () => applySocialAndContact() },
        { id: "admin-social-github", path: "social.github", apply: () => applySocialAndContact() },
        { id: "admin-social-linkedin", path: "social.linkedin", apply: () => applySocialAndContact() }
    ];

    const pathRegistry = new Map();
    const getValueByPath = (path) => {
        return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), adminState);
    };
    const setValueByPath = (path, value) => {
        const keys = path.split(".");
        let node = adminState;
        keys.slice(0, -1).forEach((key) => {
            if (!isPlainObject(node[key])) node[key] = {};
            node = node[key];
        });
        node[keys[keys.length - 1]] = value;
    };

    bindings.forEach((binding) => {
        const input = document.getElementById(binding.id);
        if (!input) return;
        if (!pathRegistry.has(binding.path)) pathRegistry.set(binding.path, []);
        pathRegistry.get(binding.path).push(input);

        const setInputValue = () => {
            const value = getValueByPath(binding.path);
            input.value = binding.toInput ? binding.toInput(value) : value || "";
        };
        setInputValue();

        input.addEventListener("input", () => {
            const nextValue = binding.fromInput ? binding.fromInput(input.value) : input.value;
            setValueByPath(binding.path, nextValue);
            binding.apply();
            scheduleSave();
            schedulePreview();

            const linkedInputs = pathRegistry.get(binding.path) || [];
            linkedInputs.forEach((linked) => {
                if (linked === input) return;
                linked.value = binding.toInput ? binding.toInput(nextValue) : nextValue || "";
            });
        });
    });

    const aboutMetricsWrap = document.getElementById("admin-about-metrics");
    const skillsGroupsWrap = document.getElementById("admin-skills-groups");
    const projectsListWrap = document.getElementById("admin-projects-list");
    const experienceMetricsWrap = document.getElementById("admin-experience-metrics");
    const experienceListWrap = document.getElementById("admin-experience-list");

    const createField = (label, value, field, type = "text") => {
        const wrapper = document.createElement("label");
        wrapper.className = "admin-field";
        const span = document.createElement("span");
        span.textContent = label;
        const control = document.createElement(type === "textarea" ? "textarea" : "input");
        if (type !== "textarea") control.type = type;
        control.value = value || "";
        control.dataset.field = field;
        if (type === "textarea") control.rows = 3;
        wrapper.append(span, control);
        return wrapper;
    };

    const createActionButton = (label, action) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "admin-btn admin-btn-ghost";
        button.textContent = label;
        button.dataset.action = action;
        return button;
    };

    const renderAboutMetrics = () => {
        if (!aboutMetricsWrap) return;
        aboutMetricsWrap.innerHTML = "";
        adminState.about.metrics.forEach((metric, index) => {
            const item = document.createElement("div");
            item.className = "admin-list-item";
            item.dataset.index = String(index);
            item.append(createField("Value", metric.value, "value"));
            item.append(createField("Label", metric.label, "label"));
            const actions = document.createElement("div");
            actions.className = "admin-list-actions";
            actions.append(
                createActionButton("Up", "move-up"),
                createActionButton("Down", "move-down"),
                createActionButton("Remove", "remove")
            );
            item.append(actions);
            aboutMetricsWrap.append(item);
        });
    };

    const renderSkillsGroups = () => {
        if (!skillsGroupsWrap) return;
        skillsGroupsWrap.innerHTML = "";
        adminState.skills.groups.forEach((group, index) => {
            const item = document.createElement("div");
            item.className = "admin-list-item";
            item.dataset.index = String(index);
            item.append(createField("Group Title", group.title, "title"));
            item.append(createField("Level Label", group.label, "label"));
            const skillsField = createField("Skills (one per line)", formatList(group.items, "lines"), "items", "textarea");
            skillsField.querySelector("textarea").rows = 4;
            item.append(skillsField);
            const actions = document.createElement("div");
            actions.className = "admin-list-actions";
            actions.append(
                createActionButton("Up", "move-up"),
                createActionButton("Down", "move-down"),
                createActionButton("Remove", "remove")
            );
            item.append(actions);
            skillsGroupsWrap.append(item);
        });
    };

    const renderProjectsList = () => {
        if (!projectsListWrap) return;
        projectsListWrap.innerHTML = "";
        adminState.projects.forEach((project, index) => {
            project.image = project.image || { src: "", alt: "" };
            const item = document.createElement("div");
            item.className = "admin-list-item";
            item.dataset.index = String(index);

            item.append(createField("Title", project.title, "title"));
            item.append(createField("Categories (comma separated)", formatList(project.categories, "comma"), "categories"));
            item.append(createField("Meta Tags (comma separated)", formatList(project.meta, "comma"), "meta"));
            const desc = createField("Description", project.description, "description", "textarea");
            desc.querySelector("textarea").rows = 3;
            item.append(desc);
            const highlights = createField("Highlights (one per line)", formatList(project.highlights, "lines"), "highlights", "textarea");
            highlights.querySelector("textarea").rows = 3;
            item.append(highlights);
            item.append(createField("Tech Tags (comma separated)", formatList(project.tech, "comma"), "tech"));
            item.append(createField("GitHub URL", project.githubUrl, "githubUrl"));
            item.append(createField("Share URL", project.shareUrl, "shareUrl"));
            item.append(createField("Image URL", project.image?.src, "imageSrc"));
            item.append(createField("Image Alt Text", project.image?.alt, "imageAlt"));

            const upload = document.createElement("div");
            upload.className = "admin-upload";
            upload.dataset.index = String(index);
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "image/*";
            fileInput.dataset.index = String(index);
            const uploadBody = document.createElement("div");
            uploadBody.className = "admin-upload-body";
            uploadBody.innerHTML = "<strong>Drop project image</strong><span>or click to upload</span>";
            upload.append(fileInput, uploadBody);
            item.append(upload);

            const actions = document.createElement("div");
            actions.className = "admin-list-actions";
            actions.append(
                createActionButton("Up", "move-up"),
                createActionButton("Down", "move-down"),
                createActionButton("Remove", "remove")
            );
            item.append(actions);
            projectsListWrap.append(item);
        });
    };

    const renderExperienceMetrics = () => {
        if (!experienceMetricsWrap) return;
        experienceMetricsWrap.innerHTML = "";
        adminState.experience.metrics.forEach((metric, index) => {
            const item = document.createElement("div");
            item.className = "admin-list-item";
            item.dataset.index = String(index);
            item.append(createField("Label", metric.label, "label"));
            item.append(createField("Value", metric.value, "value"));
            const desc = createField("Description", metric.description, "description", "textarea");
            desc.querySelector("textarea").rows = 2;
            item.append(desc);
            const actions = document.createElement("div");
            actions.className = "admin-list-actions";
            actions.append(
                createActionButton("Up", "move-up"),
                createActionButton("Down", "move-down"),
                createActionButton("Remove", "remove")
            );
            item.append(actions);
            experienceMetricsWrap.append(item);
        });
    };

    const renderExperienceList = () => {
        if (!experienceListWrap) return;
        experienceListWrap.innerHTML = "";
        adminState.experience.items.forEach((itemState, index) => {
            const item = document.createElement("div");
            item.className = "admin-list-item";
            item.dataset.index = String(index);
            item.append(createField("Role", itemState.role, "role"));
            item.append(createField("Organization", itemState.org, "org"));
            item.append(createField("Period Label", itemState.period, "period"));
            const summary = createField("Summary", itemState.summary, "summary", "textarea");
            summary.querySelector("textarea").rows = 2;
            item.append(summary);
            const points = createField("Key Points (one per line)", formatList(itemState.points, "lines"), "points", "textarea");
            points.querySelector("textarea").rows = 3;
            item.append(points);
            item.append(createField("Tags (comma separated)", formatList(itemState.tags, "comma"), "tags"));
            const actions = document.createElement("div");
            actions.className = "admin-list-actions";
            actions.append(
                createActionButton("Up", "move-up"),
                createActionButton("Down", "move-down"),
                createActionButton("Remove", "remove")
            );
            item.append(actions);
            experienceListWrap.append(item);
        });
    };

    const renderDynamicLists = () => {
        renderAboutMetrics();
        renderSkillsGroups();
        renderProjectsList();
        renderExperienceMetrics();
        renderExperienceList();
    };

    renderDynamicLists();

    const handleListInput = (event, getList, updater, applyFn) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
        const container = target.closest(".admin-list-item");
        if (!container) return;
        const index = Number(container.dataset.index);
        const field = target.dataset.field;
        const list = getList();
        if (!field || !list[index]) return;
        updater(list[index], field, target.value);
        applyFn();
        scheduleSave();
        schedulePreview();
    };

    const handleListActions = (event, getList, render, applyFn) => {
        const button = event.target.closest("button[data-action]");
        if (!button) return;
        const container = button.closest(".admin-list-item");
        if (!container) return;
        const index = Number(container.dataset.index);
        if (Number.isNaN(index)) return;
        const list = getList();
        const action = button.dataset.action;
        if (action === "remove") {
            list.splice(index, 1);
        } else if (action === "move-up" && index > 0) {
            const item = list.splice(index, 1)[0];
            list.splice(index - 1, 0, item);
        } else if (action === "move-down" && index < list.length - 1) {
            const item = list.splice(index, 1)[0];
            list.splice(index + 1, 0, item);
        }
        render();
        applyFn();
        scheduleSave();
        schedulePreview();
    };

    if (aboutMetricsWrap) {
        aboutMetricsWrap.addEventListener("input", (event) => {
            handleListInput(
                event,
                () => adminState.about.metrics,
                (metric, field, value) => {
                    metric[field] = value;
                },
                () => applyAboutState(adminState.about)
            );
        });
        aboutMetricsWrap.addEventListener("click", (event) => {
            handleListActions(event, () => adminState.about.metrics, renderAboutMetrics, () =>
                applyAboutState(adminState.about)
            );
        });
    }

    if (skillsGroupsWrap) {
        skillsGroupsWrap.addEventListener("input", (event) => {
            handleListInput(
                event,
                () => adminState.skills.groups,
                (group, field, value) => {
                    if (field === "items") {
                        group.items = parseList(value, "lines");
                        return;
                    }
                    group[field] = value;
                },
                () => applySkillsState(adminState.skills)
            );
        });
        skillsGroupsWrap.addEventListener("click", (event) => {
            handleListActions(event, () => adminState.skills.groups, renderSkillsGroups, () =>
                applySkillsState(adminState.skills)
            );
        });
    }

    if (projectsListWrap) {
        projectsListWrap.addEventListener("input", (event) => {
            handleListInput(
                event,
                () => adminState.projects,
                (project, field, value) => {
                    project.image = project.image || { src: "", alt: "" };
                    if (field === "categories") {
                        project.categories = parseList(value, "comma").map((item) => item.toLowerCase());
                    }
                    else if (field === "meta") project.meta = parseList(value, "comma");
                    else if (field === "highlights") project.highlights = parseList(value, "lines");
                    else if (field === "tech") project.tech = parseList(value, "comma");
                    else if (field === "imageSrc") project.image.src = value;
                    else if (field === "imageAlt") project.image.alt = value;
                    else project[field] = value;
                },
                () => applyProjectsState(adminState.projectsSection, adminState.projects)
            );
        });
        projectsListWrap.addEventListener("click", (event) => {
            handleListActions(event, () => adminState.projects, renderProjectsList, () =>
                applyProjectsState(adminState.projectsSection, adminState.projects)
            );
        });

        const handleUpload = (index, file) => {
            if (!file || !adminState.projects[index]) return;
            const reader = new FileReader();
            reader.onload = () => {
                adminState.projects[index].image = adminState.projects[index].image || { src: "", alt: "" };
                adminState.projects[index].image.src = String(reader.result || "");
                applyProjectsState(adminState.projectsSection, adminState.projects);
                renderProjectsList();
                scheduleSave();
                schedulePreview();
            };
            reader.readAsDataURL(file);
        };

        projectsListWrap.addEventListener("change", (event) => {
            const input = event.target;
            if (!(input instanceof HTMLInputElement) || input.type !== "file") return;
            const index = Number(input.dataset.index);
            const file = input.files?.[0];
            handleUpload(index, file);
        });

        projectsListWrap.addEventListener("dragover", (event) => {
            const upload = event.target.closest(".admin-upload");
            if (!upload) return;
            event.preventDefault();
            upload.classList.add("is-dragover");
        });

        projectsListWrap.addEventListener("dragleave", (event) => {
            const upload = event.target.closest(".admin-upload");
            if (!upload) return;
            upload.classList.remove("is-dragover");
        });

        projectsListWrap.addEventListener("drop", (event) => {
            const upload = event.target.closest(".admin-upload");
            if (!upload) return;
            event.preventDefault();
            upload.classList.remove("is-dragover");
            const index = Number(upload.dataset.index);
            const file = event.dataTransfer?.files?.[0];
            handleUpload(index, file);
        });
    }

    if (experienceMetricsWrap) {
        experienceMetricsWrap.addEventListener("input", (event) => {
            handleListInput(
                event,
                () => adminState.experience.metrics,
                (metric, field, value) => {
                    metric[field] = value;
                },
                () => applyExperienceState(adminState.experience)
            );
        });
        experienceMetricsWrap.addEventListener("click", (event) => {
            handleListActions(event, () => adminState.experience.metrics, renderExperienceMetrics, () =>
                applyExperienceState(adminState.experience)
            );
        });
    }

    if (experienceListWrap) {
        experienceListWrap.addEventListener("input", (event) => {
            handleListInput(
                event,
                () => adminState.experience.items,
                (item, field, value) => {
                    if (field === "points") item.points = parseList(value, "lines");
                    else if (field === "tags") item.tags = parseList(value, "comma");
                    else item[field] = value;
                },
                () => applyExperienceState(adminState.experience)
            );
        });
        experienceListWrap.addEventListener("click", (event) => {
            handleListActions(event, () => adminState.experience.items, renderExperienceList, () =>
                applyExperienceState(adminState.experience)
            );
        });
    }

    dashboard.addEventListener("click", (event) => {
        const actionButton = event.target.closest("button[data-action]");
        if (!actionButton) return;
        const action = actionButton.dataset.action;
        if (!action || !action.startsWith("add-")) return;
        if (action === "add-about-metric") {
            adminState.about.metrics.push({ value: "1", label: "New highlight" });
            renderAboutMetrics();
            applyAboutState(adminState.about);
        }
        if (action === "add-skill-group") {
            adminState.skills.groups.push({ title: "New Group", label: "Level", items: ["Skill A"] });
            renderSkillsGroups();
            applySkillsState(adminState.skills);
        }
        if (action === "add-project") {
            adminState.projects.push({
                id: `project-${adminState.projects.length + 1}`,
                title: "New Project",
                categories: ["ai"],
                meta: ["Category", "Scope"],
                description: "Add a short description.",
                highlights: ["Highlight one"],
                tech: ["Tech"],
                image: { src: "", alt: "Project image" },
                githubUrl: "",
                shareUrl: "",
                shareTitle: "New Project"
            });
            renderProjectsList();
            applyProjectsState(adminState.projectsSection, adminState.projects);
        }
        if (action === "add-experience-metric") {
            adminState.experience.metrics.push({ label: "New", value: "0", description: "Metric description" });
            renderExperienceMetrics();
            applyExperienceState(adminState.experience);
        }
        if (action === "add-experience-item") {
            adminState.experience.items.push({
                role: "New Role",
                org: "Organization",
                period: "Period",
                summary: "Summary text.",
                points: ["Key achievement"],
                tags: ["Tag"]
            });
            renderExperienceList();
            applyExperienceState(adminState.experience);
        }
        scheduleSave();
        schedulePreview();
    });



    launch.addEventListener("click", () => {
        if (isAuthenticated) {
            showAdminDashboard();
            return;
        }
        showLoginGate();
    });
    dashboard.querySelectorAll("[data-admin-close]").forEach((element) => {
        element.addEventListener("click", closeAdmin);
    });
    const closeBtn = document.getElementById("admin-close");
    if (closeBtn) closeBtn.addEventListener("click", closeAdmin);

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        if (!document.body.classList.contains("admin-open") || document.body.classList.contains("admin-only")) return;
        closeAdmin();
    });

    const sectionInfo = {
        hero: {
            title: "Hero Section",
            desc: "Update headline, role loop, avatar, and CTA copy."
        },
        about: {
            title: "About Section",
            desc: "Edit your mission statement, location, and highlights."
        },
        skills: {
            title: "Skills",
            desc: "Manage the skill architecture, metrics, and focus note."
        },
        projects: {
            title: "Projects",
            desc: "Add, edit, reorder, and publish project cards."
        },
        experience: {
            title: "Experience",
            desc: "Maintain roles, accomplishments, and impact metrics."
        },
        contact: {
            title: "Contact Info",
            desc: "Refresh CTAs, availability, and contact details."
        },
        social: {
            title: "Social Links",
            desc: "Keep GitHub, LinkedIn, and email links updated."
        },
        messages: {
            title: "Messages",
            desc: "View and manage contact form submissions from Firestore."
        }
    };

    const navLinks = Array.from(document.querySelectorAll(".admin-nav-link"));
    const sections = Array.from(document.querySelectorAll(".admin-section"));
    const sectionTitle = document.getElementById("admin-section-title");
    const sectionDesc = document.getElementById("admin-section-desc");

    let messagesPollId = null;
    const stopMessagesPolling = () => {
        if (messagesPollId) {
            clearInterval(messagesPollId);
            messagesPollId = null;
        }
    };
    const startMessagesPolling = () => {
        if (messagesPollId) return;
        messagesPollId = setInterval(() => {
            loadAdminMessages(true);   // silent — don't flash "Loading…"
        }, 15000);
    };

    const setActiveSection = (sectionId) => {
        navLinks.forEach((link) => {
            const isActive = link.dataset.section === sectionId;
            link.classList.toggle("is-active", isActive);
            const parentLi = link.closest("li");
            if (parentLi) {
                parentLi.classList.toggle("is-active-item", isActive);
            }
        });
        sections.forEach((section) => {
            section.classList.toggle("is-active", section.dataset.section === sectionId);
        });
        const info = sectionInfo[sectionId];
        if (info && sectionTitle) sectionTitle.textContent = info.title;
        if (info && sectionDesc) sectionDesc.textContent = info.desc;

        if (sectionId === "messages") {
            loadAdminMessages();
            startMessagesPolling();
        } else {
            stopMessagesPolling();
        }
    };

    // ── Messages Inbox ────────────────────────────────────
    const loadAdminMessages = async (silent = false) => {
        const container = document.getElementById("admin-messages-list");
        if (!container) return;
        if (!window.FirebaseAdminAPI) {
            if (!silent) container.innerHTML = '<p style="color:#F44336;font-size:0.9rem;padding:16px 0;">Firebase not ready. Please try again.</p>';
            return;
        }
        if (!silent) container.innerHTML = '<p style="color:var(--text-soft,#888);font-size:0.9rem;padding:16px 0;">Loading…</p>';
        try {
            const messages = await window.FirebaseAdminAPI.listMessages();
            const sortedMessages = messages.slice().sort((a, b) => {
                const aTime = Date.parse(a.createdAt || "") || 0;
                const bTime = Date.parse(b.createdAt || "") || 0;
                return bTime - aTime;
            });
            if (!sortedMessages.length) {
                container.innerHTML = '<p style="color:var(--text-soft,#888);font-size:0.9rem;padding:16px 0;">No messages yet.</p>';
                return;
            }

            const fragment = document.createDocumentFragment();
            sortedMessages.forEach((msg) => {
                const card = document.createElement("div");
                card.className = "admin-message-card";
                card.dataset.id = msg._id || "";

                const meta = document.createElement("div");
                meta.className = "admin-message-meta";

                const nameEl = document.createElement("strong");
                nameEl.className = "admin-message-name";
                nameEl.textContent = msg.name || "Unknown";

                const emailEl = document.createElement("span");
                emailEl.className = "admin-message-email";
                emailEl.textContent = msg.email || "";

                meta.append(nameEl, emailEl);

                if (msg.projectType) {
                    const tagEl = document.createElement("span");
                    tagEl.className = "admin-message-tag";
                    tagEl.textContent = msg.projectType;
                    meta.append(tagEl);
                }

                const timeEl = document.createElement("time");
                timeEl.className = "admin-message-time";
                timeEl.textContent = msg.createdAt ? new Date(msg.createdAt).toLocaleString() : "";
                meta.append(timeEl);

                const bodyEl = document.createElement("p");
                bodyEl.className = "admin-message-body";
                bodyEl.textContent = msg.message || "";

                const deleteBtn = document.createElement("button");
                deleteBtn.className = "admin-btn admin-btn-danger admin-message-delete";
                deleteBtn.type = "button";
                deleteBtn.dataset.id = msg._id || "";
                deleteBtn.textContent = "Delete";

                card.append(meta, bodyEl);
                if (isAuthenticated) card.append(deleteBtn);
                fragment.append(card);
            });

            container.innerHTML = "";
            container.append(fragment);
        } catch (err) {
            container.innerHTML = `<p style="color:#F44336;font-size:0.9rem;padding:16px 0;">Error: ${err.message}</p>`;
        }
    };

    const messagesContainer = document.getElementById("admin-messages-list");
    if (messagesContainer) {
        messagesContainer.addEventListener("click", async (e) => {
            if (!isAuthenticated) return;
            const btn = e.target.closest(".admin-message-delete");
            if (!btn) return;
            const docId = btn.getAttribute("data-id");
            if (!docId) return;
            btn.disabled = true;
            btn.textContent = "Deleting…";
            try {
                await window.FirebaseAdminAPI.deleteMessage(docId);
                const card = btn.closest(".admin-message-card");
                if (card) card.remove();
                const remaining = messagesContainer.querySelectorAll(".admin-message-card");
                if (!remaining.length) {
                    messagesContainer.innerHTML = '<p style="color:var(--text-soft,#888);font-size:0.9rem;padding:16px 0;">No messages yet.</p>';
                }
            } catch (err) {
                btn.disabled = false;
                btn.textContent = "Delete";
                console.error("Delete message failed:", err);
            }
        });
    }

    const messagesRefreshBtn = document.getElementById("admin-messages-refresh");
    if (messagesRefreshBtn) messagesRefreshBtn.addEventListener("click", loadAdminMessages);
    // ─────────────────────────────────────────────────────

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            const sectionId = link.dataset.section;
            if (sectionId) setActiveSection(sectionId);
        });
    });

    const initialSection =
        navLinks.find((link) => link.classList.contains("is-active"))?.dataset.section || "hero";
    setActiveSection(initialSection);

    const saveButton = document.getElementById("admin-save");
    if (saveButton) saveButton.addEventListener("click", persistState);

    // Global keyboard shortcut: Ctrl+S / Cmd+S to save admin state
    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
            e.preventDefault();
            const btn = document.getElementById("admin-save") || document.getElementById("save-admin-btn");
            if (btn) btn.click();
        }
    });
    const resetButton = document.getElementById("admin-reset");
    if (resetButton) {
        resetButton.addEventListener("click", () => {
            adminState = normalizeAdminState(deepClone(savedAdminState));
            applyAdminState(adminState);
            renderDynamicLists();
            syncInputValues();
            applySavedStateStatus();
            schedulePreview();
        });
    }

    const previewRefresh = document.getElementById("admin-preview-refresh");
    if (previewRefresh) previewRefresh.addEventListener("click", schedulePreview);

    const adminThemeToggle = document.getElementById("admin-theme-toggle");
    const applyAdminTheme = (theme) => {
        dashboard.dataset.theme = theme;
        if (adminThemeToggle) adminThemeToggle.textContent = theme === "light" ? "Dark Mode" : "Light Mode";
        try {
            window.localStorage.setItem(ADMIN_THEME_KEY, theme);
        } catch (_error) {
            // Ignore theme persistence failures.
        }
    };
    let savedTheme = "dark";
    try {
        const stored = window.localStorage.getItem(ADMIN_THEME_KEY);
        if (stored) savedTheme = stored;
    } catch (_error) {
        savedTheme = "dark";
    }
    applyAdminTheme(savedTheme);
    if (adminThemeToggle) {
        adminThemeToggle.addEventListener("click", () => {
            const nextTheme = dashboard.dataset.theme === "light" ? "dark" : "light";
            applyAdminTheme(nextTheme);
        });
    }

    const avatarUpload = document.getElementById("admin-hero-avatar-file");
    if (avatarUpload) {
        avatarUpload.addEventListener("change", () => {
            const file = avatarUpload.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                adminState.hero.avatar.src = String(reader.result || "");
                applyHeroState(adminState.hero);
                const avatarUrlInput = document.getElementById("admin-hero-avatar");
                if (avatarUrlInput) avatarUrlInput.value = adminState.hero.avatar.src;
                scheduleSave();
                schedulePreview();
            };
            reader.readAsDataURL(file);
        });
    }

    const avatarUploadWrap = document.querySelector('[data-upload="hero-avatar"]');
    if (avatarUploadWrap) {
        avatarUploadWrap.addEventListener("dragover", (event) => {
            event.preventDefault();
            avatarUploadWrap.classList.add("is-dragover");
        });
        avatarUploadWrap.addEventListener("dragleave", () => {
            avatarUploadWrap.classList.remove("is-dragover");
        });
        avatarUploadWrap.addEventListener("drop", (event) => {
            event.preventDefault();
            avatarUploadWrap.classList.remove("is-dragover");
            const file = event.dataTransfer?.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                adminState.hero.avatar.src = String(reader.result || "");
                applyHeroState(adminState.hero);
                const avatarUrlInput = document.getElementById("admin-hero-avatar");
                if (avatarUrlInput) avatarUrlInput.value = adminState.hero.avatar.src;
                scheduleSave();
                schedulePreview();
            };
            reader.readAsDataURL(file);
        });
    }

    // Setup remote portfolio sync for admin — waits for firebase-ready if needed
    const setupAdminPortfolioSync = () => {
        if (!window.FirebaseAdminAPI) return;
        window.FirebaseAdminAPI.onPortfolioUpdate((remoteData) => {
            if (remoteData && Object.keys(remoteData).length > 0) {
                const merged = normalizeAdminState(deepMerge(adminState, remoteData));
                const statusEl = document.getElementById("admin-save-status");
                // Only skip remote updates if the user is actively typing (dirty + saveTimeout pending)
                const isActivelyEditing = statusEl?.classList.contains("is-dirty") && saveTimeout;
                if (!isActivelyEditing) {
                    adminState = merged;
                    applyAdminState(adminState);
                    renderDynamicLists();
                    syncInputValues();
                    refreshScrollReveal();
                }
            }
        });
    };

    if (window.FirebaseAdminAPI || window.__firebaseReady) {
        setupAdminPortfolioSync();
    } else {
        window.addEventListener("firebase-ready", setupAdminPortfolioSync, { once: true });
    }

    function syncInputValues() {
        bindings.forEach((binding) => {
            const inputs = pathRegistry.get(binding.path) || [];
            const value = getValueByPath(binding.path);
            inputs.forEach((input) => {
                input.value = binding.toInput ? binding.toInput(value) : value || "";
            });
        });
    }

    window.addEventListener("resize", updatePreviewScale);
};