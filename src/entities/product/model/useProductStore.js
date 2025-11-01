import { create } from "zustand";

import { apiProducts } from "../../../shared/api";

export const useProductsStore = create((set, get) => ({
    productsByCategory: {},
    productsById: {},
    loading: false,
    error: null,

    loadProducts: async (category) => {
        const key = category ?? "_all";
        const { productsByCategory, productsById } = get();

        if (productsByCategory[key]) return;

        set({ loading: true, error: null });
        try {
            const data = await apiProducts.list(category);

            const arr = Array.isArray(data)
                ? data
                : Array.isArray(data?.results)
                ? data.results
                : [];

            const newProductsById = { ...productsById };
            for (const p of arr) {
                if (p && p.id != null) newProductsById[String(p.id)] = p;
            }

            set({
                productsByCategory: { ...productsByCategory, [key]: arr },
                productsById: newProductsById,
            });
        } catch (e) {
            console.warn("loadProducts error:", e);
            set({ error: e?.message ?? String(e) });
        } finally {
            set({ loading: false });
        }
    },

    getProducts: (category) => {
        const key = category ?? "_all";
        return get().productsByCategory[key] || [];
    },

    getProductById: (id) => get().productsById[String(id)] || null,

    getAllProducts: () => Object.values(get().productsById),
}));
