import { create } from "zustand";
import { apiAuth } from "../../../shared/api";

export const useAuthStore = create((set, get) => ({
    user: null,
    loading: false,
    error: null,

    login: async (username, password) => {
        set({ loading: true, error: null });
        try {
            const data = await apiAuth.login(username, password);
            set({ user: data, loading: false });
            return true;
        } catch (e) {
            set({
                error: "Неверный логин или пароль",
                loading: false,
            });
            return false;
        }
    },

    checkSession: async () => {
        set({ loading: true });
        try {
            const data = await apiAuth.me();
            set({ user: data, loading: false });
        } catch {
            set({ user: null, loading: false });
        }
    },

    logout: () => set({ user: null, error: null }),

    isAuthenticated: () => !!get().user,
}));
