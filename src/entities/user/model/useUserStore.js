import { create } from "zustand";

import { apiUsers } from "../../../shared/api";

const normalizeId = (value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
};

export const useUserStore = create((set, get) => ({
    data: null,
    loading: false,
    error: null,

    loadUser: async (tgId, { force = false } = {}) => {
        const normalizedId = normalizeId(tgId);
        if (!normalizedId) return;

        const { loading, data } = get();
        if (
            !force &&
            (loading ||
                normalizeId(data?.tg_id || data?.telegram_id || data?.id) ===
                    normalizedId)
        ) {
            return;
        }

        set({ loading: true, error: null });
        try {
            const response = await apiUsers.getByTgId(normalizedId);
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

