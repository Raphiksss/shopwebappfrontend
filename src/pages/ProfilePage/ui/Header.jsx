import { useEffect, useMemo } from "react";

import { useTelegramStore } from "../../../entities/telegram/model/useTelegramStore";
import { useUserStore } from "../../../entities/user/model/useUserStore";

import styles from "./Header.module.css";

const formatBalance = (balance) => {
    if (balance === null || balance === undefined) return null;
    const num = Number(balance);
    if (!Number.isFinite(num)) return null;
    return new Intl.NumberFormat("ru-RU").format(num);
};

export const ProfileHeader = () => {
    const tgId = useTelegramStore((state) => state.tgId);
    const initData = useTelegramStore((state) => state.initData);
    const { data: user, loading, error, loadUser } = useUserStore((state) => ({
        data: state.data,
        loading: state.loading,
        error: state.error,
        loadUser: state.loadUser,
    }));

    useEffect(() => {
        if (!initData) return;
        loadUser();
    }, [initData, loadUser]);

    const displayName = useMemo(() => {
        if (loading) return "Загрузка...";
        return (
            user?.username ||
            [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim() ||
            "Пользователь"
        );
    }, [loading, user]);

    const initials = useMemo(() => {
        const source = user?.username || user?.first_name || displayName;
        return source?.trim()?.[0]?.toUpperCase() || "?";
    }, [user, displayName]);

    const formattedBalance = formatBalance(user?.balance);
    const displayId = user?.tg_id ?? user?.telegram_id ?? tgId ?? "—";

    return (
        <header className={styles.profileHeader}>
            <div className={styles.avatar}>{initials}</div>
            <div className={styles.userInfo}>
                <h2 className={styles.userName}>{displayName}</h2>
                <p className={styles.userId}>ID: {displayId}</p>
                <div className={styles.balance}>
                    Баланс:{" "}
                    <span className={styles.balanceAmount}>
                        {formattedBalance ?? "—"} ₽
                    </span>
                </div>
                {error && <p className={styles.error}>Ошибка: {error}</p>}
            </div>
        </header>
    );
};

