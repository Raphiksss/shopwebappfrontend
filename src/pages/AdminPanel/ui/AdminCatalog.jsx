import { useState, useEffect } from "react";
import { apiProducts, apiCategories } from "../../../shared/api";
import { Button } from "../../../shared/assets/Button/Button";
import styles from "./AdminCatalog.module.css";

export const AdminCatalog = () => {
    const [showForm, setShowForm] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        rating: "",
        category: "",
        product_type: "",
        img: null,
        data: null,
    });

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
            product_type: "",
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
        } catch {
            setError("Не удалось создать товар");
        } finally {
            setLoading(false);
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

                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Тип товара"
                        value={form.product_type}
                        onChange={(e) =>
                            updateField("product_type", e.target.value)
                        }
                    />

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
        </div>
    );
};
