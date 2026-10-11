import { create } from "zustand";

const parseId = (value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
};

const devFallbackTgId = (() => {
    if (!import.meta.env.DEV) return null;
    return parseId(import.meta.env.VITE_DEV_TG_ID);
})();

const getTelegramWebApp = () => {
    if (typeof window === "undefined") return null;
    return window.Telegram?.WebApp ?? null;
};

const getQueryTgId = () => {
    if (typeof window === "undefined") return null;
    try {
        const params = new URLSearchParams(window.location.search);
        return (
            parseId(params.get("tg_id")) ??
            parseId(params.get("tgId")) ??
            null
        );
    } catch {
        return null;
    }
};

const initialTgId = getQueryTgId() ?? devFallbackTgId ?? null;

export const useTelegramStore = create((set, get) => ({
    webApp: null,
    user: null,
    initData: null,
    tgId: initialTgId,
    isReady: false,
    error: null,

    init: () => {
        if (get().isReady) return;

        const webApp = getTelegramWebApp();
        const queryTgId = getQueryTgId();

        if (!webApp) {
            set({
                isReady: true,
                webApp: null,
                user: null,
                tgId: queryTgId ?? devFallbackTgId ?? null,
            });
            return;
        }

        try {
            const user = webApp?.initDataUnsafe?.user ?? null;
            const tgId = parseId(user?.id);

            set({
                webApp,
                user,
                initData: webApp?.initData || null,
                tgId: tgId ?? queryTgId ?? devFallbackTgId ?? null,
                isReady: true,
                error: null,
            });
            webApp.ready();
            webApp.expand?.();
            webApp.expand?.();
        } catch (error) {
            console.warn("Telegram init failed:", error);
            set({
                webApp,
                user: null,
                tgId: queryTgId ?? devFallbackTgId ?? null,
                isReady: true,
                error: error?.message ?? "Failed to init Telegram WebApp",
            });
        }
    },

    closeApp: () => {
        const webApp = get().webApp;
        webApp?.close?.();
    },

    setManualTgId: (value) => {
        const normalized = parseId(value);
        set({ tgId: normalized });
    },
}));
