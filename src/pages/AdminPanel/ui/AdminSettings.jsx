import { useState, useEffect, useCallback } from "react";
import { apiSettings } from "../../../shared/api";
import styles from "./AdminSettings.module.css";

const METHODS = [
    { key: "stars", label: "Telegram Stars", icon: "⭐" },
    { key: "crypto_bot", label: "Crypto Bot", icon: "₿" },
    { key: "yoomoney", label: "Банковская карта", icon: "💳" },
];

const SettingField = ({ label, value, onChange, onSave, saving, done, type = "text", placeholder }) => (
    <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{label}</span>
        <div className={styles.fieldInner}>
            <input
                className={styles.input}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
            <button
                className={styles.saveBtn}
                onClick={onSave}
                disabled={saving || !value}
            >
                {done ? "done" : saving ? <span className={styles.spin}>&#9881;</span> : "✓"}
            </button>
        </div>
    </div>
);

export const AdminSettings = () => {
    const [methods, setMethods] = useState({ stars: true, crypto_bot: true, yoomoney: true });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Bot token
    const [botToken, setBotToken] = useState("");
    const [botSaving, setBotSaving] = useState(false);
    const [botDone, setBotDone] = useState(false);

    // Stars rate
    const [starsRate, setStarsRate] = useState("");
    const [starsSaving, setStarsSaving] = useState(false);
    const [starsDone, setStarsDone] = useState(false);

    // Crypto token
    const [cryptoToken, setCryptoToken] = useState("");
    const [cryptoSaving, setCryptoSaving] = useState(false);
    const [cryptoDone, setCryptoDone] = useState(false);

    // YooMoney
    const [yooToken, setYooToken] = useState("");
    const [yooWallet, setYooWallet] = useState("");
    const [yooSecret, setYooSecret] = useState("");
    const [yooSaving, setYooSaving] = useState(false);
    const [yooDone, setYooDone] = useState(false);

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

    const handleBotToken = async () => {
        setBotSaving(true);
        setBotDone(false);
        try {
            await apiSettings.setBotToken(botToken);
            setBotDone(true);
            setTimeout(() => setBotDone(false), 1500);
        } catch {} finally { setBotSaving(false); }
    };

    const handleStarsRate = async () => {
        setStarsSaving(true);
        setStarsDone(false);
        try {
            await apiSettings.setStarsRate(Number(starsRate));
            setStarsDone(true);
            setTimeout(() => setStarsDone(false), 1500);
        } catch {} finally { setStarsSaving(false); }
    };

    const handleCryptoToken = async () => {
        setCryptoSaving(true);
        setCryptoDone(false);
        try {
            await apiSettings.setCryptoToken(cryptoToken);
            setCryptoDone(true);
            setTimeout(() => setCryptoDone(false), 1500);
        } catch {} finally { setCryptoSaving(false); }
    };

    const handleYooMoney = async () => {
        setYooSaving(true);
        setYooDone(false);
        try {
            await apiSettings.setYooMoney({
                token: yooToken,
                wallet: yooWallet,
                notification_secret: yooSecret,
            });
            setYooDone(true);
            setTimeout(() => setYooDone(false), 1500);
        } catch {} finally { setYooSaving(false); }
    };

    if (loading) return <div className={styles.muted}>Загрузка...</div>;

    return (
        <div className={styles.page}>
            {/* Способы оплаты */}
            <section className={styles.section}>
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
            </section>

            {/* Токен бота */}
            <section className={styles.section}>
                <h3 className={styles.title}>Токен бота</h3>
                <SettingField
                    label="Bot Token"
                    value={botToken}
                    onChange={setBotToken}
                    onSave={handleBotToken}
                    saving={botSaving}
                    done={botDone}
                    placeholder="123456:ABC-DEF..."
                />
            </section>

            {/* Курс звёзд */}
            <section className={styles.section}>
                <h3 className={styles.title}>Курс звёзд</h3>
                <SettingField
                    label="Exchange Rate"
                    value={starsRate}
                    onChange={setStarsRate}
                    onSave={handleStarsRate}
                    saving={starsSaving}
                    done={starsDone}
                    type="number"
                    placeholder="1.5"
                />
            </section>

            {/* Crypto Bot */}
            <section className={styles.section}>
                <h3 className={styles.title}>Crypto Bot</h3>
                <SettingField
                    label="Crypto Bot Token"
                    value={cryptoToken}
                    onChange={setCryptoToken}
                    onSave={handleCryptoToken}
                    saving={cryptoSaving}
                    done={cryptoDone}
                    placeholder="Токен Crypto Bot"
                />
            </section>

            {/* YooMoney */}
            <section className={styles.section}>
                <h3 className={styles.title}>YooMoney</h3>
                <div className={styles.fieldGroup}>
                    <div className={styles.fieldRow}>
                        <span className={styles.fieldLabel}>Token</span>
                        <input
                            className={styles.input}
                            value={yooToken}
                            onChange={(e) => setYooToken(e.target.value)}
                            placeholder="Токен YooMoney"
                        />
                    </div>
                    <div className={styles.fieldRow}>
                        <span className={styles.fieldLabel}>Wallet</span>
                        <input
                            className={styles.input}
                            value={yooWallet}
                            onChange={(e) => setYooWallet(e.target.value)}
                            placeholder="Номер кошелька"
                        />
                    </div>
                    <div className={styles.fieldRow}>
                        <span className={styles.fieldLabel}>Secret</span>
                        <input
                            className={styles.input}
                            value={yooSecret}
                            onChange={(e) => setYooSecret(e.target.value)}
                            placeholder="Notification secret"
                        />
                    </div>
                    <button
                        className={styles.saveGroupBtn}
                        onClick={handleYooMoney}
                        disabled={yooSaving || (!yooToken && !yooWallet && !yooSecret)}
                    >
                        {yooDone ? "Сохранено" : yooSaving ? <span className={styles.spin}>&#9881;</span> : "Сохранить"}
                    </button>
                </div>
            </section>
        </div>
    );
};
