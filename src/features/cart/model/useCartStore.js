import { create } from "zustand";

import { useProductsStore } from "../../../entities/product/model/useProductStore";

import { apiCart } from "../../../shared/api";

export const useCartStore = create((set, get) => ({
    cart: {},
    loading: false,
    actionLoading: false,
    error: null,

    //получить корзину пользователя

    fetchCart: async (isInitial = false) => {
        if (isInitial) set({ loading: true, error: null });
        try {
            const data = await apiCart.get();
            set({ cart: data.products || {} });
        } catch (e) {
            set({ error: e.message });
        } finally {
            if (isInitial) set({ loading: false });
        }
    },

    getCart: () => get().cart || {},

    // добавить товар в корзину
    addToCart: async (prod_id) => {
        set({ actionLoading: true });
        try {
            await apiCart.add(prod_id);

            await get().fetchCart(false);
        } catch (e) {
            set({ error: e.message });

        } finally {
            set({ actionLoading: false });
        }
    },
    // удалить товар из корзины

    removeFromCartOneCurrent: async (prod_id) => {
        set({ actionLoading: true });
        try {
            await apiCart.deleteItem(prod_id);
            await get().fetchCart(false);
        } catch (e) {
            set({ error: e.message });
        } finally {
            set({ actionLoading: false });
        }
    },

    removeFromCart: async (prod_id) => {
        set({ actionLoading: true });
        try {
            await apiCart.deleteOne(prod_id);
            await get().fetchCart(false);
        } catch (e) {
            set({ error: e.message });
        } finally {
            set({ actionLoading: false });
        }
    },

    getTotalCount: () => {
        const cart = get().cart;
        return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    },

    isActive: (productId) => {
        return !!get().cart[productId];
    },

    getTotalPrice: () => {
        const cart = get().cart;
        const productsById = useProductsStore.getState().productsById;
        console.log(cart, productsById);
        return Object.entries(cart).reduce((sum, [id, count]) => {
            const product = productsById[id];
            const price = product ? Number(product.price) : 0;
            return sum + price * count;
        }, 0);
    },
}));
