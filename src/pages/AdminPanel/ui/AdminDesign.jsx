import { useState, useEffect } from "react";
import styles from "./AdminDesign.module.css";

const COLORS = [
    { name: "Красный", value: "#ff2e63", glow: "rgba(255, 46, 99, 0.4)" },
    { name: "Синий", value: "#3b82f6", glow: "rgba(59, 130, 246, 0.4)" },
    { name: "Фиолетовый", value: "#8b5cf6", glow: "rgba(139, 92, 246, 0.4)" },
    { name: "Зелёный", value: "#10b981", glow: "rgba(16, 185, 129, 0.4)" },
    { name: "Оранжевый", value: "#f97316", glow: "rgba(249, 115, 22, 0.4)" },
    { name: "Розовый", value: "#ec4899", glow: "rgba(236, 72, 153, 0.4)" },
    { name: "Голубой", value: "#06b6d4", glow: "rgba(6, 182, 212, 0.4)" },
    { name: "Жёлтый", value: "#eab308", glow: "rgba(234, 179, 8, 0.4)" },
];

const STORAGE_KEY = "app-accent-color";

function applyColor(color) {
    const root = document.documentElement;
    root.style.setProperty("--blue", color.value);
    root.style.setProperty("--glow", color.glow);
}

function getSavedColor() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            return COLORS.find((c) => c.value === parsed.value) || null;
        }
    } catch {}
    return null;
}

export function initAccentColor() {
    const saved = getSavedColor();
    if (saved) applyColor(saved);
}

export const AdminDesign = () => {
    const [active, setActive] = useState(() => {
        const saved = getSavedColor();
        return saved?.value || COLORS[0].value;
    });

    const handlePick = (color) => {
        setActive(color.value);
        applyColor(color);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(color));
    };

    return (
        <div>
            <h3 className={styles.title}>Акцентный цвет</h3>
            <p className={styles.desc}>Выберите основной цвет интерфейса</p>

            <div className={styles.grid}>
                {COLORS.map((color) => (
                    <button
                        key={color.value}
                        className={
                            active === color.value
                                ? styles.colorBtnActive
                                : styles.colorBtn
                        }
                        onClick={() => handlePick(color)}
                    >
                        <span
                            className={styles.swatch}
                            style={{ background: color.value }}
                        />
                        <span className={styles.colorName}>{color.name}</span>
                    </button>
                ))}
            </div>

            <div className={styles.preview}>
                <span className={styles.previewLabel}>Превью:</span>
                <div className={styles.previewRow}>
                    <span className={styles.previewAccent}>Акцентный текст</span>
                    <button className={styles.previewBtn}>Кнопка</button>
                </div>
            </div>
        </div>
    );
};
