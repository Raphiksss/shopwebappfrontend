const DEV = import.meta.env.DEV;
const DEFAULT_PORT = "8000";
const DEFAULT_HOST = "http://localhost:8000";
const DEFAULT_PREFIX = "/api/v1";

const API_PREFIX = normalizePrefix(
    import.meta.env.VITE_API_PREFIX ?? DEFAULT_PREFIX
);

const API_HOST = DEV
    ? ""
    : normalizeHost(
          import.meta.env.VITE_API_URL ??
              buildHostFromWindow() ??
              DEFAULT_HOST
      );

function normalizeHost(value) {
    return value.replace(/\/+$/, "");
}

function normalizePrefix(value) {
    if (!value) return "";
    return value.startsWith("/") ? value.replace(/\/+$/, "") : `/${value}`;
}

function buildHostFromWindow() {
    if (typeof window === "undefined") return null;

    const protocol = window.location.protocol || "http:";
    const hostname = window.location.hostname || "localhost";
    const port = import.meta.env.VITE_API_PORT || DEFAULT_PORT;

    return `${protocol}//${hostname}:${port}`;
}

function ensureLeadingSlash(path) {
    return path.startsWith("/") ? path : `/${path}`;
}

function buildPath(path) {
    const normalized = ensureLeadingSlash(path);

    if (API_PREFIX && !normalized.startsWith(API_PREFIX)) {
        return `${API_PREFIX}${normalized}`;
    }

    return normalized;
}

export async function request(path, method = "GET", body = null, headers = {}) {
    const opts = { method, headers };

    if (body && !(body instanceof FormData)) {
        opts.headers["Content-Type"] = "application/json";
        opts.body = JSON.stringify(body);
    } else if (body) {
        opts.body = body;
    }

    const url = `${API_HOST}${buildPath(path)}`;
    const response = await fetch(url, opts);

    if (response.status === 204) return null;
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    return response.json();
}

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

export const apiUsers = {
    getByTgId: (tgId) => request(`/get_user/${tgId}/`),
    create: (payload) => request("/create_user/", "POST", payload),
    favorites: (tgId) => request(`/favorites/${tgId}/`),
    favAdd: (tgId, prodId) =>
        request(`/favorites/${tgId}/?product_id=${prodId}`, "POST"),
    favDelete: (tgId, prodId) =>
        request(`/favorites/${tgId}/?product_id=${prodId}`, "DELETE"),
};

export const apiCart = {
    get: (tgId) => request(`/cart/${tgId}/`),
    add: (tgId, prod_id) =>
        request(`/cart/${tgId}/?prod_id=${prod_id}`, "POST"),
    deleteItem: (tgId, prod_id) =>
        request(`/cart/${tgId}/?prod_id=${prod_id}`, "DELETE"),
    deleteAll: (tgId) => request(`/cart/all_cart/${tgId}/`, "DELETE"),
    deleteOne: (tgId, prod_id) =>
        request(`/cart/full_product/${tgId}/?prod_id=${prod_id}`, "DELETE"),
};

