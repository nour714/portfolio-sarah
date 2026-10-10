// ============================================================
//  Firebase Integration — Auth (SDK) + Firestore (REST API)
//  --------------------------------------------------------
//  Authentication uses Firebase Auth SDK (most reliable).
//  Firestore uses REST for primary read/write operations,
//  with a small SDK fallback for listing when REST returns empty.
// ============================================================

import { initializeApp }              from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence }
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    serverTimestamp,
    doc,
    deleteDoc,
    getDoc as getDocSdk,
    setDoc as setDocSdk
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ─── Firebase project config ───────────────────────────────
const firebaseConfig = {
    apiKey:            "AIzaSyA2Y3RuOABffeNJmWfg_uBGqF3chsaTwfQ",
    authDomain:        "portfolio-9a88b.firebaseapp.com",
    projectId:         "portfolio-9a88b",
    storageBucket:     "portfolio-9a88b.firebasestorage.app",
    messagingSenderId: "487955506048",
    appId:             "1:487955506048:web:840dacaea379c2cbfd9765",
    measurementId:     "G-MJHL21W2R8"
};

// ─── Firestore REST base URL ─────────────────────────────
const FIRESTORE_DB_ID = "default";
const FIRESTORE_FALLBACK_DB_ID = "(default)";
const FIRESTORE_BASE =
    `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${FIRESTORE_DB_ID}/documents`;
const FIRESTORE_API_KEY = firebaseConfig.apiKey;
// ─── Initialize Firebase (Auth only) ─────────────────────
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app, FIRESTORE_DB_ID);   // "default" named database
setPersistence(auth, browserLocalPersistence).catch(() => {});

// ──────────────────────────────────────────────────────────
//  Helper: get current user's ID token (for authenticated
//  REST calls).  Returns null if not signed in.
// ──────────────────────────────────────────────────────────
async function getIdToken() {
    const user = auth.currentUser;
    if (!user) return null;
    try {
        return await user.getIdToken();
    } catch {
        return null;
    }
}

// ──────────────────────────────────────────────────────────
//  Convert a plain JS value to Firestore REST "Value" format
//  https://firebase.google.com/docs/firestore/reference/rest/v1/Value
// ──────────────────────────────────────────────────────────
function toFirestoreValue(value) {
    if (value === null || value === undefined) {
        return { nullValue: null };
    }
    if (typeof value === "boolean") {
        return { booleanValue: value };
    }
    if (typeof value === "number") {
        return Number.isInteger(value)
            ? { integerValue: String(value) }
            : { doubleValue: value };
    }
    if (typeof value === "string") {
        return { stringValue: value };
    }
    if (Array.isArray(value)) {
        return { arrayValue: { values: value.map(toFirestoreValue) } };
    }
    if (typeof value === "object") {
        const fields = {};
        for (const [k, v] of Object.entries(value)) {
            fields[k] = toFirestoreValue(v);
        }
        return { mapValue: { fields } };
    }
    return { stringValue: String(value) };
}

// ──────────────────────────────────────────────────────────
//  Convert a Firestore REST "Value" back to plain JS
// ──────────────────────────────────────────────────────────
function fromFirestoreValue(firestoreValue) {
    if (!firestoreValue) return null;

    if ("nullValue"    in firestoreValue) return null;
    if ("booleanValue" in firestoreValue) return firestoreValue.booleanValue;
    if ("integerValue" in firestoreValue) return parseInt(firestoreValue.integerValue, 10);
    if ("doubleValue"  in firestoreValue) return firestoreValue.doubleValue;
    if ("stringValue"  in firestoreValue) return firestoreValue.stringValue;
    if ("bytesValue"   in firestoreValue) return firestoreValue.bytesValue;
    if ("timestampValue" in firestoreValue) return firestoreValue.timestampValue;
    if ("referenceValue" in firestoreValue) return firestoreValue.referenceValue;
    if ("geoPointValue" in firestoreValue) return firestoreValue.geoPointValue;

    if ("arrayValue" in firestoreValue) {
        const values = firestoreValue.arrayValue.values || [];
        return values.map(fromFirestoreValue);
    }

    if ("mapValue" in firestoreValue) {
        const fields = firestoreValue.mapValue.fields || {};
        const result = {};
        for (const [k, v] of Object.entries(fields)) {
            result[k] = fromFirestoreValue(v);
        }
        return result;
    }

    return null;
}

// ──────────────────────────────────────────────────────────
//  Convert a plain JS object to a Firestore REST document
//  (i.e. wrap every field value with toFirestoreValue)
// ──────────────────────────────────────────────────────────
function objectToFirestoreDoc(obj) {
    const fields = {};
    for (const [k, v] of Object.entries(obj)) {
        fields[k] = toFirestoreValue(v);
    }
    return { fields };
}

// ──────────────────────────────────────────────────────────
//  Convert a Firestore REST document back to a plain JS obj
// ──────────────────────────────────────────────────────────
function firestoreDocToObject(doc) {
    if (!doc || !doc.fields) return {};
    const obj = {};
    for (const [k, v] of Object.entries(doc.fields)) {
        obj[k] = fromFirestoreValue(v);
    }
    return obj;
}

// Save contact message — prefers SDK (serverTimestamp), falls back to REST.
async function saveContactMessage(message) {
    try {
        await firestorePost("messages", message);
        return;
    } catch (restErr) {
        console.warn("[Firebase REST] Message save failed, falling back to SDK.", restErr);
    }

    await addDoc(collection(db, "messages"), {
        ...message,
        createdAt: serverTimestamp()
    });
}

async function savePortfolioDataSdk(data) {
    await setDocSdk(doc(db, "portfolio", "content"), data, { merge: true });
}

async function loadPortfolioDataSdk() {
    const snapshot = await getDocSdk(doc(db, "portfolio", "content"));
    return snapshot.exists() ? snapshot.data() : null;
}

// ──────────────────────────────────────────────────────────
// Build Firestore REST URL (adds API key)
function buildFirestoreUrl(path, queryParams = null, includeApiKey = true) {
    const safePath = String(path || "").replace(/^\/+/, "");
    const url = new URL(`${FIRESTORE_BASE}/${safePath}`);

    if (includeApiKey && FIRESTORE_API_KEY) {
        url.searchParams.set("key", FIRESTORE_API_KEY);
    }

    if (queryParams && typeof queryParams === "object") {
        for (const [k, v] of Object.entries(queryParams)) {
            if (v === undefined || v === null || v === "") continue;
            url.searchParams.set(k, String(v));
        }
    }

    return url.toString();
}

// Retry with fallback database id when primary returns 403/404.
async function firestoreFetchWithFallback(url, options) {
    let response = await fetch(url, options);
    if (
        !response.ok &&
        (response.status === 403 || response.status === 404) &&
        FIRESTORE_FALLBACK_DB_ID &&
        url.includes(`/databases/${FIRESTORE_DB_ID}/`)
    ) {
        const fallbackUrl = url.replace(
            `/databases/${FIRESTORE_DB_ID}/`,
            `/databases/${FIRESTORE_FALLBACK_DB_ID}/`
        );
        response = await fetch(fallbackUrl, options);
    }
    return response;
}

// Fallback: list collection via Firestore SDK (uses Firebase Auth)
async function firestoreListSdk(collectionPath) {
    const snap = await getDocs(collection(db, collectionPath));
    return snap.docs.map((doc) => ({
        _id: doc.id,
        ...(() => {
            const data = doc.data();
            if (data?.createdAt && typeof data.createdAt.toDate === "function") {
                data.createdAt = data.createdAt.toDate().toISOString();
            }
            return data;
        })()
    }));
}

async function firestoreDeleteSdk(collectionPath, docId) {
    await deleteDoc(doc(db, collectionPath, docId));
}


//  Core REST helpers
// ──────────────────────────────────────────────────────────

/**
 * GET a Firestore document via REST API
 * @param {string} path  - e.g. "portfolio/content"
 * @param {string} token - Firebase ID token (optional for public docs)
 */
async function firestoreGet(path, token = null) {
    const url = buildFirestoreUrl(path, null, !token);
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await firestoreFetchWithFallback(url, { method: "GET", headers });
    if (response.status === 404) return null;
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(`Firestore GET failed [${response.status}]: ${err.error?.message || response.statusText}`);
    }
    return response.json();
}

/**
 * LIST all documents in a Firestore collection via REST API
 * @param {string} collectionPath - e.g. "messages"
 * @param {string} token          - Firebase ID token (required for protected collections)
 * @returns {Array}               - array of plain JS objects with an extra `_id` field
 */
async function firestoreList(collectionPath, token = null) {
    const url = buildFirestoreUrl(collectionPath, { pageSize: 200 }, !token);
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await firestoreFetchWithFallback(url, { method: "GET", headers, cache: "no-store" });
    if (!response.ok) {
        // If REST fails (403/404), try SDK fallback before returning/throwing.
        try {
            return await firestoreListSdk(collectionPath);
        } catch (sdkErr) {
            if (response.status === 404) return [];
            const err = await response.json().catch(() => ({}));
            throw new Error(`Firestore LIST failed [${response.status}]: ${err.error?.message || response.statusText}`);
        }
    }
    let json = await response.json();
    let docs = json.documents || [];

    // If primary db returns empty, optionally merge fallback db results.
    let altDocs = [];
    if (!docs.length && FIRESTORE_FALLBACK_DB_ID && url.includes(`/databases/${FIRESTORE_DB_ID}/`)) {
        const altUrl = url.replace(
            `/databases/${FIRESTORE_DB_ID}/`,
            `/databases/${FIRESTORE_FALLBACK_DB_ID}/`
        );
        const altResponse = await fetch(altUrl, { method: "GET", headers, cache: "no-store" });
        if (altResponse.ok) {
            const altJson = await altResponse.json();
            altDocs = altJson.documents || [];
        }
    }

    let mergedDocs = docs.concat(altDocs);

    // If REST still returns empty, fall back to Firestore SDK (same auth).
    if (!mergedDocs.length) {
        try {
            return await firestoreListSdk(collectionPath);
        } catch (err) {
            console.warn("[Firebase SDK] list failed:", err);
        }
    }

    const seen = new Set();
    return mergedDocs.reduce((acc, doc) => {
        const id = doc.name ? doc.name.split("/").pop() : null;
        if (id && seen.has(id)) return acc;
        if (id) seen.add(id);
        const obj = firestoreDocToObject(doc);
        obj._id = id;
        acc.push(obj);
        return acc;
    }, []);
}

/**
 * PATCH (upsert) a Firestore document via REST API
 * @param {string} path   - e.g. "portfolio/content"
 * @param {object} fields - plain JS object (will be converted)
 * @param {string} token  - Firebase ID token
 */
async function firestorePatch(path, fields, token) {
    const url = buildFirestoreUrl(path, null, !token);
    const headers = {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${token}`
    };
    const body = JSON.stringify(objectToFirestoreDoc(fields));

    const response = await firestoreFetchWithFallback(url, { method: "PATCH", headers, body });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(`Firestore PATCH failed [${response.status}]: ${err.error?.message || response.statusText}`);
    }
    return response.json();
}

/**
 * POST a new document to a Firestore collection via REST API
 * (auto-generates document ID)
 * @param {string} collectionPath - e.g. "messages"
 * @param {object} fields         - plain JS object
 * @param {string} token          - Firebase ID token (optional)
 */
async function firestorePost(collectionPath, fields, token = null) {
    const url = buildFirestoreUrl(collectionPath, null, !token);
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const body = JSON.stringify(objectToFirestoreDoc(fields));

    const response = await firestoreFetchWithFallback(url, { method: "POST", headers, body });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(`Firestore POST failed [${response.status}]: ${err.error?.message || response.statusText}`);
    }
    return response.json();
}

/**
 * DELETE a Firestore document via REST API
 * @param {string} path  - e.g. "messages/abc123"
 * @param {string} token - Firebase ID token (required)
 */
async function firestoreDelete(path, token) {
    const url = buildFirestoreUrl(path, null, !token);
    const headers = {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${token}`
    };

    const response = await firestoreFetchWithFallback(url, { method: "DELETE", headers });
    if (response.status === 404) return;   // already deleted — treat as success
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(`Firestore DELETE failed [${response.status}]: ${err.error?.message || response.statusText}`);
    }
}

// ──────────────────────────────────────────────────────────
//  Admin REST API — exported on window
// ──────────────────────────────────────────────────────────
window.FirebaseAdminAPI = {

    // ── Auth ─────────────────────────────────────────────
    login: (email, password) =>
        signInWithEmailAndPassword(auth, email, password),

    logout: () => signOut(auth),

    onAuthStateChanged: (callback) =>
        onAuthStateChanged(auth, callback),

    // ── Portfolio data (Firestore REST) ──────────────────

    /**
     * Save the full portfolio content object to Firestore
     * via REST PATCH request.  Requires user to be signed in.
     */
    savePortfolioData: async (data) => {
        const token = await getIdToken();
        if (!token) throw new Error("Not authenticated — cannot save data.");

        console.info("[Firebase REST] PATCH portfolio/content …");
        try {
            await firestorePatch("portfolio/content", data, token);
        } catch (restError) {
            console.warn("[Firebase REST] Save failed, falling back to SDK.", restError);
            await savePortfolioDataSdk(data);
        }

        console.info("[Firebase REST] ✅ portfolio/content saved successfully.");
    },

    /**
     * Load portfolio content from Firestore via REST GET request.
     * Returns plain JS object or null if not found.
     */
    loadPortfolioData: async () => {
        const token = await getIdToken();           // optional auth for public reads
        console.info("[Firebase REST] GET portfolio/content …");

        try {
            const doc = await firestoreGet("portfolio/content", token);
            if (!doc) {
                console.info("[Firebase REST] portfolio/content — document not found.");
                return null;
            }

            const data = firestoreDocToObject(doc);
            console.info("[Firebase REST] ✅ portfolio/content loaded successfully.");
            return data;
        } catch (restError) {
            console.warn("[Firebase REST] Load failed, falling back to SDK.", restError);
            const data = await loadPortfolioDataSdk();
            if (!data) {
                console.info("[Firebase SDK] portfolio/content — document not found.");
                return null;
            }
            console.info("[Firebase SDK] ✅ portfolio/content loaded successfully.");
            return data;
        }
    },

    /**
     * Subscribe to real-time updates is not natively supported
     * by the REST API (it requires WebSocket / SSE).
     * We fall back to polling every 30 s when SDK is unavailable.
     *
     * Returns an unsubscribe function for API compatibility.
     */
    onPortfolioUpdate: (callback) => {
        let stopped = false;

        const poll = async () => {
            if (stopped) return;
            try {
                const data = await window.FirebaseAdminAPI.loadPortfolioData();
                if (data) callback(data);
            } catch (err) {
                console.warn("[Firebase REST] polling error:", err);
            }
            if (!stopped) setTimeout(poll, 30_000);
        };

        poll();

        return () => { stopped = true; };
    },

    // ── Messages (admin only) ────────────────────────────

    /**
     * Fetch all contact-form submissions from Firestore.
     * Requires an authenticated user when Firestore rules protect reads.
     * @returns {Array} array of message objects, each with an `_id` field
     */
    listMessages: async () => {
        const token = await getIdToken();

        console.info("[Firebase] GET messages …");
        const messages = await firestoreList("messages", token);
        console.info(`[Firebase] ✅ ${messages.length} message(s) loaded.`);
        return messages;
    },

    /**
     * Delete a single contact-form submission by its document ID.
     * Requires the user to be signed in.
     * @param {string} docId - Firestore document ID
     */
    deleteMessage: async (docId) => {
        if (!docId) throw new Error("deleteMessage: docId is required.");
        const token = await getIdToken();
        if (!token) throw new Error("Not authenticated — cannot delete message.");

        console.info(`[Firebase] DELETE messages/${docId} …`);
        try {
            await firestoreDeleteSdk("messages", docId);
        } catch (sdkErr) {
            console.warn("[Firebase SDK] delete failed, falling back to REST.", sdkErr);
            await firestoreDelete(`messages/${docId}`, token);
        }
        console.info(`[Firebase] ✅ Message ${docId} deleted.`);
    }
};

// ──────────────────────────────────────────────────────────
//  Notify script.js that Firebase is ready
// ──────────────────────────────────────────────────────────
window.__firebaseReady = true;
window.dispatchEvent(new CustomEvent("firebase-ready"));

// ──────────────────────────────────────────────────────────
//  Contact Form — save submission via REST POST
// ──────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contact-form");
    const submitBtn   = contactForm?.querySelector("button[type='submit']");
    const statusNote  = document.getElementById("contact-status-note");

    if (!contactForm || !submitBtn || !statusNote) return;

    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const message = {
            name:        formData.get("name")         || "",
            email:       formData.get("email")        || "",
            projectType: formData.get("project_type") || "",
            message:     formData.get("message")      || "",
            createdAt:   new Date().toISOString()      // REST doesn't support serverTimestamp inline
        };

        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Sending…";
        submitBtn.disabled    = true;
        submitBtn.style.opacity  = "0.7";
        submitBtn.style.cursor   = "not-allowed";

        try {
            console.info("[Firebase] POST messages …");
            await saveContactMessage(message);
            console.info("[Firebase] ✅ Message saved.");

            statusNote.textContent = "✅ Message sent successfully! I'll reply soon.";
            statusNote.style.color = "#4CAF50";
            contactForm.reset();
        } catch (error) {
            console.error("[Firebase REST] Error saving message:", error);
            statusNote.textContent = "❌ Failed to send. Please email me directly.";
            statusNote.style.color = "#F44336";
        } finally {
            submitBtn.textContent    = originalText;
            submitBtn.disabled       = false;
            submitBtn.style.opacity  = "1";
            submitBtn.style.cursor   = "pointer";

            // Reset status message after 6 seconds
            setTimeout(() => {
                statusNote.textContent = "Your message will be sent securely to my inbox.";
                statusNote.style.color = "var(--text-soft, inherit)";
            }, 6000);
        }
    });
});
