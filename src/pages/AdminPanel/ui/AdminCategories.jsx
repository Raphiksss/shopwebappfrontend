import { useState, useEffect, useCallback } from "react";
import { apiCategories } from "../../../shared/api";
import { Button } from "../../../shared/assets/Button/Button";
import { PencilIcon } from "./PencilIcon";
import styles from "./AdminCategories.module.css";

const CategoryCard = ({ cat, onUpdated, onDeleted }) => {
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState("");
    const [img, setImg] = useState(null);
    const [saving, setSaving] = useState(false);
    const [done, setDone] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleEdit = () => {
        setTitle(cat.title || cat.name || "");
        setImg(null);
        setEditing(true);
    };

    const handleCancel = () => {
        setEditing(false);
    };

    const handleSave = async () => {
        const fd = new FormData();
        const currentTitle = cat.title || cat.name || "";
        if (title && title !== currentTitle) fd.append("title", title);
        if (img) fd.append("img", img);
        if ([...fd.keys()].length === 0) return;

        setSaving(true);
        setDone(false);
        try {
            await apiCategories.update(cat.id, fd);
            setDone(true);
            onUpdated();
            setTimeout(() => {
                setDone(false);
                setEditing(false);
            }, 1000);
        } catch {
            // ignore
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await apiCategories.delete(cat.id);
            onDeleted();
        } catch {
            // ignore
        } finally {
            setDeleting(false);
        }
    };

    const catTitle = cat.title || cat.name || "—";
    const catImg = cat.img || cat.image || null;

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                {catImg && (
                    <img src={catImg} alt={catTitle} className={styles.catImg} />
                )}
                <span className={styles.catTitle}>{catTitle}</span>
                <button className={styles.editBtn} onClick={handleEdit}>
                    <PencilIcon size={14} />
                </button>
                <button
                    className={styles.deleteBtn}
                    onClick={handleDelete}
                    disabled={deleting}
                >
                    {deleting ? "..." : "Удалить"}
                </button>
            </div>

            {editing && (
                <div className={styles.editPanel}>
                    <div className={styles.editRow}>
                        <span className={styles.editLabel}>Название</span>
                        <input
                            className={styles.input}
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className={styles.editRow}>
                        <span className={styles.editLabel}>Изображение</span>
                        <input
                            type="file"
                            accept="image/*"
                            className={styles.fileInput}
                            onChange={(e) => setImg(e.target.files[0] || null)}
                        />
                    </div>
                    <div className={styles.editActions}>
                        <button
                            className={styles.saveBtn}
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {done ? "done" : saving ? <span className={styles.spin}>&#9881;</span> : "✓"}
                        </button>
                        <button
                            className={styles.cancelBtn}
                            onClick={handleCancel}
                            disabled={saving}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({ category_title: "", img: null });
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const loadCategories = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiCategories.list();
            setCategories(Array.isArray(data) ? data : []);
        } catch {
            setCategories([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCreating(true);
        setError(null);
        setSuccess(false);

        const fd = new FormData();
        fd.append("category_title", form.category_title);
        if (form.img) fd.append("img", form.img);

        try {
            await apiCategories.create(fd);
            setSuccess(true);
            setForm({ category_title: "", img: null });
            loadCategories();
        } catch {
            setError("Не удалось создать категорию");
        } finally {
            setCreating(false);
        }
    };

    const canSubmit = form.category_title && !creating;

    return (
        <div>
            {!showForm && (
                <div className={styles.addBtnWrap}>
                    <Button onClick={() => setShowForm(true)}>
                        Добавить категорию
                    </Button>
                </div>
            )}

            {showForm && (
                <form className={styles.form} onSubmit={handleSubmit}>
                    <h3 className={styles.formTitle}>Новая категория</h3>

                    {success && <div className={styles.success}>Категория добавлена</div>}
                    {error && <div className={styles.error}>{error}</div>}

                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Название категории"
                        value={form.category_title}
                        onChange={(e) => setForm((f) => ({ ...f, category_title: e.target.value }))}
                    />

                    <div className={styles.fileSection}>
                        <span className={styles.label}>Изображение</span>
                        <input
                            type="file"
                            accept="image/*"
                            className={styles.fileInput}
                            onChange={(e) => setForm((f) => ({ ...f, img: e.target.files[0] || null }))}
                        />
                    </div>

                    <div className={styles.actions}>
                        <Button type="submit" disabled={!canSubmit}>
                            {creating ? "Создание..." : "Создать"}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            size="small"
                            onClick={() => {
                                setShowForm(false);
                                setForm({ category_title: "", img: null });
                                setError(null);
                                setSuccess(false);
                            }}
                        >
                            Отмена
                        </Button>
                    </div>
                </form>
            )}

            <div className={styles.listSection}>
                <h3 className={styles.formTitle}>Все категории</h3>
                {loading && <div className={styles.muted}>Загрузка...</div>}
                {!loading && categories.length === 0 && (
                    <div className={styles.muted}>Категорий нет</div>
                )}
                <div className={styles.list}>
                    {categories.map((cat) => (
                        <CategoryCard
                            key={cat.id}
                            cat={cat}
                            onUpdated={loadCategories}
                            onDeleted={loadCategories}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
