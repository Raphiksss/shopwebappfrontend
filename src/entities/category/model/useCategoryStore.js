import { create } from "zustand";

import { apiCategories } from "../../../shared/api";

export const useCategoryStore = create((set, get) => ({
    categories: [],
    loading: false,
    error: null,

    loadCategories: async (force = false) => {
        const { categories, loading } = get();
        if (!force && (categories.length > 0 || loading)) return;

        set({ loading: true, error: null });
        try {
            const data = await apiCategories.list();
            const list = Array.isArray(data) ? data : data?.results ?? [];
            set({ categories: list, error: null });
        } catch (e) {
            console.warn("loadCategories error:", e);
            set({ error: e?.message ?? "Failed to load categories" });
        } finally {
            set({ loading: false });
        }
    },
}));

