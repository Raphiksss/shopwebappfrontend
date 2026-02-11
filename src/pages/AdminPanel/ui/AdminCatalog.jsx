import { useState, useEffect, useCallback } from "react";
import { apiProducts, apiCategories } from "../../../shared/api";
import { Button } from "../../../shared/assets/Button/Button";
import styles from "./AdminCatalog.module.css";

const PRODUCT_TYPES = [
    { value: "instantly", label: "instantly" },
    { value: "notinstantly", label: "notinstantly" },
];

export const AdminCatalog = () => {
    const [showForm, setShowForm] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        rating: "",
        category: "",
        product_type: "instantly",
        img: null,
        data: null,
    });

    const loadProducts = useCallback(async () => {
        setProductsLoading(true);
        try {
            const data = await apiProducts.list();
            setProducts(Array.isArray(data) ? data : []);
        } catch {
            setProducts([]);
        } finally {
            setProductsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    useEffect(() => {
        if (showForm) {
            apiCategories.list().then(setCategories).catch(() => {});
        }
    }, [showForm]);

    const updateField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setForm({
            title: "",
            description: "",
            price: "",
            rating: "",
            category: "",
            product_type: "instantly",
            img: null,
            data: null,
        });
        setError(null);
        setSuccess(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        const fd = new FormData();
        fd.append("title", form.title);
        fd.append("description", form.description);
        fd.append("price", form.price);
        fd.append("rating", form.rating);
        fd.append("category", form.category);
        fd.append("product_type", form.product_type);
        fd.append("img", form.img);
        if (form.data) {
            fd.append("data", form.data);
        }

        try {
            await apiProducts.create(fd);
            setSuccess(true);
            resetForm();
            loadProducts();
        } catch {
            setError("Не удалось создать товар");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            await apiProducts.delete(id);
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch {
            // ignore
        } finally {
            setDeletingId(null);
        }
    };

    const canSubmit =
        form.title &&
        form.description &&
        form.price &&
        form.rating &&
        form.category &&
        form.product_type &&
        form.img &&
        !loading;

    return (
        <div>
            {!showForm && (
                <Button onClick={() => setShowForm(true)}>
                    Добавить товар
                </Button>
            )}

            {showForm && (
                <form className={styles.form} onSubmit={handleSubmit}>
                    <h3 className={styles.formTitle}>Новый товар</h3>

                    {success && (
                        <div className={styles.success}>Товар добавлен</div>
                    )}
                    {error && <div className={styles.error}>{error}</div>}

                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Название"
                        value={form.title}
                        onChange={(e) => updateField("title", e.target.value)}
                    />
                    <textarea
                        className={styles.textarea}
                        placeholder="Описание"
                        value={form.description}
                        onChange={(e) =>
                            updateField("description", e.target.value)
                        }
                        rows={3}
                    />
                    <input
                        className={styles.input}
                        type="number"
                        placeholder="Цена"
                        value={form.price}
                        onChange={(e) => updateField("price", e.target.value)}
                    />
                    <input
                        className={styles.input}
                        type="number"
                        step="0.1"
                        placeholder="Рейтинг"
                        value={form.rating}
                        onChange={(e) => updateField("rating", e.target.value)}
                    />

                    <div className={styles.categorySection}>
                        <span className={styles.label}>Категория</span>
                        <div className={styles.categoryList}>
                            {categories.map((cat) => {
                                const name = cat.name || cat.title || cat;
                                return (
                                    <button
                                        type="button"
                                        key={name}
                                        className={
                                            form.category === name
                                                ? styles.catActive
                                                : styles.catBtn
                                        }
                                        onClick={() =>
                                            updateField("category", name)
                                        }
                                    >
                                        {name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className={styles.categorySection}>
                        <span className={styles.label}>Тип товара</span>
                        <div className={styles.categoryList}>
                            {PRODUCT_TYPES.map((pt) => (
                                <button
                                    type="button"
                                    key={pt.value}
                                    className={
                                        form.product_type === pt.value
                                            ? styles.catActive
                                            : styles.catBtn
                                    }
                                    onClick={() =>
                                        updateField("product_type", pt.value)
                                    }
                                >
                                    {pt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.fileSection}>
                        <span className={styles.label}>
                            Изображение (обязательно)
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            className={styles.fileInput}
                            onChange={(e) =>
                                updateField("img", e.target.files[0] || null)
                            }
                        />
                    </div>

                    <div className={styles.fileSection}>
                        <span className={styles.label}>
                            Файл данных (необязательно)
                        </span>
                        <input
                            type="file"
                            className={styles.fileInput}
                            onChange={(e) =>
                                updateField("data", e.target.files[0] || null)
                            }
                        />
                    </div>

                    <div className={styles.actions}>
                        <Button type="submit" disabled={!canSubmit}>
                            {loading ? "Создание..." : "Создать"}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            size="small"
                            onClick={() => {
                                setShowForm(false);
                                resetForm();
                            }}
                        >
                            Отмена
                        </Button>
                    </div>
                </form>
            )}

            <div className={styles.productList}>
                <h3 className={styles.formTitle}>Все товары</h3>
                {productsLoading && (
                    <div className={styles.muted}>Загрузка...</div>
                )}
                {!productsLoading && products.length === 0 && (
                    <div className={styles.muted}>Товаров нет</div>
                )}
                {products.map((p) => (
                    <div key={p.id} className={styles.productItem}>
                        {p.img && (
                            <img
                                src={p.img}
                                alt={p.title}
                                className={styles.productImg}
                            />
                        )}
                        <div className={styles.productInfo}>
                            <span className={styles.productTitle}>
                                {p.title}
                            </span>
                            <span className={styles.productPrice}>
                                {p.price} ₽
                            </span>
                        </div>
                        <button
                            className={styles.deleteBtn}
                            disabled={deletingId === p.id}
                            onClick={() => handleDelete(p.id)}
                        >
                            {deletingId === p.id ? "..." : "Удалить"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
