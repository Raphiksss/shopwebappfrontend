import { create } from "zustand";
import { apiUsers } from "../../../shared/api";

const toNum = (v) => Number(v);
const normalizeIds = (data) => {
    if (Array.isArray(data))
        return data.map(toNum).filter((n) => !Number.isNaN(n));
    if (typeof data === "string") {
        return data
            .split(",")
            .map((s) => toNum(s.trim()))
            .filter((n) => !Number.isNaN(n));
    }
    return [];
};

export const useFavoriteStore = create((set, get) => ({
    ids: new Set(),
    loading: false,
    actionLoading: false,
    error: null,

    // загрузить избранное пользователя
    fetchFavorites: async (isInitial = false) => {
        if (isInitial) set({ loading: true, error: null });
        try {
            const data = await apiUsers.favorites();
            const arr = normalizeIds(data);
            set({ ids: new Set(arr) });
        } catch (e) {
            set({ error: e?.message || "Failed to fetch favorites" });
        } finally {
            if (isInitial) set({ loading: false });
        }
    },

    // проверить, что товар в избранном
    isFavorite: (productId) => {
        const id = toNum(productId);
        return get().ids.has(id);
    },

    // добавить (оптимистично)
    addFavorite: async (prodId) => {
        const id = toNum(prodId);
        const next = new Set(get().ids);
        next.add(id);
        set({ ids: next, actionLoading: true, error: null });
        try {
            await apiUsers.favAdd(id);
        } catch (e) {
            // откат
            const rollback = new Set(get().ids);
            rollback.delete(id);
            set({
                ids: rollback,
                error: e?.message || "Failed to add favorite",
            });
            throw e;
        } finally {
            set({ actionLoading: false });
        }
    },

    // удалить
    removeFavorite: async (prodId) => {
        const id = toNum(prodId);
        const next = new Set(get().ids);
        const had = next.delete(id);
        set({ ids: next, actionLoading: true, error: null });
        try {
            // ВАЖНО: бек возвращает 204 БЕЗ тела — в apiUsers просто проверяй res.ok
            await apiUsers.favDelete(id);
        } catch (e) {
            // откат
            if (had) {
                const rollback = new Set(get().ids);
                rollback.add(id);
                set({ ids: rollback });
            }
            set({ error: e?.message || "Failed to remove favorite" });
            throw e;
        } finally {
            set({ actionLoading: false });
        }
    },

    // переключить
    toggleFavorite: async (prodId) => {
        const id = toNum(prodId);
        return get().isFavorite(id)
            ? get().removeFavorite(id)
            : get().addFavorite(id);
    },

    // список id (массив)
    list: () => Array.from(get().ids),
}));
