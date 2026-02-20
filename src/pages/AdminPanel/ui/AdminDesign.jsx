import { useState } from "react";
import styles from "./AdminDesign.module.css";

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

function lighten(hex, amount = 30) {
    const { r, g, b } = hexToRgb(hex);
    const lr = Math.min(255, r + amount);
    const lg = Math.min(255, g + amount);
    const lb = Math.min(255, b + amount);
    return `#${lr.toString(16).padStart(2, "0")}${lg.toString(16).padStart(2, "0")}${lb.toString(16).padStart(2, "0")}`;
}

const COLORS = [
    { name: "Красный", value: "#ff2e63" },
    { name: "Синий", value: "#3b82f6" },
    { name: "Фиолетовый", value: "#8b5cf6" },
    { name: "Зелёный", value: "#10b981" },
    { name: "Оранжевый", value: "#f97316" },
    { name: "Розовый", value: "#ec4899" },
    { name: "Голубой", value: "#06b6d4" },
    { name: "Жёлтый", value: "#eab308" },
];

const STORAGE_KEY = "app-accent-color";

const OPACITIES = [8, 10, 12, 15, 20, 25, 28, 30, 35, 40, 45, 50, 60, 70];

function applyColor(hex) {
    const { r, g, b } = hexToRgb(hex);
    const secondary = lighten(hex, 30);
    const root = document.documentElement;

    root.style.setProperty("--blue", hex);
    root.style.setProperty("--blue-secondary", secondary);
    root.style.setProperty("--glow", `rgba(${r}, ${g}, ${b}, 0.4)`);

    for (const op of OPACITIES) {
        root.style.setProperty(`--glow-${op.toString().padStart(2, "0")}`, `rgba(${r}, ${g}, ${b}, ${op / 100})`);
    }
}

function getSavedHex() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return saved;
    } catch {}
    return null;
}

export function initAccentColor() {
    const hex = getSavedHex();
    if (hex) applyColor(hex);
}

export const AdminDesign = () => {
    const [active, setActive] = useState(() => getSavedHex() || COLORS[0].value);

    const handlePick = (hex) => {
        setActive(hex);
        applyColor(hex);
        localStorage.setItem(STORAGE_KEY, hex);
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
                        onClick={() => handlePick(color.value)}
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
