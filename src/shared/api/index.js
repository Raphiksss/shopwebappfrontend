const API_BASE = import.meta.env.VITE_API_URL ?? "http://10.177.93.85:8000/api/v1";

// универсальный запрос
export async function request(path, method = "GET", body = null, headers = {}) {
    const opts = { method, headers };

    if (body && !(body instanceof FormData)) {
        opts.headers["Content-Type"] = "application/json";
        opts.body = JSON.stringify(body);
    } else if (body) {
        opts.body = body; // FormData
    }

    const response = await fetch(API_BASE + path, opts);

    if (response.status === 204) return null;
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    return response.json();
}

//PRODUCTS
export const apiProducts = {
    list: (params) => {
        const category =
            typeof params === "string" ? params : params?.category;

        if (category) {
            return request(
                `/products/?category=${encodeURIComponent(category)}`
            );
        }

        return request("/products/");
    },
    byId: (id) => request(`/products/${id}/`),
    create: (formData) => request("/products/", "POST", formData),
    delete: (id) => request(`/products/${id}/`, "DELETE"),
};

//USERS
export const apiUsers = {
    getByTgId: (tgId) => request(`/get_user/${tgId}/`),
    create: (payload) => request("/create_user/", "POST", payload),
    favorites: (tgId) => request(`/users/${tgId}/favorites`),
    favAdd: (tgId, prodId) =>
        request(`/users/${tgId}/favorites/${prodId}/`, "POST"),
    favDelete: (tgId, prodId) =>
        request(`/users/${tgId}/favorites/${prodId}`, "DELETE"),
};

//CART
export const apiCart = {
    get: (tgId) => request(`/cart/${tgId}/`),
    add: (tgId, prod_id) =>
        request(`/cart/${tgId}/?prod_id=${prod_id}`, "POST"),
    //удалить еденицу товара
    deleteItem: (tgId, prod_id) =>
        request(
            `/cart/${tgId}/?prod_id=${prod_id}`,
            "DELETE"
        ),
    deleteAll: (tgId) => request(`/cart/all_cart/${tgId}/`, "DELETE"),
    deleteOne: (tgId, prod_id) =>
        request(
            `/cart/full_product/${tgId}/?prod_id=${prod_id}`,
            "DELETE"
        ),
};
