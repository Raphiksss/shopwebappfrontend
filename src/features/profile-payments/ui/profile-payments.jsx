import { useMemo } from "react";

import styles from "./profile-payments.module.css";
import { Button } from "../../../shared/assets/Button/Button";
import { useUserStore } from "../../../entities/user/model/useUserStore";
import { useTelegramStore } from "../../../entities/telegram/model/useTelegramStore";

const formatBalance = (value) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return "—";
    return `${new Intl.NumberFormat("ru-RU").format(num)} ₽`;
};

export const PaymentMethods = () => {
    const tgId = useTelegramStore((state) => state.tgId);
    const { data: user, loading } = useUserStore((state) => ({
        data: state.data,
        loading: state.loading,
    }));

    const balance = useMemo(() => {
        if (loading && !user) return "Загрузка...";
        return formatBalance(user?.balance);
    }, [loading, user]);

    return (
        <div className={styles.tabContent}>
            <div className={styles.title}>
                <h3 className={styles.subtitle}>Баланс</h3>
                <div className={styles.sum}>{balance}</div>
            </div>
            <div className={styles.paymentMethods}>
                <input
                    className={styles.searchInput}
                    type="text"
                    placeholder="Введите сумму..."
                    disabled={!tgId}
                />
                <Button size="medium" disabled={!tgId}>
                    Пополнить
                </Button>
            </div>
        </div>
    );
};

