import { useState } from "react";
import { apiSettings } from "../../../shared/api";
import styles from "./AdminDesign.module.css";

const DEFAULT_HEX = "#ff2e63";

const NAMED_COLORS = {
    red: "#ff2e63",
    blue: "#3b82f6",
    purple: "#8b5cf6",
    green: "#10b981",
    orange: "#f97316",
    pink: "#ec4899",
    cyan: "#06b6d4",
    yellow: "#eab308",
};

function normalizeColor(value) {
    if (!value || typeof value !== "string") return null;
    const trimmed = value.trim().toLowerCase();
    if (NAMED_COLORS[trimmed]) return NAMED_COLORS[trimmed];
    if (/^#[0-9a-f]{6}$/i.test(trimmed)) return trimmed;
    return null;
}

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

const OPACITIES = [8, 10, 12, 15, 20, 25, 28, 30, 35, 40, 45, 50, 60, 70];

export function applyAccentColor(hex) {
    const { r, g, b } = hexToRgb(hex);
    const secondary = lighten(hex, 30);
    const root = document.documentElement;

    root.style.setProperty("--blue", hex);
    root.style.setProperty("--blue-secondary", secondary);
    root.style.setProperty("--glow", `rgba(${r}, ${g}, ${b}, 0.4)`);

    for (const op of OPACITIES) {
        root.style.setProperty(
            `--glow-${op.toString().padStart(2, "0")}`,
            `rgba(${r}, ${g}, ${b}, ${op / 100})`
        );
    }
}

export async function initAccentColor() {
    try {
        const data = await apiSettings.getAccentColor();
        const hex = normalizeColor(data?.accent_color);
        if (hex) applyAccentColor(hex);
    } catch {
        // бэк недоступен — оставляем дефолт из CSS
    }
}

export const AdminDesign = () => {
    const [active, setActive] = useState(COLORS[0].value);
    const [saving, setSaving] = useState(false);

    const handlePick = async (hex) => {
        setActive(hex);
        applyAccentColor(hex);
        setSaving(true);
        try {
            await apiSettings.setAccentColor(hex);
        } catch {
            // ignore
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <h3 className={styles.title}>Акцентный цвет</h3>
            <p className={styles.desc}>
                Выберите основной цвет интерфейса
                {saving && " — сохранение..."}
            </p>

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
                        disabled={saving}
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
