import { create } from "zustand";

import { apiUsers } from "../../../shared/api";

export const useUserStore = create((set, get) => ({
    data: null,
    loading: false,
    error: null,

    loadUser: async ({ force = false } = {}) => {
        const { loading, data } = get();
        if (!force && (loading || data)) return;

        set({ loading: true, error: null });
        try {
            const response = await apiUsers.me();
            set({ data: response, loading: false, error: null });
        } catch (error) {
            set({
                error: error?.message ?? "Не удалось получить данные профиля",
                loading: false,
            });
        }
    },

    reset: () => set({ data: null, error: null }),
}));

