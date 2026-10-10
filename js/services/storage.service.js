/**
 * Storage Service
 * Clean Architecture - Infrastructure / Services Layer
 * Safe wrapper around window.localStorage with error resiliency
 */

export const storageService = {
    getItem(key, fallback = null) {
        try {
            const item = window.localStorage.getItem(key);
            return item !== null ? item : fallback;
        } catch (_error) {
            return fallback;
        }
    },

    getJson(key, fallback = null) {
        try {
            const item = this.getItem(key);
            return item ? JSON.parse(item) : fallback;
        } catch (_error) {
            return fallback;
        }
    },

    setItem(key, value) {
        try {
            const serialized = typeof value === "string" ? value : JSON.stringify(value);
            window.localStorage.setItem(key, serialized);
            return true;
        } catch (_error) {
            return false;
        }
    },

    removeItem(key) {
        try {
            window.localStorage.removeItem(key);
            return true;
        } catch (_error) {
            return false;
        }
    }
};
