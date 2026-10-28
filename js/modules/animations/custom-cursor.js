/**
 * Custom Cursor Module (Disabled)
 * Native system cursor restored per design preference
 */

/**
 * Ensures any lingering custom cursor elements or state classes are cleanly removed.
 */
export const initCustomCursor = () => {
    const cursor = document.querySelector(".macos-cursor");
    if (cursor) cursor.remove();
    document.body?.classList.remove("has-macos-cursor");
};
