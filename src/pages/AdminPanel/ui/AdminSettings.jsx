import { useState, useEffect, useCallback } from "react";
import { apiSettings } from "../../../shared/api";
import styles from "./AdminSettings.module.css";

const METHODS = [
    { key: "stars", label: "Telegram Stars", icon: "⭐" },
    { key: "crypto_bot", label: "Crypto Bot", icon: "₿" },
    { key: "yoomoney", label: "Банковская карта", icon: "💳" },
];

export const AdminSettings = () => {
    const [methods, setMethods] = useState({ stars: true, crypto_bot: true, yoomoney: true });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        try {
            const data = await apiSettings.getPaymentMethods();
            if (data) setMethods(data);
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const handleToggle = async (key) => {
        const updated = { ...methods, [key]: !methods[key] };
        setMethods(updated);
        setSaving(true);
        try {
            await apiSettings.setPaymentMethods(updated);
        } catch {
            setMethods(methods);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className={styles.muted}>Загрузка...</div>;

    return (
        <div>
            <h3 className={styles.title}>Способы оплаты</h3>
            <p className={styles.desc}>Включите или отключите доступные способы пополнения</p>

            <div className={styles.list}>
                {METHODS.map((m) => (
                    <div key={m.key} className={styles.row}>
                        <span className={styles.icon}>{m.icon}</span>
                        <span className={styles.label}>{m.label}</span>
                        <button
                            className={methods[m.key] ? styles.toggleOn : styles.toggleOff}
                            onClick={() => handleToggle(m.key)}
                            disabled={saving}
                        >
                            <span className={styles.toggleThumb} />
                        </button>
                    </div>
                ))}
            </div>

            {saving && <div className={styles.muted}>Сохранение...</div>}
        </div>
    );
};
