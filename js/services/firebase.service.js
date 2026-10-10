/**
 * Firebase Integration Service
 * Clean Architecture - Infrastructure / Data Access Layer
 */

import { deepClone, deepMerge, extractAdminState, normalizeAdminState, applyAdminState } from "../core/state.js";
import { portfolioData } from "../data/portfolio-data.js";

export const firebaseService = {
    isReady() {
        return Boolean(window.FirebaseAdminAPI || window.__firebaseReady);
    },

    onReady(callback) {
        if (this.isReady()) {
            callback();
        } else {
            window.addEventListener("firebase-ready", callback, { once: true });
        }
    },

    async loadPortfolioData() {
        if (!window.FirebaseAdminAPI?.loadPortfolioData) return null;
        return await window.FirebaseAdminAPI.loadPortfolioData();
    }
};

export const initPublicPortfolio = (refreshScrollReveal) => {
    const dashboard = document.getElementById("admin-dashboard");
    if (dashboard) return;

    // Baseline from portfolioData merged with DOM state
    const domState = extractAdminState();
    const initialState = deepMerge(deepClone(portfolioData), domState);

    // Single initial load from Firestore — no polling needed on the public page
    const loadPublicData = async () => {
        if (!window.FirebaseAdminAPI) return;
        try {
            const remoteData = await firebaseService.loadPortfolioData();
            if (remoteData && Object.keys(remoteData).length > 0) {
                const merged = deepMerge(deepClone(initialState), remoteData);
                const state = normalizeAdminState(merged);
                applyAdminState(state);
                if (typeof refreshScrollReveal === "function") {
                    refreshScrollReveal();
                }
            }
        } catch (err) {
            // Silently fall back to HTML content if Firestore is unreachable
            console.warn("[Firebase REST] Public data load failed, showing HTML fallback.", err);
        }
    };

    firebaseService.onReady(loadPublicData);
};
