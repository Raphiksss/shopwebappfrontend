import { useState, useEffect } from "react";
import { useTelegramStore } from "../../../entities/telegram/model/useTelegramStore";
import styles from "./WebAppWarning.module.css";

export const WebAppWarning = () => {
    const { webApp, isReady } = useTelegramStore();
    const [isDismissed, setIsDismissed] = useState(false);

    // Показываем предупреждение только если:
    // 1. Telegram инициализирован (isReady)
    // 2. WebApp недоступен (не в Telegram)
    // 3. Пользователь не закрыл предупреждение
    const shouldShow = isReady && !webApp && !isDismissed;

    const handleClose = () => {
        setIsDismissed(true);
    };

    if (!shouldShow) return null;

    return (
        <>
            <div className={styles.overlay} onClick={handleClose} />
            <div className={styles.modal}>
                <div className={styles.header}>
                    <svg className={styles.icon} viewBox="0 0 24 24" fill="none">
                        <path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                            fill="currentColor"
                        />
                    </svg>
                    <h2 className={styles.title}>Ограниченный режим</h2>
                </div>

                <p className={styles.message}>
                    Вы просматриваете сайт вне Telegram WebApp.
                    Функции сайта ограничены.
                </p>

                <p className={styles.hint}>
                    Для полного доступа используйте сайт как WebApp в Telegram боте
                </p>

                <button className={styles.button} onClick={handleClose}>
                    Понятно
                </button>
            </div>
        </>
    );
};